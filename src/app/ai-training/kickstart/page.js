import Link from 'next/link';
import { ArrowUpRight, Info, ShieldCheck } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { CertificateShowcase } from '@/components/certificate/CertificateShowcase';
import { Faq } from '@/components/Faq';
import { PixelEvent } from '@/components/PixelEvent';
import { StickyBookBar } from '@/components/training/StickyBookBar';
import { RunningOrder, Section, TierHero, ValueStack } from '@/components/training/TierPageParts';
import { SITE_URL } from '@/lib/constants';
import { META_CURRENCY, META_EVENTS } from '@/lib/meta/events';
import { JsonLd, breadcrumbJsonLd, courseJsonLd } from '@/lib/seo/jsonld';
import { KICKSTART_PROMISE, KICKSTART_RUNNING_ORDER, KICKSTART_STACK, NOT_A_JOB, TIER_DETAILS, hubFaq } from '@/lib/training-content';
import { TRACKS, TRACK_KICKSTART, formatKes, openDatesFor } from '@/lib/training';

// Sessions roll forward weekly; rebuilt hourly. The API refuses a closed one.
export const revalidate = 3600;

const track = TRACKS[TRACK_KICKSTART];
const details = TIER_DETAILS[TRACK_KICKSTART];

export const metadata = {
  title: 'AI Kickstart: 2-Hour AI Course with a Certificate, Ksh 500',
  description:
    'A two-hour live AI course on Google Meet, Wednesday 7–9pm. Finish three real tasks with Claude and leave with a Cloudwise certificate employers can check. Ksh 500, and it counts toward your next course.',
  alternates: { canonical: '/ai-training/kickstart' },
  openGraph: {
    type: 'website',
    siteName: 'Cloudwise',
    title: 'AI Kickstart: two hours, three tasks done, a certificate, Ksh 500',
    description: details.pitch,
    url: `${SITE_URL}/ai-training/kickstart`,
    images: [{ url: '/og/kickstart.png', width: 1200, height: 630, alt: 'Cloudwise AI Kickstart' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og/kickstart.png'] },
};

export default function KickstartPage() {
  const dates = openDatesFor(TRACK_KICKSTART, { count: 4 });
  const wanted = /job|certificate|accredited|pay\?|miss/i;
  const faqItems = hubFaq({ nextKickstart: dates[0]?.label }).filter((f) => wanted.test(f.q));

  return (
    <>
      <JsonLd
        data={[
          courseJsonLd({
            path: '/ai-training/kickstart',
            name: track.name,
            description: details.pitch,
            tiers: [TRACK_KICKSTART],
            dates: { [TRACK_KICKSTART]: dates },
          }),
          breadcrumbJsonLd([
            ['AI Training', '/ai-training'],
            ['Kickstart', '/ai-training/kickstart'],
          ]),
        ]}
      />
      <PixelEvent
        event={META_EVENTS.viewContent}
        params={{
          content_name: track.name,
          content_category: 'Training',
          content_type: 'product',
          content_ids: [TRACK_KICKSTART],
          value: track.priceKes,
          currency: META_CURRENCY,
        }}
      />

      <TierHero
        eyebrow={`AI Kickstart · Certificate course · Live on Google Meet`}
        title="Learn AI for work in two hours. Leave with a certificate."
        sub={`A live online class for ${formatKes(track.priceKes)}. You set up Claude, learn one prompt method that works and finish three real tasks with a Cloudwise trainer. Everyone who completes it gets a certificate that employers can check online and that goes on LinkedIn in one click.`}
        dates={dates}
        time="7:00–9:00pm EAT"
        cta={`Book for ${formatKes(track.priceKes)}`}
        ctaHref={track.registerPath}
        note={`Pay by M-Pesa. Booking closes at 5:00pm on the Wednesday. ${NOT_A_JOB.short}`}
      />

      <Section eyebrow={`Everything you get for ${formatKes(track.priceKes)}`} title="Real work done, and proof that you did it." tone="soft">
        <ValueStack
          rows={KICKSTART_STACK.rows}
          total={KICKSTART_STACK.total}
          price={track.priceKes}
          basis={KICKSTART_STACK.basis}
          formatKes={formatKes}
        />
        <Reveal delay={0.1} className="mt-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-ember/30 bg-ember/[0.07] p-6 sm:flex-row sm:items-start">
            <ShieldCheck size={28} className="shrink-0 text-ember" aria-hidden="true" />
            <div>
              <h3 className="font-display text-xl font-semibold text-white">{KICKSTART_PROMISE.title}</h3>
              <p className="mt-1.5 text-white/75">{KICKSTART_PROMISE.text}</p>
            </div>
          </div>
        </Reveal>
      </Section>

      <CertificateShowcase track={TRACK_KICKSTART} tone="ink" />

      <Section eyebrow="The two hours" title="What happens, minute by minute." tone="soft">
        <RunningOrder rows={KICKSTART_RUNNING_ORDER} caption="Kickstart running order" />
      </Section>

      <Section eyebrow="Who it suits" title="Job seekers, employees and business owners in Kenya.">
        <Reveal as="p" className="max-w-2xl text-lg leading-relaxed text-white/70">
          No tech background needed. A phone works; a laptop is better. Bring one real task you want off your
          plate, and leave with it done and a certificate to show for it. Sessions are live and not recorded; you
          receive every prompt in writing afterwards.
        </Reveal>
        <Reveal delay={0.08} className="mt-6 max-w-2xl">
          <p className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/80">
            <Info size={20} className="mt-0.5 shrink-0 text-ice" aria-hidden="true" />
            <span>
              <strong className="text-white">Please read: </strong>
              {NOT_A_JOB.long}
            </span>
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
          <Link href={track.registerPath} className="btn-ember text-base">
            {details.cta} <ArrowUpRight size={18} />
          </Link>
          <Link href="/ai-training#options" className="btn-ghost text-base">
            Compare all three options
          </Link>
        </Reveal>
      </Section>

      <Faq items={faqItems} eyebrow="FAQ" title="Before you book" />

      <StickyBookBar href={track.registerPath} label={`Book for ${formatKes(track.priceKes)}`} />
    </>
  );
}
