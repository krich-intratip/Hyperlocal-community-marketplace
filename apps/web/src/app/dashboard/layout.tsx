import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Dashboard',
  description: 'จัดการบัญชี บริการ รายได้ และการจองของคุณใน Community Hyper Marketplace',
  path: '/dashboard',
  noIndex: true,
})

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
