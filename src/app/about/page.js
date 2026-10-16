'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Target, Users, Award, Lightbulb, ArrowUpRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/anim/Reveal';
import { Counter } from '@/components/anim/Counter';
import { CtaBand } from '@/components/CtaBand';
import { COMPANY_INFO } from '@/lib/constants';

const VALUES = [
  { icon: Target, title: 'Innovation first', desc: 'We stay ahead of the curve so our clients get a real competitive edge.' },
  { icon: Users, title: 'Client partnership', desc: 'We build lasting relationships, understanding your needs and growing together.' },
  { icon: Award, title: 'Excellence', desc: 'The highest standards in code quality, design and delivery — every project.' },
  { icon: Lightbulb, title: 'Creative solutions', desc: 'We think beyond the obvious to solve complex problems elegantly.' },
];

// No photos until real ones exist: the placeholder images were not of these
// people. Add `image: '/team/<name>.jpg'` to show a photo instead of initials.
const TEAM = [
  { name: 'Paul Theceri', role: 'CEO & Founder' },
  { name: 'Edwin Kailikia', role: 'Technical Lead' },
  { name: 'Brian Kivuti', role: 'Design Lead' },
  { name: 'Joseph Mutua', role: 'Project Manager' },
];

const STATS = [
  { to: 33, suffix: '+', label: 'Projects delivered' },
  { to: 33, suffix: '', label: 'Happy clients' },
  { to: 3, suffix: '', label: 'Countries served' },
  { to: 100, suffix: '%', label: 'Completion rate' },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Cloudwise"
        title="A technology company that builds the future, with you."
        subtitle="Founded in 2019, Cloudwise is a Nairobi-based ICT company empowering organisations through AI products, software and digital transformation across East Africa."
      />

      {/* Mission */}
      <section className="border-t border-white/10 bg-ink-800/30 py-24 md:py-32">
        <div className="container-px grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal as="p" className="eyebrow mb-4">Our mission</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-3xl font-bold text-white md:text-4xl">
              Make cutting-edge technology genuinely useful for every business.
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-6 leading-relaxed text-white/60">
              We believe every company deserves access to technology that drives growth — not just
              the big players. From intelligent AI agents to robust web and mobile platforms, we
              translate complex tech into practical tools that work.
            </Reveal>
            <Reveal as="p" delay={0.15} className="mt-4 leading-relaxed text-white/60">
              Our commitment to excellence, innovation and client success has made us a trusted
              partner for businesses across multiple industries.
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
              <Image src="/main2.jpg" alt="The Cloudwise team at work" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-white/10 bg-ink py-24 md:py-32">
        <div className="container-px">
          <div className="mb-14 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">What we stand for</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
              The values behind every build.
            </Reveal>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="card-dark group h-full p-7">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-ember/10 text-ember transition-colors group-hover:bg-ember group-hover:text-white">
                    <v.icon size={22} />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-semibold text-white">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/10 bg-ink-800/30 py-20">
        <div className="container-px grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center">
              <Counter to={s.to} suffix={s.suffix} className="font-display text-5xl font-bold text-gradient-ember md:text-6xl" />
              <p className="mt-3 text-sm text-white/50">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-white/10 bg-ink py-24 md:py-32">
        <div className="container-px">
          <div className="mb-14 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">The people</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-4xl font-bold text-white md:text-5xl">
              Meet the team.
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.06}>
                <div className="group relative overflow-hidden rounded-3xl border border-white/10">
                  <div className="relative aspect-[3/4] bg-ink-800">
                    {m.image ? (
                      <Image src={m.image} alt={m.name} fill className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" sizes="(max-width:1024px) 50vw, 25vw" />
                    ) : (
                      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-ember-radial">
                        <span className="font-display text-6xl font-bold text-ember/80">
                          {m.name.split(' ').map((w) => w[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="font-display text-lg font-semibold text-white">{m.name}</h3>
                    <p className="text-sm text-ember">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.08} className="mt-10 max-w-2xl">
            <p className="text-white/70">
              We also teach what we build. Our{' '}
              <Link href="/ai-training" className="text-ember hover:underline">
                hands-on AI training
              </Link>{' '}
              runs in Westlands and online, from a two-hour Kickstart to an eight-hour programme, and for teams.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <Link href="/contact" className="group inline-flex items-center gap-2 text-ember">
              Work with us <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Let’s build something great together." primary={{ label: 'Get in touch', href: '/contact' }} />
    </>
  );
}
