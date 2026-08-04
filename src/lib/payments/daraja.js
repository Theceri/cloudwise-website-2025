import 'server-only';

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { normaliseReference } from '@/lib/training';

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
    // The only secret in the settlement flow. The certificate it is encrypted
    // against is a public file in the repo root — see certificateFile().
    initiatorPassword: process.env.MPESA_INITIATOR_PASSWORD || '',
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
//
// Keyed by environment + consumer key, because a token is only valid against
// the base URL that minted it. Without the key, flipping MPESA_ENVIRONMENT on a
// running dev server hands a still-unexpired sandbox token to production, and
// Daraja answers "Invalid Access Token" — an auth error that no amount of
// checking your credentials will explain.
let tokenCache = { key: null, token: null, expiresAt: 0 };

export async function getAccessToken({ force = false } = {}) {
  const c = darajaConfig();
  if (!c.consumerKey || !c.consumerSecret) {
    throw new Error('M-Pesa consumer key/secret are not configured.');
  }

  const cacheKey = `${c.env}:${c.consumerKey}`;
  if (!force && tokenCache.token && tokenCache.key === cacheKey && Date.now() < tokenCache.expiresAt) {
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
    key: cacheKey,
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
 * Which of Safaricom's certificates to encrypt against.
 *
 * They publish one per environment and they are NOT interchangeable — a
 * sandbox-encrypted credential is rejected in production and vice versa, with
 * an error that does not mention certificates at all.
 *
 * Both files live in the repo root. That is safe: these are Safaricom's PUBLIC
 * keys, downloaded by every integrator from developer.safaricom.co.ke. The only
 * secret in this flow is MPESA_INITIATOR_PASSWORD, which stays in the environment.
 */
export function certificateFile() {
  const { env } = darajaConfig();
  return env === 'production' ? 'ProductionCertificate.cer' : 'SandboxCertificate.cer';
}

// Parsing the certificate costs a few milliseconds and the file never changes
// between deploys, so keep the public key for the life of the lambda.
let publicKeyCache = { file: null, key: null };

function certificatePublicKey() {
  const file = certificateFile();
  if (publicKeyCache.file === file && publicKeyCache.key) return publicKeyCache.key;

  // process.cwd() is the deployment root on Vercel and the project root locally.
  // next.config.mjs traces these files into the settlement route's bundle;
  // without that they exist in the repo but not in the deployed function.
  const certPath =
    file === 'ProductionCertificate.cer'
      ? path.join(process.cwd(), 'ProductionCertificate.cer')
      : path.join(process.cwd(), 'SandboxCertificate.cer');

  let raw;
  try {
    raw = fs.readFileSync(certPath);
  } catch {
    throw new Error(
      `Safaricom certificate not found at ${certPath}. Download ${file} from ` +
        'https://developer.safaricom.co.ke/APIs/Credentials and put it in the project root.'
    );
  }

  // Node's X509Certificate takes a Buffer and accepts PEM or DER, so both of
  // Safaricom's download formats work without us sniffing the encoding.
  let key;
  try {
    key = new crypto.X509Certificate(raw).publicKey;
  } catch (err) {
    throw new Error(
      `${file} is not a readable certificate (${err.message}). Re-download it — ` +
        'a truncated or HTML-error-page download is the usual cause.'
    );
  }

  publicKeyCache = { file, key };
  return key;
}

/**
 * The B2B/B2C security credential: the initiator password encrypted with
 * Safaricom's public certificate, base64-encoded.
 *
 * Computed fresh on every call from the certificate on disk plus
 * MPESA_INITIATOR_PASSWORD — the same shape as the thrivecap backend, so
 * rotating the password means changing one environment variable.
 *
 * Throws rather than returning an error string: the return value goes straight
 * into a request that moves money, and a placeholder like "Certificate file not
 * found" would be sent to Safaricom as if it were a real credential, producing
 * a rejection that names neither the certificate nor the password.
 *
 * The output differs on every call even for the same password — PKCS#1 v1.5
 * padding is randomised by design. That is expected, not a bug.
 */
export function securityCredential() {
  const { initiatorPassword } = darajaConfig();

  if (!initiatorPassword) {
    throw new Error('MPESA_INITIATOR_PASSWORD is not set — required for B2B settlement.');
  }

  const encrypted = crypto.publicEncrypt(
    { key: certificatePublicKey(), padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(initiatorPassword, 'utf8')
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

  // v2, not v1: both answer, but only v2 includes MpesaReceiptNumber, which is
  // the M-Pesa code the customer sees. Without it a payment reconciled by this
  // query has no receipt to show or match a statement against.
  const { ok, status, body } = await darajaPost('/mpesa/stkpushquery/v2/query', {
    BusinessShortCode: c.shortcode,
    Password: stkPassword(timestamp),
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  });

  const resultCode = String(body.ResultCode ?? '');
  const description = body.ResultDesc || body.errorMessage || '';

  if (ok && resultCode === '0') {
    return {
      state: 'completed',
      raw: body,
      description,
      receipt: body.MpesaReceiptNumber || null,
    };
  }

  /**
   * Only these end the attempt. Everything else is treated as still pending.
   *
   * This asymmetry is deliberate. Reporting "failed" is not a neutral guess:
   * it emails the customer to say their payment did not go through and stops
   * the checkout page polling. Doing that to someone who has actually paid is
   * far worse than leaving a spinner up a little longer, and the callback, the
   * C2B confirmation and the next poll all remain able to resolve it.
   *
   * The bug this replaces: Daraja answers a still-in-flight push with
   * "The transaction is still under processing", which the old code matched
   * against the phrase "being processed", missed, and so filed as a failure —
   * marking a successful payment failed and emailing the payer to say so.
   */
  const TERMINAL = {
    1: 'Insufficient M-Pesa balance.',
    1019: 'The request expired before it was completed.',
    1032: 'The prompt was cancelled.',
    1037: 'The phone could not be reached, or the prompt timed out.',
    2001: 'The M-Pesa PIN entered was wrong.',
  };

  if (ok && Object.prototype.hasOwnProperty.call(TERMINAL, resultCode)) {
    return { state: 'failed', raw: body, description: description || TERMINAL[resultCode] };
  }

  // Unrecognised, still processing, or the query itself failed — keep waiting.
  return { state: 'pending', raw: body, description, httpStatus: status };
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

  // v2, not v1: v1 still exists but rejects every production token with
  // "401.003.01 Error Occurred - Invalid Access Token", which reads like an
  // auth problem and is not one. v2 accepts the same token.
  const { ok, status, body } = await darajaPost('/mpesa/c2b/v2/registerurl', {
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

  const typedReference = String(body.BillRefNumber || '').trim();

  return {
    transactionId: String(body.TransID),
    // The account number the customer typed, normalised to our canonical form —
    // "a7f3k2" and "A7F 3K2" are the same booking, and losing a payment to a
    // stray space is not a trade worth making.
    reference: normaliseReference(typedReference) || typedReference.toUpperCase(),
    // Kept verbatim so an unmatched payment can show what was actually entered.
    typedReference,
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
 * Whether to offer the paybill as a fallback at all.
 *
 * The fallback only works if Safaricom is actually delivering C2B confirmations
 * to us, and that is not something the code can check: registration is one-shot
 * on a live shortcode, there is no read-back endpoint, and a stale registration
 * fails silently — the customer pays, the money arrives, and nothing tells us.
 *
 * So it is a switch. Set PAYBILL_FALLBACK_ENABLED=false and checkout offers the
 * STK prompt alone, with no paybill number on screen and none in the emails.
 * Better to show one route that works than two where the second quietly eats
 * payments. Turn it back on once Safaricom confirms the registered URLs point
 * at the live domain.
 */
export function isPaybillFallbackEnabled() {
  const flag = String(process.env.PAYBILL_FALLBACK_ENABLED || '').trim().toLowerCase();
  if (flag === 'false' || flag === '0' || flag === 'off') return false;
  return isDarajaConfigured();
}

/**
 * Manual payment instructions shown next to every STK push, so a customer whose
 * prompt never arrives can still pay without contacting us.
 *
 * Returns null when the fallback is switched off, so every caller — checkout
 * page and email templates alike — drops the paybill by doing nothing special.
 */
export function paybillInstructions(reference) {
  if (!isPaybillFallbackEnabled()) return null;

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
