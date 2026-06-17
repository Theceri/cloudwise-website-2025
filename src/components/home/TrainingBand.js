'use client';

import Link from 'next/link';
import { ArrowUpRight, Check, CalendarDays } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';
import { Gauge } from '@/components/anim/Gauge';

const INCLUDES = [
  '8 hours of live, hands-on AI training',
  '1-month Claude AI subscription included',
  'AI toolkit, prompt library & templates',
  'Lifetime WhatsApp support community',
];

export function TrainingBand() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink py-24 md:py-32">
      <div className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 opacity-40">
        <Gauge size={520} className="animate-spin-slow [animation-duration:120s]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-ember-radial opacity-60" />

      <div className="container-px relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal as="p" className="eyebrow mb-4">Cloudwise AI Productivity Training</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Work smarter <span className="text-gradient-ember">with AI.</span>
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
              A practical, no-jargon training that gives you and your team the exact skills to use
              AI for real business results. No tech background required.
            </Reveal>

            <Reveal delay={0.15} className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80">
              <CalendarDays size={16} className="text-ember" />
              Every 1st &amp; 2nd Saturday · 9am–1pm · Online or in Nairobi
            </Reveal>

            <Reveal delay={0.2} className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/ai-training" className="btn-ember">
                See training details <ArrowUpRight size={18} />
              </Link>
              <span className="text-sm text-white/45">
                <span className="text-white/30 line-through">Ksh 30,000</span>{' '}
                <span className="font-semibold text-white">Ksh 13,500</span> / person
              </span>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="card-dark p-8">
              <p className="eyebrow-muted mb-5">Everything included</p>
              <ul className="space-y-4">
                {INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15">
                      <Check size={13} className="text-ember" />
                    </span>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center">
                {[['100%', 'Hands-on'], ['6+', 'AI tools'], ['2', 'Saturdays']].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display text-2xl font-bold text-white">{n}</div>
                    <div className="mt-1 text-xs text-white/45">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
