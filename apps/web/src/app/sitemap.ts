import type { MetadataRoute } from 'next'
import { MOCK_LISTINGS } from '@/lib/mock-listings'

export const dynamic = 'force-static'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://communityHyper.co'

const COMMUNITY_IDS = ['1', '2', '3', '4', '5', '6']
const PROVIDER_IDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/marketplace`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${BASE_URL}/communities`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/providers/apply`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/franchise`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/franchise/apply`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const listingPages: MetadataRoute.Sitemap = MOCK_LISTINGS.map((listing) => ({
    url: `${BASE_URL}/marketplace/${listing.id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  const communityPages: MetadataRoute.Sitemap = COMMUNITY_IDS.map((id) => ({
    url: `${BASE_URL}/communities/${id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const providerPages: MetadataRoute.Sitemap = PROVIDER_IDS.map((id) => ({
    url: `${BASE_URL}/providers/${id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  return [...staticPages, ...listingPages, ...communityPages, ...providerPages]
}
