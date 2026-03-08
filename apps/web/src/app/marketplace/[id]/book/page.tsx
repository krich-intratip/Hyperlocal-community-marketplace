import type { Metadata } from 'next'
import BookingFormClient from './_booking-form'
import { getListingById } from '@/lib/mock-listings'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const listing = getListingById(id)
  if (!listing) return buildMetadata({ title: 'จองบริการ', noIndex: true })
  return buildMetadata({
    title: `จอง ${listing.title}`,
    description: `จองบริการ ${listing.title} โดย ${listing.provider} ในชุมชน ${listing.community} ราคา ฿${listing.price}/${listing.unit}`,
    path: `/marketplace/${id}/book`,
    noIndex: true,
  })
}

export function generateStaticParams() {
  return ['1','2','3','4','5','6','7','8','9','10','11','12'].map((id) => ({ id }))
}

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BookingFormClient id={id} />
}
