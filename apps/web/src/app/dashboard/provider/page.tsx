'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { AppFooter } from '@/components/app-footer'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import {
  TrendingUp, Star, CalendarCheck, DollarSign, Plus, Clock, CheckCircle, Eye,
  PauseCircle, PlayCircle, LogOut, AlertTriangle, X, MapPin, ShieldCheck,
  BarChart3, Zap, MessageCircle, UmbrellaOff, Umbrella, Loader2, Package, Boxes,
} from 'lucide-react'
import { useState } from 'react'
import { useDateFormat } from '@/hooks/useDateFormat'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { SPARKLINE_7D, PROVIDER_SUMMARY } from '@/lib/mock-provider-analytics'
import { useSetVacation } from '@/hooks/useVacation'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07 },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const MOCK_ORDERS = [
  { id: 'O001', customer: 'คุณวิภา',      service: 'อาหารกล่อง ×3', date: '2026-03-08', time: '11:00', status: 'confirmed', amount: 240 },
  { id: 'O002', customer: 'คุณสมศักดิ์',  service: 'อาหารกล่อง ×2', date: '2026-03-08', time: '12:00', status: 'pending',   amount: 160 },
  { id: 'O003', customer: 'คุณนิตยา',     service: 'อาหารกล่อง ×5', date: '2026-03-07', time: '11:30', status: 'completed', amount: 400 },
  { id: 'O004', customer: 'คุณประหยัด',   service: 'อาหารกล่อง ×1', date: '2026-03-06', time: '12:00', status: 'completed', amount: 80  },
]

const MOCK_LISTINGS = [
  { id: '1', title: 'ทำอาหารกล่องส่งถึงที่',      price: 80,  unit: 'กล่อง', views: 234, bookings: 128, rating: 4.9, active: true },
  { id: '2', title: 'อาหารคลีนออเดอร์ล่วงหน้า',   price: 120, unit: 'กล่อง', views: 89,  bookings: 34,  rating: 4.8, active: true },
]

const ORDER_STATUS_CONFIG = {
  confirmed: { label: 'ยืนยันแล้ว', bg: 'glass-sm',  text: 'text-primary',  border: 'border-primary/30'  },
  pending:   { label: 'รอยืนยัน',   bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  completed: { label: 'เสร็จแล้ว',  bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
}

/* ── Provider operational status types ── */
type ProviderStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'LEFT'

const PROVIDER_STATUS_CONFIG: Record<ProviderStatus, { label: string; badge: string; dot: string }> = {
  ACTIVE:    { label: 'กำลังให้บริการ',       badge: 'bg-green-100 text-green-700 border-green-200',  dot: 'bg-green-500'  },
  SUSPENDED: { label: 'หยุดชั่วคราว',          badge: 'bg-amber-100 text-amber-700 border-amber-200',  dot: 'bg-amber-400'  },
  INACTIVE:  { label: 'เลิกกิจการ',            badge: 'glass-sm text-slate-500 border-slate-200',  dot: 'bg-slate-400'  },
  LEFT:      { label: 'ออกจากชุมชนแล้ว',       badge: 'bg-red-100 text-red-600 border-red-200',        dot: 'bg-red-400'    },
}

/* ── Mock provider profile ── */
const MOCK_PROVIDER = {
  name: 'คุณแม่สมใจ',
  community: 'หมู่บ้านศรีนคร',
  communityId: '1',
  area: 'บางแค, กรุงเทพฯ',
  address: '12/3 ซ.บางแค 5 แขวงบางแค เขตบางแค กรุงเทพฯ 10160',
  locationLat: 13.7205,
  locationLng: 100.4215,
  kycStatus: 'VERIFIED' as const,
  trustScore: 98,
  emoji: '👩‍🍳',
}

type ModalType = 'suspend' | 'reactivate' | 'deactivate' | 'leave' | null
type ShopStatus = 'OPEN' | 'VACATION' | 'CLOSED'

export default function ProviderDashboardPage() {
  useAuthGuard(['provider', 'admin', 'superadmin'])
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>('ACTIVE')
  const [modal, setModal]                   = useState<ModalType>(null)
  const [leaveReason, setLeaveReason]       = useState('')
  const [actionDone, setActionDone]         = useState(false)

  // Vacation / Shop status
  const [shopStatus, setShopStatus]             = useState<ShopStatus>('OPEN')
  const [vacationMsg, setVacationMsg]           = useState('')
  const [vacationUntil, setVacationUntil]       = useState('')
  const [showVacationModal, setShowVacationModal] = useState(false)
  const [vacationDone, setVacationDone]         = useState(false)
  const setVacation = useSetVacation()

  async function handleSetVacation() {
    try {
      await setVacation.mutateAsync({
        shopStatus: 'VACATION',
        vacationMessage: vacationMsg || undefined,
        vacationUntil: vacationUntil || undefined,
      })
    } catch { /* ignore — mock */ }
    setShopStatus('VACATION')
    setShowVacationModal(false)
    setVacationDone(true)
    setTimeout(() => setVacationDone(false), 3000)
  }

  async function handleEndVacation() {
    try {
      await setVacation.mutateAsync({ shopStatus: 'OPEN' })
    } catch { /* ignore — mock */ }
    setShopStatus('OPEN')
    setVacationMsg('')
    setVacationUntil('')
    setVacationDone(true)
    setTimeout(() => setVacationDone(false), 3000)
  }

  const { fmt } = useDateFormat()
  const thisMonthRevenue = MOCK_ORDERS.filter(o => o.status !== 'pending').reduce((s, o) => s + o.amount, 0)
  const completedOrders  = MOCK_ORDERS.filter(o => o.status === 'completed').length
  const statusCfg        = PROVIDER_STATUS_CONFIG[providerStatus]

  const handleConfirm = (action: ModalType) => {
    if (action === 'suspend')     setProviderStatus('SUSPENDED')
    if (action === 'reactivate')  setProviderStatus('ACTIVE')
    if (action === 'deactivate')  setProviderStatus('INACTIVE')
    if (action === 'leave')       setProviderStatus('LEFT')
    setModal(null)
    setActionDone(true)
    setTimeout(() => setActionDone(false), 3000)
  }

  const isOperational = providerStatus === 'ACTIVE' || providerStatus === 'SUSPENDED'

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm text-slate-500 mb-1">แดชบอร์ดผู้ให้บริการ</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">คุณแม่สมใจ 👩‍🍳</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full glass-sm0 rounded-full" style={{ width: '98%' }} />
                </div>
                <span className="text-xs font-semibold text-primary">Trust 98</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 border">
                <Zap className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-bold text-purple-700">Score {PROVIDER_SUMMARY.performanceScore}</span>
              </div>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/dashboard/provider/listings"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 transition-colors">
              <Plus className="h-4 w-4" /> เพิ่ม Listing
            </Link>
          </motion.div>
        </motion.div>

        {/* Revenue stats */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'รายได้เดือนนี้', value: `฿${thisMonthRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'งานทั้งหมด', value: MOCK_ORDERS.length, icon: CalendarCheck, color: 'text-primary', bg: 'glass-sm' },
            { label: 'งานเสร็จแล้ว', value: completedOrders, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'คะแนนรีวิว', value: '4.9 ⭐', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} custom={i} whileHover={{ y: -3 }}
              className="p-5 rounded-2xl glass-card">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="glass-card rounded-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/20">
              <h2 className="font-bold text-slate-900">คำสั่งจอง</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                {MOCK_ORDERS.filter(o => o.status === 'pending').length} รอยืนยัน
              </span>
            </div>
            <div className="divide-y divide-white/10">
              {MOCK_ORDERS.map((order, i) => {
                const cfg = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG]
                return (
                  <div key={order.id} className="flex items-center gap-3 p-4 hover:glass-sm/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-sm">{order.customer}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{order.service}</div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />{fmt(order.date)} · {order.time}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-slate-900 text-sm">฿{order.amount}</div>
                      <div className={`inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {cfg.label}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* My Listings */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="glass-card rounded-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/20">
              <h2 className="font-bold text-slate-900">Listings ของฉัน</h2>
              <Link href="/dashboard/provider/listings" className="text-sm text-primary font-medium hover:text-blue-700 flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> เพิ่ม
              </Link>
            </div>
            <div className="divide-y divide-white/10">
              {MOCK_LISTINGS.map((listing) => (
                <div key={listing.id} className="p-4 hover:glass-sm/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-800 text-sm">{listing.title}</h3>
                    <div className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      listing.active ? 'bg-green-100 text-green-600' : 'glass-sm text-slate-500'
                    }`}>
                      {listing.active ? 'เผยแพร่' : 'ซ่อน'}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="font-bold text-slate-700">฿{listing.price}/{listing.unit}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{listing.views}</span>
                    <span className="flex items-center gap-1"><CalendarCheck className="h-3 w-3" />{listing.bookings} จอง</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{listing.rating}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-slate-600">ยอดรวมเดือนนี้: <strong className="text-green-600">฿{thisMonthRevenue.toLocaleString()}</strong></span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Command Center Navigation ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="mt-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-slate-600" />
            <h2 className="font-bold text-slate-800 text-sm">Command Center</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

            {/* Analytics */}
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link href="/dashboard/provider/analytics"
                className="flex flex-col p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-primary/30 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                    <BarChart3 className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-primary bg-blue-100 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <p className="font-bold text-blue-900 text-sm mb-0.5">Analytics</p>
                <p className="text-xs text-primary mb-3">กราฟรายได้ · การจอง · Rating Trend</p>
                {/* Mini Sparkline */}
                <div className="flex items-end gap-0.5 h-8">
                  {SPARKLINE_7D.map((v, i) => {
                    const maxV = Math.max(...SPARKLINE_7D)
                    return (
                      <div key={i} className="flex-1 rounded-t-sm bg-blue-400/60"
                        style={{ height: `${(v / maxV) * 100}%` }} />
                    )
                  })}
                </div>
              </Link>
            </motion.div>

            {/* Insights */}
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link href="/dashboard/provider/insights"
                className="flex flex-col p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
                    <Zap className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">AI</span>
                </div>
                <p className="font-bold text-purple-900 text-sm mb-0.5">AI Insights</p>
                <p className="text-xs text-purple-600 mb-3">วิเคราะห์เชิงลึก · KPI · คำแนะนำ</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-purple-200 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${PROVIDER_SUMMARY.performanceScore}%` }} />
                  </div>
                  <span className="text-xs font-bold text-purple-700">{PROVIDER_SUMMARY.performanceScore}</span>
                </div>
              </Link>
            </motion.div>

            {/* Reviews */}
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link href="/dashboard/provider/reviews"
                className="flex flex-col p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
                    <MessageCircle className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    {thisMonthRevenue > 0 ? '4 ใหม่' : '0 ใหม่'}
                  </span>
                </div>
                <p className="font-bold text-amber-900 text-sm mb-0.5">รีวิว</p>
                <p className="text-xs text-amber-600 mb-3">Sentiment · ตอบรีวิว · Rating</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i <= 5 ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                  <span className="ml-1 text-xs font-bold text-amber-700">4.9</span>
                </div>
              </Link>
            </motion.div>

            {/* Incoming Orders */}
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link href="/dashboard/provider/orders"
                className="flex flex-col p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                    <Package className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {MOCK_ORDERS.filter(o => o.status === 'pending').length} รอยืนยัน
                  </span>
                </div>
                <p className="font-bold text-emerald-900 text-sm mb-0.5">ออเดอร์ขาเข้า</p>
                <p className="text-xs text-emerald-600 mb-3">ยืนยัน · อัพเดทสถานะ · ติดตาม</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-emerald-800">{MOCK_ORDERS.length}</span>
                  <span className="text-xs text-emerald-600">ออเดอร์ทั้งหมด</span>
                </div>
              </Link>
            </motion.div>

            {/* Flash Sale & Promotions */}
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link href="/dashboard/provider/promotions"
                className="flex flex-col p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-400 flex items-center justify-center">
                    <Zap className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">Flash</span>
                </div>
                <p className="font-bold text-rose-900 text-sm mb-0.5">โปรโมชั่น</p>
                <p className="text-xs text-rose-600 mb-3">Flash Sale · ลดราคา · Countdown</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-rose-700">%</span>
                  <span className="text-xs text-rose-600">ตั้งโปรโมชั่น</span>
                </div>
              </Link>
            </motion.div>

            {/* Earnings */}
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link href="/dashboard/provider/earnings"
                className="flex flex-col p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center">
                    <DollarSign className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">฿</span>
                </div>
                <p className="font-bold text-green-900 text-sm mb-0.5">รายได้</p>
                <p className="text-xs text-green-600 mb-3">ยอดขาย · สุทธิ · รอโอน · CSV</p>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs text-green-700 font-bold">+12% เดือนนี้</span>
                </div>
              </Link>
            </motion.div>

            {/* Inventory */}
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link href="/dashboard/provider/inventory"
                className="flex flex-col p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center">
                    <Boxes className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">Stock</span>
                </div>
                <p className="font-bold text-violet-900 text-sm mb-0.5">คลังสินค้า</p>
                <p className="text-xs text-violet-600 mb-3">Stock · แจ้งเตือนต่ำ · Auto-inactive</p>
                <div className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-violet-600" />
                  <span className="text-xs text-violet-700 font-bold">จัดการสต็อก</span>
                </div>
              </Link>
            </motion.div>

          </div>
        </motion.div>

        {/* ── Shop Vacation / Closure Mode ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7}
          className="mt-6 glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
            <div className="flex items-center gap-2">
              <UmbrellaOff className="h-4 w-4 text-slate-600" />
              <h2 className="font-bold text-slate-900">สถานะร้านค้า (Vacation Mode)</h2>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
              shopStatus === 'OPEN'     ? 'bg-green-100 text-green-700 border-green-200' :
              shopStatus === 'VACATION' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                         'bg-red-100 text-red-600 border-red-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                shopStatus === 'OPEN' ? 'bg-green-500' : shopStatus === 'VACATION' ? 'bg-amber-400' : 'bg-red-500'
              }`} />
              {shopStatus === 'OPEN' ? 'เปิดให้บริการ' : shopStatus === 'VACATION' ? 'พักร้าน (Vacation)' : 'ปิดร้าน'}
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Success toast */}
            <AnimatePresence>
              {vacationDone && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700 font-medium">อัพเดตสถานะร้านค้าเรียบร้อยแล้ว</span>
                </motion.div>
              )}
            </AnimatePresence>

            {shopStatus === 'OPEN' && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">ร้านของคุณกำลังเปิดให้บริการ ลูกค้าสามารถจองบริการได้ตามปกติ</p>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowVacationModal(true)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 transition-all text-left">
                  <UmbrellaOff className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">เปิด Vacation Mode (พักร้านชั่วคราว)</p>
                    <p className="text-xs text-amber-600">Listings จะแสดงแบนเนอร์ "ร้านปิดชั่วคราว" ให้ลูกค้าทราบ</p>
                  </div>
                </motion.button>
              </div>
            )}

            {shopStatus === 'VACATION' && (
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <UmbrellaOff className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">ร้านอยู่ในโหมดพักร้อน</p>
                    {vacationMsg && <p className="text-xs text-amber-700 mt-0.5">{vacationMsg}</p>}
                    {vacationUntil && <p className="text-xs text-amber-600 mt-0.5">กลับมาวันที่: <strong>{vacationUntil}</strong></p>}
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={handleEndVacation}
                  disabled={setVacation.isPending}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-all text-left disabled:opacity-60">
                  {setVacation.isPending
                    ? <Loader2 className="h-5 w-5 text-green-500 animate-spin flex-shrink-0" />
                    : <Umbrella className="h-5 w-5 text-green-500 flex-shrink-0" />}
                  <div>
                    <p className="text-sm font-bold text-green-700">กลับมาเปิดร้านอีกครั้ง</p>
                    <p className="text-xs text-green-600">ยกเลิก Vacation Mode — ลูกค้าจองได้ทันที</p>
                  </div>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Revenue note */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={9}
          className="mt-6 p-5 rounded-2xl glass border border-primary/20">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-800 text-sm">ค่า Commission แพลตฟอร์ม</p>
              <p className="text-xs text-primary mt-0.5">
                แพลตฟอร์มเก็บ 10–12% จากยอดบุ๊กกิ้งที่สำเร็จ ในช่วงทดลองใช้งานไม่มีค่าใช้จ่าย
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Provider Profile & Status Management ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={10}
          className="mt-6 glass-card rounded-2xl overflow-hidden">

          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
            <h2 className="font-bold text-slate-900">สถานะการให้บริการ</h2>
            {/* Current status badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusCfg.badge}`}>
              <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </div>
          </div>

          {/* Profile info */}
          <div className="px-6 py-4 border-b border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400">ชุมชนที่สังกัด</p>
                <p className="font-semibold text-slate-800">{MOCK_PROVIDER.community} — {MOCK_PROVIDER.area}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400">ที่อยู่ / ที่ตั้งร้าน</p>
                <p className="font-semibold text-slate-800 text-xs leading-relaxed">{MOCK_PROVIDER.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">KYC / ยืนยันตัวตน</p>
                <p className="font-semibold text-green-600 text-xs">ผ่านการยืนยันแล้ว ✓</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">{MOCK_PROVIDER.emoji}</span>
              <div>
                <p className="text-xs text-slate-400">GPS Location</p>
                <p className="font-semibold text-slate-700 text-xs">
                  {MOCK_PROVIDER.locationLat.toFixed(4)}, {MOCK_PROVIDER.locationLng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* Success toast */}
          <AnimatePresence>
            {actionDone && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mx-6 mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700 font-medium">อัพเดตสถานะเรียบร้อยแล้ว</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="px-6 py-5 space-y-3">

            {/* ACTIVE → can suspend, deactivate, leave */}
            {providerStatus === 'ACTIVE' && (
              <>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setModal('suspend')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 transition-all text-left">
                  <PauseCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">หยุดให้บริการชั่วคราว</p>
                    <p className="text-xs text-amber-600">พักก่อน — กลับมาเปิดรับงานได้ตลอดเวลา</p>
                  </div>
                </motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setModal('deactivate')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 glass-sm hover:glass-sm transition-all text-left">
                  <X className="h-5 w-5 text-slate-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">เลิกกิจการ</p>
                    <p className="text-xs text-slate-500">ปิดโปรไฟล์ถาวร — ต้องให้ Admin เปิดใหม่</p>
                  </div>
                </motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setModal('leave')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-all text-left">
                  <LogOut className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-700">ออกจากชุมชนนี้</p>
                    <p className="text-xs text-red-500">ย้ายที่อยู่หรือเหตุผลอื่น — สมัครชุมชนใหม่ได้ด้วยบัญชีเดิม</p>
                  </div>
                </motion.button>
              </>
            )}

            {/* SUSPENDED → can reactivate, leave */}
            {providerStatus === 'SUSPENDED' && (
              <>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setModal('reactivate')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-all text-left">
                  <PlayCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-700">กลับมาให้บริการ</p>
                    <p className="text-xs text-green-600">เปิดรับงานใหม่ในชุมชน {MOCK_PROVIDER.community}</p>
                  </div>
                </motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setModal('leave')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-all text-left">
                  <LogOut className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-700">ออกจากชุมชนนี้</p>
                    <p className="text-xs text-red-500">ย้ายที่อยู่หรือเหตุผลอื่น — สมัครชุมชนใหม่ได้ด้วยบัญชีเดิม</p>
                  </div>
                </motion.button>
              </>
            )}

            {/* LEFT → prompt to re-apply */}
            {providerStatus === 'LEFT' && (
              <div className="text-center py-4">
                <div className="text-3xl mb-3">🏘️</div>
                <p className="font-bold text-slate-800 mb-1">คุณออกจากชุมชนนี้แล้ว</p>
                <p className="text-sm text-slate-500 mb-4">
                  บัญชีของคุณยังอยู่ สามารถสมัครเข้าชุมชนใหม่ได้เลย
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <a href="/providers/apply"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 transition-colors">
                    สมัครชุมชนใหม่ →
                  </a>
                </motion.div>
              </div>
            )}

            {/* INACTIVE → contact admin */}
            {providerStatus === 'INACTIVE' && (
              <div className="text-center py-4">
                <div className="text-3xl mb-3">⏸️</div>
                <p className="font-bold text-slate-700 mb-1">โปรไฟล์ถูกปิดการใช้งาน</p>
                <p className="text-sm text-slate-500">
                  ติดต่อ Community Admin เพื่อขอเปิดใช้งานอีกครั้ง
                </p>
              </div>
            )}
          </div>
        </motion.div>

      </section>

      {/* ── Vacation Modal ── */}
      <AnimatePresence>
        {showVacationModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowVacationModal(false)}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-md glass-heavy rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <UmbrellaOff className="h-5 w-5 text-amber-500" /> เปิด Vacation Mode
                </h3>
                <button onClick={() => setShowVacationModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Listings ของคุณจะแสดงแบนเนอร์ &ldquo;ร้านปิดชั่วคราว&rdquo; ลูกค้าไม่สามารถจองใหม่ได้ (งานเดิมยังคงดำเนินการตามปกติ)
                </p>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    ข้อความแจ้งลูกค้า (ไม่บังคับ)
                  </label>
                  <textarea
                    value={vacationMsg}
                    onChange={(e) => setVacationMsg(e.target.value)}
                    rows={3}
                    placeholder="เช่น หยุดพักร้อนช่วงสงกรานต์ กลับมาให้บริการวันที่ 17 เม.ย. 2569"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    วันที่กลับมาเปิดร้าน (ไม่บังคับ)
                  </label>
                  <input
                    type="date"
                    value={vacationUntil}
                    onChange={(e) => setVacationUntil(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
                  />
                </div>
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                  <AlertTriangle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">คุณสามารถยกเลิก Vacation Mode ได้ตลอดเวลาจากหน้าแดชบอร์ด</p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setShowVacationModal(false)}
                    className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:glass-sm transition-colors">
                    ยกเลิก
                  </button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleSetVacation}
                    disabled={setVacation.isPending}
                    className="flex-1 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                    {setVacation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    เปิด Vacation Mode
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setModal(null)}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-md glass-heavy rounded-3xl shadow-2xl overflow-hidden">

              {/* Modal header */}
              <div className={`p-5 ${
                modal === 'leave'      ? 'bg-red-50 border-b border-red-100'    :
                modal === 'deactivate' ? 'glass-sm border-b border-white/20' :
                modal === 'suspend'   ? 'bg-amber-50 border-b border-amber-100' :
                'bg-green-50 border-b border-green-100'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {modal === 'suspend'    && 'หยุดให้บริการชั่วคราว?'}
                    {modal === 'reactivate' && 'กลับมาให้บริการ?'}
                    {modal === 'deactivate' && 'เลิกกิจการ?'}
                    {modal === 'leave'      && 'ออกจากชุมชน?'}
                  </h3>
                  <button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Warning content per action */}
                {modal === 'suspend' && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">Listings ของคุณจะถูกซ่อนชั่วคราว ลูกค้าจะไม่สามารถจองได้จนกว่าคุณจะกลับมาเปิดรับงาน</p>
                    <div className="glass-sm border border-amber-200/60 rounded-xl p-3 text-xs text-amber-700">
                      💡 งานที่จองไว้แล้วยังคงต้องดำเนินการตามปกติ
                    </div>
                  </div>
                )}
                {modal === 'reactivate' && (
                  <p className="text-sm text-slate-600">Listings ของคุณจะกลับมาแสดงในชุมชน <strong>{MOCK_PROVIDER.community}</strong> และรับงานได้ทันที</p>
                )}
                {modal === 'deactivate' && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">โปรไฟล์จะถูกปิดถาวร Listings ทั้งหมดจะถูกซ่อน</p>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                      ⚠️ ต้องติดต่อ Community Admin เพื่อขอเปิดใช้งานอีกครั้ง
                    </div>
                  </div>
                )}
                {modal === 'leave' && (
                  <div className="space-y-4">
                    <div className="glass border border-primary/20 rounded-xl p-3">
                      <p className="text-xs text-blue-700 font-semibold mb-1">✅ สิ่งที่ยังได้รับ</p>
                      <ul className="text-xs text-primary space-y-0.5">
                        <li>• บัญชียังคงอยู่ ไม่ถูกลบ</li>
                        <li>• สมัครเข้าชุมชนใหม่ได้ด้วยบัญชีเดิม</li>
                        <li>• ประวัติ Trust Score ยังอยู่</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-xs text-red-700 font-semibold mb-1">❌ สิ่งที่จะหายไป</p>
                      <ul className="text-xs text-red-600 space-y-0.5">
                        <li>• Listings ใน {MOCK_PROVIDER.community} จะถูกลบ</li>
                        <li>• ไม่สามารถรับงานใหม่ในชุมชนนี้ได้</li>
                      </ul>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                        เหตุผลที่ออก (ถ้ามี)
                      </label>
                      <textarea value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)}
                        rows={2} placeholder="เช่น ย้ายที่อยู่ ขยายธุรกิจ..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none transition-all" />
                    </div>
                    <div className="flex items-start gap-2 glass-sm border border-amber-200/60 rounded-xl px-3 py-2.5">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">
                        หลังออกจากชุมชน คุณสามารถสมัครชุมชนใหม่ได้ทันที โดยไม่ต้องใช้บัญชีใหม่
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setModal(null)}
                    className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:glass-sm transition-colors">
                    ยกเลิก
                  </button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleConfirm(modal)}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all ${
                      modal === 'leave'      ? 'bg-red-500 shadow-red-200 hover:bg-red-600'       :
                      modal === 'deactivate' ? 'bg-slate-600 shadow-slate-200 hover:bg-slate-700' :
                      modal === 'suspend'   ? 'bg-amber-500 shadow-amber-200 hover:bg-amber-600' :
                      'bg-green-500 shadow-green-200 hover:bg-green-600'
                    }`}>
                    {modal === 'suspend'    && 'หยุดชั่วคราว'}
                    {modal === 'reactivate' && 'กลับมาให้บริการ'}
                    {modal === 'deactivate' && 'เลิกกิจการ'}
                    {modal === 'leave'      && 'ยืนยันออกจากชุมชน'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AppFooter />
    </main>
  )
}
