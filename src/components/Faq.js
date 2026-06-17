'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';

export function Faq({ items, eyebrow = 'FAQ', title = 'Questions, answered' }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="border-t border-white/10 bg-ink py-24 md:py-32">
      <div className="container-px grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal as="p" className="eyebrow mb-4">{eyebrow}</Reveal>
          <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
            {title}
          </Reveal>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className={`font-display text-lg font-medium transition-colors md:text-xl ${isOpen ? 'text-ember' : 'text-white'}`}>
                    {item.q}
                  </span>
                  <Plus
                    size={22}
                    className={`shrink-0 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-45 text-ember' : ''}`}
                  />
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-10 leading-relaxed text-white/60">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
