import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

/** Exit draft mode. Usage: /api/disable-draft?slug=/blog */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '/blog';
  draftMode().disable();
  redirect(slug.startsWith('/') ? slug : `/blog/${slug}`);
}
