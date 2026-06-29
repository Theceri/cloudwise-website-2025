import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

import { urlForImage } from '@/sanity/lib/image';
import { formatDate } from '@/lib/utils';

function readingLabel(post) {
  const mins = Math.max(1, post.readingTime || 1);
  return `${mins} min read`;
}

/**
 * Blog post card. `featured` renders the large hero-style card used at the
 * top of the blog index; otherwise the standard grid card.
 */
export function PostCard({ post, featured = false, priority = false }) {
  const category = post.categories?.[0];
  const img = post.mainImage
    ? urlForImage(post.mainImage)
        .width(featured ? 1600 : 800)
        .height(featured ? 760 : 450)
        .url()
    : null;

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative col-span-1 overflow-hidden rounded-3xl border border-white/10 md:col-span-2"
      >
        <div className="relative aspect-[16/11] sm:aspect-[16/8] lg:aspect-[21/9]">
          {img && (
            <Image
              src={img}
              alt={post.mainImage?.alt || post.title}
              fill
              priority={priority}
              sizes="(min-width: 768px) 100vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 p-5 md:p-8">
          <span className="rounded-full bg-ember px-3 py-1 font-mono text-[0.6rem] uppercase tracking-eyebrow text-white">
            Featured{category ? ` · ${category.title}` : ''}
          </span>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {post.title}
          </h2>
          <p className="mt-2 text-sm text-white/60">
            {formatDate(post.publishedAt)} · {readingLabel(post)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-800/50"
    >
      <div className="relative aspect-video overflow-hidden">
        {img && (
          <Image
            src={img}
            alt={post.mainImage?.alt || post.title}
            fill
            priority={priority}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {category && (
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink/60 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-eyebrow text-white/80 backdrop-blur">
            {category.title}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-ember">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/55">
            {post.excerpt}
          </p>
        )}
        <p className="mt-3 text-xs text-white/45">
          {formatDate(post.publishedAt)} · {readingLabel(post)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm text-ember">
          Read article
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
