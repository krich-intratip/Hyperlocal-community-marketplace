'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">เกิดข้อผิดพลาด</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {error.message || 'ไม่สามารถโหลดหน้า Dashboard ได้ในขณะนี้'}
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 font-mono">ref: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <RefreshCw className="h-4 w-4" /> ลองใหม่
        </button>
      </div>
    </div>
  )
}
