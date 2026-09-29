import { GoogleTagRouteViews } from '@/components/GoogleTagRouteViews';
import { GA_MEASUREMENT_ID } from '@/lib/analytics/google';

export { GA_MEASUREMENT_ID };

/**
 * The Google tag (gtag.js), exactly as Google issues it, in the initial HTML.
 *
 * A server component, and deliberately not `next/script`. With
 * `strategy="afterInteractive"` Next.js puts only a `<link rel="preload">` in
 * the server-rendered HTML and injects the real `<script>` after React
 * hydrates. Anything that reads the HTML without running the page to
 * completion therefore sees no tag at all, which is why Google Analytics
 * reported "Your Google tag wasn't detected on www.cloudwise.co.ke" while the
 * tag was in fact installed.
 *
 * Rendering the snippet as plain markup fixes the detection, and also makes the
 * measurement better: the tag now runs while the document parses instead of
 * after hydration, so a visitor who leaves quickly, or whose hydration never
 * finishes, is still counted.
 *
 * React hoists the async `src` script into `<head>`, which is where Google asks
 * for it. The inline snippet creates `window.dataLayer` and the `gtag` shim, so
 * the two are order-independent: whichever runs first, no call is lost.
 */
export function GoogleTag() {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${GA_MEASUREMENT_ID}');`,
        }}
      />
      <GoogleTagRouteViews />
    </>
  );
}
