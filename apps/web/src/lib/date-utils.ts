/**
 * date-utils.ts — ระบบแสดงวันที่/เวลาสำหรับ Community Hyper Marketplace
 *
 * กฎที่บังคับใช้ตลอดโปรเจค (DEV-JOURNEY.md #DATE-001):
 *  - รูปแบบวันที่: dd/mm/yyyy (วัน/เดือน/ปี)
 *  - ปีเป็น พ.ศ. (Gregorian CE + 543)
 *  - เวลาเป็น 24 ชั่วโมง (HH:mm)
 *  - ห้ามใช้ toLocaleDateString() หรือ Intl.DateTimeFormat โดยตรงในหน้า UI
 *  - ทุกการแสดงวันที่/เวลาต้องผ่าน utility นี้เท่านั้น
 *
 * ──────────────────────────────────────────────────────────────
 * MONTH NAMES (อ้างอิงตัวย่อราชบัณฑิต)
 */

const MONTH_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const MONTH_LONG  = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']

// CE → พ.ศ. (Buddhist Era)
const toBE = (year: number): number => year + 543

// Zero-pad to 2 digits
const pad2 = (n: number): string => String(n).padStart(2, '0')

// Normalise input: accepts Date, ISO string, or timestamp
function toDate(input: Date | string | number): Date {
  if (input instanceof Date) return input
  return new Date(input)
}

// ── Core Formatters ───────────────────────────────────────────────────────────

/**
 * Short date: "10/03/2569"  (dd/mm/พ.ศ.)
 */
export function formatDateTH(input: Date | string | number): string {
  const d = toDate(input)
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${toBE(d.getFullYear())}`
}

/**
 * Medium date: "10 มี.ค. 2569"
 */
export function formatDateMedTH(input: Date | string | number): string {
  const d = toDate(input)
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${toBE(d.getFullYear())}`
}

/**
 * Long date: "10 มีนาคม 2569"
 */
export function formatDateLongTH(input: Date | string | number): string {
  const d = toDate(input)
  return `${d.getDate()} ${MONTH_LONG[d.getMonth()]} ${toBE(d.getFullYear())}`
}

/**
 * Time only (24h): "14:30"
 */
export function formatTimeTH(input: Date | string | number): string {
  const d = toDate(input)
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

/**
 * Date + time: "10/03/2569 14:30"
 */
export function formatDateTimeTH(input: Date | string | number): string {
  return `${formatDateTH(input)} ${formatTimeTH(input)}`
}

/**
 * Date + time (medium): "10 มี.ค. 2569 เวลา 14:30 น."
 */
export function formatDateTimeMedTH(input: Date | string | number): string {
  return `${formatDateMedTH(input)} เวลา ${formatTimeTH(input)} น.`
}

// ── Relative Time ─────────────────────────────────────────────────────────────

/**
 * Relative time in Thai: "เมื่อกี้", "5 นาทีที่แล้ว", "3 ชม.ที่แล้ว", "2 วันที่แล้ว"
 * Falls back to formatDateMedTH for dates > 7 days ago.
 */
export function relativeTimeTH(input: Date | string | number): string {
  const diff = Date.now() - toDate(input).getTime()
  const secs  = Math.floor(diff / 1000)
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)

  if (secs < 60)    return 'เมื่อกี้'
  if (mins < 60)    return `${mins} นาทีที่แล้ว`
  if (hours < 24)   return `${hours} ชม.ที่แล้ว`
  if (days === 1)   return 'เมื่อวาน'
  if (days <= 7)    return `${days} วันที่แล้ว`
  return formatDateMedTH(input)
}

// ── Date Group (for notification/activity lists) ──────────────────────────────

/**
 * Returns a Thai group label for use in date-grouped lists.
 * "วันนี้" | "เมื่อวาน" | "สัปดาห์นี้" | "ก่อนหน้า"
 */
export function dateGroupTH(input: Date | string | number): string {
  const days = Math.floor((Date.now() - toDate(input).getTime()) / 86_400_000)
  if (days === 0) return 'วันนี้'
  if (days === 1) return 'เมื่อวาน'
  if (days <= 7)  return 'สัปดาห์นี้'
  return 'ก่อนหน้า'
}

// ── Calendar / Booking Helpers ────────────────────────────────────────────────

/**
 * Format a booking slot: "พฤหัสบดี 13 มี.ค. 2569 เวลา 14:00 น."
 */
const DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']

export function formatBookingSlotTH(input: Date | string | number): string {
  const d = toDate(input)
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${toBE(d.getFullYear())} เวลา ${formatTimeTH(d)} น.`
}

/**
 * Format a date range: "10/03/2569 – 15/03/2569"
 */
export function formatDateRangeTH(
  start: Date | string | number,
  end: Date | string | number,
): string {
  return `${formatDateTH(start)} – ${formatDateTH(end)}`
}

/**
 * Current date as Thai string (for "today" labels)
 */
export function todayTH(): string {
  return formatDateTH(new Date())
}

/**
 * Month abbreviation in Thai: "มี.ค." (for calendar widgets)
 */
export function getMonthShortTH(input: Date | string | number): string {
  return MONTH_SHORT[toDate(input).getMonth()]
}
