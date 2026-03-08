import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'Community Hyper Marketplace',
    template: '%s | Community Hyper Marketplace',
  },
  description:
    'แพลตฟอร์มตลาดบริการชุมชนแบบดิจิทัล — เชื่อมต่อผู้ให้บริการในพื้นที่กับผู้อยู่อาศัยในชุมชน',
  keywords: ['marketplace', 'community', 'hyperlocal', 'services', 'thailand'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${sarabun.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
