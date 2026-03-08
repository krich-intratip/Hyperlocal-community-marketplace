/** Format a date as dd/mm/yyyy in Buddhist Era (พ.ศ.) */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear() + 543
  return `${dd}/${mm}/${yyyy}`
}

/** Format with time: dd/mm/yyyy HH:mm */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${formatDate(d)} ${hh}:${min}`
}

/** Long format: "วันจันทร์ที่ 8 มีนาคม พ.ศ. 2569" */
export function formatDateLong(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  const day = d.toLocaleDateString('th-TH', { weekday: 'long' })
  const dayNum = d.getDate()
  const month = d.toLocaleDateString('th-TH', { month: 'long' })
  const year = d.getFullYear() + 543
  return `${day}ที่ ${dayNum} ${month} พ.ศ. ${year}`
}

/** Short Thai month name: "8 มี.ค. 2569" */
export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  const dayNum = d.getDate()
  const month = d.toLocaleDateString('th-TH', { month: 'short' })
  const year = d.getFullYear() + 543
  return `${dayNum} ${month} ${year}`
}

/** Parse dd/mm/yyyy (CE) input from HTML date input (which gives yyyy-mm-dd) to display พ.ศ. */
export function inputDateToDisplay(isoDate: string): string {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${Number(y) + 543}`
}

/** Convert พ.ศ. year to ค.ศ. for HTML date inputs */
export function buddhToGreg(be: number): number {
  return be - 543
}
