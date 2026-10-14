# Local SEO audit: Cloudwise Limited (https://www.cloudwise.co.ke)

Date: 2026-10-14. Method: live fetch of home and /contact, repo grep (D:\projects\cloudwise-website-2025), GBP audit PDF (13 Oct 2026). No files modified. No paid tools (DataForSEO, Whitespark) used.

## Score: 46 / 100

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| GBP signals | 25% | 9/25 | Map embed present but wrong centre and wrong name. No GBP link, no review widget, no posts signal. GBP itself: name "Cloudwise Technologies", no hours, no services. |
| Reviews and reputation | 20% | 8/20 | GBP has 19 reviews at 5.0, 0 replies (per PDF). Nothing on the site: no rating, no testimonials tied to Google, no aggregateRating. |
| Local on-page SEO | 20% | 9/20 | Nairobi in copy, but no "Westlands", no location H1/title, no service-area wording, no hours. Contact page has a phone, email, map, WhatsApp. |
| NAP consistency and citations | 15% | 7/15 | Phone and email consistent everywhere. Address and name vary (see below). Citations not checked. |
| Local schema | 10% | 4/10 | Generic `Organization` only. No LocalBusiness subtype, no geo, no hours, no `addressRegion`, no `postalCode`, no `hasMap`. |
| Local links and authority | 10% | 9/10 | LinkedIn, Instagram, TikTok in sameAs. No Google profile or directory link in sameAs. Score reflects only what is visible. |

Business type: hybrid (physical office on 4th Floor, plus online delivery and in-person training). Vertical: professional services / IT (software, AI training). Closest schema fit: `ProfessionalService` (or `LocalBusiness` with `additionalType`), not generic `Organization`.

## Where the address, phone and email appear

### Address (change all together)

Source of truth is `src/lib/constants.js` lines 24-29 (line1 "4th Floor, Delta Annex, Delta Corner", line2 "Waiyaki Way", city "Nairobi"). Nothing in the repo says "Westlands" (zero matches).

Derived from constants (fixed automatically when constants change):
- `src/components/Footer.js:49` renders `line1, city` (live: "4th Floor, Delta Annex, Delta Corner, Nairobi", no Waiyaki Way).
- `src/app/contact/page.js:35` "Visit us" card renders `line1, city` (same).
- `src/app/layout.js:83-85` JSON-LD streetAddress `line1, line2`, addressLocality city. Live: "...Delta Corner, Waiyaki Way" / "Nairobi".
- `src/lib/email/layout.js:153` email footer `line1, line2, city`.
- `src/lib/email/templates.js:86` falls back to `address.line1` when a track has no venue.

Hard-coded (must be edited by hand):
- `src/lib/training.js:40` venue '4th Floor, Delta Annex, Delta Corner, Waiyaki Way, Nairobi'
- `src/lib/training.js:58` venue 'Delta Centre, Waiyaki Way, Nairobi' (different building name: "Delta Centre" vs "Delta Annex"; confirm which track this is)
- `src/app/ai-training/page.js:106` FAQ answer text "(4th Floor, Delta Annex, Delta Corner, Waiyaki Way)"
- `src/app/ai-training/page.js:152` location name 'Cloudwise, Delta Annex, Delta Corner'
- `src/app/ai-training/page.js:153` location address '4th Floor, Delta Annex, Delta Corner, Waiyaki Way, Nairobi, Kenya' (Course JSON-LD)
- `src/app/ai-training/register/page.js:124` "Online, or Delta Annex, Nairobi"
- `src/components/training/RegistrationForm.js:281` description 'Delta Annex, Delta Corner, Waiyaki Way'
- `src/app/contact/layout.js:4` meta description mentions only phone, email (no address; consider adding Westlands)

Docs (not user-facing, optional): `docs/COMPETITOR_TEARDOWN_AI_TRAINING.md:158` (untracked file) says "...Delta Corner, Waiyaki Way".

Other places outside the repo: the GBP audit PDF footer reads "...Delta Corner, Waiyaki Way, Nairobi" on every page while its running header reads "Delta Corner, Westlands, Nairobi". Also check Sanity content (about page, blog posts, training pages in the Studio), social bios, invoices and email signatures; these are not in the repo.

Live-site note: live HTML matches the repo (home and /contact checked). Live visible text "4th Floor, Delta Annex, Delta Corner, Nairobi" (footer, contact card) and "...Waiyaki Way" in the AI training FAQ and JSON-LD. So three variants are live today: with Waiyaki Way, without it, and Delta Annex only.

### Phone
- `src/lib/constants.js:14-15` WHATSAPP_NUMBER, WHATSAPP_NUMBER_RAW (+254712658775, 254712658775)
- `src/lib/constants.js:22-23` phone '+254 712 658 775', phoneRaw '+254712658775'
- `src/components/SiteChrome.js:31` WhatsAppButton phoneNumber="+254712658775" (hard-coded; should use constant)
- `src/components/ContactForm.js:27` hard-coded wa.me/254712658775 (should use constant)
- `src/app/contact/layout.js:4` meta description "+254 712 658 775" (hard-coded)
- Derived: `Footer.js:42`, `contact/page.js:33` (tel:), `layout.js:79` (JSON-LD), `lib/email/layout.js:154`
- GBP shows "0712 658775": same number, different format (fine).
- Placeholders/test only (not NAP): RegistrationForm.js:194, Checkout.js:267 "0712 345 678"; api/test/emails/route.js:44; PAYMENTS_SETUP.md test MSISDN 254708374149.

### Email
- `src/lib/constants.js:21` hello@cloudwise.co.ke (site-wide, used by Footer.js:45, contact/page.js:34, layout.js:78, email/layout.js:154)
- `src/app/contact/layout.js:4` hard-coded hello@cloudwise.co.ke
- `src/lib/email/send.js:17-18` defaults training@cloudwise.co.ke (from), hello@cloudwise.co.ke (reply-to)
- `.env.example:110-113` EMAIL_FROM training@..., EMAIL_REPLY_TO and ADMIN_EMAILS hello@...
- docs: `PAYMENTS_SETUP.md:210-212` (also paul@cloudwise.co.ke, meg@elevatesmes.co.ke), `VERCEL_DEPLOY_AND_ENV.md:178` (paul@), `sanity-team-workflow.md:39`

## NAP consistency table

| Element | Site visible | JSON-LD (home) | AI training JSON-LD | GBP (per PDF) | Match |
|---|---|---|---|---|---|
| Name | "Cloudwise" / "Cloudwise Limited" | Cloudwise Limited (alt Cloudwise) | "Cloudwise, Delta Annex, Delta Corner" | "Cloudwise Technologies" | No |
| Address | "4th Floor, Delta Annex, Delta Corner, Nairobi" | "...Delta Corner, Waiyaki Way", Nairobi | "...Waiyaki Way, Nairobi, Kenya" | "Waiyaki Wy", Nairobi, no building | No |
| Phone | +254 712 658 775 | +254712658775 | n/a | 0712 658775 | Yes |
| Email | hello@cloudwise.co.ke | same | n/a | n/a | Yes |
| URL | www.cloudwise.co.ke | www | n/a | cloudwise.co.ke (apex) | Minor |

## Findings by severity

### Critical
1. Map embed is centred on the CBD, about 3 km from the office, and labelled "Cloudwise Technologies". `src/app/contact/page.js:79` (center 2d36.8214, 3d-1.2850) and title at line 86. The GBP pin is -1.2661, 36.8014. Fix: regenerate the embed from the verified GBP listing (Share > Embed a map) so the pin and place ID match, and set the iframe title to "Cloudwise Limited office, Westlands, Nairobi". Also the "Visit us" link `contact/page.js:35` uses a text query "Cloudwise+Technologies+Nairobi"; replace with the GBP "Get directions" short link or a `place_id` URL.
2. Address has three live variants and no "Westlands". Fix: in `constants.js` set one canonical address (add `line2` "Westlands" or a `suburb` field), then make Footer, contact card, JSON-LD and emails use one `formatAddress()` helper; replace the hard-coded strings listed above. Decide with the GBP whether "Waiyaki Way" stays: the PDF says the GBP pin is on "Waiyaki Wy" and advises adding the building line to GBP, so either `4th Floor, Delta Annex, Delta Corner, Waiyaki Way, Westlands, Nairobi` on both, or drop Waiyaki Way on both. Do not leave them different.

### High
3. Schema is `Organization`, not a local type. `src/app/layout.js:73`. Fix: `@type: ['ProfessionalService','LocalBusiness']` (or `LocalBusiness`), add `@id` (`${SITE_URL}/#organization`), `image`, `geo` (GeoCoordinates, 5 decimals, from GBP: -1.26610, 36.80140, verify), `openingHoursSpecification` (match the GBP once real hours are set; GBP says "24 hours", which is almost certainly wrong), `addressRegion` "Nairobi County", `postalCode` if known, `areaServed` Nairobi / Kenya, `hasMap`, `priceRange` optional, and the Google Maps/GBP URL in `sameAs`. Emit `LocalBusiness` only on home/contact; keep the layout-level one slim to avoid duplicates.
4. Name mismatch: site "Cloudwise Limited / Cloudwise" versus GBP "Cloudwise Technologies". Fix: rename the GBP to match the trading name (after checking Google's naming rules), then update the map iframe title and the `maps.google.com` query.
5. Course JSON-LD location (`ai-training/page.js:152-153`) uses a different name format and a hard-coded address. Fix: build it from constants. `training.js:58` "Delta Centre" is a different building name; confirm and correct.

### Medium
6. Contact page lacks local depth: no opening hours, no parking/landmark/directions text, no "Westlands, Nairobi" in the H1, title or description (`contact/layout.js:4`), no visible address text near the map, no service-area wording. Add a short "Find us" block (address, landmarks, hours, how to get there, parking) and a Westlands mention in the title/meta.
7. No reviews on the site. GBP has 19 reviews at 5.0 with 0 replies. Fix: show a Google reviews link/button ("Review us on Google") on /contact and in the training confirmation email; reply to all 19 reviews. Only add `aggregateRating` to schema if the reviews are visible on the page and about the business (Google self-serving review rules); avoid it if unsure.
8. Contact "form" only opens WhatsApp (`contact/page.js:14-18`); there is no email/server form and no fallback if WhatsApp is not installed. Add a real form route and capture the lead.
9. Hard-coded phone/email copies in `SiteChrome.js:31`, `ContactForm.js:27`, `contact/layout.js:4`. Fix: import from constants so a change cannot drift.
10. No `/locations` or service-area page for Nairobi / Westlands; dedicated service pages are the top local organic factor. Check the /services pages target "[service] in Nairobi".

### Low
11. GBP website field uses the apex `https://cloudwise.co.ke/`; the site canonical is `www`. Set the GBP URL to `https://www.cloudwise.co.ke`.
12. `docs/COMPETITOR_TEARDOWN_AI_TRAINING.md:158` and the GBP PDF footer repeat the old address; update when final.
13. Sanity-managed content (about, blog, training pages) not grepped; check for the old address there.

## GBP signals checklist (visible from site)

| Signal | Status |
|---|---|
| Maps embed | Present, wrong centre, wrong label |
| Directions link | Present, text-query only |
| Click-to-call (tel:) | Present (footer, contact) |
| WhatsApp | Present (floating button, contact) |
| Hours on site | Missing |
| Review widget or link | Missing |
| GBP / Maps URL in sameAs | Missing |
| Posts / photos evidence | Missing; GBP has no posts, 5 exterior photos only |
| Primary category | GBP "Software company" (only one; add IT consultant, Training centre, Web designer etc. per PDF) |

## Review health (from PDF; not verifiable from site)
19 reviews, 5.0, 0 owner replies. Velocity not measured. Competitors reportedly have 3-4x the reviews.

## Citations
Not checked (Yelp, BBB are low value in Kenya). Recommended Tier 1 for Kenya: Google Business Profile, Bing Places, Apple Business Connect, Facebook page, LinkedIn (present), Kenya business directories (e.g. BrighterMonday-adjacent company listings, Yellow Pages Kenya, Kenya Tech/ICT directories), and the Companies Registry data. Ensure the same NAP on each once the address is final.

## Multi-location
Single location. Training venue strings differ between tracks (training.js:40, :58).

## Limitations
No paid data (DataForSEO, Whitespark, BrightLocal). Local pack positions, citation counts, review velocity and GBP category ranking were not measured. GBP figures come from the 13 Oct 2026 PDF, not a live pull. Proximity is a major ranking factor (about 55%) and is outside the site's control. Sanity CMS content and off-site profiles were not inspected.
