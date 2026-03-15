'use client'
import { useLangStore } from '@/store/lang-store'
import type { Lang } from '@/store/lang-store'

export function LangSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLangStore()

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {(['th', 'en'] as Lang[]).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
            lang === l
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
          }`}
        >
          {l === 'th' ? '🇹🇭 TH' : '🇬🇧 EN'}
        </button>
      ))}
    </div>
  )
}
