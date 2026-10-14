import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { COMPARISON_ROWS, TIER_DETAILS } from '@/lib/training-content';
import { PUBLIC_TIERS, TRACKS, TRACK_PROGRAMME, formatKes } from '@/lib/training';

/** One tier: name, price, length, format, what you leave with, what it includes. */
export function TierCard({ trackId, delay = 0 }) {
  const track = TRACKS[trackId];
  const details = TIER_DETAILS[trackId];
  const featured = trackId === TRACK_PROGRAMME;

  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`card-dark relative flex h-full flex-col p-7 ${featured ? 'border-ember/50 bg-ember/[0.05]' : ''}`}
      >
        {featured && (
          <span className="absolute -top-3 left-7 rounded-full bg-ember px-3 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-eyebrow text-white">
            Most complete
          </span>
        )}
        <p className="eyebrow-muted">{track.name}</p>
        <p className="mt-3 font-display text-4xl font-bold text-white">{formatKes(track.priceKes)}</p>
        <p className="mt-1 text-sm text-white/65">
          {track.lengthLabel} · {details.when}
        </p>
        <p className="mt-1 text-sm text-white/65">{details.format}</p>

        <p className="mt-5 text-[15px] leading-relaxed text-white/75">{details.pitch}</p>

        <ul className="mt-5 space-y-2 border-t border-white/10 pt-5">
          {details.includes.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-white/75">
              <Check size={15} className="mt-0.5 shrink-0 text-ember" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-7">
          <Link href={track.registerPath} className={`${featured ? 'btn-ember' : 'btn-ghost'} w-full text-base`}>
            {details.cta} <ArrowUpRight size={18} />
          </Link>
          <Link
            href={track.landingPath}
            className="mt-3 block text-center text-sm text-white/65 hover:text-ember"
          >
            See the details
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

/** The three tiers side by side, then the credit strip. */
export function TierLadder() {
  return (
    <>
      <div className="grid gap-6 pt-3 lg:grid-cols-3">
        {PUBLIC_TIERS.map((id, i) => (
          <TierCard key={id} trackId={id} delay={i * 0.06} />
        ))}
      </div>
      <Reveal delay={0.1} className="mt-6">
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/75">
          <strong className="text-white">Start small.</strong> What you pay for Kickstart or Essentials counts toward
          the next course. Kickstart credit lasts {TRACKS.kickstart.credit.days} days; Essentials credit lasts{' '}
          {TRACKS.essentials.credit.days} days. Every class is paid in full when you book.
        </p>
      </Reveal>
    </>
  );
}

/**
 * The three options compared, row by row. A real table on wide screens; on a
 * phone each row stacks, so nothing scrolls sideways.
 */
export function ComparisonTable() {
  const names = PUBLIC_TIERS.map((id) => TRACKS[id].shortName);
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Kickstart, Essentials and the Programme compared</caption>
        <thead className="hidden bg-white/[0.04] md:table-header-group">
          <tr>
            <th scope="col" className="p-4 font-medium text-white/65">
              &nbsp;
            </th>
            {names.map((n) => (
              <th key={n} scope="col" className="p-4 font-display font-semibold text-white">
                {n}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map(([label, ...values]) => (
            <tr key={label} className="block border-t border-white/10 md:table-row">
              <th scope="row" className="block p-4 pb-1 font-medium text-white md:table-cell md:pb-4 md:text-white/75">
                {label}
              </th>
              {values.map((v, i) => (
                <td key={names[i]} className="flex justify-between gap-4 px-4 py-1 text-white/75 md:table-cell md:py-4">
                  <span className="text-white/65 md:hidden">{names[i]}</span>
                  <span className="text-right md:text-left">{v}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
