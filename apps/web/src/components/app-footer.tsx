'use client'

import { APP_VERSION, APP_UPDATED, APP_DEVELOPER, APP_NAME } from '@/lib/version'
import { useDateFormat } from '@/hooks/useDateFormat'

export function AppFooter() {
  const { fmtShort, locale } = useDateFormat()
  const updatedLabel = locale === 'en' ? 'Last updated' : 'อัพเดทล่าสุด'
  const displayDate = fmtShort(APP_UPDATED)

  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400 dark:text-slate-500">
          <span>© 2026 {APP_NAME}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
              v{APP_VERSION}
            </span>
            <span className="text-xs">{updatedLabel} {displayDate}</span>
            <span className="text-xs font-semibold text-blue-500">by {APP_DEVELOPER}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
