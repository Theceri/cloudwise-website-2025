'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Word-by-word masked reveal for headings. `text` is split into words;
 * each word rises from behind a clip mask on scroll-in.
 */
export function AnimatedHeading({ text, as: Tag = 'h2', className = '', delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const words = el.querySelectorAll('[data-word] > span');
    if (reduced) {
      gsap.set(words, { y: '0%' });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(words, { yPercent: 115 });
    const tween = gsap.to(words, {
      yPercent: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.06,
      delay,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
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
