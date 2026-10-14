# Content Quality and E-E-A-T Audit: www.cloudwise.co.ke

**Audit date:** 14 October 2026
**Scope:** live site, with extra depth on `/ai-training`, `/`, `/about`, `/services` and `/blog`. Also checked: `/blog/category/ai-training`, six AI blog posts, `/resources`, `/resources/prompt-pack`, `/services/ai`, `/portfolio`, and `sitemap.xml` (57 URLs, 24 posts).
**Method:** pages fetched with `render_page.py` (raw HTML, no SPA shell detected). E-E-A-T scored on `extracted_text`. Copy traced to the repo at `D:\projects\cloudwise-website-2025` (branch `chore/microsoft-clarity`, read only). Claims checked against the internal course files in `D:\conveniences\Cloudwise\AI Productivity Training`. No repo file was changed.
**Framework:** Google Search Quality Rater Guidelines, version of 11 September 2025.

---

## 1. Scores

| Measure | Score |
|---|---|
| **Content quality (overall)** | **38 / 100** |
| **E-E-A-T (weighted)** | **35 / 100** |
| **AI citation readiness** | **50 / 100** |
| **Templated metadata risk** | **Low** (templated_ratio 0.0, no shared CTA phrases) |

### E-E-A-T breakdown

The weights below are this audit's internal model. Google publishes no numeric weights; it states only that trust matters most.

| Factor | Weight | Score | Why |
|---|---|---|---|
| **Experience** | 20% | 45 | The prompt pack shows real local experience (Nakuru caterer, Kiswahili tone, WhatsApp). Elsewhere, first-hand evidence is absent. Real delivery (Bamburi, FEKAN Howell, Sika, Thika School of Medical and Health Sciences) is not on the site. |
| **Expertise** | 25% | 30 | No named trainer on `/ai-training`. Blog author is "Gavin", with no surname, role, bio or photo. The facilitator's real credentials (CPA (K), BSc Actuarial Science, JKUAT) appear only in internal proposals. |
| **Authoritativeness** | 25% | 25 | Two unattributed testimonials. Eight client logos with alt text "Client 1" to "Client 8". No press, no citations, no named clients for AI training beyond TechCamp and Stratostaff. |
| **Trustworthiness** | 30% | 40 | Good: address, phone, email, Organization schema, clear price, cohort dates, M-Pesa steps. Bad: tools listed that are not taught, a certification claim the company's own profile denies, portfolio metrics with "Cloudwise Limited" as the client, strike-through price anchors, retired offer still promoted, no refund policy shown. |
| **Weighted total** | | **35** | |

---

## 2. Why `/ai-training` does not rank for "AI training Kenya"

Search Console (as reported by the user) shows `/ai-training` ranking only for exam-code strings (ai36452, ai45029). The only "ai training" impression went to `/blog/category/ai-training`. The page gives Google weak signals for the head term:

1. **The target phrase is barely on the page.** In the visible text, "AI training" appears 2 times, "Kenya" 0 times, "Nairobi" 5 times.
2. **The title uses a different phrase.** Rendered title: "AI Productivity Training in Nairobi — Work Smarter with AI · Cloudwise" (70 characters, truncated in results).
3. **The H1 has no topic and no place.** H1 is "Work Smarter with AI." The topic lives only in the eyebrow paragraph.
4. **A blog category competes for the exact phrase.** `/blog/category/ai-training` has the title "AI Training & Skills — Cloudwise Blog" and the H1 "AI Training & Skills". It does not link to `/ai-training` in its body.
5. **Almost no internal links with useful anchors.** Of six AI posts checked, only one links to `/ai-training` in the article body, and that post promotes a retired offer (see finding H6). Site-wide anchors are "Explore AI training", "See training details" and the nav label.
6. **The page is thin for its commercial weight.** 873 words. Competitors in the internal teardown (Digital4Africa, kaara.works) describe agents, outcomes and deliverables. Cloudwise's page never mentions agents, connectors, certificates or the Kenya Data Protection Act module that the real course teaches.

The exam-code matches are a symptom: Google has not tied the page to the "AI training in Kenya" topic, so it surfaces for low-competition strings instead. This is a hypothesis from the evidence above; I did not query Search Console directly.

---

## 3. Findings ranked by severity

### Critical

**C1. Tools and platform on the training page do not match what is taught.**
- **Evidence:** `/ai-training` lists "Image AI: Midjourney & DALL·E for visuals" and "Automation: Zapier + Make AI workflows". The internal curriculum (`Public Cohort/00_Curriculum-Design-Decisions.md`, settled 29 September 2026) says: "Everything across the eight hours is Claude", "Image generation is not in this course", and Zapier and Make are excluded. The same document says the joining link is "Google Meet, sent the day before. Not Zoom." The site says Zoom in the hero, the FAQ, the registration form, the checkout page and the confirmation email. The home page's "6+ AI tools" counts the tools that are not taught.
- **Files:** `D:\projects\cloudwise-website-2025\src\app\ai-training\page.js` (TOOLS, lines 68-75; Zoom at lines 106 and 232; "Building automations with AI tools", line 63), `src\components\home\TrainingBand.js` (line 65), `src\components\training\RegistrationForm.js` (line 285), `src\lib\registration-form.js` (line 57), `src\app\checkout\[ref]\page.js` (line 108), `src\lib\email\templates.js` (line 85), `src\app\resources\[slug]\page.js` (line 281).
- **Fix:** Replace the TOOLS grid with what the course really uses (Claude, its Projects, connectors and scheduled tasks, plus ChatGPT, Gemini and Meta AI in WhatsApp for comparison), and change every "Zoom" to the platform you actually use.

**C2. "Certified ICT & AI practitioners" contradicts the company's own profile.**
- **Evidence:** The home page and `/ai-training` both say "Certified ICT & AI practitioners". The internal training profile (`Public Cohort/Cloudwise_AI-Training-Profile.md`) says: "We hold no vendor AI certification, and we do not claim one." The OML Africa Logistics thread (30 September 2026) confirms Cloudwise is not NITA accredited either.
- **Files:** `src\app\page.js` (line 17), `src\app\ai-training\page.js` (line 440).
- **Fix:** Replace with a claim you can prove, for example "Led by a CPA (K) who builds and runs a live AI product".

**C3. Portfolio metrics look invented and name Cloudwise as its own client.**
- **Evidence:** All four case studies set `client: cloudwiseClient` ("Cloudwise Limited") and show precise outcomes: "85% reduction in response time", "95% customer satisfaction rate", "50k+ downloads", "4.8/5 app rating", "$2M+ in transactions", "1000+ vendors onboarded". None names a client or a source. The `/portfolio` hub says "Projects that delivered real results" with 45 words of body text.
- **File:** `src\lib\projects.js` (lines 1-71).
- **Fix:** Remove every metric you cannot evidence and replace the four entries with real, named work (RuralLink AI on shortcode 40024 with 10,000+ live queries; the TechCamp e-learning platform; the ESA-K document system; the Mindset Coaching diagnostics platform), with client consent.

**C4. Testimonials are unattributed and one may be a related party.**
- **Evidence:** `Testimonials.js` quotes "TechCamp" and "Stratostaff" with no person, no role, no date, and five hard-coded stars. The internal facilitator profile lists Edwin Kailikia as "Chief Executive Officer, TechCamp". `/about` lists Edwin Kailikia as Cloudwise "Technical Lead". The same profile lists TechCamp as a software client and as the place the founder studied, but TechCamp is absent from the internal AI training record. The quote also claims a specific outcome ("cut report-writing time in half") with no source.
- **Files:** `src\components\Testimonials.js` (lines 6-19), `src\app\about\page.js` (line 22), `src\app\ai-training\page.js` (lines 110 and 440).
- **Fix:** Use only quotes from named people at clients you trained, state any business relationship, and correct Edwin Kailikia's role on `/about` if he is TechCamp's CEO rather than a Cloudwise employee.

### High

**H1. `/ai-training` is not optimised for "AI training" or Kenya.**
- **Evidence:** See section 2. Title 70 characters, description 208 characters (both truncated). H1 "Work Smarter with AI." "Kenya" 0 times.
- **Files:** `src\app\ai-training\page.js` (metadata, lines 20-39; eyebrow, line 200; H1, line 203), `src\app\blog\category\[slug]\page.js` (category title and intro).
- **Fix:** Use the title `{ absolute: 'AI Training in Nairobi, Kenya: Hands-On Course · Cloudwise' }`, an H1 such as "Hands-on AI training in Nairobi. Work smarter with AI.", a description under 155 characters, and give the blog category an intro paragraph that links to `/ai-training` with the anchor "AI training in Nairobi".

Proposed description (148 characters): "Hands-on AI training in Nairobi and online. Two Saturdays, 8 hours, Ksh 13,500. Build your own AI assistant on your real work. Certificate included."

**H2. No named trainer on the page that sells training.**
- **Evidence:** The training page names no person. The internal profile has a strong facilitator section: Paul Theceri Ng'ang'a, CPA (K) (2008), BSc Actuarial Science (JKUAT, 2013), audit and finance career, visiting trainer at Nişantaşı Üniversitesi, builder of RuralLink AI. The Course JSON-LD has no `instructor`.
- **File:** `src\app\ai-training\page.js` ("Why Cloudwise" section, lines 426-455; `buildCourseJsonLd`, lines 114-156).
- **Fix:** Add a "Your trainer" section with photo, credentials and a LinkedIn link, and add an `instructor` Person to the Course schema.

**H3. The real delivery record is missing.**
- **Evidence:** The internal profile lists: Bamburi Cement, executive session for about 70 staff (August 2026); FEKAN Howell LLP, eight-hour "AI for Auditors" programme (July 2026); Sika Kenya, department-by-department Copilot programme (September 2026); Thika School of Medical and Health Sciences, 45-hour course design. The site names only TechCamp and Stratostaff.
- **Files:** `src\app\ai-training\page.js` (FAQ line 110, list line 440), `src\components\Testimonials.js`, `src\components\home\ClientsMarquee.js` (alt text "Client 1" to "Client 8").
- **Fix:** Add a "Teams we have trained" block naming each client that consents (check Bamburi's confidentiality rules first), and give each logo its real organisation name as alt text.

**H4. The page undersells the course and omits trust answers.**
- **Evidence:** The real course centres on building a configured AI assistant, connectors and repeatable workflows, plus a Kenya Data Protection Act 2019 module and a 30-day plan. The page mentions "agent" 0 times, "certificate" 0 times and "refund" 0 times. The curriculum decisions say certificates: yes; recordings: no; refunds: none, transfer offered; missed Saturday: move to next cohort.
- **File:** `src\app\ai-training\page.js` (DAY_ONE and DAY_TWO, lines 51-66; `buildFaqItems`, lines 95-112).
- **Fix:** Rewrite the two day lists from the signed-off syllabus and add FAQ answers for certificate, recordings, refunds and missed sessions.

**H5. Price anchors and value labels cannot be evidenced on the page.**
- **Evidence:** "Was Ksh 30,000", "SAVE 55%", "normally Ksh 30,000", "Worth 20K", "Worth 5K", "Priceless", "introductory pricing closes once the cohort is full". The home page says "Lifetime WhatsApp support community", which the training page does not promise. Internal notes call 30,000 a "list" price; nothing shows it was ever charged. Kenya's Competition Act 2010 (section 55) prohibits false or misleading representations about price. This is not legal advice; check with an adviser.
- **Files:** `src\app\ai-training\page.js` (VALUE_STACK lines 44-49; FAQ line 107; price card lines 222-228; CTA line 470), `src\components\home\TrainingBand.js` (lines 12 and 45).
- **Fix:** Keep the anchor only if you can show the course was sold at Ksh 30,000; otherwise drop "Was", "SAVE 55%" and the "Worth" labels, describe what each item does, and make "Lifetime" match the training page.

**H6. A live post sells the retired Women Biz360 masterclass.**
- **Evidence:** `/blog/why-women-led-businesses-are-turning-to-ai-faster` ends with "Join a Cloudwise AI training session or the Women Biz360 Hub masterclass." The partnership was retired on 23 September 2026. This post holds the only in-body link to `/ai-training` among the six AI posts checked.
- **File:** Sanity document for that post (edit in the embedded Studio at `/studio`; the copy is not in the repo).
- **Fix:** Remove the masterclass sentence and FAQ answer, and keep the link to `/ai-training` with a descriptive anchor.

**H7. Blog content is thin, generic and has no visible author expertise.**
- **Evidence:** 24 posts. All six AI posts checked are by "Gavin" (no surname, role, bio or photo; not on `/about`). Length 327-526 words against a 1,500-word coverage floor. "2-3 min read" each. No sources, no Kenyan data, no named cases. The women-led post states a trend ("adopting AI at a striking rate") with no figure. Newest `lastmod` in the sitemap is 4 September 2026. These are the QRG's low-effort markers: generic phrasing, no original insight, little first-hand evidence.
- **Files:** Sanity author document "gavin" and each post; `src\app\blog\[slug]\page.js` (author JSON-LD, lines 114-118); `src\components\blog\AuthorCard.js` (renders role and bio only when present).
- **Fix:** Give every author a full name, role, bio and LinkedIn link, add `url` and `jobTitle` to the author schema, and expand the AI posts with real examples from your sessions (anonymised), Kenyan figures with sources, and a link to `/ai-training`.

### Medium

**M1. `/about` is thin and shows placeholder assets.**
- **Evidence:** 207 words. Team images are `/placeholder1.jpg` to `/placeholder4.jpg` (7-31 KB). No bios, credentials or links. Paul is "CEO & Founder"; internal documents say "Director and Co-founder". Values copy is generic ("Innovation first", "Excellence"). Flesch Reading Ease 29.8 (hard).
- **File:** `src\app\about\page.js` (TEAM lines 19-24; VALUES lines 12-17).
- **Fix:** Rename and replace the images with real, current photos, add a two-line bio with credentials for each person, and align job titles with your proposals.

**M2. Home page is thin and its stats are weak.**
- **Evidence:** 226 words (floor 500). "33 Happy clients" equals "33+ Projects delivered". "100% Completion rate" has no definition. The internal profile supports "33 or more platforms across three countries", so "33+ projects" and "3 countries" are fine.
- **Files:** `src\app\page.js` (STATS lines 21-26; WHY line 17), `src\lib\constants.js` (stats).
- **Fix:** Drop "Happy clients" and "Completion rate", or define them, and add one short paragraph on the training record with a link to `/ai-training`.

**M3. Services pages are thin and use filler copy.**
- **Evidence:** `/services` has about 250 words including cards (52 in the main extracted text) and does not list AI training. `/services/ai` description: "Leverage AI to revolutionize your business through intelligent products and seamless integrations" (Flesch 9.9). The CTA renders "Let's build with ai agent development." Hub titles differ from detail titles in the data file (for example "Cloud Solutions" and "Cloud Infrastructure").
- **Files:** `src\app\services\page.js` (SERVICES), `src\lib\servicedata.js` (descriptions, lines 13-256), `src\app\services\[slug]\page.js` (line 118).
- **Fix:** Add AI training as a service card, rewrite each description in plain, specific terms, fix the CTA template, and use one title per service.

**M4. Metadata length and duplication.**
- **Evidence:** Templated check: site_risk **low**, templated_ratio **0.0**, no shared CTA phrases, so no bulk-metadata problem. Other issues: `/ai-training` title 70 and description 208 characters; brand repeated in "About Cloudwise — … · Cloudwise" and "Starter Prompt Pack — Cloudwise AI Training · Cloudwise"; `/services/ai` title "AI Agent Development" has no brand or location.
- **Files:** `src\app\ai-training\page.js`, `src\app\about\page.js` (layout or metadata export), `src\lib\resources.js`, `src\lib\servicedata.js`.
- **Fix:** Keep titles under 60 characters and descriptions under 155, and remove the duplicate brand.

**M5. The prompt pack is the likely home for the "how to prompt" queries but is not built for them.**
- **Evidence:** No blog post covers prompting. `/resources/prompt-pack` (1,506 words) has the four-part framework and ten prompts, but H1 "Starter Prompt Pack", no author, no date and no Article or HowTo schema. Confirm the ranking URL in Search Console. Note: "how to prompt someone" may mean prompting a person to reply, which Prompt 03 ("Follow up someone who went quiet") partly serves.
- **Files:** `src\lib\resources.js`, `src\app\resources\[slug]\page.js`.
- **Fix:** Add a short "How to write a good prompt" intro with the four parts as a numbered list, an author and date, and a closing link to `/ai-training`.

### Low

**L1. Course schema gaps.** `provider` uses `sameAs` instead of `url`; no `instructor`; no `VirtualLocation` for the online mode; no `educationalCredentialAwarded`. File: `src\app\ai-training\page.js` (lines 114-156). Fix: add these properties.

**L2. FAQ schema.** Google has shown FAQ rich results only for well-known government and health sites since August 2023. Keep the FAQPage markup for AI answer engines, but expect no rich result. File: `src\app\ai-training\page.js`.

---

## 4. Inconsistent or unverifiable copy

| Copy on site | Where | Status | Evidence |
|---|---|---|---|
| Midjourney & DALL·E | `/ai-training` TOOLS | **Not taught** | Curriculum: "Image generation is not in this course." |
| Zapier + Make | `/ai-training` TOOLS | **Not taught** | Curriculum: taught inside Claude, "not Zapier, Make or n8n". |
| Zoom | Hero, FAQ, form, checkout, email | **Contradicted** | Curriculum: "Google Meet … Not Zoom." |
| "6+ AI tools" | Home TrainingBand | **Overstated** | Counts the four tools above. |
| "Certified ICT & AI practitioners" | Home, `/ai-training` | **Contradicted** | Profile: "We hold no vendor AI certification." |
| "Worth 20K", "Worth 5K", "Priceless" | `/ai-training` | **Unsupported on page** | Internal justification PDF only. |
| "Was Ksh 30,000", "SAVE 55%", "normally Ksh 30,000" | `/ai-training`, home | **Unverified** | No evidence the course sold at 30,000. |
| "Lifetime WhatsApp support community" | Home | **Inconsistent** | Training page does not promise lifetime access. |
| TechCamp testimonial | Home, `/ai-training` | **Unattributed, possible related party** | TechCamp CEO is listed as Cloudwise Technical Lead on `/about`. |
| Stratostaff testimonial | Home, `/ai-training` | **Unattributed** | Profile mentions "a staffing group" only. |
| Five-star rows | Testimonials | **No source** | Hard-coded in the component. |
| "33 Happy clients", "100% Completion rate" | Home, `/about` | **Undefined** | No basis given. |
| "85% reduction…", "$2M+ in transactions", "50k+ downloads", "4.8/5" | `/portfolio/*` | **Looks invented** | Client field is "Cloudwise Limited". |
| Women Biz360 Hub masterclass | Blog post | **Retired offer** | Retired 23 September 2026. |
| "CEO & Founder" (Paul) | `/about` | **Inconsistent** | Proposals say "Director and Co-founder". |

---

## 5. Page metrics

| Page | Type | Words | Floor | Flesch | Grade | Verdict |
|---|---|---|---|---|---|---|
| `/` | Homepage | 226 | 500 | 43.6 | 10.5 | **Thin** |
| `/ai-training` | Service/landing | 873 | 800 | 51.2 | 10.5 | Passes floor; too thin for its role |
| `/about` | Company | 207 | 500 | 29.8 | 12.5 | **Thin, hard to read** |
| `/services` | Hub | 52 (about 250 with cards) | 800 | 50.5 | 9.4 | **Thin** |
| `/services/ai` | Service | 120 | 800 | 9.9 | 14.9 | **Thin, very hard** |
| `/blog` | Listing | 327 | n/a | 60.6 | 8.7 | OK as a listing |
| `/blog/category/ai-training` | Listing | 223 | n/a | 65.9 | 8.0 | No intro text |
| AI posts (6 checked) | Blog | 327-526 | 1,500 | 44-64 | 7.4-10.3 | **All thin** |
| `/resources/prompt-pack` | Resource | 1,506 | 1,500 | 54.8 | 11.0 | Good depth |
| `/portfolio` | Hub | 45 | n/a | 45.4 | 9.2 | **Thin** |

Word counts come from trafilatura's `extracted_text`, which drops some card text. Word count is not a ranking factor; the floors mark topical coverage.

---

## 6. AI citation readiness: 50 / 100

**Strengths:** `/ai-training` states quotable facts: Ksh 13,500, 8 hours, 9am-1pm, first and second Saturdays, the address, and real cohort dates (7 and 14 November 2026; 5 and 12 December 2026; 2 and 9 January 2027). Course and FAQPage JSON-LD are valid. Blog posts have question-style FAQ sections. The prompt pack has a clear, numbered structure.

**Weaknesses:** No named expert to cite. Claims an AI engine might quote (tools, Zoom, certification, "Worth" values) are wrong or unsupported, which is worse than silence. No original data. Blog answers are generic and could come from any site. No definition-style sentence such as "Cloudwise AI training is an eight-hour, two-Saturday course in Nairobi where participants build…".

**Fix:** Add one 40-60 word summary paragraph near the top of `/ai-training` that states what, who, where, how long, how much and what the participant leaves with, in plain sentences.

---

## 7. Freshness

- `/ai-training` cohort dates are generated per request, so they stay current. Good.
- Sitemap `lastmod` is 9 October 2026 for every static page, which says nothing about real edits.
- Newest blog `lastmod` is 4 September 2026; posts were published in two batches (2 July and 20-21 August 2026). No posts in about six weeks.
- The internal curriculum changed on 29 September 2026, but the page still shows the older tool list. The page is out of date with the product.

---

## 8. Recommended order of work

1. Fix C1, C2, C4 and H5 together in `src\app\ai-training\page.js`, `src\app\page.js`, `src\components\Testimonials.js`, `src\components\home\TrainingBand.js` and the Zoom references. These are trust defects and the fastest wins.
2. Clean or remove the portfolio metrics in `src\lib\projects.js` (C3).
3. Rebuild `/ai-training` (H1-H4): new title, H1 and description; trainer section; delivery record; real syllabus; certificate and refund FAQ. Target 1,500-2,000 words.
4. Edit the women-led post in Sanity (H6) and add in-body links from every AI post to `/ai-training`.
5. Add an intro paragraph and a `/ai-training` link to `/blog/category/ai-training`.
6. Fix `/about` (M1), then the home page stats (M2), then services (M3).
7. Expand the blog posts and author profile (H7) over the following weeks.

---

## 9. Structured findings for `audit-data.json` (Content Quality)

```json
{
  "category": "Content Quality",
  "score": 38,
  "eeat": { "experience": 45, "expertise": 30, "authoritativeness": 25, "trustworthiness": 40, "weighted": 35 },
  "ai_citation_readiness": 50,
  "metadata_template": { "site_risk": "low", "templated_ratio": 0.0, "shared_cta_phrases": {}, "pages_checked": 16 },
  "findings": [
    { "id": "C1", "severity": "critical", "title": "Training page lists tools and a platform the course does not use", "url": "/ai-training", "files": ["src/app/ai-training/page.js", "src/components/home/TrainingBand.js", "src/components/training/RegistrationForm.js", "src/lib/registration-form.js", "src/app/checkout/[ref]/page.js", "src/lib/email/templates.js", "src/app/resources/[slug]/page.js"], "fix": "Replace the TOOLS grid with what is taught and change every Zoom reference to the real platform." },
    { "id": "C2", "severity": "critical", "title": "Certification claim contradicted by company profile", "url": "/, /ai-training", "files": ["src/app/page.js", "src/app/ai-training/page.js"], "fix": "Replace 'Certified ICT & AI practitioners' with a provable credential." },
    { "id": "C3", "severity": "critical", "title": "Portfolio metrics unattributed, client set to Cloudwise itself", "url": "/portfolio", "files": ["src/lib/projects.js"], "fix": "Remove unevidenced metrics and show real named projects." },
    { "id": "C4", "severity": "critical", "title": "Unattributed testimonials, possible related party", "url": "/, /ai-training, /about", "files": ["src/components/Testimonials.js", "src/app/about/page.js", "src/app/ai-training/page.js"], "fix": "Use named, consented quotes, disclose relationships and correct team roles." },
    { "id": "H1", "severity": "high", "title": "/ai-training not targeting 'AI training' or Kenya; blog category cannibalises", "url": "/ai-training", "files": ["src/app/ai-training/page.js", "src/app/blog/category/[slug]/page.js"], "fix": "Rewrite title, H1 and description around 'AI training in Nairobi, Kenya' and link the category to the page." },
    { "id": "H2", "severity": "high", "title": "No named trainer", "url": "/ai-training", "files": ["src/app/ai-training/page.js"], "fix": "Add a trainer section and an instructor in Course schema." },
    { "id": "H3", "severity": "high", "title": "Real delivery record missing", "url": "/ai-training", "files": ["src/app/ai-training/page.js", "src/components/Testimonials.js", "src/components/home/ClientsMarquee.js"], "fix": "Name consenting clients and give logos real alt text." },
    { "id": "H4", "severity": "high", "title": "Syllabus outdated; certificate and refund answers missing", "url": "/ai-training", "files": ["src/app/ai-training/page.js"], "fix": "Rewrite day lists from the signed-off syllabus and add the four policy FAQs." },
    { "id": "H5", "severity": "high", "title": "Unverified price anchors and value labels", "url": "/ai-training, /", "files": ["src/app/ai-training/page.js", "src/components/home/TrainingBand.js"], "fix": "Drop anchors and 'Worth' labels unless evidenced." },
    { "id": "H6", "severity": "high", "title": "Live post promotes retired Women Biz360 masterclass", "url": "/blog/why-women-led-businesses-are-turning-to-ai-faster", "files": ["Sanity post document"], "fix": "Remove the masterclass copy and keep a descriptive /ai-training link." },
    { "id": "H7", "severity": "high", "title": "Thin generic blog with first-name-only author", "url": "/blog/*", "files": ["Sanity author 'gavin'", "src/app/blog/[slug]/page.js"], "fix": "Full author profiles and expanded posts with first-hand examples." },
    { "id": "M1", "severity": "medium", "title": "About page thin, placeholder images, role mismatch", "url": "/about", "files": ["src/app/about/page.js"], "fix": "Real photos, bios and consistent titles." },
    { "id": "M2", "severity": "medium", "title": "Home page thin, undefined stats", "url": "/", "files": ["src/app/page.js", "src/lib/constants.js"], "fix": "Remove or define stats and add a training paragraph." },
    { "id": "M3", "severity": "medium", "title": "Services thin, filler copy, broken CTA", "url": "/services, /services/*", "files": ["src/app/services/page.js", "src/lib/servicedata.js", "src/app/services/[slug]/page.js"], "fix": "Add AI training card, rewrite descriptions, fix CTA template." },
    { "id": "M4", "severity": "medium", "title": "Title/description length and duplicate brand", "url": "multiple", "files": ["src/app/ai-training/page.js", "src/lib/resources.js", "src/lib/servicedata.js"], "fix": "Titles under 60, descriptions under 155, one brand mention." },
    { "id": "M5", "severity": "medium", "title": "Prompt pack not built for prompt queries", "url": "/resources/prompt-pack", "files": ["src/lib/resources.js", "src/app/resources/[slug]/page.js"], "fix": "Add how-to intro, author, date and /ai-training link." },
    { "id": "L1", "severity": "low", "title": "Course schema gaps", "url": "/ai-training", "files": ["src/app/ai-training/page.js"], "fix": "Add url, instructor, VirtualLocation, educationalCredentialAwarded." },
    { "id": "L2", "severity": "low", "title": "FAQ rich results unavailable for this site type", "url": "/ai-training", "files": ["src/app/ai-training/page.js"], "fix": "Keep markup for AI engines; expect no rich result." }
  ]
}
```

---

## 10. Limitations

- Search Console figures are as reported by the user; I did not query Search Console.
- The checks on tools, Zoom, certification and the delivery record rely on internal documents dated up to 30 September 2026. Confirm they are current before editing.
- Client names from internal proposals must not go on the site without each client's consent.
- I could not read the PDFs (`Cloudwise_Training_Value_Justification.pdf` and the monthly brochures) because no PDF tool is installed, so I could not test the "Worth" figures against them.
- Six of 24 posts were read in full; the blog findings assume the other 18 follow the same pattern, which the listing excerpts and "2-3 min read" labels support.
