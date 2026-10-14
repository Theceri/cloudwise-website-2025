# Technical SEO audit: www.cloudwise.co.ke (14 Oct 2026)

Technical score: 78/100

| Category | Status | Score |
|---|---|---|
| Crawlability | Pass | 90 |
| Indexability | Pass with issues | 80 |
| Security headers | Fail | 45 |
| URL structure / redirects | Pass with issues | 80 |
| Mobile | Pass | 90 |
| Core Web Vitals potential | Warning | 70 |
| Structured data | Pass with issues | 78 |
| JS rendering | Pass (SSR) | 95 |
| IndexNow | Not implemented | 50 |

## Evidence summary
- robots.txt: Allow /, Disallow /checkout/, /studio, /api/; Sitemap declared; sitemap validated by helper (200, urlset, 57 URLs). Deprecated "Host:" line present (ignored by Google).
- /ai-training: 200, SSR, one H1, title/description/canonical OK, Course + FAQPage JSON-LD, Offer KES 13500. Response header Cache-Control: private, no-cache, no-store (page uses force-dynamic), X-Vercel-Cache MISS, TTFB about 0.66 s from here. Other pages are cached HIT.
- Response headers on / and /ai-training: only Strict-Transport-Security. No CSP, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy. X-Powered-By: Next.js exposed.
- http://www -> 308 to https. Apex https://cloudwise.co.ke -> 307 (temporary) to www.
- /ai-training/ -> 308 to /ai-training. /llms.txt 404. Custom 404 returns 404 status.
- Checkout pages (src/app/checkout/[ref]) have noindex and are disallowed in robots. Good.

## Findings

### High
1. **Course structured data is thin for rich results and has a stale-risk.** Course has no `offers` on each CourseInstance, no `courseMode` value at Course level, no `image`, no `inLanguage`; the Offer has no `validFrom`/`priceValidUntil`; provider Organization has only name and sameAs. Fix: add per-instance `offers` (price, currency, url, availability), `image`, `inLanguage`, and a full provider with url/logo. File: src/app/ai-training/page.js (buildCourseJsonLd).
2. **/ai-training has no og:image and no twitter:image.** The page overrides openGraph and twitter without images, so the root layout images are dropped (live HTML has no og:image, og:type or og:site_name on this page). WhatsApp, LinkedIn and X shares of the main sales page show no card image. Fix: add `images`, `type`, `siteName`, `locale` to openGraph and `images` to twitter. File: src/app/ai-training/page.js (metadata). Same gap on /ai-training/register and /resources: src/app/ai-training/register/page.js, src/app/resources/page.js.
3. **Security headers missing.** Only HSTS is sent. Fix: add an `async headers()` block (X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy, frame-ancestors via CSP or X-Frame-Options SAMEORIGIN, and `poweredByHeader: false`). The checkout takes M-Pesa/card payments, so clickjacking protection matters there. File: next.config.mjs (or next.config.js).

### Medium
4. **/ai-training is force-dynamic with no-store.** Every visit is a cold render (MISS, TTFB about 0.66 s), which risks LCP and gives crawlers no cache. Fix: use ISR (`export const revalidate = 3600`) and keep dates correct, or render only the next-cohort strip client-side or in a small dynamic child. File: src/app/ai-training/page.js (line 18).
5. **Apex redirect is 307, not 308.** https://cloudwise.co.ke/ returns 307. Fix: set the apex-to-www redirect to Permanent (308) in the Vercel project domain settings (no repo file; vercel.json `redirects` is an alternative).
6. **Mixed-case blog slug.** /blog/how-to-turn-WhatsApp-conversations-into-sales returns 200, the lowercase version 404s, and the canonical and sitemap carry the capital letters. Fix: change the slug in Sanity to lowercase and add a redirect from the old URL. Files: Sanity document, next.config.mjs (redirects).
7. **Sitemap lastmod is fake.** Every URL has lastmod = time of generation (2026-10-09T18:28:48Z for all 57). Google will learn to ignore it. Fix: use real dates (post `_updatedAt`, a per-route constant). `changefreq` and `priority` are ignored by Google; harmless. File: src/app/sitemap.js (`now` variable).
8. **/ai-training/register is indexable and in the sitemap, with near-duplicate intent to /ai-training.** It is a form page with thin text. Decide: keep it as a conversion page but make sure its title and H1 differ, or set noindex and remove it from the sitemap. Files: src/app/ai-training/register/page.js, src/app/sitemap.js.
9. **Blog category pages (9) are in the sitemap.** Thin listings. Fix: keep only if each has unique intro text; otherwise remove them from the sitemap. File: src/app/sitemap.js.

### Low
10. **robots.txt `Host:` line** is non-standard (Yandex-only legacy). Remove `host: SITE_URL`. File: src/app/robots.js.
11. **AI crawler policy is not explicit.** All bots are allowed, which is fine for visibility. No llms.txt (404); optional. Add `public/llms.txt` summarising /ai-training if you want AI search citations.
12. **IndexNow not implemented.** Bing and Yandex discover changes only by crawl. Fix: add a key file in `public/` and ping IndexNow from the sitemap or cron route. File: src/app/api/cron/daily (new call) plus public/<key>.txt.
13. **Third-party scripts** (Google tag, Meta Pixel, Clarity) are in the initial HTML. Confirm they use `afterInteractive` so they do not hurt LCP/INP. Files: src/components/GoogleTag.js, MetaPixel.js, MicrosoftClarity.js.
14. **Title template doubles brand.** "About Cloudwise — Nairobi ICT & AI Company · Cloudwise" and "Contact Cloudwise — Nairobi · Cloudwise" repeat the brand. Drop the in-title brand where present. Files: src/app/about/page.js, src/app/contact/page.js.
15. **Homepage and many pages have only Organization JSON-LD.** Add WebSite and LocalBusiness (Nairobi address) schema, and BreadcrumbList on deep pages. File: src/app/layout.js.

## Passed
HTTPS and HSTS (max-age 63072000, no includeSubDomains/preload); HTTP to HTTPS 308; canonical on every sampled page; viewport present; single H1; server-rendered HTML (no SPA shell, no Playwright needed); alt text on content images; fonts via next/font with preload; custom 404 status; checkout noindexed and blocked; trailing slash normalised.

## Core Web Vitals notes (source-based)
- LCP: hero on /ai-training is text plus a decorative Gauge; the only preloaded image is the logo. Main risk is the uncached dynamic render (finding 4).
- CLS: logo has width/height; no obvious risk. Reveal/AnimatedHeading animations should animate only transform and opacity.
- INP: three analytics tags plus animation libraries; verify with field data.
