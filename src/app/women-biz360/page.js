import Link from 'next/link';
import {
  ArrowUpRight, Check, Clock, FileText, Gift, Laptop, MapPin,
  MessageSquare, PenTool, Receipt, ShieldCheck, Sparkles, Users,
} from 'lucide-react';

import { AnimatedHeading } from '@/components/anim/AnimatedHeading';
import { Faq } from '@/components/Faq';
import { Reveal } from '@/components/anim/Reveal';
import { SITE_URL } from '@/lib/constants';
import { TRACK_WBH, TRACKS, formatDay, formatKes, formatTime } from '@/lib/training';

const track = TRACKS[TRACK_WBH];
const eventDay = formatDay(track.eventDate, { long: true });

export const metadata = {
  title: 'AI Masterclass for Women Entrepreneurs — Women Biz360 Hub × Cloudwise',
  description: `A full day building AI into your business, hands-on. ${eventDay}, ${track.venue}. ${formatKes(track.priceKes)}, limited seats.`,
  alternates: { canonical: '/women-biz360' },
  openGraph: {
    title: 'AI Masterclass for Women Entrepreneurs',
    description:
      'You will not just learn about AI — you will leave having BUILT it into your business.',
    url: `${SITE_URL}/women-biz360`,
  },
};

/**
 * The modules are the demand the free webinar surfaced, in the order it came
 * up: proposals and RFPs first, because that was the loudest signal in the room.
 */
const MODULES = [
  {
    icon: FileText,
    title: 'Proposals & RFP responses on your letterhead',
    desc: 'Attach your business profile and letterhead once. Turn a tender document into a finished, sendable response — the thing that currently eats your weekend.',
  },
  {
    icon: PenTool,
    title: 'Making AI writing sound like you',
    desc: 'Why AI writing reads as AI, and how to fix it. Your voice, your rhythm, no giveaway phrasing — writing people believe a person wrote.',
  },
  {
    icon: Sparkles,
    title: 'A month of content, and getting it posted',
    desc: 'Build a content system, then push it into Canva and out to your channels. Not a week of scrambling — a system that keeps running.',
  },
  {
    icon: Receipt,
    title: 'Your numbers, safely',
    desc: 'Give AI your rough figures and get real analysis back: what makes money, what does not, what to change first. Plus exactly what never to paste.',
  },
  {
    icon: MessageSquare,
    title: 'Customer replies that win the sale',
    desc: '“Too expensive.” Silence after a quote. An angry message on a bad day. Build your own reply toolkit so you answer from your calmest self, every time.',
  },
  {
    icon: Users,
    title: 'Your own AI business advisor',
    desc: 'Set up an assistant that knows your business, your customers and your goals — one you can bring a real problem to on a Monday morning.',
  },
];

const OUTCOMES = [
  'A content system that keeps running after today',
  'A customer-communication toolkit in your own voice',
  'Your own AI business advisor, set up around your business',
  'A proposal and RFP workflow on your own letterhead',
  'The confidence to try things without asking permission',
];

const VALUE_STACK = [
  { icon: Clock, title: 'A full day, hands-on', desc: '8:30am to 4:00pm building in your own business — not watching slides.' },
  { icon: Users, title: 'A room of women growing together', desc: 'The network is half the value. You will leave with more than skills.' },
  { icon: FileText, title: 'Toolkit & prompt library', desc: 'Everything we build, plus the prompt pack — yours to keep and reuse.' },
  { icon: Gift, title: 'Lunch & refreshments', desc: 'Included. Come ready to work; we will feed you.' },
];

const FAQ_ITEMS = [
  {
    q: 'I am not good with technology. Is this for me?',
    a: 'If you send a WhatsApp, you are ready. We go slowly, together, and nobody is left behind. The free webinar was the proof — women who had never opened an AI tool were producing real work within the hour.',
  },
  {
    q: `Is it worth ${formatKes(track.priceKes)}?`,
    a: 'One extra customer a week from better marketing pays for it many times over. Think of it as the cheapest staff member you will ever have — one that never takes leave. And unlike a course you watch, you leave with the thing already built.',
  },
  {
    q: 'I am too busy that day.',
    a: 'That is exactly why you need it. One day now saves you an evening every week afterwards. Most people tell us the proposal and content modules alone give them their Saturdays back.',
  },
  {
    q: 'Do I need to have attended the free webinar?',
    a: 'No. The masterclass stands on its own and starts from first principles. If you did attend, even better — we pick up exactly where that left off.',
  },
  {
    q: 'What do I need to bring?',
    a: 'A laptop and charger, your phone, and one real challenge from your business that we will solve live. If you have a business profile or letterhead, bring those too — that is what makes the proposal module click.',
  },
  {
    q: 'How do I pay?',
    a: 'M-Pesa or card, right on the website. You will get an instant confirmation email and your preparation pack. If the M-Pesa prompt does not arrive, the paybill and account number are on the payment page so you can pay directly.',
  },
];

const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'AI Masterclass for Women Entrepreneurs',
  description:
    'A full-day, hands-on masterclass where women entrepreneurs build AI into their own businesses — content systems, customer communication, proposals and business analysis.',
  provider: { '@type': 'Organization', name: 'Cloudwise Limited', sameAs: SITE_URL },
  offers: {
    '@type': 'Offer',
    price: String(track.priceKes),
    priceCurrency: 'KES',
    category: 'Paid',
    url: `${SITE_URL}/women-biz360/register`,
    availability: 'https://schema.org/LimitedAvailability',
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'Onsite',
    startDate: `${track.eventDate}T${track.eventStart}:00+03:00`,
    endDate: `${track.eventDate}T${track.eventEnd}:00+03:00`,
    location: { '@type': 'Place', name: track.venue, address: `${track.venue}, Nairobi, Kenya` },
  },
};

export default function WomenBiz360Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid-lg opacity-30" />

        <div className="container-px relative">
          <Reveal as="p" className="eyebrow mb-5">
            Women Biz360 Hub × Cloudwise
          </Reveal>
          <AnimatedHeading
            as="h1"
            text="Come and build."
            className="max-w-3xl text-balance font-display text-5xl font-bold leading-[1.0] text-white md:text-7xl lg:text-8xl"
          />
          <Reveal as="p" delay={0.1} className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">
            You have seen what AI can do. This is the day you put it to work — a full,
            hands-on day where you leave having <strong className="text-white">built</strong> AI
            into your own business, not just learned about it.
          </Reveal>

          <Reveal delay={0.16} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/women-biz360/register" className="btn-ember text-base">
              Reserve your seat · {formatKes(track.priceKes)} <ArrowUpRight size={18} />
            </Link>
            <a href="#programme" className="btn-ghost text-base">
              See the programme
            </a>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
            <Reveal className="card-dark flex items-center justify-between p-6">
              <div>
                <p className="font-display text-4xl font-bold text-white">
                  {formatKes(track.priceKes)}
                </p>
                <p className="mt-1 text-sm text-white/50">per person · limited seats</p>
              </div>
              <span className="rounded-full bg-ember px-3 py-2 text-center font-mono text-xs font-bold leading-tight text-white">
                FULL
                <br />
                DAY
              </span>
            </Reveal>
            <Reveal delay={0.08} className="card-dark space-y-3 p-6 text-sm">
              <p className="flex items-center gap-3 text-white/80">
                <Clock size={16} className="text-ember" /> {eventDay} ·{' '}
                {formatTime(track.eventStart)}–{formatTime(track.eventEnd)}
              </p>
              <p className="flex items-center gap-3 text-white/80">
                <MapPin size={16} className="text-ember" /> {track.venue}
              </p>
              <p className="flex items-center gap-3 text-white/80">
                <Laptop size={16} className="text-ember" /> Bring your laptop — 100% hands-on
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE SHIFT */}
      <section className="border-t border-white/10 bg-ink-800/30 py-24 md:py-32">
        <div className="container-px grid gap-14 lg:grid-cols-2">
          <div>
            <Reveal as="p" className="eyebrow mb-4">
              Why this day
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="text-balance font-display text-4xl font-bold text-white md:text-5xl"
            >
              You are doing all of it yourself.
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
              When we asked women at the free webinar what eats their week, the most common answer
              was not one task. It was <em className="text-white/85">“everything — I do it all
              myself.”</em> The marketing, the quotes, the follow-ups, the paperwork, the numbers.
            </Reveal>
            <Reveal as="p" delay={0.14} className="mt-5 max-w-lg text-lg leading-relaxed text-white/60">
              This day is built for that. Not one clever trick — a set of systems that take the
              repeated work off your hands, built around your business, with us beside you.
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="card-dark h-full p-8">
              <p className="eyebrow mb-5">You will leave with</p>
              <ul className="space-y-4">
                {OUTCOMES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/80">
                    <Check size={18} className="mt-0.5 shrink-0 text-ember" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROGRAMME */}
      <section id="programme" className="border-t border-white/10 bg-ink py-24 md:py-32">
        <div className="container-px">
          <div className="mb-14 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">
              The programme
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="text-balance font-display text-4xl font-bold text-white md:text-5xl"
            >
              Six things you will build.
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-5 text-white/55">
              Each one on your own business, with your own documents, finished before you leave.
            </Reveal>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((module, i) => (
              <Reveal key={module.title} delay={i * 0.05}>
                <div className="card-dark h-full p-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-ember/10 text-ember">
                    <module.icon size={22} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{module.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/55">{module.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section className="border-t border-white/10 bg-ink-800/30 py-24 md:py-32">
        <div className="container-px">
          <div className="mb-14 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">
              What is included
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="text-balance font-display text-4xl font-bold text-white md:text-5xl"
            >
              Everything in your {formatKes(track.priceKes)}.
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {VALUE_STACK.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="card-dark flex h-full items-start gap-5 p-7">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-ember/10 text-ember">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-4">
            <div className="flex items-start gap-5 rounded-3xl border border-ember/30 bg-ember/[0.07] p-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ember text-white">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  Your preparation pack, the moment you pay
                </h3>
                <p className="mt-2 text-sm text-white/65">
                  The accounts to open, a fifteen-minute warm-up, and your prompt library — emailed
                  straight away, so day one starts at the good part.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Faq items={FAQ_ITEMS} eyebrow="Questions" title="Everything you might be wondering" />

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-ink py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[55rem] -translate-x-1/2 rounded-full bg-ember/15 blur-3xl" />
        <div className="container-px relative text-center">
          <Reveal as="p" className="eyebrow mb-4">
            {eventDay}
          </Reveal>
          <Reveal
            as="h2"
            className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold text-white md:text-6xl"
          >
            A room full of women, growing together.
          </Reveal>
          <Reveal as="p" delay={0.08} className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            Seats are limited because the day is genuinely hands-on. Reserve yours and we will send
            your preparation pack straight away.
          </Reveal>
          <Reveal delay={0.14} className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/women-biz360/register" className="btn-ember text-base">
              Reserve your seat · {formatKes(track.priceKes)} <ArrowUpRight size={18} />
            </Link>
            <Link href="/ai-training" className="btn-ghost text-base">
              Not a Women Biz360 member?
            </Link>
          </Reveal>
          <p className="mt-6 font-mono text-xs uppercase tracking-eyebrow text-white/35">
            Learn. Connect. Grow. Succeed.
          </p>
        </div>
      </section>
    </>
  );
}
