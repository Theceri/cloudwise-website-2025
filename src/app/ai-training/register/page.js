import Link from 'next/link';
import { CalendarDays, Check, Laptop, MapPin } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { RegistrationForm } from '@/components/training/RegistrationForm';
import { SITE_URL } from '@/lib/constants';
import { TIER_DETAILS } from '@/lib/training-content';
import {
  TRACKS,
  TRACK_ESSENTIALS,
  TRACK_KICKSTART,
  TRACK_PROGRAMME,
  formatDay,
  formatKes,
  listEssentialsDates,
  listKickstartSessions,
  listOpenCohorts,
  tierFromParam,
} from '@/lib/training';

// The page reads ?tier= and ?credit=, so it renders per request. It is small,
// and not indexed: the tier pages are what search engines should find.

export async function generateMetadata({ searchParams }) {
  const { tier } = await searchParams;
  const track = TRACKS[tierFromParam(tier)];
  return {
    title: `Book ${track.name} · ${formatKes(track.priceKes)}`,
    description: `Book ${track.name}: ${track.lengthLabel}, ${TIER_DETAILS[track.id].format}. ${formatKes(track.priceKes)}, paid in full by M-Pesa.`,
    alternates: { canonical: '/ai-training/register' },
    // A form, not a page to rank. /ai-training and the tier pages carry the content.
    robots: { index: false, follow: true },
    openGraph: {
      title: `Book ${track.name} — Cloudwise`,
      description: TIER_DETAILS[track.id].pitch,
      url: `${SITE_URL}/ai-training/register`,
    },
  };
}

/** The dates each tier is sold on, in the shape the form expects. */
function datesFor(trackId) {
  if (trackId === TRACK_KICKSTART) {
    return listKickstartSessions({ count: 4 }).map((s) => ({ id: s.id, label: `${s.label} · 7:00–9:00pm` }));
  }
  if (trackId === TRACK_ESSENTIALS) {
    return listEssentialsDates({ count: 3 }).map((d) => ({ id: d.id, label: d.label }));
  }
  // The Programme also carries Day Two, for a buyer whose Essentials credit
  // paid for Day One.
  return listOpenCohorts({ count: 4 }).map((c) => ({
    id: c.id,
    label: c.label,
    dayTwo: c.dayTwo,
    dayTwoLabel: `Day Two: ${formatDay(c.dayTwo)}`,
  }));
}

export default async function RegisterPage({ searchParams }) {
  const query = await searchParams;
  const trackId = tierFromParam(query?.tier);
  const track = TRACKS[trackId];
  const details = TIER_DETAILS[trackId];
  const dates = datesFor(trackId);
  const creditCode = typeof query?.credit === 'string' ? query.credit.slice(0, 20).toUpperCase() : '';

  return (
    <section className="relative overflow-hidden pt-28 pb-24 md:pt-40 md:pb-32">
      {/* No InitiateCheckout here. Opening the form is not checkout: it fired
          one-for-one with PageView. It now fires on the first pay button, in
          src/components/training/Checkout.js. */}
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid-lg opacity-20" />

      <div className="container-px relative">
        <div className="mx-auto max-w-5xl">
          <Reveal as="p" className="eyebrow mb-4">
            Step 1 of 2 · {track.name}
          </Reveal>
          <Reveal
            as="h1"
            delay={0.05}
            className="max-w-2xl text-balance font-display text-4xl font-bold leading-[1.05] text-white md:text-6xl"
          >
            {trackId === TRACK_KICKSTART ? 'Book your Kickstart.' : 'Reserve your seat.'}
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-5 max-w-xl text-lg text-white/65">
            {trackId === TRACK_KICKSTART ? 'Takes one minute.' : 'Takes two minutes.'} You pay in full by
            M-Pesa on the next step. Nothing is charged until then.
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <Reveal delay={0.14} className="order-2 lg:order-1">
              {dates.length ? (
                <RegistrationForm
                  track={trackId}
                  dates={dates}
                  price={track.priceKes}
                  initialCreditCode={creditCode}
                />
              ) : (
                <div className="card-dark p-8">
                  <h2 className="font-display text-xl font-semibold text-white">No open dates right now</h2>
                  <p className="mt-3 text-white/65">
                    The next dates are being confirmed.{' '}
                    <Link href="/contact" className="text-ember hover:underline">
                      Send us a message
                    </Link>{' '}
                    and we will hold you a place as soon as they open.
                  </p>
                </div>
              )}
            </Reveal>

            <Reveal delay={0.1} className="order-1 lg:order-2">
              <aside className="card-dark sticky top-28 p-7">
                <p className="eyebrow-muted mb-2">{track.name}</p>
                <p className="font-display text-3xl font-bold text-white">{formatKes(track.priceKes)}</p>
                <p className="mt-1 text-sm text-white/65">per person, paid in full</p>

                <ul className="mt-6 space-y-2.5 border-y border-white/10 py-6">
                  {details.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/75">
                      <Check size={15} className="mt-0.5 shrink-0 text-ember" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-3 text-sm">
                  <p className="flex items-start gap-3 text-white/70">
                    <CalendarDays size={15} className="mt-0.5 shrink-0 text-ember" />
                    {details.when}
                  </p>
                  <p className="flex items-start gap-3 text-white/70">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-ember" />
                    {details.format}
                  </p>
                  <p className="flex items-start gap-3 text-white/70">
                    <Laptop size={15} className="mt-0.5 shrink-0 text-ember" />
                    {trackId === TRACK_KICKSTART ? 'A laptop is best; a phone works' : 'Bring your laptop'}
                  </p>
                </div>

                {details.credit && (
                  <p className="mt-6 rounded-xl border border-ember/30 bg-ember/[0.07] p-4 text-[13px] leading-relaxed text-white/75">
                    Counts toward your next course: {details.credit}.
                  </p>
                )}

                <p className="mt-6 text-[13px] leading-relaxed text-white/65">
                  {trackId === TRACK_PROGRAMME ? 'Training a team of 10 or more?' : 'Want the full eight hours?'}{' '}
                  <Link
                    href={trackId === TRACK_PROGRAMME ? '/ai-training/teams' : '/ai-training#options'}
                    className="text-ember hover:underline"
                  >
                    {trackId === TRACK_PROGRAMME ? 'See team and private training' : 'Compare the options'}
                  </Link>
                </p>
              </aside>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
