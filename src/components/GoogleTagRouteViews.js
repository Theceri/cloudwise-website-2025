'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Send an event to GA4 from anywhere in the browser.
 *
 * Safe to call before gtag.js has loaded: the snippet in the document head
 * creates `window.dataLayer` while the page parses, and anything pushed to it is
 * processed once the script arrives. Safe to call when the script is blocked.
 */
export function trackGoogle(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

/**
 * Report a page_view on every client-side route change.
 *
 * `gtag('config', ...)` sends one page_view, on the first load. Next.js changes
 * route in the browser after that without a new document, so without this the
 * whole site would be measured as a single landing page and every later page
 * would report nothing.
 *
 * The path comes from `usePathname`, not `useSearchParams`: reading search
 * params in the root layout would opt every static page out of prerendering,
 * and the first load already records the full URL with its query string.
 *
 * Renders nothing. The tag itself is plain markup in the root layout.
 */
export function GoogleTagRouteViews() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
