import { Suspense } from 'react'
import MessagesPageInner from './_messages-page'

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400 text-sm">กำลังโหลด...</div>
      </div>
    }>
      <MessagesPageInner />
    </Suspense>
  )
}
