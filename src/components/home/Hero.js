'use client';

import Link from 'next/link';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { HeroCanvas } from '@/components/three/HeroCanvas';
import { Magnetic } from '@/components/anim/Magnetic';
import { AnimatedHeading } from '@/components/anim/AnimatedHeading';

export function Hero() {
  return (
    <section className="relative flex min-h-screen min-h-[100svh] items-center overflow-hidden">
      {/* 3D cloud-network field */}
      <HeroCanvas className="absolute inset-0 z-0" />
      {/* readability + grid scrims */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-grid-faint bg-grid-lg opacity-40" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-ink/40 via-ink/10 to-ink" />

      <div className="container-px relative z-10 w-full pt-28 pb-20">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 opacity-0"
          style={{ animation: 'fadeIn 0.8s ease forwards 0.1s' }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse-glow" />
          <span className="font-mono text-[0.7rem] uppercase tracking-eyebrow text-white/70">
            Nairobi · Your ICT &amp; AI partner
          </span>
        </div>

        <AnimatedHeading
          as="h1"
          text="Build smarter. Work smarter. With AI."
          className="max-w-4xl text-balance font-display text-[2.6rem] font-bold leading-[1.02] text-white sm:text-6xl lg:text-7xl"
        />

        <p
          className="mt-7 max-w-xl text-lg leading-relaxed text-white/65 opacity-0"
          style={{ animation: 'fadeIn 0.9s ease forwards 0.5s' }}
        >
          Cloudwise builds intelligent products — AI agents, web &amp; mobile apps, cloud
          systems — and trains teams to actually use AI for real business results.
        </p>

        <div
          className="mt-9 flex flex-wrap items-center gap-3 opacity-0"
          style={{ animation: 'fadeIn 0.9s ease forwards 0.7s' }}
        >
          <Magnetic>
            <Link href="/contact" className="btn-ember text-base">
              Start a project <ArrowUpRight size={18} />
            </Link>
          </Magnetic>
          <Link href="/ai-training" className="btn-ghost text-base">
            Explore AI training
          </Link>
        </div>

        {/* mini trust stats */}
        <div
          className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 opacity-0"
          style={{ animation: 'fadeIn 1s ease forwards 0.9s' }}
        >
          {[
            ['33+', 'Projects delivered'],
            ['3', 'Countries served'],
            ['2019', 'Building since'],
          ].map(([n, l]) => (
            <div key={l} className="flex items-baseline gap-2.5">
              <span className="font-display text-2xl font-bold text-white">{n}</span>
              <span className="text-sm text-white/45">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute inset-x-0 bottom-7 z-10 flex justify-center">
        <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-eyebrow text-white/35">
          <ArrowDown size={13} className="animate-bounce" /> Scroll to explore
        </span>
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(16px);} to {opacity:1; transform:none;} }`}</style>
    </section>
  );
}
