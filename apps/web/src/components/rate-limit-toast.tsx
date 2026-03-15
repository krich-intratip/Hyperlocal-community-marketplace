'use client'
import { useEffect, useState } from 'react'

export function RateLimitToast() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent<{ message: string }>).detail.message
      setMessage(msg)
      setTimeout(() => setMessage(null), 5000)
    }
    window.addEventListener('rate-limit', handler)
    return () => window.removeEventListener('rate-limit', handler)
  }, [])

  if (!message) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
      <div className="glass-card rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 border border-amber-200">
        <span className="text-xl">⚠️</span>
        <p className="text-sm font-medium text-amber-700">{message}</p>
      </div>
    </div>
  )
}
