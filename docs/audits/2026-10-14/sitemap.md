# Sitemap and robots.txt audit: https://www.cloudwise.co.ke
Date: 2026-10-14. Score: 82/100.

## Method
Fetched /sitemap.xml and /robots.txt live. Requested all 57 listed URLs. Read src/app/sitemap.js, src/app/robots.js, queries and route tree.

## Results
| Check | Result |
|---|---|
| sitemap.xml HTTP 200, application/xml, valid XML, 10,887 bytes | Pass |
| Size limits (57 URLs, 50,000 max) | Pass |
| Status of 57 listed URLs | Pass: all 200, none redirected |
| Canonical host (www) matches listed URLs | Pass. Apex redirects with 307 (temporary), see M1 |
| robots.txt 200, references sitemap, blocks /checkout/, /studio, /api/ | Pass |
| /ai-training and /ai-training/register listed | Pass |
| Blog posts listed (24) and category pages (9) | Pass |
| Retired /women-biz360 not listed (301 to /ai-training in next.config.mjs) | Pass |
| /checkout, /studio, /api, /blog/search (noindex) not listed | Pass |
| Deprecated priority and changefreq tags | Info: 114 tags present, ignored by Google |
| lastmod accuracy | Fail for 33 URLs, see H1 |
| Mixed-case slug | Warning, see M2 |

## Findings

### High
H1. lastmod is fake for 33 URLs. Static pages, 8 service pages, 4 portfolio pages and all 9 category pages use `new Date()`, which is the regeneration time. Live output shows one identical value (2026-10-09T18:28:48.194Z) on all 33. Only blog posts carry real dates (from Sanity `_updatedAt`). Google learns to ignore lastmod when it is always "now".
File: src/app/sitemap.js (lines 9, 39, 43, 50, 63). Fix: use fixed per-route dates (or the real file or content date), and for categories use the newest post `_updatedAt` in that category.

### Medium
M1. Apex cloudwise.co.ke answers 307 (temporary) to www. Fix in the Vercel domain settings: set the redirect to 308/301. Not in repo code.
M2. Post slug `how-to-turn-WhatsApp-conversations-into-sales` has capital letters. The lowercase URL returns 404, so there are two possible URL forms and links in lowercase break. Fix in Sanity: lowercase the slug and add a redirect from the old one in next.config.mjs. Sitemap code is src/app/sitemap.js, redirect file is /next.config.mjs.
M3. Sitemap is fetched through a cached Sanity client. The live response was served with a 5 day old build, so new posts may show late. `revalidate = 3600` is set, but the client may use CDN caching. Fix: confirm `useCdn: false` for the sitemap fetch in src/sanity/lib/client.js, or call revalidatePath('/sitemap.xml') from src/app/api/revalidate/route.js.
M4. Sanity errors are swallowed by an empty `catch`. If Sanity fails, the sitemap silently drops all 33 blog URLs and Google may see them as removed. Fix: in src/app/sitemap.js log the error and let the last good sitemap remain (throw so Next keeps the stale cache).

### Low
L1. The post query does not exclude posts with `seo.noindex` (the post page sets noindex when true). A noindexed post would still appear in the sitemap. Fix: add `&& seo.noindex != true` to sitemapPostsQuery in src/sanity/lib/queries.js.
L2. Category pages are listed even when empty. Fix: only list categories that have at least one published post in categorySlugsQuery.
L3. priority and changeFrequency are ignored by Google. Fix: delete them in src/app/sitemap.js.
L4. robots.js uses `host`, which Google ignores. Harmless. Disallow `/studio` has no trailing slash and so also blocks paths like /studio-x. Harmless. Disallow of /api/ is correct.
L5. Tag and author pages (/blog/tag/*, /blog/author/*) exist but are not listed. Acceptable, and arguably correct. Add authors only if they carry unique content.

## Coverage against routes
Routes with a page.js that are indexable: /, /about, /ai-training, /ai-training/register, /blog, /contact, /portfolio and slugs, /resources and slugs, /services and slugs, blog posts and categories. All are listed. Not listed by design: /studio, /checkout/*, /api/*, /blog/search, /blog/rss.xml (feed, not a page).
