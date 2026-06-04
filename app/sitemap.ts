import { MetadataRoute } from 'next'
import { REVIEWS, BLOG_POSTS, CATEGORIES } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://saaspebble.tech'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/reviews`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/newsletter`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/subscribe`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/disclaimers`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const reviewRoutes: MetadataRoute.Sitemap = REVIEWS.map((r) => ({
    url: `${base}/reviews/${r.slug}`,
    lastModified: new Date(r.publicationDate),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publicationDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...reviewRoutes, ...blogRoutes, ...categoryRoutes]
}
