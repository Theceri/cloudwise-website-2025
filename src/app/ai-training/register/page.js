import Link from 'next/link';
import { CalendarDays, Check, Laptop, MapPin } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { RegistrationForm } from '@/components/training/RegistrationForm';
import { SITE_URL } from '@/lib/constants';
import { TRACK_INDIVIDUAL, TRACKS, formatKes, listOpenCohorts } from '@/lib/training';

// Cohorts roll forward with the calendar, so this page must not be baked at
// build time — an October build would still be offering September otherwise.
export const dynamic = 'force-dynamic';

const track = TRACKS[TRACK_INDIVIDUAL];

export const metadata = {
  title: 'Register — AI Productivity Training',
  description: `Reserve your seat on the Cloudwise AI Productivity Training. ${formatKes(track.priceKes)} per person, two Saturdays, online or in Nairobi.`,
  alternates: { canonical: '/ai-training/register' },
  openGraph: {
    title: 'Register — Cloudwise AI Productivity Training',
    description: 'Two Saturdays. 100% hands-on. Includes the AI toolkit, recordings & support community.',
    url: `${SITE_URL}/ai-training/register`,
  },
};

const INCLUDED = [
  '8 hours of live, hands-on training',
  'AI toolkit & prompt library to keep',
  'Session recordings',
  'WhatsApp support community',
];

export default function RegisterPage() {
  const cohorts = listOpenCohorts({ count: 6 });

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid-lg opacity-20" />

      <div className="container-px relative">
        <div className="mx-auto max-w-5xl">
          <Reveal as="p" className="eyebrow mb-4">
            Step 1 of 2 · Registration
          </Reveal>
          <Reveal
            as="h1"
            delay={0.05}
            className="max-w-2xl text-balance font-display text-4xl font-bold leading-[1.05] text-white md:text-6xl"
          >
            Reserve your seat.
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-5 max-w-xl text-lg text-white/60">
            Takes two minutes. Payment is on the next step, by M-Pesa or card — nothing is charged
            until then.
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <Reveal delay={0.14} className="order-2 lg:order-1">
              {cohorts.length ? (
                <RegistrationForm
                  track={TRACK_INDIVIDUAL}
                  cohorts={cohorts}
                  price={track.priceKes}
                />
              ) : (
                <div className="card-dark p-8">
                  <h2 className="font-display text-xl font-semibold text-white">
                    No open cohorts right now
                  </h2>
                  <p className="mt-3 text-white/60">
                    Dates for the next intake are being confirmed.{' '}
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
                <div className="flex items-baseline gap-3">
                  <p className="font-display text-3xl font-bold text-white">
                    {formatKes(track.priceKes)}
                  </p>
                  <p className="text-sm text-white/35 line-through">
                    {formatKes(track.strikePriceKes)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-white/50">per person</p>

                <ul className="mt-6 space-y-2.5 border-y border-white/10 py-6">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/75">
                      <Check size={15} className="mt-0.5 shrink-0 text-ember" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-3 text-sm">
                  <p className="flex items-start gap-3 text-white/70">
                    <CalendarDays size={15} className="mt-0.5 shrink-0 text-ember" />
                    1st &amp; 2nd Saturday monthly · 9am–1pm
                  </p>
                  <p className="flex items-start gap-3 text-white/70">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-ember" />
                    Online, or Delta Annex, Nairobi
                  </p>
                  <p className="flex items-start gap-3 text-white/70">
                    <Laptop size={15} className="mt-0.5 shrink-0 text-ember" />
                    Bring your laptop
                  </p>
                </div>

                <p className="mt-6 text-[13px] leading-relaxed text-white/45">
                  Training a whole team?{' '}
                  <Link href="/contact" className="text-ember hover:underline">
                    Ask about a private session
                  </Link>{' '}
                  built around your workflows.
                </p>
              </aside>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
