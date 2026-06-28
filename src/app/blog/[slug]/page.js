import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { PortableText } from '@/components/blog/PortableText';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { AuthorCard } from '@/components/blog/AuthorCard';
import { PostCard } from '@/components/blog/PostCard';
import { Comments } from '@/components/blog/Comments';
import { extractHeadings } from '@/components/blog/ptHelpers';
import { sanityFetch } from '@/sanity/lib/fetch';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import {
  postBySlugQuery,
  postSlugsQuery,
  relatedPostsQuery,
  approvedCommentsQuery,
} from '@/sanity/lib/queries';
import { formatDate } from '@/lib/utils';
import { SITE_URL } from '@/lib/constants';

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(postSlugsQuery);
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await sanityFetch({
    query: postBySlugQuery,
    params: { slug },
    tags: [`post:${slug}`],
  });
  if (!post) return { title: 'Post not found' };

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt || '';
  const ogSource = post.seo?.ogImage || post.mainImage;
  const ogUrl = ogSource
    ? urlForImage(ogSource).width(1200).height(630).fit('crop').url()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.seo?.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogUrl ? [{ url: ogUrl, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogUrl ? [ogUrl] : undefined,
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;

  const post = await sanityFetch({
    query: postBySlugQuery,
    params: { slug },
    tags: [`post:${slug}`],
  });

  if (!post) notFound();

  const categoryIds = (post.categories || []).map((c) => c._id);

  const [related, comments] = await Promise.all([
    sanityFetch({
      query: relatedPostsQuery,
      params: { slug, categoryIds },
      tags: ['post'],
      fallback: [],
    }),
    sanityFetch({
      query: approvedCommentsQuery,
      params: { postId: post._id },
      tags: [`comments:${post._id}`],
      fallback: [],
    }),
  ]);

  const headings = extractHeadings(post.body);
  const category = post.categories?.[0];
  const coverUrl = post.mainImage
    ? urlForImage(post.mainImage).width(1600).height(900).url()
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    author: post.author?.name
      ? { '@type': 'Person', name: post.author.name }
      : undefined,
    image: coverUrl ? [coverUrl] : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Cloudwise',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo1.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  };

  return (
    <main className="relative pt-36 pb-24 md:pt-44">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-ember-radial opacity-50" />

      {/* Header */}
      <div className="container-px mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} /> Back to blog
        </Link>
        {category && (
          <Link
            href={`/blog/category/${category.slug}`}
            className="font-mono text-[0.65rem] uppercase tracking-eyebrow text-ember hover:underline"
          >
            {category.title}
          </Link>
        )}
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-5xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-white/45">
            {formatDate(post.publishedAt)} · {Math.max(1, post.readingTime || 1)} min read
            {post.author?.name && <> · {post.author.name}</>}
          </p>
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
      </div>

      {/* Cover */}
      {coverUrl && (
        <div className="container-px mx-auto mt-10 max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={coverUrl}
              alt={post.mainImage?.alt || post.title}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 768px) 896px, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body + TOC */}
      <div className="container-px mx-auto mt-12 max-w-6xl">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents headings={headings} />
            </div>
          </aside>

          <article className="mx-auto max-w-3xl">
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-ember prose-strong:text-white prose-img:rounded-2xl">
              <PortableText value={post.body} />
            </div>

            {post.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog/tag/${encodeURIComponent(t)}`}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 transition-colors hover:border-ember hover:text-ember"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-10 border-t border-white/10 pt-8">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>

            <div className="mt-10">
              <AuthorCard author={post.author} />
            </div>

            <Comments postId={post._id} comments={comments} />
          </article>
        </div>
      </div>

      {/* Related */}
      {related?.length > 0 && (
        <section className="container-px mx-auto mt-24 max-w-6xl border-t border-white/10 pt-16">
          <h2 className="font-display text-2xl font-bold text-white">Related articles</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p._id} delay={(i % 3) * 0.06}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
