import type { Metadata } from 'next'
import ListingDetailClient from './_listing-page'
import { getListingById } from '@/lib/mock-listings'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const listing = getListingById(id)
  if (!listing) return buildMetadata({ title: 'ไม่พบบริการ', noIndex: true })
  return buildMetadata({
    title: listing.title,
    description: listing.description,
    path: `/marketplace/${id}`,
    keywords: [listing.category, listing.provider, listing.community, ...listing.tags],
  })
}

export function generateStaticParams() {
  return ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',
          '16','17','18','19','20','21','22','23','24','25'].map((id) => ({ id }))
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ListingDetailClient id={id} />
}
