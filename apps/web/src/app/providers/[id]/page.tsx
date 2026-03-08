import type { Metadata } from 'next'
import ProviderProfileClient from './_provider-profile'
import { buildMetadata } from '@/lib/seo'
import { MOCK_LISTINGS } from '@/lib/mock-listings'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const listing = MOCK_LISTINGS.find(l => l.id === id)
  if (!listing) return buildMetadata({ title: 'ผู้ให้บริการ', noIndex: true })
  return buildMetadata({
    title: `${listing.provider} — ผู้ให้บริการ`,
    description: `โปรไฟล์ ${listing.provider} ใน ${listing.community} — ${listing.title} ราคา ฿${listing.price}/${listing.unit} คะแนน ${listing.rating} ดาว`,
    path: `/providers/${id}`,
    keywords: [listing.provider, listing.community, listing.category, ...listing.tags],
  })
}

export function generateStaticParams() {
  return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((id) => ({ id }))
}

export default function ProviderProfilePage() {
  return <ProviderProfileClient />
}
