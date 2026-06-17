'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

const STRAPI_BASE_URL = 'https://blogadmin.cloudwise.co.ke';

export default function PostPage({ params }) {
  const { slug } = params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const apiUrl =
          `${STRAPI_BASE_URL}/api/posts?filters[slug][$eq]=${slug}` +
          `&populate[category][fields][0]=name` +
          `&populate[author][fields][0]=name&populate[author][fields][1]=role` +
          `&populate[cover][fields][0]=url`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const item = json.data[0];
          const date = item?.date ? new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
          setPost({
            title: item.title || 'Untitled',
            date,
            readtime: item.readtime || 'N/A',
            content: item?.content || [],
            category: item?.category?.name || 'Uncategorized',
            authorName: item?.author?.name || 'Cloudwise',
            authorRole: item?.author?.role || '',
            coverUrl: item?.cover?.url || null,
          });
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        setError('Failed to load this article.');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center pt-32">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-ember" />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="container-px flex min-h-[60vh] flex-col items-center justify-center pt-32 text-center">
        <p className="text-white/60">{error || 'Post not found.'}</p>
        <Link href="/blog" className="mt-6 text-ember">← Back to blog</Link>
      </main>
    );
  }

  return (
    <main className="pt-36 pb-24 md:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-ember-radial opacity-50" />
      <article className="container-px mx-auto max-w-3xl">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
          <ArrowLeft size={16} /> Back to blog
        </Link>
        <p className="font-mono text-[0.65rem] uppercase tracking-eyebrow text-ember">{post.category}</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-white/45">{post.date} · {post.readtime} read · {post.authorName}</p>

        {post.coverUrl && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${STRAPI_BASE_URL}${post.coverUrl}`} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        <div className="prose prose-invert prose-lg mt-10 max-w-none prose-headings:font-display prose-a:text-ember prose-strong:text-white">
          {post.content?.length ? <BlocksRenderer content={post.content} /> : <p>No content available.</p>}
        </div>

        {post.authorRole && (
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-eyebrow text-white/40">Written by</p>
            <p className="mt-1 font-display font-semibold text-white">{post.authorName}</p>
            <p className="text-sm text-white/50">{post.authorRole}</p>
          </div>
        )}
      </article>
    </main>
  );
}
