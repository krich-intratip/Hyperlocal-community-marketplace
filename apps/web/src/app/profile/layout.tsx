import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'โปรไฟล์ของฉัน',
  description: 'จัดการโปรไฟล์ ข้อมูลส่วนตัว และการตั้งค่าบัญชีของคุณใน Community Hyper Marketplace',
  path: '/profile',
  noIndex: true,
})

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
