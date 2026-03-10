import BookingDetailClient from './_booking-detail'

export function generateStaticParams() {
  return [
    'B240301', 'B240298', 'B240285', 'B240270', 'B240255',
    'B240240', 'B240225', 'B240210',
    'B240195', 'B240180', 'B240165', 'B240150',
    'B240135', 'B240120', 'B240105',
    'B240090', 'B240075', 'B240060',
  ].map((id) => ({ id }))
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BookingDetailClient id={id} />
}
