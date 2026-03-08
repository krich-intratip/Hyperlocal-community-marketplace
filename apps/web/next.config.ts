import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@chm/shared-types', '@chm/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // typedRoutes: true, // re-enable when all pages are scaffolded
}

export default nextConfig
