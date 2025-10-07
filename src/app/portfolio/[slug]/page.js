import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { projects } from '@/lib/projects'

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }))
}

export default function ProjectPage({ params }) {
  const project = projects.find(p => p.slug === params.slug)
  if (!project) return notFound()

  return (
    <main className="pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <Link href="/portfolio" className="inline-flex items-center text-brand-primary hover:text-brand-secondary transition">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portfolio
        </Link>
      </div>

      {/* Project Header */}
      <Section>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-4">{project.title}</h1>
          <p className="text-text-body text-lg">{project.description}</p>
        </div>

        {/* Image */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Technologies */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-brand-primary">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map(tech => (
              <span key={tech} className="px-4 py-1.5 bg-brand-accent1/10 text-brand-accent2 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-brand-primary">Results</h2>
          <ul className="space-y-2 text-text-subheading list-disc list-inside">
            {Object.values(project.results).map((metric, i) => (
              <li key={i}>{metric}</li>
            ))}
          </ul>
        </div>

        {/* Client Info */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-brand-primary">About the Client</h2>
          <p className="mb-3 text-text-body">
            <span className="font-semibold text-brand-secondary">{project.client.name}</span>: {project.client.about}
          </p>
          <ul className="list-disc list-inside text-sm text-brand-accent2 space-y-1">
            {project.client.services.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Custom Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold text-brand-primary mb-4">Unique Features & Behind-the-Scenes</h2>
          <p className="text-text-body leading-relaxed">
            This section is customizable for this specific project. You can add architecture diagrams, timeline details, or video walkthroughs here to show off what makes this solution special.
          </p>
        </div>
      </Section>
    </main>
  )
}
