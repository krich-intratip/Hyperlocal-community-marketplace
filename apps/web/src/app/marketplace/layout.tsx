import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Marketplace — ค้นหาบริการในชุมชน',
  description: 'ค้นหาและจองบริการจากผู้ให้บริการในชุมชนของคุณ ครอบคลุมกว่า 10 หมวดบริการ อาหาร ช่าง งานบ้าน สอนพิเศษ สุขภาพ และอีกมากมาย',
  path: '/marketplace',
  keywords: ['marketplace', 'ตลาดบริการ', 'ค้นหาบริการ', 'บริการชุมชน', 'ผู้ให้บริการ'],
})

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
