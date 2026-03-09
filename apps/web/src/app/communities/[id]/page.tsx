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
  '7': 'นิมมานเฮมิน วิลเลจ',
  '8': 'ป่าตอง ซีไซด์',
  '9': 'ขอนแก่น อัพทาวน์',
  '10': 'หาดใหญ่ สมาร์ทซิตี้',
  '11': 'สุขุมวิท อาร์บัน',
  '12': 'เชียงราย เมืองเก่า',
  '13': 'โคราช พลาซ่า',
  '14': 'ระยอง ซีวิว',
  '15': 'เกาะสมุย บีชซิตี้',
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
  return ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'].map((id) => ({ id }))
}

export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CommunityDetailClient id={id} />
}
