import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { Gauge } from '@/components/anim/Gauge';
import { NextDates } from '@/components/training/NextDates';

/**
 * The building blocks the three tier pages share, so Kickstart, Essentials
 * and the Programme look like one family and like the rest of the site.
 */

export function TierHero({ eyebrow, title, sub, dates, time, cta, ctaHref, note }) {
  return (
    <section id="hero" className="relative overflow-hidden pt-28 pb-16 md:pt-44 md:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="pointer-events-none absolute -right-24 top-24 opacity-20 md:opacity-60">
        <Gauge size={380} />
      </div>
      <div className="container-px relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <Reveal as="p" className="eyebrow mb-5">{eyebrow}</Reveal>
          <Reveal
            as="h1"
            className="max-w-3xl text-balance font-display text-5xl font-bold leading-[1.02] text-white md:text-7xl"
          >
            {title}
          </Reveal>
          <Reveal as="p" delay={0.08} className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            {sub}
          </Reveal>
          <Reveal delay={0.12} className="mt-8">
            <Link href={ctaHref} className="btn-ember w-full text-base sm:w-auto">
              {cta} <ArrowUpRight size={18} />
            </Link>
            {note && <p className="mt-3 text-sm text-white/65">{note}</p>}
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <NextDates dates={dates} time={time} />
        </Reveal>
      </div>
    </section>
  );
}

export function Section({ eyebrow, title, children, tone = 'ink', id }) {
  return (
    <section
      id={id}
      className={`border-t border-white/10 py-16 md:py-28 ${tone === 'ink' ? 'bg-ink' : 'bg-ink-800/30'}`}
    >
      <div className="container-px">
        {(eyebrow || title) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && <Reveal as="p" className="eyebrow mb-4">{eyebrow}</Reveal>}
            {title && (
              <Reveal as="h2" delay={0.05} className="text-balance font-display text-3xl font-bold text-white md:text-5xl">
                {title}
              </Reveal>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function CheckList({ items, columns = 2 }) {
  return (
    <ul className={`grid gap-3 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/80">
          <Check size={18} className="mt-0.5 shrink-0 text-ember" /> {item}
        </li>
      ))}
    </ul>
  );
}

/** A timed running order: rows of [time, title, what happens] or [time, what happens]. */
export function RunningOrder({ rows, caption }) {
  return (
    <div className="card-dark overflow-hidden">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0] + row[1]} className="border-t border-white/10 first:border-t-0">
              <td className="w-20 p-4 align-top font-mono text-ember">{row[0]}</td>
              <td className="p-4 align-top">
                {row.length === 3 ? (
                  <>
                    <span className="block font-medium text-white">{row[1]}</span>
                    <span className="mt-1 block text-white/65">{row[2]}</span>
                  </>
                ) : (
                  <span className="text-white/80">{row[1]}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Rows of [label, text]. Used for the policies. */
export function FactTable({ rows, caption }) {
  return (
    <div className="card-dark overflow-hidden">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map(([label, text]) => (
            <tr key={label} className="border-t border-white/10 first:border-t-0">
              <th scope="row" className="w-40 p-4 align-top font-medium text-white">{label}</th>
              <td className="p-4 text-white/70">{text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * A value stack: each part of the offer with its value, the total, and the
 * price. Values come from KICKSTART_STACK, which ties each one to a real price.
 */
export function ValueStack({ rows, total, price, basis, formatKes }) {
  return (
    <div className="card-dark overflow-hidden">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">What the course includes, and what each part is worth</caption>
        <tbody>
          {rows.map(([item, value]) => (
            <tr key={item} className="border-t border-white/10 first:border-t-0">
              <td className="p-4 text-white/80">
                <span className="flex items-start gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-ember" /> {item}
                </span>
              </td>
              <td className="w-36 p-4 text-right align-top font-medium text-white">
                {value ? `Worth ${formatKes(value)}` : <span className="text-white/60">Included</span>}
              </td>
            </tr>
          ))}
          <tr className="border-t border-white/20 bg-white/[0.04]">
            <th scope="row" className="p-4 font-display text-base font-semibold text-white">Total value</th>
            <td className="p-4 text-right font-display text-base font-semibold text-white">{formatKes(total)}</td>
          </tr>
          <tr className="bg-ember/10">
            <th scope="row" className="p-4 font-display text-lg font-bold text-white">You pay</th>
            <td className="p-4 text-right font-display text-lg font-bold text-ember">{formatKes(price)}</td>
          </tr>
        </tbody>
      </table>
      {basis && <p className="border-t border-white/10 p-4 text-xs text-white/55">{basis}</p>}
    </div>
  );
}
