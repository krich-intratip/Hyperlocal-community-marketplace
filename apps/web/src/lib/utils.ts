import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDateLongTH } from '@/lib/date-utils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format date as Thai long format: "10 มีนาคม 2569" (dd/mm/พ.ศ.) */
export function formatThaiDate(date: string | Date): string {
  return formatDateLongTH(date)
}

export function formatCurrency(amount: number, currency = 'THB'): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}
