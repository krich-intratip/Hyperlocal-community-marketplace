import DeliveryTrackingClient from './_tracking'

// Pre-render sample tracking IDs; others resolve at client side
export function generateStaticParams() {
  return [
    'LM-001234', 'LM-001235', 'LM-001236', 'LM-001237', 'LM-001238',
    'LM-948271', 'LM-839162', 'LM-720053',
    'GX-001234', 'GX-001235', 'GX-001236', 'GX-001237', 'GX-001238',
    'GX-948271', 'GX-839162', 'GX-720053',
  ].map((trackingId) => ({ trackingId }))
}

export default async function DeliveryTrackingPage({
  params,
}: {
  params: Promise<{ trackingId: string }>
}) {
  const { trackingId } = await params
  return <DeliveryTrackingClient trackingId={trackingId} />
}
