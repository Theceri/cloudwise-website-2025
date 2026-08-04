import { NextResponse } from 'next/server';

import { sendToAdmins } from '@/lib/email/send';
import { adminDailyDigest } from '@/lib/email/templates';
import { isAuthorisedJob } from '@/lib/security';
import { listRegistrations } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * The end-of-day admin round-up, sent at 17:00 East Africa Time.
 *
 * Vercel schedules crons in UTC, so the entry in vercel.json reads 14:00.
 * "Today" is likewise computed in EAT, not UTC — a signup at 6pm Nairobi time
 * still belongs to today even though UTC has not rolled over.
 */
export async function GET(request) {
  if (!isAuthorisedJob(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  // Midnight Nairobi today, expressed as the UTC instant it corresponds to.
  const now = new Date();
  const nairobiNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const startOfDayUtc = new Date(
    Date.UTC(
      nairobiNow.getUTCFullYear(),
      nairobiNow.getUTCMonth(),
      nairobiNow.getUTCDate()
    ) - 3 * 60 * 60 * 1000
  );

  const dateLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Nairobi',
  }).format(now);

  let roster;
  try {
    roster = await listRegistrations({ limit: 500 });
  } catch (err) {
    console.error('[cron/digest] roster lookup failed:', err?.message);
    return NextResponse.json({ error: 'Could not build the roster.' }, { status: 500 });
  }

  const since = startOfDayUtc.toISOString();
  const todaysSignups = roster.filter((r) => (r.createdAt || '') >= since);

  const result = await sendToAdmins(adminDailyDigest({ roster, todaysSignups, dateLabel }));

  return NextResponse.json({
    ok: result.ok,
    skipped: result.skipped || false,
    dateLabel,
    total: roster.length,
    todaysSignups: todaysSignups.length,
  });
}
