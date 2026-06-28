import { notFound } from 'next/navigation';

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
