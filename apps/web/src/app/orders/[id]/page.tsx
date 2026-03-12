import OrderDetailClient from './_order-detail'

// Pre-render representative order IDs; other IDs work via client-side navigation
export function generateStaticParams() {
  return [
    'ORD-001', 'ORD-002', 'ORD-003', 'ORD-004', 'ORD-005',
    'ORD-006', 'ORD-007', 'ORD-008', 'ORD-009', 'ORD-010',
  ].map((id) => ({ id }))
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OrderDetailClient id={id} />
}
