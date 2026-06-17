'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/anim/Reveal';
import { CtaBand } from '@/components/CtaBand';

const STRAPI_BASE_URL = 'https://blogadmin.cloudwise.co.ke';

const CATEGORIES = ['All', 'AI & Machine Learning', 'Web Development', 'Mobile Development', 'Cloud Computing', 'Digital Transformation'];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${STRAPI_BASE_URL}/api/posts?populate[category][fields][0]=name&populate[cover][fields][0]=url`);
        const json = await res.json();
        if (!json.data || !Array.isArray(json.data)) {
          setPosts([]); setLoading(false); return;
        }
        const mapped = json.data.map((item) => {
          const d = item || {};
          const date = d.date ? new Date(d.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
          return {
            id: d.id,
            title: d.title || 'Untitled',
            slug: d.slug || '',
            readtime: d.readtime || 'N/A',
            date,
            category: d.category?.name || 'Uncategorized',
            coverUrl: d.cover?.url || null,
          };
        }).filter((p) => p.id !== undefined);
        setPosts(mapped);
      } catch (e) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = active === 'All' ? posts : posts.filter((p) => p.category === active);
  const [featured, ...rest] = filtered;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Ideas on AI, software & digital transformation."
        subtitle="Practical insights, tutorials and trends from the Cloudwise team to help you stay ahead."
      />

      <section className="border-t border-white/10 bg-ink py-8">
        <div className="container-px flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setActive(c)} className={`rounded-full border px-5 py-2 text-sm transition-all ${active === c ? 'border-ember bg-ember text-white' : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-ink pb-24 md:pb-32">
        <div className="container-px">
          {loading ? (
            <div className="py-24 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-ember" />
              <p className="mt-4 text-white/50">Loading articles…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-white/50">No posts yet — check back soon.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="group relative col-span-1 overflow-hidden rounded-3xl border border-white/10 md:col-span-2">
                  <div className="relative aspect-[16/11] sm:aspect-[16/8] lg:aspect-[21/9]">
                    {featured.coverUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`${STRAPI_BASE_URL}${featured.coverUrl}`} alt={featured.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 p-5 md:p-8">
                    <span className="rounded-full bg-ember px-3 py-1 font-mono text-[0.6rem] uppercase tracking-eyebrow text-white">Featured · {featured.category}</span>
                    <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">{featured.title}</h2>
                    <p className="mt-2 text-sm text-white/60">{featured.date} · {featured.readtime} read</p>
                  </div>
                </Link>
              )}

              {rest.map((p, i) => (
                <Reveal key={p.id} delay={(i % 2) * 0.06}>
                  <Link href={`/blog/${p.slug}`} className="group block overflow-hidden rounded-3xl border border-white/10 bg-ink-800/50">
                    <div className="relative aspect-video overflow-hidden">
                      {p.coverUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`${STRAPI_BASE_URL}${p.coverUrl}`} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}
                      <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink/60 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-eyebrow text-white/80 backdrop-blur">{p.category}</span>
                    </div>
                    <div className="p-7">
                      <h3 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-ember">{p.title}</h3>
                      <p className="mt-2 text-xs text-white/45">{p.date} · {p.readtime} read</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm text-ember">Read article <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand title="Need expert guidance?" subtitle="Ready to put these ideas to work? Let’s talk about your goals." primary={{ label: 'Get a free consultation', href: '/contact' }} />
    </>
  );
}
