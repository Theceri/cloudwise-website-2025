'use client';

import { Reveal } from '@/components/anim/Reveal';
import { AnimatedHeading } from '@/components/anim/AnimatedHeading';

export function PageHero({ eyebrow, title, highlight, subtitle, children }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid-lg opacity-25" />
      <div className="container-px relative">
        <Reveal as="p" className="eyebrow mb-5">{eyebrow}</Reveal>
        <AnimatedHeading
          as="h1"
          text={title}
          className="max-w-4xl text-balance font-display text-5xl font-bold leading-[1.02] text-white md:text-7xl"
        />
        {highlight && (
          <p className="mt-2 font-display text-2xl font-medium text-gradient-ember md:text-3xl">{highlight}</p>
        )}
        {subtitle && (
          <Reveal as="p" delay={0.1} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {subtitle}
          </Reveal>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
