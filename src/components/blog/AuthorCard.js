import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Globe } from 'lucide-react';

import { urlForImage } from '@/sanity/lib/image';

export function AuthorCard({ author, link = true }) {
  if (!author) return null;
  const img = author.image
    ? urlForImage(author.image).width(120).height(120).url()
    : null;

  const NameTag = link ? Link : 'div';
  const nameProps = link ? { href: `/blog/author/${author.slug}` } : {};

  return (
    <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-ink-800/40 p-6">
      {img ? (
        <Image
          src={img}
          alt={author.image?.alt || author.name}
          width={60}
          height={60}
          className="h-[60px] w-[60px] shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-ember/20 font-display text-xl text-ember">
          {author.name?.[0] || 'C'}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-mono text-[0.65rem] uppercase tracking-eyebrow text-white/40">
          Written by
        </p>
        <NameTag {...nameProps} className="mt-1 block font-display font-semibold text-white hover:text-ember">
          {author.name}
        </NameTag>
        {author.role && <p className="text-sm text-white/50">{author.role}</p>}
        {author.bio && <p className="mt-2 text-sm leading-relaxed text-white/60">{author.bio}</p>}
        {(author.social?.linkedin || author.social?.x || author.social?.website) && (
          <div className="mt-3 flex gap-3 text-white/50">
            {author.social?.linkedin && (
              <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-ember">
                <Linkedin size={16} />
              </a>
            )}
            {author.social?.website && (
              <a href={author.social.website} target="_blank" rel="noopener noreferrer" aria-label="Website" className="hover:text-ember">
                <Globe size={16} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
