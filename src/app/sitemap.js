import { SITE_URL } from '@/lib/constants';
import { projects } from '@/lib/projects';

const SERVICE_IDS = ['ai', 'web', 'mobile', 'ecommerce', 'cloud', 'data', 'automation', 'consulting'];

export default function sitemap() {
  const now = new Date();

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

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
