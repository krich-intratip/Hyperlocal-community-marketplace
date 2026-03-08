import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'ชุมชน — ค้นหาชุมชนในพื้นที่ของคุณ',
  description: 'เปิดดูชุมชนในพื้นที่ของคุณ ค้นหาผู้ให้บริการและบริการที่หลากหลายในแต่ละชุมชน เชื่อมต่อกับคนในชุมชนได้อย่างง่ายดาย',
  path: '/communities',
  keywords: ['ชุมชน', 'หมู่บ้าน', 'คอนโด', 'ผู้ให้บริการท้องถิ่น', 'community'],
})

export default function CommunitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
