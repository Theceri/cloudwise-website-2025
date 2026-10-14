# Visual audit: cloudwise.co.ke and /ai-training (captured 2026-10-14)

Screenshots in this folder: home/ and ai/ (desktop, laptop, tablet, mobile), home_mobile_fold.png, ai_mobile_fold.png, ai_mobile_full.png, *_desktop_fold.png.
Mobile 375x812: no horizontal scroll on either page (scrollWidth 375). H1 visible on both.

## /ai-training findings (ranked)
1. HIGH. Dates and price sit below the fold on 375x812. Fold shows only H1, intro, two buttons and the top of the price card. "Next cohorts" starts about 1,550px down. File: src/app/ai-training/page.js (hero, lines 192-259). Fix: add a one-line next-date chip ("Next: Sat 07 & 14 Nov 2026 · Ksh 13,500") above the buttons and cut hero top padding (pt-36) on mobile.
2. HIGH. The fixed WhatsApp bubble covers the right of the price card (SAVE 55% badge area) in the fold, and it will cover content throughout. File: src/components/WhatsAppButton.js (and its mount in SiteChrome.js). Fix: add bottom padding and shrink to about 48px on mobile, or hide it where a WhatsApp CTA already exists.
3. HIGH. No sticky register action on mobile. After the hero, the only Register button is at the very bottom (about 12,000px page). Page is 12,136 CSS px tall on mobile. File: src/app/ai-training/page.js. Fix: add a sticky bottom bar (Register & pay, Ksh 13,500) visible after the hero scrolls away, positioned left of the WhatsApp bubble.
4. MEDIUM. The decorative Gauge dial (opacity 50%) sits behind the intro paragraph and its needle crosses the text "gives you", reducing legibility. File: src/app/ai-training/page.js line 194. Fix: use opacity-20 or push it up and right on mobile (hide below md behind the paragraph).
5. MEDIUM. Only one price tier is shown (Ksh 13,500 individual). Team and organisation training appears only in the FAQ. File: src/app/ai-training/page.js. Fix: add a small "Team of 3 or more? Ask for a quote" card with a WhatsApp link next to the price card.
6. MEDIUM. Hero buttons stack at different widths (Register 243px, Curriculum 202px wide in CSS px), looking ragged. File: src/app/ai-training/page.js line 211. Fix: make both full width on mobile (w-full sm:w-auto).
7. MEDIUM. Strike-through "Was Ksh 30,000" is text-white/40 and "per person" text-white/50: low contrast on dark. Same file lines 222-224. Fix: raise to white/60 and white/65.
8. LOW. Eyebrows are 10.4-11.2px mono with wide tracking, red on near-black (globals .eyebrow, 0.7rem). File: src/app/globals.css line 89. Fix: raise to 0.75rem on mobile. The "Next" label and cohort list text are 14px: raise to 15-16px.
9. LOW. Sections use py-24 (96px) on mobile, causing long scrolling. Fix: py-16 md:py-32 on the section wrappers in page.js.
10. LOW. Cohort list has no per-cohort register link. Fix: link each cohort to /ai-training/register?cohort=<id> if the register page supports it (src/app/ai-training/register/page.js).

## Tap targets (375px, from DOM measurement)
- Header hamburger is about 44px. OK.
- Mobile menu sub-links "For individuals & teams", "Free resources": 40px high. File: src/components/Header.js or Navbar.js. Fix: min-h-12.
- Footer links (Home, About, Services, AI Training, Portfolio, Blog, Contact, service links, social links): 17-20px high, with 15px gaps. Phone and email links: 20px high. File: src/components/Footer.js. Fix: py-2.5 on each link.
- Home "View all services" 20px high and "Explore our portfolio" 24px high. File: src/app/page.js or src/components/home/*. Fix: add py-3.
- Main CTAs (Register, Start a project, WhatsApp) are 52-54px high. OK.

## Home page findings
1. MEDIUM. Hero shows "Start a project" as primary CTA; "Explore AI training" is secondary and has no date or price hint, though training is the main revenue goal. File: src/app/page.js (hero) or src/components/home/Hero*. Fix: change the secondary label to "AI training from Ksh 13,500" or promote it to the primary.
2. LOW. Network-node canvas runs behind the hero paragraph and creates speckle across the text. Fix: lower canvas opacity behind text on mobile (src/components/three).
3. LOW. Stats (33+, 3, 2019) are stacked left with a lot of empty space on the right. Fix: three columns, grid-cols-3.
4. LOW. WhatsApp bubble sits over the stats area at the fold (same as above).
5. LOW. Eyebrows 10.4-11.2px ("SCROLL TO EXPLORE" 10.4px).

## Not broken
No overlapping text blocks apart from the gauge and WhatsApp bubble. No horizontal overflow. Dark theme and brand colours retained in all recommendations.
