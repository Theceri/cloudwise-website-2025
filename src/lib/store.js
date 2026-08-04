import 'server-only';

import { writeClient } from '@/sanity/lib/writeClient';

/**
 * Persistence for registrations and payments.
 *
 * Sanity is the store: the Studio at /studio then doubles as the admin UI for
 * the roster, with no dashboard to build. Every write is keyed off a
 * deterministic document id so a re-delivered webhook patches the existing
 * record rather than creating a duplicate.
 */

export function isStoreConfigured() {
  return Boolean(writeClient.config().token);
}

function assertConfigured() {
  if (!isStoreConfigured()) {
    throw new Error(
      'SANITY_API_WRITE_TOKEN is not set — registrations cannot be saved.'
    );
  }
}

export const registrationId = (reference) => `registration.${reference}`;
export const paymentId = (provider, externalId) =>
  `payment.${provider}.${String(externalId).replace(/[^A-Za-z0-9._-]/g, '_')}`;

// ---------------------------------------------------------------------------
// Registrations
// ---------------------------------------------------------------------------

export async function createRegistration(fields) {
  assertConfigured();
  return writeClient.create({
    _id: registrationId(fields.reference),
    _type: 'trainingRegistration',
    createdAt: new Date().toISOString(),
    status: 'pending',
    emailsSent: [],
    ...fields,
  });
}

export async function getRegistration(reference) {
  assertConfigured();
  return writeClient.getDocument(registrationId(reference));
}

export async function patchRegistration(reference, fields) {
  assertConfigured();
  return writeClient.patch(registrationId(reference)).set(fields).commit();
}

/**
 * Registrations for the admin digest, newest first.
 *
 * `since` is an ISO timestamp; omit it for the full roster.
 */
export async function listRegistrations({ track, cohortId, status, since, limit = 500 } = {}) {
  assertConfigured();

  const clauses = ['_type == "trainingRegistration"'];
  const params = {};
  if (track) {
    clauses.push('track == $track');
    params.track = track;
  }
  if (cohortId) {
    clauses.push('cohortId == $cohortId');
    params.cohortId = cohortId;
  }
  if (status) {
    clauses.push('status == $status');
    params.status = status;
  }
  if (since) {
    clauses.push('createdAt >= $since');
    params.since = since;
  }

  return writeClient.fetch(
    `*[${clauses.join(' && ')}] | order(createdAt desc)[0...${Number(limit)}]{
      reference, status, track, cohortId, cohortLabel, startDate,
      firstName, lastName, email, phone, organization, jobTitle, city, industry,
      attendance, aiExperience, aiTools, timeConsumingTasks, biggestChallenge,
      goal, liveChallenge, dietary, referralSource, whatsappOptIn,
      amount, paymentMethod, paymentReceipt, paidAt,
      settlementState, settlementRef, emailsSent, createdAt
    }`,
    params,
    { cache: 'no-store' }
  );
}

/** Paid registrations whose training starts on a given ISO date. Drives reminders. */
export async function listRegistrationsStartingOn(isoDate) {
  assertConfigured();
  return writeClient.fetch(
    `*[_type == "trainingRegistration" && status == "paid" && startDate == $date]{
      reference, track, cohortId, cohortLabel, startDate, firstName, lastName,
      email, phone, attendance, amount, emailsSent
    }`,
    { date: isoDate },
    { cache: 'no-store' }
  );
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export async function createPayment({ provider, externalId, registrationRef, ...fields }) {
  assertConfigured();
  return writeClient.createOrReplace({
    _id: paymentId(provider, externalId),
    _type: 'trainingPayment',
    provider,
    externalId: String(externalId),
    registrationRef,
    registration: { _type: 'reference', _ref: registrationId(registrationRef), _weak: true },
    status: 'pending',
    settlementState: 'na',
    createdAt: new Date().toISOString(),
    ...fields,
  });
}

export async function getPayment(provider, externalId) {
  assertConfigured();
  return writeClient.getDocument(paymentId(provider, externalId));
}

export async function patchPayment(provider, externalId, fields) {
  assertConfigured();
  return writeClient.patch(paymentId(provider, externalId)).set(fields).commit();
}

/** The most recent payment attempt for a registration, whatever its state. */
export async function latestPaymentFor(reference) {
  assertConfigured();
  return writeClient.fetch(
    `*[_type == "trainingPayment" && registrationRef == $ref] | order(createdAt desc)[0]`,
    { ref: reference },
    { cache: 'no-store' }
  );
}

/**
 * A payment already recorded against this M-Pesa receipt, whatever channel it
 * came in on.
 *
 * One payment can legitimately reach us twice: paying an STK prompt on a
 * paybill produces both an STK callback and a C2B confirmation, carrying the
 * same M-Pesa code as `receipt` on one and `externalId` on the other. They are
 * two notifications about one movement of money, so the second must never be
 * queued for settlement — otherwise the sweep pays the bank twice for a single
 * collection.
 */
export async function findPaymentByReceipt(receipt, { excludeId } = {}) {
  assertConfigured();
  if (!receipt) return null;
  return writeClient.fetch(
    `*[_type == "trainingPayment" && (receipt == $receipt || externalId == $receipt)
       && status in ["completed", "partial"]
       && _id != $excludeId] | order(createdAt asc)[0]`,
    { receipt: String(receipt), excludeId: excludeId || '-' },
    { cache: 'no-store' }
  );
}

/**
 * Completed payments still owing a sweep to the bank.
 *
 * `pending` means the collection confirmed but the sweep has not been attempted
 * — normally because settlement was switched off at the time. `failed` is
 * straightforwardly retryable. `queued` is only included once stale: a fresh
 * `queued` means another worker is mid-request, but one sitting there for half
 * an hour means the process died between claiming the sweep and sending it.
 */
export async function listUnsettledPayments({ limit = 50, staleMinutes = 30 } = {}) {
  assertConfigured();
  const staleBefore = new Date(Date.now() - staleMinutes * 60000).toISOString();

  return writeClient.fetch(
    `*[_type == "trainingPayment" && status == "completed" && (
        settlementState in ["pending", "failed"] ||
        (settlementState == "queued" && _updatedAt < $staleBefore)
      )] | order(createdAt asc)[0...${Number(limit)}]`,
    { staleBefore },
    { cache: 'no-store' }
  );
}

// ---------------------------------------------------------------------------
// One-shot claims
// ---------------------------------------------------------------------------

/**
 * Atomically claim `key`, returning true only for the caller that won.
 *
 * `create` with an explicit `_id` is rejected by Sanity when the document
 * already exists, so the first caller gets true and every later one gets
 * false. Used to make emails and settlement sweeps exactly-once even when a
 * provider re-delivers a webhook.
 */
export async function claimOnce(key) {
  assertConfigured();
  const id = `lock.${String(key).replace(/[^A-Za-z0-9._-]/g, '_')}`;
  try {
    await writeClient.create({
      _id: id,
      _type: 'systemLock',
      key: String(key),
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    // 409 Conflict means someone else already claimed it — the expected path.
    if (err?.statusCode === 409 || /already exist/i.test(err?.message || '')) return false;
    throw err;
  }
}

/** Release a claim so the action can be retried (used when a send fails). */
export async function releaseClaim(key) {
  if (!isStoreConfigured()) return;
  const id = `lock.${String(key).replace(/[^A-Za-z0-9._-]/g, '_')}`;
  try {
    await writeClient.delete(id);
  } catch {
    // Best effort — a stale lock only costs us one skipped retry.
  }
}

/** Record that a lifecycle email went out, for display in the Studio. */
export async function recordEmailSent(reference, key) {
  assertConfigured();
  return writeClient
    .patch(registrationId(reference))
    .setIfMissing({ emailsSent: [] })
    .append('emailsSent', [key])
    .commit();
}
