import type { NextConfig } from 'next'

/**
 * Static export config for Cloudflare Pages deployment.
 * - output: 'export' generates a fully static site in /out
 * - images.unoptimized: true disables Next.js image optimization (not available in static export)
 * - Security headers are served via public/_headers (Cloudflare Pages native)
 * - async headers() is removed — not compatible with static export
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['@chm/shared-types', '@chm/ui'],
  images: {
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
