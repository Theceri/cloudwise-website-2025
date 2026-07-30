import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check, ExternalLink } from 'lucide-react';

import { CopyBlock } from '@/components/training/CopyBlock';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/anim/Reveal';
import { SITE_URL } from '@/lib/constants';
import {
  PROMPT_FRAMEWORK,
  PROMPT_LIBRARY,
  READINESS_ACCOUNTS,
  READINESS_STEPS,
  RESOURCE_INDEX,
  WARM_UP_PROMPTS,
  getResource,
} from '@/lib/resources';
import { TRACKS, TRACK_INDIVIDUAL, TRACK_WBH, formatDay, formatTime } from '@/lib/training';

export function generateStaticParams() {
  return RESOURCE_INDEX.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};

  return {
    title: `${resource.title} — Cloudwise AI Training`,
    description: resource.summary,
    alternates: { canonical: `/resources/${slug}` },
    openGraph: {
      title: resource.title,
      description: resource.summary,
      url: `${SITE_URL}/resources/${slug}`,
    },
  };
}

export default async function ResourcePage({ params }) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  return (
    <>
      <PageHero eyebrow={resource.tag} title={resource.title} subtitle={resource.summary} />

      <section className="border-t border-white/10 bg-ink py-20 md:py-28">
        <div className="container-px">
          <div className="mx-auto max-w-3xl">
            {slug === 'ai-readiness' && <ReadinessGuide />}
            {slug === 'prompt-pack' && <PromptPack />}
            {slug === 'session-prep' && <SessionPrep />}

            <Reveal delay={0.15} className="mt-16">
              <div className="rounded-3xl border border-ember/30 bg-ember/[0.07] p-8">
                <h2 className="font-display text-2xl font-bold text-white">
                  Want this built into your business, not just read about?
                </h2>
                <p className="mt-2 text-white/65">
                  That is what the training is. Two Saturdays, entirely hands-on, working on your
                  real tasks.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/ai-training/register" className="btn-ember text-base">
                    Register <ArrowUpRight size={18} />
                  </Link>
                  <Link href="/resources" className="btn-ghost text-base">
                    Other resources
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ children, id }) {
  return (
    <h2 id={id} className="mb-5 mt-14 font-display text-2xl font-bold text-white first:mt-0 md:text-3xl">
      {children}
    </h2>
  );
}

function Lead({ children }) {
  return <p className="mb-6 text-lg leading-relaxed text-white/70">{children}</p>;
}

function ReadinessGuide() {
  return (
    <article>
      <Lead>
        Twenty minutes of preparation is the difference between watching on the day and building on
        the day. Work through this before your session.
      </Lead>

      <SectionTitle>1. Open these accounts</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {READINESS_ACCOUNTS.map((account) => (
          <a
            key={account.name}
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-dark group p-5"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-white">{account.name}</h3>
              {account.required && (
                <span className="rounded-full bg-ember/15 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-eyebrow text-ember">
                  Required
                </span>
              )}
              <ExternalLink
                size={13}
                className="ml-auto text-white/25 transition-colors group-hover:text-white/60"
              />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{account.why}</p>
          </a>
        ))}
      </div>

      <SectionTitle>2. Come prepared</SectionTitle>
      <ol className="space-y-4">
        {READINESS_STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className="font-display text-2xl font-bold text-ember">{i + 1}</span>
            <span>
              <span className="block font-medium text-white">{step.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-white/55">{step.detail}</span>
            </span>
          </li>
        ))}
      </ol>

      <SectionTitle>3. The one habit that makes AI useful</SectionTitle>
      <Lead>{PROMPT_FRAMEWORK.intro}</Lead>
      <div className="rounded-2xl border border-ember/25 bg-ember/[0.06] p-6">
        <p className="eyebrow mb-4">{PROMPT_FRAMEWORK.title}</p>
        <ul className="space-y-3">
          {PROMPT_FRAMEWORK.parts.map((part) => (
            <li key={part.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-medium text-white">{part.label}</span>
              <span className="text-sm text-white/55">{part.example}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-5 text-white/70">{PROMPT_FRAMEWORK.rule}</p>
      <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-white/65">
        <strong className="text-white">One safety rule.</strong> {PROMPT_FRAMEWORK.safety}
      </p>

      <SectionTitle>4. Your 15-minute warm-up</SectionTitle>
      {WARM_UP_PROMPTS.map((warmUp) => (
        <div key={warmUp.title} className="mb-8">
          <h3 className="mb-3 font-display text-lg font-semibold text-white">{warmUp.title}</h3>
          <CopyBlock text={warmUp.prompt} />
          <p className="mt-3 text-sm text-white/55">{warmUp.note}</p>
        </div>
      ))}
    </article>
  );
}

function PromptPack() {
  return (
    <article>
      <Lead>
        Ten prompts that do real work. Copy one, change the details in brackets to your business,
        and paste it into any AI assistant. Then never accept the first draft.
      </Lead>

      <div className="rounded-2xl border border-ember/25 bg-ember/[0.06] p-6">
        <p className="eyebrow mb-4">{PROMPT_FRAMEWORK.title}</p>
        <ul className="space-y-3">
          {PROMPT_FRAMEWORK.parts.map((part) => (
            <li key={part.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-medium text-white">{part.label}</span>
              <span className="text-sm text-white/55">{part.example}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-white/65">{PROMPT_FRAMEWORK.safety}</p>
      </div>

      {PROMPT_LIBRARY.map((item) => (
        <section key={item.n} className="mt-14 border-t border-white/10 pt-10 first:border-0">
          <p className="font-mono text-[0.6rem] uppercase tracking-eyebrow text-ember">
            Prompt {String(item.n).padStart(2, '0')}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-white">{item.title}</h2>
          <p className="mt-2 text-white/55">
            <span className="text-white/40">Use it when:</span> {item.useWhen}
          </p>

          <div className="mt-5">
            <CopyBlock text={item.prompt} />
          </div>

          {item.note && (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/65">
              <strong className="text-white">Pro tip.</strong> {item.note}
            </p>
          )}

          {item.levelUp?.length > 0 && (
            <div className="mt-5">
              <p className="mb-2.5 font-mono text-[0.6rem] uppercase tracking-eyebrow text-white/40">
                Level it up — say this next
              </p>
              <ul className="space-y-2">
                {item.levelUp.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-white/70">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ember" />“{line}”
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}
    </article>
  );
}

function SessionPrep() {
  const individual = TRACKS[TRACK_INDIVIDUAL];
  const masterclass = TRACKS[TRACK_WBH];

  const bring = [
    'Your laptop and its charger — you cannot build on a phone',
    'Your phone',
    'One real task from your business we will solve live',
    'Your business profile or letterhead, if you have one',
    'The three tasks that eat most of your week, written down',
  ];

  return (
    <article>
      <Lead>
        Whichever session you are booked on, this is what the day looks like and what to have with
        you.
      </Lead>

      <SectionTitle>Bring these</SectionTitle>
      <ul className="space-y-3">
        {bring.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/80"
          >
            <Check size={18} className="mt-0.5 shrink-0 text-ember" />
            {item}
          </li>
        ))}
      </ul>

      <SectionTitle>The two formats</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-dark p-6">
          <h3 className="font-display text-lg font-semibold text-white">{individual.name}</h3>
          <p className="mt-2 text-sm text-white/55">{individual.durationLabel}</p>
          <p className="mt-1 text-sm text-white/55">Online, or {individual.venue}</p>
          <p className="mt-4 text-sm text-white/70">
            Two half-days a week apart. Day one is foundations and core tools; day two is the
            advanced workflows and building your own system. Come with real work — you will spend
            most of both sessions on it.
          </p>
        </div>
        <div className="card-dark p-6">
          <h3 className="font-display text-lg font-semibold text-white">{masterclass.name}</h3>
          <p className="mt-2 text-sm text-white/55">
            {formatDay(masterclass.eventDate, { long: true })} ·{' '}
            {formatTime(masterclass.eventStart)}–{formatTime(masterclass.eventEnd)}
          </p>
          <p className="mt-1 text-sm text-white/55">{masterclass.venue}</p>
          <p className="mt-4 text-sm text-white/70">
            One full day, in person, with Women Biz360 Hub. Arrive by 8:15 so we start on time.
            Lunch and refreshments are provided.
          </p>
        </div>
      </div>

      <SectionTitle>If you are joining online</SectionTitle>
      <ul className="space-y-3">
        {[
          'Your Zoom link arrives by email the day before — check spam if it has not.',
          'Use headphones. The hands-on stretches are much easier to follow with them.',
          'Find somewhere you can talk. You will be asked questions and encouraged to ask your own.',
          'Two screens, or a phone beside your laptop, makes following along far easier.',
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-white/75">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
            {item}
          </li>
        ))}
      </ul>

      <SectionTitle>Reaching us</SectionTitle>
      <p className="text-white/70">
        Reply to any email we have sent you, or{' '}
        <Link href="/contact" className="text-ember hover:underline">
          message us here
        </Link>
        . If something changes and you cannot make your date, tell us — we will move you to the next
        cohort rather than lose you.
      </p>
    </article>
  );
}
