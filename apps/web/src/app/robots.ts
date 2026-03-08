import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://communityHyper.co'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/marketplace', '/communities', '/guide', '/about'],
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/auth/',
          '/profile/',
          '/bookings/',
          '/_next/',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/marketplace', '/guide', '/about'],
        disallow: ['/api/', '/dashboard/', '/admin/', '/auth/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/', '/marketplace', '/guide', '/about'],
        disallow: ['/api/', '/dashboard/', '/admin/', '/auth/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/marketplace', '/guide', '/about'],
        disallow: ['/api/', '/dashboard/', '/admin/', '/auth/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
