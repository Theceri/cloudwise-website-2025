import Image from 'next/image';
import { PortableText as PortableTextReact } from '@portabletext/react';
import { Info, Lightbulb, AlertTriangle } from 'lucide-react';

import { urlForImage } from '@/sanity/lib/image';
import { blockText, slugifyHeading, youTubeEmbedUrl } from './ptHelpers';

const calloutConfig = {
  info: { icon: Info, cls: 'border-ice/30 bg-ice/5 text-ice' },
  tip: { icon: Lightbulb, cls: 'border-ember/30 bg-ember/5 text-ember' },
  warning: { icon: AlertTriangle, cls: 'border-yellow-400/30 bg-yellow-400/5 text-yellow-300' },
};

function HeadingWithAnchor({ value, children, Tag }) {
  const id = slugifyHeading(blockText(value));
  return (
    <Tag id={id} className="group scroll-mt-28">
      <a href={`#${id}`} className="no-underline">
        {children}
        <span className="ml-2 select-none text-ember opacity-0 transition-opacity group-hover:opacity-100">
          #
        </span>
      </a>
    </Tag>
  );
}

const components = {
  block: {
    h2: ({ value, children }) => (
      <HeadingWithAnchor value={value} Tag="h2">{children}</HeadingWithAnchor>
    ),
    h3: ({ value, children }) => (
      <HeadingWithAnchor value={value} Tag="h3">{children}</HeadingWithAnchor>
    ),
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-ember pl-5 italic text-white/80">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const isExternal = value?.href?.startsWith('http');
      return (
        <a
          href={value?.href}
          {...(value?.blank || isExternal
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-ice">
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(1400).url();
      return (
        <figure className="my-8 overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={url}
            alt={value.alt || ''}
            width={1400}
            height={788}
            sizes="(min-width: 768px) 768px, 100vw"
            className="h-auto w-full"
          />
          {value.caption && (
            <figcaption className="bg-white/[0.03] px-4 py-2 text-center text-xs text-white/45">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }) => (
      <div className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10]">
        {(value.filename || value.language) && (
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[0.7rem] text-white/40">
            <span>{value.filename || ''}</span>
            <span className="uppercase tracking-wider">{value.language}</span>
          </div>
        )}
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code className="font-mono text-white/85">{value.code}</code>
        </pre>
      </div>
    ),
    callout: ({ value }) => {
      const cfg = calloutConfig[value.tone] || calloutConfig.info;
      const Icon = cfg.icon;
      return (
        <div className={`my-6 flex gap-3 rounded-2xl border p-4 ${cfg.cls}`}>
          <Icon size={20} className="mt-0.5 shrink-0" />
          <p className="m-0 text-sm leading-relaxed text-white/80">{value.text}</p>
        </div>
      );
    },
    youtube: ({ value }) => {
      const embed = youTubeEmbedUrl(value.url);
      if (!embed) return null;
      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
            <iframe
              src={embed}
              title={value.caption || 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-xs text-white/45">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function PortableText({ value }) {
  if (!value?.length) return null;
  return <PortableTextReact value={value} components={components} />;
}
