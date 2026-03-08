import type { Metadata } from 'next'
import CommunityDetailClient from './_community-page'
import { buildMetadata } from '@/lib/seo'

const COMMUNITY_NAMES: Record<string, string> = {
  '1': 'หมู่บ้านศรีนคร',
  '2': 'คอนโด The Base',
  '3': 'ชุมชนเมืองทอง',
  '4': 'หมู่บ้านกรีนวิลล์',
  '5': 'ชุมชนริมน้ำ',
  '6': 'เมืองเชียงใหม่ซิตี้',
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const name = COMMUNITY_NAMES[id] ?? `ชุมชน #${id}`
  return buildMetadata({
    title: name,
    description: `เปิดดูบริการและผู้ให้บริการใน${name} ค้นหาบริการอาหาร ช่าง งานบ้าน และอื่นๆ ในชุมชนของคุณ`,
    path: `/communities/${id}`,
    keywords: [name, 'ชุมชน', 'ผู้ให้บริการ', 'ตลาดชุมชน'],
  })
}

export function generateStaticParams() {
  return ['1', '2', '3', '4', '5', '6'].map((id) => ({ id }))
}

export default function CommunityDetailPage() {
  return <CommunityDetailClient />
}
