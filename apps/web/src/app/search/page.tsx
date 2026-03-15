import { Suspense } from 'react'
import { SearchPageInner } from './_search-page'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  )
}
