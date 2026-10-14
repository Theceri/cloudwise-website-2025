# GEO / AI Search Audit: www.cloudwise.co.ke

**Audit date:** 14 October 2026
**Scope:** whole site, with extra depth on `/ai-training`
**Business goal:** AI training enquiries (individual seats at Ksh 13,500 and private team training)
**Repo:** `D:\projects\cloudwise-website-2025` (read only; no files changed)
**Method:** live fetches with `render_page.py` (raw mode; no page is an SPA shell), robots/llms/RSL probes, user-agent tests for nine crawlers, and off-site entity checks (Wikipedia API, Wikidata API, DuckDuckGo/Bing results, LinkedIn public page). Reddit search returned a block page, so Reddit presence is marked "not found / not verifiable".

---

## 1. GEO Readiness Score: **51 / 100**

| Dimension | Weight | Score | Weighted | One-line reason |
|---|---|---|---|---|
| Citability | 25% | 55 | 13.8 | Hard facts (price, dates, format) are present, but there is no definitional lead passage, no outcome numbers and no sourced statistics |
| Structural Readability | 20% | 62 | 12.4 | Clean single H1 and hierarchy, but the H2s are slogans and the FAQ questions sit in `<button>` elements, not headings |
| Multi-Modal Content | 15% | 25 | 3.8 | No video, no tables, no session photos; 4 images on `/ai-training`, two of them the logo |
| Authority & Brand Signals | 20% | 30 | 6.0 | No named trainer, placeholder team photos, a first-name-only blog author, and a crowded "Cloudwise" namespace |
| Technical Accessibility | 20% | 75 | 15.0 | Full SSR and every AI crawler gets HTTP 200, but llms.txt is missing, there is no IndexNow and the training page has no og:image |
| **Total** | | | **51** | |

### Platform-specific scores

| Platform | Score | Why |
|---|---|---|
| **ChatGPT Search** | **56** | OAI-SearchBot and ChatGPT-User are allowed and get HTTP 200. `/ai-training` is in the Bing index (DuckDuckGo returns it for "best AI training Nairobi"). The GA4 data confirms this channel works: chatgpt.com sent 10 of 97 sessions (10.3%) with a 4m59s average session. |
| **Google AI Overviews** | **50** | Googlebot access, Course and FAQPage JSON-LD and a canonical are all correct. The weak points are E-E-A-T: no named instructor, no reviews tied to real people, and placeholder team photos. |
| **Bing Copilot** | **47** | Indexed in Bing, but no Bing Webmaster verification is in code (it may be DNS-verified; please confirm), there is no IndexNow, and the sitemap `lastmod` changes every hour for static pages, which weakens the freshness signal. |
| **Perplexity** | **33** | PerplexityBot is allowed, but Perplexity leans heavily on third-party lists, Reddit and YouTube. "Best AI training Nairobi" and "AI productivity training Kenya" return directories (DataMites, Knowledge Academy, Inceptor, nairobionline.com list), and Cloudwise is absent from all of them. This matches the zero Perplexity sessions in GA4. |

---

## 2. AI Crawler Access Status

**Source:** `src/app/robots.js`. There is one `User-Agent: *` group with `Allow: /` and disallow rules for `/checkout/`, `/studio` and `/api/`. No bot is named, so every crawler inherits the wildcard. Each user agent below was also tested live against `/ai-training`.

| Crawler | Governs | robots.txt | Live test | Note |
|---|---|---|---|---|
| OAI-SearchBot | ChatGPT Search results and citations | Allowed (wildcard) | 200, 140 KB | Correct for the goal |
| ChatGPT-User | Live fetches when a ChatGPT user asks about a page | Allowed (wildcard) | 200 | Correct |
| GPTBot | OpenAI **model training only**; does not govern ChatGPT Search | Allowed (wildcard) | 200 | Business choice; allowing it is fine for brand awareness |
| Claude-SearchBot | Claude search citations | Allowed (wildcard) | 200 | Correct |
| ClaudeBot | Anthropic **training only** | Allowed (wildcard) | 200 | Business choice |
| PerplexityBot | Perplexity index and citations | Allowed (wildcard) | 200 | Correct. Zero Perplexity traffic is an authority problem, not an access problem |
| Perplexity-User | Live user-triggered fetches | Allowed (wildcard) | 200 | Correct |
| Googlebot | Google Search **and AI Overviews / AI Mode** | Allowed (wildcard) | not tested (standard) | Correct |
| Google-Extended | Gemini/Vertex training and grounding, plus training of the models behind Search gen-AI features. Does **not** affect AI Overviews inclusion | Allowed (wildcard) | n/a (robots token only) | Keep allowed if you want Gemini app grounding |
| Bingbot | Bing index, which feeds Copilot and part of ChatGPT Search | Allowed (wildcard) | 200 | Correct |
| Applebot / Applebot-Extended | Siri/Spotlight discovery / Apple Intelligence **training only** | Allowed (wildcard) | n/a | Fine |
| CCBot | Common Crawl (training corpora) | Allowed (wildcard) | 200 | Business choice |
| cohere-ai | Cohere training | Allowed (wildcard) | n/a | Business choice |

**Verdict:** access is not the problem. No WAF or Vercel bot protection blocks any AI user agent.

**Minor robots notes**
- `Host: https://www.cloudwise.co.ke` is a Yandex-only directive. It is harmless, but `host:` can be dropped from `src/app/robots.js`.
- **Future-proofing risk:** if anyone later adds a named group (for example `userAgent: 'GPTBot', disallow: '/'`), the named bot stops reading the `*` group, including its `/checkout/` and `/api/` disallows. Add a comment in `src/app/robots.js` that says so.
- **Apex redirect is 307 (temporary):** `https://cloudwise.co.ke/ai-training` returns 307 to `www`. Set it to 308 (permanent) in the Vercel domain settings. This is not a repo file. Blog body links in Sanity also point at the apex host (`https://cloudwise.co.ke/ai-training`), so every one of those internal links goes through a redirect.

---

## 3. llms.txt and RSL status

| File | Status | Evidence |
|---|---|---|
| `/llms.txt` | **Missing** (404) | No `public/llms.txt` and no `src/app/llms.txt/route.js` |
| `/llms-full.txt` | Missing (404) | |
| RSL 1.0 (`/license.xml` or `License:` line in robots.txt) | **Missing** | No licence directive in `src/app/robots.js` |

**Fix (1 hour):** add `public/llms.txt`. The file is static, has no build impact and is served at the root. Suggested outline:

```
# Cloudwise Limited
> Cloudwise Limited is an ICT company in Nairobi, Kenya (founded 2019) that builds AI agents, web and mobile apps, and runs hands-on AI productivity training for non-technical business teams. Not affiliated with Cloudwise Academy, cloudwise.africa or other companies called Cloudwise.

## AI training
- [AI Productivity Training](https://www.cloudwise.co.ke/ai-training): 8 hours over two Saturdays (1st and 2nd Saturday monthly, 9am-1pm), online or in person at Delta Corner, Waiyaki Way. Ksh 13,500 per person.
- [Register](https://www.cloudwise.co.ke/ai-training/register): dates, M-Pesa and card payment
- [Team training](https://www.cloudwise.co.ke/ai-training): private sessions for organisations
- [AI Readiness Guide](https://www.cloudwise.co.ke/resources/ai-readiness)
- [Starter Prompt Pack](https://www.cloudwise.co.ke/resources/prompt-pack)

## Services
- [AI Agent Development](https://www.cloudwise.co.ke/services/ai)
...
## Contact
- hello@cloudwise.co.ke, +254 712 658 775
```

The llms.txt standard is still a proposal. No major engine has confirmed that it uses the file for ranking, so treat this as cheap insurance, not a traffic lever. The disambiguation sentence is the most valuable line in it.

**RSL:** optional. Your goal is to be cited, so a licence that restricts use is the wrong default. If you add one, use a permissive RSL `<license>` that allows `ai-search` use with attribution. Low priority.

---

## 4. Entity clarity (the biggest strategic gap)

### 4.1 The "Cloudwise" namespace is crowded

Off-site checks for "Cloudwise" return several unrelated organisations. Two of them compete with you directly:

| Entity | Domain | Overlap with you |
|---|---|---|
| **Cloudwise (Kenya)**, a cloud partner, phone 012 665 1015 | cloudwise.africa, linkedin.com/company/cloudwise-africa | **Same country, same industry.** Shows next to you for "Cloudwise Kenya" |
| **Cloudwise Academy** | cloudwiseacademy.com, youtube.com/@cloudwiseacademy | **Sells technology training.** Ranks for "Cloudwise AI training" and owns a YouTube channel |
| Cloudwise (NL, education IT) | cloudwise.app, cloudwise.nl | Owns the generic "Cloudwise" query |
| cloudwise.ai, cloudwise.sg, cloudwise.org | various | General noise |
| YouTube @cloudwise, @CloudWiseTeam, @Cloud_Wise | youtube.com | None of them is yours |

An LLM that sees "Cloudwise AI training" can merge you with Cloudwise Academy. An LLM that sees "Cloudwise Kenya" can merge you with cloudwise.africa. The fix is to make the entity unambiguous in machine-readable form and in prose.

### 4.2 Your own entity signals are inconsistent

| Signal | Value | Problem |
|---|---|---|
| Schema `name` (`src/app/layout.js` line 71) | Cloudwise Limited | Good |
| Blog publisher (`src/app/blog/[slug]/page.js` line 122) | Cloudwise | Plain string, not linked to the Organization node |
| Course `provider` (`src/app/ai-training/page.js` line 120) | Cloudwise Limited, `sameAs: SITE_URL` | Not linked by `@id`. `sameAs` pointing at your own site is a misuse; it should be `url` or `@id` |
| **LinkedIn page name** | **"Cloudwise Technologies"** (469 followers, vanity URL `/company/cloudwisedev`) | Different legal-style name. The description covers web/app development only and does not mention AI training |
| `sameAs` LinkedIn URL (`src/lib/constants.js` line 41) | `linkedin.com/company/90601227/` | **Returns 302 to a login wall** for crawlers, so it cannot be resolved. Use `https://www.linkedin.com/company/cloudwisedev/` |
| Facebook | facebook.com/p/Cloudwise-100090485484263 appears in results | Not in `sameAs`. Confirm it is yours before adding it |
| Wikipedia | No article (API search returns 0 relevant hits) | Expected for a firm of this size; Wikipedia is not a realistic short-term target |
| Wikidata | No item | **Realistic target.** A Wikidata item with official website, inception 2019, country Kenya, HQ Nairobi and industry gives LLMs an anchor |

**Fixes**
1. In `src/app/layout.js` (`orgJsonLd`, lines 71-88) add `"@id": "https://www.cloudwise.co.ke/#organization"`, `description`, `disambiguatingDescription` ("Nairobi ICT company; not affiliated with Cloudwise Academy or cloudwise.africa"), `areaServed` (Kenya, East Africa), `knowsAbout` (AI productivity training, AI agents, web development), `founder` (Paul Theceri as a Person), and `contactPoint`.
2. In `src/lib/constants.js` (`SOCIAL_LINKS`, line 41) replace the numeric LinkedIn URL with the vanity URL and add the Facebook page once confirmed.
3. In `src/app/ai-training/page.js` (line 120) change `provider` to `{ "@id": "https://www.cloudwise.co.ke/#organization" }`. In `src/app/blog/[slug]/page.js` (line 122) do the same for `publisher`.
4. **Off-site:** rename the LinkedIn page to "Cloudwise" or "Cloudwise Limited", and add AI training to its tagline and About section.
5. **Off-site:** create a Wikidata item.

---

## 5. Brand mention analysis

| Platform | Status | Correlation with AI citation | Assessment |
|---|---|---|---|
| **YouTube** | **None found.** Four other "Cloudwise" channels exist | Strongest (~0.74) | **Biggest single gap.** Cloudwise Academy owns "Cloudwise" plus training on YouTube |
| **Reddit** | None found (search blocked; no results surfaced in web search) | High | r/Kenya and r/nairobi threads on "AI course recommendations" are what Perplexity quotes |
| **Wikipedia / Wikidata** | None | High | Start with Wikidata |
| **LinkedIn** | Company page exists as "Cloudwise Technologies" | Medium | Name mismatch; no AI-training positioning |
| Instagram | Active (@cloudwise.co.ke, recent posts indexed) | Low (rarely cited) | Good for audience, weak for LLMs |
| TikTok | @cloudwisehq_ linked | Low | Handle does not match the brand name |
| Kenyan directories / listicles | Absent from nairobionline.com "colleges with AI training" list and similar | High for Perplexity | Direct route into Perplexity answers |
| Client mentions | TechCamp and Stratostaff named on-site only | Medium | No reciprocal mention found on their sites |

**Domain Rating matters less than mentions here** (~0.27 correlation). Spend effort on YouTube, Reddit and listicle inclusion before link-building.

---

## 6. `/ai-training` deep dive: passage-level citability

**Rendering:** full SSR (`is_spa: false`). `export const dynamic = 'force-dynamic'` means the page is rendered per request (`Cache-Control: private, no-store`). TTFB was about 0.9s for every crawler, which is acceptable. Every sentence, including the FAQ answers and testimonials, is in the initial HTML. The client components (`Faq.js`, `Testimonials.js`, `Reveal`) still server-render their text.

**Extracted main text:** about 870 words after boilerplate removal, about 1,150 visible words in total.

### 6.1 What already works

- **Hard, quotable facts:** Ksh 13,500 (normally Ksh 30,000); 8 hours; 1st and 2nd Saturday, 9am-1pm; Zoom or in person at 4th Floor, Delta Annex, Delta Corner, Waiyaki Way; M-Pesa or card. These are exactly the facts an LLM needs for "how much is AI training in Nairobi".
- **FAQ answers are model-sized:** 7 answers of 25-60 words each, self-contained, with the answer in the first sentence ("Both.", "No.", "Yes."). These are the most citable passages on the site.
- **Course JSON-LD** with three `CourseInstance` nodes carrying real dates (7/14 Nov, 5/12 Dec 2026, 2/9 Jan 2027), `courseMode`, `courseWorkload: PT8H`, `Offer` in KES and a `Place`. **FAQPage JSON-LD** mirrors the visible FAQ.
- The FAQ dates are generated per request, so they never go stale.
- Named tools (Claude, ChatGPT, Gemini, Perplexity, Midjourney, Zapier, Make) match how people phrase queries.

### 6.2 Passage problems, ranked

| # | Problem | Evidence | Fix | File |
|---|---|---|---|---|
| P1 | **No definitional lead passage.** The first 60 words do not say who runs it, where, how long or what it costs in one extractable block | Eyebrow `<p>` "AI Productivity Training · Nairobi"; H1 "Work Smarter with AI."; lead "A hands-on training that gives you – and your team – the exact skills…" | Under the hero, add a 130-170 word block headed "What is the Cloudwise AI Productivity Training?" that opens: "The Cloudwise AI Productivity Training is an 8-hour, hands-on course for non-technical business staff, run by Cloudwise Limited in Nairobi, Kenya, on the first and second Saturday of every month…" and includes price, format, tools and team option | `src/app/ai-training/page.js` (hero, about lines 195-260) |
| P2 | **H1 and H2s are slogans with no entity or query match** | H1 "Work Smarter with AI."; H2s "The value stack", "Resources you'll keep", "This training is for you if…" | Keep the brand line as display text, but make the H1 "AI Productivity Training in Nairobi". Rephrase H2s as questions people ask: "What does the training cover?", "Which AI tools will I learn?", "Who is the training for?", "Who runs the training?" | `src/app/ai-training/page.js` lines 200-203 and section headings |
| P3 | **FAQ questions are not headings.** Each question is a `<span>` inside a `<button>`, so text extractors (trafilatura and most LLM pipelines) keep the answer and drop the question | `extracted_text` lists all 7 answers with no questions | Render the question inside an `<h3>` (keep the button inside it for the accordion), or use `<details><summary>` | `src/components/Faq.js` lines 25-31 |
| P4 | **No outcome numbers and no sourced statistics.** The only statistic ("cut report-writing time in half") sits in an anonymous testimonial | Stats on the page are 55% (discount) and 100% (hands-on) | Add 3-4 verifiable figures with a date: people trained to date, cohorts run since a named month, organisations trained, average rating. One sourced market statistic (for example on AI adoption in Kenyan SMEs) with a link to the source | `src/app/ai-training/page.js` "Why Cloudwise" section, about line 432 |
| P5 | **Team training is buried.** The highest-value enquiry (private team training) is one FAQ answer of 30 words | FAQ "Can you train my whole team?" | Add a section headed "Can Cloudwise train my whole team?" with format, group size, on-site option, how pricing works and a named example (TechCamp, Stratostaff). Longer term, a dedicated `/ai-training/teams` page | `src/app/ai-training/page.js`; new route |
| P6 | **No differentiation passage.** Competing results (DataMites, Knowledge Academy, IAT) are technical ML courses; yours is non-technical productivity training, but the page never says so in a comparison | n/a | Add "How is this different from an AI or machine learning course?" (60-100 words). This answers the comparative queries that ChatGPT and Perplexity like to answer | `src/app/ai-training/page.js` |
| P7 | **Value-stack passages depend on context.** "Worth 20K", "Priceless" and "Yours to keep" mean nothing when extracted alone | Value stack, lines 45-50 | Write each item as a full sentence, for example "The fee includes 8 hours of live training (2 sessions of 4 hours)…" | `src/app/ai-training/page.js` lines 45-50 |

---

## 7. Authority and trust signals (E-E-A-T)

| Signal | Status | Fix | File |
|---|---|---|---|
| **Named trainer** | **Missing** on `/ai-training`. "Trained by ICT practitioners, not academics" names nobody. "Certified ICT & AI practitioners" names no certification | Add the trainer(s) with photo, role, years of experience, named certifications and a LinkedIn link. Add `instructor` (Person) to each `CourseInstance` | `src/app/ai-training/page.js` about line 432 and `buildCourseJsonLd` line 114 |
| Team page | Names exist (Paul Theceri, Edwin Kailikia, Brian Kivuti, Joseph Mutua) but **all four photos are placeholders** (`placeholder1-4.jpg`). No bios, no links, no Person schema | Use real photos and add a 1-2 line bio and LinkedIn link for each | `src/app/about/page.js` lines 20-23 |
| Blog author | Every sampled post is by "Gavin": first name only, no role, bio, photo or links. Gavin is not on the About team list. Schema is `{ "@type": "Person", "name": "Gavin" }` | Complete the Sanity author document (full name, role, bio, photo, LinkedIn). In JSON-LD add `url` (the `/blog/author/[slug]` page), `jobTitle` and `sameAs` | `src/app/blog/[slug]/page.js` lines 116-118; Sanity author document |
| Testimonials | 2 quotes attributed to organisations only (TechCamp, Stratostaff), no person, no date | Add a named person and role for each, and more quotes from individual cohort graduates | `src/components/Testimonials.js` lines 6-19 |
| Dates | Blog posts carry `datePublished` and `dateModified`. `/ai-training` has none (acceptable for a product page) | No action | |
| Blog statistics | Sampled AI posts (330-530 words) contain no figures or outbound citations | Add 1-2 sourced statistics per post and a 40-60 word direct answer under each H2 | Sanity content |

---

## 8. Multi-modal content

| Asset | `/ai-training` | Fix |
|---|---|---|
| Images | 4 in total: 2 logos, 1 WhatsApp avatar, 1 empty-alt decorative image. **No photos of a real session** | Add 3-5 photos of real cohorts at Delta Corner with descriptive alt text ("Participants using ChatGPT at the Cloudwise AI training, Nairobi, November 2026") |
| Video | None | A 60-90 second YouTube video (what a session looks like, plus one graduate on camera) embedded on the page with `VideoObject` schema. This also starts the YouTube presence |
| Tables | None | A schedule/format table (Day / Time / Topics) and a comparison table (Individual seat vs Team training: price, location, size, customisation). Tables extract cleanly into AI answers |
| og:image | **Missing** on `/ai-training`, `/ai-training/register` and `/resources`. The page-level `openGraph` object replaces the root layout's object, so the root `images` value is lost | Add `images` to each page's `openGraph`, or add `src/app/ai-training/opengraph-image.(png|jsx)` | `src/app/ai-training/page.js` line 25; `src/app/ai-training/register/page.js` line 21; `src/app/resources/page.js` line 14 |

Note on og:image: ChatGPT, Perplexity, WhatsApp and LinkedIn all show link-preview cards. A course page with no image gets fewer shares, and shares are where third-party mentions come from.

---

## 9. Technical accessibility summary

| Check | Result |
|---|---|
| SSR vs CSR | SSR on every sampled page; no SPA shell |
| AI crawler HTTP status | 200 for OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, ClaudeBot, GPTBot, CCBot, Bingbot |
| Canonicals | Correct, `www` host on every page |
| Meta robots | `index, follow` |
| Sitemap | Present, 58 URLs, includes `/ai-training` (priority 0.95) and the resources pages |
| Sitemap `lastmod` | **Static, service, portfolio and category URLs use `now`** (`src/app/sitemap.js` lines 39, 43, 50, 64), so they claim to change every hour. Bing and Google learn to ignore a `lastmod` that always changes. Use a fixed date per route, or the real content date |
| IndexNow | **Not implemented.** Bing (Copilot) and the Bing-fed part of ChatGPT Search pick up new cohort dates and blog posts faster with it. Add a key file in `public/` and ping IndexNow from `src/app/api/revalidate/route.js` when Sanity publishes |
| Bing Webmaster Tools | No `msvalidate.01` meta in code. **Please confirm** whether the site is verified by DNS. If not, verify and submit the sitemap |
| Apex redirect | 307 (temporary). Change it to 308 in Vercel domain settings |
| llms.txt / RSL | Missing (see section 3) |
| JSON-LD validity | 3 blocks on `/ai-training`, all valid. Organization on every page; BlogPosting on posts |

---

## 10. Top changes, ranked by impact

| Rank | Change | Impact | Effort | File / location |
|---|---|---|---|---|
| **1** | **Disambiguate the entity:** Organization `@id`, `description`, `disambiguatingDescription`, `areaServed`, `knowsAbout`, `founder`; fix the LinkedIn `sameAs`; link Course `provider` and blog `publisher` by `@id`; rename the LinkedIn page; create a Wikidata item | High (all platforms) | 3 hours in code + 2 hours off-site | `src/app/layout.js` lines 71-88; `src/lib/constants.js` line 41; `src/app/ai-training/page.js` line 120; `src/app/blog/[slug]/page.js` line 122 |
| **2** | **Rewrite the top of `/ai-training` for extraction:** a 130-170 word definitional block, an H1 that contains the entity, question-style H2s, and FAQ questions as `<h3>` | High (ChatGPT, AIO) | 3-4 hours | `src/app/ai-training/page.js` lines 195-260; `src/components/Faq.js` lines 25-31 |
| **3** | **Name the trainer and prove outcomes:** instructor bio, photo, certifications and LinkedIn, `instructor` in the Course schema, 3-4 dated outcome figures, named testimonials, real team photos | High (AIO, Perplexity) | 4-6 hours, plus photo collection | `src/app/ai-training/page.js` lines 114-160 and about line 432; `src/components/Testimonials.js`; `src/app/about/page.js` lines 20-23 |
| **4** | **Build off-site mentions where Perplexity looks:** a YouTube channel with a 60-90 second session video (also embedded on the page with `VideoObject`); get listed on Kenyan "AI courses in Nairobi" listicles and directories (start with nairobionline.com); ask TechCamp and Stratostaff for a linked mention; answer genuine r/Kenya and r/nairobi questions | High (Perplexity, ChatGPT) | Ongoing; 1-2 days to start | Off-site; embed in `src/app/ai-training/page.js` |
| **5** | **Add a team-training section** (and later `/ai-training/teams`) plus a "different from an ML course" comparison passage and a comparison table | Medium-High (enquiry value) | 3-4 hours | `src/app/ai-training/page.js` |
| 6 | Add `public/llms.txt` with the disambiguation line | Medium (low cost) | 1 hour | `public/llms.txt` |
| 7 | Add og:image to the training, register and resources pages | Medium | 30 minutes | `src/app/ai-training/page.js` line 25; `src/app/ai-training/register/page.js` line 21; `src/app/resources/page.js` line 14 |
| 8 | Complete the blog author profile and enrich the author JSON-LD | Medium | 1 hour + Sanity edit | `src/app/blog/[slug]/page.js` lines 116-118 |
| 9 | IndexNow + Bing Webmaster verification; real `lastmod` values | Medium (Copilot, ChatGPT) | 2 hours | `public/<key>.txt`; `src/app/api/revalidate/route.js`; `src/app/sitemap.js` lines 39-64 |
| 10 | Apex redirect 307 to 308; fix apex links in Sanity post bodies | Low | 20 minutes | Vercel dashboard; Sanity content |

---

## 11. Reading of the GA4 context

- **ChatGPT is already a top-3 source** (10 of 97 sessions, 10.3%, 4m59s average). That engagement is far above typical referral traffic, so these visitors arrive with intent. Items 1-3 above protect and grow this channel: ChatGPT Search draws on Bing plus OAI-SearchBot, both of which already reach the page. The remaining lever is how quotable and how unambiguous the page is.
- **Perplexity sends nothing** because Perplexity prefers third-party sources (listicles, Reddit, YouTube) for "best X in city" queries, and Cloudwise has none of them. On-page fixes alone will not change this; item 4 will.
- **Measurement:** create a GA4 channel group "AI assistants" matching `chatgpt.com|perplexity.ai|copilot.microsoft.com|gemini.google.com|claude.ai`. Then check monthly whether items 1-4 move it.

---

## 12. Structured findings (for `audit-data.json`, category "AI Search Readiness")

```json
{
  "category": "AI Search Readiness",
  "score": 51,
  "dimensions": {"citability": 55, "structural_readability": 62, "multimodal": 25, "authority_brand": 30, "technical_accessibility": 75},
  "platform_scores": {"chatgpt": 56, "google_aio": 50, "bing_copilot": 47, "perplexity": 33},
  "findings": [
    {"id": "geo-entity-collision", "severity": "high", "title": "Brand name shared with cloudwise.africa (Kenya) and Cloudwise Academy (training); Organization schema has no @id, description or disambiguation", "file": "src/app/layout.js", "lines": "71-88"},
    {"id": "geo-linkedin-sameas", "severity": "high", "title": "sameAs LinkedIn URL redirects to a login wall; LinkedIn page is named Cloudwise Technologies", "file": "src/lib/constants.js", "lines": "41"},
    {"id": "geo-no-definitional-passage", "severity": "high", "title": "/ai-training has no self-contained definitional lead; H1 and H2s are slogans", "file": "src/app/ai-training/page.js", "lines": "195-260"},
    {"id": "geo-no-named-trainer", "severity": "high", "title": "No named instructor, credentials or outcome figures; team photos are placeholders", "file": "src/app/ai-training/page.js; src/app/about/page.js", "lines": "114-160, ~432; 20-23"},
    {"id": "geo-offsite-mentions", "severity": "high", "title": "No YouTube, Reddit, Wikidata or Kenyan listicle presence; explains zero Perplexity traffic", "file": null},
    {"id": "geo-faq-buttons", "severity": "medium", "title": "FAQ questions rendered in <button>, dropped by text extractors", "file": "src/components/Faq.js", "lines": "25-31"},
    {"id": "geo-llms-txt", "severity": "medium", "title": "llms.txt missing (404)", "file": "public/llms.txt"},
    {"id": "geo-og-image", "severity": "medium", "title": "No og:image on /ai-training, /ai-training/register, /resources (page openGraph overrides root)", "file": "src/app/ai-training/page.js", "lines": "25"},
    {"id": "geo-blog-author", "severity": "medium", "title": "Blog author is first name only with no bio, role or links", "file": "src/app/blog/[slug]/page.js", "lines": "116-118"},
    {"id": "geo-indexnow", "severity": "medium", "title": "No IndexNow; no Bing verification in code", "file": "src/app/api/revalidate/route.js"},
    {"id": "geo-sitemap-lastmod", "severity": "low", "title": "Static sitemap entries use request time as lastmod", "file": "src/app/sitemap.js", "lines": "39-64"},
    {"id": "geo-multimodal", "severity": "medium", "title": "No video, tables or real session photos on /ai-training", "file": "src/app/ai-training/page.js"},
    {"id": "geo-apex-307", "severity": "low", "title": "Apex to www redirect is 307, not 308", "file": null},
    {"id": "geo-rsl", "severity": "info", "title": "No RSL licence; optional", "file": "src/app/robots.js"}
  ],
  "crawler_access": {"OAI-SearchBot": "allowed", "ChatGPT-User": "allowed", "GPTBot": "allowed", "Claude-SearchBot": "allowed", "ClaudeBot": "allowed", "PerplexityBot": "allowed", "Perplexity-User": "allowed", "Googlebot": "allowed", "Google-Extended": "allowed", "Bingbot": "allowed", "Applebot-Extended": "allowed", "CCBot": "allowed", "cohere-ai": "allowed"},
  "llms_txt": "missing",
  "rsl": "missing"
}
```

---

## 13. Limits of this audit

- No DataForSEO tools were available, so there are no live ChatGPT or Perplexity answer captures. Platform scores are inferred from access, content and off-site signals.
- Reddit search returned a block page. "No Reddit presence" means none surfaced in web search, not a full Reddit scan.
- Bing Webmaster verification may exist through DNS. It could not be seen from the repo.
- Search results came from DuckDuckGo, which mostly mirrors Bing. Google rankings were not measured.
