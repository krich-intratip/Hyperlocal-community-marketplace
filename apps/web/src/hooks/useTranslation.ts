'use client'
import { useLangStore } from '@/store/lang-store'
import { t, getTranslations } from '@/lib/i18n'
import type { Lang } from '@/store/lang-store'

export function useTranslation() {
  const lang = useLangStore(s => s.lang)
  return {
    lang,
    t: (key: Parameters<typeof t>[0]) => t(key, lang),
    translations: getTranslations(lang),
  }
}

export type { Lang }
