import Link from 'next/link';
import { Search } from 'lucide-react';

import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/anim/Reveal';
import { PostCard } from '@/components/blog/PostCard';
import { CategoryPills } from '@/components/blog/CategoryPills';
import { Pagination } from '@/components/blog/Pagination';
import { sanityFetch } from '@/sanity/lib/fetch';
import { postsQuery, categoriesQuery } from '@/sanity/lib/queries';

export const metadata = {
  title: 'Blog — AI, Software & Digital Transformation Insights',
  description:
    'Practical insights, tutorials and trends on AI, web & mobile development, cloud and digital transformation from the Cloudwise team.',
  alternates: { canonical: '/blog' },
};

const PAGE_SIZE = 9;

export default async function BlogPage({ searchParams }) {
  const sp = await searchParams;
  const [posts, categories] = await Promise.all([
    sanityFetch({ query: postsQuery, tags: ['post'], fallback: [] }),
    sanityFetch({ query: categoriesQuery, tags: ['post', 'category'], fallback: [] }),
  ]);

  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const hasPosts = posts.length > 0;
  const featured = hasPosts ? posts[0] : null;
  const rest = hasPosts ? posts.slice(1) : [];
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = rest.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Ideas on AI, software & digital transformation."
        subtitle="Practical insights, tutorials and trends from the Cloudwise team to help you stay ahead."
      />

      {/* Filter + search bar */}
      <section className="border-t border-white/10 bg-ink py-8">
        <div className="container-px flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CategoryPills categories={categories} activeSlug={null} />
          <form action="/blog/search" className="relative w-full lg:w-72">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              name="q"
              type="search"
              placeholder="Search articles…"
              className="w-full rounded-full border border-white/15 bg-ink py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-ember focus:outline-none"
            />
          </form>
        </div>
      </section>

      <section className="bg-ink pb-24 md:pb-32">
        <div className="container-px">
          {!hasPosts ? (
            <div className="py-24 text-center text-white/50">No posts yet — check back soon.</div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {current === 1 && featured && <PostCard post={featured} featured priority />}
                {pageItems.map((p, i) => (
                  <Reveal key={p._id} delay={(i % 2) * 0.06}>
                    <PostCard post={p} />
                  </Reveal>
                ))}
              </div>
              <Pagination currentPage={current} totalPages={totalPages} basePath="/blog" />
            </>
          )}
        </div>
      </section>

      <CtaBand
        title="Need expert guidance?"
        subtitle="Ready to put these ideas to work? Let’s talk about your goals."
        primary={{ label: 'Get a free consultation', href: '/contact' }}
      />
    </>
  );
}
