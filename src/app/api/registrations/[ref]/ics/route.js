import { formatAddress } from '@/lib/constants';
import { getRegistration } from '@/lib/store';
import {
  KICKSTART_END,
  KICKSTART_START,
  TRACK_KICKSTART,
  describeSchedule,
  getTrack,
  normaliseReference,
} from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * An .ics calendar file for a paid booking: one event per class day, in
 * Nairobi time. Opened from the "Add to calendar" button on the paid screen.
 *
 * Only a paid booking gets one, and the file carries nothing private: the
 * reference is the only key, and it is already printed on the receipt.
 */

const pad = (n) => String(n).padStart(2, '0');

/** "2026-11-07" + "09:00" (EAT) → "20261107T060000Z" (UTC). */
function utcStamp(isoDay, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(`${isoDay}T00:00:00Z`);
  d.setUTCHours(h - 3, m, 0, 0);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

/** RFC 5545 text: escape commas, semicolons and backslashes. */
const text = (value) => String(value).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');

export async function GET(_request, { params }) {
  const { ref: rawRef } = await params;
  const ref = normaliseReference(rawRef);
  if (!ref) return new Response('Not found', { status: 404 });

  const registration = await getRegistration(ref);
  if (!registration || registration.status !== 'paid') return new Response('Not found', { status: 404 });

  const track = getTrack(registration.track);
  const schedule = describeSchedule({
    track: registration.track,
    cohortId: registration.cohortId,
    attendsDays: registration.attendsDays,
  });
  const isKickstart = registration.track === TRACK_KICKSTART;
  const [start, end] = isKickstart ? [KICKSTART_START, KICKSTART_END] : ['09:00', '13:00'];
  const location =
    registration.attendance === 'online' ? 'Online, Google Meet (link sent before the session)' : formatAddress();
  const now = utcStamp(new Date().toISOString().slice(0, 10), '03:00');

  const events = schedule.days.map((day, i) =>
    [
      'BEGIN:VEVENT',
      `UID:${ref}-${i + 1}@cloudwise.co.ke`,
      `DTSTAMP:${now}`,
      `DTSTART:${utcStamp(day, start)}`,
      `DTEND:${utcStamp(day, end)}`,
      `SUMMARY:${text(`${track?.name || 'AI training'}${schedule.days.length > 1 ? ` · Day ${i + 1}` : ''}`)}`,
      `LOCATION:${text(location)}`,
      `DESCRIPTION:${text(`Cloudwise booking ${ref}. Questions: hello@cloudwise.co.ke`)}`,
      'END:VEVENT',
    ].join('\r\n')
  );

  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cloudwise//AI Training//EN', ...events, 'END:VCALENDAR', ''].join(
    '\r\n'
  );

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="cloudwise-${ref}.ics"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
