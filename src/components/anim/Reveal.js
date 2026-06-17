'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight scroll reveal using IntersectionObserver.
 * Honors prefers-reduced-motion (renders visible immediately).
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 28,
  className = '',
  once = true,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    el.style.opacity = '0';
    el.style.transform = `translateY(${y}px)`;
    el.style.transitionProperty = 'opacity, transform';
    el.style.transitionDuration = '0.9s';
    el.style.transitionTimingFunction = 'cubic-bezier(0.22,1,0.36,1)';
    el.style.transitionDelay = `${delay}s`;
    el.style.willChange = 'opacity, transform';

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1';
            el.style.transform = 'none';
            if (once) io.unobserve(el);
          } else if (!once) {
            el.style.opacity = '0';
            el.style.transform = `translateY(${y}px)`;
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, y, once]);

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
