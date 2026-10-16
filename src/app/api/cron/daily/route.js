import { NextResponse } from 'next/server';

import {
  creditEarnedBy,
  creditsExpiringIn,
  expireCredits,
  releaseCredit,
  reservationLapsed,
} from '@/lib/credits';
import { sendEmail, sendOnce } from '@/lib/email/send';
import { completionPack, creditExpiring, reminder } from '@/lib/email/templates';
import { isAuthorisedJob } from '@/lib/security';
import { maybeSettle, settleBatch, settlementConfig } from '@/lib/settlement';
import { claimOnce, listRegistrations, listUnsettledPayments } from '@/lib/store';
import { pingIndexNow } from '@/lib/indexnow';
import { TRACK_KICKSTART, daysUntil, endDateFor, listKickstartSessions, listOpenCohorts } from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * The daily housekeeping run (09:00 East Africa Time).
 *
 * The jobs, deliberately in one route: Vercel's Hobby plan allows a small
 * number of cron entries, and none of these needs its own schedule.
 *
 *   1. Reminders — 3 days out and the day before; Kickstart also on the day,
 *      because the session is at 7pm and this runs at 9am.
 *   2. Follow-up pack — the day after training finishes, with the credit code
 *      a Kickstart or Essentials booking earned.
 *   3. Credits — give back credits held by bookings abandoned for 48 hours,
 *      expire old ones, and remind holders 3 days before a credit ends.
 *   4. Settlement — on SETTLEMENT_SCHEDULE=daily, one sweep of everything
 *      unsettled; otherwise retries of any per-payment sweep that failed.
 *
 * Every send is claimed through `sendOnce`, so a manual trigger, a retry, or an
 * overlapping run cannot double-send.
 */
export async function GET(request) {
  if (!isAuthorisedJob(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const now = new Date();
  const summary = {
    reminders: 0,
    followUps: 0,
    creditsReleased: 0,
    creditsExpired: 0,
    creditReminders: 0,
    settlementsRetried: 0,
    errors: [],
  };

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
      const sameDay = daysOut === 0 && registration.track === TRACK_KICKSTART;
      if (daysOut === 3 || daysOut === 1 || sameDay) {
        const result = await sendOnce({
          reference: registration.reference,
          key: `reminder-${daysOut}d`,
          to: registration.email,
          ...reminder({ registration, daysOut }),
        });
        if (result.ok) summary.reminders += 1;
      }

      // Follow-up pack, the morning after the last session.
      const endDate = endDateFor({
        track: registration.track,
        cohortId: registration.cohortId,
        attendsDays: registration.attendsDays,
      });
      if (daysUntil(endDate, { now }) === -1) {
        const credit = await creditEarnedBy(registration.reference);
        const result = await sendOnce({
          reference: registration.reference,
          key: 'completion-pack',
          to: registration.email,
          ...completionPack({ registration, credit: credit?.status === 'available' ? credit : null }),
        });
        if (result.ok) summary.followUps += 1;
      }
    } catch (err) {
      summary.errors.push(`${registration.reference}: ${err?.message}`);
    }
  }

  // Credits held by bookings that were never paid go back to their owners.
  try {
    const pending = await listRegistrations({ status: 'pending', limit: 500 });
    for (const registration of pending) {
      if (!reservationLapsed(registration, { now })) continue;
      const result = await releaseCredit(registration, { now });
      if (result.released) summary.creditsReleased += 1;
    }
  } catch (err) {
    summary.errors.push(`credit release: ${err?.message}`);
  }

  try {
    summary.creditsExpired = await expireCredits({ now });
  } catch (err) {
    summary.errors.push(`credit expiry: ${err?.message}`);
  }

  // One reminder per credit, three days before it ends.
  try {
    for (const credit of await creditsExpiringIn(3, { now })) {
      if (!credit.email || !(await claimOnce(`credit-expiring.${credit.code}`))) continue;
      const result = await sendEmail({ to: credit.email, ...creditExpiring({ credit }) });
      if (result?.ok) summary.creditReminders += 1;
    }
  } catch (err) {
    summary.errors.push(`credit reminders: ${err?.message}`);
  }

  // Money to the bank. On the daily schedule, one transfer for everything
  // unsettled. Otherwise, retry the per-payment sweeps that failed or stalled:
  // the query only returns sweeps that failed or have been stuck long enough
  // to be certainly abandoned, so forcing past the state guard here cannot cut
  // in front of a live request.
  try {
    if (settlementConfig().schedule === 'daily') {
      summary.dailySweep = await settleBatch({ now });
    } else {
      for (const payment of await listUnsettledPayments({ limit: 50 })) {
        const result = await maybeSettle(payment, { force: true });
        if (result.settled) summary.settlementsRetried += 1;
      }
    }
  } catch (err) {
    summary.errors.push(`settlement: ${err?.message}`);
  }

  // The training pages list the next dates. When a Kickstart session or a
  // cohort closed since yesterday, the dates on them changed: tell Bing.
  try {
    const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
    const changed =
      listKickstartSessions({ now, count: 1 })[0]?.id !== listKickstartSessions({ now: yesterday, count: 1 })[0]?.id ||
      listOpenCohorts({ now, count: 1 })[0]?.id !== listOpenCohorts({ now: yesterday, count: 1 })[0]?.id;
    if (changed) {
      summary.indexNow = await pingIndexNow([
        '/ai-training',
        '/ai-training/kickstart',
        '/ai-training/essentials',
        '/ai-training/programme',
      ]);
    }
  } catch (err) {
    summary.errors.push(`indexnow: ${err?.message}`);
  }

  return NextResponse.json({ ok: true, ranAt: now.toISOString(), ...summary });
}
