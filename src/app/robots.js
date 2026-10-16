import { SITE_URL } from '@/lib/constants';

// No `host` line: Google ignores it (technical audit, 14 October 2026).

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Checkout pages are personal to one booking, and the Studio is the
        // admin surface — neither belongs in an index.
        disallow: ['/checkout/', '/studio', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
