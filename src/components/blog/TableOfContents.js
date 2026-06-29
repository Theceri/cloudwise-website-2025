'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Sticky table of contents with scroll-spy. `headings` is the array produced
 * by extractHeadings() on the server.
 */
export function TableOfContents({ headings = [] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="eyebrow mb-4 text-white/40">On this page</p>
      <ul className="space-y-2 border-l border-white/10">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? 16 : 0 }}>
            <a
              href={`#${h.id}`}
              className={cn(
                '-ml-px block border-l-2 border-transparent pl-4 leading-snug transition-colors',
                active === h.id
                  ? 'border-ember text-white'
                  : 'text-white/45 hover:text-white/80'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
