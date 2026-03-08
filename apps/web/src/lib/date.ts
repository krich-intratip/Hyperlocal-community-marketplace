type Locale = 'th' | 'en'

function resolveDate(date: Date | string | null | undefined): Date | null {
  if (!date) return null
  const d = typeof date === 'string' ? new Date(date) : date
  return isNaN(d.getTime()) ? null : d
}

/**
 * Format date as dd/mm/yyyy
 * - locale 'th' (default): year is พ.ศ. (+543)
 * - locale 'en': year is ค.ศ.
 */
export function formatDate(date: Date | string | null | undefined, locale: Locale = 'th'): string {
  const d = resolveDate(date)
  if (!d) return '—'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = locale === 'th' ? d.getFullYear() + 543 : d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

/** Format with time: dd/mm/yyyy HH:mm (พ.ศ. or ค.ศ. based on locale) */
export function formatDateTime(date: Date | string | null | undefined, locale: Locale = 'th'): string {
  const d = resolveDate(date)
  if (!d) return '—'
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${formatDate(d, locale)} ${hh}:${min}`
}

/**
 * Long format:
 * - th: "วันจันทร์ที่ 8 มีนาคม พ.ศ. 2569"
 * - en: "Monday, 8 March 2026"
 */
export function formatDateLong(date: Date | string | null | undefined, locale: Locale = 'th'): string {
  const d = resolveDate(date)
  if (!d) return '—'
  if (locale === 'en') {
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }
  const day = d.toLocaleDateString('th-TH', { weekday: 'long' })
  const dayNum = d.getDate()
  const month = d.toLocaleDateString('th-TH', { month: 'long' })
  const year = d.getFullYear() + 543
  return `${day}ที่ ${dayNum} ${month} พ.ศ. ${year}`
}

/**
 * Short format:
 * - th: "8 มี.ค. 2569"
 * - en: "8 Mar 2026"
 */
export function formatDateShort(date: Date | string | null | undefined, locale: Locale = 'th'): string {
  const d = resolveDate(date)
  if (!d) return '—'
  if (locale === 'en') {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const dayNum = d.getDate()
  const month = d.toLocaleDateString('th-TH', { month: 'short' })
  const year = d.getFullYear() + 543
  return `${dayNum} ${month} ${year}`
}

/** Parse dd/mm/yyyy (CE) input from HTML date input (which gives yyyy-mm-dd) to display พ.ศ. */
export function inputDateToDisplay(isoDate: string, locale: Locale = 'th'): string {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-')
  const year = locale === 'th' ? Number(y) + 543 : Number(y)
  return `${d}/${m}/${year}`
}

/** Convert พ.ศ. year to ค.ศ. for HTML date inputs */
export function buddhToGreg(be: number): number {
  return be - 543
}
