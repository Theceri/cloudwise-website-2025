import 'server-only';

import { normalisePhone } from '@/lib/payments/daraja';
import { claimOnce, releaseClaim } from '@/lib/store';
import { TRACKS, chargeFor, getCohort, getKickstartSession, priceFor } from '@/lib/training';
import { writeClient } from '@/sanity/lib/writeClient';

/**
 * Credits: what a buyer paid for a smaller class counts toward a bigger one.
 *
 *   Kickstart  Ksh 500   → off Essentials or the Programme, until 14 days after
 *                          the Kickstart session.
 *   Essentials Ksh 5,500 → off the Programme, until 60 days after the
 *                          Essentials Saturday. Day Two then costs Ksh 8,000.
 *
 * A credit is worth the LIST price of the class bought, not what was paid after
 * an earlier credit, so the whole ladder never costs more than Ksh 13,500.
 * One credit per booking; credits do not stack.
 *
 * The life of a credit:
 *
 *   available ──reserve──▶ reserved ──payment──▶ redeemed
 *       ▲                     │
 *       └──────release────────┘   (booking abandoned for 48 hours, or its date passed)
 *   available ──expiry──▶ expired
 *
 * Every transition that must happen once goes through `claimOnce`, the same
 * lock that keeps webhook re-deliveries from sending two emails.
 *
 * Evidence: every credit keeps the M-Pesa code (or Paystack reference) of the
 * payment that earned it, so a buyer can quote the code from their SMS instead
 * of the credit code, and an admin can trace any credit to real money.
 */

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // no 0/O/1/I, as booking references
const RESERVATION_HOURS = 48;

export const creditId = (code) => `credit.${code}`;

function newCode() {
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  return `CR-${Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')}`;
}

/** 23:59:59 East Africa Time on the given ISO day, as an ISO timestamp. */
function endOfDayEat(isoDay) {
  // 23:59:59 at UTC+3 is 20:59:59 UTC on the same calendar day.
  return new Date(`${isoDay}T20:59:59Z`).toISOString();
}

function addDays(isoDay, days) {
  const d = new Date(`${isoDay}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The date of the class a booking is for: the Kickstart Wednesday or the Essentials Saturday. */
function classDateFor(registration) {
  if (registration.track === 'kickstart') return getKickstartSession(registration.cohortId)?.date || null;
  return getCohort(registration.cohortId)?.dayOne || null;
}

/**
 * Issue the credit a paid Kickstart or Essentials booking earns. Called from
 * `onPaymentConfirmed`. Exactly once per booking, however many times the
 * payment webhook is delivered.
 */
export async function issueCreditFor(registration) {
  const rule = TRACKS[registration?.track]?.credit;
  if (!rule) return { issued: false, reason: 'track earns no credit' };
  if (!(await claimOnce(`credit-issue.${registration.reference}`))) {
    return { issued: false, reason: 'already issued' };
  }

  const classDate = classDateFor(registration) || new Date().toISOString().slice(0, 10);
  const doc = {
    _type: 'trainingCredit',
    code: newCode(),
    status: 'available',
    amountKes: rule.amountKes,
    appliesTo: rule.appliesTo,
    phone: normalisePhone(registration.phone) || registration.phone,
    email: String(registration.email || '').toLowerCase(),
    name: [registration.firstName, registration.lastName].filter(Boolean).join(' '),
    sourceMethod: registration.paymentMethod || 'mpesa-stk',
    sourceReceipt: String(registration.paymentReceipt || registration.reference).toUpperCase(),
    sourceReference: registration.reference,
    classDate,
    expiresAt: endOfDayEat(addDays(classDate, rule.days)),
    createdAt: new Date().toISOString(),
  };

  try {
    const created = await writeClient.create({ _id: creditId(doc.code), ...doc });
    return { issued: true, credit: created };
  } catch (err) {
    // Let a later delivery try again rather than leaving the buyer without it.
    await releaseClaim(`credit-issue.${registration.reference}`);
    throw err;
  }
}

/** The credit a booking earned, if any — for the follow-up email and admin alert. */
export async function creditEarnedBy(reference) {
  return writeClient.fetch(
    `*[_type == "trainingCredit" && sourceReference == $reference][0]`,
    { reference },
    { cache: 'no-store' }
  );
}

/**
 * Find a usable credit for a booking.
 *
 * With a `code`: the code may be the credit code (CR-7F3K2M) or the M-Pesa code
 * of the payment that earned it. Either way the credit's phone or email must
 * match the person booking, so a code read off someone else's SMS is useless.
 *
 * Without a code: the best available credit for the person's phone or email.
 * This lookup only ever happens on the server, at booking time, and its result
 * is shown only on that person's own checkout page.
 */
export async function findCredit({ code, phone, email, track, now = new Date() }) {
  const msisdn = normalisePhone(phone) || null;
  const mail = String(email || '').trim().toLowerCase() || null;
  if (!msisdn && !mail) return null;

  const params = { track, now: now.toISOString(), phone: msisdn || '', email: mail || '' };
  const owner = '(phone == $phone || (email != "" && email == $email))';
  const usable = `_type == "trainingCredit" && status == "available" && expiresAt > $now && $track in appliesTo`;

  if (code) {
    params.code = String(code).trim().toUpperCase().replace(/\s+/g, '');
    return writeClient.fetch(
      `*[${usable} && (code == $code || sourceReceipt == $code) && ${owner}][0]`,
      params,
      { cache: 'no-store' }
    );
  }

  return writeClient.fetch(
    `*[${usable} && ${owner}] | order(amountKes desc, expiresAt asc)[0]`,
    params,
    { cache: 'no-store' }
  );
}

/** Hold a credit for one unpaid booking. Returns false if another booking holds it. */
export async function reserveCredit(credit, reference) {
  if (!(await claimOnce(`credit-reserve.${credit.code}`))) return false;
  await writeClient
    .patch(creditId(credit.code))
    .set({ status: 'reserved', reservedBy: reference, reservedAt: new Date().toISOString() })
    .commit();
  return true;
}

/** The booking was paid: the credit is spent. */
export async function redeemCredit(registration) {
  const code = registration?.creditApplied?.code;
  if (!code) return { redeemed: false };
  await writeClient
    .patch(creditId(code))
    .set({ status: 'redeemed', redeemedBy: registration.reference, redeemedAt: new Date().toISOString() })
    .commit();
  return { redeemed: true, code };
}

/** The booking was abandoned: give the credit back, if it has not expired. */
export async function releaseCredit(registration, { now = new Date() } = {}) {
  const code = registration?.creditApplied?.code;
  if (!code) return { released: false };
  const credit = await writeClient.getDocument(creditId(code));
  if (!credit || credit.status !== 'reserved' || credit.reservedBy !== registration.reference) {
    return { released: false };
  }
  const expired = new Date(credit.expiresAt) <= now;
  await writeClient
    .patch(creditId(code))
    .set({ status: expired ? 'expired' : 'available' })
    .unset(['reservedBy', 'reservedAt'])
    .commit();
  await releaseClaim(`credit-reserve.${code}`);
  return { released: true, code };
}

/** Should this unpaid booking give its credit back? */
export function reservationLapsed(registration, { now = new Date() } = {}) {
  if (!registration?.creditApplied?.code || registration.status !== 'pending') return false;
  const created = new Date(registration.createdAt || 0).getTime();
  const lapsed = now.getTime() - created > RESERVATION_HOURS * 3600 * 1000;
  const datePassed = registration.startDate && registration.startDate < now.toISOString().slice(0, 10);
  return lapsed || Boolean(datePassed);
}

/** Mark every available credit past its date as expired. Returns how many. */
export async function expireCredits({ now = new Date() } = {}) {
  const ids = await writeClient.fetch(
    `*[_type == "trainingCredit" && status == "available" && expiresAt <= $now]._id`,
    { now: now.toISOString() },
    { cache: 'no-store' }
  );
  for (const id of ids) {
    await writeClient.patch(id).set({ status: 'expired' }).commit();
  }
  return ids.length;
}

/** Available credits that end in exactly `days` days, for the reminder email. */
export async function creditsExpiringIn(days, { now = new Date() } = {}) {
  const day = addDays(now.toISOString().slice(0, 10), days);
  return writeClient.fetch(
    `*[_type == "trainingCredit" && status == "available" && expiresAt >= $from && expiresAt <= $to]`,
    { from: `${day}T00:00:00Z`, to: `${day}T23:59:59Z` },
    { cache: 'no-store' }
  );
}

/**
 * What a booking costs after a credit. Never below Ksh 1, since M-Pesa cannot
 * take zero. In test mode the token amount is charged whatever the credit.
 */
export function priceAfterCredit({ track, credit }) {
  const charge = chargeFor(track);
  if (charge !== priceFor(track)) return charge; // test mode
  return Math.max(charge - (credit?.amountKes || 0), 1);
}
