'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import {
  Store, TrendingUp, Users, DollarSign, AlertTriangle, CheckCircle,
  XCircle, Clock, ChevronRight, BarChart3, MapPin, Bell, Shield,
  Activity, Eye, Megaphone, ChevronDown, UmbrellaOff, Star,
  ThumbsDown, TrendingDown, UserCheck, Send, RefreshCw, Info,
  Package, Layers, Zap, PauseCircle, ArrowUpRight, ArrowDownRight,
  Plus, X, Pencil, Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

// ── Types ─────────────────────────────────────────────────────────────────────
type StoreStatus = 'OPEN' | 'VACATION' | 'CLOSED' | 'PENDING'
type AnomSeverity = 'high' | 'medium' | 'low'
type AnomType = 'vacation_long' | 'low_reviews' | 'booking_drop' | 'store_dark' | 'new_applicant' | 'module_disabled' | 'no_orders'

interface StoreMetrics {
  id: string
  name: string
  avatar: string
  category: string
  status: StoreStatus
  ordersToday: number
  ordersWeek: number
  ordersLastWeek: number
  revenueWeek: number
  avgRating: number
  totalReviews: number
  vacationDays?: number
  lastActiveAt: string
  joinedAt: string
  isPromoted: boolean
  trustScore: number
}

interface AnomalySignal {
  id: string
  type: AnomType
  severity: AnomSeverity
  storeId?: string
  storeName?: string
  message: string
  detail: string
  detectedAt: string
  resolved: boolean
}

interface ModuleHealth {
  code: string
  name: string
  emoji: string
  enabled: number
  total: number
  isCore: boolean
}

interface MarketAnnouncement {
  id: string
  title: string
  body: string
  type: 'info' | 'warning' | 'success'
  status: 'PUBLISHED' | 'PENDING'
  createdAt: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_MARKET = {
  name: 'ตลาดชุมชนหมู่บ้านศรีนคร',
  community: 'หมู่บ้านศรีนคร — บางแค กรุงเทพฯ',
  managerName: 'คุณสมชาย ใจดี',
  gmvToday: 4_850,
  gmvWeek: 31_200,
  gmvMonth: 128_500,
  gmvLastWeek: 28_900,
  activeMembers: 248,
  totalBookingsWeek: 87,
  totalBookingsLastWeek: 73,
  pendingApplicants: 3,
  revenueShareMonth: 850,
}

const MOCK_STORES: StoreMetrics[] = [
  { id: 's1', name: 'ร้านส้มตำครัวไทย',   avatar: '🍱', category: 'อาหาร',    status: 'OPEN',     ordersToday: 8,  ordersWeek: 28, ordersLastWeek: 32, revenueWeek: 4200, avgRating: 4.9, totalReviews: 54, lastActiveAt: 'วันนี้ 11:42',    joinedAt: 'ม.ค. 2569', isPromoted: true,  trustScore: 94 },
  { id: 's2', name: 'ช่างสมศักดิ์',        avatar: '🔧', category: 'ซ่อมแซม',  status: 'OPEN',     ordersToday: 3,  ordersWeek: 15, ordersLastWeek: 14, revenueWeek: 6750, avgRating: 4.7, totalReviews: 38, lastActiveAt: 'วันนี้ 09:15',    joinedAt: 'ก.พ. 2569', isPromoted: false, trustScore: 88 },
  { id: 's3', name: 'ครูนิตยา สอนพิเศษ',   avatar: '📚', category: 'สอนพิเศษ',  status: 'OPEN',     ordersToday: 5,  ordersWeek: 22, ordersLastWeek: 19, revenueWeek: 8800, avgRating: 4.8, totalReviews: 61, lastActiveAt: 'วันนี้ 10:30',    joinedAt: 'ม.ค. 2569', isPromoted: false, trustScore: 91 },
  { id: 's4', name: 'ร้านขนมบ้านๆ',        avatar: '🍰', category: 'อาหาร',    status: 'VACATION', ordersToday: 0,  ordersWeek: 2,  ordersLastWeek: 12, revenueWeek: 1800, avgRating: 4.5, totalReviews: 22, vacationDays: 5, lastActiveAt: '5 วันที่แล้ว',   joinedAt: 'มี.ค. 2569', isPromoted: false, trustScore: 76 },
  { id: 's5', name: 'แม่บ้านคลีนดีจริง',   avatar: '🏠', category: 'งานบ้าน',   status: 'OPEN',     ordersToday: 2,  ordersWeek: 10, ordersLastWeek: 9,  revenueWeek: 3000, avgRating: 4.6, totalReviews: 29, lastActiveAt: 'เมื่อวาน 15:00',  joinedAt: 'มี.ค. 2569', isPromoted: false, trustScore: 82 },
  { id: 's6', name: 'ร้านสุขภาพดี',         avatar: '💊', category: 'สุขภาพ',    status: 'OPEN',     ordersToday: 1,  ordersWeek: 5,  ordersLastWeek: 13, revenueWeek: 2500, avgRating: 3.8, totalReviews: 16, lastActiveAt: 'เมื่อวาน 09:00',  joinedAt: 'ก.พ. 2569', isPromoted: false, trustScore: 71 },
  { id: 's7', name: 'สวนผักอินทรีย์',       avatar: '🌾', category: 'เกษตร',    status: 'CLOSED',   ordersToday: 0,  ordersWeek: 0,  ordersLastWeek: 4,  revenueWeek: 0,    avgRating: 4.2, totalReviews: 12, lastActiveAt: '12 วันที่แล้ว',  joinedAt: 'เม.ย. 2569', isPromoted: false, trustScore: 68 },
  { id: 's8', name: 'ช่างอิ๊คพิเศษ',        avatar: '⚡', category: 'ซ่อมแซม',  status: 'PENDING',  ordersToday: 0,  ordersWeek: 0,  ordersLastWeek: 0,  revenueWeek: 0,    avgRating: 0,   totalReviews: 0,  lastActiveAt: 'รอการอนุมัติ',   joinedAt: 'สมัคร มี.ค. 2569', isPromoted: false, trustScore: 0 },
]

const MOCK_ANOMALIES: AnomalySignal[] = [
  { id: 'a1', type: 'vacation_long',  severity: 'high',   storeId: 's4', storeName: 'ร้านขนมบ้านๆ',  message: 'ร้านเปิด Vacation นานผิดปกติ', detail: 'ร้านขนมบ้านๆ อยู่ในโหมด Vacation มาแล้ว 5 วัน ลูกค้าร้องเรียน 2 ราย', detectedAt: 'วันนี้ 08:00', resolved: false },
  { id: 'a2', type: 'booking_drop',   severity: 'high',   storeId: 's6', storeName: 'ร้านสุขภาพดี',   message: 'ออเดอร์ลดลงผิดปกติ > 60%',    detail: 'ออเดอร์สัปดาห์นี้ 5 ครั้ง vs 13 ครั้งสัปดาห์ที่แล้ว (↓61%)', detectedAt: 'วันนี้ 07:30', resolved: false },
  { id: 'a3', type: 'store_dark',     severity: 'medium', storeId: 's7', storeName: 'สวนผักอินทรีย์', message: 'ร้านไม่มีความเคลื่อนไหว 12 วัน', detail: 'ไม่มีออเดอร์ใหม่หรือการตอบกลับรีวิว ควรติดต่อเจ้าของร้าน',  detectedAt: 'เมื่อวาน 23:59', resolved: false },
  { id: 'a4', type: 'low_reviews',    severity: 'medium', storeId: 's6', storeName: 'ร้านสุขภาพดี',   message: 'เรตติ้งลดลงต่ำกว่าเกณฑ์',    detail: 'เรตติ้ง 3.8 ต่ำกว่าเกณฑ์ตลาด (4.0) มีรีวิว 1 ดาว 2 ใบล่าสุด',  detectedAt: 'เมื่อวาน 18:45', resolved: false },
  { id: 'a5', type: 'new_applicant',  severity: 'low',    storeId: 's8', storeName: 'ช่างอิ๊คพิเศษ',  message: 'มีผู้สมัครร้านค้าใหม่รอการอนุมัติ', detail: 'ผู้สมัคร 3 ราย กำลังรอการตรวจสอบ (ค้างมาแล้ว 2 วัน)',          detectedAt: '2 วันที่แล้ว',  resolved: false },
  { id: 'a6', type: 'no_orders',      severity: 'low',    storeId: 's7', storeName: 'สวนผักอินทรีย์', message: '0 ออเดอร์ใน 7 วันล่าสุด',      detail: 'ร้านยังคง CLOSED สถานะ ยอดขาย ฿0 ในสัปดาห์นี้',              detectedAt: '3 วันที่แล้ว',  resolved: true },
]

const MOCK_MODULES: ModuleHealth[] = [
  { code: 'CATALOG',   name: 'แคตตาล็อก',       emoji: '📋', enabled: 8, total: 8,  isCore: true  },
  { code: 'BOOKING',   name: 'จองบริการ',         emoji: '📅', enabled: 7, total: 8,  isCore: true  },
  { code: 'PAYMENTS',  name: 'ชำระเงิน',          emoji: '💳', enabled: 8, total: 8,  isCore: true  },
  { code: 'REVIEWS',   name: 'รีวิว',             emoji: '⭐', enabled: 6, total: 8,  isCore: false },
  { code: 'DELIVERY',  name: 'จัดส่ง',            emoji: '🚚', enabled: 3, total: 8,  isCore: false },
  { code: 'ANALYTICS', name: 'วิเคราะห์ข้อมูล',   emoji: '📊', enabled: 5, total: 8,  isCore: false },
]

const MOCK_ANNOUNCEMENTS: MarketAnnouncement[] = [
  { id: 'a1', title: 'ประกาศรับสมัครร้านอาหาร',         body: 'ตลาดต้องการร้านอาหารเพิ่ม สนใจติดต่อ Market Admin',        type: 'info',    status: 'PUBLISHED', createdAt: '15 มี.ค. 2569' },
  { id: 'a2', title: 'โปรโมชันพิเศษสุดสัปดาห์นี้',      body: 'ลด 10% ทุกออเดอร์ที่จองผ่านแอป วันเสาร์-อาทิตย์นี้',    type: 'success', status: 'PENDING',   createdAt: '17 มี.ค. 2569' },
]

type TabId = 'overview' | 'stores' | 'anomalies' | 'applicants' | 'announcements'

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'overview',      label: 'ภาพรวมตลาด',   emoji: '📊' },
  { id: 'stores',        label: 'ร้านค้า',        emoji: '🏪' },
  { id: 'anomalies',     label: 'สัญญาณผิดปกติ', emoji: '🚨' },
  { id: 'applicants',    label: 'ผู้สมัครใหม่',   emoji: '👤' },
  { id: 'announcements', label: 'ประกาศ',         emoji: '📣' },
]

// ── Helper components ─────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, delta, color, i }: {
  icon: React.ElementType; label: string; value: string; sub?: string
  delta?: { pct: number; positive: boolean }; color: string; i: number
}) {
  return (
    <motion.div variants={fadeUp} custom={i}
      className="glass-card rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-semibold">{label}</p>
        <p className="text-xl font-extrabold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        {delta && (
          <p className={`text-xs font-bold mt-1 flex items-center gap-0.5 ${delta.positive ? 'text-emerald-600' : 'text-red-500'}`}>
            {delta.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta.pct)}% vs สัปดาห์ที่แล้ว
          </p>
        )}
      </div>
    </motion.div>
  )
}

function StatusDot({ status }: { status: StoreStatus }) {
  const cfg: Record<StoreStatus, { color: string; label: string }> = {
    OPEN:     { color: 'bg-emerald-400',  label: 'เปิด' },
    VACATION: { color: 'bg-amber-400',    label: 'ปิดชั่วคราว' },
    CLOSED:   { color: 'bg-red-400',      label: 'ปิด' },
    PENDING:  { color: 'bg-slate-300',    label: 'รออนุมัติ' },
  }
  const c = cfg[status]
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${c.color} ${status === 'OPEN' ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-semibold text-slate-600">{c.label}</span>
    </span>
  )
}

function SeverityBadge({ severity }: { severity: AnomSeverity }) {
  const cfg: Record<AnomSeverity, { cls: string; label: string }> = {
    high:   { cls: 'bg-red-100 text-red-700 border-red-200',    label: '🔴 สูง' },
    medium: { cls: 'bg-amber-100 text-amber-700 border-amber-200', label: '🟡 กลาง' },
    low:    { cls: 'bg-blue-100 text-blue-700 border-blue-200',  label: '🔵 ต่ำ' },
  }
  const c = cfg[severity]
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${c.cls}`}>{c.label}</span>
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function MarketAdminDashboardPage() {
  useAuthGuard(['admin', 'superadmin'])

  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [resolvedIds, setResolvedIds] = useState<string[]>([])
  const [storeFilter, setStoreFilter]   = useState<'ALL' | StoreStatus>('ALL')
  const [anomFilter, setAnomFilter]     = useState<'ALL' | AnomSeverity>('ALL')
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS)
  const [showAnnForm, setShowAnnForm]   = useState(false)
  const [annForm, setAnnForm]           = useState({ title: '', body: '', type: 'info' as MarketAnnouncement['type'] })

  const m = MOCK_MARKET
  const unresolvedAnom = MOCK_ANOMALIES.filter(a => !a.resolved && !resolvedIds.includes(a.id))
  const highAnom = unresolvedAnom.filter(a => a.severity === 'high').length

  const filteredStores = useMemo(() => {
    if (storeFilter === 'ALL') return MOCK_STORES
    return MOCK_STORES.filter(s => s.status === storeFilter)
  }, [storeFilter])

  const filteredAnom = useMemo(() => {
    const base = MOCK_ANOMALIES.filter(a => !resolvedIds.includes(a.id))
    if (anomFilter === 'ALL') return base
    return base.filter(a => a.severity === anomFilter)
  }, [anomFilter, resolvedIds])

  const gmvDelta = Math.round(((m.gmvWeek - m.gmvLastWeek) / m.gmvLastWeek) * 100)
  const bookingDelta = Math.round(((m.totalBookingsWeek - m.totalBookingsLastWeek) / m.totalBookingsLastWeek) * 100)

  function resolveAnomaly(id: string) { setResolvedIds(p => [...p, id]) }

  function submitAnnouncement() {
    if (!annForm.title.trim() || !annForm.body.trim()) return
    setAnnouncements(prev => [{
      id: `ann${Date.now()}`,
      title: annForm.title, body: annForm.body, type: annForm.type,
      status: 'PENDING', createdAt: 'วันนี้',
    }, ...prev])
    setAnnForm({ title: '', body: '', type: 'info' })
    setShowAnnForm(false)
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Store className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-primary">Market Admin Dashboard</span>
                {highAnom > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {highAnom} ด่วน
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{m.name}</h1>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {m.community}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="glass-card rounded-xl px-4 py-2 text-right">
                <p className="text-xs text-slate-400">ผู้จัดการตลาด</p>
                <p className="text-sm font-bold text-slate-800">{m.managerName}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="glass-card rounded-2xl p-1.5 mb-6 flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-slate-600 hover:bg-white/50'
              }`}>
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              {tab.id === 'anomalies' && unresolvedAnom.length > 0 && (
                <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-0.5 ${
                  activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-red-500 text-white'
                }`}>{unresolvedAnom.length}</span>
              )}
              {tab.id === 'applicants' && m.pendingApplicants > 0 && (
                <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-0.5 ${
                  activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-amber-500 text-white'
                }`}>{m.pendingApplicants}</span>
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Tab: Overview ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* KPI grid */}
              <motion.div variants={stagger} initial="hidden" animate="show"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard i={0} icon={DollarSign} label="GMV สัปดาห์นี้" value={`฿${m.gmvWeek.toLocaleString()}`}
                  sub={`วันนี้ ฿${m.gmvToday.toLocaleString()}`}
                  delta={{ pct: gmvDelta, positive: gmvDelta >= 0 }}
                  color="bg-emerald-500" />
                <KpiCard i={1} icon={BarChart3} label="ออเดอร์สัปดาห์นี้" value={`${m.totalBookingsWeek}`}
                  sub="คำสั่งซื้อทั้งหมด"
                  delta={{ pct: bookingDelta, positive: bookingDelta >= 0 }}
                  color="bg-blue-500" />
                <KpiCard i={2} icon={Store} label="ร้านค้าที่เปิดอยู่"
                  value={`${MOCK_STORES.filter(s => s.status === 'OPEN').length}/${MOCK_STORES.length}`}
                  sub={`${MOCK_STORES.filter(s => s.status === 'VACATION').length} ปิดชั่วคราว`}
                  color="bg-violet-500" />
                <KpiCard i={3} icon={Users} label="สมาชิกในชุมชน" value={`${m.activeMembers}`}
                  sub={`รายได้แบ่งปัน ฿${m.revenueShareMonth.toLocaleString()}/เดือน`}
                  color="bg-rose-500" />
              </motion.div>

              {/* Anomaly quick alert + module health side-by-side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Anomaly quick feed */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
                  className="lg:col-span-2 glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-red-500" />
                      <h2 className="font-bold text-slate-800">สัญญาณผิดปกติล่าสุด</h2>
                    </div>
                    <button onClick={() => setActiveTab('anomalies')}
                      className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                      ดูทั้งหมด <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {unresolvedAnom.slice(0, 3).map((a) => (
                      <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border ${
                        a.severity === 'high' ? 'bg-red-50 border-red-100' :
                        a.severity === 'medium' ? 'bg-amber-50 border-amber-100' :
                        'bg-blue-50 border-blue-100'
                      }`}>
                        <AlertTriangle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                          a.severity === 'high' ? 'text-red-500' :
                          a.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-slate-800">{a.message}</p>
                            <SeverityBadge severity={a.severity} />
                          </div>
                          {a.storeName && <p className="text-xs text-slate-500 mt-0.5">ร้าน: {a.storeName}</p>}
                          <p className="text-xs text-slate-400 mt-0.5">{a.detectedAt}</p>
                        </div>
                      </div>
                    ))}
                    {unresolvedAnom.length === 0 && (
                      <div className="text-center py-6 text-slate-400">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
                        <p className="text-sm font-semibold">ไม่มีสัญญาณผิดปกติ</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Module health */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
                  className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="h-5 w-5 text-violet-500" />
                    <h2 className="font-bold text-slate-800">Module Health</h2>
                  </div>
                  <div className="space-y-2.5">
                    {MOCK_MODULES.map((mod) => {
                      const pct = Math.round((mod.enabled / mod.total) * 100)
                      return (
                        <div key={mod.code}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                              <span>{mod.emoji}</span> {mod.name}
                              {mod.isCore && <span className="text-xs bg-primary/10 text-primary px-1.5 rounded-full">Core</span>}
                            </span>
                            <span className="text-xs text-slate-500">{mod.enabled}/{mod.total}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${
                              pct === 100 ? 'bg-emerald-400' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'
                            }`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Store performance mini-table */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
                className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" /> ประสิทธิภาพร้านค้า (Top 5)
                  </h2>
                  <button onClick={() => setActiveTab('stores')}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                    ดูทั้งหมด <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-white/20">
                        <th className="pb-2 text-left">ร้านค้า</th>
                        <th className="pb-2 text-center">สถานะ</th>
                        <th className="pb-2 text-right">ออเดอร์/สัปดาห์</th>
                        <th className="pb-2 text-right">รายได้</th>
                        <th className="pb-2 text-right">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {MOCK_STORES.filter(s => s.status !== 'PENDING').slice(0, 5).map((s) => (
                        <tr key={s.id} className="py-2">
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-base w-7 text-center">{s.avatar}</span>
                              <div>
                                <p className="font-semibold text-slate-800 text-xs">{s.name}</p>
                                <p className="text-xs text-slate-400">{s.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 text-center"><StatusDot status={s.status} /></td>
                          <td className="py-2.5 text-right">
                            <span className="font-bold text-slate-800">{s.ordersWeek}</span>
                            <span className={`ml-1 text-xs ${s.ordersWeek >= s.ordersLastWeek ? 'text-emerald-500' : 'text-red-500'}`}>
                              {s.ordersWeek >= s.ordersLastWeek ? '▲' : '▼'}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-bold text-slate-700 text-xs">฿{s.revenueWeek.toLocaleString()}</td>
                          <td className="py-2.5 text-right">
                            <span className="flex items-center justify-end gap-1 text-xs font-bold text-amber-600">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              {s.avgRating > 0 ? s.avgRating.toFixed(1) : '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── Tab: Stores ── */}
          {activeTab === 'stores' && (
            <motion.div key="stores" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Filter bar */}
              <div className="glass-card rounded-2xl p-4 mb-5 flex flex-wrap gap-2 items-center">
                {(['ALL', 'OPEN', 'VACATION', 'CLOSED', 'PENDING'] as const).map((f) => (
                  <button key={f} onClick={() => setStoreFilter(f)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                      storeFilter === f
                        ? 'bg-primary text-white border-primary'
                        : 'glass-sm border-white/30 text-slate-600 hover:border-primary/30'
                    }`}>
                    {f === 'ALL' ? '🏪 ทั้งหมด' : f === 'OPEN' ? '🟢 เปิด' : f === 'VACATION' ? '🟡 Vacation' : f === 'CLOSED' ? '🔴 ปิด' : '⏳ รออนุมัติ'}
                    <span className="ml-1.5 opacity-70">
                      {f === 'ALL' ? MOCK_STORES.length : MOCK_STORES.filter(s => s.status === f).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Store cards grid */}
              <motion.div variants={stagger} initial="hidden" animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStores.map((store, i) => (
                  <motion.div key={store.id} variants={fadeUp} custom={i}
                    className="glass-card rounded-2xl overflow-hidden">
                    {/* Status banner */}
                    {store.status === 'VACATION' && (
                      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center gap-2">
                        <UmbrellaOff className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs font-bold text-amber-700">
                          Vacation {store.vacationDays && `— ${store.vacationDays} วัน`}
                        </span>
                      </div>
                    )}
                    {store.status === 'CLOSED' && (
                      <div className="bg-red-50 border-b border-red-200 px-4 py-1.5">
                        <span className="text-xs font-bold text-red-600">🚫 ปิดให้บริการ</span>
                      </div>
                    )}
                    {store.status === 'PENDING' && (
                      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5">
                        <span className="text-xs font-bold text-slate-500">⏳ รอการอนุมัติ</span>
                      </div>
                    )}

                    <div className="p-5">
                      {/* Header row */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-11 h-11 glass-sm rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                          {store.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-extrabold text-slate-900 text-sm">{store.name}</p>
                            {store.isPromoted && <span className="text-xs bg-orange-100 text-orange-700 font-bold px-1.5 rounded-full">🔥 Promoted</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">{store.category}</span>
                            <StatusDot status={store.status} />
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      {store.status !== 'PENDING' ? (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="glass-sm rounded-xl p-2 text-center">
                            <p className="text-xs text-slate-400">วันนี้</p>
                            <p className="text-base font-extrabold text-slate-800">{store.ordersToday}</p>
                            <p className="text-xs text-slate-400">ออเดอร์</p>
                          </div>
                          <div className="glass-sm rounded-xl p-2 text-center">
                            <p className="text-xs text-slate-400">สัปดาห์</p>
                            <p className={`text-base font-extrabold ${store.ordersWeek < store.ordersLastWeek * 0.7 ? 'text-red-600' : 'text-slate-800'}`}>
                              {store.ordersWeek}
                            </p>
                            <p className={`text-xs font-semibold ${store.ordersWeek >= store.ordersLastWeek ? 'text-emerald-500' : 'text-red-500'}`}>
                              {store.ordersWeek >= store.ordersLastWeek ? '▲' : '▼'}
                              {Math.abs(store.ordersWeek - store.ordersLastWeek)}
                            </p>
                          </div>
                          <div className="glass-sm rounded-xl p-2 text-center">
                            <p className="text-xs text-slate-400">รายได้</p>
                            <p className="text-sm font-extrabold text-slate-800">฿{(store.revenueWeek / 1000).toFixed(1)}k</p>
                            <p className="text-xs text-slate-400">สัปดาห์</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 rounded-xl p-3 mb-3">
                          <p className="text-xs text-slate-500 text-center">เข้าร่วมเมื่อ {store.joinedAt}</p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>{store.lastActiveAt}</span>
                        </div>
                        {store.avgRating > 0 && (
                          <span className="flex items-center gap-1 font-bold text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {store.avgRating.toFixed(1)} ({store.totalReviews})
                          </span>
                        )}
                        {store.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors">
                              อนุมัติ
                            </button>
                            <button className="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">
                              ปฏิเสธ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── Tab: Anomaly Signals ── */}
          {activeTab === 'anomalies' && (
            <motion.div key="anomalies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Header + filter */}
              <div className="glass-card rounded-2xl p-4 mb-5 flex flex-wrap gap-2 items-center">
                <Bell className="h-4 w-4 text-red-500" />
                <span className="text-sm font-bold text-slate-700">ระบบจับสัญญาณผิดปกติ</span>
                <div className="ml-auto flex gap-2">
                  {(['ALL', 'high', 'medium', 'low'] as const).map((f) => (
                    <button key={f} onClick={() => setAnomFilter(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        anomFilter === f ? 'bg-primary text-white border-primary' : 'glass-sm border-white/30 text-slate-600 hover:border-primary/30'
                      }`}>
                      {f === 'ALL' ? 'ทั้งหมด' : f === 'high' ? '🔴 สูง' : f === 'medium' ? '🟡 กลาง' : '🔵 ต่ำ'}
                    </button>
                  ))}
                </div>
              </div>

              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
                {filteredAnom.length === 0 ? (
                  <motion.div variants={fadeUp} custom={0} className="glass-card rounded-2xl p-12 text-center">
                    <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                    <p className="font-bold text-slate-700">ไม่มีสัญญาณผิดปกติ</p>
                    <p className="text-sm text-slate-400 mt-1">ตลาดชุมชนทำงานปกติ</p>
                  </motion.div>
                ) : filteredAnom.map((a, i) => (
                  <motion.div key={a.id} variants={fadeUp} custom={i}
                    className={`glass-card rounded-2xl p-5 border-l-4 ${
                      a.resolved || resolvedIds.includes(a.id) ? 'opacity-50' :
                      a.severity === 'high'   ? 'border-red-400' :
                      a.severity === 'medium' ? 'border-amber-400' : 'border-blue-400'
                    }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        a.severity === 'high' ? 'bg-red-100' : a.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                      }`}>
                        {a.type === 'vacation_long'  && <UmbrellaOff className="h-5 w-5 text-amber-500" />}
                        {a.type === 'booking_drop'   && <TrendingDown className="h-5 w-5 text-red-500" />}
                        {a.type === 'store_dark'     && <PauseCircle className="h-5 w-5 text-slate-500" />}
                        {a.type === 'low_reviews'    && <ThumbsDown className="h-5 w-5 text-red-400" />}
                        {a.type === 'new_applicant'  && <UserCheck className="h-5 w-5 text-blue-500" />}
                        {a.type === 'no_orders'      && <Package className="h-5 w-5 text-slate-400" />}
                        {a.type === 'module_disabled'&& <Zap className="h-5 w-5 text-amber-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-bold text-slate-900 text-sm">{a.message}</p>
                              <SeverityBadge severity={a.severity} />
                              {(a.resolved || resolvedIds.includes(a.id)) && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                                  ✓ แก้ไขแล้ว
                                </span>
                              )}
                            </div>
                            {a.storeName && (
                              <p className="text-xs text-primary font-semibold">📍 {a.storeName}</p>
                            )}
                            <p className="text-sm text-slate-600 mt-1">{a.detail}</p>
                            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> พบเมื่อ {a.detectedAt}
                            </p>
                          </div>
                          {!a.resolved && !resolvedIds.includes(a.id) && (
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => resolveAnomaly(a.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors">
                                <CheckCircle className="h-3.5 w-3.5" /> แก้ไขแล้ว
                              </button>
                              {a.storeId && (
                                <button className="flex items-center gap-1.5 px-3 py-1.5 glass-sm border border-white/40 text-slate-600 text-xs font-semibold rounded-xl hover:border-primary/30 transition-colors">
                                  <Eye className="h-3.5 w-3.5" /> ดูร้าน
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── Tab: Applicants ── */}
          {activeTab === 'applicants' && (
            <motion.div key="applicants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                <motion.div variants={fadeUp} custom={0}
                  className="flex items-center gap-3 glass-card rounded-2xl p-4">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">ผู้สมัครร้านค้าใหม่</p>
                    <p className="text-xs text-slate-500">รอการอนุมัติ {m.pendingApplicants} ราย</p>
                  </div>
                </motion.div>
                {[
                  { id: 'P001', name: 'ช่างวิชัย ไฟฟ้า', category: '⚡ งานช่าง', applied: '10 มี.ค. 2569', exp: '5 ปี', phone: '081-234-5678', note: 'ช่างไฟ ช่างประปา มีใบอนุญาต' },
                  { id: 'P002', name: 'ครูสมหญิง',       category: '📚 สอนพิเศษ', applied: '11 มี.ค. 2569', exp: '3 ปี', phone: '082-345-6789', note: 'สอนคณิต-วิทย์ ม.1-6' },
                  { id: 'P003', name: 'คุณสมพงษ์ทำความสะอาด', category: '🏠 งานบ้าน', applied: '12 มี.ค. 2569', exp: '2 ปี', phone: '083-456-7890', note: 'ทำความสะอาด ดูแลบ้าน รับเหมา' },
                ].map((p, i) => (
                  <motion.div key={p.id} variants={fadeUp} custom={i + 1}
                    className="glass-card rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-extrabold text-sm flex-shrink-0">
                        {p.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between flex-wrap gap-3">
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{p.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{p.category} · ประสบการณ์ {p.exp}</p>
                            <p className="text-xs text-slate-500 mt-0.5">📞 {p.phone}</p>
                            <p className="text-xs text-slate-400 mt-1 italic">{p.note}</p>
                            <p className="text-xs text-slate-400 mt-0.5">สมัครเมื่อ {p.applied}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors">
                              <CheckCircle className="h-3.5 w-3.5" /> อนุมัติ
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors">
                              <XCircle className="h-3.5 w-3.5" /> ปฏิเสธ
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── Tab: Announcements ── */}
          {activeTab === 'announcements' && (
            <motion.div key="announcements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" /> ประกาศในตลาดชุมชน
                </h2>
                <button onClick={() => setShowAnnForm(v => !v)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors">
                  <Plus className="h-4 w-4" /> สร้างประกาศ
                </button>
              </div>

              {/* New announcement form */}
              <AnimatePresence>
                {showAnnForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                    <div className="glass-card rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-800 text-sm">ประกาศใหม่</p>
                        <button onClick={() => setShowAnnForm(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <input value={annForm.title} onChange={e => setAnnForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="หัวข้อประกาศ..."
                        className="w-full px-4 py-2.5 rounded-xl glass border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <textarea value={annForm.body} onChange={e => setAnnForm(f => ({ ...f, body: e.target.value }))}
                        rows={3} placeholder="เนื้อหาประกาศ..."
                        className="w-full px-4 py-2.5 rounded-xl glass border border-white/20 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <div className="flex items-center gap-3">
                        <select value={annForm.type} onChange={e => setAnnForm(f => ({ ...f, type: e.target.value as MarketAnnouncement['type'] }))}
                          className="px-3 py-2 rounded-xl glass border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent">
                          <option value="info">ℹ️ ข้อมูล</option>
                          <option value="success">✅ โปรโมชัน</option>
                          <option value="warning">⚠️ แจ้งเตือน</option>
                        </select>
                        <button onClick={submitAnnouncement}
                          disabled={!annForm.title.trim() || !annForm.body.trim()}
                          className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-colors">
                          <Send className="h-4 w-4" /> ส่งประกาศ
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
                {announcements.map((ann, i) => (
                  <motion.div key={ann.id} variants={fadeUp} custom={i}
                    className={`glass-card rounded-2xl p-5 border-l-4 ${
                      ann.type === 'warning' ? 'border-amber-400' :
                      ann.type === 'success' ? 'border-emerald-400' : 'border-blue-400'
                    }`}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-bold text-slate-800 text-sm">{ann.title}</p>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            ann.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {ann.status === 'PUBLISHED' ? '✅ เผยแพร่แล้ว' : '⏳ รอการอนุมัติ'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{ann.body}</p>
                        <p className="text-xs text-slate-400 mt-1.5">{ann.createdAt}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="p-1.5 glass-sm rounded-lg text-slate-400 hover:text-primary transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setAnnouncements(prev => prev.filter(a => a.id !== ann.id))}
                          className="p-1.5 glass-sm rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>
      <AppFooter />
    </main>
  )
}
