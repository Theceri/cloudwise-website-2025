import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/anim/Reveal';
import { SITE_URL } from '@/lib/constants';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { TRACKS, TRACK_KICKSTART, formatKes } from '@/lib/training';

export const metadata = {
  title: 'The AI Tools Worth Learning in Kenya, and What Each Is For',
  description:
    'A plain guide to the AI tools Kenyan professionals use at work: Claude, ChatGPT, Gemini, Copilot, NotebookLM and Meta AI in WhatsApp. Free accounts, what each does best, and what never to paste.',
  alternates: { canonical: '/resources/ai-tools-kenya' },
  openGraph: {
    type: 'article',
    siteName: 'Cloudwise',
    title: 'The AI tools worth learning in Kenya',
    description: 'What each tool is for, which free account to open, and what never to paste.',
    url: `${SITE_URL}/resources/ai-tools-kenya`,
    images: [{ url: '/dt-banner-5.png', width: 1200, height: 630, alt: 'AI tools for Kenyan professionals' }],
  },
};

const kickstart = TRACKS[TRACK_KICKSTART];

/**
 * Ungated, built from the tools the course actually teaches (tiered plan rev4,
 * §3 and §7). The full AI Toolkit and Resource Pack handout can extend it.
 */
const TOOLS = [
  {
    name: 'Claude',
    url: 'https://claude.ai',
    for: 'Real business writing, analysis, finished documents, and your own assistant (a Claude Project) that remembers how you work.',
    free: 'Yes. The free account is enough to start, and to build a Project.',
  },
  {
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    for: 'Everyday drafting and ideas. The tool most people have already heard of.',
    free: 'Yes.',
  },
  {
    name: 'Google Gemini',
    url: 'https://gemini.google.com',
    for: 'Work already in Google: Gmail, Docs and Drive.',
    free: 'Yes.',
  },
  {
    name: 'Microsoft Copilot',
    url: 'https://copilot.microsoft.com',
    for: 'Work already in Microsoft 365: Word, Excel, Outlook and Teams.',
    free: 'A free version exists; the Microsoft 365 version is paid.',
  },
  {
    name: 'NotebookLM',
    url: 'https://notebooklm.google.com',
    for: 'Questions answered only from your own documents, with the source of every answer.',
    free: 'Yes.',
  },
  {
    name: 'Meta AI in WhatsApp',
    url: 'https://www.whatsapp.com',
    for: 'Quick answers and drafts without leaving WhatsApp.',
    free: 'Yes, built into WhatsApp.',
  },
];

const NEVER_PASTE = [
  'ID numbers, KRA PINs, and full bank or M-Pesa account numbers',
  'A client’s real financial figures, unless your firm allows it in writing',
  'Passwords and one-time codes',
  'Anything covered by a confidentiality agreement',
];

function KickstartBanner() {
  return (
    <Reveal className="my-10">
      <div className="flex flex-col gap-4 rounded-3xl border border-ember/30 bg-ember/[0.07] p-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-white/85">
          <strong className="text-white">Want to see these used on real work?</strong> AI Kickstart: two hours live,
          Wednesday 7pm, {formatKes(kickstart.priceKes)}.
        </p>
        <Link href={kickstart.landingPath} className="btn-ember shrink-0 text-base">
          See the Kickstart <ArrowUpRight size={18} />
        </Link>
      </div>
    </Reveal>
  );
}

export default function AiToolsKenyaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          ['Resources', '/resources'],
          ['AI tools', '/resources/ai-tools-kenya'],
        ])}
      />
      <PageHero
        eyebrow="Free resource"
        title="The AI tools worth learning."
        subtitle="What each one is for, which free account to open, and what never to paste. Written for Kenyan professionals and business owners."
      />

      <section className="border-t border-white/10 bg-ink py-16 md:py-24">
        <div className="container-px max-w-4xl">
          <div className="space-y-4">
            {TOOLS.slice(0, 3).map((tool, i) => (
              <ToolCard key={tool.name} tool={tool} delay={i * 0.05} />
            ))}
          </div>
          <KickstartBanner />
          <div className="space-y-4">
            {TOOLS.slice(3).map((tool, i) => (
              <ToolCard key={tool.name} tool={tool} delay={i * 0.05} />
            ))}
          </div>

          <Reveal className="mt-14">
            <h2 className="font-display text-3xl font-bold text-white">What never to paste into a public AI tool</h2>
            <ul className="mt-6 space-y-3">
              {NEVER_PASTE.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/80">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-white/70">
              Write “a customer” instead of a real name, and read everything the AI writes before you send it. The
              Kenya Data Protection Act, 2019 applies to personal data whatever tool you use.
            </p>
          </Reveal>

          <KickstartBanner />

          <p className="text-white/70">
            Learn the four-part prompt method in our{' '}
            <Link href="/resources/prompt-pack" className="text-ember hover:underline">
              free Prompt Pack
            </Link>
            , or compare all{' '}
            <Link href="/ai-training" className="text-ember hover:underline">
              AI training options
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

function ToolCard({ tool, delay }) {
  return (
    <Reveal delay={delay}>
      <article className="card-dark p-6">
        <h2 className="font-display text-xl font-semibold text-white">
          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:text-ember">
            {tool.name}
          </a>
        </h2>
        <p className="mt-2 text-white/75">
          <strong className="text-white">Best for:</strong> {tool.for}
        </p>
        <p className="mt-1 text-sm text-white/65">
          <strong className="text-white/80">Free account:</strong> {tool.free}
        </p>
      </article>
    </Reveal>
  );
}
