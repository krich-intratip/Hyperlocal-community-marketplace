// Mock analytics data for Provider Command Center (Phase 14)

// ── Revenue & Bookings Trend (12 months) ────────────────────────────────────────

export interface RevenueTrendPoint {
  month: string
  revenue: number
  bookings: number
  avgOrder: number
}

export const REVENUE_TREND: RevenueTrendPoint[] = [
  { month: 'เม.ย.', revenue: 8_400,  bookings: 42,  avgOrder: 200 },
  { month: 'พ.ค.',  revenue: 9_200,  bookings: 46,  avgOrder: 200 },
  { month: 'มิ.ย.', revenue: 10_800, bookings: 54,  avgOrder: 200 },
  { month: 'ก.ค.',  revenue: 11_200, bookings: 56,  avgOrder: 200 },
  { month: 'ส.ค.',  revenue: 13_400, bookings: 67,  avgOrder: 200 },
  { month: 'ก.ย.',  revenue: 12_800, bookings: 64,  avgOrder: 200 },
  { month: 'ต.ค.',  revenue: 14_200, bookings: 71,  avgOrder: 200 },
  { month: 'พ.ย.',  revenue: 16_800, bookings: 84,  avgOrder: 200 },
  { month: 'ธ.ค.',  revenue: 21_400, bookings: 107, avgOrder: 200 },
  { month: 'ม.ค.',  revenue: 18_600, bookings: 93,  avgOrder: 200 },
  { month: 'ก.พ.',  revenue: 22_200, bookings: 111, avgOrder: 200 },
  { month: 'มี.ค.', revenue: 25_800, bookings: 129, avgOrder: 200 },
]

// ── Bookings by Day of Week ──────────────────────────────────────────────────────

export interface BookingByDay {
  day: string
  bookings: number
  revenue: number
}

export const BOOKINGS_BY_DAY: BookingByDay[] = [
  { day: 'จ',  bookings: 18, revenue: 3_600 },
  { day: 'อ',  bookings: 15, revenue: 3_000 },
  { day: 'พ',  bookings: 22, revenue: 4_400 },
  { day: 'พฤ', bookings: 19, revenue: 3_800 },
  { day: 'ศ',  bookings: 28, revenue: 5_600 },
  { day: 'ส',  bookings: 35, revenue: 7_000 },
  { day: 'อา', bookings: 29, revenue: 5_800 },
]

// ── Rating Trend (6 months) ──────────────────────────────────────────────────────

export interface RatingTrendPoint {
  month: string
  rating: number
  reviews: number
}

export const RATING_TREND: RatingTrendPoint[] = [
  { month: 'ต.ค.',  rating: 4.60, reviews: 12 },
  { month: 'พ.ย.',  rating: 4.70, reviews: 18 },
  { month: 'ธ.ค.',  rating: 4.75, reviews: 24 },
  { month: 'ม.ค.',  rating: 4.80, reviews: 22 },
  { month: 'ก.พ.',  rating: 4.85, reviews: 28 },
  { month: 'มี.ค.', rating: 4.90, reviews: 32 },
]

// ── Booking Status Distribution (Pie) ───────────────────────────────────────────

export interface StatusPieItem {
  name: string
  value: number
  color: string
}

export const BOOKING_STATUS_PIE: StatusPieItem[] = [
  { name: 'เสร็จสมบูรณ์',    value: 78, color: '#22c55e' },
  { name: 'กำลังดำเนินการ',  value: 12, color: '#3b82f6' },
  { name: 'ยกเลิก',           value: 10, color: '#ef4444' },
]

// ── Rating Distribution ──────────────────────────────────────────────────────────

export interface RatingDistItem {
  star: number
  count: number
  pct: number
}

export const RATING_DISTRIBUTION: RatingDistItem[] = [
  { star: 5, count: 82, pct: 63 },
  { star: 4, count: 31, pct: 24 },
  { star: 3, count: 11, pct: 8  },
  { star: 2, count: 5,  pct: 4  },
  { star: 1, count: 1,  pct: 1  },
]

// ── Mock Reviews with Sentiment ──────────────────────────────────────────────────

export type ReviewSentiment = 'positive' | 'neutral' | 'negative'

export interface MockReview {
  id: string
  customer: string
  rating: number
  date: string
  text: string
  sentiment: ReviewSentiment
  listing: string
  replied: boolean
  replyText?: string
}

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: 'R001',
    customer: 'คุณวิภา ส.',
    rating: 5,
    date: '2026-03-08',
    text: 'อาหารอร่อยมาก สะอาด ส่งตรงเวลา รสชาติถูกปาก จะสั่งอีกแน่นอนค่ะ',
    sentiment: 'positive',
    listing: 'อาหารกล่องส่งถึงที่',
    replied: true,
    replyText: 'ขอบคุณมากนะคะ ยินดีบริการเสมอค่ะ 😊',
  },
  {
    id: 'R002',
    customer: 'คุณสมศักดิ์ ก.',
    rating: 5,
    date: '2026-03-07',
    text: 'สั่งมาหลายครั้งแล้ว ไม่เคยผิดหวัง ปริมาณเยอะ อิ่มมาก',
    sentiment: 'positive',
    listing: 'อาหารกล่องส่งถึงที่',
    replied: false,
  },
  {
    id: 'R003',
    customer: 'คุณนิตยา พ.',
    rating: 4,
    date: '2026-03-06',
    text: 'โดยรวมดีค่ะ แต่ส่งช้ากว่าที่บอกไว้นิดหน่อย รสชาติโอเคค่ะ',
    sentiment: 'neutral',
    listing: 'อาหารคลีนออเดอร์ล่วงหน้า',
    replied: true,
    replyText: 'ขออภัยในความล่าช้านะคะ จะปรับปรุงให้ดีขึ้นค่ะ',
  },
  {
    id: 'R004',
    customer: 'คุณประหยัด ม.',
    rating: 5,
    date: '2026-03-05',
    text: 'สะอาดมาก อาหารสด บรรจุภัณฑ์ดี แนะนำมากครับ',
    sentiment: 'positive',
    listing: 'อาหารกล่องส่งถึงที่',
    replied: false,
  },
  {
    id: 'R005',
    customer: 'คุณมาลี ต.',
    rating: 3,
    date: '2026-03-04',
    text: 'รสชาติดี แต่ราคาค่อนข้างแพงเมื่อเทียบกับร้านอื่น',
    sentiment: 'neutral',
    listing: 'อาหารคลีนออเดอร์ล่วงหน้า',
    replied: false,
  },
  {
    id: 'R006',
    customer: 'คุณอรุณ ว.',
    rating: 2,
    date: '2026-03-02',
    text: 'อาหารไม่สด กลิ่นไม่ดี ผิดหวังมากครับ คิดว่าจะไม่สั่งอีกแล้ว',
    sentiment: 'negative',
    listing: 'อาหารกล่องส่งถึงที่',
    replied: true,
    replyText: 'ขออภัยอย่างสูงนะคะ จะตรวจสอบคุณภาพให้ดีขึ้นค่ะ ขอส่วนลดชดเชยด้วยนะคะ',
  },
  {
    id: 'R007',
    customer: 'คุณจารุวรรณ น.',
    rating: 5,
    date: '2026-03-01',
    text: 'สั่งประจำทุกวันเลย อร่อยมาก เจ้าของร้านใจดีด้วย',
    sentiment: 'positive',
    listing: 'อาหารกล่องส่งถึงที่',
    replied: false,
  },
  {
    id: 'R008',
    customer: 'คุณพรชัย บ.',
    rating: 4,
    date: '2026-02-28',
    text: 'อาหารอร่อย จัดส่งไวดี แค่อยากให้มีเมนูมากกว่านี้',
    sentiment: 'neutral',
    listing: 'อาหารคลีนออเดอร์ล่วงหน้า',
    replied: false,
  },
  {
    id: 'R009',
    customer: 'คุณสุภาพร ร.',
    rating: 5,
    date: '2026-02-25',
    text: 'ดีทุกอย่างเลยค่ะ รสชาติ ความสะอาด การส่ง จะแนะนำเพื่อนต่อนะคะ',
    sentiment: 'positive',
    listing: 'อาหารกล่องส่งถึงที่',
    replied: true,
    replyText: 'ขอบคุณมากนะคะ 🙏',
  },
  {
    id: 'R010',
    customer: 'คุณธนกฤต จ.',
    rating: 5,
    date: '2026-02-22',
    text: 'เยี่ยมมากครับ อาหารครบ สะอาด ราคาคุ้มค่า',
    sentiment: 'positive',
    listing: 'อาหารกล่องส่งถึงที่',
    replied: false,
  },
]

// ── Mini Sparkline (last 7 days revenue) ─────────────────────────────────────────

export const SPARKLINE_7D = [3200, 2800, 4100, 3600, 4800, 5200, 4400]

// ── Summary KPIs for dashboard header ───────────────────────────────────────────

export interface ProviderSummary {
  totalRevenueMtd: number
  revenueGrowth: number        // % vs prev month
  totalBookingsMtd: number
  bookingsGrowth: number
  avgRating: number
  ratingGrowth: number
  repeatCustomerRate: number   // %
  performanceScore: number     // 0–100
}

export const PROVIDER_SUMMARY: ProviderSummary = {
  totalRevenueMtd: 25_800,
  revenueGrowth: 16.2,
  totalBookingsMtd: 129,
  bookingsGrowth: 16.2,
  avgRating: 4.9,
  ratingGrowth: 0.05,
  repeatCustomerRate: 67,
  performanceScore: 82,
}
