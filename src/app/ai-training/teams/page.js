import { Reveal } from '@/components/anim/Reveal';
import { Gauge } from '@/components/anim/Gauge';
import { TeamEnquiryForm } from '@/components/training/TeamEnquiryForm';
import { TrainerCard } from '@/components/training/TrainerCard';
import { CheckList, Section } from '@/components/training/TierPageParts';
import { SITE_URL, whatsappLink } from '@/lib/constants';
import { JsonLd, breadcrumbJsonLd, ORGANIZATION_ID } from '@/lib/seo/jsonld';
import { TEAM_FORMATS, TEAM_INCLUDES, TRAINED_ORGANISATIONS } from '@/lib/training-content';
import { PRIVATE_PRICE_KES, TEAM_MIN_PEOPLE, TEAM_PRICE_PER_PERSON_KES, formatKes } from '@/lib/training';

export const metadata = {
  title: 'Corporate AI Training in Kenya for Teams',
  description: `AI training for your team, built on your own reports, tenders and systems. ${formatKes(TEAM_PRICE_PER_PERSON_KES)} per person for ${TEAM_MIN_PEOPLE} or more, or private one-to-one for ${formatKes(PRIVATE_PRICE_KES)}. Nairobi and online.`,
  alternates: { canonical: '/ai-training/teams' },
  openGraph: {
    type: 'website',
    siteName: 'Cloudwise',
    title: 'Corporate AI training in Kenya — built on your team’s own work',
    description: 'Team programmes, executive briefings, Microsoft 365 and Copilot days, and private one-to-one training.',
    url: `${SITE_URL}/ai-training/teams`,
    images: [{ url: '/dt-banner-5.png', width: 1200, height: 630, alt: 'Cloudwise team AI training' }],
  },
  twitter: { card: 'summary_large_image', images: ['/dt-banner-5.png'] },
};

const CALL_MSG = "Hi Cloudwise, I'd like to book a 30-minute call about AI training for my team.";

export default function TeamsPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Corporate and team AI training',
            serviceType: 'AI training for teams',
            provider: { '@type': 'Organization', '@id': ORGANIZATION_ID },
            areaServed: { '@type': 'Country', name: 'Kenya' },
            url: `${SITE_URL}/ai-training/teams`,
            offers: [
              {
                '@type': 'Offer',
                name: 'Team programme, per person',
                price: String(TEAM_PRICE_PER_PERSON_KES),
                priceCurrency: 'KES',
                eligibleQuantity: { '@type': 'QuantitativeValue', minValue: TEAM_MIN_PEOPLE },
              },
              { '@type': 'Offer', name: 'Private one-to-one, 8 hours', price: String(PRIVATE_PRICE_KES), priceCurrency: 'KES' },
            ],
          },
          breadcrumbJsonLd([
            ['AI Training', '/ai-training'],
            ['Teams', '/ai-training/teams'],
          ]),
        ]}
      />

      <section id="hero" className="relative overflow-hidden pt-28 pb-16 md:pt-44 md:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
        <div className="pointer-events-none absolute -right-24 top-24 opacity-20 md:opacity-60">
          <Gauge size={380} />
        </div>
        <div className="container-px relative">
          <Reveal as="p" className="eyebrow mb-5">Private and team training</Reveal>
          <Reveal as="h1" className="max-w-4xl text-balance font-display text-5xl font-bold leading-[1.02] text-white md:text-7xl">
            AI training for your team, built on your own work.
          </Reveal>
          <Reveal as="p" delay={0.08} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Training a team of {TEAM_MIN_PEOPLE} or more? {formatKes(TEAM_PRICE_PER_PERSON_KES)} per person, built
            around your own reports, tenders and systems, with the syllabus sent for your approval before the day.
            Want it built around one person? Private one-to-one training is {formatKes(PRIVATE_PRICE_KES)}.
          </Reveal>
          <Reveal delay={0.12} className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="btn-ember text-base">
              Request a proposal
            </a>
            <a href={whatsappLink(CALL_MSG)} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base">
              Book a 30-minute call
            </a>
          </Reveal>
        </div>
      </section>

      <Section eyebrow="Formats" title="Four ways to train a team." tone="soft">
        <div className="card-dark overflow-hidden">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Team training formats and fees</caption>
            <thead className="hidden bg-white/[0.04] md:table-header-group">
              <tr>
                {['Format', 'Length', 'Fee', 'Note'].map((h) => (
                  <th key={h} scope="col" className="p-4 font-medium text-white/65">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM_FORMATS.map(([format, hours, fee, note]) => (
                <tr key={format} className="block border-t border-white/10 p-4 md:table-row md:p-0">
                  <th scope="row" className="block font-display font-semibold text-white md:table-cell md:p-4">
                    {format}
                  </th>
                  <td className="block text-white/70 md:table-cell md:p-4">{hours}</td>
                  <td className="block font-medium text-ember md:table-cell md:p-4">{fee}</td>
                  <td className="block text-white/65 md:table-cell md:p-4">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Private one-to-one" title={`${formatKes(PRIVATE_PRICE_KES)} for eight hours, one person.`}>
        <Reveal as="p" className="max-w-3xl text-lg leading-relaxed text-white/70">
          Rebuilt around your own work, in two-hour or four-hour sittings. It is also where the deeper material
          lives: Claude Design and HeyGen hands-on, Claude Skills, a full proposal on your own letterhead, and a
          one-page website built with Claude Code.
        </Reveal>
      </Section>

      <Section eyebrow="Every team booking includes" title="From the first call to the follow-up clinic." tone="soft">
        <CheckList items={TEAM_INCLUDES} />
      </Section>

      <Section eyebrow="Data protection" title="What your staff will and will not paste into AI.">
        <Reveal as="p" className="max-w-3xl text-lg leading-relaxed text-white/70">
          Every team day teaches what must never go into a public AI tool, how to strip the identity from a
          document and keep its shape, and what the Kenya Data Protection Act, 2019 requires. Each booking includes
          an AI use policy template your team can adopt. An NGO version of the training is available on request.
        </Reveal>
      </Section>

      <Section eyebrow="Organisations we have trained" tone="soft">
        <ul className="flex flex-wrap gap-3">
          {TRAINED_ORGANISATIONS.map((org) => (
            <li key={org} className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 font-display text-white">
              {org}
            </li>
          ))}
        </ul>
        <div className="mt-10 max-w-4xl">
          <TrainerCard />
        </div>
      </Section>

      <Section id="enquire" eyebrow="Request a proposal" title="Tell us about your team.">
        <div className="max-w-3xl">
          <TeamEnquiryForm />
        </div>
      </Section>
    </>
  );
}
