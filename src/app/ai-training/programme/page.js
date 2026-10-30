import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { CertificateShowcase } from '@/components/certificate/CertificateShowcase';
import { PixelEvent } from '@/components/PixelEvent';
import { Testimonials } from '@/components/Testimonials';
import { StickyBookBar } from '@/components/training/StickyBookBar';
import { TrainerCard } from '@/components/training/TrainerCard';
import { CheckList, FactTable, RunningOrder, Section, TierHero } from '@/components/training/TierPageParts';
import { SITE_URL, formatAddress } from '@/lib/constants';
import { META_CURRENCY, META_EVENTS } from '@/lib/meta/events';
import { JsonLd, breadcrumbJsonLd, courseJsonLd } from '@/lib/seo/jsonld';
import { DAY_ONE, DAY_TWO, POLICIES, TIER_DETAILS } from '@/lib/training-content';
import {
  PRIVATE_PRICE_KES,
  TRACKS,
  TRACK_KICKSTART,
  TRACK_PROGRAMME,
  formatKes,
  openDatesFor,
} from '@/lib/training';

export const revalidate = 3600;

const track = TRACKS[TRACK_PROGRAMME];
const details = TIER_DETAILS[TRACK_PROGRAMME];
const kickstart = TRACKS[TRACK_KICKSTART];

export const metadata = {
  title: 'AI Productivity Programme: 8-Hour AI Course in Nairobi',
  description: `Two Saturdays, 8 hours, on your own work. Build your own AI assistant on Day One, connect it to live tools on Day Two. ${formatKes(track.priceKes)} in Westlands, Nairobi, or online.`,
  alternates: { canonical: '/ai-training/programme' },
  openGraph: {
    type: 'website',
    siteName: 'Cloudwise',
    title: 'AI Productivity Programme — two Saturdays, your own AI assistant',
    description: details.pitch,
    url: `${SITE_URL}/ai-training/programme`,
    images: [{ url: '/og/programme.png', width: 1200, height: 630, alt: 'Cloudwise AI Productivity Programme' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og/programme.png'] },
};

export default function ProgrammePage() {
  const dates = openDatesFor(TRACK_PROGRAMME, { count: 3 });

  return (
    <>
      <JsonLd
        data={[
          courseJsonLd({
            path: '/ai-training/programme',
            name: track.name,
            description: details.pitch,
            tiers: [TRACK_PROGRAMME],
            dates: { [TRACK_PROGRAMME]: dates },
          }),
          breadcrumbJsonLd([
            ['AI Training', '/ai-training'],
            ['Programme', '/ai-training/programme'],
          ]),
        ]}
      />
      <PixelEvent
        event={META_EVENTS.viewContent}
        params={{
          content_name: track.name,
          content_category: 'Training',
          content_type: 'product',
          content_ids: [TRACK_PROGRAMME],
          value: track.priceKes,
          currency: META_CURRENCY,
        }}
      />

      <TierHero
        eyebrow={`AI Productivity Programme · Two Saturdays · ${formatKes(track.priceKes)}`}
        title="Build your own AI assistant. Then connect it to your work."
        sub="Two Saturdays, eight hours, every exercise on your own work. On Day One you build your own AI assistant. On Day Two you watch AI read a live CRM, invoices and a calendar, draft the follow-ups and stop for your approval, then you connect and upgrade your assistant."
        dates={dates}
        time="9:00am–1:00pm"
        cta={details.cta}
        ctaHref={track.registerPath}
        note={`${formatAddress()}, or live on Google Meet. Paid in full when you book.`}
      />

      <Section eyebrow="Day One" title="Make it work on your own work.">
        <RunningOrder rows={DAY_ONE} caption="Programme Day One" />
      </Section>

      <Section eyebrow="Day Two" title="Make it repeatable, connect it, and keep it." tone="soft">
        <RunningOrder rows={DAY_TWO} caption="Programme Day Two" />
        <Reveal delay={0.1} className="mt-6">
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/75">
            <strong className="text-white">Three things happen even if everything else is cut:</strong> your assistant
            is built and works, the connected workflow is seen end to end, and the confidentiality rules are taught.
          </p>
        </Reveal>
      </Section>

      <Section eyebrow="Included" title="Everything you take home.">
        <CheckList items={details.includes} />
      </Section>

      <Section eyebrow="Price" title={`${formatKes(track.priceKes)} per person.`} tone="soft">
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal className="card-dark p-7">
            <p className="eyebrow-muted">Cohort seat</p>
            <p className="mt-2 font-display text-4xl font-bold text-white">{formatKes(track.priceKes)}</p>
            <p className="mt-2 text-white/70">Two Saturdays with the group, in person or online. Paid in full when you book.</p>
          </Reveal>
          <Reveal delay={0.06} className="card-dark p-7">
            <p className="eyebrow-muted">Private one-to-one</p>
            <p className="mt-2 font-display text-4xl font-bold text-white">{formatKes(PRIVATE_PRICE_KES)}</p>
            <p className="mt-2 text-white/70">
              Eight hours with one person, rebuilt around your own work.{' '}
              <Link href="/ai-training/teams" className="text-ember hover:underline">
                See private and team training
              </Link>
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-6">
          <p className="rounded-2xl border border-ember/30 bg-ember/[0.07] p-5 text-white/80">
            Not sure yet? Try the {formatKes(kickstart.priceKes)} Kickstart first. It counts toward this price.
          </p>
        </Reveal>
      </Section>

      <CertificateShowcase track={TRACK_PROGRAMME} title="An eight-hour certificate employers can check." tone="ink" />

      <Section eyebrow="Your trainer">
        <TrainerCard />
      </Section>

      <Testimonials eyebrow="Social proof" title="Organisations we’ve trained" />

      <Section eyebrow="The small print" title="Policies, plainly.">
        <FactTable rows={POLICIES} caption="Booking policies" />
        <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
          <Link href={track.registerPath} className="btn-ember text-base">
            {details.cta} <ArrowUpRight size={18} />
          </Link>
          <Link href="/ai-training#options" className="btn-ghost text-base">
            Compare all three options
          </Link>
        </Reveal>
      </Section>

      <StickyBookBar href={track.registerPath} label={`Join · ${formatKes(track.priceKes)}`} />
    </>
  );
}
