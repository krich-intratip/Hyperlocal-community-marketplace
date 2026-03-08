import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'สมัครเป็นผู้ให้บริการ',
  description: 'สมัครเป็นผู้ให้บริการใน Community Hyper Marketplace เพิ่มรายได้จากทักษะและบริการของคุณในชุมชน',
  path: '/providers/apply',
  keywords: ['สมัครผู้ให้บริการ', 'provider', 'เพิ่มรายได้', 'ชุมชน'],
})

export default function ProvidersApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
