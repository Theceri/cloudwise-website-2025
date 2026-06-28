import { client } from '@/sanity/lib/client';
import { feedPostsQuery } from '@/sanity/lib/queries';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 3600;

function escapeXml(unsafe = '') {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let posts = [];
  try {
    posts = await client.fetch(feedPostsQuery);
  } catch {
    // Sanity unreachable/unconfigured — emit an empty feed rather than 500.
  }

  const items = posts
    .map((p) => {
      const link = `${SITE_URL}/blog/${p.slug}`;
      const categories = (p.categories || [])
        .map((c) => `<category>${escapeXml(c)}</category>`)
        .join('');
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      ${p.author ? `<dc:creator>${escapeXml(p.author)}</dc:creator>` : ''}
      ${p.excerpt ? `<description>${escapeXml(p.excerpt)}</description>` : ''}
      ${categories}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cloudwise Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Insights on AI, software &amp; digital transformation from the Cloudwise team.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
