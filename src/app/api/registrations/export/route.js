import { rosterCsv } from '@/lib/email/roster-csv';
import { isAuthorisedJob } from '@/lib/security';
import { listRegistrations } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The roster as a spreadsheet, on demand.
 *
 * The admin emails carry the same file as an attachment, but an attachment is
 * only ever as fresh as the alert that triggered it. This is the link to open
 * when you actually want the list — halfway through a morning, before a call
 * with the partner — without hunting back through an inbox.
 *
 *   /api/registrations/export?secret=YOUR_CRON_SECRET
 *   /api/registrations/export?secret=…&track=individual&status=paid
 *   /api/registrations/export?secret=…&cohortId=2026-10
 */
export async function GET(request) {
  if (!isAuthorisedJob(request)) {
    return new Response('Unauthorised', { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const registrations = await listRegistrations({
    track: searchParams.get('track') || undefined,
    cohortId: searchParams.get('cohortId') || undefined,
    status: searchParams.get('status') || undefined,
    limit: 2000,
  });

  const day = new Date().toISOString().slice(0, 10);

  return new Response(rosterCsv(registrations), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cloudwise-registrations-${day}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
