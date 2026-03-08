import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://communityHyper.co'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/guide`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/marketplace`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/communities`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/auth/signin`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  const categoryPages: MetadataRoute.Sitemap = [
    'FOOD', 'REPAIR', 'HOME_SERVICES', 'TUTORING', 'ELDERLY_CARE',
    'HANDMADE', 'HEALTH_WELLNESS', 'AGRICULTURE', 'FREELANCE', 'COMMUNITY_SHARING',
  ].map((slug) => ({
    url: `${BASE_URL}/marketplace?category=${slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages]
}
