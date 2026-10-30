import 'server-only';

import crypto from 'node:crypto';

import { SITE_URL } from '@/lib/constants';
import { confirmPayment } from '@/lib/lifecycle';
import { normalisePhone } from '@/lib/payments/daraja';
import {
  createPayment,
  findPaymentByReceipt,
  getPayment,
  patchPayment,
  paymentId,
  registrationId,
} from '@/lib/store';
import { writeClient } from '@/sanity/lib/writeClient';

/**
 * Catching paybill payments that do not carry a booking reference.
 *
 * From October 2026 the WhatsApp team asks people to pay paybill 4131947
 * themselves, with their name as the account number, because many refuse an
 * M-Pesa prompt they did not expect. A name is not a booking reference, so the
 * exact match in the C2B webhook misses these payments. This module finds the
 * booking another way, and when it cannot be sure it asks a person, with a
 * signed one-click link, rather than guessing with someone's money.
 *
 * Matching, strongest first:
 *   1. The buyer typed this M-Pesa code at checkout ("I have paid").
 *   2. The paying phone is the booking's phone. Safaricom sends the phone as
 *      digits, masked ("2547 ***** 126") or as a SHA-256 hash, depending on the
 *      account; all three are compared.
 *   3. The account number or the M-Pesa name matches the booking's name.
 * Only unpaid bookings from the last 21 days, for the same amount, qualify.
 */

const RECEIPT_RE = /^[A-Z0-9]{10}$/;
const MATCH_WINDOW_DAYS = 21;

export function normaliseReceipt(input) {
  const code = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return RECEIPT_RE.test(code) ? code : null;
}

function nameTokens(...parts) {
  return new Set(
    parts
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 3)
  );
}

const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');

/** 3 for a sure phone match, 1 for a masked one that fits, 0 otherwise. */
function phoneScore(paidFrom, bookingPhone) {
  const phone = normalisePhone(bookingPhone || '');
  if (!paidFrom || !phone) return 0;
  const raw = String(paidFrom).trim();
  if (/^[a-f0-9]{64}$/i.test(raw)) return sha256(phone) === raw.toLowerCase() ? 3 : 0;
  const digits = normalisePhone(raw);
  if (digits) return digits === phone ? 3 : 0;
  const masked = raw.replace(/\s/g, '');
  const m = /^(\d{3,6})\*+(\d{2,4})$/.exec(masked);
  if (m && phone.startsWith(m[1]) && phone.endsWith(m[2])) return 1;
  return 0;
}

/**
 * The booking a paybill payment most likely belongs to.
 *
 * Returns { registration, how } when one booking clearly wins, or
 * { registration: null, candidates } with the closest few for a person to pick.
 */
export async function findBookingForPayment({ receipt, typedReference, payerName, phone, amount }) {
  if (receipt) {
    const claimed = await writeClient.fetch(
      `*[_type == "trainingRegistration" && paybillClaim.receipt == $receipt][0]`,
      { receipt },
      { cache: 'no-store' }
    );
    if (claimed) return { registration: claimed, how: 'the M-Pesa code the buyer entered at checkout' };
  }

  const since = new Date(Date.now() - MATCH_WINDOW_DAYS * 86400000).toISOString();
  const pending = await writeClient.fetch(
    `*[_type == "trainingRegistration" && status != "paid" && createdAt >= $since && amount <= $amount]
      | order(createdAt desc)[0...300]`,
    { since, amount: Number(amount) || 0 },
    { cache: 'no-store' }
  );

  const paidTokens = nameTokens(typedReference, payerName);
  const typedPhone = normalisePhone(String(typedReference || ''));

  const scored = pending
    .map((reg) => {
      let score = phoneScore(phone, reg.phone);
      const why = [];
      if (score === 3) why.push('the paying phone number');
      if (score === 1) why.push('a masked phone number that fits');
      if (typedPhone && typedPhone === normalisePhone(reg.phone || '')) {
        score += 3;
        why.push('the phone number typed as the account');
      }
      const regTokens = nameTokens(reg.firstName, reg.lastName);
      const shared = [...paidTokens].filter((t) => regTokens.has(t)).length;
      if (shared) {
        score += Math.min(shared, 2);
        why.push(`${shared} matching name${shared > 1 ? 's' : ''}`);
      }
      // Paying the exact price of this booking is weak evidence on its own.
      if (Number(reg.amount) === Number(amount)) score += 0.5;
      return { reg, score, why };
    })
    .filter((c) => c.score >= 1)
    .sort((a, b) => b.score - a.score);

  const [best, second] = scored;
  const clearWinner = best && best.score >= 2.5 && (!second || best.score - second.score >= 1);
  if (clearWinner) return { registration: best.reg, how: best.why.join(' and ') };

  return { registration: null, candidates: scored.slice(0, 5).map((c) => ({ registration: c.reg, why: c.why })) };
}

/**
 * Record a paybill payment against a booking and confirm the seat, exactly as
 * a matched C2B confirmation would. Safe to repeat: the M-Pesa code is the
 * payment's id, and confirmPayment counts each code once.
 *
 * An earlier "unmatched" record for the same code is attached to the booking
 * instead of a second record being written.
 */
export async function applyPaybillPayment({ registration, receipt, amount, phone, note }) {
  const paid = Number(amount ?? registration.amount);
  if (paid < Number(registration.amount)) {
    return { ok: false, reason: `Part payment: ${paid} of ${registration.amount}. Confirm by hand.` };
  }

  const existing = await getPayment('mpesa-c2b', receipt);
  const elsewhere = await findPaymentByReceipt(receipt, { excludeId: paymentId('mpesa-c2b', receipt) });
  const settlementState = elsewhere ? 'skipped' : 'pending';

  if (existing && existing.status !== 'unmatched' && existing.registrationRef !== registration.reference) {
    return { ok: false, reason: `This M-Pesa code is already recorded for booking ${existing.registrationRef}.` };
  }

  if (existing) {
    await patchPayment('mpesa-c2b', receipt, {
      registrationRef: registration.reference,
      registration: { _type: 'reference', _ref: registrationId(registration.reference), _weak: true },
      status: 'completed',
      settlementState: existing.status === 'unmatched' ? settlementState : existing.settlementState,
      resultDescription: `${existing.resultDescription || 'Paybill payment'}. Matched to ${registration.reference}${note ? `: ${note}` : ''}`,
    });
  } else {
    await createPayment({
      provider: 'mpesa-c2b',
      externalId: receipt,
      registrationRef: registration.reference,
      amount: paid,
      phone: phone || registration.phone || '',
      receipt,
      status: 'completed',
      resultDescription: `Paybill payment matched to the booking${note ? `: ${note}` : ''}`,
      completedAt: new Date().toISOString(),
      settlementState,
    });
  }

  if (registration.status === 'paid') return { ok: true, alreadyPaid: true };

  const result = await confirmPayment({
    registration,
    payment: {
      provider: 'mpesa-c2b',
      externalId: receipt,
      registrationRef: registration.reference,
      amount: paid,
      status: 'completed',
      settlementState,
      receipt,
    },
    method: 'mpesa-c2b',
    receipt,
  });
  return { ok: true, confirmed: !result.alreadyPaid && !result.alreadyCounted };
}

// ---------------------------------------------------------------------------
// Signed links: an admin confirms a payment from the email in one click
// ---------------------------------------------------------------------------

const LINK_DAYS = 14;

function secret() {
  const s = process.env.CRON_SECRET;
  if (!s) throw new Error('CRON_SECRET is not set, so payment links cannot be signed.');
  return s;
}

function sign(body) {
  return crypto.createHmac('sha256', secret()).update(`paybill-approve.${body}`).digest('base64url');
}

/** A link that opens a confirmation page for this booking and M-Pesa code. */
export function approveLink({ reference, receipt, amount }) {
  const body = Buffer.from(
    JSON.stringify({ r: reference, c: receipt, a: Number(amount) || null, e: Date.now() + LINK_DAYS * 86400000 })
  ).toString('base64url');
  return `${SITE_URL}/payments/approve?t=${body}.${sign(body)}`;
}

/** The booking and M-Pesa code a link names, or null if it is forged or expired. */
export function readApproveToken(token) {
  const [body, mac] = String(token || '').split('.');
  if (!body || !mac) return null;
  const expected = sign(body);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!data?.r || !normaliseReceipt(data.c) || Date.now() > Number(data.e)) return null;
    return { reference: data.r, receipt: data.c, amount: data.a };
  } catch {
    return null;
  }
}

/** Paybill payments nobody has matched yet, newest first. For the daily round-up. */
export async function listUnmatchedPayments({ days = 14 } = {}) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  return writeClient.fetch(
    `*[_type == "trainingPayment" && status == "unmatched" && createdAt >= $since] | order(createdAt desc)[0...50]{
      externalId, amount, phone, registrationRef, resultDescription, createdAt
    }`,
    { since },
    { cache: 'no-store' }
  );
}
