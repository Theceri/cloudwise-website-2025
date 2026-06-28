import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/anim/Reveal';
import { PostCard } from '@/components/blog/PostCard';
import { sanityFetch } from '@/sanity/lib/fetch';
import { postsByTagQuery } from '@/sanity/lib/queries';

export async function generateMetadata({ params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  return {
    title: `#${tag} — Cloudwise Blog`,
    description: `Articles tagged "${tag}".`,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(tag)}` },
  };
}

export default async function TagPage({ params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = await sanityFetch({
    query: postsByTagQuery,
    params: { tag },
    tags: ['post'],
    fallback: [],
  });

  return (
    <>
      <PageHero eyebrow="Tag" title={`#${tag}`} subtitle={`Articles tagged "${tag}".`} />

      <section className="bg-ink pb-24 md:pb-32 pt-4">
        <div className="container-px">
          {posts.length === 0 ? (
            <div className="py-24 text-center text-white/50">No posts with this tag yet.</div>
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
