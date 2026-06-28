import { notFound } from 'next/navigation';

import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/anim/Reveal';
import { PostCard } from '@/components/blog/PostCard';
import { AuthorCard } from '@/components/blog/AuthorCard';
import { sanityFetch } from '@/sanity/lib/fetch';
import { client } from '@/sanity/lib/client';
import {
  authorBySlugQuery,
  postsByAuthorQuery,
  authorSlugsQuery,
} from '@/sanity/lib/queries';

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(authorSlugsQuery);
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await sanityFetch({
    query: authorBySlugQuery,
    params: { slug },
    tags: ['author'],
  });
  if (!author) return { title: 'Author not found' };
  return {
    title: `${author.name} — Cloudwise Blog`,
    description: author.bio || `Articles by ${author.name}.`,
    alternates: { canonical: `/blog/author/${author.slug}` },
  };
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const [author, posts] = await Promise.all([
    sanityFetch({ query: authorBySlugQuery, params: { slug }, tags: ['author'] }),
    sanityFetch({ query: postsByAuthorQuery, params: { slug }, tags: ['post'], fallback: [] }),
  ]);

  if (!author) notFound();

  return (
    <>
      <PageHero eyebrow="Author" title={author.name} subtitle={author.role || undefined} />

      <section className="bg-ink pb-24 md:pb-32">
        <div className="container-px">
          <div className="mb-12 max-w-2xl">
            <AuthorCard author={author} link={false} />
          </div>

          {posts.length === 0 ? (
            <div className="py-12 text-center text-white/50">No posts yet.</div>
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
