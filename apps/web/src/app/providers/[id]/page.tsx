import ProviderProfileClient from './_provider-profile'

export function generateStaticParams() {
  return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((id) => ({ id }))
}

export default function ProviderProfilePage() {
  return <ProviderProfileClient />
}
