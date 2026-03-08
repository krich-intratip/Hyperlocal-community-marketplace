import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

/**
 * Build CSP header value.
 * - Production: removes 'unsafe-eval' (only needed by Next.js HMR in dev)
 * - connect-src includes the API origin and Leaflet tile servers
 */
function buildCsp(): string {
  const apiOrigin = process.env.NEXT_PUBLIC_API_BASE_URL
    ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).origin
    : 'http://localhost:4000'

  return [
    "default-src 'self'",
    isProd
      ? "script-src 'self' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // unsafe-eval for Next.js HMR (dev only)
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: https://lh3.googleusercontent.com",
    [
      "connect-src 'self'",
      apiOrigin,
      "https://accounts.google.com",
      "https://tile.openstreetmap.org",   // Leaflet map tiles
      "https://*.r2.cloudflarestorage.com",
    ].join(' '),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join('; ')
}

const SECURITY_HEADERS = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: buildCsp(),
  },
]

const nextConfig: NextConfig = {
  transpilePackages: ['@chm/shared-types', '@chm/ui'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'tile.openstreetmap.org' },    // Leaflet map tiles
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
    ]
  },

  compress: true,
  poweredByHeader: false,
}

export default nextConfig
