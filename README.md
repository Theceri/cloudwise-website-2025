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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
