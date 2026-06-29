import Link from 'next/link';
import { Search } from 'lucide-react';

import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/anim/Reveal';
import { PostCard } from '@/components/blog/PostCard';
import { sanityFetch } from '@/sanity/lib/fetch';
import { searchPostsQuery } from '@/sanity/lib/queries';

export const metadata = {
  title: 'Search — Cloudwise Blog',
  description: 'Search articles on the Cloudwise blog.',
  alternates: { canonical: '/blog/search' },
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = (sp?.q || '').toString().trim();
  const results = q
    ? await sanityFetch({
        query: searchPostsQuery,
        params: { q: `*${q}*` },
        tags: ['post'],
        revalidate: 30,
        fallback: [],
      })
    : [];

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={q ? `Results for “${q}”` : 'Search the blog'}
        subtitle={q ? `${results.length} article${results.length === 1 ? '' : 's'} found.` : 'Find articles on AI, software and digital transformation.'}
      />

      <section className="border-t border-white/10 bg-ink py-8">
        <div className="container-px">
          <form action="/blog/search" className="relative max-w-xl">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search articles…"
              autoFocus
              className="w-full rounded-full border border-white/15 bg-ink py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/35 focus:border-ember focus:outline-none"
            />
          </form>
        </div>
      </section>

      <section className="bg-ink pb-24 md:pb-32">
        <div className="container-px">
          {!q ? (
            <div className="py-16 text-center text-white/45">Type a query above to search.</div>
          ) : results.length === 0 ? (
            <div className="py-16 text-center text-white/50">
              No articles match “{q}”.{' '}
              <Link href="/blog" className="text-ember hover:underline">Browse all posts</Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p, i) => (
                <Reveal key={p._id} delay={(i % 3) * 0.06}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
