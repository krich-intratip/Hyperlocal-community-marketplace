import type { NextConfig } from 'next'

const SECURITY_HEADERS = [
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stop MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Enable XSS protection in older browsers
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Control referrer info sent on navigation
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Limit browser feature access
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  // HSTS — force HTTPS (only takes effect over HTTPS)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Content Security Policy — allow Google Fonts + self + Cloudflare R2
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",   // unsafe-eval needed by Next.js dev; lock down in prod
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: https://lh3.googleusercontent.com",
      "connect-src 'self' https://accounts.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  transpilePackages: ['@chm/shared-types', '@chm/ui'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  // typedRoutes: true, // re-enable when all pages are scaffolded

  // ── Security HTTP headers applied to all routes ──
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
    ]
  },

  // ── Compress responses ──
  compress: true,

  // ── Power-header removal (via headers above, X-Powered-By already off by default in Next.js) ──
  poweredByHeader: false,
}

export default nextConfig
