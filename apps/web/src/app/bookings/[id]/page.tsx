import BookingDetailClient from './_booking-detail'

export function generateStaticParams() {
  return [
    'B240301', 'B240298', 'B240285', 'B240270', 'B240255',
    'B240240', 'B240225', 'B240210',
  ].map((id) => ({ id }))
}

export default function BookingDetailPage() {
  return <BookingDetailClient />
}
