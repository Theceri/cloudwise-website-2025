'use client';

import { useEffect, useRef } from 'react';

import { trackPixel } from '@/components/MetaPixel';

/**
 * Fire one pixel event when a page mounts, and only once.
 *
 * Lets a server component report a step of the funnel without becoming a client
 * component itself. React runs effects twice in development Strict Mode, hence
 * the ref: a doubled ViewContent would quietly halve every conversion rate you
 * later read off this.
 */
export function PixelEvent({ event, params }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackPixel(event, params || {});
  }, [event, params]);

  return null;
}
