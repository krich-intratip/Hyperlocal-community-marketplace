import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'เข้าสู่ระบบ / สมัครสมาชิก',
  description: 'เข้าสู่ระบบหรือสมัครสมาชิก Community Hyper Marketplace เพื่อเริ่มใช้บริการและค้นหาผู้ให้บริการในชุมชนของคุณ',
  path: '/auth',
  noIndex: true,
})

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
