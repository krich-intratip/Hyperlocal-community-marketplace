import { useUiStore } from '@/store/ui.store'
import { translations } from '@/lib/i18n'

export function useT() {
  const locale = useUiStore((s) => s.locale)
  return translations[locale]
}
