import 'server-only';

import crypto from 'node:crypto';

/**
 * Paystack client — cards only.
 *
 * Paystack can also do M-Pesa, but we deliberately restrict `channels` to
 * `card`: M-Pesa runs through Daraja on the Cloudwise paybill so that
 * collections land somewhere we can sweep to the bank ourselves.
 */

const API = 'https://api.paystack.co';

export function paystackConfig() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  return {
    secretKey,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    isTest: secretKey.startsWith('sk_test_'),
  };
}

export function isPaystackConfigured() {
  return Boolean(paystackConfig().secretKey);
}

async function paystackRequest(path, { method = 'GET', body } = {}) {
  const { secretKey } = paystackConfig();
  if (!secretKey) throw new Error('PAYSTACK_SECRET_KEY is not configured.');

  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status !== true) {
    throw new Error(json.message || `Paystack request failed (${res.status}).`);
  }
  return json.data;
}

/**
 * Create a hosted checkout session.
 *
 * Paystack works in the currency's minor unit, so KES amounts are multiplied by
 * 100 here and nowhere else.
 */
export async function initializeTransaction({
  email,
  amountKes,
  reference,
  callbackUrl,
  metadata = {},
}) {
  const data = await paystackRequest('/transaction/initialize', {
    method: 'POST',
    body: {
      email,
      amount: Math.round(Number(amountKes) * 100),
      currency: 'KES',
      reference,
      callback_url: callbackUrl,
      channels: ['card'],
      metadata,
    },
  });

  return {
    authorizationUrl: data.authorization_url,
    accessCode: data.access_code,
    reference: data.reference,
  };
}

/** Authoritative check on a transaction — used on return from checkout. */
export async function verifyTransaction(reference) {
  const data = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
  return {
    succeeded: data.status === 'success',
    status: data.status,
    amountKes: Number(data.amount || 0) / 100,
    currency: data.currency,
    reference: data.reference,
    channel: data.channel,
    paidAt: data.paid_at,
    gatewayResponse: data.gateway_response,
    metadata: data.metadata,
    raw: data,
  };
}

/**
 * Verify a webhook came from Paystack: HMAC-SHA512 of the *raw* body keyed with
 * the secret key. The body must not be re-serialised before hashing — a
 * round-trip through JSON.parse changes key order and breaks the digest.
 */
export function verifyWebhookSignature(rawBody, signature) {
  const { secretKey } = paystackConfig();
  if (!secretKey || !signature) return false;

  const expected = crypto.createHmac('sha512', secretKey).update(rawBody, 'utf8').digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signature), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
