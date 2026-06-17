'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';
import { Magnetic } from '@/components/anim/Magnetic';
import { whatsappLink } from '@/lib/constants';

export function CtaBand({
  title = 'Ready to start your next project?',
  subtitle = 'Get a free consultation and quote. Let’s turn your idea into something real.',
  primary = { label: 'Start a project', href: '/contact' },
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[50rem] -translate-x-1/2 rounded-full bg-ember/15 blur-3xl" />
      <div className="container-px relative text-center">
        <Reveal as="h2" className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold text-white md:text-6xl">
          {title}
        </Reveal>
        <Reveal as="p" delay={0.08} className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          {subtitle}
        </Reveal>
        <Reveal delay={0.14} className="mt-9 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <Link href={primary.href} className="btn-ember text-base">
              {primary.label} <ArrowUpRight size={18} />
            </Link>
          </Magnetic>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base">
            Chat on WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
