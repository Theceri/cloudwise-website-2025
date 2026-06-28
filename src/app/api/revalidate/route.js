import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * On-demand ISR webhook target for Sanity.
 *
 * Configure a webhook in sanity.io/manage → API → Webhooks:
 *   URL:    https://cloudwise.co.ke/api/revalidate?secret=YOUR_SECRET
 *   Trigger: Create / Update / Delete
 *   Filter:  _type in ["post","category","author","comment","siteSettings"]
 *   Projection: { "_type": _type, "slug": slug.current, "postId": post._ref }
 */
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const secret =
    searchParams.get('secret') || request.headers.get('x-revalidate-secret');

  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // No body — fall back to broad revalidation below.
  }

  // Broad invalidation keeps every listing fresh.
  ['post', 'category', 'author'].forEach((t) => revalidateTag(t));

  // Targeted invalidation for the affected document.
  if (body?._type === 'post' && body?.slug) {
    revalidateTag(`post:${body.slug}`);
  }
  if (body?._type === 'comment' && body?.postId) {
    revalidateTag(`comments:${body.postId}`);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
