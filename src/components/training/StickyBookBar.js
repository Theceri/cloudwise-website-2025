'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/**
 * A booking bar fixed to the bottom of the screen on phones.
 *
 * The training pages are long on a phone, and after the hero the only booking
 * button was near the end (visual audit, 14 October 2026). The bar appears once
 * the element with id `hero` has scrolled away, and leaves room on the right
 * for the WhatsApp bubble. Phones only: wide screens keep the page as it was.
 */
export function StickyBookBar({ href, label, note }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3 pr-16">
        <Link href={href} tabIndex={visible ? 0 : -1} className="btn-ember flex-1 py-3 text-[15px]">
          {label} <ArrowUpRight size={16} />
        </Link>
        {note && <span className="hidden text-xs text-white/65 min-[380px]:block">{note}</span>}
      </div>
    </div>
  );
}
