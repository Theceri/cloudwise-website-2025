'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight scroll reveal using IntersectionObserver.
 * Honors prefers-reduced-motion (renders visible immediately).
 *
 * Two rules keep this from ever hiding content the user is looking at:
 *
 * 1. Nothing above the fold is ever hidden. The markup ships visible from the
 *    server, so the only way content the user is looking at can disappear is
 *    if we hide it ourselves — and an animation is never worth a blank screen
 *    where a form should be.
 * 2. The observer triggers on the element's top edge, not on a share of its
 *    area. A ratio threshold silently fails for anything taller than the
 *    viewport: a long form can only ever have a fraction of itself on screen,
 *    so it can sit below a fold it never crosses and stay invisible until the
 *    user scrolls — which they will not do if the page looks empty.
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

    // Rule 1. Only ever hide something that starts below the fold. Anything
    // on screen — or already scrolled past, which is what a restored scroll
    // position gives you — keeps the visible markup the server sent.
    // Skipping the observer entirely also skips the re-hide branch below, so
    // such an element stays put even with `once: false`.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

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
      // Rule 2. threshold 0 fires the moment any part of the element enters
      // the root, whatever its height; the bottom inset pulls the trigger
      // line up off the very edge of the screen so the motion still reads as
      // a reveal rather than a pop.
      { threshold: 0, rootMargin: '0px 0px -80px 0px' }
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
