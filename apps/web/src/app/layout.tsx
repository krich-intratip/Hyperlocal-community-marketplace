import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'
import { JsonLd } from '@/components/json-ld'
import { buildMetadata, websiteJsonLd, organizationJsonLd, marketplaceJsonLd } from '@/lib/seo'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = buildMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <JsonLd data={[websiteJsonLd(), organizationJsonLd(), marketplaceJsonLd()]} />
      </head>
      <body className={`${sarabun.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
