'use client';

import Link from 'next/link';
import { Brain, Zap, ShieldCheck, MapPin, ArrowUpRight } from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { ClientsMarquee } from '@/components/home/ClientsMarquee';
import { ServicesShowcase } from '@/components/home/ServicesShowcase';
import { TrainingBand } from '@/components/home/TrainingBand';
import { Testimonials } from '@/components/Testimonials';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/anim/Reveal';
import { Counter } from '@/components/anim/Counter';

const WHY = [
  { icon: Brain, title: 'AI-first by default', desc: 'We build with the latest models (Claude, GPT, Gemini) and ship AI that genuinely moves the needle.' },
  { icon: Zap, title: 'Fast, modern & lean', desc: 'Performance-obsessed engineering — quick to load, smooth to use, built to scale.' },
  { icon: ShieldCheck, title: 'Practitioners, not theorists', desc: 'Certified ICT & AI practitioners who build real products for real businesses every day.' },
  { icon: MapPin, title: 'Local, regional reach', desc: 'Nairobi-based and serving teams across East Africa — we understand your market.' },
];

const STATS = [
  { to: 33, suffix: '+', label: 'Projects delivered' },
  { to: 33, suffix: '', label: 'Happy clients' },
  { to: 3, suffix: '', label: 'Countries served' },
  { to: 100, suffix: '%', label: 'Completion rate' },
];

export default function Home() {
  return (
    <>
      <Hero />
      <ClientsMarquee />
      <ServicesShowcase />

      {/* Why Cloudwise */}
      <section className="border-t border-white/10 bg-ink-800/30 py-24 md:py-32">
        <div className="container-px">
          <div className="mb-14 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">Why Cloudwise</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
              Technical expertise meets real-world results.
            </Reveal>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="card-dark group h-full p-7">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-ember/10 text-ember transition-colors group-hover:bg-ember group-hover:text-white">
                    <f.icon size={22} />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-semibold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/10 bg-ink py-20">
        <div className="container-px grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center">
              <Counter
                to={s.to}
                suffix={s.suffix}
                className="font-display text-5xl font-bold text-gradient-ember md:text-6xl"
              />
              <p className="mt-3 text-sm text-white/50">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <TrainingBand />
      <Testimonials />

      {/* Quick services link row */}
      <section className="border-t border-white/10 bg-ink-800/30 py-16">
        <div className="container-px flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-lg text-white/70">Curious what else we build?</p>
          <Link href="/portfolio" className="group inline-flex items-center gap-2 text-ember">
            Explore our portfolio
            <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
