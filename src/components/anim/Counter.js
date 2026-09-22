'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A number that counts up when it scrolls into view.
 *
 * The initial state is the real value, not zero. This component renders on the
 * server too, and anything that reads the HTML without running JavaScript —
 * search engine crawlers, AI answer engines, link previews, a browser with
 * scripting off — only ever sees that first render. Starting at zero published
 * "0 happy clients" and "0% completion rate" to exactly the readers we most
 * want the real figures in front of.
 *
 * So the rewind to zero happens on the client, and only for a counter that is
 * still below the fold. One already on screen when the page loads keeps its
 * number: the reader has read it, and snapping it back to zero to re-animate
 * would look like a glitch.
 */
export function Counter({ to = 0, duration = 1800, suffix = '', prefix = '', className = '' }) {
  const ref = useRef(null);
  const [value, setValue] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Already in view on load — leave the number where it is.
    const { top, bottom } = el.getBoundingClientRect();
    if (top < window.innerHeight && bottom > 0) return;

    setValue(0);

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        const start = performance.now();
        const animate = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
