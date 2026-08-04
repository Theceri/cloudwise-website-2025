import Link from 'next/link';
import { CalendarDays, Check, Clock, Laptop, MapPin } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { RegistrationForm } from '@/components/training/RegistrationForm';
import { SITE_URL } from '@/lib/constants';
import { TRACK_WBH, TRACKS, formatDay, formatKes, formatTime } from '@/lib/training';

export const dynamic = 'force-dynamic';

const track = TRACKS[TRACK_WBH];

export const metadata = {
  title: 'Reserve your seat — AI Masterclass for Women Entrepreneurs',
  description: `Full-day, hands-on AI Masterclass with Women Biz360 Hub and Cloudwise. ${formatKes(track.priceKes)}, limited seats.`,
  alternates: { canonical: '/women-biz360/register' },
  openGraph: {
    title: 'Reserve your seat — AI Masterclass for Women Entrepreneurs',
    description: 'A full day building AI into your own business, hands-on, with us beside you.',
    url: `${SITE_URL}/women-biz360/register`,
  },
};

const OUTCOMES = [
  'Your own content system, built on the day',
  'A customer-communication toolkit',
  'Your own AI business advisor',
  'Proposals and RFP responses on your letterhead',
  'A room full of women growing together',
];

export default function WomenBiz360RegisterPage() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid-lg opacity-20" />

      <div className="container-px relative">
        <div className="mx-auto max-w-5xl">
          <Reveal as="p" className="eyebrow mb-4">
            Women Biz360 Hub × Cloudwise
          </Reveal>
          <Reveal
            as="h1"
            delay={0.05}
            className="max-w-2xl text-balance font-display text-4xl font-bold leading-[1.05] text-white md:text-6xl"
          >
            Come and build.
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-5 max-w-xl text-lg text-white/60">
            You already know what AI can do. This is the day you put it to work in your own
            business. We have your details from the free webinar — you only need to answer a few
            new questions.
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <Reveal delay={0.14} className="order-2 lg:order-1">
              <RegistrationForm track={TRACK_WBH} price={track.priceKes} />
            </Reveal>

            <Reveal delay={0.1} className="order-1 lg:order-2">
              <aside className="card-dark sticky top-28 p-7">
                <p className="font-display text-3xl font-bold text-white">
                  {formatKes(track.priceKes)}
                </p>
                <p className="mt-1 text-sm text-white/50">per person · limited seats</p>

                <div className="mt-6 space-y-3 border-y border-white/10 py-6 text-sm">
                  <p className="flex items-start gap-3 text-white/75">
                    <CalendarDays size={15} className="mt-0.5 shrink-0 text-ember" />
                    {formatDay(track.eventDate, { long: true })}
                  </p>
                  <p className="flex items-start gap-3 text-white/75">
                    <Clock size={15} className="mt-0.5 shrink-0 text-ember" />
                    {formatTime(track.eventStart)} – {formatTime(track.eventEnd)} · arrive by 8:15
                  </p>
                  <p className="flex items-start gap-3 text-white/75">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-ember" />
                    {track.venue}
                  </p>
                  <p className="flex items-start gap-3 text-white/75">
                    <Laptop size={15} className="mt-0.5 shrink-0 text-ember" />
                    Bring your laptop — 100% hands-on
                  </p>
                </div>

                <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-eyebrow text-white/40">
                  You will leave with
                </p>
                <ul className="mt-3 space-y-2.5">
                  {OUTCOMES.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/75">
                      <Check size={15} className="mt-0.5 shrink-0 text-ember" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-[13px] leading-relaxed text-white/45">
                  Lunch and refreshments provided.{' '}
                  <Link href="/women-biz360" className="text-ember hover:underline">
                    See the full programme
                  </Link>
                  .
                </p>
              </aside>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
