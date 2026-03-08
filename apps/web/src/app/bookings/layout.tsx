import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'การจองของฉัน',
  description: 'ติดตามสถานะการจองบริการของคุณ ดูประวัติการจอง ยกเลิก หรือเขียนรีวิวหลังใช้บริการ',
  path: '/bookings',
  noIndex: true,
})

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
