'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Languages } from 'lucide-react'
import { useUiStore } from '@/store/ui.store'

export function ThemeLanguageToggle() {
  const { theme, locale, toggleTheme, setLocale } = useUiStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="flex items-center gap-1">
      {/* Language switcher */}
      <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
        <button
          onClick={() => setLocale('th')}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold transition-colors ${
            locale === 'th'
              ? 'bg-blue-600 text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
          }`}
        >
          ไทย
        </button>
        <button
          onClick={() => setLocale('en')}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold transition-colors ${
            locale === 'en'
              ? 'bg-blue-600 text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
          }`}
        >
          EN
        </button>
      </div>

      {/* Theme toggle */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={toggleTheme}
        className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:border-blue-300"
        title={theme === 'light' ? 'เปลี่ยนเป็น Dark mode' : 'เปลี่ยนเป็น Light mode'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'light' ? (
            <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Moon className="h-4 w-4 text-slate-600" />
            </motion.div>
          ) : (
            <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sun className="h-4 w-4 text-amber-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
