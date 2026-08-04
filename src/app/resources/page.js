import Link from 'next/link';
import { ArrowUpRight, BookOpen, ClipboardList, Sparkles } from 'lucide-react';

import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/anim/Reveal';
import { SITE_URL } from '@/lib/constants';
import { RESOURCE_INDEX } from '@/lib/resources';

export const metadata = {
  title: 'AI Resources — Prompt Pack & Readiness Guide',
  description:
    'Free resources from Cloudwise AI Productivity Training: the four-part prompt framework, ten copy-and-paste prompts, and everything to prepare for your session.',
  alternates: { canonical: '/resources' },
  openGraph: {
    title: 'Free AI Resources — Cloudwise',
    description: 'Ten prompts that do real work in your business today. Free, no signup.',
    url: `${SITE_URL}/resources`,
  },
};

const ICONS = {
  'ai-readiness': BookOpen,
  'prompt-pack': Sparkles,
  'session-prep': ClipboardList,
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Free resources"
        title="Yours to keep."
        subtitle="Everything we hand our trainees, open to anyone. Take a prompt, change the details to your business, and watch it work."
      />

      <section className="border-t border-white/10 bg-ink py-20 md:py-28">
        <div className="container-px">
          <div className="grid gap-4 md:grid-cols-3">
            {RESOURCE_INDEX.map((resource, i) => {
              const Icon = ICONS[resource.slug] || BookOpen;
              return (
                <Reveal key={resource.slug} delay={i * 0.07}>
                  <Link
                    href={`/resources/${resource.slug}`}
                    className="card-dark group flex h-full flex-col p-7"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-ember/10 text-ember">
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-[0.6rem] uppercase tracking-eyebrow text-ember">
                      {resource.tag}
                    </span>
                    <h2 className="mt-1.5 font-display text-xl font-semibold text-white">
                      {resource.title}
                    </h2>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-white/55">
                      {resource.summary}
                    </p>
                    <span className="mt-6 flex items-center gap-1.5 text-sm font-medium text-ember">
                      Open
                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.2} className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-ember/30 bg-ember/[0.07] p-8">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-bold text-white">
                  Reading about it only gets you so far.
                </h2>
                <p className="mt-2 text-white/65">
                  In the training you build these into your own business, with us beside you — and
                  leave with the thing already working.
                </p>
              </div>
              <Link href="/ai-training" className="btn-ember text-base">
                See the training <ArrowUpRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
