'use client';

import { useEffect, useRef } from 'react';

import { trackPixel } from '@/components/MetaPixelClient';
import { trackGoogle } from '@/components/GoogleTagRouteViews';
import { META_EVENTS } from '@/lib/meta/events';

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

    // GA4 gets the same page-level step under its own name, so both tools
    // report a training-page view from one component.
    if (event === META_EVENTS.viewContent && params) {
      const id = params.content_ids?.[0];
      trackGoogle('view_item', {
        currency: params.currency,
        value: params.value,
        items: [{ item_id: id, item_name: params.content_name, price: params.value, quantity: 1 }],
      });
    }
  }, [event, params]);

  return null;
}
