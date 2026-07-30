import 'server-only';

import crypto from 'node:crypto';

/**
 * Safaricom Daraja client — M-Pesa STK push (collection) and B2B (settlement).
 *
 * Collection: an STK push asks the customer's phone for their PIN and credits
 * the Cloudwise paybill. Every registration also gets manual paybill + account
 * instructions so a failed or ignored STK push is never a dead end.
 *
 * Settlement: Daraja B2B "BusinessPayBill" moves the collected float from the
 * Cloudwise paybill to Equity's paybill against the Cloudwise account number,
 * which is what makes money land in the bank without anyone touching a phone.
 */

const SANDBOX_BASE = 'https://sandbox.safaricom.co.ke';
const PRODUCTION_BASE = 'https://api.safaricom.co.ke';

export function darajaConfig() {
  const env = (process.env.MPESA_ENVIRONMENT || 'sandbox').toLowerCase();
  return {
    env,
    baseUrl: env === 'production' ? PRODUCTION_BASE : SANDBOX_BASE,
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    shortcode: process.env.MPESA_SHORTCODE || '',
    passkey: process.env.MPESA_PASSKEY || '',
    // The paybill number customers see. Usually the same as `shortcode`, but
    // kept separate because a till/head-office pairing can differ.
    displayPaybill: process.env.MPESA_DISPLAY_PAYBILL || process.env.MPESA_SHORTCODE || '',
    initiatorName: process.env.MPESA_INITIATOR_NAME || '',
    initiatorPassword: process.env.MPESA_INITIATOR_PASSWORD || '',
    securityCredential: process.env.MPESA_SECURITY_CREDENTIAL || '',
    certificate: process.env.MPESA_CERTIFICATE || '',
  };
}

export function isDarajaConfigured() {
  const c = darajaConfig();
  return Boolean(c.consumerKey && c.consumerSecret && c.shortcode && c.passkey);
}

// ---------------------------------------------------------------------------
// Phone numbers
// ---------------------------------------------------------------------------

/**
 * Normalise any Kenyan mobile number to Daraja's 2547XXXXXXXX / 2541XXXXXXXX.
 * Returns null when the input cannot be a Kenyan mobile line.
 */
export function normalisePhone(input) {
  if (!input) return null;
  let digits = String(input).replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);

  if (digits.startsWith('0')) digits = `254${digits.slice(1)}`;
  else if (digits.startsWith('7') || digits.startsWith('1')) digits = `254${digits}`;

  if (!/^254[17]\d{8}$/.test(digits)) return null;
  return digits;
}

/** 0712 658 775 — how we show a number back to the person who typed it. */
export function displayPhone(msisdn) {
  const n = normalisePhone(msisdn);
  if (!n) return String(msisdn || '');
  const local = `0${n.slice(3)}`;
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

// Daraja tokens last an hour. Cache per warm lambda and refresh a minute early.
let tokenCache = { token: null, expiresAt: 0 };

export async function getAccessToken({ force = false } = {}) {
  const c = darajaConfig();
  if (!c.consumerKey || !c.consumerSecret) {
    throw new Error('M-Pesa consumer key/secret are not configured.');
  }

  if (!force && tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const basic = Buffer.from(`${c.consumerKey}:${c.consumerSecret}`).toString('base64');
  const res = await fetch(
    `${c.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${basic}` }, cache: 'no-store' }
  );

  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    throw new Error(
      `Daraja auth failed (${res.status}): ${body.errorMessage || JSON.stringify(body)}`
    );
  }

  const ttlSeconds = Number(body.expires_in || 3599);
  tokenCache = {
    token: body.access_token,
    expiresAt: Date.now() + Math.max(ttlSeconds - 60, 60) * 1000,
  };
  return tokenCache.token;
}

// ---------------------------------------------------------------------------
// Password / timestamp
// ---------------------------------------------------------------------------

/**
 * Daraja's timestamp is yyyyMMddHHmmss in East Africa Time. Vercel runs in UTC,
 * so we shift explicitly rather than trusting the host clock's timezone.
 */
export function darajaTimestamp(now = new Date()) {
  const eat = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${eat.getUTCFullYear()}${pad(eat.getUTCMonth() + 1)}${pad(eat.getUTCDate())}` +
    `${pad(eat.getUTCHours())}${pad(eat.getUTCMinutes())}${pad(eat.getUTCSeconds())}`
  );
}

function stkPassword(timestamp) {
  const c = darajaConfig();
  return Buffer.from(`${c.shortcode}${c.passkey}${timestamp}`).toString('base64');
}

/**
 * The B2B/B2C security credential: the initiator password encrypted with
 * Safaricom's public certificate. Prefer a pre-computed MPESA_SECURITY_CREDENTIAL;
 * otherwise derive it from MPESA_CERTIFICATE + MPESA_INITIATOR_PASSWORD.
 */
export function securityCredential() {
  const c = darajaConfig();
  if (c.securityCredential) return c.securityCredential;
  if (!c.certificate || !c.initiatorPassword) {
    throw new Error(
      'Set MPESA_SECURITY_CREDENTIAL, or MPESA_CERTIFICATE + MPESA_INITIATOR_PASSWORD, to use B2B settlement.'
    );
  }

  // The cert may be stored base64-wrapped (env vars dislike newlines) or as raw PEM.
  const pem = c.certificate.includes('BEGIN CERTIFICATE')
    ? c.certificate.replace(/\\n/g, '\n')
    : Buffer.from(c.certificate, 'base64').toString('utf8');

  const encrypted = crypto.publicEncrypt(
    { key: new crypto.X509Certificate(pem).publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(c.initiatorPassword, 'utf8')
  );
  return encrypted.toString('base64');
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

async function darajaPost(path, payload) {
  const c = darajaConfig();
  const token = await getAccessToken();

  const res = await fetch(`${c.baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

/**
 * Ask the customer's phone for their M-Pesa PIN.
 *
 * `accountReference` is what appears on their statement and is our registration
 * reference — it is also the account number for the manual paybill fallback, so
 * both payment paths reconcile to the same record.
 */
export async function stkPush({ phone, amount, accountReference, description, callbackUrl }) {
  const c = darajaConfig();
  const msisdn = normalisePhone(phone);
  if (!msisdn) throw new Error('That does not look like a Kenyan mobile number.');

  const timestamp = darajaTimestamp();
  const payload = {
    BusinessShortCode: c.shortcode,
    Password: stkPassword(timestamp),
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(Number(amount)),
    PartyA: msisdn,
    PartyB: c.shortcode,
    PhoneNumber: msisdn,
    CallBackURL: callbackUrl,
    // Daraja truncates both of these; keep them short and meaningful.
    AccountReference: String(accountReference).slice(0, 12),
    TransactionDesc: String(description || 'Training fee').slice(0, 13),
  };

  const { ok, status, body } = await darajaPost('/mpesa/stkpush/v1/processrequest', payload);

  if (!ok || body.ResponseCode !== '0') {
    const message =
      body.errorMessage || body.ResponseDescription || `Daraja rejected the request (${status}).`;
    const error = new Error(message);
    error.darajaBody = body;
    error.request = redact(payload);
    throw error;
  }

  return {
    checkoutRequestId: body.CheckoutRequestID,
    merchantRequestId: body.MerchantRequestID,
    customerMessage: body.CustomerMessage,
    request: redact(payload),
    response: body,
  };
}

/**
 * Ask Daraja what happened to an STK push.
 *
 * The safety net for the callback: if a tunnel was down or Safaricom never
 * delivered, the checkout page's polling still resolves the payment from here.
 */
export async function stkQuery(checkoutRequestId) {
  const c = darajaConfig();
  const timestamp = darajaTimestamp();

  const { ok, status, body } = await darajaPost('/mpesa/stkpushquery/v1/query', {
    BusinessShortCode: c.shortcode,
    Password: stkPassword(timestamp),
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  });

  // ResultCode 0 = paid. 1032 = cancelled by user. 1037 = timed out / unreachable.
  // While the prompt is still on screen Daraja answers errorCode 500.001.1001
  // ("transaction is being processed") — that is pending, not a failure.
  if (!ok) {
    const pending = /being processed|500\.001\.1001/i.test(JSON.stringify(body));
    return { state: pending ? 'pending' : 'unknown', raw: body, httpStatus: status };
  }

  const resultCode = String(body.ResultCode ?? '');
  if (resultCode === '0') return { state: 'completed', raw: body, description: body.ResultDesc };
  if (resultCode === '') return { state: 'pending', raw: body };
  return { state: 'failed', raw: body, description: body.ResultDesc };
}

/**
 * Move funds from the Cloudwise paybill to another paybill — used to sweep
 * collections into the Cloudwise bank account via the bank's own paybill.
 */
export async function b2bPayBill({
  amount,
  receiverShortcode,
  accountReference,
  remarks,
  resultUrl,
  timeoutUrl,
}) {
  const c = darajaConfig();

  const payload = {
    Initiator: c.initiatorName,
    SecurityCredential: securityCredential(),
    CommandID: 'BusinessPayBill',
    SenderIdentifierType: '4', // 4 = organisation shortcode
    RecieverIdentifierType: '4', // Safaricom's spelling, not ours
    Amount: Math.round(Number(amount)),
    PartyA: c.shortcode,
    PartyB: String(receiverShortcode),
    AccountReference: String(accountReference).slice(0, 20),
    Requester: '',
    Remarks: String(remarks || 'Settlement').slice(0, 100),
    QueueTimeOutURL: timeoutUrl,
    ResultURL: resultUrl,
  };

  const { ok, status, body } = await darajaPost('/mpesa/b2b/v1/paymentrequest', payload);

  if (!ok || String(body.ResponseCode ?? '') !== '0') {
    const error = new Error(
      body.errorMessage || body.ResponseDescription || `B2B request rejected (${status}).`
    );
    error.darajaBody = body;
    throw error;
  }

  return {
    conversationId: body.ConversationID,
    originatorConversationId: body.OriginatorConversationID,
    request: redact(payload),
    response: body,
  };
}

/**
 * Tell Safaricom where to send notifications for payments made *directly* to
 * the paybill — the fallback path when an STK push never arrives.
 *
 * Run once per environment. Re-running is harmless; Safaricom replaces the
 * stored URLs.
 *
 * `responseType` decides what happens to a payment when our validation URL is
 * unreachable: "Completed" accepts it anyway, "Cancelled" rejects it. We accept,
 * because losing a customer's payment is far worse than an unattributed one we
 * can reconcile by hand.
 */
export async function registerC2bUrls({ confirmationUrl, validationUrl }) {
  const c = darajaConfig();

  const { ok, status, body } = await darajaPost('/mpesa/c2b/v1/registerurl', {
    ShortCode: c.shortcode,
    ResponseType: 'Completed',
    ConfirmationURL: confirmationUrl,
    ValidationURL: validationUrl,
  });

  if (!ok) {
    throw new Error(
      body.errorMessage || body.ResponseDescription || `URL registration failed (${status}).`
    );
  }
  return body;
}

/** Normalise a C2B confirmation into the same shape as an STK callback. */
export function parseC2bConfirmation(body) {
  if (!body?.TransID) return null;

  return {
    transactionId: String(body.TransID),
    // The account number the customer typed — our booking reference.
    reference: String(body.BillRefNumber || '').trim().toUpperCase(),
    amount: Number(body.TransAmount),
    phone: body.MSISDN ? String(body.MSISDN) : undefined,
    payerName: [body.FirstName, body.MiddleName, body.LastName]
      .filter(Boolean)
      .join(' ')
      .trim(),
    transactionTime: body.TransTime ? String(body.TransTime) : undefined,
    shortcode: body.BusinessShortCode ? String(body.BusinessShortCode) : undefined,
  };
}

// ---------------------------------------------------------------------------
// Callback parsing
// ---------------------------------------------------------------------------

/** Flatten Daraja's `CallbackMetadata.Item` array into a plain object. */
export function parseStkCallback(body) {
  const stk = body?.Body?.stkCallback;
  if (!stk) return null;

  const items = stk.CallbackMetadata?.Item || [];
  const meta = {};
  for (const item of items) {
    if (item?.Name !== undefined) meta[item.Name] = item.Value;
  }

  const resultCode = String(stk.ResultCode ?? '');
  return {
    checkoutRequestId: stk.CheckoutRequestID,
    merchantRequestId: stk.MerchantRequestID,
    resultCode,
    resultDescription: stk.ResultDesc,
    succeeded: resultCode === '0',
    amount: meta.Amount,
    receipt: meta.MpesaReceiptNumber,
    phone: meta.PhoneNumber ? String(meta.PhoneNumber) : undefined,
    transactionDate: meta.TransactionDate ? String(meta.TransactionDate) : undefined,
  };
}

/** Never let a passkey-derived password reach the audit log. */
function redact(payload) {
  const clone = { ...payload };
  if (clone.Password) clone.Password = '<redacted>';
  if (clone.SecurityCredential) clone.SecurityCredential = '<redacted>';
  return clone;
}

/**
 * Manual payment instructions shown next to every STK push, so a customer whose
 * prompt never arrives can still pay without contacting us.
 */
export function paybillInstructions(reference) {
  const c = darajaConfig();
  return {
    paybill: c.displayPaybill,
    accountNumber: reference,
    steps: [
      'Open M-Pesa on your phone',
      'Choose Lipa na M-Pesa, then Pay Bill',
      `Enter business number ${c.displayPaybill}`,
      `Enter account number ${reference}`,
      'Enter the amount and your M-Pesa PIN',
    ],
  };
}
