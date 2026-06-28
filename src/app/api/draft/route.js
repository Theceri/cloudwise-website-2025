import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Enable draft mode to preview unpublished/draft content.
 * Usage: /api/draft?secret=YOUR_SECRET&slug=/blog/some-post
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '/blog';

  if (!process.env.SANITY_DRAFT_SECRET || secret !== process.env.SANITY_DRAFT_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  draftMode().enable();
  redirect(slug.startsWith('/') ? slug : `/blog/${slug}`);
}
