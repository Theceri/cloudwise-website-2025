import Link from 'next/link';
import { ArrowUpRight, Laptop, ShieldCheck, Star } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { AnimatedHeading } from '@/components/anim/AnimatedHeading';
import { Gauge } from '@/components/anim/Gauge';
import { Faq } from '@/components/Faq';
import { PixelEvent } from '@/components/PixelEvent';
import { Testimonials } from '@/components/Testimonials';
import { ComparisonTable, TierLadder } from '@/components/training/TierCards';
import { StickyBookBar } from '@/components/training/StickyBookBar';
import { TrainerCard } from '@/components/training/TrainerCard';
import { COMPANY_INFO, SITE_URL, formatAddress, whatsappLink } from '@/lib/constants';
import { META_CURRENCY, META_EVENTS } from '@/lib/meta/events';
import { JsonLd, breadcrumbJsonLd, courseJsonLd } from '@/lib/seo/jsonld';
import { TEN_ASSISTANTS, TOOLS, hubFaq } from '@/lib/training-content';
import {
  PRIVATE_PRICE_KES,
  PUBLIC_TIERS,
  TEAM_MIN_PEOPLE,
  TEAM_PRICE_PER_PERSON_KES,
  TRACKS,
  TRACK_ESSENTIALS,
  TRACK_KICKSTART,
  TRACK_PROGRAMME,
  formatKes,
  openDatesFor,
} from '@/lib/training';

// The next dates are derived from today's date, so the page is rebuilt every
// hour rather than baked once at build time. It was `force-dynamic`, which
// rebuilt it for every visitor and slowed the first paint on phones. An hour is
// safe: the registration API refuses a closed date however stale the page is.
export const revalidate = 3600;

const kickstart = TRACKS[TRACK_KICKSTART];
const essentials = TRACKS[TRACK_ESSENTIALS];
const programme = TRACKS[TRACK_PROGRAMME];

export const metadata = {
  title: { absolute: 'AI Training in Nairobi, Kenya: Courses from Ksh 500 · Cloudwise' },
  description:
    'Hands-on AI training on Claude in Nairobi and online. A 2-hour Kickstart for Ksh 500, a 4-hour Essentials for Ksh 5,500, or the full 8-hour Programme. Build your own AI assistant.',
  alternates: { canonical: '/ai-training' },
  openGraph: {
    type: 'website',
    siteName: 'Cloudwise',
    title: 'AI Training in Nairobi, Kenya — from Ksh 500',
    description:
      'Build your own AI assistant and use it at work this week. Kickstart, Essentials or the full Programme, in Westlands or online.',
    url: `${SITE_URL}/ai-training`,
    images: [{ url: '/og/ai-training.png', width: 1200, height: 630, alt: 'Cloudwise AI training' }],
  },
  // Without this the card inherits the root layout's generic company blurb, so
  // every share of the training page on X sold the company rather than the course.
  twitter: {
    card: 'summary_large_image',
    title: 'AI Training in Nairobi, Kenya — Cloudwise',
    description: 'Three ways in, from a 2-hour Kickstart for Ksh 500 to the full 8-hour Programme.',
    images: ['/og/ai-training.png'],
  },
};

const ASK_MSG = "Hi Cloudwise, I'd like to ask about the AI training before I book.";
const TEAM_MSG = "Hi Cloudwise, I'd like to book a 30-minute call about AI training for my team.";

export default function AiTrainingPage() {
  const dates = Object.fromEntries(PUBLIC_TIERS.map((id) => [id, openDatesFor(id, { count: 3 })]));
  const nextKickstart = dates[TRACK_KICKSTART][0];
  const nextEssentials = dates[TRACK_ESSENTIALS][0];
  const faqItems = hubFaq({ nextKickstart: nextKickstart?.label, nextEssentials: nextEssentials?.label });

  const jsonLd = [
    courseJsonLd({
      path: '/ai-training',
      name: 'Cloudwise AI Productivity Training',
      description:
        'Hands-on AI training on Claude in Nairobi and online: a 2-hour Kickstart, a 4-hour Essentials Saturday, or the 8-hour Programme. Every participant builds their own AI assistant.',
      tiers: PUBLIC_TIERS,
      dates,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    breadcrumbJsonLd([['AI Training', '/ai-training']]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <PixelEvent
        event={META_EVENTS.viewContent}
        params={{
          content_name: 'AI Productivity Training',
          content_category: 'Training',
          content_type: 'product',
          content_ids: PUBLIC_TIERS,
          value: programme.priceKes,
          currency: META_CURRENCY,
        }}
      />

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden pt-28 pb-20 md:pt-44 md:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
        <div className="pointer-events-none absolute -right-24 top-24 opacity-20 md:opacity-70">
          <Gauge size={420} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid-lg opacity-30" />

        <div className="container-px relative">
          <Reveal as="p" className="eyebrow mb-5">AI Productivity Training · Nairobi and online</Reveal>
          <AnimatedHeading
            as="h1"
            text="AI training in Nairobi: build your own AI assistant."
            className="max-w-4xl text-balance font-display text-5xl font-bold leading-[1.0] text-white md:text-7xl"
          />
          <Reveal as="p" delay={0.1} className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">
            Three ways in, from a two-hour online session for {formatKes(kickstart.priceKes)} to the full
            eight-hour programme. Every session is hands-on, on your own work, taught on Claude. No tech
            background needed.
          </Reveal>

          {(nextKickstart || nextEssentials) && (
            <Reveal delay={0.12} className="mt-6">
              <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                {nextKickstart && (
                  <span>
                    Next Kickstart: {nextKickstart.label} · {formatKes(kickstart.priceKes)}
                  </span>
                )}
                {nextEssentials && <span className="text-white/65">Essentials: {nextEssentials.label}</span>}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.16} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={kickstart.landingPath} className="btn-ember w-full text-base sm:w-auto">
              Book the {formatKes(kickstart.priceKes)} session <ArrowUpRight size={18} />
            </Link>
            <a href="#options" className="btn-ghost w-full text-base sm:w-auto">
              Compare the options
            </a>
          </Reveal>
        </div>
      </section>

      {/* WHAT IT IS — one passage an AI assistant or a search engine can quote */}
      <section className="border-t border-white/10 bg-ink-800/30 py-16 md:py-24">
        <div className="container-px max-w-3xl">
          <Reveal as="h2" className="font-display text-3xl font-bold text-white md:text-4xl">
            What is the Cloudwise AI Productivity Training?
          </Reveal>
          <Reveal as="p" delay={0.05} className="mt-6 text-lg leading-relaxed text-white/75">
            It is hands-on AI training run by Cloudwise Limited, an ICT company at {formatAddress()}, and live
            online on Google Meet. There are three options. The AI Kickstart is two hours online on a Wednesday
            evening for {formatKes(kickstart.priceKes)}. AI Essentials is one Saturday morning, four hours, for{' '}
            {formatKes(essentials.priceKes)}. The AI Productivity Programme is two Saturday mornings, eight hours,
            for {formatKes(programme.priceKes)}. It is taught on Claude, on free accounts, with ChatGPT, Gemini and
            Copilot compared on the same task. In Essentials and the Programme, every participant builds their own
            AI assistant for the job that takes most of their week, and keeps it. Every class is paid in full when
            you book. Sessions are not recorded; you receive every prompt in writing, a certificate, and a WhatsApp
            support community with no end date.
          </Reveal>
        </div>
      </section>

      {/* OPTIONS */}
      <section id="options" className="scroll-mt-24 border-t border-white/10 bg-ink py-16 md:py-32">
        <div className="container-px">
          <div className="mb-12 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">Courses and prices</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
              Start small. Every step counts toward the next.
            </Reveal>
          </div>
          <TierLadder />
          <Reveal delay={0.1} className="mt-12">
            <ComparisonTable />
          </Reveal>
        </div>
      </section>

      {/* WHAT YOU BUILD */}
      <section className="border-t border-white/10 bg-ink-800/30 py-16 md:py-32">
        <div className="container-px grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal as="p" className="eyebrow mb-4">What you build</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
              Your own AI assistant, built for your job.
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
              An assistant set up once, for one recurring job, so it already knows who you are, what the job is,
              what it must never get wrong and what the finished work looks like. You build it in Claude during
              Essentials or Day One of the Programme, test it on your real work, and keep it.
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="card-dark overflow-hidden">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">The assistant you build, by where your time goes</caption>
                <thead className="bg-white/[0.04]">
                  <tr>
                    <th scope="col" className="p-4 font-medium text-white/65">Your time goes to</th>
                    <th scope="col" className="p-4 font-medium text-white/65">You build</th>
                  </tr>
                </thead>
                <tbody>
                  {TEN_ASSISTANTS.map(([task, assistant]) => (
                    <tr key={task} className="border-t border-white/10">
                      <td className="p-4 text-white/75">{task}</td>
                      <td className="p-4 font-medium text-white">{assistant}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TOOLS */}
      <section className="border-t border-white/10 bg-ink py-16 md:py-32">
        <div className="container-px">
          <div className="mb-12 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">The tools</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
              What we teach, and on which tools.
            </Reveal>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <div className="card-dark flex h-full items-center gap-4 p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember/10 font-display text-lg font-bold text-ember">
                    {t.name[0]}
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-white">{t.name}</h3>
                    <p className="text-sm text-white/65">{t.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-4">
            <p className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70">
              <Laptop size={18} className="shrink-0 text-ember" />
              <span>
                <strong className="text-white">Bring your laptop.</strong> Every session is hands-on, on your own
                work, from the first minute.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* PRIVATE AND TEAM */}
      <section className="border-t border-white/10 bg-ink-800/30 py-16 md:py-32">
        <div className="container-px">
          <Reveal>
            <div className="card-dark grid gap-8 p-8 md:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="eyebrow mb-4">Private and team training</p>
                <h2 className="text-balance font-display text-3xl font-bold text-white md:text-4xl">
                  Built around you, or around your team.
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-white/70">
                  Want it built around you alone? The private programme is eight hours, one-to-one, for{' '}
                  {formatKes(PRIVATE_PRICE_KES)}. Training a team of {TEAM_MIN_PEOPLE} or more?{' '}
                  {formatKes(TEAM_PRICE_PER_PERSON_KES)} per person, built on your own reports, tenders and
                  systems, with the syllabus sent for your approval first. Every team booking includes an AI use
                  policy template.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/ai-training/teams" className="btn-ember text-base">
                  See team and private training <ArrowUpRight size={18} />
                </Link>
                <a href={whatsappLink(TEAM_MSG)} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base">
                  Book a 30-minute call
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRAINER */}
      <section className="border-t border-white/10 bg-ink py-16 md:py-24">
        <div className="container-px max-w-4xl">
          <Reveal>
            <TrainerCard />
          </Reveal>
          <Reveal delay={0.05} className="mt-6">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-white/80">
              {['ICT and AI practitioners, not academics', 'Hands-on from the first minute', 'Taught on your own work'].map((x) => (
                <li key={x} className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-ember" /> {x}
                </li>
              ))}
              <li>
                <a
                  href={COMPANY_INFO.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-ember hover:underline"
                >
                  <Star size={18} fill="currentColor" /> Read our Google reviews
                </a>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <Testimonials eyebrow="Social proof" title="Organisations we’ve trained" />

      <Faq items={faqItems} eyebrow="FAQ" title="AI training, answered" />

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-ink py-16 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[55rem] -translate-x-1/2 rounded-full bg-ember/15 blur-3xl" />
        <div className="container-px relative text-center">
          <Reveal as="p" className="eyebrow mb-4">Not sure yet?</Reveal>
          <Reveal as="h2" className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold text-white md:text-6xl">
            Start with the {formatKes(kickstart.priceKes)} Kickstart.
          </Reveal>
          <Reveal as="p" delay={0.08} className="mx-auto mt-6 max-w-xl text-lg text-white/65">
            Two hours on a Wednesday evening, three real tasks done, and the {formatKes(kickstart.credit.amountKes)}{' '}
            counts toward Essentials or the Programme.
          </Reveal>
          <Reveal delay={0.14} className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href={kickstart.landingPath} className="btn-ember text-base">
              See the Kickstart <ArrowUpRight size={18} />
            </Link>
            <a href={whatsappLink(ASK_MSG)} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base">
              Ask a question on WhatsApp
            </a>
          </Reveal>
        </div>
      </section>

      <StickyBookBar href={kickstart.landingPath} label={`From ${formatKes(kickstart.priceKes)} · Book`} />
    </>
  );
}
