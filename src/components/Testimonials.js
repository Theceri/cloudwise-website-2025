'use client';

import { Quote, Star } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';

const ITEMS = [
  {
    quote:
      'The Cloudwise AI training completely changed how our team approaches daily tasks. Within a week, our staff were using AI to cut report-writing time in half. Incredibly practical and well-delivered.',
    name: 'TechCamp',
    role: 'Technology Training Organisation',
  },
  {
    quote:
      'We brought Cloudwise in to train our HR and operations team. Our team now uses AI every day for sourcing, communication and analysis. Worth every shilling — and more.',
    name: 'Stratostaff',
    role: 'HR & Staffing Solutions',
  },
];

export function Testimonials({ eyebrow = 'Social proof', title = 'Organisations we’ve worked with' }) {
  return (
    <section className="border-t border-white/10 bg-ink-800/30 py-24 md:py-32">
      <div className="container-px">
        <div className="mb-14 text-center">
          <Reveal as="p" className="eyebrow mb-4">{eyebrow}</Reveal>
          <Reveal as="h2" delay={0.05} className="mx-auto max-w-2xl text-balance font-display text-4xl font-bold text-white md:text-5xl">
            {title}
          </Reveal>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {ITEMS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="card-dark relative h-full p-8">
                <Quote className="absolute right-7 top-7 text-ember/20" size={42} />
                <div className="mb-5 flex gap-1 text-ember">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} size={15} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="text-lg leading-relaxed text-white/80">“{t.quote}”</blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-5">
                  <span className="font-display font-semibold text-white">{t.name}</span>
                  <span className="ml-2 text-sm text-white/45">· {t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
