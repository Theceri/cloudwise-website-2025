'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/anim/Reveal';
import { CtaBand } from '@/components/CtaBand';
import { projects } from '@/lib/projects';

const CATEGORIES = ['All', 'AI Development', 'Web Development', 'Mobile Apps', 'E-commerce'];

export default function Portfolio() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Projects that delivered real results."
        subtitle="A look at how we’ve helped businesses transform their digital presence — from AI platforms to mobile apps and marketplaces."
      />

      {/* Filters */}
      <section className="border-t border-white/10 bg-ink py-8">
        <div className="container-px flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-5 py-2 text-sm transition-all ${
                active === c
                  ? 'border-ember bg-ember text-white'
                  : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="bg-ink pb-24 md:pb-32">
        <div className="container-px grid gap-6 md:grid-cols-2">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.06}>
              <Link href={`/portfolio/${p.slug}`} className="group block overflow-hidden rounded-3xl border border-white/10 bg-ink-800/50">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-ink/60 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-eyebrow text-white/80 backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="mb-2 font-display text-2xl font-semibold text-white transition-colors group-hover:text-ember">{p.title}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-white/55">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(p.results).map((r) => (
                      <span key={r} className="rounded-full bg-ember/10 px-3 py-1 text-xs text-ember">{r}</span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors group-hover:text-ember">
                    View case study <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand title="Ready to build something amazing?" primary={{ label: 'Start your project', href: '/contact' }} />
    </>
  );
}
