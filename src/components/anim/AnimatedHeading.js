'use client';

import { useEffect, useRef } from 'react';

/**
 * Word-by-word masked reveal for headings. `text` is split into words;
 * each word rises from behind a clip mask on scroll-in.
 */
export function AnimatedHeading({ text, as: Tag = 'h2', className = '', delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const words = el.querySelectorAll('[data-word] > span');
    // Reduced motion: the words are already in place as the server sent them.
    if (reduced) return undefined;
    // A heading already on screen at mount is left exactly as the server sent
    // it. Hiding it to animate it back in made the homepage hero the Largest
    // Contentful Paint element only after the animation ended: about 1.9
    // seconds of delay on a mid-range phone (trace of 14 October 2026).
    // The check uses an IntersectionObserver rather than getBoundingClientRect,
    // which would force a layout while the page is still being built.
    // GSAP is loaded only here, for a heading that will actually animate, so
    // it is not part of the first JavaScript download on any page.
    let tween = null;
    let cancelled = false;
    const io = new IntersectionObserver(async (entries) => {
      io.disconnect();
      if (entries[0]?.isIntersecting) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(words, { yPercent: 115 });
      tween = gsap.to(words, {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.06,
        delay,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [delay, text]);

  return (
    <Tag ref={ref} className={className}>
      {String(text)
        .split(' ')
        .map((word, i) => (
          <span
            key={i}
            data-word
            className="inline-block overflow-hidden align-bottom"
            style={{ paddingBottom: '0.06em', marginBottom: '-0.06em' }}
          >
            <span className="inline-block will-change-transform">{word}</span>
            {i < text.split(' ').length - 1 ? ' ' : ''}
          </span>
        ))}
    </Tag>
  );
}
