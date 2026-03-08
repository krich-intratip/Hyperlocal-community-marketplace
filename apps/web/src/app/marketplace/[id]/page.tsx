import ListingDetailClient from './_listing-page'

export function generateStaticParams() {
  return ['1','2','3','4','5','6','7','8','9','10','11','12'].map((id) => ({ id }))
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ListingDetailClient id={id} />
}
