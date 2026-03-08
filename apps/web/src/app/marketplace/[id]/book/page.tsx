import BookingFormClient from './_booking-form'

export function generateStaticParams() {
  return ['1','2','3','4','5','6','7','8','9','10','11','12'].map((id) => ({ id }))
}

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BookingFormClient id={id} />
}
