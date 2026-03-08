import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'การแจ้งเตือน',
  description: 'ดูการแจ้งเตือนล่าสุดของคุณ การจอง ข้อความ และกิจกรรมในชุมชน',
  path: '/notifications',
  noIndex: true,
})

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
