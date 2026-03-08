import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/lib/i18n'

interface UiState {
  theme: 'light' | 'dark'
  locale: Locale
  toggleTheme: () => void
  setLocale: (locale: Locale) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light',
      locale: 'th',
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'light' ? 'dark' : 'light'
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark')
          }
          return { theme: next }
        }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'chm-ui' }
  )
)
