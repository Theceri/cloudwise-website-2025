import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { CertificateShowcase } from '@/components/certificate/CertificateShowcase';
import { PixelEvent } from '@/components/PixelEvent';
import { StickyBookBar } from '@/components/training/StickyBookBar';
import { TrainerCard } from '@/components/training/TrainerCard';
import { CheckList, FactTable, RunningOrder, Section, TierHero } from '@/components/training/TierPageParts';
import { SITE_URL, formatAddress } from '@/lib/constants';
import { META_CURRENCY, META_EVENTS } from '@/lib/meta/events';
import { JsonLd, breadcrumbJsonLd, courseJsonLd } from '@/lib/seo/jsonld';
import { DAY_ONE, POLICIES, TEN_ASSISTANTS, TIER_DETAILS } from '@/lib/training-content';
import { TRACKS, TRACK_ESSENTIALS, TRACK_KICKSTART, TRACK_PROGRAMME, formatKes, openDatesFor } from '@/lib/training';

export const revalidate = 3600;

const track = TRACKS[TRACK_ESSENTIALS];
const details = TIER_DETAILS[TRACK_ESSENTIALS];
const programme = TRACKS[TRACK_PROGRAMME];
const kickstart = TRACKS[TRACK_KICKSTART];

export const metadata = {
  title: 'AI Essentials: Build Your Own AI Assistant in One Saturday',
  description: `Four hands-on hours on Claude in Westlands, Nairobi, or online. Build an AI assistant for the job that eats your week, and use it on your real work. ${formatKes(track.priceKes)}.`,
  alternates: { canonical: '/ai-training/essentials' },
  openGraph: {
    type: 'website',
    siteName: 'Cloudwise',
    title: 'AI Essentials — leave with your own AI assistant',
    description: details.pitch,
    url: `${SITE_URL}/ai-training/essentials`,
    images: [{ url: '/og/essentials.png', width: 1200, height: 630, alt: 'Cloudwise AI Essentials' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og/essentials.png'] },
};

export default function EssentialsPage() {
  const dates = openDatesFor(TRACK_ESSENTIALS, { count: 3 });

  return (
    <>
      <JsonLd
        data={[
          courseJsonLd({
            path: '/ai-training/essentials',
            name: track.name,
            description: details.pitch,
            tiers: [TRACK_ESSENTIALS],
            dates: { [TRACK_ESSENTIALS]: dates },
          }),
          breadcrumbJsonLd([
            ['AI Training', '/ai-training'],
            ['Essentials', '/ai-training/essentials'],
          ]),
        ]}
      />
      <PixelEvent
        event={META_EVENTS.viewContent}
        params={{
          content_name: track.name,
          content_category: 'Training',
          content_type: 'product',
          content_ids: [TRACK_ESSENTIALS],
          value: track.priceKes,
          currency: META_CURRENCY,
        }}
      />

      <TierHero
        eyebrow={`AI Essentials · One Saturday · ${formatKes(track.priceKes)}`}
        title="Leave with your own AI assistant, built for your job."
        sub="Four hands-on hours on Claude. You build an assistant for the work that eats your week, then use it on a proposal, report or tender you actually have, with a trainer beside you."
        dates={dates}
        time="9:00am–1:00pm"
        cta={details.cta}
        ctaHref={track.registerPath}
        note={`${formatAddress()}, or live on Google Meet. Paid in full when you book.`}
      />

      <Section eyebrow="Your Saturday" title="Day One of the Programme, sold on its own.">
        <RunningOrder rows={DAY_ONE} caption="Essentials running order" />
      </Section>

      <Section eyebrow="The assistant you build" title="Where your time goes decides what you build." tone="soft">
        <div className="card-dark overflow-hidden">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">The assistant you build, by where your time goes</caption>
            <tbody>
              {TEN_ASSISTANTS.map(([task, assistant]) => (
                <tr key={task} className="border-t border-white/10 first:border-t-0">
                  <td className="p-4 text-white/75">{task}</td>
                  <td className="p-4 font-medium text-white">{assistant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Included" title="What you take home.">
        <CheckList items={details.includes} />
        <Reveal delay={0.1} className="mt-6 space-y-3">
          <p className="rounded-2xl border border-ember/30 bg-ember/[0.07] p-5 text-white/80">
            Your {formatKes(track.priceKes)} counts toward the full Programme for {track.credit.days} days, so Day
            Two costs {formatKes(programme.priceKes - track.credit.amountKes)}.
          </p>
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white/75">
            Did the Kickstart? Your {formatKes(kickstart.credit.amountKes)} counts here for {kickstart.credit.days}{' '}
            days, so Essentials costs {formatKes(track.priceKes - kickstart.credit.amountKes)}.
          </p>
        </Reveal>
      </Section>

      <CertificateShowcase track={TRACK_ESSENTIALS} title="A four-hour certificate employers can check." tone="ink" />

      <Section eyebrow="Your trainer" tone="soft">
        <TrainerCard />
      </Section>

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

      <StickyBookBar href={track.registerPath} label={`Reserve · ${formatKes(track.priceKes)}`} />
    </>
  );
}
