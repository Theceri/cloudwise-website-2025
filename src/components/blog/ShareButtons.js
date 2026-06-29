'use client';

import { Linkedin, Link2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { SITE_URL } from '@/lib/constants';

// Lightweight X (Twitter) glyph — lucide dropped the bird.
function XIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function ShareButtons({ title, slug }) {
  const url = `${SITE_URL}/blog/${slug}`;
  const text = encodeURIComponent(title);
  const enc = encodeURIComponent(url);

  const links = [
    { label: 'Share on X', href: `https://twitter.com/intent/tweet?text=${text}&url=${enc}`, icon: <XIcon /> },
    { label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`, icon: <Linkedin size={16} /> },
    { label: 'Share on WhatsApp', href: `https://wa.me/?text=${text}%20${enc}`, icon: <MessageCircle size={16} /> },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 font-mono text-[0.65rem] uppercase tracking-eyebrow text-white/40">
        Share
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-ember hover:text-ember"
        >
          {l.icon}
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-ember hover:text-ember"
      >
        <Link2 size={16} />
      </button>
    </div>
  );
}
