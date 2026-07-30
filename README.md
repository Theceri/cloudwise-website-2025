This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Blog (Sanity CMS)

The blog is powered by [Sanity](https://www.sanity.io). The editing Studio is
**embedded** in this app at [`/studio`](http://localhost:3000/studio), and the
content schemas live in `src/sanity/schemaTypes/`. The public blog renders
server-side (SSR + ISR) under `src/app/blog/`.

### One-time setup

1. Create a free project at <https://www.sanity.io/manage> (dataset: `production`).
2. Copy `.env.example` → `.env.local` and fill in:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_READ_TOKEN` (Viewer token — draft preview)
   - `SANITY_API_WRITE_TOKEN` (Editor token — reader comments)
   - `SANITY_DRAFT_SECRET`, `SANITY_REVALIDATE_SECRET` (any random strings)
3. In sanity.io/manage → **API → CORS origins**, add `http://localhost:3000`
   and `https://cloudwise.co.ke` (allow credentials).
4. `npm run dev`, open `/studio`, sign in, and create authors / categories / posts.

### Features

- Posts, categories, tags, authors, rich Portable Text (images, code, callouts,
  YouTube), featured posts, reading time, related posts.
- **Moderated comments** with threaded replies — submitted via `/api/comments`
  (stored unapproved), approved in Studio under **Comments → Pending**.
- Full SEO: per-post metadata, OpenGraph/Twitter cards, `BlogPosting` JSON-LD,
  RSS feed at `/blog/rss.xml`, and blog URLs in `/sitemap.xml`.
- Draft preview (`/api/draft`) and on-demand revalidation webhook
  (`/api/revalidate`).

### On-demand revalidation (production)

Add a webhook in sanity.io/manage → **API → Webhooks**:
- URL: `https://cloudwise.co.ke/api/revalidate?secret=YOUR_SANITY_REVALIDATE_SECRET`
- Trigger on create/update/delete
- Projection: `{ "_type": _type, "slug": slug.current, "postId": post._ref }`

## Training registrations & payments

Both training tracks — the individual **AI Productivity Training** and the
**Women Biz360 Hub masterclass** — share one registration → payment → onboarding
pipeline. It runs entirely inside this app; there is no separate backend.

**Setup is documented step by step in [`docs/PAYMENTS_SETUP.md`](docs/PAYMENTS_SETUP.md).**
Start there — this section is only a map of the code.

### The flow

```
/ai-training/register       full form (cohort, profiling questions)
/women-biz360/register      short form (they already answered at the free webinar)
        │
        ▼  POST /api/registrations
   trainingRegistration in Sanity, reference CWI-7F3K2M
        │
        ▼  /checkout/[ref]
   M-Pesa STK push  ·  paybill fallback  ·  Paystack card
        │
        ▼  provider callback
   confirmed → emails to attendee + admins → swept to the bank
```

### Where things live

| Area | Path |
|---|---|
| Tracks, pricing, cohort dates | `src/lib/training.js` |
| Form questions & validation | `src/lib/registration-form.js` |
| Reads/writes + one-shot claims | `src/lib/store.js` |
| Lifecycle side effects | `src/lib/lifecycle.js` |
| Emails | `src/lib/email/` |
| Onboarding resource content | `src/lib/resources.js` |
| Daraja / Paystack / SasaPay clients | `src/lib/payments/` |
| Bank sweep + adapters | `src/lib/settlement/` |
| API routes | `src/app/api/{registrations,payments,cron,test}/` |

### Admin

- **Roster:** `/studio` → **Training**. Split by track, by cohort, and by paid
  vs awaiting payment. Payments carry the full provider request/response.
- **Alerts:** every signup and every payment emails `ADMIN_EMAILS` with the full
  roster attached.
- **Daily round-up:** 5:00pm East Africa Time, via `vercel.json` cron.
- **Email previews:** `/api/test/emails?secret=$CRON_SECRET` lists every
  lifecycle email; add `&template=<key>` to render one in the browser, or POST
  `{"to":"…"}` to send them all to yourself.

### Money

M-Pesa runs on **Daraja** into the Cloudwise paybill; cards run on **Paystack**.
Collected M-Pesa funds are swept to the bank automatically by whichever
settlement adapter is configured — `daraja-b2b` (paybill → Equity's paybill
`247247`) or `sasapay` (SasaPay working account → Equity by B2C). Card money
settles on Paystack's own schedule and is never swept by us. See section 8 of
the setup guide for why the collection and settlement rails have to match.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
