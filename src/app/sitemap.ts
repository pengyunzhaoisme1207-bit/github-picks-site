import { getProjects, getCategories } from '@/lib/data';
import { SITE_URL } from '@/lib/constants';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects();
  const categories = getCategories();

  const routes = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${SITE_URL}/weekly`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/submit`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${SITE_URL}/project/${p.slug}`,
    lastModified: new Date(p.added_date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...categoryRoutes, ...projectRoutes];
}
