# Performance audit: cloudwise.co.ke (mobile first), 2026-10-14

## Data status
- PSI API v5: failed. Daily quota exhausted (HTTP 429) on the shared project; the wrapper also hit an SSL EOF. No Lighthouse score, no CrUX field data (crux: null). Field data is UNAVAILABLE.
- Local Lighthouse CLI: timed out (280 s) on both pages. No lab run.
- Measured directly: TTFB (curl, 3 runs), HTML size, JS/CSS transfer (Brotli) and raw size, cache headers, tags in initial HTML.
- Indicative only: traces `trace-home.json.gz` and `trace-ai-training.json.gz` in this folder (produced by another step, throttling unknown, unlike a PSI run).
- Score below is an ESTIMATE, not a Lighthouse score.

## Measured numbers
| Metric | Home | /ai-training |
|---|---|---|
| TTFB (3 runs) | 0.29, 0.34, 1.39 s | 0.53, 0.55, 0.61 s |
| Cache | Vercel HIT, age 436237 s, max-age=0 must-revalidate | MISS, `private, no-cache, no-store` |
| HTML (decoded) | 83 KB | 140 KB |
| JS on first load (async chunks) | 420 KB Brotli / 1.09 MB raw | 412 KB Brotli / 1.07 MB raw |
| CSS | 13 KB Brotli, 1 render-blocking sheet | same sheet |
| Render-blocking | 1 CSS file; all scripts async | same |
| FCP / LCP (trace, indicative) | 1.0 s / 1.0 s | 3.0 s / 3.0 s |
| CLS (trace) | 0 | 0 |
| Long tasks over 50 ms (trace) | 54, about 13.7 s blocking | 40, about 11.9 s blocking |
| INP | not measurable in lab; high TBT suggests risk | same |

Estimated score: home ~55, /ai-training ~45, site ~50 (mobile).

## Third-party cost
Google tag (gtag.js, async, from googletagmanager.com), Meta Pixel (fbevents.js, async, plus a noscript img) and Clarity (clarity.ms/tag, async) all load while the document parses, through `insertBefore`. They do not block parsing but compete for bandwidth and main thread with the 12 first-party chunks on a mobile connection. Clarity and the pixel carry the most main-thread work after load. Exact ms per vendor needs a real Lighthouse run.

## Findings (severity order)
1. HIGH. About 1.1 MB raw (420 KB Brotli) JS on every page, including a Three.js scene, GSAP + ScrollTrigger, Lenis, framer-motion, Radix and sonner. Source: `src/components/SiteChrome.js` imports `SmoothScroll` (Lenis + GSAP) and `Toaster` for every route; `src/components/three/HeroCanvas.js` and `CloudField.jsx` load Three.js and react-three on every home visit.
2. HIGH. `/ai-training` is `force-dynamic`: no CDN cache, TTFB about 0.55 s vs 0.3 s, 140 KB HTML. Source: `src/app/ai-training/page.js` line 18.
3. HIGH. Main-thread blocking (trace: 40 to 54 long tasks) puts INP at risk on mid-range Android. Sources: `SmoothScroll.js` (Lenis + ScrollTrigger on every page), `CloudField.jsx` (render loop).
4. MEDIUM. Hero 3D canvas starts after hydration on small screens too (density 0.5 only). Source: `src/components/three/HeroCanvas.js`.
5. MEDIUM. Three analytics tags run in `<body>` during parse, before page content scripts finish. Source: `src/app/layout.js` lines 98 to 100 and `MetaPixel.js`, `GoogleTag.js`, `MicrosoftClarity.js`.
6. MEDIUM. Home HTML is `max-age=0, must-revalidate`; every visit revalidates. Source: default Next config; set shared caching with `revalidate` in `src/app/page.js`.
7. LOW. Logo PNG preloaded at 1x/2x via `next/image` without `priority` consideration; hero text is the LCP on home (opacity-safe, good). Source: `src/components/Navbar.js`, `BrandLogo.js`.
8. LOW. Three Google fonts (Inter, Space Grotesk, JetBrains Mono) in `src/app/layout.js`; `display: swap` set, CLS measured 0. Drop the mono font if it is used only in small places.
9. OK. CLS 0 in trace; `Reveal.js` only hides content below the fold; scripts are all async.

## Fixes
1. Load `SmoothScroll` and `CloudField` with `next/dynamic` after idle (`requestIdleCallback`) and skip them below 768 px; remove `framer-motion` where `Reveal` already covers it.
2. Replace `force-dynamic` with `export const revalidate = 3600` and compute the cohort strip in a small client or `unstable_cache` component.
3. Run Lenis only on pointer-fine devices and cap GSAP to pages that need ScrollTrigger.
4. Mount the canvas on first user interaction or after `load` plus idle, and use the CSS glow on mobile.
5. Move Clarity and Meta Pixel to `next/script strategy="lazyOnload"` or a post-load injector. Trade-off: the HTML-detection fix in commit 311fdb1 would regress for those two; keep the Google tag as is.
6. Add `export const revalidate` to `src/app/page.js`.

## Next step
Re-run PSI once the quota resets (midnight Pacific), or run Lighthouse with a longer timeout, to replace the estimates with real LCP, TBT, INP proxies and third-party breakdown.
