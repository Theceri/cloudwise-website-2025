import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

import { TRACKS, formatKes } from '@/lib/training';

import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/anim/Reveal';
import { PostCard } from '@/components/blog/PostCard';
import { CategoryPills } from '@/components/blog/CategoryPills';
import { sanityFetch } from '@/sanity/lib/fetch';
import { client } from '@/sanity/lib/client';
import {
  categoryBySlugQuery,
  postsByCategoryQuery,
  categoriesQuery,
  categorySlugsQuery,
} from '@/sanity/lib/queries';

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(categorySlugsQuery);
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await sanityFetch({
    query: categoryBySlugQuery,
    params: { slug },
    tags: ['category'],
  });
  if (!category) return { title: 'Category not found' };
  return {
    title: `${category.title} — Cloudwise Blog`,
    description:
      category.description ||
      `Articles in ${category.title} from the Cloudwise team.`,
    alternates: { canonical: `/blog/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const [category, posts, categories] = await Promise.all([
    sanityFetch({ query: categoryBySlugQuery, params: { slug }, tags: ['category'] }),
    sanityFetch({ query: postsByCategoryQuery, params: { slug }, tags: ['post'], fallback: [] }),
    sanityFetch({ query: categoriesQuery, tags: ['post', 'category'], fallback: [] }),
  ]);

  if (!category) notFound();

  return (
    <>
      <PageHero
        eyebrow="Category"
        title={category.title}
        subtitle={category.description || `Articles in ${category.title}.`}
      />

      <section className="border-t border-white/10 bg-ink py-8">
        <div className="container-px">
          <CategoryPills categories={categories} activeSlug={category.slug} />
        </div>
      </section>

      <section className="bg-ink pb-24 md:pb-32">
        <div className="container-px">
          {category.slug === 'ai-training' && (
            // Google already shows this page for "ai training" (Search Console,
            // 90 days to 12 October 2026), so it points straight at the course.
            <Reveal className="mb-10">
              <div className="flex flex-col gap-4 rounded-3xl border border-ember/30 bg-ember/[0.07] p-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-white/80">
                  <strong className="text-white">Looking for AI training in Nairobi?</strong> Cloudwise runs
                  hands-on courses on Claude: a two-hour Kickstart for {formatKes(TRACKS.kickstart.priceKes)}, a
                  Saturday Essentials class for {formatKes(TRACKS.essentials.priceKes)} and the full eight-hour
                  Programme. These articles come from the same work.
                </p>
                <Link href="/ai-training" className="btn-ember shrink-0 text-base">
                  See the AI training <ArrowUpRight size={18} />
                </Link>
              </div>
            </Reveal>
          )}
          {posts.length === 0 ? (
            <div className="py-24 text-center text-white/50">No posts in this category yet.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
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
