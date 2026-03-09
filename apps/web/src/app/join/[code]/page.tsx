import JoinPageClient from './_join-page'

export function generateStaticParams() {
  return [{ code: '_' }]
}

export default function JoinPage() {
  return <JoinPageClient />
}
