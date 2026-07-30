import { NextResponse } from 'next/server';

import { sendOnce } from '@/lib/email/send';
import { completionPack, reminder } from '@/lib/email/templates';
import { isAuthorisedJob } from '@/lib/security';
import { maybeSettle } from '@/lib/settlement';
import { listRegistrations, listUnsettledPayments } from '@/lib/store';
import { daysUntil, endDateFor } from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * The daily housekeeping run (09:00 East Africa Time).
 *
 * Three jobs, deliberately in one route: Vercel's Hobby plan allows a small
 * number of cron entries, and none of these needs its own schedule.
 *
 *   1. Reminders — 3 days out and the day before.
 *   2. Follow-up pack — the day after training finishes.
 *   3. Settlement retries — any sweep to the bank that failed or stalled.
 *
 * Every send is claimed through `sendOnce`, so a manual trigger, a retry, or an
 * overlapping run cannot double-send.
 */
export async function GET(request) {
  if (!isAuthorisedJob(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const now = new Date();
  const summary = { reminders: 0, followUps: 0, settlementsRetried: 0, errors: [] };

  let paid = [];
  try {
    paid = await listRegistrations({ status: 'paid', limit: 500 });
  } catch (err) {
    summary.errors.push(`roster: ${err?.message}`);
    return NextResponse.json(summary, { status: 500 });
  }

  for (const registration of paid) {
    try {
      const daysOut = daysUntil(registration.startDate, { now });

      // Reminders. Exact-day matches only, so a job that misses a day does not
      // fire a stale "3 days to go" for something that already happened.
      if (daysOut === 3 || daysOut === 1) {
        const result = await sendOnce({
          reference: registration.reference,
          key: `reminder-${daysOut}d`,
          to: registration.email,
          ...reminder({ registration, daysOut }),
        });
        if (result.ok) summary.reminders += 1;
      }

      // Follow-up pack, the morning after the last session.
      const endDate = endDateFor({ track: registration.track, cohortId: registration.cohortId });
      if (daysUntil(endDate, { now }) === -1) {
        const result = await sendOnce({
          reference: registration.reference,
          key: 'completion-pack',
          to: registration.email,
          ...completionPack({ registration }),
        });
        if (result.ok) summary.followUps += 1;
      }
    } catch (err) {
      summary.errors.push(`${registration.reference}: ${err?.message}`);
    }
  }

  // Retry money that never made it to the bank. The query only returns sweeps
  // that failed or have been stuck long enough to be certainly abandoned, so
  // forcing past the state guard here cannot cut in front of a live request.
  try {
    for (const payment of await listUnsettledPayments({ limit: 50 })) {
      const result = await maybeSettle(payment, { force: true });
      if (result.settled) summary.settlementsRetried += 1;
    }
  } catch (err) {
    summary.errors.push(`settlement: ${err?.message}`);
  }

  return NextResponse.json({ ok: true, ranAt: now.toISOString(), ...summary });
}
