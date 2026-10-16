import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { PixelEvent } from '@/components/PixelEvent';
import { StickyBookBar } from '@/components/training/StickyBookBar';
import { CheckList, RunningOrder, Section, TierHero } from '@/components/training/TierPageParts';
import { SITE_URL } from '@/lib/constants';
import { META_CURRENCY, META_EVENTS } from '@/lib/meta/events';
import { JsonLd, breadcrumbJsonLd, courseJsonLd } from '@/lib/seo/jsonld';
import { KICKSTART_RUNNING_ORDER, TIER_DETAILS } from '@/lib/training-content';
import { TRACKS, TRACK_KICKSTART, formatKes, openDatesFor } from '@/lib/training';

// Sessions roll forward weekly; rebuilt hourly. The API refuses a closed one.
export const revalidate = 3600;

const track = TRACKS[TRACK_KICKSTART];
const details = TIER_DETAILS[TRACK_KICKSTART];

export const metadata = {
  title: 'AI Kickstart: 2-Hour Live AI Class for Ksh 500',
  description:
    'Two hours live on Google Meet, Wednesday 7–9pm. Set up Claude, learn one prompt method that works, and finish three real tasks. Ksh 500, and it counts toward your next course.',
  alternates: { canonical: '/ai-training/kickstart' },
  openGraph: {
    type: 'website',
    siteName: 'Cloudwise',
    title: 'AI Kickstart — two hours, three tasks done, Ksh 500',
    description: details.pitch,
    url: `${SITE_URL}/ai-training/kickstart`,
    images: [{ url: '/og/kickstart.png', width: 1200, height: 630, alt: 'Cloudwise AI Kickstart' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og/kickstart.png'] },
};

export default function KickstartPage() {
  const dates = openDatesFor(TRACK_KICKSTART, { count: 4 });

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
        eyebrow={`AI Kickstart · Live on Google Meet · ${formatKes(track.priceKes)}`}
        title={`Two hours. Three tasks done. ${formatKes(track.priceKes)}.`}
        sub="A live online session for people who have heard about AI but have not made it useful yet. You set up Claude, learn one prompt method that works, and use it on your own work while a Cloudwise trainer guides you."
        dates={dates}
        time="7:00–9:00pm EAT"
        cta={`Book for ${formatKes(track.priceKes)}`}
        ctaHref={track.registerPath}
        note="Pay by M-Pesa in under a minute. Your Google Meet link arrives on WhatsApp and email."
      />

      <Section eyebrow="You leave with" title="Real work done, not a demo." tone="soft">
        <CheckList
          items={[
            'Claude set up on your phone or laptop',
            'A week of social posts drafted',
            'A difficult customer answered',
            'A long document summarised',
            'The Starter Prompt Pack (10 prompts)',
            `A ${formatKes(track.credit.amountKes)} credit toward Essentials or the Programme, for ${track.credit.days} days`,
          ]}
        />
      </Section>

      <Section eyebrow="The two hours" title="What happens, minute by minute.">
        <RunningOrder rows={KICKSTART_RUNNING_ORDER} caption="Kickstart running order" />
      </Section>

      <Section eyebrow="Who it suits" title="Business owners, employees and job seekers in Kenya." tone="soft">
        <Reveal as="p" className="max-w-2xl text-lg leading-relaxed text-white/70">
          No tech background needed. A phone works; a laptop is better. Bring one real task you want off your
          plate, and leave with it done. Sessions are live and not recorded; you receive every prompt in writing
          afterwards.
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

      <StickyBookBar href={track.registerPath} label={`Book for ${formatKes(track.priceKes)}`} />
    </>
  );
}
