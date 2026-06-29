import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '@/components/anim/Reveal';
import { CtaBand } from '@/components/CtaBand';
import { projects } from '@/lib/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/portfolio/${p.slug}` } };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return notFound();

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-12 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-ember-radial opacity-60" />
        <div className="container-px relative">
          <Link href="/portfolio" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
            <ArrowLeft size={16} /> Back to portfolio
          </Link>
          <Reveal as="p" className="eyebrow mb-4">{project.category}</Reveal>
          <Reveal as="h1" delay={0.05} className="max-w-3xl text-balance font-display text-4xl font-bold text-white md:text-6xl">
            {project.title}
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-5 max-w-2xl text-lg text-white/60">{project.description}</Reveal>
        </div>
      </section>

      <section className="bg-ink pb-8">
        <div className="container-px">
          <Reveal className="relative aspect-video overflow-hidden rounded-3xl border border-white/10">
            <Image src={project.image} alt={project.title} fill className="object-cover" priority sizes="100vw" />
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-20">
        <div className="container-px grid gap-12 lg:grid-cols-3">
          <Reveal>
            <h2 className="eyebrow mb-5">Results</h2>
            <ul className="space-y-3">
              {Object.values(project.results).map((m, i) => (
                <li key={i} className="rounded-2xl border border-white/10 bg-ink-800/50 p-5 font-display text-lg font-semibold text-gradient-ember">
                  {m}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="eyebrow mb-5">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70">{t}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <h2 className="eyebrow mb-5">About the client</h2>
            <p className="mb-4 leading-relaxed text-white/70">
              <span className="font-semibold text-white">{project.client.name}</span> — {project.client.about}
            </p>
            <ul className="space-y-2 text-sm text-white/55">
              {project.client.services.map((s, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" /> {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Have a similar project in mind?" primary={{ label: 'Let’s talk', href: '/contact' }} />
    </>
  );
}
