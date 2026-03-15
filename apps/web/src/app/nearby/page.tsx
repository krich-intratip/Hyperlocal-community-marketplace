import { Suspense } from 'react'
import { NearbyPageInner } from './_nearby-page'

export default function NearbyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <NearbyPageInner />
    </Suspense>
  )
}
