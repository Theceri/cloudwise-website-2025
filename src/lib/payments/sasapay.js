import 'server-only';

/**
 * SasaPay client.
 *
 * Used as an alternative money rail: SasaPay can both collect (STK push to its
 * own merchant code) and settle to a Kenyan bank account via B2C, which is what
 * makes "customer pays, cash appears in Equity" possible on one provider.
 *
 * Endpoints follow developer.sasapay.app, matching the sasapay-test console.
 */

export function sasapayConfig() {
  return {
    baseUrl: (process.env.SASAPAY_BASE_URL || 'https://sandbox.sasapay.app/api/v1').replace(/\/$/, ''),
    clientId: process.env.SASAPAY_CLIENT_ID || '',
    clientSecret: process.env.SASAPAY_CLIENT_SECRET || '',
    merchantCode: process.env.SASAPAY_MERCHANT_CODE || '',
  };
}

export function isSasapayConfigured() {
  const c = sasapayConfig();
  return Boolean(c.clientId && c.clientSecret && c.merchantCode);
}

/** Channel codes for B2C destinations. Equity is 68 — the Cloudwise bank. */
export const SASAPAY_CHANNELS = {
  SASAPAY_WALLET: '0',
  MPESA: '63902',
  AIRTEL: '63903',
  TKASH: '63907',
  KCB: '01',
  COOPERATIVE: '11',
  NCBA: '07',
  STANBIC: '31',
  IM: '57',
  DTB: '63',
  EQUITY: '68',
  FAMILY: '70',
};

let tokenCache = { token: null, expiresAt: 0 };

async function getToken({ force = false } = {}) {
  const c = sasapayConfig();
  if (!c.clientId || !c.clientSecret) {
    throw new Error('SASAPAY_CLIENT_ID / SASAPAY_CLIENT_SECRET are not configured.');
  }
  if (!force && tokenCache.token && Date.now() < tokenCache.expiresAt) return tokenCache.token;

  const basic = Buffer.from(`${c.clientId}:${c.clientSecret}`).toString('base64');
  const res = await fetch(`${c.baseUrl}/auth/token/?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    throw new Error(`SasaPay auth failed (${res.status}): ${JSON.stringify(body).slice(0, 300)}`);
  }

  tokenCache = {
    token: body.access_token,
    expiresAt: Date.now() + Math.max(Number(body.expires_in || 3600) - 60, 60) * 1000,
  };
  return tokenCache.token;
}

async function request(path, { method = 'POST', body } = {}) {
  const c = sasapayConfig();
  const token = await getToken();

  const res = await fetch(`${c.baseUrl}/${path.replace(/^\//, '')}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`SasaPay ${path} failed (${res.status}): ${JSON.stringify(json).slice(0, 300)}`);
  }
  return json;
}

/** C2B collection — an STK push into the SasaPay working account. */
export async function requestPayment({
  phone,
  amount,
  accountReference,
  description,
  callbackUrl,
  networkCode = SASAPAY_CHANNELS.MPESA,
  currency = 'KES',
}) {
  const c = sasapayConfig();
  const payload = {
    MerchantCode: c.merchantCode,
    NetworkCode: String(networkCode),
    PhoneNumber: phone,
    Amount: String(Math.round(Number(amount))),
    Currency: currency,
    AccountReference: accountReference,
    TransactionDesc: description || 'Training fee',
    CallBackURL: callbackUrl,
  };

  const response = await request('payments/request-payment/', { body: payload });
  if (response.status !== true && String(response.ResponseCode ?? '') !== '0') {
    const error = new Error(response.detail || 'SasaPay rejected the payment request.');
    error.sasapayBody = response;
    throw error;
  }

  return {
    checkoutRequestId: response.CheckoutRequestID,
    merchantRequestId: response.MerchantRequestID,
    customerMessage: response.CustomerMessage,
    request: payload,
    response,
  };
}

/**
 * B2C payout — the bank settlement leg. `channel` is the bank code (68 for
 * Equity) and `receiver` the destination account number.
 */
export async function payout({
  amount,
  channel,
  receiver,
  reason,
  merchantTransactionReference,
  callbackUrl,
  currency = 'KES',
}) {
  const c = sasapayConfig();
  const payload = {
    MerchantCode: c.merchantCode,
    Amount: String(Math.round(Number(amount))),
    Currency: currency,
    MerchantTransactionReference: merchantTransactionReference,
    ReceiverNumber: String(receiver),
    Channel: String(channel),
    Reason: reason || 'Settlement',
    CallBackURL: callbackUrl,
  };

  const response = await request('payments/b2c/', { body: payload });
  if (response.status !== true && String(response.ResponseCode ?? '') !== '0') {
    const error = new Error(response.detail || 'SasaPay rejected the payout.');
    error.sasapayBody = response;
    throw error;
  }

  return {
    requestId: response.B2CRequestID || response.ConversationID,
    request: payload,
    response,
  };
}

/** Confirm the destination account exists and read back its registered name. */
export async function validateAccount({ channel, accountNumber }) {
  const c = sasapayConfig();
  return request('accounts/account-validation/', {
    body: {
      MerchantCode: c.merchantCode,
      Channel: String(channel),
      AccountNumber: String(accountNumber),
    },
  });
}

export async function statusQuery({ merchantTransactionReference, checkoutRequestId }) {
  const c = sasapayConfig();
  return request('transactions/status-query/', {
    body: {
      MerchantCode: c.merchantCode,
      ...(merchantTransactionReference
        ? { MerchantTransactionReference: merchantTransactionReference }
        : {}),
      ...(checkoutRequestId ? { CheckoutRequestID: checkoutRequestId } : {}),
    },
  });
}
