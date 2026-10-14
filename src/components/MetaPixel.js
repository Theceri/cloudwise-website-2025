import { MetaPixelClient } from '@/components/MetaPixelClient';
import { META_PIXEL_ID } from '@/lib/meta/events';

export { META_PIXEL_ID };

/**
 * The Meta Pixel base code, in the initial HTML.
 *
 * A server component, and deliberately not `next/script`. With
 * `strategy="afterInteractive"` Next.js puts only a `<link rel="preload">` in
 * the server-rendered HTML and injects the real `<script>` after React
 * hydrates, so nothing that reads the HTML without running the page sees the
 * pixel at all. That is what made Google Analytics report its own tag as
 * missing, and the pixel had the same defect.
 *
 * Running the snippet while the document parses also measures better: a visitor
 * who leaves before hydration finishes, on a slow phone or a bad connection, is
 * now counted instead of lost.
 *
 * Only the queue runs at parse time. The 215 KB `fbevents.js` library is
 * inserted after the page has loaded and the browser is idle, or on the first
 * tap, key or scroll, whichever comes first. On a mid-range phone the library
 * took 2.4 to 2.8 seconds of main-thread time during load (traces of 14 October
 * 2026) and pushed the training page past Google's 2.5-second LCP target. Every
 * event called before it arrives — PageView included — waits in `fbq.queue`
 * and is sent when it loads, so nothing is lost.
 */
export function MetaPixel() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];var d=!1,l=function(){if(d)return;d=!0;
t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)},i=function(){f.requestIdleCallback?
f.requestIdleCallback(l,{timeout:3000}):setTimeout(l,1500)};
['pointerdown','keydown','scroll'].forEach(function(x){
f.addEventListener(x,l,{once:!0,passive:!0})});
b.readyState==='complete'?i():f.addEventListener('load',i,{once:!0})
}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`,
        }}
      />
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
      <MetaPixelClient />
    </>
  );
}
