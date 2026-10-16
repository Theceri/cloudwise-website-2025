import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Quote } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { COMPANY_INFO, SITE_URL } from '@/lib/constants';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { MIN_REVIEWS, REVIEWS_QUERY } from '@/lib/reviews';
import { TRACKS } from '@/lib/training';
import { client } from '@/sanity/lib/client';

export const revalidate = 3600;


export const metadata = {
  title: 'AI Training Reviews: What Participants Say',
  description: 'Named reviews from people who took the Cloudwise AI training in Nairobi and online, with their role and the course they took.',
  alternates: { canonical: '/ai-training/reviews' },
  openGraph: {
    type: 'website',
    siteName: 'Cloudwise',
    title: 'Cloudwise AI training — reviews',
    url: `${SITE_URL}/ai-training/reviews`,
    images: [{ url: '/og/ai-training.png', width: 1200, height: 630, alt: 'Cloudwise AI training' }],
  },
};

const COURSE = {
  kickstart: TRACKS.kickstart.name,
  essentials: TRACKS.essentials.name,
  individual: TRACKS.individual.name,
  private: 'Private one-to-one training',
  team: 'Team training',
};

function monthLabel(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Named reviews, each with the person's role, course and month. Built only from
 * reviews published in the Studio with written permission, and hidden until
 * there are at least three, so the page never looks empty or invented.
 */
export default async function ReviewsPage() {
  const reviews = await client.fetch(REVIEWS_QUERY).catch(() => []);
  if (reviews.length < MIN_REVIEWS) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          ['AI Training', '/ai-training'],
          ['Reviews', '/ai-training/reviews'],
        ])}
      />
      <section className="relative overflow-hidden pt-28 pb-12 md:pt-44 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
        <div className="container-px relative">
          <Reveal as="p" className="eyebrow mb-5">AI training · Reviews</Reveal>
          <Reveal as="h1" className="max-w-3xl text-balance font-display text-5xl font-bold leading-[1.02] text-white md:text-7xl">
            In their own words.
          </Reveal>
          <Reveal as="p" delay={0.08} className="mt-6 max-w-xl text-lg text-white/70">
            Every review here is from a named participant, published with their permission.
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink py-16 md:py-24">
        <div className="container-px grid gap-6 md:grid-cols-2">
          {reviews.map((r, i) => (
            <Reveal key={r._id} delay={(i % 2) * 0.06}>
              <figure className="card-dark relative h-full p-8">
                <Quote className="absolute right-7 top-7 text-ember/20" size={42} />
                <blockquote className="text-lg leading-relaxed text-white/80">“{r.quote}”</blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-5">
                  <span className="font-display font-semibold text-white">{r.name}</span>
                  <span className="ml-2 text-sm text-white/65">
                    · {[r.role, r.organization].filter(Boolean).join(', ')}
                  </span>
                  <span className="mt-1 block text-sm text-ember">
                    {COURSE[r.track] || 'AI training'} · {monthLabel(r.month)}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="container-px mt-12 flex flex-wrap gap-3">
          <Link href="/ai-training" className="btn-ember text-base">
            See courses and prices <ArrowUpRight size={18} />
          </Link>
          <a href={COMPANY_INFO.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base">
            Our Google reviews
          </a>
        </div>
      </section>
    </>
  );
}
