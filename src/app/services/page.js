'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Brain, Code, Smartphone, ShoppingBag, Cloud, Database, Bot, LineChart, ArrowUpRight,
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/anim/Reveal';
import { CtaBand } from '@/components/CtaBand';

const SERVICES = [
  { id: 'ai', icon: Brain, title: 'AI Agent Development', desc: 'Intelligent agents, NLP and automation that learn, adapt and act on real business tasks.', img: '/Agent-Development.png', features: ['Custom AI models', 'Natural language processing', 'AI-powered automation'] },
  { id: 'web', icon: Code, title: 'Web Development', desc: 'High-performance websites and web apps engineered for speed, SEO and conversion.', img: '/web-development.jpg', features: ['Custom web apps', 'Progressive web apps', 'Performance optimization'] },
  { id: 'mobile', icon: Smartphone, title: 'Mobile App Development', desc: 'Polished native and cross-platform apps for iOS and Android.', img: '/Mobile-App.png', features: ['iOS & Android', 'Cross-platform', 'Mobile UI/UX'] },
  { id: 'ecommerce', icon: ShoppingBag, title: 'E-commerce Solutions', desc: 'Secure, scalable online stores built to convert and grow.', img: '/shopping.jpg', features: ['Custom platforms', 'Payment integration', 'Analytics & reporting'] },
  { id: 'cloud', icon: Cloud, title: 'Cloud Solutions', desc: 'Migration, infrastructure and DevOps that scale reliably and cost-effectively.', img: '/marketplace.jpg', features: ['Cloud migration', 'DevOps & CI/CD', 'Infrastructure setup'] },
  { id: 'data', icon: Database, title: 'Data Services', desc: 'Turn raw data into clear, actionable insight with pipelines and dashboards.', img: '/32438.jpg', features: ['Data analytics', 'Business intelligence', 'Data visualization'] },
  { id: 'automation', icon: Bot, title: 'Process Automation', desc: 'Eliminate repetitive work with smart, reliable automated workflows.', img: '/process-automation.png', features: ['Workflow automation', 'RPA implementation', 'Integration services'] },
  { id: 'consulting', icon: LineChart, title: 'Tech Consulting', desc: 'Expert guidance on strategy, architecture and your digital transformation roadmap.', img: '/IT-Consulting.jpg', features: ['Technology assessment', 'Digital strategy', 'Architecture planning'] },
];

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Services built to move your business forward."
        subtitle="From AI development to cloud infrastructure, we offer a comprehensive suite of digital solutions — and we sweat the details on every one."
      />

      <section className="border-t border-white/10 bg-ink py-20 md:py-28">
        <div className="container-px grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 0.06}>
              <Link
                href={`/services/${s.id}`}
                className="card-dark group relative flex h-full flex-col overflow-hidden p-8"
              >
                <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <Image src={s.img} alt="" fill className="object-cover opacity-20" sizes="160px" />
                  <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-ink-800" />
                </div>

                <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-ember/10 text-ember transition-colors group-hover:bg-ember group-hover:text-white">
                  <s.icon size={22} />
                </div>
                <h3 className="relative mb-2 font-display text-2xl font-semibold text-white">{s.title}</h3>
                <p className="relative mb-6 text-white/55">{s.desc}</p>
                <ul className="relative mb-8 flex flex-wrap gap-2">
                  {s.features.map((f) => (
                    <li key={f} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="relative mt-auto inline-flex items-center gap-2 text-sm text-ember">
                  Learn more
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand title="Not sure which service fits?" subtitle="Tell us your goal — we’ll recommend the right approach in a free consultation." primary={{ label: 'Talk to us', href: '/contact' }} />
    </>
  );
}
