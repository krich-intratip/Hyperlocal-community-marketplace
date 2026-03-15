import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'th' | 'en'

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLangStore = create<LangState>()(
  persist(
    set => ({
      lang: 'th',
      setLang: (lang: Lang) => set({ lang }),
    }),
    { name: 'chm-lang' }
  )
)
