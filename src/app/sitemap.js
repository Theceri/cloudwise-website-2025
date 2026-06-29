import { SITE_URL } from '@/lib/constants';
import { projects } from '@/lib/projects';

const SERVICE_IDS = ['ai', 'web', 'mobile', 'ecommerce', 'cloud', 'data', 'automation', 'consulting'];

export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();

  // Sanity is imported lazily so a missing/unset blog config never breaks the
  // core site's sitemap — it just falls back to the static routes.
  let posts = [];
  let categories = [];
  try {
    const { client } = await import('@/sanity/lib/client');
    const { sitemapPostsQuery, categorySlugsQuery } = await import('@/sanity/lib/queries');
    [posts, categories] = await Promise.all([
      client.fetch(sitemapPostsQuery),
      client.fetch(categorySlugsQuery),
    ]);
  } catch {
    // If Sanity is unreachable or unconfigured, still return the static routes.
  }

  const staticRoutes = [
    { url: '/', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/ai-training', priority: 0.95, changeFrequency: 'weekly' },
    { url: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/portfolio', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.6, changeFrequency: 'yearly' },
    { url: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  ].map((r) => ({ ...r, url: `${SITE_URL}${r.url}`, lastModified: now }));

  const serviceRoutes = SERVICE_IDS.map((id) => ({
    url: `${SITE_URL}/services/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${SITE_URL}/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/blog/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...postRoutes,
    ...categoryRoutes,
  ];
}
