'use client'

import { useUiStore } from '@/store/ui.store'
import { formatDate, formatDateShort, formatDateLong, formatDateTime, inputDateToDisplay } from '@/lib/date'

/**
 * Returns locale-aware date formatting functions.
 * - locale 'th': year is พ.ศ. (+543)
 * - locale 'en': year is ค.ศ.
 */
export function useDateFormat() {
  const locale = useUiStore((s) => s.locale) as 'th' | 'en'

  return {
    /** dd/mm/yyyy */
    fmt: (date: Date | string | null | undefined) => formatDate(date, locale),
    /** dd/mm/yyyy HH:mm */
    fmtDT: (date: Date | string | null | undefined) => formatDateTime(date, locale),
    /** "8 มี.ค. 2569" or "8 Mar 2026" */
    fmtShort: (date: Date | string | null | undefined) => formatDateShort(date, locale),
    /** "วันจันทร์ที่ 8 มีนาคม พ.ศ. 2569" or "Monday, 8 March 2026" */
    fmtLong: (date: Date | string | null | undefined) => formatDateLong(date, locale),
    /** HTML date input → dd/mm/yyyy display */
    fmtInput: (isoDate: string) => inputDateToDisplay(isoDate, locale),
    locale,
  }
}
