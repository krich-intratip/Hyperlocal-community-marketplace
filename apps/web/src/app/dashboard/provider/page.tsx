'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import {
  TrendingUp, Star, CalendarCheck, DollarSign, Plus, Clock, CheckCircle, Eye,
  PauseCircle, PlayCircle, LogOut, AlertTriangle, X, MapPin, ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07 },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const MOCK_ORDERS = [
  { id: 'O001', customer: 'คุณวิภา',      service: 'อาหารกล่อง ×3', date: '8 มี.ค. 2569', time: '11:00', status: 'confirmed', amount: 240 },
  { id: 'O002', customer: 'คุณสมศักดิ์',  service: 'อาหารกล่อง ×2', date: '8 มี.ค. 2569', time: '12:00', status: 'pending',   amount: 160 },
  { id: 'O003', customer: 'คุณนิตยา',     service: 'อาหารกล่อง ×5', date: '7 มี.ค. 2569', time: '11:30', status: 'completed', amount: 400 },
  { id: 'O004', customer: 'คุณประหยัด',   service: 'อาหารกล่อง ×1', date: '6 มี.ค. 2569', time: '12:00', status: 'completed', amount: 80  },
]

const MOCK_LISTINGS = [
  { id: '1', title: 'ทำอาหารกล่องส่งถึงที่',      price: 80,  unit: 'กล่อง', views: 234, bookings: 128, rating: 4.9, active: true },
  { id: '2', title: 'อาหารคลีนออเดอร์ล่วงหน้า',   price: 120, unit: 'กล่อง', views: 89,  bookings: 34,  rating: 4.8, active: true },
]

const ORDER_STATUS_CONFIG = {
  confirmed: { label: 'ยืนยันแล้ว', bg: 'bg-blue-50',  text: 'text-blue-600',  border: 'border-blue-100'  },
  pending:   { label: 'รอยืนยัน',   bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  completed: { label: 'เสร็จแล้ว',  bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
}

/* ── Provider operational status types ── */
type ProviderStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'LEFT'

const PROVIDER_STATUS_CONFIG: Record<ProviderStatus, { label: string; badge: string; dot: string }> = {
  ACTIVE:    { label: 'กำลังให้บริการ',       badge: 'bg-green-100 text-green-700 border-green-200',  dot: 'bg-green-500'  },
  SUSPENDED: { label: 'หยุดชั่วคราว',          badge: 'bg-amber-100 text-amber-700 border-amber-200',  dot: 'bg-amber-400'  },
  INACTIVE:  { label: 'เลิกกิจการ',            badge: 'bg-slate-100 text-slate-500 border-slate-200',  dot: 'bg-slate-400'  },
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

export default function ProviderDashboardPage() {
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>('ACTIVE')
  const [modal, setModal]                   = useState<ModalType>(null)
  const [leaveReason, setLeaveReason]       = useState('')
  const [actionDone, setActionDone]         = useState(false)

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
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 w-24 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '98%' }} />
              </div>
              <span className="text-xs font-semibold text-blue-600">Trust Score 98</span>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <a href="/providers/listings/new"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 transition-colors">
              <Plus className="h-4 w-4" /> เพิ่ม Listing
            </a>
          </motion.div>
        </motion.div>

        {/* Revenue stats */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'รายได้เดือนนี้', value: `฿${thisMonthRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'งานทั้งหมด', value: MOCK_ORDERS.length, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'งานเสร็จแล้ว', value: completedOrders, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'คะแนนรีวิว', value: '4.9 ⭐', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} custom={i} whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-100 shadow-sm">
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
            className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">คำสั่งจอง</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                {MOCK_ORDERS.filter(o => o.status === 'pending').length} รอยืนยัน
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {MOCK_ORDERS.map((order, i) => {
                const cfg = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG]
                return (
                  <div key={order.id} className="flex items-center gap-3 p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-sm">{order.customer}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{order.service}</div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />{order.date} · {order.time}
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
            className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Listings ของฉัน</h2>
              <a href="/providers/listings/new" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> เพิ่ม
              </a>
            </div>
            <div className="divide-y divide-slate-100">
              {MOCK_LISTINGS.map((listing) => (
                <div key={listing.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-800 text-sm">{listing.title}</h3>
                    <div className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      listing.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
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
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-slate-600">ยอดรวมเดือนนี้: <strong className="text-green-600">฿{thisMonthRevenue.toLocaleString()}</strong></span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue note */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="mt-6 p-5 rounded-2xl bg-blue-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-800 text-sm">ค่า Commission แพลตฟอร์ม</p>
              <p className="text-xs text-blue-600 mt-0.5">
                แพลตฟอร์มเก็บ 10–12% จากยอดบุ๊กกิ้งที่สำเร็จ ในช่วงทดลองใช้งานไม่มีค่าใช้จ่าย
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Provider Profile & Status Management ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7}
          className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">สถานะการให้บริการ</h2>
            {/* Current status badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusCfg.badge}`}>
              <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </div>
          </div>

          {/* Profile info */}
          <div className="px-6 py-4 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left">
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

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setModal(null)}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

              {/* Modal header */}
              <div className={`p-5 ${
                modal === 'leave'      ? 'bg-red-50 border-b border-red-100'    :
                modal === 'deactivate' ? 'bg-slate-50 border-b border-slate-100' :
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
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
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
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                      <p className="text-xs text-blue-700 font-semibold mb-1">✅ สิ่งที่ยังได้รับ</p>
                      <ul className="text-xs text-blue-600 space-y-0.5">
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
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">
                        หลังออกจากชุมชน คุณสามารถสมัครชุมชนใหม่ได้ทันที โดยไม่ต้องใช้บัญชีใหม่
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setModal(null)}
                    className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
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
