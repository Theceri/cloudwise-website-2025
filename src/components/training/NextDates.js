import { formatDay, formatTime } from '@/lib/training';

/**
 * A cohort closes on a day ("2026-11-05"); a Kickstart at a time on the day
 * ("2026-10-28T14:00:00.000Z", which is 5:00pm in Nairobi).
 */
function closingLabel(closesAt) {
  if (!closesAt.includes('T')) return formatDay(closesAt);
  const eat = new Date(new Date(closesAt).getTime() + 3 * 3600 * 1000);
  const hhmm = `${String(eat.getUTCHours()).padStart(2, '0')}:${String(eat.getUTCMinutes()).padStart(2, '0')}`;
  return `${formatDay(eat.toISOString().slice(0, 10))}, ${formatTime(hhmm)}`;
}

/**
 * The next dates for a tier. The first one is the one to book, with the day
 * booking closes; later ones are smaller, so the page does not quietly suggest
 * waiting a month (Meta Ads review, 25 September 2026).
 *
 * `dates` items: { id, label, closesAt } where closesAt is an ISO date or time.
 */
export function NextDates({ dates = [], time, className = '' }) {
  if (!dates.length) return null;
  const [first, ...rest] = dates;
  const closes = first.closesAt ? closingLabel(first.closesAt) : null;

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${className}`}>
      <p className="font-mono text-[0.65rem] uppercase tracking-eyebrow text-white/65">Next date</p>
      <p className="mt-2 font-display text-xl font-semibold text-white">
        {first.label}
        {time && <span className="ml-2 text-base font-normal text-white/65">{time}</span>}
      </p>
      {closes && <p className="mt-1 text-sm text-ember">Booking closes {closes}</p>}
      {rest.length > 0 && (
        <p className="mt-3 text-sm text-white/65">Later: {rest.map((d) => d.label).join(' · ')}</p>
      )}
    </div>
  );
}
