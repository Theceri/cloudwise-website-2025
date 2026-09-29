'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * The Google tag (gtag.js) measurement id for the Cloudwise GA4 property.
 *
 * Public by design — it ships in the page source of every site that uses it —
 * so it carries a default and only needs the environment variable if the
 * property is ever replaced.
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-NR6CG8TH1K';

/**
 * Send an event to GA4 from anywhere in the browser.
 *
 * Safe to call before gtag.js has loaded: the base snippet installs
 * `window.dataLayer` immediately and anything pushed to it is processed once
 * the script arrives. Safe to call when the script is blocked, too.
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
 */
function useRouteChangePageView() {
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
}

export function GoogleTag() {
  useRouteChangePageView();

  return (
    <>
      <Script
        id="google-tag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
