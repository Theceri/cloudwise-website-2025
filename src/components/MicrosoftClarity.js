/**
 * The Microsoft Clarity project id. Public by design: it ships in the page
 * source, so it carries a default and the environment variable is only needed
 * if the Clarity project is ever replaced.
 */
export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'yv5715yuj5';

/**
 * Microsoft Clarity (session recordings and heatmaps), exactly as Microsoft
 * issues it, in the initial HTML.
 *
 * A server component, and deliberately not `next/script`, for the same reason
 * as GoogleTag and MetaPixel: with `strategy="afterInteractive"` the real
 * `<script>` only arrives after React hydrates, so a visitor who leaves before
 * then is never recorded, and nothing that reads the HTML sees the tag.
 *
 * No route-change handling is needed. Clarity watches the History API itself,
 * so client-side navigation in Next.js is recorded as part of the same session.
 */
export function MicrosoftClarity() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`,
      }}
    />
  );
}
