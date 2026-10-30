# Website improvement plan: AI training ladder, accuracy, speed and SEO

**Written:** 14 October 2026 · **Status:** approved for implementation, nothing built yet · **Owner:** Paul Theceri Ng'ang'a · **Builder:** Claude, one phase at a time, on request

This plan is the single list of changes to www.cloudwise.co.ke. Hand it back one phase at a time ("do phase 1"), and each phase is built, checked and shipped on its own branch. Every step names the files to change. When a step needs a decision or an action outside the code, the step says so and names who does it.

---

## Contents

1. How to use this plan
2. Rules for every change
3. Decisions already made
4. Where the evidence comes from
5. The prioritised fix list
6. Phase 0. Checks and switches outside the code (Paul)
7. Phase 1. Remove everything untrue, and fix the address
8. Phase 2. Measure enquiries and payments
9. Phase 3. Mobile speed
10. Phase 4. The three-tier product model
11. Phase 5. Credits: pay for a small class, use it on a bigger one
12. Phase 6. Removed: no deposits or instalments
13. Phase 7. The new and rewritten training pages
14. Phase 8. Payments: paybill fallback, cards and the bank sweep
15. Phase 9. Technical SEO and structured data
16. Phase 10. Local SEO and the contact page
17. Phase 11. Content, trust and the Prompt Pack
18. Phase 12. Mobile layout fixes
19. Phase 13. Follow-up systems: HubSpot, certificates, reviews
20. Phase 14. Optional light theme
21. Release checklist for every phase
22. Coverage check: every request mapped to a step
23. Not in this plan, on purpose

---

## 1. How to use this plan

1. Ask for one phase at a time, for example "do phase 1". Phases 0 to 3 can run in any order. Phase 4 must come before phases 5 and 7.
2. For each phase, Claude creates a branch from `main` named in the phase heading, makes the changes, runs the checks in section 21, and opens a pull request. Claude does not merge without your approval.
3. Phase 0 and parts of phase 8 are actions only you can do (Safaricom, Paystack, Vercel, Meta, Google). Each one says exactly what to send or click.
4. When a step says **Decision**, the step cannot start until you answer. The plan gives the default that applies if you say "use the default".

### Recommended order

| Order | Phase | Why first |
|---|---|---|
| 1 | Phase 0 | Some checks protect revenue today (the Ksh 2 test price) and some switches take Safaricom days. |
| 2 | Phase 1 | The page currently promises things the course does not deliver. |
| 3 | Phase 2 | Without measurement, no later change can be judged. |
| 4 | Phase 3 | 25 to 31% of Meta clicks reach the page; slow mobile load is a likely cause. |
| 5 | Phases 4, 5, 7 | The tier ladder, credits and the new pages. One release, before the Kickstart ads start. |
| 6 | Phase 8 | Turns on each payment switch as its external blocker clears. |
| 7 | Phases 9 to 12 | SEO, local, content and layout. |
| 8 | Phases 13 and 14 | Follow-up systems and the optional light theme. |

**Target date for phases 1 to 7:** before the Kickstart ads launch on 21 October 2026 (tiered plan revision 4, section 10). If that date slips, the ads wait. The ads must never point at a page that lists tools the course does not teach.

---

## 2. Rules for every change

1. **Keep the design.** Keep the dark theme, the brand colours in `tailwind.config.js` (ink `#0A0A0B`, ember `#FF3F1A`, ice `#97D6DF`, teal `#447980`), the fonts, the card styles, the `.eyebrow` and `.btn-ember` classes, and the layout rhythm. New pages reuse the existing components (`Reveal`, `Faq`, `Testimonials`, `card-dark`, `container-px`). The only optional visual change is the light theme toggle in phase 14.
2. **Never run `npm run build` while `next dev` is running.** It corrupts `.next`. Stop the dev server first, or let Vercel build.
3. **British English** in all copy: programme, organisation, enrol, centre, licence (noun), practise (verb).
4. **The site names only the tools the course teaches**: Claude (assistants, Projects, connectors, web search, Claude Design shown on Day Two), NotebookLM, ChatGPT, Gemini and Copilot compared on one task, Meta AI in WhatsApp (Kickstart toolbox), voice input and the phone camera, and HeyGen shown on Day Two. Never Zapier, Make, n8n, Midjourney, DALL·E or Perplexity, except in the registration question "Which AI tools have you used before?", which asks about the buyer's past.
5. **No recordings, no NITA, no struck-through Ksh 30,000.** See section 3. "Worth" labels came back on 31 October 2026 for the Kickstart value stack only, and each value must come from a real Cloudwise price (`KICKSTART_STACK` in `src/lib/training-content.js`).
6. **One source of truth.** Prices, dates, tiers and the address each live in one module (`src/lib/training.js` and `src/lib/constants.js`). Pages, emails, JSON-LD and Meta events read from there. Never type a price or an address into a page.
7. **Money paths fail safe.** Every change to registration, payment, credit or settlement code keeps the existing guarantees: the price is resolved on the server, webhooks are idempotent through `claimOnce`, and a settlement failure never rolls back a confirmed payment.
8. **Each step is one commit**, with a message in the repo's style and the attribution lines.

---

## 3. Decisions already made

These are settled. Do not reopen them while building.

| Topic | Decision | Source |
|---|---|---|
| **Kickstart** | **KES 500.** 2 hours, live on Google Meet only, Wednesdays 7:00 to 9:00 pm EAT, weekly, up to 100 people. First session Wednesday 28 October 2026. | Tiered plan rev4 §1, §4 |
| **Essentials** | **KES 5,500** (raised from KES 4,500 on 14 October 2026). 4 hours, the first Saturday of each cohort, 9:00 am to 1:00 pm, Delta Annex or Google Meet. It is Day One of the Programme. | Paul, 14 Oct 2026 |
| **Programme** | **KES 13,500**. 8 hours over the first and second Saturday of each month. | Rev4 §4 |
| **Payment** | **Every class is paid in full when it is booked.** No deposits and no instalments. Part payments invite buyers who will not pay the full price and requests for refunds, and they make the code more complex. | Paul, 15 Oct 2026 |
| **Credits** | Kickstart: KES 500 off Essentials or the Programme, valid 14 days after the Kickstart session. Essentials: KES 5,500 off the Programme, valid 60 days after the Essentials Saturday, so Day Two costs KES 8,000. A credit is worth the list price of the class bought, not the amount paid after an earlier credit. | Rev4 §4 and Paul, 14 Oct 2026 |
| **Private one-to-one** | **KES 30,000** for 8 hours, one person. It replaces the struck-through "Was Ksh 30,000". | Rev4 §6, §12 |
| **Team training** | **KES 13,500 per person**, 10 people or more. Quoted formats: free demonstration, executive briefing, Microsoft 365 and Copilot version. | Rev4 §6 |
| **Platform** | Google Meet, link sent the day before. Never Zoom. | Rev4 §0 |
| **Recordings** | None. Buyers get the class-prompts recap in writing. | Rev4 §12 |
| **Support** | WhatsApp community with no end date for Essentials and Programme buyers. Kickstart buyers go on a broadcast list. | Rev4 §12 |
| **Prompt count** | 72 prompts. | Rev4 §12 |
| **Certificates** | Certificate of completion for both Programme Saturdays. Certificate of attendance for Essentials. | Rev4 §4 |
| **Refunds** | No refunds. One transfer: Kickstart any time before the session, Essentials with 3 days' notice, Programme with 5 days' notice. | Rev4 §4 |
| **Address** | **4th Floor, Delta Annex, Delta Corner, Westlands, Nairobi.** Drop "Waiyaki Way" from the site. | Paul, 14 Oct 2026 |
| **TechCamp** | TechCamp is a real client. Keep its testimonial. List Bamburi Cement and FEKAN Howell LLP beside TechCamp and Stratostaff. | Paul, 14 Oct 2026 |
| **NITA** | Never mention it on the site. | Paul, 14 Oct 2026 |
| **Advanced Saturday, 30-minute one-to-one call** | Dropped. Do not build. | Rev4 §12 |
| **Design** | Keep the current look. A light theme is allowed as an option only. | Paul, 14 Oct 2026 |

---

## 4. Where the evidence comes from

| Evidence | Location |
|---|---|
| SEO audit, 14 Oct 2026: technical, content, schema, sitemap, performance, visual, GEO, agentic, SXO and local reports | `docs/audits/2026-10-14/*.md` (this repo) |
| Chrome DevTools mobile traces, 14 Oct 2026 | `Website_Performance_Audit_2026-10-14.pdf` in `D:\conveniences\Cloudwise\sales and marketing` |
| Search Console (90 days, through Windsor.ai) and GA4 (14 days of data) | `AI_Training_Search_and_Traffic_Report_2026-10-14.pdf`, same folder |
| Tier ladder, syllabus, page copy, ad copy | `Cloudwise_AI_Training_Tiered_Plan_CW-2026-AIT-01_rev5.pdf`, same folder |
| Meta pixel, CAPI and UTM findings | `Meta_Ads_Review_AI_Training_2026-09-25.md`, `Meta_CAPI_Token_and_Retargeting_Setup_Guide.md`, `Meta_UTM_Tracking_Setup_Guide.md`, same folder |
| Google Business Profile | `Cloudwise_Google_Business_Profile_Audit_and_Guide.pdf`, same folder |
| Payment setup and the switches that are off | `docs/PAYMENTS_SETUP.md` §6.5, §7, §8 and `docs/VERCEL_DEPLOY_AND_ENV.md` "What is set up right now" |

**Where the paybill fallback, card payments and the bank sweep were written down.** All three are already built. They were planned and written in `docs/PAYMENTS_SETUP.md` (§6.5 paybill fallback, §7 Paystack cards, §8 settlement to Equity) and their off switches are listed in `docs/VERCEL_DEPLOY_AND_ENV.md`, lines 148 to 158 and 208. They are off because each one waits for an outside party. Phase 8 turns them on.

---

## 5. The prioritised fix list

Ordered by likely impact on AI training enquiries and paid seats. "Phase" says where the detailed steps are.

| # | Fix | Evidence | Main files | Phase |
|---|---|---|---|---|
| 1 | Confirm production charges real prices, not Ksh 2 | `docs/VERCEL_DEPLOY_AND_ENV.md` line 156 records `TEST_PAYMENT_AMOUNT_KES=2` on production | Vercel settings | 0.1 |
| 2 | Remove the tools, platform and value claims the course does not deliver | Rev4 §2; content audit, critical 1 | `src/app/ai-training/page.js`, `src/lib/registration-form.js`, `src/lib/resources.js`, `src/lib/email/templates.js` | 1 |
| 3 | Add the KES 500 and KES 5,500 entry tiers with their own pages | Rev4 §1; SXO finding 2; one enquiry in 17 becomes a seat | `src/lib/training.js`, new `src/app/ai-training/kickstart`, `/essentials`, `/programme` | 4, 7 |
| 4 | Credits that turn a small purchase into a down payment | Rev4 §4; your request | new `src/lib/credits.js`, new Sanity type `trainingCredit` | 5 |
| 5 | Measure lead, checkout and purchase in GA4 and Meta | GA4 has page views only; CAPI never sent an event | `src/lib/meta/*`, `src/components/PixelEvent.js`, `src/lib/analytics/google.js` | 0.2, 2 |
| 6 | Load the Meta Pixel and Clarity after the page | Pixel uses 2.4 to 2.8 s of main thread; LCP 3.0 s on /ai-training | `src/components/MetaPixel.js`, `src/components/MicrosoftClarity.js` | 3 |
| 7 | Cache `/ai-training` | `force-dynamic`, `no-store`, 140 KB HTML on every visit | `src/app/ai-training/page.js` line 18 | 3 |
| 8 | Rewrite `/ai-training` as the hub, with "AI training", "Nairobi" and "Kenya" in the title, H1 and a summary passage | Ranks only for exam codes; title is a slogan | `src/app/ai-training/page.js` | 7 |
| 9 | Team and private training page | SXO: HR and L&D persona scores 31 of 100; three of six target queries want a team page | new `src/app/ai-training/teams/page.js` | 7 |
| 10 | Next date and price visible on the first phone screen, plus a sticky book bar | Visual audit: dates start 1,550 px down | `src/app/ai-training/page.js`, new sticky bar component | 7, 12 |
| 11 | One host: permanent redirect from the bare domain | 307 redirect; Google indexes both hosts | Vercel domain settings | 0.5 |
| 12 | Turn on the paybill fallback, cards and the bank sweep | Built, switched off | Vercel settings, `src/app/api/payments/paybill/c2b/route.js` | 8 |
| 14 | Turn the Prompt Pack into a door to the Kickstart | "how to prompt someone": 55 impressions, position 8.8 | `src/app/resources/[slug]/page.js`, `src/lib/resources.js` | 11 |
| 15 | Fix the address everywhere and the contact map | Map centred 3 km away, no Westlands | `src/lib/constants.js` and 10 other files | 1.2, 10 |
| 16 | Share images on training pages | No `og:image` on /ai-training, register, resources | page `metadata` objects | 9 |
| 17 | Structured data: ProfessionalService, Course with three offers, breadcrumbs | Schema score 42 of 100 | `src/app/layout.js`, `src/lib/seo/jsonld.js` (new) | 9 |
| 18 | Remove `/ai-training/register` from the index | Thin page ranking for exam codes | `src/app/ai-training/register/page.js`, `src/app/sitemap.js` | 9 |
| 19 | Named trainer and real proof | E-E-A-T score 35; no trainer named | `src/app/ai-training/page.js`, `src/components/TrainerCard.js` (new) | 11 |
| 20 | Mobile speed: Lenis, GSAP and the 3D hero only where needed | 1.1 MB of JavaScript on every page | `src/components/SiteChrome.js`, `src/components/SmoothScroll.js`, `src/components/three/HeroCanvas.js` | 3 |
| 21 | Security headers | Only HSTS is sent; the checkout takes payments | `next.config.mjs` | 9 |
| 22 | UTM capture on the registration record | Rev4 §8; UTM guide §6 | `src/components/UtmCapture.js` (new), registration route | 2 |
| 23 | llms.txt and a citable course summary for AI assistants | ChatGPT is the third-largest source | `public/llms.txt`, hub page | 9, 7 |
| 24 | Sitemap with real dates and no thin pages | 33 URLs share one fake date | `src/app/sitemap.js`, `src/sanity/lib/queries.js` | 9 |
| 25 | Tap targets, WhatsApp bubble, contrast | Visual audit | `src/components/Footer.js`, `src/components/WhatsAppButton.js` | 12 |
| 26 | HubSpot tier pipeline, certificates with verification, reviews page | Rev4 §7 | phase 13 files | 13 |
| 27 | Optional light theme toggle | Paul, 14 Oct 2026 | `tailwind.config.js`, `src/app/globals.css` | 14 |

---

## 6. Phase 0. Checks and switches outside the code (Paul)

No branch. These are actions in other systems. Each one has a check you can see.

### 0.1 Confirm the live price (do this today)

`docs/VERCEL_DEPLOY_AND_ENV.md` line 156 says production charges **Ksh 2** through `TEST_PAYMENT_AMOUNT_KES=2`. If that variable is still set, every real booking pays Ksh 2.

1. Open Vercel → the Cloudwise website project → **Settings** → **Environment Variables**.
2. Search for `TEST_PAYMENT_AMOUNT_KES`.
3. If it exists for **Production**, click **⋯** → **Remove**.
4. **Deployments** → top row → **⋯** → **Redeploy**.
5. Check: open `/ai-training/register`, register with your own details, and confirm that the checkout page shows **Ksh 13,500**. Do not pay. The test leaves one pending booking in `/studio` and sends you the "registration received" email; ignore both.

### 0.2 Set the Conversions API token

The server code already sends Lead and Purchase to Meta (`src/lib/meta/capi.js`). It has sent nothing, because the token is missing.

1. Follow `Meta_CAPI_Token_and_Retargeting_Setup_Guide.md`, section 4, to make a dedicated token for dataset 1040209791698851.
2. In Vercel, add `META_CAPI_ACCESS_TOKEN` for **Production** only. Redeploy.
3. Check: in Events Manager → **Test events**, follow section 7 of the same guide.

### 0.3 Ask Safaricom to re-point the C2B URLs (paybill fallback)

1. Send the email in `docs/PAYMENTS_SETUP.md` §6.5 to `apisupport@safaricom.co.ke`. It asks for paybill 4131947 to use:
   - ConfirmationURL `https://www.cloudwise.co.ke/api/payments/paybill/c2b`
   - ValidationURL `https://www.cloudwise.co.ke/api/payments/paybill/c2b/validation`
2. Use the `www` host. The bare domain redirects, and Safaricom does not follow redirects.
3. When Safaricom confirms, do step 8.1.

### 0.4 Ask Safaricom to enable B2B (bank sweep), and finish Paystack

1. Send the B2B request in `docs/PAYMENTS_SETUP.md` §8.A.1. You receive an initiator name and set an initiator password in the M-Pesa Org portal.
2. Finish Paystack business verification (`docs/PAYMENTS_SETUP.md` §7.6).
3. When each one clears, do steps 8.2 and 8.3.

### 0.5 Make the bare-domain redirect permanent

1. Vercel → project → **Settings** → **Domains**.
2. On `cloudwise.co.ke`, change the redirect to `www.cloudwise.co.ke` from **307 Temporary** to **308 Permanent**.
3. Check: `curl -sI https://cloudwise.co.ke/ai-training` shows `HTTP/2 308` and `location: https://www.cloudwise.co.ke/ai-training`.

### 0.6 Accounts and profiles

| Action | Where | Why |
|---|---|---|
| Verify the domain `cloudwise.co.ke` in Meta Business Manager, and set it as the conversion domain | Business Settings → Brand safety → Domains | Meta Ads review, phase 0 |
| Mark `generate_lead` and `purchase` as key events (after phase 2 ships) | GA4 → Admin → Events | GA4 then reports conversions by source |
| Create a GA4 Measurement Protocol API secret, and add it to Vercel as `GA4_API_SECRET` | GA4 → Admin → Data streams → web stream → Measurement Protocol | Server-side purchase for paybill payments (step 2.4) |
| Rename the Google Business Profile from "Cloudwise Technologies" to "Cloudwise Limited", and set the website to `https://www.cloudwise.co.ke` | Google Business Profile | Local audit, findings 4 and 10 |
| Reply to all 19 Google reviews | Google Business Profile | Local audit, finding 7 |
| Set the LinkedIn company page name to "Cloudwise Limited", and give its public URL | LinkedIn | GEO audit, finding 2. The current `sameAs` link redirects crawlers to a login page. |
| Verify the site in Bing Webmaster Tools (import from Search Console) | bing.com/webmasters | GEO audit, finding 10 |
| Fix the seo-stack Search Console connection | seo-stack configuration | It failed on 14 October; Windsor.ai was used instead |
| Edit the blog post that still sells the Women Biz360 masterclass, and keep its link to `/ai-training` | `/studio` | Content audit, finding 9 |
| Lowercase the post slug `how-to-turn-WhatsApp-conversations-into-sales` (step 9.9 adds the redirect) | `/studio` | Technical audit, finding 6 |
| Add the UTM string to every new Meta ad (rev4 §8) | Ads Manager | Step 2.5 stores it on the booking |

### 0.7 Information Claude needs from you

| Item | Needed for | If you do not supply it |
|---|---|---|
| A Google Meet link for the Wednesday Kickstart, on an account that allows 2 hours for up to 100 people | Phase 4, `KICKSTART_MEET_URL` | Kickstart emails say "Your Google Meet link arrives on WhatsApp before the session" |
| The Programme Google Meet link, if fixed | Phase 4, `COHORT_MEET_URL` | Emails keep "link sent the day before" |
| Opening hours | Step 9.6 schema, step 10.2 contact page | Hours are left out |
| A real photo of you teaching, and two photos from 3 October at Delta Annex | Steps 7.2 and 11.1 | The trainer card uses an initials monogram |
| Your trainer bio: name, title, credentials you can evidence (for example CPA (K), JKUAT), LinkedIn URL | Step 11.1 | The trainer card shows name and role only |
| Real figures for the home stats and the portfolio | Step 1.7 | Any figure you do not confirm is removed |
| Three named reviews with permission (Kiki and Chukwuma first) | Step 13.3 | The reviews page is not built |

---

## 7. Phase 1. Remove everything untrue, and fix the address

**Branch:** `fix/truthful-training-copy` · **Depends on:** nothing · **Ships alone:** yes

### 1.1 One address, defined once

1. In `src/lib/constants.js`, change `COMPANY_INFO.address` to:

   ```js
   address: {
     line1: '4th Floor, Delta Annex, Delta Corner',
     area: 'Westlands',
     city: 'Nairobi',
     region: 'Nairobi County',
     country: 'Kenya',
     countryCode: 'KE',
   },
   ```

2. In the same file, add:

   ```js
   /** "4th Floor, Delta Annex, Delta Corner, Westlands, Nairobi" */
   export function formatAddress({ withCountry = false } = {}) {
     const a = COMPANY_INFO.address;
     return [a.line1, a.area, a.city, withCountry ? a.country : null].filter(Boolean).join(', ');
   }
   ```

3. Remove `line2`. Then fix every place that reads it or hard-codes the address. The local audit lists them all:

| File and line | Change |
|---|---|
| `src/components/Footer.js:49` | `{formatAddress()}` |
| `src/app/contact/page.js:35` | `value: formatAddress()` |
| `src/app/layout.js:83-85` (JSON-LD) | Replaced in step 9.6. For this phase: `streetAddress: COMPANY_INFO.address.line1`, `addressLocality: \`${COMPANY_INFO.address.area}, ${COMPANY_INFO.address.city}\``, `addressRegion: COMPANY_INFO.address.region`. |
| `src/lib/email/layout.js:153` | `${escapeHtml(formatAddress())}` |
| `src/lib/email/templates.js:86` | `escapeHtml(track?.venue || formatAddress())` |
| `src/lib/training.js:40` (`venue`) | `venue: formatAddress()` (import from constants) |
| `src/lib/training.js:58` (retired masterclass venue "Delta Centre, Waiyaki Way") | **Leave unchanged.** It is the historical venue of a past event, and old records must render as they were. |
| `src/app/ai-training/page.js:106` (FAQ) | Rewritten in phase 7. For this phase, use `formatAddress()`. |
| `src/app/ai-training/page.js:152-153` (Course location) | Replaced in step 9.6. For this phase, `address: formatAddress({ withCountry: true })`. |
| `src/app/ai-training/register/page.js:124` | "Online, or Delta Annex, Westlands" |
| `src/components/training/RegistrationForm.js:281` | `description: 'Delta Annex, Delta Corner, Westlands'` |
| `docs/COMPETITOR_TEARDOWN_AI_TRAINING.md:158` | Add "Westlands" |

4. Check: `grep -rn "Waiyaki" src` returns only `src/lib/training.js` (the retired masterclass).

### 1.2 Zoom becomes Google Meet

| File and line | Change |
|---|---|
| `src/lib/registration-form.js:57` | `{ value: 'online', label: 'Online via Google Meet' }` |
| `src/components/training/RegistrationForm.js:33` (comment) and `:285` | "Google Meet" |
| `src/sanity/schemaTypes/trainingRegistration.js:101` | `{ title: 'Online (Google Meet)', value: 'online' }`. The stored value stays `online`, so old records still read. |
| `src/lib/email/templates.js:85` | `'Online via Google Meet. The link arrives the day before.'` |
| `src/app/checkout/[ref]/page.js:108` | `'Online via Google Meet'` |
| `src/app/resources/[slug]/page.js:281` | "Your Google Meet link arrives by email the day before. Check spam if it has not." |
| `src/app/ai-training/page.js:106`, `:232` | "Google Meet" (the page is rewritten in phase 7; this keeps it truthful until then) |

Check: `grep -rni "zoom" src` returns nothing except unrelated words.

### 1.3 Tools the course does not teach

| File | Change |
|---|---|
| `src/app/ai-training/page.js` `TOOLS` (lines 68-75) | Replace with the six entries below until phase 7 rewrites the section. |
| `src/lib/resources.js` `READINESS_ACCOUNTS` (lines 63-88) | Remove the Perplexity entry. Change the Gemini "why" to "Used once in class, to compare answers on the same task." |
| `src/lib/registration-form.js:33` `AI_TOOLS` | **Keep Perplexity and Canva AI.** This question asks what the buyer used before. Rev4 §7 decided this. |
| `src/components/home/TrainingBand.js` stats row | Change `['6+', 'AI tools']` to `['72', 'Prompts']`. |

The new `TOOLS` array:

```js
const TOOLS = [
  { name: 'Claude', desc: 'Your own AI assistant, built as a Claude Project and kept after the class' },
  { name: 'Claude connectors', desc: 'Day Two: AI reading a live CRM, invoices and a calendar, then stopping for your approval' },
  { name: 'NotebookLM', desc: 'Research that answers only from your own documents' },
  { name: 'ChatGPT, Gemini & Copilot', desc: 'The same task run on each, so you see the real differences' },
  { name: 'Voice & camera', desc: 'Dictate on your phone, and turn a photo of a receipt into a spreadsheet' },
  { name: 'Claude Design & HeyGen', desc: 'Day Two demonstration: from brief to flyer, and to a 30-second presenter video' },
];
```

Check: `grep -rniE "zapier|\bmake\b ai|midjourney|dall|perplexity" src` returns only `src/lib/registration-form.js`.

### 1.4 Value claims and the false anchor

| File and line | Change |
|---|---|
| `src/app/ai-training/page.js:44-49` `VALUE_STACK` | Remove the `worth` property and the `<span>` that renders it (line 280). The section is rewritten in phase 7. |
| `src/app/ai-training/page.js:222`, `:226-228` | Remove "Was Ksh 30,000" and the "SAVE 55%" badge. |
| `src/app/ai-training/page.js:107` (FAQ) | "Ksh 13,500 per person. Private one-to-one training is Ksh 30,000." |
| `src/app/ai-training/page.js:470` | Remove "introductory pricing closes once the cohort is full". Use "Seats are limited to keep every session hands-on." |
| `src/app/ai-training/register/page.js:101-103` | Remove the struck-through price. |
| `src/components/home/TrainingBand.js:45` | Remove the struck-through Ksh 30,000. |
| `src/lib/training.js:33` | Set `strikePriceKes: null`. |
| `src/app/ai-training/page.js:86` | "72 prompts" instead of "50+ curated prompts" |
| `src/app/ai-training/page.js:85`, `:289-303` ("AI Readiness Guide … Sent via WhatsApp", the "Bonus" block) | Replace with: "Before day one: your welcome pack, with the accounts to open and a 15-minute warm-up. Read it any time at /resources/ai-readiness." Link to `/resources/ai-readiness`. The word "Bonus" goes. |
| `src/lib/constants.js:62` | `description: 'Prompt pack, readiness guide and session checklist'` |

### 1.5 Claims about Cloudwise

| File and line | Change |
|---|---|
| `src/app/page.js:17` | "ICT and AI practitioners who build real products for real businesses every day." Remove "Certified". |
| `src/app/ai-training/page.js:440` | Three bullets: "ICT and AI practitioners, not academics" · "Trained organisations including Bamburi Cement, FEKAN Howell LLP, TechCamp and Stratostaff" · "Hands-on from the first minute" |
| `src/app/ai-training/page.js:110` (FAQ, teams) | Name Bamburi Cement, FEKAN Howell LLP, TechCamp and Stratostaff. |
| `src/components/Testimonials.js` | Keep both quotes. Change the Stratostaff quote's last sentence: remove "Worth every shilling — and more." unless Stratostaff said it word for word. **Decision:** confirm the exact wording of both quotes. Default: keep the TechCamp quote unchanged, and end the Stratostaff quote at "analysis." |

### 1.6 Wording that is true but misleading

| File and line | Change |
|---|---|
| `src/components/home/TrainingBand.js:13` | "WhatsApp support community, with no end date" |
| `src/app/ai-training/page.js:313` | "Your 2-day training schedule." becomes "Two Saturdays, 9am to 1pm." |

### 1.7 Numbers you must confirm (Decision)

The content audit could not verify these. Fill in the right-hand column. **Default: every figure not confirmed is removed, and its card shows a sentence instead.**

| File | Claim on the site | Your figure |
|---|---|---|
| `src/app/page.js:22-23` | "33+ projects delivered", "33 happy clients" | |
| `src/lib/constants.js:31-35` `stats` | 33, 33, 3 countries | |
| `src/app/page.js` | "100% completion rate" | |
| `src/lib/projects.js` | "$2M+ in transactions", "50k+ downloads", "4.8/5", and every client named "Cloudwise Limited" | |
| `src/app/about/page.js:20-23` | Team names and roles beside `placeholder1-4.jpg` photos | |

### 1.8 Done when

1. All greps in 1.1, 1.2 and 1.3 pass.
2. `/ai-training`, `/ai-training/register`, `/`, `/contact`, `/resources/ai-readiness` and one checkout page show no Zoom, no Waiyaki Way, no struck-through price and no "Worth".
3. A test registration email (`/api/test/emails`, see `docs/PAYMENTS_SETUP.md` §4.5) shows Google Meet and the Westlands address.

---

## 8. Phase 2. Measure enquiries and payments

**Branch:** `feat/conversion-tracking` · **Depends on:** nothing · **Ships alone:** yes, and it should ship before the ads start.

### The event map after this phase

| Step in the funnel | Meta (browser) | Meta (server, CAPI) | GA4 | Where it fires |
|---|---|---|---|---|
| Reads a training page | ViewContent | | `view_item` | Hub and each tier page, on mount |
| Clicks a WhatsApp link | Contact | | `whatsapp_click` | Delegated listener in `MetaPixelClient.js` |
| Submits the form (registration saved) | Lead, `eventID = lead.<ref>` | Lead, same id | `generate_lead` | Browser: after the API returns 201. Server: `onRegistrationCreated`. |
| Presses "Send M-Pesa prompt" or "Pay by card" | InitiateCheckout, `eventID = initiatecheckout.<ref>` | | `begin_checkout` | `Checkout.js`, on the first payment attempt |
| Payment confirmed | Purchase, `eventID = purchase.<ref>` | Purchase, same id | `purchase`, `transaction_id = <ref>` | Browser: the checkout "paid" state. Server: `onPaymentConfirmed`. |

Meta keeps one copy of an event when the browser and the server send the same event name and `eventID`. GA4 keeps one `purchase` for each `transaction_id`.

### 2.1 Move InitiateCheckout off page load

1. In `src/app/ai-training/register/page.js`, remove the `<PixelEvent event={META_EVENTS.initiateCheckout} … />` block (lines 41-52).
2. In `src/components/training/Checkout.js`, add a `useRef` flag `checkoutTracked`. In the handlers that start an STK push and a Paystack payment, before the request, call once:

   ```js
   trackPixel('InitiateCheckout', { content_ids: [booking.track], content_type: 'product', value: booking.amount, currency: 'KES', num_items: 1 }, { eventID: metaEventId('InitiateCheckout', booking.reference) });
   trackGoogle('begin_checkout', { currency: 'KES', value: booking.amount, items: [{ item_id: booking.track, item_name: booking.trackName, price: booking.amount }] });
   ```

3. Add `track` to the `booking` object in `src/app/checkout/[ref]/page.js`.
4. Update the comment block at the top of `src/lib/meta/events.js` with the table above. It currently says that no event is sent by both halves.

### 2.2 Browser copies of Lead and Purchase

1. In `src/components/training/RegistrationForm.js`, after a 201 response and before `router.push`, call:

   ```js
   trackPixel('Lead', { content_ids: [track], value: data.amount, currency: 'KES' }, { eventID: metaEventId('Lead', data.reference) });
   trackGoogle('generate_lead', { currency: 'KES', value: data.amount, tier: track });
   ```

2. In `src/components/training/Checkout.js`, when the state first becomes `paid` in this browser session, fire Purchase with `eventID: metaEventId('Purchase', booking.reference)` and GA4 `purchase` with `transaction_id: booking.reference`, `value: booking.amount`, `currency: 'KES'` and one item. Guard it with a `sessionStorage` key `cw_purchase_<ref>`, so a reload does not send it twice.
3. Do the same in `src/components/training/PaystackReturn.js` when verification succeeds.
4. Server side: `metaEventId` already gives `lead.<ref>` and `purchase.<ref>` (`src/lib/meta/events.js`). Keep `src/lib/lifecycle.js` unchanged here.

### 2.3 GA4 helper on the server

Create `src/lib/analytics/ga4-server.js` (`import 'server-only'`):

1. `isGa4ServerConfigured()` returns true when `GA4_API_SECRET` is set.
2. `sendGa4Purchase({ registration })` posts to `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}` with:
   - `client_id`: `registration.gaClientId`, or `${reference}.1` if there is none;
   - one event `purchase` with `transaction_id: reference`, `value: registration.amount`, `currency: 'KES'`, `items: [{ item_id: registration.track, price: registration.amount }]`.
3. Timeout 4 seconds. It never throws. It returns `{ sent, reason }`.
4. Call it from `onPaymentConfirmed` in `src/lib/lifecycle.js`, beside `sendEvent`, and await it last with the Meta call.

### 2.4 Capture the GA client id

1. In `src/lib/meta/capi.js` `readAttribution`, also read the `_ga` cookie. Store the client id (the last two dot-separated parts of `GA1.1.123.456`, so `123.456`) as `gaClientId`.
2. In `src/sanity/schemaTypes/trainingRegistration.js`, add `gaClientId` (string, read-only) inside the attribution object.

### 2.5 UTM and click-id capture

1. Create `src/components/UtmCapture.js` (client). On mount, read `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid` and `gclid` from `window.location.search`. If any is present, write them with `landingPage` (path) and `capturedAt` to `localStorage` key `cw_attribution` (first touch: do not overwrite an existing value younger than 30 days). Wrap every storage call in `try/catch`. Render nothing.
2. Mount it once in `src/components/SiteChrome.js`.
3. In `RegistrationForm.js`, read `cw_attribution` and send it as `attribution` in the POST body.
4. In `src/app/api/registrations/route.js`, accept `attribution`, keep only the seven known keys plus `landingPage`, cap each value at 200 characters, and store it as `utm` on the registration.
5. In `src/sanity/schemaTypes/trainingRegistration.js`, add an object `utm` with those fields (read-only, collapsed).
6. Show `utm_campaign` and `utm_content` in the admin alert (`adminSignupAlert` in `src/lib/email/templates.js`) and in the CSV export (`src/lib/email/roster-csv.js`).

The UTM string for every Meta ad (rev4 §8): `utm_source=meta&utm_medium=paid&utm_campaign=kickstart|essentials|programme&utm_content={{ad.name}}`.

### 2.6 WhatsApp clicks in GA4

In `src/components/MetaPixelClient.js` `useWhatsAppContactTracking`, also call `trackGoogle('whatsapp_click', { link_url: link.href, page_path: location.pathname })`.

### 2.7 Done when

Walk the funnel with Meta's test event code (CAPI guide §7) and GA4 DebugView:

1. `/ai-training` gives ViewContent and `view_item`.
2. `/ai-training/register` gives **no** InitiateCheckout.
3. Submitting the form gives Lead twice in Test events (browser and server) with the same event id, and Meta shows it as deduplicated.
4. Pressing "Send M-Pesa prompt" gives InitiateCheckout and `begin_checkout`.
5. Paying gives one Purchase (deduplicated) and one GA4 `purchase`.
6. The Sanity record holds `utm` and `gaClientId`.

---

## 9. Phase 3. Mobile speed

**Branch:** `perf/mobile-lcp` · **Depends on:** nothing · **Target:** LCP under 2,500 ms on `/ai-training` with the same trace settings as 14 October (Slow 4G, CPU 4x, 412 × 915). Today: 3,038 ms.

### 3.1 Load the Meta Pixel library after the page

The base code must stay in the HTML, so that queued events are never lost (commit 311fdb1 put it there on purpose). Only the download of `fbevents.js` moves.

1. In `src/components/MetaPixel.js`, change the inline snippet so that it:
   - creates the `fbq` queue and calls `fbq('init', …)` and `fbq('track', 'PageView')` at once, as now;
   - does **not** insert the `fbevents.js` script at once. It defines `load()`, which inserts the script, and runs it on `window` `load` inside `requestIdleCallback(load, { timeout: 3000 })`, or `setTimeout(load, 1500)` where `requestIdleCallback` does not exist;
   - also runs `load()` on the first `pointerdown`, `keydown` or `scroll`, whichever comes first, with a guard so the script is inserted once.
2. Keep the `<noscript>` image.
3. Update the comment to explain the reason: the queue keeps every event; only the 215 KB library waits.

### 3.2 Same for Clarity

Apply the same `load()` pattern in `src/components/MicrosoftClarity.js`. The `clarity` queue function is created at once; the `clarity.ms/tag` script is inserted on load and idle.

### 3.3 Keep the Google tag as it is, then measure

1. Do not change `src/components/GoogleTag.js` in this step. Google's tag detection needs the script in the HTML.
2. After 3.1 to 3.8 ship, trace `/ai-training` again. **Only if LCP is still above 2,500 ms**, apply the same deferral to `gtag.js` (keep the `dataLayer` and `gtag()` stub inline). Re-check that GA4 Realtime still shows your visit.

### 3.4 Cache the training pages

1. In `src/app/ai-training/page.js`, replace `export const dynamic = 'force-dynamic'` with `export const revalidate = 3600`.
2. Do the same on every new tier page in phase 7, and on `src/app/ai-training/register/page.js`.
3. This is safe: the registration API already rejects a closed cohort (`isCohortOpen` in `src/app/api/registrations/route.js`), and phase 4 adds the same guard for Kickstart sessions. At most, a page shows a closed date for one hour, and the form then explains that the date has closed.
4. Update the comment above the line to say this.
5. Check: `curl -sI https://www.cloudwise.co.ke/ai-training` shows `x-vercel-cache: HIT` on the second request.

### 3.5 The heading animation must not hide the main content

`AnimatedHeading` hides every word after hydration (`gsap.set(words, { yPercent: 115 })`) and then animates it back. On the homepage this makes the LCP wait for the animation.

1. In `src/components/anim/AnimatedHeading.js`, before `gsap.set`, measure once with `IntersectionObserver` (not `getBoundingClientRect`): if the heading is on screen at mount, skip the hide and the tween, and leave the words visible.
2. Headings below the fold keep the animation.

### 3.6 Reveal without a forced layout

`src/components/anim/Reveal.js` line 65 calls `getBoundingClientRect()` for every instance, which forces layout (665 ms on 9 October).

1. Remove that call.
2. Create the `IntersectionObserver` first. In its first callback for an element, if `entry.isIntersecting` or `entry.boundingClientRect.top < window.innerHeight`, leave the element visible and unobserve it. Otherwise apply the hidden style and wait for it to intersect.
3. Keep both rules in the existing comment: nothing above the fold is ever hidden, and the trigger is the top edge.

### 3.7 Smooth scroll and GSAP only where they help

1. In `src/components/SiteChrome.js`, render `<SmoothScroll>` only when `window.matchMedia('(pointer: fine)').matches` and the path does not start with `/ai-training`, `/checkout` or `/resources`. Use a client-side state set in `useEffect`, so the server HTML does not change.
2. In `src/components/SmoothScroll.js`, import `lenis`, `gsap` and `gsap/ScrollTrigger` with dynamic `import()` inside the effect, so they leave the main bundle.
3. Check: `scrollTo()` (exported from `SmoothScroll.js`) still works without Lenis. It already falls back to `scrollIntoView`.

### 3.8 The 3D hero only on large screens

1. In `src/components/three/HeroCanvas.js`, mount `CloudField` only when `window.matchMedia('(min-width: 768px) and (pointer: fine)').matches`, and only after `requestIdleCallback`.
2. Phones keep the CSS glow that is already in the component.

### 3.9 Smaller fixes

| File | Change |
|---|---|
| `src/components/BrandLogo.js` | Add `sizes="(max-width: 768px) 140px, 180px"` to the `Image`. The logo now downloads at 1,080 px wide. |
| `src/app/layout.js` | Check where JetBrains Mono is used (`font-mono`). If only eyebrows and small labels use it, keep it but load `weight: ['400', '500']` only. |
| `package.json` | Add `"browserslist": ["chrome >= 109", "edge >= 109", "firefox >= 115", "safari >= 15.4"]` to drop about 30 KB of old-browser code. Check that Next 16 reads it, by comparing the build output before and after. |

### 3.10 Done when

1. A new mobile trace of `/ai-training` shows LCP under 2,500 ms, and the homepage stays under 2,500 ms.
2. Meta Events Manager still receives PageView and ViewContent, and GA4 Realtime shows the visit.
3. Clarity still records a session.
4. Add the new figures to a short section 7 in `Website_Performance_Audit_2026-10-14.md`, then rebuild the PDF.

---

## 10. Phase 4. The three-tier product model

**Branch:** `feat/training-tiers` · **Depends on:** phase 1 · **Ships with:** phases 5 and 7 as one release (batch B, branch `feat/training-ladder`).

### 4.1 Tracks in `src/lib/training.js`

Keep the id `individual` for the Programme, because every existing registration uses it. Add two tracks.

```js
export const TRACK_KICKSTART = 'kickstart';
export const TRACK_ESSENTIALS = 'essentials';
export const TRACK_PROGRAMME = TRACK_INDIVIDUAL; // 'individual', unchanged for old records

[TRACK_KICKSTART]: {
  id: TRACK_KICKSTART, tier: 1,
  name: 'AI Kickstart', shortName: 'Kickstart',
  priceKes: 500, strikePriceKes: null,
  registerPath: '/ai-training/register?tier=kickstart', landingPath: '/ai-training/kickstart',
  refLetter: 'K',
  durationLabel: '2 hours · Wednesday 7:00pm–9:00pm EAT',
  venue: 'Online, Google Meet',
  supportsOnline: true, onlineOnly: true, hasCohorts: false, hasSessions: true,
  capacity: 100,
  creditKes: 500, creditDays: 14,
},
[TRACK_ESSENTIALS]: {
  id: TRACK_ESSENTIALS, tier: 2,
  name: 'AI Essentials', shortName: 'Essentials',
  priceKes: 5500, strikePriceKes: null,
  registerPath: '/ai-training/register?tier=essentials', landingPath: '/ai-training/essentials',
  refLetter: 'E',
  durationLabel: '1 Saturday · 9:00am–1:00pm',
  venue: formatAddress(),
  supportsOnline: true, hasCohorts: true, days: ['day-one'],
  creditKes: 5500, creditDays: 60,
},
```

Change the Programme (`individual`) entry: `tier: 3`, `name: 'AI Productivity Programme'`, `shortName: 'Programme'`, `strikePriceKes: null`, `landingPath: '/ai-training/programme'`, `registerPath: '/ai-training/register?tier=programme'`, `days: ['day-one', 'day-two']`. No instalment settings: every class is paid in full.

Add `export const PUBLIC_TIERS = [TRACK_KICKSTART, TRACK_ESSENTIALS, TRACK_PROGRAMME];` and `export const PRIVATE_PRICE_KES = 30000;` and `export const TEAM_PRICE_PER_PERSON_KES = 13500; export const TEAM_MIN_PEOPLE = 10;`.

`tierFromParam(value)` maps `kickstart`, `essentials` and `programme` to the track ids, and returns `TRACK_PROGRAMME` for anything else.

### 4.2 References

1. In `generateReference`, the new letters `K` and `E` come from `refLetter`.
2. Change `CURRENT_RE` (line 342) to `^[AWKE][${REF_ALPHABET}]{5}$`. Old `A` and `W` references still match.
3. Update the comment on line 319: "A7F3K2 (Programme), K7F3K2 (Kickstart), E7F3K2 (Essentials), W7F3K2 (Women Biz360, retired)".
4. Check every other place that tests a reference shape: `grep -rn "\[AW\]" src`.

### 4.3 Kickstart sessions

Add to `src/lib/training.js`:

1. `const KICKSTART_EPOCH = '2026-10-28'` (the first Wednesday) and `KICKSTART_START = '19:00'`, `KICKSTART_END = '21:00'`.
2. `listKickstartSessions({ now = new Date(), count = 4 })` returns the next `count` Wednesdays on or after the epoch, as `{ id: 'ks-2026-10-28', date: '2026-10-28', label: 'Wed 28 Oct 2026', closesAt: '2026-10-28T14:00:00Z' }`. `closesAt` is 5:00 pm EAT on the day (two hours before the start). A session is open while `now < closesAt`.
3. `getKickstartSession(id)` and `isKickstartSessionOpen(id, { now })`.
4. **Paused weeks.** Read `KICKSTART_SKIP_DATES` (comma-separated ISO dates) from the environment, so you can cancel a Wednesday without a code change.

### 4.4 Essentials dates

Essentials uses the existing cohorts. `listOpenCohorts` already gives `dayOne`. For Essentials, the label is `formatDay(dayOne)` only, and `closesAt` is the same as the cohort. Add `describeSchedule` cases:

| Track | Headline | Detail |
|---|---|---|
| Kickstart | "Wed 28 Oct 2026" | "7:00pm–9:00pm EAT · live on Google Meet" |
| Essentials | "Sat 07 Nov 2026" | "9:00am–1:00pm · online or at Delta Annex, Westlands" |
| Programme | unchanged | unchanged |
| Programme, Day Two only (after an Essentials credit, phase 5) | "Sat 14 Nov 2026" | "9:00am–1:00pm · Day Two of the Programme" |

`startDateFor` and `endDateFor` return the session date for Kickstart and `dayOne` for Essentials, so the existing reminder cron works without change.

### 4.5 Registration validation by tier

In `src/lib/registration-form.js`:

1. `validateRegistration(input)` reads `input.tier` through `tierFromParam`. It no longer forces `TRACK_INDIVIDUAL`. Keep the rule that the retired Women Biz360 track can never be chosen.
2. Required fields by tier:

| Field | Kickstart | Essentials | Programme |
|---|---|---|---|
| First name, last name, email, M-Pesa phone, consent | Required | Required | Required |
| Session (`sessionId`) | Required | | |
| Cohort (`cohortId`) | | Required | Required |
| Attendance | Fixed to `online` | Required | Required |
| Buyer type: business owner, employee, registering colleagues, student | | Required | Required |
| Number of people | | Required, 1 to 50 | Required, 1 to 50 |
| "Where does your time go?" (`timeConsumingTasks`) | Optional | Required, at least one | Required, at least one |
| AI experience | Optional | Required | Required |
| The rest of the current questionnaire | Hidden | Hidden | Shown, as today |
| Credit code or M-Pesa code (`creditCode`) | | Optional | Optional |

3. Add `BUYER_TYPES` and `HEADCOUNT_MAX = 50` to the module.
4. In `src/app/api/registrations/route.js`:
   - Kickstart: reject a closed or full session (count paid Kickstart registrations for the session with a GROQ `count()`, compare with `capacity`). Status 409, message "That Wednesday is full or has closed. Please pick another."
   - Essentials and Programme: keep the cohort check.
   - `amount` comes from phase 5 (`priceAfterCredit`). Until phase 5 merges, `amount: chargeFor(value.track)`.
   - "Registering colleagues" or a headcount of 3 or more sets `teamLead: true` on the record and adds "TEAM LEAD" to the admin alert subject.

### 4.6 Sanity schema

In `src/sanity/schemaTypes/trainingRegistration.js`:

1. `track` options: add `{ title: 'AI Kickstart', value: 'kickstart' }` and `{ title: 'AI Essentials', value: 'essentials' }`. Rename the `individual` title to "AI Productivity Programme".
2. Add read-only fields: `sessionId` (string), `buyerType` (string), `headcount` (number), `teamLead` (boolean), `listPrice` (number), `attendsDays` (array of strings), `receipts` (every payment's M-Pesa code or card reference), and the credit fields from phase 5.
3. Add a Studio filter in `src/sanity/structure.js` for each tier, beside the existing roster views.

### 4.7 Emails

In `src/lib/email/templates.js`:

1. `kickerFor(track)` returns "AI KICKSTART", "AI ESSENTIALS" or "AI PRODUCTIVITY PROGRAMME".
2. `scheduleRows` shows the Meet link for online bookings when `KICKSTART_MEET_URL` or `COHORT_MEET_URL` is set, and "Your Google Meet link arrives the day before" when it is not.
3. `welcomePack` for Kickstart is short: open a free Claude account, use a laptop or a phone, bring one real task. Link to `/resources/prompt-pack`.
4. `completionPack` (sent the day after the session by the daily cron) includes the credit message from phase 5 for Kickstart and Essentials.
5. Add a same-day Kickstart reminder: in `src/app/api/cron/daily/route.js`, for Kickstart registrations whose session is today, send `reminder({ daysOut: 0 })` with the Meet link. The cron runs at 9:00 am EAT (`vercel.json`, `0 6 * * *` UTC), which is in time for 7:00 pm.

### 4.8 Done when

1. Three test registrations, one per tier, at `TEST_PAYMENT_AMOUNT_KES=2` on a preview deployment, create records with references starting K, E and A.
2. Each checkout shows the right product, date and price.
3. A closed Kickstart session and a full one are both refused.

---

## 11. Phase 5. Credits: pay for a small class, use it on a bigger one

**Branch:** `feat/training-credits` · **Depends on:** phase 4

### 5.1 The rules

| Rule | Value |
|---|---|
| Who earns a credit | Every **paid** Kickstart or Essentials registration. Earned at payment confirmation. |
| Credit value | Kickstart: KES 500. Essentials: KES 5,500. The list price of the class bought, so the total paid across the ladder is never more than KES 13,500. |
| What it can be used on | Kickstart credit: Essentials or the Programme. Essentials credit: the Programme only. |
| Valid until | 23:59 EAT on the class date plus 14 days (Kickstart) or plus 60 days (Essentials). The booking must be **paid** by then. The class itself can be later. |
| How many per booking | One. Credits do not stack. If a person holds two, the larger valid one is applied. |
| Who can use it | The person who paid. Matched by phone number (normalised `2547XXXXXXXX`) or by email, plus the code when the code is used. |
| Payment evidence kept | The M-Pesa receipt code (or the Paystack reference) of the payment that earned the credit, the source booking reference, the amount and the date. |
| Payment | The amount after the credit is paid in full when booking. |
| Expired, used or transferred | Not refundable and not transferable to another person. A seat transfer (rev4 §4) moves the booking, not the credit. |
| Essentials buyer upgrading | Pays KES 8,000 and attends Day Two only. The form offers the Day Two Saturday of their own cohort, and any later Day Two that falls within the 60 days. |

### 5.2 Sanity type `trainingCredit`

Create `src/sanity/schemaTypes/trainingCredit.js` and register it in `src/sanity/schemaTypes/index.js` and `src/sanity/structure.js` (under Training, "Credits").

| Field | Type | Notes |
|---|---|---|
| `code` | string | `CR-` plus 6 characters from `REF_ALPHABET`, for example `CR-7F3K2M`. Unique. Read-only after creation. |
| `status` | string | `available`, `reserved`, `redeemed`, `expired`, `void` |
| `amountKes` | number | 500 or 5500 |
| `appliesTo` | array of string | `['essentials', 'individual']` or `['individual']` |
| `phone` | string | Normalised |
| `email` | string | Lowercased |
| `name` | string | For the Studio list |
| `sourceReference` | string | The booking that earned it, or empty for a manual credit |
| `sourceReceipt` | string | M-Pesa receipt code or Paystack reference, uppercased |
| `sourceMethod` | string | `mpesa-stk`, `mpesa-c2b`, `card`, `manual` |
| `classDate` | date | The Kickstart or Essentials date |
| `expiresAt` | datetime | See the rules |
| `reservedBy` | string | Booking reference holding it |
| `reservedAt` | datetime | |
| `redeemedBy` | string | Booking reference that paid with it |
| `redeemedAt` | datetime | |
| `note` | text | Editable. Why a manual credit was issued. |

**Document id:** `credit.<code>`. Automatic credits are read-only in the Studio. An admin can **create** a manual credit (for a payment made outside the website, for example on WhatsApp), with `sourceMethod: 'manual'`, a required `sourceReceipt` and a required `note`. Validation: amount must be 500 or 5500, and expiry must be in the future.

### 5.3 `src/lib/credits.js` (server-only)

| Function | What it does |
|---|---|
| `issueCreditFor(registration)` | Called from `onPaymentConfirmed`. Only for Kickstart and Essentials. Exactly once, through `claimOnce('credit-issue.<ref>')`. Creates the document with the values in 5.1, `sourceReceipt: registration.paymentReceipt`. Returns the credit. |
| `findCredit({ code, phone, email, track, now })` | If `code` is given: normalise it (uppercase, strip spaces). Match either `credit.code == code` or `credit.sourceReceipt == code` (so the M-Pesa code from the SMS works). The credit's phone or email must match the form's phone or email; if not, return `null`. If no code: find the best `available`, unexpired credit whose phone or email matches and whose `appliesTo` contains `track`. |
| `reserveCredit(credit, reference)` | `claimOnce('credit-reserve.<code>')`, then patch `status: 'reserved'`, `reservedBy`, `reservedAt`. If the claim fails, the credit is in use: return `null`. |
| `redeemCredit(reference)` | Called from `confirmPayment`. Patches the reserved credit to `redeemed`, `redeemedBy`, `redeemedAt`. |
| `releaseCredit(reference)` | Patches back to `available`, releases the `credit-reserve` claim. Used when a booking is abandoned. |
| `expireCredits(now)` | Sets `expired` on every `available` credit past `expiresAt`. |
| `priceAfterCredit({ track, credit })` | `max(chargeFor(track) - credit.amountKes, 1)`. In test mode (`TEST_PAYMENT_AMOUNT_KES` set), returns the test amount. |

All lookups use GROQ through `writeClient` with parameters, never string building.

### 5.4 Applying a credit at registration

In `src/app/api/registrations/route.js`, after validation:

1. Call `findCredit({ code: value.creditCode, phone, email, track })`.
2. If the buyer typed a code and nothing matched, return 400 with `errors.creditCode: 'We could not find a credit for that code with this phone number or email. Check the code, or leave it empty.'`
3. If a credit is found, reserve it. Store on the registration: `listPrice: priceFor(track)`, `creditApplied: { code, amountKes, sourceReference, sourceReceipt }`, and `amount: priceAfterCredit(...)`.
4. If the credit is an Essentials credit and the track is the Programme:
   - set `attendsDays: ['day-two']`;
   - accept only an open cohort whose `dayTwo` is on or before the credit's `expiresAt` date (the form lists only those, see 5.1);
   - set `startDate` to that cohort's `dayTwo`, so the reminder emails go out before Day Two and not before Day One;
   - `cohortLabel` reads "Day Two: Sat 14 Nov 2026".
5. If no credit is found and no code was typed, continue at full price.

The response adds `creditApplied` so the checkout can show it.

### 5.5 Showing the credit before submitting

1. Add `POST /api/credits/check` (`src/app/api/credits/check/route.js`). Body: `{ code, phone, email, tier }`. It returns `{ ok: true, amountKes, expiresAt, payKes }` or `{ ok: false }`. It needs the code; it never confirms a credit from a phone number alone, so nobody can learn what another person bought.
2. Limit it to 10 requests per IP per 10 minutes with a `claimOnce`-style counter document (`ratelimit.credits.<ip>.<10-minute window>`), or return 429.
3. In `RegistrationForm.js`, add a field under the price: "Already paid for a Kickstart or Essentials? Enter your credit code or the M-Pesa code from your SMS." with an **Apply** button that calls the endpoint and shows "Ksh 500 credit applied. You pay Ksh 5,000." The server applies it again on submit, so the browser result is only a preview.
4. Without a code, the server still applies a matching credit by phone or email (5.4), and the checkout page states it: "Your Ksh 500 Kickstart credit is applied."

### 5.6 Redeem, release, expire

1. In `confirmPayment` (`src/lib/lifecycle.js`), after patching `status: 'paid'`, call `redeemCredit(reference)` when `registration.creditApplied` exists.
2. In `onPaymentConfirmed`, call `issueCreditFor(registration)` for Kickstart and Essentials.
3. In `src/app/api/cron/daily/route.js`:
   - release the credit of any booking still `pending` 48 hours after creation, or whose class date has passed (`releaseCredit`);
   - run `expireCredits(now)`;
   - send a reminder email 3 days before a credit expires ("Your Ksh 5,500 credit ends on …"), keyed `credit-expiring.<code>` through `sendOnce`.

### 5.7 Telling the buyer

1. The `completionPack` email the morning after a Kickstart or Essentials session carries: the code, the amount, what it applies to, the expiry date and a direct link `/ai-training/register?tier=essentials&credit=CR-7F3K2M` (or `tier=programme`). The form pre-fills the code from `credit` in the URL.
2. The admin alert for a paid Kickstart or Essentials booking includes a ready WhatsApp link (`whatsappLink` in `src/lib/constants.js`) to the buyer, prefilled with: "Thank you for joining the AI Kickstart. Your Ksh 500 credit code is CR-7F3K2M. It counts toward AI Essentials or the full Programme until 11 November 2026: https://www.cloudwise.co.ke/ai-training/register?tier=essentials&credit=CR-7F3K2M". The site has no WhatsApp sending API, so a person sends it with one tap.

### 5.8 Meta and GA4 values

The Purchase value is the amount actually paid on this booking (`registration.amount`), so that revenue is never counted twice across the ladder. Add `credit_applied: true|false` and `tier` to `custom_data` in `metaCustomData` (`src/lib/lifecycle.js`).

### 5.9 Done when

On a preview deployment with `TEST_PAYMENT_AMOUNT_KES` unset and the sandbox Daraja keys:

1. Pay a Kickstart booking. A credit `CR-…` appears in the Studio with the M-Pesa receipt.
2. Register for Essentials with the same phone and no code: the checkout shows Ksh 5,000.
3. Register again with the M-Pesa receipt code typed in the credit field and a different phone: refused.
4. Abandon a booking with a credit: after the cron runs (call `/api/cron/daily` with the cron secret), the credit is `available` again.
5. Pay the Essentials booking: its own Ksh 5,500 credit appears, and the Kickstart credit shows `redeemed`.
6. Register for the Programme with the Essentials credit: Ksh 8,000, Day Two only.

---

## 12. Phase 6. Removed: no deposits or instalments

**Decided 15 October 2026.** Every class is paid in full when it is booked: Ksh 500, Ksh 5,500 or Ksh 13,500, less any credit. There is no deposit, no balance, no `deposit-paid` status and no balance reminder. The existing part-payment handling in `src/app/api/payments/paybill/c2b/route.js` stays as it was: a short paybill payment is recorded and flagged to the admins, and it never confirms a seat.

What phase 6 had added that is still useful moved elsewhere:

- every payment's M-Pesa code or card reference is kept in a `receipts` list on the booking (phase 5, payment evidence);
- each payment is counted once per receipt, so the STK callback and the paybill confirmation for the same M-Pesa code cannot confirm a booking twice (`confirmPayment` in `src/lib/lifecycle.js`).

---

## 13. Phase 7. The new and rewritten training pages

**Branch:** `feat/training-pages` · **Depends on:** phases 1 and 4 · **Copy:** from tiered plan revision 4, section 7, with KES 5,500 for Essentials.

Every page in this phase: dark theme, existing components, `export const revalidate = 3600`, its own `metadata` with `title`, `description`, `alternates.canonical`, `openGraph` (with `images`, `type: 'website'`, `siteName: 'Cloudwise'`) and `twitter` (with `images`). Prices, dates and the address come from `src/lib/training.js` and `src/lib/constants.js`.

### 7.1 Shared components (new)

| Component | File | Purpose |
|---|---|---|
| `TierCard` | `src/components/training/TierCard.js` | Name, price, length, format, "You leave with", includes, credit line, button. Highlight variant for the Programme ("Most complete"). |
| `TierLadder` | `src/components/training/TierLadder.js` | The three cards from `PUBLIC_TIERS`, and the credit strip under them. |
| `ComparisonTable` | `src/components/training/ComparisonTable.js` | The rev4 §4 table as a responsive table: stacked rows on phones. |
| `NextDates` | `src/components/training/NextDates.js` | The next dates for a tier, with "Registration closes …" for the first one, later dates in smaller text (Meta Ads review, phase 4). |
| `StickyBookBar` | `src/components/training/StickyBookBar.js` | Phone only (`md:hidden`). Appears when the hero leaves the screen (IntersectionObserver). Shows "From Ksh 500 · Book" on the hub and the tier price on tier pages. Leaves 80 px on the right for the WhatsApp bubble. |
| `TrainerCard` | `src/components/training/TrainerCard.js` | See step 11.1. |
| `jsonld.js` | `src/lib/seo/jsonld.js` | `organizationJsonLd()`, `courseJsonLd({ tiers, cohorts, sessions })`, `breadcrumbJsonLd(items)`, `serviceJsonLd(service)`. Used by every page (step 9.6). |

### 7.2 `/ai-training`: the hub

File: `src/app/ai-training/page.js` (rewrite).

| Block | Content |
|---|---|
| Metadata | Title: "AI Training in Nairobi, Kenya: Courses from Ksh 500" (52 characters). Description: "Hands-on AI training on Claude in Nairobi and online. A 2-hour Kickstart for Ksh 500, a 4-hour Essentials for Ksh 5,500, or the full 8-hour Programme." |
| Hero | Eyebrow "AI Productivity Training · Nairobi and online". **H1: "AI training in Nairobi: build your own AI assistant."** The rev4 sub-line. A one-line chip **above the buttons**: "Next: Kickstart Wed 28 Oct · Ksh 500 · Essentials Sat 7 Nov". Buttons: "Book the Ksh 500 session" (to `/ai-training/kickstart`) and "Compare the options" (to `#options`). Mobile top padding `pt-28` instead of `pt-36`. The `Gauge` at `opacity-20` on phones. |
| Summary passage | A 130 to 170 word block "What is the Cloudwise AI Productivity Training?": who runs it (Cloudwise Limited, Nairobi), where (Delta Annex, Westlands, and Google Meet), the three options with price and length, that it is taught on Claude on free accounts, that each participant builds their own assistant, the certificate, no recordings, the WhatsApp community. Plain sentences that an AI assistant can quote. |
| `#options` | `TierLadder`, then `ComparisonTable`. |
| Credit strip | "Start small. What you pay for Kickstart or Essentials counts toward the next course. Kickstart credit lasts 14 days; Essentials credit lasts 60 days." |
| What you build | The assistant: a short explanation and the ten assistants table from rev4 §5.2, as a compact grid. |
| Tools | The `TOOLS` array from step 1.3. Heading: "What we teach, and on which tools". |
| Private and team block | rev4 §7 copy, with buttons "See team and private training" (to `/ai-training/teams`) and "Book a 30-minute call" (WhatsApp link with a prefilled message). |
| Trainer | `TrainerCard` (step 11.1). |
| Proof | `Testimonials` with the trained-organisations line. |
| FAQ | Combined FAQ from rev4 §7: which option, what is "your own AI assistant", does the Ksh 500 count, how to pay (in full by M-Pesa), recordings (no), certificate, missed date, plus "Is this a ChatGPT course?" ("It is taught on Claude, and ChatGPT, Gemini and Copilot are run against the same task so you see the differences."). Each question in an `<h3>` (step 9.8). |
| Final call to action | "Not sure? Start with the Ksh 500 Kickstart." Buttons to Kickstart and WhatsApp. |
| Sticky bar | `StickyBookBar`. |

Remove the old `VALUE_STACK`, `DAY_ONE`, `DAY_TWO`, `RESOURCES` arrays from this page (their content moves to the Programme page).

### 7.3 `/ai-training/kickstart` (new)

File: `src/app/ai-training/kickstart/page.js`. Copy from rev4 §7 "Copy: Kickstart page". `NextDates` with four Wednesdays from `listKickstartSessions`. Who it suits. The 2-hour running order from rev4 §5.1 as a simple list (times and what the attendee does). One button: "Book for Ksh 500 (M-Pesa)" to `/ai-training/register?tier=kickstart`, with the line under it. `PixelEvent` ViewContent with value 500. Breadcrumb Home › AI Training › Kickstart.

### 7.4 `/ai-training/essentials` (new)

File: `src/app/ai-training/essentials/page.js`. Copy from rev4 §7 "Copy: Essentials page" (KES 5,500, Westlands address). The Day One running order from rev4 §5.2 as a table. The ten assistants. Next dates from the cohorts' first Saturdays. Button "Reserve my seat · Ksh 5,500". Credit note: "Your Ksh 5,500 counts toward the full Programme for 60 days." Kickstart credit note: "Did the Kickstart? Your Ksh 500 counts here for 14 days."

### 7.5 `/ai-training/programme` (new)

File: `src/app/ai-training/programme/page.js`. The current page content, rewritten from rev4 §5.2 and §5.3: Day One and Day Two session tables, "Three things happen even if everything else is cut", inclusions from rev4 §2 (no "Worth" labels), price block "Ksh 13,500 per person, paid in full when you book" with "Private one-to-one: Ksh 30,000" beside it, the line "Not sure yet? Try the Ksh 500 Kickstart first. It counts toward this price.", and the policy box (certificate, no recordings, transfer, no refunds, Google Meet link the day before). Closing button "Join the Programme · Ksh 13,500".

### 7.6 `/ai-training/teams` (new)

File: `src/app/ai-training/teams/page.js`.

| Block | Content |
|---|---|
| Metadata | Title: "Corporate AI Training in Kenya for Teams · Cloudwise" |
| H1 | "AI training for your team, built on your own work." |
| Formats table | rev4 §6 team table: free demonstration, team programme (KES 13,500 per person, minimum 10), executive briefing (quoted), Microsoft 365 and Copilot version (quoted). |
| Private one-to-one | KES 30,000, 8 hours, two-hour or four-hour sittings, what it can add (Claude Design and HeyGen hands-on, Skills, a full proposal on a letterhead, a one-page website). |
| Every team booking includes | Discovery call, syllabus for approval, the day, the support group, a follow-up clinic 3 to 4 weeks later, an AI use policy template. |
| Data protection | Three sentences: what never goes into a public AI tool, the Kenya Data Protection Act, 2019, the policy template. |
| NGOs | "An NGO version is available on request." No NGO case claim. |
| Organisations trained | Bamburi Cement, FEKAN Howell LLP, TechCamp, Stratostaff. |
| Enquiry form | Name, organisation, role, email, phone, team size, format, preferred month, message. Posts to `POST /api/team-enquiries` (new, `src/app/api/team-enquiries/route.js`), which validates, stores a `teamEnquiry` Sanity document (new schema `src/sanity/schemaTypes/teamEnquiry.js`), emails the admins, and sends server Lead with `content_category: 'Team training'`. |
| Buttons | "Book a 30-minute call" (WhatsApp) and "Download the team proposal". **Decision:** supply the proposal PDF. Default: the download button is hidden until `public/downloads/cloudwise-team-ai-training.pdf` exists. |

### 7.7 Registration form by tier

1. `src/app/ai-training/register/page.js` reads `searchParams.tier` and `searchParams.credit`, and passes `track`, `sessions` or `cohorts`, `price` and `creditCode` to the form. The side panel shows the tier, its price, its dates and the credit note. Title by tier, for example "Book AI Kickstart · Ksh 500".
2. `src/components/training/RegistrationForm.js` shows the fields from the table in step 4.5. Kickstart has one short section. The step labels read "Step 1 of 2" as now.
3. The "where does your time go" answer maps to the assistant name on the confirmation screen and in the welcome email (table in rev4 §5.2).
4. `metadata.robots: { index: false, follow: true }` (step 9.3).

### 7.8 Thank-you state

The paid state in `Checkout.js` and `PaystackReturn.js` becomes the thank-you screen for every tier: what happens next, the Meet link or the venue, an **Add to calendar** link (a generated `.ics` from a new route `src/app/api/registrations/[ref]/ics/route.js` using `describeSchedule`), and the WhatsApp community or broadcast-list line by tier. Purchase fires here (step 2.2). A separate `/ai-training/thank-you` URL is not needed, because the checkout already has a paid state and Purchase fires from it.

### 7.9 `/resources/ai-tools-kenya` (new)

File: `src/app/resources/ai-tools-kenya/page.js`, content added to `src/lib/resources.js`. Built from the "AI Toolkit and Resource Pack" handout. **Decision:** send the handout file. Default: build the page from the tools in step 1.3 only, with a Kickstart banner after every second section. Add it to `RESOURCE_INDEX`.

### 7.10 Navigation

In `src/lib/constants.js` `NAVIGATION_LINKS`, the AI Training children become:

```js
children: [
  { name: 'Kickstart (Ksh 500)', href: '/ai-training/kickstart', description: '2 hours online, Wednesdays 7pm' },
  { name: 'Courses and pricing', href: '/ai-training', description: 'Kickstart, Essentials and the full Programme' },
  { name: 'Private and team training', href: '/ai-training/teams', description: 'One-to-one, or 10 people or more' },
  { name: 'Free resources', href: '/resources', description: 'Prompt pack, readiness guide and checklist' },
],
```

### 7.11 Homepage training band and hero

1. `src/components/home/TrainingBand.js`: price line "From Ksh 500. The full Programme is Ksh 13,500." Button "See courses and prices".
2. `src/app/page.js` hero secondary button: "AI training from Ksh 500" (visual audit).

### 7.12 Sitemap

Add `/ai-training/kickstart`, `/ai-training/essentials`, `/ai-training/programme`, `/ai-training/teams` and `/resources/ai-tools-kenya` to `src/app/sitemap.js`.

### 7.13 Done when

1. All new pages render on a phone at 375 px with no horizontal scroll.
2. The first phone screen of the hub shows the next date and the Ksh 500 price.
3. Each tier books end to end at the test price on a preview.
4. Rich Results Test and validator.schema.org accept the Course and breadcrumb markup on each page.

---

## 14. Phase 8. Payments: paybill fallback, cards and the bank sweep

**Branch:** `feat/payment-rails` (only for 8.4 and 8.5; 8.1 to 8.3 are switch changes) · **Depends on:** Phase 0 steps 0.3 and 0.4

### 8.1 Paybill (C2B) fallback, after Safaricom confirms

The code is complete: `src/app/api/payments/paybill/c2b/route.js`, `validation/route.js`, `reconcile/route.js`, and `paybillInstructions` in `src/lib/payments/daraja.js`. When it is on, the checkout shows the paybill 4131947 and the account number (the booking reference) the whole time, so a buyer whose STK prompt does not arrive can pay from the M-Pesa menu.

1. In Vercel, remove `PAYBILL_FALLBACK_ENABLED` for Production. Redeploy.
2. Test with real money: register at full price, do **not** use the prompt, pay **Ksh 1** to paybill 4131947 with the reference as the account number. The booking must show a part payment and the admins must get the "Part payment" email. Then pay the remaining amount. The booking still does not confirm, because a seat needs the full amount in one payment: record the balance by hand with the reconcile route (`docs/VERCEL_DEPLOY_AND_ENV.md`, "If a payment does get stranded") and pass the full amount to accept it.
3. Record the result in `docs/VERCEL_DEPLOY_AND_ENV.md` "What is set up right now".

### 8.2 Card payments, after Paystack approves

1. Set `PAYSTACK_SECRET_KEY` (`sk_live_…`) and `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` (`pk_live_…`) for Production.
2. Set the Paystack webhook to `https://www.cloudwise.co.ke/api/payments/paystack/webhook`.
3. Remove `CARD_PAYMENTS_ENABLED`. Redeploy.
4. Test with a real card on a Kickstart booking (Ksh 500). Check: booking `paid`, payment record provider `paystack`, settlement state "Not applicable", Purchase in Events Manager, `purchase` in GA4, and a credit issued (phase 5).
5. Update `docs/VERCEL_DEPLOY_AND_ENV.md`.

### 8.3 Sweep to the Equity account, after Safaricom enables B2B

1. Set, for Production: `MPESA_INITIATOR_NAME`, `MPESA_INITIATOR_PASSWORD`, `SETTLEMENT_ENABLED=true`, `SETTLEMENT_ADAPTER=daraja-b2b`, `SETTLEMENT_BANK_NAME=Equity Bank`, `SETTLEMENT_BANK_PAYBILL=247247`, `SETTLEMENT_ACCOUNT_NUMBER` (**check it twice**), `SETTLEMENT_MODE=full`, `SETTLEMENT_MIN_AMOUNT=0`, `SETTLEMENT_FLOAT_BUFFER=0`. These are in `docs/PAYMENTS_SETUP.md` §8.A.3.
2. Check the certificate date with the command in §8.A.2.
3. Redeploy. Pay a Kickstart booking by M-Pesa. In `/studio` → Training → Payments, the settlement state must go `queued`, `settling`, `settled` within two minutes, and the money must reach the Equity account.

### 8.4 Sweep on a schedule, as an option

Today the sweep runs **after each payment**, and the daily cron retries failures. You asked for periodic sweeping as well. Add a setting:

| `SETTLEMENT_SCHEDULE` | Behaviour |
|---|---|
| `immediate` (default) | As today: each confirmed M-Pesa payment is swept straight away. |
| `daily` | Nothing is swept at payment time. At 9:00 am EAT, the daily cron sweeps every completed, unsettled M-Pesa payment from the last 7 days in **one** B2B transfer. |

Build:

1. In `src/lib/settlement/index.js`, `settlementConfig()` reads `SETTLEMENT_SCHEDULE`. `maybeSettle` returns `{ settled: false, reason: 'scheduled' }` when the schedule is `daily` and `force` is false.
2. New function `settleBatch({ now })`: lists completed, unsettled M-Pesa payments (`listUnsettledPayments` in `src/lib/store.js`, with a larger limit); claims each one with `claimOnce('settle.<paymentId>')`; sums the amounts; applies `sweepAmountFor` to the total; sends one B2B with the account reference `BATCH-<yyyymmdd>`; creates a `settlementBatch` document (new schema `src/sanity/schemaTypes/settlementBatch.js`: date, payment ids, total, state, settlementRef, message); marks each payment `settling` with `settlementRef`.
3. `recordSettlementResult` (the B2B result callback) finds the batch by `settlementRef`, then marks the batch and every payment in it `settled` or `failed`. A failed batch releases every claim so that the next day retries.
4. In `src/app/api/cron/daily/route.js`, call `settleBatch()` when the schedule is `daily`.
5. Document the setting in `docs/PAYMENTS_SETUP.md` §8.A.4.

**Recommendation:** keep `immediate`. Use `daily` if Safaricom's B2B charge per transfer is a fixed fee that one transfer a day would save.

### 8.5 Payment evidence in one place

1. Add a Studio view "Payments by receipt" in `src/sanity/structure.js`, searchable by the M-Pesa receipt code.
2. The admin CSV export (`src/app/api/registrations/export/route.js` and `src/lib/email/roster-csv.js`) adds columns: tier, list price, credit code, credit amount, amount paid, receipts, payment plan.

---

## 15. Phase 9. Technical SEO and structured data

**Branch:** `feat/technical-seo` · **Depends on:** phase 1 (address); 9.6 uses the tiers from phase 4

### 9.1 Share images

1. Create `public/og/ai-training.png` (1200 × 630): the dark background, the ember accent, "AI training in Nairobi · from Ksh 500", the logo. Same style for `kickstart.png`, `essentials.png`, `programme.png`, `teams.png`, `resources.png`.
2. Add `images: [{ url: '/og/<name>.png', width: 1200, height: 630, alt: '…' }]`, `type: 'website'` and `siteName: 'Cloudwise'` to each page's `openGraph`, and `images` to `twitter`. Files: every training page, `src/app/ai-training/register/page.js`, `src/app/resources/page.js`.

### 9.2 Security headers

In `next.config.mjs`, add `poweredByHeader: false` and:

```js
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
    ],
  }];
},
```

`/studio` embeds itself, so `frame-ancestors 'self'` is correct. Check that the Studio, Paystack checkout and the contact-page map still work.

### 9.3 Take the register page out of the index

1. `src/app/ai-training/register/page.js`: `robots: { index: false, follow: true }`.
2. Remove `/ai-training/register` from `src/app/sitemap.js`.

### 9.4 Sitemap

In `src/app/sitemap.js`:

1. Replace `new Date()` for static routes with a fixed map of real dates, kept beside the routes (for example `{ path: '/ai-training', lastModified: '2026-10-21' }`). Update it when a page changes.
2. Category pages: use the newest post's `_updatedAt` in that category; drop categories with no published post (`categorySlugsQuery` in `src/sanity/lib/queries.js`).
3. Exclude posts with `seo.noindex == true` in `sitemapPostsQuery`.
4. Replace the empty `catch` with `console.error` and a re-throw, so Next keeps the last good sitemap.
5. Remove `priority` and `changeFrequency`.
6. Fetch with `useCdn: false` for the sitemap query (`src/sanity/lib/client.js` or a dedicated client), so new posts appear within the hour.

### 9.5 Robots, llms.txt and Content-Signal

1. `src/app/robots.js`: remove `host`.
2. Create `public/llms.txt`:
   - H1 "Cloudwise Limited";
   - a summary line: "Cloudwise Limited is an ICT company at Delta Annex, Westlands, Nairobi, Kenya. It builds software and AI agents and runs hands-on AI training. It is not cloudwise.africa and not Cloudwise Academy.";
   - links with one line each: `/ai-training`, `/ai-training/kickstart`, `/ai-training/essentials`, `/ai-training/programme`, `/ai-training/teams`, `/resources/prompt-pack`, `/contact`.
3. Content-Signal: **not now**. Google does not act on it, and Next's robots helper cannot emit it.

### 9.6 Structured data

Put every builder in `src/lib/seo/jsonld.js`, and use the ready JSON in `docs/audits/2026-10-14/schema.md` §4 as the template.

| Where | Markup |
|---|---|
| `src/app/layout.js` | Replace `orgJsonLd` with `["Organization","ProfessionalService"]`, `@id: https://www.cloudwise.co.ke/#organization`, Westlands address from `COMPANY_INFO`, `geo` **-1.2661, 36.8014** (the Google Business Profile pin, local audit), `areaServed: Kenya`, `contactPoint`, `knowsAbout: ['AI training', 'AI agents', 'software development', 'web development']`, a `description` that separates Cloudwise Limited from the other Cloudwise companies, `sameAs` with the corrected LinkedIn URL. Add `openingHoursSpecification` only after you supply the hours. |
| `src/app/page.js` | `WebSite` with `publisher` → the organisation `@id`. |
| Hub and tier pages | `Course` from `courseJsonLd`: `@id`, `url`, `inLanguage: 'en'`, `provider` → the organisation `@id`, **one `Offer` per tier the page shows** (500, 5500, 13500 on the hub; one on each tier page), `hasCourseInstance` for each open date with `courseSchedule` (`duration`, `scheduleTimezone: 'Africa/Nairobi'`), `location` as a `Place` with a `PostalAddress` plus a `VirtualLocation`, and `offers` on each instance. Add `instructor` (a `Person`) after step 11.1. |
| Every page except home | `BreadcrumbList` from `breadcrumbJsonLd`. |
| `src/app/services/[slug]/page.js` and `src/app/services/page.js` | `Service` per slug, `ItemList` on the index. |
| `src/app/about/page.js`, `src/app/contact/page.js` | `AboutPage`, `ContactPage`. |
| `src/app/blog/[slug]/page.js` | `headline: post.title.trim()`, author `url`, `publisher` → organisation `@id`, `inLanguage`. |
| `FAQPage` on the hub | Keep. Do not add it to any other page. Google retired FAQ rich results on 7 May 2026. |

Check: Rich Results Test on `/`, `/ai-training`, `/ai-training/kickstart`, one service page and one post.

### 9.7 Titles

1. `src/app/about/page.js` and `src/app/contact/page.js`: remove the repeated brand. The template already adds "· Cloudwise". Contact: "Contact us: Delta Annex, Westlands, Nairobi".
2. Hub and tier titles: as in phase 7.

### 9.8 FAQ questions as headings

In `src/components/Faq.js`, wrap each question `<button>` in an `<h3 className="m-0">`, keeping the button inside it. The look does not change.

### 9.9 Blog fixes

1. **Built as a case-insensitive lookup, not a fixed redirect.** In `src/app/blog/[slug]/page.js`, when no post matches the slug exactly, find one whose slug matches ignoring case and redirect permanently to it. A fixed redirect would have sent the live post to a 404 until the Studio slug changes; this works before and after you lowercase the slug (step 0.6).
2. `src/app/blog/category/[slug]/page.js`: when the category slug is `ai-training`, show an intro paragraph and a card linking to `/ai-training`. Google already shows this category page for "ai training".

### 9.10 IndexNow

1. Create `public/<key>.txt` holding the key. Built: `public/ff72f301a6c43d6de3f3a67313ad2640.txt`, read by `src/lib/indexnow.js` (an `INDEXNOW_KEY` variable can replace it). Pings are sent only from the production deployment.
2. In `src/app/api/revalidate/route.js`, after a Sanity publish, POST the changed URL to `https://api.indexnow.org/indexnow`.
3. In `src/app/api/cron/daily/route.js`, POST the training URLs once a day if their dates changed.

---

## 16. Phase 10. Local SEO and the contact page

**Branch:** `feat/local-seo` · **Depends on:** phase 1

### 10.1 The map

`src/app/contact/page.js:79` embeds a map centred on the CBD, about 3 km from the office, titled "Cloudwise Technologies".

1. In Google Maps, open the Cloudwise Google Business Profile, **Share** → **Embed a map**, and copy the `src` URL. Use it for the iframe.
2. Set the iframe `title` to "Cloudwise Limited, Delta Annex, Westlands, Nairobi", and add `loading="lazy"`.
3. Change the "Visit us" link (`:35`) from the text search to the profile's directions link: `https://www.google.com/maps/dir/?api=1&destination=-1.2661,36.8014`.

### 10.2 Contact page detail

Add to `src/app/contact/page.js`, below the cards: opening hours (after you supply them), "Delta Annex is next to Delta Corner Towers on Waiyaki Way, Westlands", parking (**Decision:** visitor parking details; default: leave out), and "Training days: the 4th floor training room".

### 10.3 Email as well as WhatsApp

`src/app/contact/page.js:14-18` sends the form only to WhatsApp. Add a second button "Send by email" that posts to `POST /api/contact` (new, `src/app/api/contact/route.js`), which validates and sends to `hello@cloudwise.co.ke` with the existing `src/lib/email/send.js`.

### 10.4 Reviews link

Add a "Read our Google reviews" link (the profile's review URL) on `/contact`, in the footer (`src/components/Footer.js`) and in the trust block of the hub. Store the URL in `COMPANY_INFO.googleReviewsUrl`.

### 10.5 One phone and email source

Replace the hard-coded copies with `COMPANY_INFO`: `src/components/SiteChrome.js:31` (`WhatsAppButton phoneNumber`), `src/components/ContactForm.js:27`, `src/app/contact/layout.js:4`, `src/lib/email/send.js:17-18` (keep env overrides).

---

## 17. Phase 11. Content, trust and the Prompt Pack

**Branch:** `feat/content-trust` · **Depends on:** phase 7 for 11.1

### 11.1 Named trainer

1. `src/components/training/TrainerCard.js`: photo (`public/team/paul.jpg`) or an initials monogram, name, title, two lines of evidence you supply, LinkedIn link, and "Trained Bamburi Cement, FEKAN Howell LLP, TechCamp and Stratostaff teams".
2. Use it on the hub, Essentials and Programme pages, and add `instructor` to the Course JSON-LD.

### 11.2 The Prompt Pack as a door to the Kickstart

`/resources/prompt-pack` ranks at 8.8 for "how to prompt someone" (55 impressions, 0 clicks).

1. In `src/app/resources/[slug]/page.js`, for `prompt-pack`: metadata title "How to Prompt AI: The Four-Part Method and 10 Prompts"; description that answers "how to prompt".
2. Add a 150-word introduction "How to prompt an AI assistant" that explains the four-part method (already in `PROMPT_FRAMEWORK`, `src/lib/resources.js`) in plain words, before the prompts.
3. Add a byline ("By Paul Theceri, Cloudwise") and "Updated 21 October 2026".
4. Add a Kickstart banner after the framework and after the prompts: "Want to practise this live? AI Kickstart, Wednesday 7pm, Ksh 500."
5. Add a link to `/ai-training` in the body.

### 11.3 About page

1. `src/app/about/page.js:20-23`: replace `placeholder1-4.jpg` with real photos, or with initials monograms until the photos exist. Use the roles you confirm in step 1.7.
2. Add a short paragraph about the training work, linking to `/ai-training`.

### 11.4 Services

1. `src/lib/servicedata.js`: remove "leverage", "revolutionize", "seamless" and similar words. Keep each description to what Cloudwise does, in plain words.
2. `src/app/services/[slug]/page.js:118`: the call to action reads "Talk to us about {service title}" instead of "Let's build with ai agent development."
3. Add AI training to the services index as a card linking to `/ai-training`.

### 11.5 Blog author

In the Sanity author record for Gavin: full name, role, short bio, photo, LinkedIn (**you or Gavin supply these**). Show the role under the name on posts (`src/app/blog/[slug]/page.js:114-118`).

---

## 18. Phase 12. Mobile layout fixes

**Branch:** `fix/mobile-layout` · Inside the current design.

| Fix | File | Change |
|---|---|---|
| WhatsApp bubble covers content | `src/components/WhatsAppButton.js` | 48 px on phones, 16 px from the edge, and lifted above the `StickyBookBar` when it shows (a CSS variable set by the bar). |
| Gauge crosses the intro text | hub hero | `opacity-20` below `md`, moved up and right (done in 7.2). |
| Hero buttons of different widths | hub hero | `w-full sm:w-auto` on both. |
| Low-contrast price text | price blocks | `text-white/65` minimum for any price or date. |
| Eyebrow size | `src/app/globals.css:89` `.eyebrow` | `font-size: 0.75rem` below `md`. |
| Long sections on phones | training pages | `py-16 md:py-32` instead of `py-24 md:py-32`. |
| Footer tap targets 17-20 px | `src/components/Footer.js` | `py-2.5 inline-block` on each link. |
| Mobile menu child links 40 px | `src/components/Navbar.js` (or `Header.js`) | `min-h-12` on each child link. |
| Home small links | `src/app/page.js` | `py-3` on "View all services" and "Explore our portfolio". |
| Hero animation behind text | `src/components/three/CloudField.jsx` | Lower opacity under the paragraph on phones (phones get no canvas after 3.8, so this applies to tablets). |

Check every page at 375 px, 768 px and 1280 px.

---

## 19. Phase 13. Follow-up systems: HubSpot, certificates, reviews

**Branch:** `feat/followup-systems` · **Depends on:** phases 4 and 5

### 13.1 HubSpot pipeline

**Your action first:** create a HubSpot pipeline "AI training ladder" with stages "Booked", "Kickstart paid", "Essentials paid" and "Programme paid", and a "Team training" pipeline with a first stage "New". The site cannot know who attended, so there is no "attended" stage. Copy the ids into the variables listed in `docs/VERCEL_DEPLOY_AND_ENV.md`. Create a private app with the CRM scopes for contacts and deals, and add `HUBSPOT_PRIVATE_APP_TOKEN` to Vercel.

Build `src/lib/hubspot.js` (server-only, fails soft): on registration created, upsert the contact by email and create a deal in the right stage with properties tier, cohort or session, amount, `utm_campaign`, `utm_content`; on payment, move the deal to the paid stage; team leads and team enquiries go to the team pipeline. Call it from `onRegistrationCreated` and `onPaymentConfirmed`.

### 13.2 Certificates with a verification code

1. Sanity type `trainingCertificate`: code (`CW-` plus 8 characters), name, tier, date, issued at, revoked.
2. An admin issues certificates from the Studio after a session. Open a paid Essentials or Programme booking and click **Issue certificate** (this person) or **Issue certificates for this class** (every paid booking on the same class). `POST /api/certificates/issue` with the `CRON_SECRET` does the same from a script.
3. `src/app/verify/[code]/page.js`: shows name, course, date and "Valid" or "Not found". `noindex`.
4. The certificate PDF itself is produced from the existing training templates outside the site. Its footer carries the code and `cloudwise.co.ke/verify/<code>`.
5. The completion email adds a LinkedIn "Add to profile" link (`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=…&organizationName=Cloudwise%20Limited&issueYear=…&issueMonth=…&certId=<code>&certUrl=…`) and the Google review link.

### 13.3 Reviews page

Build `/ai-training/reviews` only when three named reviews with permission exist. Each review shows name, role, tier and month. No star ratings in structured data (schema audit §5).

---

## 20. Phase 14. Optional light theme

**Branch:** `feat/light-theme` · **Depends on:** nothing · **Only if you still want it after phases 1 to 12.**

The site uses `text-white/xx` 213 times, `border-white/xx` 139 times and `bg-ink…` about 30 times, across 51 files. A toggle is possible without touching those files:

1. In `tailwind.config.js`, define `white` as `rgb(var(--fg) / <alpha-value>)` and `ink` (and its shades) as `rgb(var(--bg…) / <alpha-value>)`. Add a separate `snow: '#FFFFFF'` for text that must stay white on ember buttons.
2. In `src/app/globals.css`, set `--fg: 255 255 255` and the ink values on `:root` (dark stays the default), and the light values on `[data-theme="light"]`.
3. Change `text-white` to `text-snow` only where text sits on an ember or image background (buttons, badges). Find them with `grep -rn "bg-ember" src`.
4. A toggle button in `src/components/Navbar.js` sets `data-theme` on `<html>`, saves the choice in `localStorage` (inside `try/catch`), and an inline script in `src/app/layout.js` applies the saved choice before paint to avoid a flash.
5. Leave `/studio`, the 3D canvas and emails unchanged.
6. Check every page in both themes for contrast (4.5:1 for body text).

---

## 21. Release checklist for every phase

1. `npm run lint` passes.
2. Stop `next dev`, then `npm run build` passes. Start `next dev` again after.
3. Open the Vercel preview and check every page the phase changed, on a phone width and a desktop width.
4. For money phases (4, 5, 8): run the test in the phase's "Done when" on the preview with sandbox keys, or at `TEST_PAYMENT_AMOUNT_KES=2` on a preview only. **Never set `TEST_PAYMENT_AMOUNT_KES` on Production.**
5. After the merge to `main` and the production deploy: open the live page (not only "Ready"), and for tracking phases check Meta Test events and GA4 Realtime.
6. If something breaks: Vercel → Deployments → the last good row → **Promote to Production** (`docs/VERCEL_DEPLOY_AND_ENV.md`).
7. Update `docs/VERCEL_DEPLOY_AND_ENV.md` "What is set up right now" whenever a switch or price changes.
8. Tick the phase in section 22.

---

## 22. Coverage check: every request mapped to a step

| Request or source item | Step |
|---|---|
| Run the SEO audit, Search Console and GA4 for 90 days, trace the homepage and /ai-training, combine into one prioritised list with files | Section 5 (evidence in section 4) |
| Update the sales and marketing documents with the new data | Done on 14 Oct 2026: tiered plan **rev4**, `AI_Training_Search_and_Traffic_Report_2026-10-14`, `Website_Performance_Audit_2026-10-14` |
| Plan the website changes from the documents | Phases 1 to 14 |
| Address with Westlands | 1.1, 9.6, 10.1 |
| Credits for the KES 500 and KES 5,500 classes, stored M-Pesa codes, a defined time window, discounted price on the higher class | Phase 5 (rules 5.1, evidence fields 5.2, code or M-Pesa lookup 5.3 to 5.5) |
| Essentials at KES 5,500 | 3, 4.1, 7.4 |
| M-Pesa C2B when STK push is not available | 0.3, 8.1 (already built; switched on after Safaricom) |
| Card payments | 0.4, 8.2 (already built; switched on after Paystack) |
| Sweep from paybill to bank, per payment or periodically | 0.4, 8.3, 8.4 (per payment built; periodic batch added) |
| Where those were written down | Section 4 |
| Remove what is not in the syllabus or untrue: Zoom, Zapier, Make, Midjourney, DALL·E, Perplexity, "Worth" labels, struck-through price, 50+ prompts, readiness guide by WhatsApp, "Certified", unverified numbers | 1.2 to 1.7 |
| The ten contradictions in rev4 §2 (Zoom; image AI; automation; Perplexity; generic day lists; Worth labels; Was Ksh 30,000; 50+ prompts; AI Readiness Guide; missing certificate, recordings and refund answers) | 1.2; 1.3; 1.3; 1.3; 7.5; 1.4; 1.4; 1.4; 1.4; 7.2 FAQ and 7.5 policy box |
| `src/lib/resources.js` Perplexity in accounts to open | 1.3 |
| Rev4 §7 page structure: hub, Kickstart, Essentials, Programme, register by tier, thank-you, teams, reviews, ai-tools-kenya, navigation | 7.2, 7.3, 7.4, 7.5, 7.7, 7.8, 7.6, 13.3, 7.9, 7.10 |
| Rev4 §7 technical: credit codes, pixel events, per-tier metadata and OG, Course and Offer data, mobile speed, HubSpot, certificates | Phase 5, phase 2, 7 and 9.1, 9.6, phase 3, 13.1, 13.2 |
| No deposits or instalments (15 Oct 2026) | Section 3, phase 6 note |
| Buyer type and headcount on the form; team leads the same day | 4.5, 13.1 |
| Meta Ads review: Purchase with value, Lead, InitiateCheckout at the right step, Conversions API with event ids, conversion domain, UTM tags | 2.1 to 2.5, 0.2, 0.6 |
| Meta Ads review: show the next date with its closing date, later dates smaller | 7.1 `NextDates` |
| UTM guide §6: carry UTM into the registration record | 2.5 |
| CAPI guide: token in Vercel, test with the test event code | 0.2, 2.7 |
| CAPI guide: retargeting audiences | Outside the code; ask for them in Ads Manager when phase 2 is live |
| Performance audits (9 and 14 October): Pixel and tag deferral, Reveal forced layout, GSAP and Lenis, caching | 3.1 to 3.8 |
| Technical audit: OG images, security headers, Course schema, caching, 307, slug, lastmod, register indexable, thin categories, robots host, IndexNow | 9.1, 9.2, 9.6, 3.4, 0.5, 9.9 and 0.6, 9.4, 9.3, 9.4, 9.5, 9.10 |
| Schema audit | 9.6 |
| Sitemap audit | 9.4, 9.3 |
| GEO audit: name clash, LinkedIn, summary passage, trainer, mentions, FAQ headings, llms.txt, author, Bing | 9.6, 0.6, 7.2, 11.1, section 23, 9.8, 9.5, 11.5, 0.6 |
| Agentic audit: llms.txt, caching, Content-Signal | 9.5, 3.4 |
| SXO audit: team page, ladder, keyword signals, trust, OG, FAQ gaps, photos, ChatGPT question | 7.6, 7.1 and 7.2, 7.2, 11.1, 9.1, 7.2, 0.7 and 7.2, 7.2 |
| Visual audit | 7.1 `StickyBookBar`, 7.2, phase 12 |
| Local audit: map, address variants, schema type, name mismatch, contact depth, reviews, email route, hard-coded phone | 10.1, 1.1, 9.6, 0.6, 10.2, 10.4 and 0.6, 10.3, 10.5 |
| Content audit: wrong tools, "Certified", portfolio figures, testimonials, keyword, trainer, syllabus, anchors, Women Biz360 post, thin blog, about, home stats, services, Prompt Pack | 1.3, 1.5, 1.7, 1.5, 7.2, 11.1, 7.5, 1.4, 0.6, 11.5, 11.3, 1.7, 11.4, 11.2 |
| Search report: one host, register out of the index, Prompt Pack, events | 0.5, 9.3, 11.2, phase 2 |
| Keep the design and the dark theme; optional light toggle | Section 2 rule 1, phase 14 |

---

## 23. Not in this plan, on purpose

| Item | Why |
|---|---|
| NITA registration or any mention of it | Your decision, 14 Oct 2026. The SXO audit suggested a NITA FAQ; it is left out. |
| Session recordings | Your decision. |
| Advanced Saturday and a 30-minute one-to-one call | Your decision. |
| Separate in-person and online prices (Meta Ads review, phase 4) | Superseded by the rev4 ladder, which uses one price per tier. |
| A free taster session (Meta Ads review, phase 4) | Superseded by the paid KES 500 Kickstart (rev4 §5.1 explains why paid). |
| Vercel Web Analytics (UTM guide, path A) | GA4 is now installed and reads UTM tags. |
| Content-Signal in robots.txt, WebMCP, `/.well-known` files | Draft standards that Google does not use. The agentic audit rates them optional. |
| YouTube channel, Kenyan course listings, Wikidata, Reddit | Off-site work for mentions (GEO audit, finding 5). It needs the session video first (rev4 §10). |
| Retargeting audiences in Meta | Ads Manager work, not website code. Build them when phase 2 is live. |
| Rewriting old blog posts | Separate content work. Phase 11 fixes the author and the AI-training category page only. |
