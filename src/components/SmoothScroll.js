'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

let lenisInstance = null;
let scrollTrigger = null;

/**
 * Lenis smooth scrolling, wired into GSAP's ScrollTrigger.
 *
 * Only where it helps, and only loaded when it runs:
 *
 * - Devices with a fine pointer (a mouse or trackpad) only. On a phone, native
 *   touch scrolling is already smooth, and Lenis cost forced layouts and main
 *   thread time during load (traces of 9 and 14 October 2026).
 * - Never on the booking funnel (/ai-training, /checkout, /resources), where
 *   the job is to get the page drawn and the form usable as fast as possible.
 * - `lenis`, `gsap` and `ScrollTrigger` are imported dynamically inside the
 *   effect, so they are not part of the first JavaScript download on any page.
 *
 * Everything that depends on it degrades to native scrolling: `scrollTo` below
 * falls back to `scrollIntoView`.
 */

const FUNNEL_PREFIXES = ['/ai-training', '/checkout', '/resources'];

function wantsSmoothScroll(pathname) {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!window.matchMedia('(pointer: fine)').matches) return false;
  return !FUNNEL_PREFIXES.some((prefix) => pathname?.startsWith(prefix));
}

export function SmoothScroll({ children }) {
  const pathname = usePathname();
  const enabled = typeof window !== 'undefined' && wantsSmoothScroll(pathname);

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      scrollTrigger = ScrollTrigger;

      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });
      lenisInstance = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisInstance = null;
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
    // Runs again only when the route moves into or out of the funnel, so Lenis
    // is not torn down and rebuilt on every navigation.
  }, [enabled]);

  // Reset scroll + refresh triggers on route change
  useEffect(() => {
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const id = setTimeout(() => scrollTrigger?.refresh(), 120);
    return () => clearTimeout(id);
  }, [pathname]);

  return children;
}

export function scrollTo(target) {
  if (lenisInstance) lenisInstance.scrollTo(target, { offset: -80 });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}
