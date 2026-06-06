import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/queries'

const BASE = 'https://agile-operator.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                             lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/playbooks`,              lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/services`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/collective-edge`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/margins-and-mandates`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/contact`,                lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
  ]

  const contentRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE}/playbooks/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...contentRoutes]
}
