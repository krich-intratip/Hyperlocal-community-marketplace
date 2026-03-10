import { NotificationType } from '@chm/shared-types'

export interface MockNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string // ISO 8601
  read: boolean
  actionUrl?: string
  icon: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function hoursAgo(h: number): string {
  const d = new Date()
  d.setHours(d.getHours() - h)
  return d.toISOString()
}

function daysAgo(n: number, h = 10): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(h, 0, 0, 0)
  return d.toISOString()
}

// ── Mock Data (12 notifications across all major NotificationType values) ────
export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'n1',
    type: NotificationType.BOOKING_CONFIRMED,
    title: 'ยืนยันการจองแล้ว',
    message: 'คุณแม่ศรี ยืนยันการจองนวดแผนไทย วันพฤหัสบดีที่ 13 มีนาคม เวลา 14:00',
    timestamp: hoursAgo(1),
    read: false,
    actionUrl: '/bookings/BK-2026-001',
    icon: '✅',
  },
  {
    id: 'n2',
    type: NotificationType.REVIEW_RECEIVED,
    title: 'ได้รับรีวิวใหม่ ⭐⭐⭐⭐⭐',
    message: 'สมชาย รัตนเจริญ: "บริการดีมาก ตรงเวลา แนะนำเลยครับ!" — ให้ 5 ดาว',
    timestamp: hoursAgo(3),
    read: false,
    actionUrl: '/dashboard/reviews',
    icon: '⭐',
  },
  {
    id: 'n3',
    type: NotificationType.PROMOTION_BROADCAST,
    title: 'โปรโมชั่นจากชุมชน ลาดพร้าว 71',
    message: 'ลด 20% สำหรับบริการทำความสะอาดบ้านทุกวันอังคาร–พฤหัสบดีสัปดาห์นี้เท่านั้น!',
    timestamp: hoursAgo(5),
    read: false,
    actionUrl: '/marketplace?category=HOME_SERVICES',
    icon: '🎉',
  },
  {
    id: 'n4',
    type: NotificationType.BOOKING_PAYMENT_HELD,
    title: 'ชำระเงินสำเร็จ — เงินถูก Hold ไว้',
    message: 'เงิน ฿350 สำหรับบริการสอนภาษาอังกฤษถูก hold ในระบบ Escrow แล้ว',
    timestamp: hoursAgo(8),
    read: false,
    actionUrl: '/bookings/BK-2026-002',
    icon: '💳',
  },
  {
    id: 'n5',
    type: NotificationType.BOOKING_COMPLETED,
    title: 'งานเสร็จสมบูรณ์ — ได้รับเงินแล้ว',
    message: 'บริการซ่อมแอร์เสร็จสมบูรณ์ คุณได้รับ ฿890 เข้าบัญชีแล้ว',
    timestamp: daysAgo(1, 14),
    read: true,
    actionUrl: '/dashboard/earnings',
    icon: '🏆',
  },
  {
    id: 'n6',
    type: NotificationType.PROVIDER_APPROVED,
    title: 'บัญชี Provider ได้รับการอนุมัติ!',
    message: 'ยินดีด้วย! บัญชีของคุณในชุมชน สุขุมวิท 77 ได้รับการอนุมัติแล้ว เริ่มรับงานได้เลย',
    timestamp: daysAgo(2, 9),
    read: true,
    actionUrl: '/dashboard',
    icon: '🎊',
  },
  {
    id: 'n7',
    type: NotificationType.DISPUTE_RESOLVED,
    title: 'ข้อพิพาทได้รับการแก้ไขแล้ว',
    message: 'CA ตัดสินให้คุณชนะข้อพิพาท #DS-2026-004 จะได้รับเงินคืน ฿250 ภายใน 24h',
    timestamp: daysAgo(3, 15),
    read: true,
    actionUrl: '/bookings',
    icon: '⚖️',
  },
  {
    id: 'n8',
    type: NotificationType.BOOKING_CANCELLED,
    title: 'การจองถูกยกเลิก',
    message: 'น่าเสียดาย — ผู้ให้บริการยกเลิกการจองสวนผัก Organic วันที่ 15 มีนาคม',
    timestamp: daysAgo(3, 11),
    read: true,
    actionUrl: '/marketplace',
    icon: '❌',
  },
  {
    id: 'n9',
    type: NotificationType.PROMOTION_APPROVED,
    title: 'โปรโมชั่นได้รับการอนุมัติ',
    message: 'CA อนุมัติโปรโมชั่น "ลด 15% สำหรับลูกค้าใหม่" ของคุณแล้ว เริ่มใช้งานได้วันนี้',
    timestamp: daysAgo(4, 16),
    read: true,
    actionUrl: '/dashboard/promotions',
    icon: '✨',
  },
  {
    id: 'n10',
    type: NotificationType.BOOKING_COMPLETED_BY_PROVIDER,
    title: 'กรุณายืนยันการรับบริการ',
    message: 'Provider แจ้งว่าบริการซักผ้าเสร็จแล้ว กรุณายืนยันภายใน 72 ชั่วโมง',
    timestamp: daysAgo(5, 8),
    read: true,
    actionUrl: '/bookings/BK-2026-003',
    icon: '⏰',
  },
  {
    id: 'n11',
    type: NotificationType.BOOKING_NO_SHOW_WARNING,
    title: 'ผู้ให้บริการยังไม่มาถึง',
    message: 'เกิน 12 ชั่วโมงแล้ว ต้องการรายงาน No-Show หรือไม่? กรุณายืนยันภายใน 6h',
    timestamp: daysAgo(6, 13),
    read: true,
    actionUrl: '/bookings/BK-2026-005',
    icon: '⚠️',
  },
  {
    id: 'n12',
    type: NotificationType.DISPUTE_OPENED,
    title: 'มีข้อพิพาทใหม่',
    message: 'ลูกค้า มณี สุขดี เปิดข้อพิพาทสำหรับการจอง #BK-2026-007 — CA กำลังตรวจสอบ',
    timestamp: daysAgo(7, 10),
    read: true,
    actionUrl: '/dashboard/disputes',
    icon: '🚨',
  },
]
