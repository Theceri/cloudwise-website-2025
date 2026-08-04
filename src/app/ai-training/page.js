import Link from 'next/link';
import {
  Clock, Sparkles, FileText, Users, Gift, Check, ArrowUpRight,
  CalendarDays, MapPin, Laptop, BookOpen, PlayCircle, ShieldCheck,
} from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';
import { AnimatedHeading } from '@/components/anim/AnimatedHeading';
import { Gauge } from '@/components/anim/Gauge';
import { Faq } from '@/components/Faq';
import { Testimonials } from '@/components/Testimonials';
import { SITE_URL, COMPANY_INFO, whatsappLink } from '@/lib/constants';
import { TRACK_INDIVIDUAL, TRACKS, formatKes, listOpenCohorts } from '@/lib/training';

// The next-cohort strip is derived from today's date, so this page cannot be
// baked at build time without eventually advertising dates that have passed.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AI Productivity Training in Nairobi — Work Smarter with AI',
  description:
    'Hands-on AI productivity training by Cloudwise. Two Saturday sessions every month (1st & 2nd Saturday, 9am–1pm), online or in Nairobi. Ksh 13,500 — includes a 1-month Claude subscription, toolkit & support community.',
  alternates: { canonical: '/ai-training' },
  openGraph: {
    title: 'Cloudwise AI Productivity Training — Work Smarter with AI',
    description:
      'Practical, hands-on AI training for you and your team. Every 1st & 2nd Saturday. Includes a 1-month Claude subscription.',
    url: `${SITE_URL}/ai-training`,
  },
};

const REGISTER_MSG =
  "Hi Cloudwise, I'd like to register for the AI Productivity Training. Please share the next cohort dates and payment details.";

const VALUE_STACK = [
  { icon: Clock, title: '8 Hours of Live AI Training', desc: '2 full sessions — in-person or online. Practical and hands-on.', worth: 'Worth 20K' },
  { icon: Sparkles, title: '1-Month Claude AI Subscription', desc: "One of the world's most powerful AI assistants, included.", worth: 'Worth 3K' },
  { icon: FileText, title: 'AI Toolkit & Resource Pack', desc: 'Curated prompts, templates & workflow guides to keep.', worth: 'Worth 5K' },
  { icon: Users, title: 'Post-Training Support Group', desc: 'A WhatsApp community for ongoing Q&A after training.', worth: 'Priceless' },
];

const DAY_ONE = [
  'What AI actually is — and what it isn’t',
  'Getting started with Claude, ChatGPT & Gemini',
  'Writing prompts that get real results',
  'AI for writing: emails, reports, proposals',
  'AI for research & information gathering',
  'Hands-on practice with your real tasks',
];
const DAY_TWO = [
  'AI for marketing: social media, ads & content',
  'AI for data: analysing reports & spreadsheets',
  'Building automations with AI tools',
  'AI for customer service & communication',
  'Ethical AI use & avoiding mistakes',
  'Building your personal AI system',
];

const TOOLS = [
  { name: 'Claude', desc: 'Writing, analysis, research & reasoning' },
  { name: 'ChatGPT', desc: 'Conversations, drafting & ideation' },
  { name: 'Gemini', desc: 'Google integration & real-time search' },
  { name: 'Perplexity', desc: 'AI-powered research & fact-finding' },
  { name: 'Image AI', desc: 'Midjourney & DALL·E for visuals' },
  { name: 'Automation', desc: 'Zapier + Make AI workflows' },
];

const WHO = [
  'You run or work in a business and want to save hours every week',
  'You’ve heard about AI but have no idea where to start',
  'You want to stay ahead — not get left behind',
  'You want practical skills — not just theory',
];

const RESOURCES = [
  { tag: 'Before', icon: BookOpen, title: 'AI Readiness Guide', desc: 'Account setup for Claude, ChatGPT & Gemini, plus 3 warm-up exercises. Sent via WhatsApp.' },
  { tag: 'During', icon: Laptop, title: 'Live Workbook + Prompt Library', desc: 'Every exercise plus 50+ curated prompts organised by use case — yours to keep.' },
  { tag: 'After', icon: PlayCircle, title: 'Recording + Toolkit + Community', desc: 'Session recordings, an AI cheat-sheet, and the Cloudwise AI WhatsApp support group.' },
];

const FAQ_ITEMS = [
  { q: 'When does the training happen?', a: 'Every month. The two sessions run on the first Saturday and the second Saturday of each month, 9am–1pm each (4 hours per session). The exact dates for every open cohort are listed on the registration page — pick the pair that suits you.' },
  { q: 'Is it online or in person?', a: 'Both. You can join live online via Zoom, or attend in person at our Nairobi office (4th Floor, Delta Annex, Delta Corner, Waiyaki Way). Choose whichever suits you when you register.' },
  { q: 'How much does it cost and what’s included?', a: 'Ksh 13,500 per person (introductory price; normally Ksh 30,000). It includes 8 hours of live training, a 1-month Claude AI subscription, an AI toolkit & prompt library, session recordings, and access to our WhatsApp support community.' },
  { q: 'Do I need a tech background?', a: 'No. The training is designed for everyday business people. If you can use a browser and send an email, you can do this. Every session is hands-on with your real tasks.' },
  { q: 'What should I bring?', a: 'A laptop or tablet with internet access. Every session is hands-on — you’ll be practising live on real tools from minute one.' },
  { q: 'Can you train my whole team?', a: 'Yes. We run private team and organisation trainings tailored to your workflows — we’ve trained teams including TechCamp and Stratostaff. Message us to arrange a session.' },
  { q: 'How do I pay?', a: 'Register on the website and pay by M-Pesa or card on the next screen. With M-Pesa you get a prompt on your phone — and if it doesn’t arrive, the paybill and account number are right there so you can pay directly. Your confirmation and preparation pack are emailed the moment payment clears.' },
];

const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Cloudwise AI Productivity Training',
  description:
    'A hands-on training that gives you and your team the exact skills to use Artificial Intelligence for real business results. No tech background required.',
  provider: {
    '@type': 'Organization',
    name: COMPANY_INFO.legalName,
    sameAs: SITE_URL,
  },
  offers: {
    '@type': 'Offer',
    price: '13500',
    priceCurrency: 'KES',
    category: 'Paid',
    url: `${SITE_URL}/ai-training`,
    availability: 'https://schema.org/InStock',
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: ['Online', 'Onsite'],
    courseWorkload: 'PT8H',
    courseSchedule: {
      '@type': 'Schedule',
      repeatFrequency: 'P1M',
      byDay: 'https://schema.org/Saturday',
      startTime: '09:00',
      endTime: '13:00',
      description: 'First and second Saturday of every month',
    },
    location: {
      '@type': 'Place',
      name: 'Cloudwise, Delta Annex, Delta Corner',
      address: '4th Floor, Delta Annex, Delta Corner, Waiyaki Way, Nairobi, Kenya',
    },
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function AiTrainingPage() {
  const cohorts = listOpenCohorts({ count: 3 });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
        <div className="pointer-events-none absolute -right-24 top-24 opacity-50 md:opacity-70">
          <Gauge size={420} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid-lg opacity-30" />

        <div className="container-px relative">
          <Reveal as="p" className="eyebrow mb-5">AI Productivity Training · Nairobi</Reveal>
          <AnimatedHeading
            as="h1"
            text="Work Smarter with AI."
            className="max-w-3xl text-balance font-display text-5xl font-bold leading-[1.0] text-white md:text-7xl lg:text-8xl"
          />
          <Reveal as="p" delay={0.1} className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">
            A hands-on training that gives you — and your team — the exact skills to use
            Artificial Intelligence for real business results. No tech background required.
          </Reveal>

          <Reveal delay={0.16} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/ai-training/register" className="btn-ember text-base">
              Register &amp; pay online <ArrowUpRight size={18} />
            </Link>
            <a href="#curriculum" className="btn-ghost text-base">See the curriculum</a>
          </Reveal>

          {/* price + schedule cards */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
            <Reveal className="card-dark flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-white/40 line-through">Was Ksh 30,000</p>
                <p className="font-display text-4xl font-bold text-white">Ksh 13,500</p>
                <p className="mt-1 text-sm text-white/50">per person · incl. 1-month Claude</p>
              </div>
              <span className="rounded-full bg-ember px-3 py-2 text-center font-mono text-xs font-bold leading-tight text-white">
                SAVE<br />55%
              </span>
            </Reveal>
            <Reveal delay={0.08} className="card-dark space-y-3 p-6 text-sm">
              <p className="flex items-center gap-3 text-white/80"><CalendarDays size={16} className="text-ember" /> Every 1st &amp; 2nd Saturday · 9am–1pm</p>
              <p className="flex items-center gap-3 text-white/80"><MapPin size={16} className="text-ember" /> Online (Zoom) or in-person, Nairobi</p>
              <p className="flex items-center gap-3 text-white/80"><Laptop size={16} className="text-ember" /> 100% hands-on — bring your laptop</p>
            </Reveal>
          </div>

          {/* Next cohorts — the single most-asked question, answered up front. */}
          {cohorts.length > 0 && (
            <Reveal delay={0.2} className="mt-6 lg:max-w-3xl">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-eyebrow text-white/40">
                  Next cohorts
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {cohorts.map((cohort, i) => (
                    <li key={cohort.id} className="flex items-center gap-2 text-sm text-white/75">
                      <span className={i === 0 ? 'h-1.5 w-1.5 rounded-full bg-ember' : 'h-1.5 w-1.5 rounded-full bg-white/25'} />
                      {cohort.label}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* WOMEN BIZ360 CROSS-LINK */}
      <section className="border-t border-white/10 bg-ink-800/30 py-10">
        <div className="container-px">
          <Link
            href="/women-biz360"
            className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-ember/40 hover:bg-ember/[0.05]"
          >
            <div>
              <p className="eyebrow mb-1.5">Women Biz360 Hub × Cloudwise</p>
              <p className="font-display text-lg font-semibold text-white">
                A women-only full-day masterclass, {formatKes(TRACKS['wbh-masterclass'].priceKes)}
              </p>
              <p className="mt-1 text-sm text-white/55">
                Run with our partner for women entrepreneurs. Same hands-on approach, one full day.
              </p>
            </div>
            <span className="flex items-center gap-2 text-sm font-medium text-ember">
              See the masterclass
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* VALUE STACK */}
      <section className="border-t border-white/10 bg-ink-800/30 py-24 md:py-32">
        <div className="container-px">
          <div className="mb-14 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">The value stack</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
              Everything included in your Ksh 13,500.
            </Reveal>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUE_STACK.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="card-dark flex h-full items-start gap-5 p-7">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-ember/10 text-ember">
                    <v.icon size={22} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-lg font-semibold text-white">{v.title}</h3>
                      <span className="font-mono text-[0.65rem] uppercase tracking-eyebrow text-ember">{v.worth}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{v.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* bonus */}
          <Reveal delay={0.1} className="mt-4">
            <div className="flex items-start gap-5 rounded-3xl border border-ember/30 bg-ember/[0.07] p-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ember text-white">
                <Gift size={22} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-ember px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-eyebrow text-white">Bonus</span>
                  <h3 className="font-display text-lg font-semibold text-white">Free Pre-Training AI Readiness Guide</h3>
                </div>
                <p className="mt-2 text-sm text-white/65">Sent to you before Day 1 so you arrive ready to hit the ground running.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="curriculum" className="border-t border-white/10 bg-ink py-24 md:py-32">
        <div className="container-px">
          <div className="mb-14 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">How it works</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
              Your 2-day training schedule.
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-5 text-white/55">
              Two focused Saturday sessions — 4 hours each — on the first and second Saturday of the month.
            </Reveal>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {[
              { day: 'Day One', label: 'AI Foundations & Core Tools', list: DAY_ONE },
              { day: 'Day Two', label: 'Advanced Workflows & Business AI', list: DAY_TWO },
            ].map((d, i) => (
              <Reveal key={d.day} delay={i * 0.08}>
                <div className="card-dark h-full p-8">
                  <div className="mb-6 flex items-baseline gap-3">
                    <span className="font-display text-5xl font-bold text-ember">{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-eyebrow text-white/40">{d.day} · Saturday · 9am–1pm</p>
                      <h3 className="font-display text-xl font-semibold text-white">{d.label}</h3>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {d.list.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-white/75">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="border-t border-white/10 bg-ink-800/30 py-24 md:py-32">
        <div className="container-px">
          <div className="mb-14 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">What you’ll use</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
              The AI tools we’ll master together.
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
                    <p className="text-sm text-white/50">{t.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-4">
            <p className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70">
              <Laptop size={18} className="shrink-0 text-ember" />
              <span><strong className="text-white">Please bring your laptop.</strong> Every session is hands-on — you’ll practise live on real tools from minute one.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHO + RESOURCES */}
      <section className="border-t border-white/10 bg-ink py-24 md:py-32">
        <div className="container-px grid gap-16 lg:grid-cols-2">
          <div>
            <Reveal as="p" className="eyebrow mb-4">Who should attend</Reveal>
            <Reveal as="h2" delay={0.05} className="mb-8 text-balance font-display text-3xl font-bold text-white md:text-4xl">
              This training is for you if…
            </Reveal>
            <ul className="space-y-4">
              {WHO.map((w, i) => (
                <Reveal key={w} delay={i * 0.06}>
                  <li className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/80">
                    <Check size={18} className="mt-0.5 shrink-0 text-ember" /> {w}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <Reveal as="p" className="eyebrow mb-4">Before, during &amp; after</Reveal>
            <Reveal as="h2" delay={0.05} className="mb-8 text-balance font-display text-3xl font-bold text-white md:text-4xl">
              Resources you’ll keep.
            </Reveal>
            <div className="space-y-4">
              {RESOURCES.map((r, i) => (
                <Reveal key={r.title} delay={i * 0.06}>
                  <div className="card-dark flex items-start gap-4 p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember/10 text-ember">
                      <r.icon size={20} />
                    </div>
                    <div>
                      <span className="font-mono text-[0.6rem] uppercase tracking-eyebrow text-ember">{r.tag}</span>
                      <h3 className="font-display font-semibold text-white">{r.title}</h3>
                      <p className="mt-1 text-sm text-white/55">{r.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CLOUDWISE */}
      <section className="border-t border-white/10 bg-ink-800/30 py-24 md:py-32">
        <div className="container-px grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal as="p" className="eyebrow mb-4">Why Cloudwise</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
              Trained by ICT practitioners, not academics.
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
              Cloudwise is a Nairobi-based ICT company with hands-on experience building AI-powered
              products for businesses across East Africa. We teach what actually works in real
              business environments.
            </Reveal>
            <ul className="mt-7 space-y-3">
              {['Certified ICT & AI practitioners', 'Trained organisations including TechCamp & Stratostaff', '100% hands-on — no filler theory'].map((x) => (
                <li key={x} className="flex items-center gap-3 text-white/80">
                  <ShieldCheck size={18} className="text-ember" /> {x}
                </li>
              ))}
            </ul>
          </div>
          <Reveal delay={0.1}>
            <div className="card-dark p-10 text-center">
              <p className="font-display text-7xl font-bold text-gradient-ember">100%</p>
              <p className="mt-3 text-lg text-white/70">Hands-on. No filler theory.</p>
              <p className="mt-1 text-sm text-white/45">Every minute on real tools, your real tasks.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <Testimonials eyebrow="Social proof" title="Organisations we’ve trained" />

      <Faq items={FAQ_ITEMS} eyebrow="FAQ" title="AI training, answered" />

      {/* REGISTER CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-ink py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[55rem] -translate-x-1/2 rounded-full bg-ember/15 blur-3xl" />
        <div className="container-px relative text-center">
          <Reveal as="p" className="eyebrow mb-4">Register today</Reveal>
          <Reveal as="h2" className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold text-white md:text-6xl">
            Ready to work smarter with AI?
          </Reveal>
          <Reveal as="p" delay={0.08} className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            Secure your seat — introductory pricing closes once the cohort is full. Payment includes
            your 1-month Claude subscription.
          </Reveal>
          <Reveal delay={0.14} className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/ai-training/register" className="btn-ember text-base">
              Register &amp; pay · {formatKes(TRACKS[TRACK_INDIVIDUAL].priceKes)} <ArrowUpRight size={18} />
            </Link>
            <a href={whatsappLink(REGISTER_MSG)} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base">
              Ask a question on WhatsApp
            </a>
          </Reveal>
          <p className="mt-6 font-mono text-xs uppercase tracking-eyebrow text-white/35">
            Saturdays · 9am–1pm · 1st &amp; 2nd Saturday monthly · Online or in-person, Nairobi
          </p>
        </div>
      </section>
    </>
  );
}
