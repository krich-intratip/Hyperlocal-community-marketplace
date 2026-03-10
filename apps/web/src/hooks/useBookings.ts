'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '@/lib/api'
import type { CreateBookingDto } from '@/types'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

// ── Types ─────────────────────────────────────────────────────────────────────
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | 'pending'

export interface MockBooking {
  id: string
  listingId: string
  listingTitle: string
  listingImage: string
  provider: string
  providerAvatar: string
  date: string
  time: string
  qty: number
  unit: string
  price: number
  total: number
  status: BookingStatus
  address: string
  note?: string
  menuItems?: string[]
  community: string
  reviewLeft?: boolean
  cancelReason?: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_BOOKINGS: MockBooking[] = [
  { id: 'B240301', listingId: '1', listingTitle: 'ขายอาหารกล่อง ส้มตำ ลาบ', listingImage: '🍱', provider: 'แม่สมร อาหารอีสาน', providerAvatar: '👩‍🍳', date: '2026-03-10', time: '11:00', qty: 2, unit: 'กล่อง', price: 55, total: 110, status: 'upcoming', address: '89/12 หมู่บ้านศรีนคร ซ.3', community: 'หมู่บ้านศรีนคร' },
  { id: 'B240298', listingId: '3', listingTitle: 'สอนพิเศษคณิตศาสตร์ ม.ต้น', listingImage: '📚', provider: 'ครูน้องใหม่', providerAvatar: '👩‍🏫', date: '2026-03-08', time: '14:00', qty: 1, unit: 'ชั่วโมง', price: 300, total: 300, status: 'upcoming', address: 'ออนไลน์ Zoom', community: 'คอนโด The Base' },
  { id: 'B240285', listingId: '2', listingTitle: 'ซ่อมแซมบ้านทั่วไป', listingImage: '🔧', provider: 'ช่างสมชาย', providerAvatar: '👨‍🔧', date: '2026-02-20', time: '09:00', qty: 1, unit: 'งาน', price: 500, total: 500, status: 'completed', address: '12/4 ถ.พหลโยธิน', community: 'หมู่บ้านศรีนคร', reviewLeft: false },
  { id: 'B240270', listingId: '5', listingTitle: 'บริการทำความสะอาดบ้าน', listingImage: '🏠', provider: 'ทีมแม่บ้านสะอาด', providerAvatar: '🧹', date: '2026-02-15', time: '08:00', qty: 1, unit: 'ครั้ง', price: 800, total: 800, status: 'completed', address: '45 ซ.ลาดพร้าว 10', community: 'ชุมชนเมืองทอง', reviewLeft: true },
  { id: 'B240255', listingId: '7', listingTitle: 'นวดแผนไทย นวดผ่อนคลาย', listingImage: '💆', provider: 'หมอนวด ป้าอ้อย', providerAvatar: '💆‍♀️', date: '2026-02-05', time: '15:00', qty: 2, unit: 'ชั่วโมง', price: 250, total: 500, status: 'cancelled', address: 'ร้านนวดสวรรค์ ชั้น 1', community: 'หมู่บ้านกรีนวิลล์', cancelReason: 'ติดธุระด่วน' },
  { id: 'B240240', listingId: '4', listingTitle: 'ดูแลผู้สูงอายุรายวัน', listingImage: '👴', provider: 'พี่พยาบาลจันทร์', providerAvatar: '👩‍⚕️', date: '2026-01-28', time: '08:00', qty: 1, unit: 'วัน', price: 600, total: 600, status: 'completed', address: '23/1 หมู่ 5', community: 'ชุมชนริมน้ำ', reviewLeft: false },
  { id: 'B240225', listingId: '6', listingTitle: 'ขนมทำมือ เค้ก คุ้กกี้', listingImage: '🍰', provider: 'เบเกอรี่ป้าแดง', providerAvatar: '👩‍🍳', date: '2026-01-15', time: '10:00', qty: 2, unit: 'กล่อง', price: 180, total: 360, status: 'completed', address: 'รับที่ร้าน', community: 'หมู่บ้านกรีนวิลล์', reviewLeft: true },
  { id: 'B240210', listingId: '9', listingTitle: 'สอนโยคะ ฟิตเนสชุมชน', listingImage: '🧘', provider: 'ครูโยคะ มินต์', providerAvatar: '🧘‍♀️', date: '2026-01-10', time: '07:00', qty: 4, unit: 'ครั้ง', price: 150, total: 600, status: 'completed', address: 'สวนสาธารณะชุมชน', community: 'เมืองเชียงใหม่ซิตี้', reviewLeft: false },
  { id: 'B240195', listingId: '13', listingTitle: 'คลาสทำอาหารเหนือ เชียงใหม่', listingImage: '🍜', provider: 'เชฟนุ้ย ครัวล้านนา', providerAvatar: '👩‍🍳', date: '2026-03-15', time: '10:00', qty: 2, unit: 'คน', price: 800, total: 1600, status: 'upcoming', address: 'ครัวล้านนา ถ.นิมมานเฮมิน ซ.9 เชียงใหม่', community: 'นิมมานเฮมิน วิลเลจ' },
  { id: 'B240180', listingId: '14', listingTitle: 'สปานวดล้านนา อโรมาเทอราพี', listingImage: '🌸', provider: 'สปาล้านนา', providerAvatar: '💆‍♀️', date: '2026-02-28', time: '14:00', qty: 1, unit: 'ชั่วโมง', price: 1200, total: 1200, status: 'completed', address: 'สปาล้านนา ย่านนิมมานเฮมิน เชียงใหม่', community: 'นิมมานเฮมิน วิลเลจ', reviewLeft: false },
  { id: 'B240165', listingId: '15', listingTitle: 'ไกด์เดินป่าดอยสุเทพ', listingImage: '🌿', provider: 'ไกด์นุ เดินป่าดอย', providerAvatar: '🧗', date: '2026-02-22', time: '06:00', qty: 3, unit: 'คน', price: 600, total: 1800, status: 'completed', address: 'จุดนัดพบ ประตูทางขึ้นดอยสุเทพ เชียงใหม่', community: 'เมืองเชียงใหม่ซิตี้', reviewLeft: true },
  { id: 'B240150', listingId: '16', listingTitle: 'อาหารทะเลสด ปากน้ำ ภูเก็ต', listingImage: '🦐', provider: 'ป้าหนู ซีฟู้ด', providerAvatar: '👩‍🍳', date: '2026-03-18', time: '18:00', qty: 4, unit: 'จาน', price: 350, total: 1400, status: 'upcoming', address: 'ป้าหนู ซีฟู้ด หาดป่าตอง ภูเก็ต', community: 'ป่าตอง ซีไซด์' },
  { id: 'B240135', listingId: '17', listingTitle: 'เรียนดำน้ำ PADI Open Water', listingImage: '🤿', provider: 'ครูดำน้ำ อาร์ม', providerAvatar: '🏊', date: '2026-03-20', time: '08:00', qty: 1, unit: 'คอร์ส', price: 3500, total: 3500, status: 'upcoming', address: 'Dive Center หาดกะรน ภูเก็ต', community: 'ป่าตอง ซีไซด์' },
  { id: 'B240120', listingId: '18', listingTitle: 'ส้มตำ ลาบ อีสานแท้ ขอนแก่น', listingImage: '🌶️', provider: 'ร้านป้าแดง ส้มตำอีสาน', providerAvatar: '👩‍🍳', date: '2026-02-10', time: '11:30', qty: 3, unit: 'จาน', price: 60, total: 180, status: 'completed', address: 'ตลาดขอนแก่น ถ.มิตรภาพ', community: 'ขอนแก่น อัพทาวน์', reviewLeft: true },
  { id: 'B240105', listingId: '20', listingTitle: 'จัดสวน ดูแลสวนรายเดือน', listingImage: '🌱', provider: 'ทีมสวนสวย บางใหญ่', providerAvatar: '🌿', date: '2026-03-25', time: '09:00', qty: 1, unit: 'ครั้ง', price: 800, total: 800, status: 'upcoming', address: '99 หมู่ 3 บางใหญ่ นนทบุรี', community: 'ชุมชนเมืองทอง' },
  // Phase 13: bookings จากชุมชนทั่วประเทศ
  { id: 'B240090', listingId: '21', listingTitle: 'ก๋วยเตี๋ยวเนื้อสไตล์นครสวรรค์', listingImage: '🍜', provider: 'ร้านก๋วยเตี๋ยวนครสวรรค์', providerAvatar: '🍜', date: '2026-03-28', time: '11:00', qty: 3, unit: 'ชาม', price: 60, total: 180, status: 'upcoming', address: 'ร้านก๋วยเตี๋ยวนครสวรรค์ ถ.โกสีย์ เมืองนคร', community: 'นครสวรรค์ เมือง' },
  { id: 'B240075', listingId: '23', listingTitle: 'ล่องแก่งแม่น้ำแควน้อย กาญจนบุรี', listingImage: '🛶', provider: 'ไกด์ล่องแก่งกาญจน์', providerAvatar: '🛶', date: '2026-04-05', time: '07:30', qty: 4, unit: 'คน', price: 850, total: 3400, status: 'upcoming', address: 'จุดนัดพบ ท่าเรือแก่งกระจาน กาญจนบุรี', community: 'กาญจนบุรี ริเวอร์' },
  { id: 'B240060', listingId: '25', listingTitle: 'เซรามิคลำปาง สั่งทำตามแบบ', listingImage: '🏺', provider: 'เซรามิคลำปาง ช่างบุ', providerAvatar: '🏺', date: '2026-02-18', time: '10:00', qty: 6, unit: 'ชิ้น', price: 350, total: 2100, status: 'completed', address: 'โรงงานเซรามิค ถ.ลำปาง-งาว อ.เมือง', community: 'ลำปาง เซรามิค', reviewLeft: false },
]

// ── Query keys ────────────────────────────────────────────────────────────────
export const bookingKeys = {
  all: ['bookings'] as const,
  list: (status?: BookingStatus | 'all') => [...bookingKeys.all, 'list', status] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
}

// ── Fetchers ──────────────────────────────────────────────────────────────────
async function fetchBookings(status?: BookingStatus | 'all'): Promise<MockBooking[]> {
  if (USE_REAL_API) {
    const apiStatus = (!status || status === 'all') ? undefined : status.toUpperCase() as string
    const res = await bookingsApi.list(apiStatus ? { status: apiStatus as never } : undefined)
    return res.data.data as unknown as MockBooking[]
  }
  await new Promise((r) => setTimeout(r, 150))
  if (!status || status === 'all') return MOCK_BOOKINGS
  return MOCK_BOOKINGS.filter((b) => b.status === status)
}

async function fetchBookingById(id: string): Promise<MockBooking | null> {
  if (USE_REAL_API) {
    const res = await bookingsApi.get(id)
    return res.data.data as unknown as MockBooking
  }
  await new Promise((r) => setTimeout(r, 100))
  return MOCK_BOOKINGS.find((b) => b.id === id) ?? null
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useBookings(status?: BookingStatus | 'all') {
  return useQuery({
    queryKey: bookingKeys.list(status),
    queryFn: () => fetchBookings(status),
    staleTime: 30 * 1000,
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => fetchBookingById(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  })
}

export function useCancelBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      if (USE_REAL_API) {
        await bookingsApi.cancel(id, reason)
        return { id, reason }
      }
      await new Promise((r) => setTimeout(r, 600))
      return { id, reason }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}

export function useCreateBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateBookingDto) => {
      if (USE_REAL_API) {
        const res = await bookingsApi.create(dto)
        return res.data.data as unknown as MockBooking
      }
      await new Promise((r) => setTimeout(r, 600))
      return { id: `B${Date.now().toString().slice(-6)}` } as MockBooking
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}
