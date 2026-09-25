'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { META_PIXEL_ID } from '@/lib/meta/events';

export { META_PIXEL_ID };

/**
 * Fire a pixel event from anywhere in the browser.
 *
 * Safe to call before the pixel script has loaded: the base snippet installs a
 * queue on `window.fbq` immediately, and anything queued is sent once the
 * script arrives. Safe to call when the script is blocked, too, which is why
 * the money events go through the Conversions API instead of this.
 */
export function trackPixel(eventName, params = {}, options = {}) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', eventName, params, options);
}

// The base code fires PageView once, on the first load. Next.js navigates on the
// client after that, so we fire PageView again on every route change.
function useRouteChangePageView() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
  }, [pathname]);
}

/**
 * Report every WhatsApp click as a Contact, from one place.
 *
 * WhatsApp links are scattered across the site — the floating button, the
 * training page, the footer — and several are rendered by server components or
 * by a third-party widget we do not control. A delegated listener on the
 * document catches all of them without touching any of those call sites, and
 * keeps working when a new one is added.
 */
function useWhatsAppContactTracking() {
  useEffect(() => {
    function onClick(event) {
      const link = event.target?.closest?.('a[href]');
      if (!link) return;
      if (!/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(link.href)) return;
      trackPixel('Contact', { content_name: 'WhatsApp' });
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
}

export function MetaPixel() {
  useRouteChangePageView();
  useWhatsAppContactTracking();

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
