import { SITE_URL } from '@/lib/constants';
import { projects } from '@/lib/projects';

const SERVICE_IDS = ['ai', 'web', 'mobile', 'ecommerce', 'cloud', 'data', 'automation', 'consulting'];

export const revalidate = 3600;

/**
 * The date each static page last changed in a way a reader would notice.
 *
 * Real dates, not the time of the request: every URL used to carry the same
 * timestamp, so search engines learned to ignore the field (sitemap audit,
 * 14 October 2026). **Update the date when you change a page.** Google
 * ignores `priority` and `changeFrequency`, so they are not sent.
 */
const STATIC_ROUTES = [
  ['/', '2026-10-15'],
  ['/ai-training', '2026-10-15'],
  // The register page is a form and is noindexed; the tier pages carry the content.
  ['/ai-training/kickstart', '2026-10-15'],
  ['/ai-training/essentials', '2026-10-15'],
  ['/ai-training/programme', '2026-10-15'],
  ['/ai-training/teams', '2026-10-15'],
  ['/resources', '2026-10-15'],
  ['/resources/ai-tools-kenya', '2026-10-15'],
  ['/resources/prompt-pack', '2026-10-14'],
  ['/resources/ai-readiness', '2026-10-14'],
  ['/resources/session-prep', '2026-10-14'],
  ['/services', '2026-06-17'],
  ['/about', '2026-06-17'],
  ['/portfolio', '2026-06-17'],
  ['/contact', '2026-10-14'],
  ['/blog', '2026-06-29'],
];
const SERVICES_UPDATED = '2026-06-29';
const PROJECTS_UPDATED = '2025-10-07';

export default async function sitemap() {
  // Sanity is imported lazily so a missing/unset blog config never breaks the
  // core site's sitemap — it just falls back to the static routes.
  let posts = [];
  let categories = [];
  let reviewCount = 0;
  try {
    const { client } = await import('@/sanity/lib/client');
    const { sitemapPostsQuery, sitemapCategoriesQuery } = await import('@/sanity/lib/queries');
    // Not from the CDN: the sitemap was served days stale after new posts.
    const fresh = client.withConfig({ useCdn: false });
    const { REVIEWS_QUERY } = await import('@/lib/reviews');
    [posts, categories, reviewCount] = await Promise.all([
      fresh.fetch(sitemapPostsQuery),
      fresh.fetch(sitemapCategoriesQuery),
      fresh.fetch(`count(${REVIEWS_QUERY.split('|')[0].trim()})`),
    ]);
  } catch (err) {
    console.error('[sitemap] Sanity fetch failed:', err?.message);
    // At runtime, throwing keeps the last good sitemap in Vercel's cache
    // instead of quietly publishing one with every blog URL missing. During a
    // build there is no earlier copy, so fall back to the static routes rather
    // than fail the deploy.
    if (process.env.NEXT_PHASE !== 'phase-production-build') throw err;
  }

  const staticRoutes = STATIC_ROUTES.map(([path, date]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(`${date}T00:00:00Z`),
  }));

  const serviceRoutes = SERVICE_IDS.map((id) => ({
    url: `${SITE_URL}/services/${id}`,
    lastModified: new Date(`${SERVICES_UPDATED}T00:00:00Z`),
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${SITE_URL}/portfolio/${p.slug}`,
    lastModified: new Date(`${PROJECTS_UPDATED}T00:00:00Z`),
  }));

  const postRoutes = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p._updatedAt || p.publishedAt),
  }));

  // Only categories with at least one published post, dated by their newest.
  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/blog/category/${c.slug}`,
    lastModified: new Date(c.lastUpdated),
  }));

  // The reviews page exists only once there are enough named reviews.
  const { MIN_REVIEWS } = await import('@/lib/reviews');
  const reviewRoutes =
    reviewCount >= MIN_REVIEWS ? [{ url: `${SITE_URL}/ai-training/reviews`, lastModified: new Date() }] : [];

  return [...staticRoutes, ...reviewRoutes, ...serviceRoutes, ...projectRoutes, ...postRoutes, ...categoryRoutes];
}
