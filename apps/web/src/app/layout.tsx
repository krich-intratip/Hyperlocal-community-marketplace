import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'
import { JsonLd } from '@/components/json-ld'
import { buildMetadata, websiteJsonLd, organizationJsonLd, marketplaceJsonLd } from '@/lib/seo'
import { RateLimitToast } from '@/components/rate-limit-toast'
import Script from 'next/script'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  ...buildMetadata(),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Community Hyper',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <JsonLd data={[websiteJsonLd(), organizationJsonLd(), marketplaceJsonLd()]} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${sarabun.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <RateLimitToast />
        <Toaster richColors position="top-right" />
        <Script id="sw-register" strategy="afterInteractive">{`
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').catch(function(err) {
        console.log('SW registration failed:', err)
      })
    })
  }
`}</Script>
      </body>
    </html>
  )
}
