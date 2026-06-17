'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';

const SERVICES = [
  { id: 'ai', n: '01', title: 'AI Agent Development', desc: 'Custom AI agents, NLP & automation that learn and act.', img: '/Agent-Development.png' },
  { id: 'web', n: '02', title: 'Web Development', desc: 'Fast, modern websites & web apps that convert.', img: '/web-development.jpg' },
  { id: 'mobile', n: '03', title: 'Mobile App Development', desc: 'Native & cross-platform apps for iOS and Android.', img: '/Mobile-App.png' },
  { id: 'ecommerce', n: '04', title: 'E-commerce Solutions', desc: 'Secure, scalable stores built to sell.', img: '/shopping.jpg' },
  { id: 'cloud', n: '05', title: 'Cloud & DevOps', desc: 'Migration, CI/CD and infrastructure that scales.', img: '/marketplace.jpg' },
  { id: 'automation', n: '06', title: 'Process Automation', desc: 'Cut manual work with smart, reliable workflows.', img: '/process-automation.png' },
];

export function ServicesShowcase() {
  const [active, setActive] = useState(null);
  const previewRef = useRef(null);

  const onMove = (e) => {
    const el = previewRef.current;
    if (!el) return;
    el.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 120}px)`;
  };

  return (
    <section
      onMouseMove={onMove}
      className="relative border-t border-white/10 bg-ink py-24 md:py-32"
    >
      <div className="container-px">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal as="p" className="eyebrow mb-4">What we do</Reveal>
            <Reveal as="h2" delay={0.05} className="max-w-2xl text-balance font-display text-4xl font-bold text-white md:text-5xl">
              Full-stack capability, from idea to launch.
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Link href="/services" className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
              View all services
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="border-t border-white/10">
          {SERVICES.map((s) => (
            <Link
              key={s.id}
              href={`/services/${s.id}`}
              onMouseEnter={() => setActive(s)}
              onMouseLeave={() => setActive(null)}
              className="group relative flex items-center justify-between gap-4 border-b border-white/10 py-7 transition-colors md:py-9"
            >
              <div className="flex items-center gap-5 md:gap-10">
                <span className="font-mono text-xs text-white/30">{s.n}</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-white transition-colors group-hover:text-ember md:text-4xl">
                    {s.title}
                  </h3>
                  <p className="mt-1 max-w-md text-sm text-white/45 md:text-base">{s.desc}</p>
                </div>
              </div>

              {/* inline image on mobile */}
              <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 sm:block md:hidden">
                <Image src={s.img} alt={s.title} fill className="object-cover opacity-70" />
              </div>

              <ArrowUpRight
                className="hidden shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ember md:block"
                size={28}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* cursor-following preview (desktop) */}
      <div
        ref={previewRef}
        className={`pointer-events-none fixed left-0 top-0 z-30 hidden h-56 w-80 overflow-hidden rounded-2xl border border-white/15 shadow-glow transition-opacity duration-300 md:block ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      >
        {active && (
          <>
            <Image src={active.img} alt="" fill className="object-cover" sizes="320px" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
          </>
        )}
      </div>
    </section>
  );
}
