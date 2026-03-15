import { Suspense } from 'react'
import MapPageClient from './_map-page'

export default function MapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>}>
      <MapPageClient />
    </Suspense>
  )
}
