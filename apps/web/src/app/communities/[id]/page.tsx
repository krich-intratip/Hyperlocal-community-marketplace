import CommunityDetailClient from './_community-page'

export function generateStaticParams() {
  return ['1', '2', '3', '4', '5', '6'].map((id) => ({ id }))
}

export default function CommunityDetailPage() {
  return <CommunityDetailClient />
}
