'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

export type NotifType = 'booking' | 'review' | 'promo' | 'system'

export interface MockNotification {
  id: string
  type: NotifType
  title: string
  body: string
  read: boolean
  createdAt: string
  href?: string
}

const MOCK_NOTIFS: MockNotification[] = [
  { id: 'n1', type: 'booking', title: 'การจองได้รับการยืนยัน', body: 'การจอง #B240301 ขายอาหารกล่อง ส้มตำ ลาบ วันที่ 10 มี.ค. ได้รับการยืนยันแล้ว', read: false, createdAt: '2026-03-08T08:00:00', href: '/bookings/B240301' },
  { id: 'n2', type: 'promo', title: 'โปรโมชั่นพิเศษ!', body: 'ลด 20% สำหรับการจองบริการทำความสะอาดในสัปดาห์นี้ รีบจองก่อนหมดเขต', read: false, createdAt: '2026-03-07T14:30:00', href: '/marketplace' },
  { id: 'n3', type: 'review', title: 'อย่าลืมรีวิว!', body: 'คุณยังไม่ได้รีวิวบริการ "ซ่อมแซมบ้านทั่วไป" จากช่างสมชาย', read: false, createdAt: '2026-03-06T10:00:00', href: '/bookings/B240285' },
  { id: 'n4', type: 'system', title: 'อัปเดตนโยบายความเป็นส่วนตัว', body: 'เราได้อัปเดตนโยบายความเป็นส่วนตัวของเรา โปรดอ่านรายละเอียดเพิ่มเติม', read: true, createdAt: '2026-03-05T09:00:00' },
  { id: 'n5', type: 'booking', title: 'ผู้ให้บริการกำลังเดินทาง', body: 'ทีมแม่บ้านสะอาดกำลังเดินทางมาให้บริการ คาดว่าจะถึงใน 15 นาที', read: true, createdAt: '2026-03-04T07:45:00', href: '/bookings/B240270' },
  { id: 'n6', type: 'promo', title: 'สมาชิกใหม่ในชุมชนของคุณ', body: 'มีผู้ให้บริการใหม่ 3 ราย เข้ามาในหมู่บ้านศรีนคร มาดูบริการใหม่ๆ กัน!', read: true, createdAt: '2026-03-03T12:00:00', href: '/communities/1' },
]

export const notifKeys = {
  all: ['notifications'] as const,
  list: () => [...notifKeys.all, 'list'] as const,
  unreadCount: () => [...notifKeys.all, 'unread'] as const,
}

async function fetchNotifications(): Promise<MockNotification[]> {
  if (USE_REAL_API) {
    const res = await notificationsApi.list()
    const apiData = (res.data?.data ?? res.data ?? []) as any[]
    return apiData.map((n: any) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: n.isRead ?? n.read ?? false,
      createdAt: n.createdAt,
      href: n.href ?? undefined,
    }))
  }
  await new Promise((r) => setTimeout(r, 100))
  return MOCK_NOTIFS
}

export function useNotifications() {
  return useQuery({
    queryKey: notifKeys.list(),
    queryFn: fetchNotifications,
    staleTime: 30 * 1000,
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notifKeys.unreadCount(),
    queryFn: async () => {
      const notifs = await fetchNotifications()
      return notifs.filter((n) => !n.read).length
    },
    staleTime: 15 * 1000,
  })
}

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_REAL_API) {
        await notificationsApi.markRead(id)
        return
      }
      await new Promise((r) => setTimeout(r, 150))
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notifKeys.all })
    },
  })
}

export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      if (USE_REAL_API) {
        await notificationsApi.markAllRead()
        return
      }
      await new Promise((r) => setTimeout(r, 300))
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notifKeys.all })
    },
  })
}
