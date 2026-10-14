# SXO analysis: cloudwise.co.ke/ai-training

**Date:** 14 October 2026
**Target URL:** https://www.cloudwise.co.ke/ai-training
**Queries:** AI training Kenya · AI training Nairobi · AI course Nairobi · AI training for businesses Kenya · ChatGPT training Nairobi · corporate AI training Kenya
**Repo:** `D:\projects\cloudwise-website-2025` (branch `chore/microsoft-clarity`; `src/app/ai-training` matches the live page)
**SXO Gap Score: 52 / 100.** This score is separate from any SEO Health Score.

---

## 1. Key finding: one consumer sales page is trying to rank for two different intents

The page is a **single-offer course sales page**. It sells one product, at one price (Ksh 13,500), to one buyer (an individual who registers and pays by M-Pesa or card).

The six queries split into two intents:

| Intent | Queries | What Google ranks | Fit with the page |
|---|---|---|---|
| **Learner intent** (I want a class) | AI course Nairobi, AI training Nairobi, ChatGPT training Nairobi | Course pages with a price, dates, a curriculum and a certificate | **Close.** The page has the right type but lacks depth, a certificate and a ChatGPT focus. |
| **Buyer intent** (I want to train my staff or my business) | AI training for businesses Kenya, corporate AI training Kenya, and most of AI training Kenya | Training-provider **service pages**: audience segments, packages or tiers, team pricing, a proposal or call CTA | **Poor.** The team offer is one FAQ answer ("Message us to arrange a session"). There is no team page, no team price and no proposal route. |

**Mismatch severity**

| Query | SERP dominant type | Confidence | Target type | Severity |
|---|---|---|---|---|
| AI course Nairobi | Product (course page) + Hybrid | 78% (7 of 9) | Product (course sales page) | **ALIGNED** (depth gaps only) |
| AI training Nairobi | Product (course page), with government and news results | 44% (4 of 9) | Product | **MEDIUM** (mixed SERP; the page never says "Kenya" and has no awareness content) |
| ChatGPT training Nairobi | Mixed: news (Sama labour story) and ChatGPT course pages | 44% news / 44% course | Product | **MEDIUM** (the page is not framed as ChatGPT training) |
| AI training Kenya | Service Page (training provider) | 56% (5 of 9) | Product | **HIGH** (zero mentions of "Kenya"; single offer against multi-audience provider pages) |
| AI training for businesses Kenya | Service Page | 75% (6 of 8 competitors) | Product | **HIGH** (the business offer has no page) |
| corporate AI training Kenya | Service Page | 78% (7 of 9) | Product | **HIGH** (the corporate offer has no page, price or proposal CTA) |

The taxonomy rates "Product Page for a consultative service" as MEDIUM. I raised it to HIGH for the three buyer-intent queries because the corporate offer has no landing point at all. An HR or L&D buyer who lands here finds a per-person checkout and one FAQ line.

**Recommendation:** split the intents across URLs.

1. Keep `/ai-training` as the **learner hub**: the public cohort, plus a visible tier ladder.
2. Add `/ai-training/teams` (or `/ai-training/corporate`) as a **service page** for HR and L&D managers and business owners who train staff.

### 1a. The pricing on the page does not match the brief

The brief describes **tiered classes**: an intro class at about **KES 500**, a mid tier at about **KES 4,500 to 5,500**, and higher tiers for teams.

Neither the live page nor the repo shows any tier.

1. The live page and `src/app/ai-training/page.js` sell one product at **Ksh 13,500** ("Was Ksh 30,000", "SAVE 55%").
2. `src/lib/training.js` defines one bookable track, `individual`, at `priceKes: 13500`. The other track, `wbh-masterclass` (Ksh 7,500), is retired.

If the tiers are the real offer, the page now hides the cheapest entry point on the whole SERP. No competitor found offers a KES 500 class. The nearest are Swafie Tech ("from KES 4,999") and Digital4Africa (KES 10,000, in the **same building**: 4th floor, Delta Corner Annex). Free programmes also rank (Moringa with Google.org, Intel with KNLS libraries, AWS AI Ready, Nairobi County). A KES 500 tier answers both the price-sensitive SME owner and the free-training seeker.

**Decide which offer is current before you act on the findings below.** If the tiers are real, finding 2 (tier ladder) becomes the top fix.

### 1b. Why Search Console shows only Microsoft exam codes

The page sends weak relevance signals for its own target queries.

| Signal | Value on the page | What the competitors do |
|---|---|---|
| H1 | "Work Smarter with AI." (a slogan; no "training", "course", "Nairobi" or "Kenya") | "Artificial Intelligence (AI) Training in Kenya" (NobleProg); "AI Course in Nairobi" (DIT); "ChatGPT Course in Nairobi" (Knowledge Academy) |
| Title (rendered) | "AI Productivity Training in Nairobi — Work Smarter with AI · Cloudwise" (about 70 characters, so it will be cut) | "AI Training for Businesses Kenya \| KenZobe"; "Corporate AI Training in Kenya \| ..." |
| "Kenya" in body text | **0** | Present in title, H1 and body |
| "course" in body text | **0** | Present |
| "corporate", "SME", "certificate" | **0** each | Present |
| Word count | about **1,007** | 2,000 to 9,000 |

The URL slug `/ai-training` is a literal match for exam queries such as "AI-900 training" or "AI-102 training". Those queries have little local competition. My hypothesis is that Google finds the page relevant only where the literal token match is enough on its own. I could not confirm this without Search Console access.

---

## 2. Target page profile (rendered DOM)

Fetched with `render_page.py --mode always` (Playwright, status 200, not an SPA shell). Parsed with `parse_html.py`.

| Element | Value |
|---|---|
| Page type (taxonomy) | **Product Page** (price and a "Register & pay online" button; priority rule 4). It also has Landing Page traits: value stack, strike-through price, CTA repeat. |
| Title | AI Productivity Training in Nairobi — Work Smarter with AI · Cloudwise |
| Meta description | Hands-on AI productivity training by Cloudwise. Two Saturday sessions every month ... Ksh 13,500 ... |
| H1 | Work Smarter with AI. (each word is wrapped in its own span and joined by a non-breaking space; `src/components/anim/AnimatedHeading.js`) |
| H2s | Everything included in your Ksh 13,500 · Your 2-day training schedule · The AI tools we'll master together · This training is for you if... · Resources you'll keep · Trained by ICT practitioners, not academics · Organisations we've trained · AI training, answered · Ready to work smarter with AI? |
| Word count | 1,007 |
| Schema | Organization (layout), Course + CourseInstance x3 + Offer + Schedule + Place, FAQPage (7 questions) |
| CTAs | "Register & pay online" (hero), "See the curriculum", "Register & pay · Ksh 13,500" (footer), "Ask a question on WhatsApp" |
| Media | 4 images: the logo twice, the Meta Pixel and a WhatsApp avatar. **No photo of a session, a trainer or the venue. No video.** |
| Open Graph | og:title, og:description and og:url only. **No og:image, og:type or og:site_name.** The Twitter card is `summary_large_image` but has **no image**. |
| Freshness | Cohort dates are computed per request (next: Sat 07 Nov and Sat 14 Nov 2026). There is no visible "updated" date. |

**Why the share image is missing.** Next.js merges metadata shallowly. The `openGraph` and `twitter` objects in `src/app/ai-training/page.js` (lines 25 to 38) replace the root objects in `src/app/layout.js`, so the `images` arrays from the layout are dropped. A WhatsApp or LinkedIn share of the training page shows no picture. In this market most referrals arrive through WhatsApp shares.

---

## 3. SERP analysis

Searches ran on 14 October 2026 through the WebSearch tool, which returns results from a US index (see Limitations). The order shown is the order the tool returned.

### 3.1 Results by query

**AI training Kenya**

| # | Result | Type | Notes |
|---|---|---|---|
| 1 | theknowledgeacademy.com/ke (AI and ML courses) | Product (course catalogue) | International city-template pages, dates, "Book now" |
| 2 | iabac.org (AI courses Kenya) | Hybrid | Certification body |
| 3 | theknowledgeacademy.com/ke (AI4IT, Nairobi) | Product | |
| 4 | inceptor.co.ke/k-course/ai-training | Hybrid | KES 45,000, 3 months, certificate, about 4,500 words, FAQ |
| 5 | nobleprog.co.ke (AI training) | Service (catalogue) | 40+ courses, 16 named testimonials, online or onsite |
| 6 | swafietech.co.ke/training | Service | 3 audiences; "from KES 4,999"; "Register & pay online" + "Request a proposal" |
| 7 | hessonsconsulting.co.ke (AI productivity training Kenya) | Service | Corporate; NITA logo shown; consultation CTA |
| 8 | odsaitech.com | Service (home page) | Corporates, SMEs, schools, NGOs; "Request a Quote" |
| 9 | kenzobe.com/ai-training | Service | 3 packages: KES 30,000 / 80,000 / 200,000; 10-question FAQ; "4.9/5" |

**AI training Nairobi**

| # | Result | Type |
|---|---|---|
| 1 | unesco.org (Huawei AI training, Nairobi) | News / informational |
| 2 | ict.go.ke ("AI, AI, AI!", KSG public-servant skilling) | Government / informational |
| 3 | sama.com/ai101 (data annotator training) | Other |
| 4 | unichrone.com/ke (AI Expert, Nairobi) | Product |
| 5 | sprintzeal.com (AI and ML Masters, Nairobi) | Product |
| 6 | copextraining.com (AI courses, Nairobi) | Product (catalogue) |
| 7 | theknowledgeacademy.com/ke (AI4IT, Nairobi) | Product |
| 8 | inceptor.co.ke | Hybrid |
| 9 | nobleprog.co.ke | Service |

**AI course Nairobi**

| # | Result | Type |
|---|---|---|
| 1 | unes.co.ke (University of Nairobi short courses, KES 50,000) | Product (course) |
| 2 | dit.ac.ke (AI Course in Nairobi, April 2026) | Blog post promoting a course |
| 3 | theknowledgeacademy.com/ke (Generative AI, Nairobi) | Product |
| 4 | theknowledgeacademy.com/ke (AI Automation for PM, Nairobi) | Product |
| 5 | sprintzeal.com | Product |
| 6 | theknowledgeacademy.com/ke (AI4IT) | Product |
| 7 | Wikipedia (Nairobi Technical Training College) | Informational |
| 8 | inceptor.co.ke | Hybrid |
| 9 | digital4africa.com/ai-training-course | Hybrid: KES 10,000, 2 days, certificate, 4 named trainers with photos, 27 FAQs, about 8,500 words |

**AI training for businesses Kenya**

| # | Result | Type |
|---|---|---|
| 1 | kenya.ai (Augmented Thinking, executive training) | Service |
| 2 | swafietech.co.ke/training | Service |
| 3 | digital4africa.com | Hybrid |
| 4 | nobleprog.co.ke (AI training) | Service |
| 5 | nobleprog.co.ke (AI Agents training) | Service |
| 6 | **cloudwise.co.ke/ai-training** | **Product (target)** |
| 7 | odsaitech.com | Service |
| 8 | aiconsultant.co.ke/services/ai-training | Service: "From KES 120,000 per training day", Data Protection Act 2019, AI policy, "Book a free 30-minute call" |
| 9 | kenzobe.com/ai-training | Service |

**ChatGPT training Nairobi**

| # | Result | Type |
|---|---|---|
| 1 | kantrowitz.medium.com (ChatGPT trainer traumatised) | News |
| 2 | slate.com (contractor who trained the AI in Kenya) | News |
| 3 | theknowledgeacademy.com/ke (ChatGPT Course in Nairobi) | Product: 1 day, certificate, Trustpilot, 20+ FAQs |
| 4 | theregister.com (Kenyans used to teach ChatGPT) | News |
| 5 | theknowledgeacademy.com/ke (ChatGPT Prompt Engineering, Nairobi) | Product |
| 6 | time.com ($2 per hour workers) | News |
| 7 | Wikipedia (Nairobi Technical Training College) | Informational |
| 8 | nobleprog.co.ke/cc/chatgptai | Product |
| 9 | nobleprog.co.ke/chatgpt-training | Service (catalogue) |

**corporate AI training Kenya**

| # | Result | Type |
|---|---|---|
| 1 | edstellar.com (Top 10 corporate training companies in Kenya, 2026) | Comparison (listicle) |
| 2 | theknowledgeacademy.com/ke (AI4IT) | Product |
| 3 | nobleprog.co.ke (AI training) | Service |
| 4 | aiconsultancykenya.co.ke/corporations | Service |
| 5 | nobleprog.co.ke (AI Agents) | Service |
| 6 | aiconsultant.co.ke/services/ai-training | Service |
| 7 | nobleprog.co.ke (Generative AI) | Service |
| 8 | odsaitech.com | Service |
| 9 | hessonsconsulting.co.ke | Service |

### 3.2 Supporting searches (journey signals)

| Search | What it showed | Signal |
|---|---|---|
| free AI training Kenya 2026 | Moringa (3,600 youth, Google.org), Intel and KNLS libraries, AWS AI Ready | Strong free alternatives: price sensitivity |
| AI course in Kenya with certificate fees | Learners Ink ($1,499, certificate of completion), Simpliaxis (money-back guarantee), Open University of Kenya HCIA-AI (KES 5,000) | Certificate is a buying criterion |
| how much does AI training cost in Kenya | No provider answers it directly in the results | Content gap Cloudwise can fill with a price table |
| AI-900 training Nairobi | Coursera, Capgemini, no Nairobi provider | Low-competition exam queries: consistent with the Search Console pattern |

### 3.3 SERP features

The WebSearch tool does not return People Also Ask, ads, local pack, related searches or AI Overview. I used competitor FAQ headings as a proxy for PAA. These questions recur across aiconsultant.co.ke, kenzobe.com, digital4africa.com, dit.ac.ke and theknowledgeacademy.com:

1. How much does AI training cost in Kenya?
2. Do I get a certificate?
3. Do I need a technical background?
4. Can you train my team on-site? Is there a group discount?
5. Our staff already use ChatGPT. Is that a problem? (data protection)
6. What happens after the training?
7. Which tools are covered?

The Cloudwise FAQ answers 3, 4 (partly), 6 (partly) and 7 (through the tools section). It does not answer 1 as a comparison, 2 or 5.

### 3.4 Consensus

1. **Learner queries** reward course pages that show price, dates, curriculum, certificate and named trainers. Depth runs from 2,000 to 9,000 words, and FAQs run from 10 to 27 questions.
2. **Buyer queries** reward service pages that show audience segments, packages with prices or "from" prices, a proposal or call CTA, and data-protection or AI-policy content.
3. **International template sites** (The Knowledge Academy, Sprintzeal, Unichrone, NobleProg) hold many slots with city-named pages. They are weak on local proof and local price. That is the opening for a Nairobi provider with real clients and M-Pesa checkout.

---

## 4. User stories

1. **HR or L&D manager (decision stage).** As an HR or L&D manager at a Kenyan company, I want a team AI training proposal with a day rate, an agenda and data-protection content, because I must justify the spend to finance and protect company data, but I am blocked by a **trust gap and no team route**: the page offers a per-person checkout and one FAQ line.
   *Source: "corporate AI training Kenya" (7 of 9 service pages); aiconsultant.co.ke "From KES 120,000 per training day" and FAQ "Are staff using ChatGPT already a problem?"; hessonsconsulting.co.ke NITA logo; edstellar.com top-10 listicle.*

2. **SME owner (consideration stage).** As an SME owner in Nairobi, I want an affordable, practical class that uses my real tasks, because my time and cash are tight, but I am blocked by **price sensitivity**: I can see "from KES 4,999", KES 10,000 in the same building, and free government and NGO programmes.
   *Source: swafietech.co.ke "from KES 4,999"; digital4africa.com KES 10,000; "free AI training Kenya" results (Moringa, Intel and KNLS, AWS); odsaitech.com "Corporates, SMEs, schools and NGOs".*

3. **Individual professional (consideration to decision).** As an employed professional, I want a recognised AI course with a certificate that fits around work, because I want proof for my CV, but I am blocked by an **information gap**: the page does not mention a certificate or name a trainer.
   *Source: certificates on digital4africa.com, theknowledgeacademy.com, inceptor.co.ke and dit.ac.ke; the supporting search "AI course in Kenya with certificate fees"; digital4africa.com trainer photos.*

4. **ChatGPT-focused learner (awareness to consideration).** As someone who uses ChatGPT a little, I want a class that teaches me to use it well at work, because I hear it saves hours, but I am blocked by **relevance**: the page lists ChatGPT as one of six tools and never calls itself ChatGPT training.
   *Source: "ChatGPT training Nairobi" exact-match H1s ("ChatGPT Course in Nairobi"; "ChatGPT Training in Kenya").*

5. **Curious beginner (awareness stage).** As a beginner who searched "AI training Nairobi", I want to know what AI training is and whether a paid class beats a free one, because I do not want to waste money, but I am blocked by **comparison fatigue** between free public programmes and paid courses.
   *Source: ict.go.ke, UNESCO and Nairobi County free training in the "AI training Nairobi" results; "free AI training Kenya 2026" results.*

---

## 5. Gap analysis (SXO Gap Score)

| Dimension | Score | Evidence |
|---|---|---|
| **Page Type** | 8 / 15 | Aligned for "AI course Nairobi". Mismatched for the three buyer queries, which rank service pages 75 to 78% of the time. |
| **Content Depth** | 6 / 15 | 1,007 words against 2,000 to 9,000. 7 FAQs against 10 to 27. Zero mentions of "Kenya", "course", "corporate", "SME" or "certificate". The curriculum is 12 one-line bullets with no outcomes. |
| **UX Signals** | 11 / 15 | Strong: price, dates, format and CTA above the fold; WhatsApp fallback; M-Pesa. Weak: no route for teams; only the first FAQ opens by default; the registration form is long (see `docs/COMPETITOR_TEARDOWN_AI_TRAINING.md`, idea 7). |
| **Schema** | 10 / 15 | Course, CourseInstance, Offer, Schedule, Place and FAQPage are valid. Gaps: one Offer only (no tiers); no `instructor` (Person); online mode has no `VirtualLocation`; no BreadcrumbList; Organization is not typed as EducationalOrganization or LocalBusiness. Note: Google limits FAQ rich results to government and health sites, and I understand it retired the Course Info rich result in 2025, so schema here helps entity understanding more than SERP display. |
| **Media** | 3 / 15 | No photo of a session, the trainer, the room or a participant's output. No video. No share image (og:image dropped). The hero visual is a decorative gauge. |
| **Authority** | 6 / 15 | Two organisation quotes (TechCamp, Stratostaff) with no named person or role. "Certified ICT & AI practitioners" names no certificate. No trainer bio. No review count. Not NITA-registered and the page is silent on it. |
| **Freshness** | 8 / 10 | Cohort dates roll forward per request, and Course schema carries live CourseInstance dates. There is no visible "last updated" line. "Introductory price; normally Ksh 30,000" has run since at least August and will lose credibility. |
| **Total** | **52 / 100** | |

---

## 6. Persona scoring

Personas are derived from the SERP signals in sections 3 and 4. The three personas in the brief are scored first.

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| **HR / L&D manager** | 8 | 6 | 10 | 7 | **31** | Critical Mismatch |
| **Executive / senior leader** | 7 | 8 | 11 | 8 | **34** | Critical Mismatch |
| **Budget-conscious beginner** | 12 | 18 | 12 | 14 | **56** | Needs Work |
| **SME owner** | 14 | 15 | 12 | 17 | **58** | Needs Work |
| **ChatGPT-focused learner** | 13 | 12 | 13 | 20 | **58** | Needs Work |
| **Individual professional** | 20 | 21 | 13 | 22 | **76** | Good |

### Persona cards and evidence

**HR / L&D manager (31).** Decision stage. Evaluates carefully. Needs a day rate, an agenda, a proposal, invoicing by LPO, data-protection content and supplier credentials.
- Relevance 8: the hero says "you and your team", but every price is per person.
- Clarity 6: the team offer exists only in FAQ 6 and in a small sidebar link on `/ai-training/register`.
- Trust 10: two company quotes are present. There is nothing on data protection, AI policy or NITA status. The client folders list more corporate work (OML Africa Logistics, KS Group Africa, Vicentia East Africa and others), but none of it appears on the page.
- Action 7: the only team CTA is "Message us". There is no "Request a proposal" or "Book a call".
- **Fixes:** build `/ai-training/teams` with a "from KES X per training day, up to N people" line, a half-day / 1-day / programme menu, a "Request a proposal" form, a section on Kenya's Data Protection Act 2019 and an AI acceptable-use policy, and payment by invoice or LPO. Answer the NITA question honestly ("We are not a NITA-registered provider yet"). Do not claim registration until it is granted.

**Executive / senior leader (34).** Decision stage. SERP evidence: kenya.ai "Augmented Thinking" executive training; aiconsultant.co.ke 90-minute executive briefing; the teardown's 1-on-1 tier at This Is Digital (Ksh 60,000).
- Saturday group sessions with beginners do not fit. There is no private or briefing format.
- **Fix:** list an "Executive briefing (90 minutes)" and a "1-on-1" option on the teams page, with a "Book a 30-minute call" CTA.

**Budget-conscious beginner (56).** Awareness to consideration. SERP evidence: free programmes; KES 4,999 and KES 10,000 competitors.
- Clarity 18: the price is clear. Relevance 12 and Action 14: the only door costs Ksh 13,500.
- **Fix:** show the intro class (about KES 500, if confirmed) as the first rung, labelled "Start here", with its own register button. Add a short "Free vs paid AI training" FAQ answer that says what the paid class adds (your real tasks, live help, the WhatsApp group).

**SME owner (58).** Consideration stage. SERP evidence: swafietech.co.ke and odsaitech.com SME framing; kenzobe.com "Small business owners".
- Relevance 14: one generic bullet ("You run or work in a business"). The SME examples already written in `src/lib/resources.js` (quotations, WhatsApp replies, chasing payments, a Nakuru catering business) never reach this page.
- Trust 12: no SME testimonial. Action 17: "Register & pay" and WhatsApp are both good.
- **Fix:** add a "What you will do for your business on the day" block with 4 to 6 concrete SME tasks, one SME owner testimonial with a name and a business, and the mid tier (about KES 4,500 to 5,500, if confirmed) beside the Ksh 13,500 class.

**ChatGPT-focused learner (58).** Awareness to consideration. SERP evidence: exact-match "ChatGPT Course in Nairobi" pages.
- **Fix:** rename the tools H2 to "ChatGPT, Claude and Gemini training: the tools you will use", give ChatGPT 3 to 4 concrete tasks, and add an FAQ "Is this a ChatGPT course?". Consider a short `/ai-training/chatgpt` page only if the tier ladder includes a ChatGPT-only class.

**Individual professional (76).** Consideration to decision. The page serves this persona best: dates, price, curriculum, online or in person, and a direct "Register & pay" button.
- Trust 13 holds it back: no trainer, no certificate statement, no individual reviews.
- **Fix:** add a trainer block (name, photo, 3 credentials; `Paul-Theceri_Facilitator-Profile.md` already exists in the training folder), state plainly whether attendees get a certificate of completion, and add 2 or 3 named individual testimonials.

### Systemic issues

1. **Trust is the lowest dimension for every persona** (10 to 13 of 25). No person, no face, no photo and no certificate appear anywhere on the page.
2. **Action splits by persona.** It is strong for individuals (20 to 22) and weak for buyers (7 to 8), because every CTA leads to a per-person checkout.

---

## 7. Findings ranked by likely impact on enquiries, mapped to files

| # | Finding | File | Fix |
|---|---|---|---|
| 1 | Team, corporate and executive buyers have no page, price or proposal CTA (HIGH mismatch on 3 of 6 queries). | New: `src/app/ai-training/teams/page.js`; link from `src/app/ai-training/page.js` (FAQ at line 110, WHO at lines 77 to 82), `src/app/ai-training/register/page.js` (lines 132 to 138), `src/lib/constants.js` (nav, lines 51 to 63) and `src/app/sitemap.js` (line 28) | Build a service page with formats, "from" day rates, a data-protection section and a "Request a proposal" form, then link it from the hub, the register sidebar, the nav and the sitemap. |
| 2 | The page sells one tier at Ksh 13,500. The brief describes KES 500, KES 4,500 to 5,500 and team tiers. | `src/lib/training.js` (`TRACKS`, lines 26 to 44); `src/app/ai-training/page.js` (price card lines 219 to 229, H2 line 267, cost FAQ line 107, schema `offers` lines 125 to 132) | Confirm the current offer, then add each tier as a track and show a three-rung price ladder on the page with one Offer per tier in the Course schema. |
| 3 | Weak relevance: the H1 is a slogan, the title is about 70 characters, and "Kenya", "course", "corporate" and "certificate" never appear. | `src/app/ai-training/page.js` (metadata lines 20 to 39; H1 lines 200 to 205) | Make the H1 "AI Training in Nairobi for Professionals and Teams", keep the slogan as the subhead, and shorten the title to about 55 characters with "AI Training", "Nairobi" and "Kenya". |
| 4 | No trainer, no certificate statement and only two unnamed company quotes (Trust 10 to 13 of 25 for every persona). | `src/components/Testimonials.js` (`ITEMS`); `src/app/ai-training/page.js` (Why Cloudwise, lines 426 to 455) | Add a named trainer block with a photo, state the certificate policy, and add named testimonials from individuals and SMEs. |
| 5 | No share image: the page-level `openGraph` and `twitter` objects drop the layout's images. | `src/app/ai-training/page.js` (lines 25 to 38); `src/app/layout.js` (lines 41 to 56) | Add `images` to both objects, or add `src/app/ai-training/opengraph-image.png`, so WhatsApp shares show a course card. |
| 6 | The FAQ misses the SERP's recurring questions: cost comparison, certificate, team or group price, staff data safety, NITA status, refund or reschedule. | `src/app/ai-training/page.js` (`buildFaqItems`, lines 95 to 112) | Add these 6 questions with direct answers to reach 12 to 13 questions. |
| 7 | No real photos or video of a session. | `src/app/ai-training/page.js` (hero lines 192 to 197; tools section lines 350 to 380) | Replace or supplement the decorative gauge with a photo of a live Saturday session and add a 30 to 60 second clip. |
| 8 | ChatGPT intent is under-served. | `src/app/ai-training/page.js` (`TOOLS`, lines 68 to 75; H2 line 355) | Rename the tools H2 to lead with "ChatGPT" and add an FAQ "Is this a ChatGPT course?". |
| 9 | SME use cases exist in the repo but not on the page. | `src/lib/resources.js` (lines 51 to 54, 106); `src/app/ai-training/page.js` (`WHO`, lines 77 to 82) | Reuse the SME examples as a "What you will do for your business" block. |
| 10 | Schema gaps. | `src/app/ai-training/page.js` (`buildCourseJsonLd`, lines 114 to 156); `src/app/layout.js` (`orgJsonLd`) | Add `instructor` (Person), a `VirtualLocation` for online mode, a BreadcrumbList, and EducationalOrganization typing. |
| 11 | The H1 words are joined by a non-breaking space, so some parsers read "WorkSmarterwithAI." | `src/components/anim/AnimatedHeading.js` (line 51) | Use a normal space between word spans. Low priority: Google normally treats a non-breaking space as a space. |

---

## 8. Recommended section order for `/ai-training` (outline, not a wireframe)

1. **Hero.** H1 "AI Training in Nairobi for Professionals and Teams". Subhead "Work smarter with AI. Hands-on, on your real tasks." Next cohort date and "Registration closes Thu 05 Nov" (`closesAt` already exists in `src/lib/training.js`). Two CTAs: "Register for the next class" and "Training a team? Get a proposal" (links to `/ai-training/teams`).
2. **Choose your class.** Three cards: Intro class (about KES 500), Practitioner class (about KES 4,500 to 5,500, or Ksh 13,500 if that stays), Team training ("from KES X per day"). Each card has its own CTA.
3. **What you will do on the day.** SME and professional tasks, with ChatGPT named first.
4. **Curriculum** with outcomes per module.
5. **Your trainer.** Name, photo, credentials.
6. **Photos from a recent session.**
7. **Testimonials.** Named individuals, an SME owner and the two companies.
8. **Certificate and what you keep.**
9. **FAQ** (12 to 13 questions).
10. **Final CTA**, repeated with WhatsApp.

Run `/seo schema` for the Course and Offer markup per tier, `/seo content` for the E-E-A-T gaps (trainer, credentials), and `/seo local` because "Nairobi" queries may trigger a local pack this tool could not see.

---

## 9. Limitations

1. **The SERP is not google.co.ke.** WebSearch returns results from a US index. Kenyan rankings, the local pack and positions will differ. The result order is the tool's order, not a verified rank.
2. **No SERP features were visible.** I could not see People Also Ask, ads, related searches, the local pack or the AI Overview. Competitor FAQs served as a proxy for PAA, and I could not weight personas by ad density.
3. **No search volume data.** Persona weights and impact rankings are judgement, not volume.
4. **No Search Console access.** The exam-code explanation in section 1b is a hypothesis.
5. **Competitor pages were read through a summariser.** Word counts and FAQ counts are approximate.
6. **The tier pricing in the brief could not be verified.** The live page and the repo both show one Ksh 13,500 tier. Findings 2 and the "Budget-conscious beginner" score depend on which offer is current.
7. **Client names in the training folder were not checked for delivered work or consent.** Show a client logo only if the training was delivered and the client agrees.
8. **The page was rendered once with Playwright from one location.** I did not measure speed or Core Web Vitals.

---

## 10. Sources

- [The Knowledge Academy: AI and ML courses Kenya](https://www.theknowledgeacademy.com/ke/courses/artificial-intelligence-and-machine-learning/)
- [The Knowledge Academy: AI4IT Nairobi](https://www.theknowledgeacademy.com/ke/courses/artificial-intelligence-and-machine-learning/artificial-intelligence-ai-for-it-professionals-ai4it-/nairobi/)
- [The Knowledge Academy: ChatGPT Course in Nairobi](https://www.theknowledgeacademy.com/ke/courses/artificial-intelligence-tools-training/introduction-to-chatgpt-training/nairobi/)
- [The Knowledge Academy: ChatGPT Prompt Engineering Nairobi](https://www.theknowledgeacademy.com/ke/courses/artificial-intelligence-tools-training/chatgpt-prompt-engineering-training/nairobi/)
- [The Knowledge Academy: Generative AI Nairobi](https://www.theknowledgeacademy.com/ke/courses/artificial-intelligence-tools-training/generative-ai-certification-training-course/nairobi/)
- [IABAC: AI courses in Kenya](https://iabac.org/artificial-intelligence-courses-in-kenya)
- [Inceptor: AI training](https://inceptor.co.ke/k-course/ai-training/)
- [NobleProg: AI training in Kenya](https://www.nobleprog.co.ke/artificial-intelligence-ai-training)
- [NobleProg: AI Agents training](https://www.nobleprog.co.ke/ai-agents-training)
- [NobleProg: ChatGPT training in Kenya](https://www.nobleprog.co.ke/chatgpt-training)
- [Swafie Tech: training](https://www.swafietech.co.ke/training)
- [Hessons Consulting: AI productivity training Kenya](https://www.hessonsconsulting.co.ke/ai-productivity-training-kenya/)
- [ODS AI Tech](https://odsaitech.com/)
- [KenZobe: AI training](https://www.kenzobe.com/ai-training)
- [AI Consultant Kenya: corporate AI training](https://aiconsultant.co.ke/services/ai-training/)
- [AI Consultancy Kenya: corporations](https://aiconsultancykenya.co.ke/corporations/)
- [Kenya.ai: Augmented Thinking](https://kenya.ai/learning/augmented-thinking/)
- [Digital4Africa: AI training course](https://digital4africa.com/ai-training-course/)
- [DIT: AI course in Nairobi](https://dit.ac.ke/2026/04/15/online-ai-course-nairobi-kenya/)
- [University of Nairobi short courses](https://unes.co.ke/ai-dtrs/)
- [Sprintzeal: AI and ML Nairobi](https://www.sprintzeal.com/course/artificial-intelligence-certification-training/nairobi)
- [Unichrone: AI Expert Nairobi](https://unichrone.com/ke/artificial-intelligence-expert-training/nairobi)
- [Copex: AI courses Nairobi](https://copextraining.com/courses-seminars/artificial-intelligence/nairobi-kenya)
- [UNESCO: Huawei AI training Nairobi](https://www.unesco.org/en/articles/unesco-collaborates-huawei-artificial-intelligence-training-nairobi-kenya)
- [ICT Ministry: AI, AI, AI!](https://ict.go.ke/ai-ai-ai)
- [Edstellar: corporate training companies in Kenya](https://www.edstellar.com/blog/corporate-training-companies-kenya)
- [Time: OpenAI Kenya workers](https://time.com/6247678/openai-chatgpt-kenya-workers/)
- [Slate: ChatGPT contractor in Kenya](https://slate.com/technology/2023/05/openai-chatgpt-training-kenya-traumatic.html)
- [The Register: Kenyan workers and ChatGPT](https://www.theregister.com/2023/01/20/kenyan_workers_chatgpt/)
- [Tech Trends KE: free AI training in public libraries](https://techtrendske.co.ke/2026/09/01/free-ai-training-kenya-public-libraries/)
- [ITWeb: Moringa free AI skills](https://itweb.africa/article/moringa-to-train-3600-kenyan-youth-in-free-ai-skills-drive/rxP3jMBEoWG7A2ye)
- [Citizen Digital: AWS AI skills in Kenya](https://citizen.digital/tech/amazon-web-services-launches-initiative-to-provide-ai-skills-in-kenya-n340879)
- [Learners Ink: Agentic AI Nairobi](https://www.learnersink.com/data-ai/agentic-ai-training-online-training-nairobi-kenya)

Generate a PDF report? Use `/seo google report`.
