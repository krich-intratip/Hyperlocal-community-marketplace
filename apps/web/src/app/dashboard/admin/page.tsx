'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import {
  Users, DollarSign, TrendingUp, Shield, CheckCircle, XCircle,
  Clock, ChevronRight, BarChart3, MapPin, Plus, Store,
  Info, AlertTriangle, Eye, FileText, ChevronDown, Send, Layers,
  Megaphone, Pencil, Trash2, Star,
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

/* ── Mock data types ── */
type GrantStatus = 'APPROVED' | 'PENDING' | 'REJECTED'
type CAnnStatus = 'PUBLISHED' | 'PENDING' | 'REJECTED'
type CAnnType = 'info' | 'warning' | 'success'
interface CAAnnouncement {
  id: string
  communityId: string
  title: string
  body: string
  type: CAnnType
  status: CAnnStatus
  createdAt: string
}
const INIT_CA_ANNOUNCEMENTS: CAAnnouncement[] = [
  { id: 'CA1', communityId: '1', title: 'ประกาศรับสมัครผู้ให้บริการอาหาร', body: 'ชุมชนต้องการผู้ให้บริการอาหารเพิ่มเติม สนใจติดต่อ CA', type: 'info', status: 'PUBLISHED', createdAt: '15 มี.ค. 2569' },
  { id: 'CA2', communityId: '1', title: 'ไหวพรุ่งนี้! โปรโมชันพิเศษ', body: 'พรุ่งนี้ผู้ให้บริการหลายรายไฟแล้วโปรโมชันพิเศษ 10% สำหรับจอง 3 ครั้งขึ้นไป', type: 'success', status: 'PENDING', createdAt: '17 มี.ค. 2569' },
]
type ManagedCommunity = {
  id: string; name: string; location: string; zone: string
  members: number; providers: number; pendingProviders: number
  monthBookings: number; revenue: number; revenueShare: number
  rating: number; trialEnd: string; marketCreated: boolean
  grantStatus: GrantStatus; isPrimary: boolean
}

const MOCK_ADMIN = { name: 'คุณสมชาย ใจดี', totalRevenueShare: 1650 }

/* ── Mock communities this admin manages ── */
const INITIAL_COMMUNITIES: ManagedCommunity[] = [
  {
    id: '1', name: 'ตลาดชุมชนหมู่บ้านศรีนคร', location: 'บางแค, กรุงเทพฯ',
    zone: 'สวนสาธารณะกลางหมู่บ้าน', members: 248, providers: 34, pendingProviders: 3,
    monthBookings: 87, revenue: 8500, revenueShare: 850, rating: 4.8,
    trialEnd: '30 มิ.ย. 2569', marketCreated: true, grantStatus: 'APPROVED', isPrimary: true,
  },
  {
    id: '2', name: 'ตลาดคอนโด The Base ลาดพร้าว', location: 'ลาดพร้าว, กรุงเทพฯ',
    zone: 'ลานจอดรถชั้น G', members: 512, providers: 67, pendingProviders: 1,
    monthBookings: 156, revenue: 16000, revenueShare: 800, rating: 4.9,
    trialEnd: 'หมดแล้ว', marketCreated: true, grantStatus: 'APPROVED', isPrimary: false,
  },
  {
    id: '3', name: 'ตลาดชุมชนเมืองทองธานี', location: 'นนทบุรี',
    zone: 'ยังไม่ได้กำหนด', members: 0, providers: 0, pendingProviders: 0,
    monthBookings: 0, revenue: 0, revenueShare: 0, rating: 0,
    trialEnd: 'รอสร้างตลาด', marketCreated: false, grantStatus: 'APPROVED', isPrimary: false,
  },
]

/* ── Pending request (รอ Super Admin อนุมัติ) ── */
const MOCK_PENDING_REQUEST = {
  location: 'สมุทรปราการ (พื้นที่เป้าหมาย)',
  reason: 'ต้องการขยายตลาดในโซนตะวันออกของกรุงเทพฯ มีเครือข่าย Provider พร้อมแล้ว',
  submittedAt: '5 มี.ค. 2569',
  status: 'PENDING' as GrantStatus,
}

type PendingProvider = { id: string; name: string; category: string; applied: string; experience: string; phone: string; note: string }
const PENDING_PROVIDERS_BY_COMMUNITY: Record<string, PendingProvider[]> = {
  '1': [
    { id: 'P001', name: 'ช่างวิชัย', category: 'งานช่าง 🔧', applied: '7 เม.ย. 2569', experience: '5 ปี', phone: '081-234-5678', note: 'ช่างไฟ ช่างประปา มีใบอนุญาต' },
    { id: 'P002', name: 'ครูสมหญิง', category: 'สอนพิเศษ 📚', applied: '8 เม.ย. 2569', experience: '3 ปี', phone: '082-345-6789', note: 'สอนคณิต-วิทย์ ม.1-6' },
    { id: 'P003', name: 'คุณสมพงษ์', category: 'งานบ้าน 🏠', applied: '8 เม.ย. 2569', experience: '2 ปี', phone: '083-456-7890', note: 'ทำความสะอาด ดูแลบ้าน' },
  ],
  '2': [
    { id: 'P004', name: 'คุณนิตยา', category: 'อาหาร 🍱', applied: '6 เม.ย. 2569', experience: '4 ปี', phone: '084-567-8901', note: 'อาหารสุขภาพ คลีน' },
  ],
  '3': [],
}

type ApprovedProvider = { id: string; name: string; category: string; rating: number; bookings: number; revenue: number; joined: string; status: 'active' | 'inactive' }
const APPROVED_PROVIDERS_BY_COMMUNITY: Record<string, ApprovedProvider[]> = {
  '1': [
    { id: '1',  name: 'ร้านส้มตำครัวไทย',   category: 'อาหาร 🍱',      rating: 4.9, bookings: 28, revenue: 4200, joined: 'ม.ค. 2569', status: 'active' },
    { id: '2',  name: 'ช่างสมศักดิ์',        category: 'งานช่าง 🔧',    rating: 4.7, bookings: 15, revenue: 6750, joined: 'ก.พ. 2569', status: 'active' },
    { id: '3',  name: 'ครูนิตยา',            category: 'สอนพิเศษ 📚',   rating: 4.8, bookings: 22, revenue: 8800, joined: 'ม.ค. 2569', status: 'active' },
    { id: '4',  name: 'ร้านขนมบ้านๆ',        category: 'อาหาร 🍱',      rating: 4.5, bookings: 12, revenue: 1800, joined: 'มี.ค. 2569', status: 'inactive' },
    { id: '5',  name: 'แม่บ้านคลีนดีจริง',   category: 'งานบ้าน 🏠',    rating: 4.6, bookings: 10, revenue: 3000, joined: 'มี.ค. 2569', status: 'active' },
  ],
  '2': [
    { id: '6',  name: 'ร้านก๋วยเตี๋ยวลุงแดง', category: 'อาหาร 🍱',    rating: 4.9, bookings: 45, revenue: 6750, joined: 'ต.ค. 2568', status: 'active' },
    { id: '7',  name: 'ร้านกาแฟ Hipster',     category: 'เครื่องดื่ม ☕', rating: 4.8, bookings: 38, revenue: 5700, joined: 'พ.ย. 2568', status: 'active' },
    { id: '8',  name: 'คุณยายใจดี',           category: 'อาหาร 🍱',      rating: 4.6, bookings: 30, revenue: 4500, joined: 'ธ.ค. 2568', status: 'active' },
    { id: '9',  name: 'ร้านนวดแผนไทย',        category: 'สุขภาพ 💆',     rating: 4.9, bookings: 43, revenue: 8600, joined: 'ต.ค. 2568', status: 'active' },
  ],
  '3': [],
}

/* ── Create Market Form (reused) ── */
function CreateMarketPanel({ location, onCreated }: { location: string; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', zone: '', description: '', openDays: [] as string[] })
  const DAY_FULL = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']
  const DAY_SHORT = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']
  function toggleDay(d: string) {
    setForm(f => ({ ...f, openDays: f.openDays.includes(d) ? f.openDays.filter(x => x !== d) : [...f.openDays, d] }))
  }
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-green-800 text-sm">Super Admin อนุมัติพื้นที่แล้ว!</p>
          <p className="text-xs text-green-600 mt-0.5">พื้นที่: <strong>{location}</strong></p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">ชื่อตลาดชุมชน *</label>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="เช่น ตลาดชุมชนเมืองทองธานี"
          className="w-full px-4 py-3 rounded-xl border glass border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">จุดนัดพบ / Zone</label>
        <input value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
          placeholder="เช่น ลานจอดรถ, สวนสาธารณะ"
          className="w-full px-4 py-3 rounded-xl border glass border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">วันเปิดทำการ</label>
        <div className="flex gap-2 flex-wrap">
          {DAY_SHORT.map((d, i) => (
            <button key={d} type="button" onClick={() => toggleDay(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                form.openDays.includes(d)
                  ? 'bg-primary text-white border-primary/30'
                  : 'glass-sm text-slate-600 hover:border-primary/30'
              }`}>
              {DAY_FULL[i]}
            </button>
          ))}
        </div>
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={onCreated} disabled={!form.name}
        className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors">
        <Store className="h-4 w-4" /> เปิดตลาดชุมชน
      </motion.button>
    </div>
  )
}

export default function CommunityAdminDashboardPage() {
  useAuthGuard(['admin', 'superadmin'])
  const [communities, setCommunities] = useState(INITIAL_COMMUNITIES)
  const [activeCommunityId, setActiveCommunityId] = useState('1')
  const [caAnnouncements, setCaAnnouncements] = useState<CAAnnouncement[]>(INIT_CA_ANNOUNCEMENTS)
  const [showAnnForm, setShowAnnForm] = useState(false)
  const [editingAnn, setEditingAnn] = useState<CAAnnouncement | null>(null)
  const [annForm, setAnnForm] = useState({ title: '', body: '', type: 'info' as CAnnType })
  const [providersByComm, setProvidersByComm] = useState(PENDING_PROVIDERS_BY_COMMUNITY)
  const [selectedProvider, setSelectedProvider] = useState<PendingProvider | null>(null)
  const [approvedIds, setApprovedIds] = useState<string[]>([])
  const [showRequestPanel, setShowRequestPanel] = useState(false)
  const [requestForm, setRequestForm] = useState({ location: '', reason: '' })
  const [requestSent, setRequestSent] = useState(false)
  const [showCommSwitcher, setShowCommSwitcher] = useState(false)

  const activeCommunity = communities.find(c => c.id === activeCommunityId)!
  const approvedCommunities = communities.filter(c => c.grantStatus === 'APPROVED')
  const currentProviders = providersByComm[activeCommunityId] ?? []
  const currentApprovedProviders = APPROVED_PROVIDERS_BY_COMMUNITY[activeCommunityId] ?? []

  function approveProvider(id: string) {
    setApprovedIds(p => [...p, id])
    setTimeout(() => {
      setProvidersByComm(prev => ({
        ...prev,
        [activeCommunityId]: (prev[activeCommunityId] ?? []).filter(x => x.id !== id),
      }))
    }, 800)
  }
  function rejectProvider(id: string) {
    setTimeout(() => {
      setProvidersByComm(prev => ({
        ...prev,
        [activeCommunityId]: (prev[activeCommunityId] ?? []).filter(x => x.id !== id),
      }))
    }, 800)
  }
  function handleCreateMarket(communityId: string) {
    setCommunities(prev => prev.map(c => c.id === communityId ? { ...c, marketCreated: true } : c))
  }
  function handleSendRequest() {
    if (!requestForm.location) return
    setRequestSent(true)
    setShowRequestPanel(false)
  }

  const totalRevenueShare = communities
    .filter(c => c.grantStatus === 'APPROVED' && c.marketCreated)
    .reduce((sum, c) => sum + c.revenueShare, 0)

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* ── Header + Community Switcher ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-primary">Community Admin Dashboard</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-primary/30">
                  {approvedCommunities.filter(c => c.marketCreated).length} ตลาด
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {MOCK_ADMIN.name}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Revenue Share รวมทุกตลาด:{' '}
                <strong className="text-green-600">฿{totalRevenueShare.toLocaleString()}</strong> / เดือน
              </p>
            </div>
            <a href={`/communities/${activeCommunityId}`}
              className="flex items-center gap-2 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-primary/30 transition-colors">
              <Eye className="h-4 w-4" /> หน้าตลาด
            </a>
          </div>

          {/* Community Switcher */}
          <div className="mt-4 relative">
            <button
              onClick={() => setShowCommSwitcher(v => !v)}
              className="w-full sm:w-auto flex items-center gap-3 px-4 py-3 rounded-2xl glass-card border-2 border-primary/30 shadow-sm hover:border-primary/30 transition-all text-left">
              <span className="text-xl">🏘️</span>
              <div className="flex-1">
                <p className="text-xs text-slate-400">กำลังดูตลาด</p>
                <p className="font-bold text-slate-900 text-sm">{activeCommunity.name}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{activeCommunity.location}
                  {activeCommunity.isPrimary && (
                    <span className="ml-1 text-primary font-semibold">• หลัก</span>
                  )}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showCommSwitcher ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showCommSwitcher && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 mt-2 w-full sm:w-96 glass-heavy rounded-2xl shadow-xl z-20 overflow-hidden">
                  <div className="p-3 border-b border-white/20">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ตลาดที่บริหารอยู่</p>
                  </div>
                  <div className="divide-y divide-white/10">
                    {communities.map(comm => (
                      <button key={comm.id}
                        onClick={() => { setActiveCommunityId(comm.id); setShowCommSwitcher(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:glass-sm/50 transition-colors ${
                          comm.id === activeCommunityId ? 'glass-sm' : ''
                        }`}>
                        <span className="text-lg">🏘️</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-800 truncate">{comm.name}</p>
                          <p className="text-xs text-slate-500">{comm.location}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {comm.grantStatus === 'PENDING' ? (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">รออนุมัติ</span>
                          ) : !comm.marketCreated ? (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">รอสร้างตลาด</span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                              {comm.providers} Provider
                            </span>
                          )}
                          {comm.id === activeCommunityId && (
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 ml-auto" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-white/20">
                    <button
                      onClick={() => { setShowRequestPanel(true); setShowCommSwitcher(false) }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary border-2 border-dashed border-primary/30 hover:glass-sm transition-colors">
                      <Plus className="h-4 w-4" /> ขอเพิ่มตลาดชุมชนใหม่
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Pending Super Admin Approval Banner ── */}
        {requestSent && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-start gap-3 glass-sm border border-amber-200/60 rounded-2xl p-4">
            <Clock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800 text-sm">รอ Super Admin อนุมัติ</p>
              <p className="text-xs text-amber-600 mt-0.5">
                คำขอเพิ่มตลาดชุมชนใหม่ถูกส่งแล้ว — ปกติใช้เวลา 1–3 วันทำการ
              </p>
            </div>
          </motion.div>
        )}

        {/* Existing pending request */}
        {!requestSent && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.5}
            className="mb-5 flex items-start gap-3 glass-sm border border-amber-200/60 rounded-2xl p-4">
            <Clock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-amber-800 text-sm">มีคำขอรอ Super Admin อนุมัติ</p>
              <p className="text-xs text-amber-600 mt-0.5">
                พื้นที่: <strong>{MOCK_PENDING_REQUEST.location}</strong> · ส่งเมื่อ {MOCK_PENDING_REQUEST.submittedAt}
              </p>
            </div>
            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">รออนุมัติ</span>
          </motion.div>
        )}

        {/* ── SCENARIO: ยังไม่สร้างตลาด ── */}
        {!activeCommunity.marketCreated && activeCommunity.grantStatus === 'APPROVED' && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="glass-card rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-extrabold text-slate-800">สร้างตลาดชุมชน</h2>
              <span className="text-xs text-slate-500">สำหรับ {activeCommunity.location}</span>
            </div>
            <CreateMarketPanel
              location={activeCommunity.location}
              onCreated={() => handleCreateMarket(activeCommunity.id)}
            />
          </motion.div>
        )}

        {/* ── SCENARIO: มีตลาดแล้ว ── */}
        {activeCommunity.marketCreated && (
          <>
            {/* Stats for active community */}
            <motion.div variants={stagger} initial="hidden" animate="show"
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'สมาชิก',          value: activeCommunity.members,                           icon: Users,     color: 'text-primary',   bg: 'glass-sm' },
                { label: 'Provider',         value: activeCommunity.providers,                         icon: Shield,    color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Booking/เดือน',    value: activeCommunity.monthBookings,                     icon: BarChart3, color: 'text-green-600',  bg: 'bg-green-50' },
                { label: 'Rev.Share เดือนนี้', value: `฿${activeCommunity.revenueShare.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <motion.div key={stat.label} variants={fadeUp} custom={i} whileHover={{ y: -2 }}
                  className="p-5 rounded-2xl glass-card">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Provider Overview (primary drillable view) ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="glass-card rounded-2xl mb-6">
              <div className="flex items-center justify-between p-5 border-b border-white/20">
                <div>
                  <h2 className="font-bold text-slate-900">ภาพรวม Provider</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeCommunity.name} · {activeCommunity.providers} Provider ทั้งหมด
                  </p>
                </div>
                <Link href="/dashboard/admin/providers"
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-blue-700 glass-sm px-3 py-1.5 rounded-xl transition-colors">
                  ดูทั้งหมด <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {currentApprovedProviders.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">ยังไม่มี Provider ที่ Approve แล้ว</p>
                  <p className="text-xs mt-1">อนุมัติ Provider ในแผง "อนุมัติ Provider" ด้านล่าง</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-white/10">
                    {currentApprovedProviders.slice(0, 5).map((p) => (
                      <Link key={p.id} href={`/providers/${p.id}` as string}
                        className="flex items-center gap-4 px-5 py-3.5 hover:glass-sm/50 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-50 flex items-center justify-center font-bold text-purple-700 flex-shrink-0 text-sm">
                          {p.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm group-hover:text-primary transition-colors truncate">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.category} · เข้าร่วม {p.joined}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="hidden sm:block text-right">
                            <p className="text-xs font-bold text-slate-700">{p.bookings} บุ๊ก</p>
                            <p className="text-xs text-green-600">฿{p.revenue.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-slate-700">{p.rating}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            p.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'glass-sm text-slate-400'
                          }`}>
                            {p.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  {currentApprovedProviders.length > 5 && (
                    <div className="p-4 border-t border-white/20 text-center">
                      <Link href="/dashboard/admin/providers"
                        className="text-xs font-semibold text-primary hover:text-blue-700 transition-colors">
                        ดู Provider อีก {currentApprovedProviders.length - 5} ราย →
                      </Link>
                    </div>
                  )}
                </>
              )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ── Provider Approval ── */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
                className="glass-card rounded-2xl">
                <div className="flex items-center justify-between p-5 border-b border-white/20">
                  <div>
                    <h2 className="font-bold text-slate-900">อนุมัติ Provider</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{activeCommunity.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentProviders.length > 0 && (
                      <span className="text-xs glass-sm text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                        {currentProviders.length} รอ
                      </span>
                    )}
                    <Link href="/dashboard/admin/providers"
                      className="text-xs font-semibold text-primary hover:text-blue-700 transition-colors flex items-center gap-1">
                      ทั้งหมด <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
                {currentProviders.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                    <p className="text-sm">ไม่มี Provider รออนุมัติ</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {currentProviders.map((provider) => (
                      <AnimatePresence key={provider.id}>
                        <motion.div
                          initial={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: approvedIds.includes(provider.id) ? 40 : -40 }}
                          className="flex items-center gap-3 p-4">
                          <div className="w-10 h-10 rounded-xl glass-sm flex items-center justify-center font-bold text-slate-600 flex-shrink-0 text-sm">
                            {provider.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 text-sm">{provider.name}</div>
                            <div className="text-xs text-slate-500">{provider.category} · {provider.experience}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" /> {provider.applied}
                            </div>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedProvider(provider)}
                              className="w-8 h-8 rounded-lg glass-sm flex items-center justify-center hover:bg-blue-100 transition-colors">
                              <FileText className="h-3.5 w-3.5 text-slate-500" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => approveProvider(provider.id)}
                              className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => rejectProvider(provider.id)}
                              className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors">
                              <XCircle className="h-4 w-4 text-red-500" />
                            </motion.button>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    ))}
                  </div>
                )}
                <div className="p-4 border-t border-white/20">
                  <div className="flex items-start gap-2 glass-sm rounded-xl px-3 py-2">
                    <Info className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-primary">Provider ที่ Approve จะลงรายการบริการใน {activeCommunity.name} ได้ทันที</p>
                  </div>
                </div>
              </motion.div>

              {/* ── Revenue Share ── */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
                className="glass-card rounded-2xl">
                <div className="p-5 border-b border-white/20">
                  <h2 className="font-bold text-slate-900">Revenue Share เดือนนี้</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{activeCommunity.name}</p>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { label: 'ยอดบุ๊กกิ้งรวม',            value: `฿${activeCommunity.revenue.toLocaleString()}`,                           color: 'text-slate-900' },
                    { label: 'Commission แพลตฟอร์ม (10%)', value: `-฿${(activeCommunity.revenue * 0.1).toLocaleString()}`,                  color: 'text-red-500' },
                    { label: 'Revenue Share ของคุณ (10%)', value: `+฿${activeCommunity.revenueShare.toLocaleString()}`,                     color: 'text-green-600 font-extrabold text-base' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/20 last:border-0">
                      <span className="text-sm text-slate-600">{row.label}</span>
                      <span className={`font-bold text-sm ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 border border-green-100">
                    <TrendingUp className="h-4 w-4" />
                    <span>รายได้รวมทุกตลาด: <strong>฿{totalRevenueShare.toLocaleString()}</strong> / เดือน</span>
                  </div>
                </div>
              </motion.div>

              {/* ── All Communities Summary ── */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7}
                className="lg:col-span-2 glass-card rounded-2xl">
                <div className="p-5 border-b border-white/20">
                  <h2 className="font-bold text-slate-900">สรุปทุกตลาดที่บริหาร</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    คลิกที่แถวเพื่อสลับ dashboard
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="glass-sm/50">
                      <tr className="text-left text-xs text-slate-500">
                        <th className="px-5 py-3 font-semibold">ตลาด</th>
                        <th className="px-4 py-3 font-semibold text-center">Provider</th>
                        <th className="px-4 py-3 font-semibold text-center">Booking/เดือน</th>
                        <th className="px-4 py-3 font-semibold text-right">Rev.Share</th>
                        <th className="px-4 py-3 font-semibold text-center">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {communities.map(comm => (
                        <tr key={comm.id}
                          onClick={() => comm.grantStatus === 'APPROVED' && setActiveCommunityId(comm.id)}
                          className={`hover:glass-sm/30 transition-colors ${
                            comm.id === activeCommunityId ? 'glass-sm/60' : ''
                          } ${comm.grantStatus === 'APPROVED' ? 'cursor-pointer' : 'opacity-60'}`}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-base">🏘️</span>
                              <div>
                                <p className="font-semibold text-slate-800">{comm.name}</p>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />{comm.location}
                                  {comm.isPrimary && <span className="text-primary font-semibold ml-1">• หลัก</span>}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-center font-semibold text-slate-700">
                            {comm.marketCreated ? comm.providers : '—'}
                          </td>
                          <td className="px-4 py-3.5 text-center font-semibold text-slate-700">
                            {comm.marketCreated ? comm.monthBookings : '—'}
                          </td>
                          <td className="px-4 py-3.5 text-right font-bold text-green-600">
                            {comm.marketCreated ? `฿${comm.revenueShare.toLocaleString()}` : '—'}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {comm.grantStatus === 'PENDING' ? (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">รออนุมัติ</span>
                            ) : !comm.marketCreated ? (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">รอสร้างตลาด</span>
                            ) : (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Active</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-white/20 flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400">
                      การเพิ่มตลาดใหม่ต้องได้รับอนุมัติจาก Super Admin ก่อนทุกครั้ง
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRequestPanel(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-blue-700 transition-colors whitespace-nowrap ml-4">
                    <Plus className="h-3.5 w-3.5" /> ขอเพิ่มตลาด
                  </button>
                </div>
              </motion.div>

              {/* ── Trial Period for active community ── */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={8}
                className="glass-card rounded-2xl">
                <div className="p-5 border-b border-white/20">
                  <h2 className="font-bold text-slate-900">ช่วงทดลองฟรี</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{activeCommunity.name}</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-green-800">กำลังดำเนินอยู่</span>
                    </div>
                    <div className="w-full bg-green-200/60 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }} />
                    </div>
                    <p className="text-xs text-green-600 mt-2">สิ้นสุด: <strong>{activeCommunity.trialEnd}</strong></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500">
                      หลังช่วงทดลอง Commission จะถูกหักตามปกติ และ Revenue Share ของคุณจะเริ่มคำนวณ
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ── Announcements (CA) ── */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={9}
                className="lg:col-span-2 glass-card rounded-2xl">
                <div className="flex items-center justify-between p-5 border-b border-white/20">
                  <div>
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4.5 w-4.5 text-amber-500" />
                      <h2 className="font-bold text-slate-900">ประกาศชุมชน</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">ประกาศของคุณจะกู้ไปให้ Super Admin อนุมัติก่อนเผยแพร่</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => { setEditingAnn(null); setAnnForm({ title: '', body: '', type: 'info' }); setShowAnnForm(v => !v) }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors">
                    <Plus className="h-3.5 w-3.5" /> สร้างประกาศ
                  </motion.button>
                </div>

                {/* Create/Edit inline form */}
                <AnimatePresence>
                  {showAnnForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="border-b border-white/20 overflow-hidden">
                      <div className="p-5 space-y-3 bg-amber-50/60">
                        <p className="text-xs font-bold text-amber-700">
                          {editingAnn ? '✏️ แก้ไขประกาศ' : '➕ สร้างประกาศใหม่'} — จะส่งรอ Super Admin อนุมัติ
                        </p>
                        <div className="flex gap-3">
                          <select value={annForm.type} onChange={e => setAnnForm(f => ({ ...f, type: e.target.value as CAnnType }))}
                            className="px-3 py-2 rounded-xl border glass border-white/20 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300">
                            <option value="info">ℹ️ ข้อมูล</option>
                            <option value="warning">⚠️ คำเตือน</option>
                            <option value="success">✅ ข่าวดี</option>
                          </select>
                          <input value={annForm.title} onChange={e => setAnnForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="หัวข้อ..."
                            className="flex-1 px-3 py-2 rounded-xl border glass border-white/20 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300" />
                        </div>
                        <textarea value={annForm.body} onChange={e => setAnnForm(f => ({ ...f, body: e.target.value }))}
                          rows={2} placeholder="เนื้อหาประกาศ..."
                          className="w-full px-3 py-2 rounded-xl border glass border-white/20 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none" />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => { setShowAnnForm(false); setEditingAnn(null) }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:glass-sm transition-colors">ยกเลิก</button>
                          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            disabled={!annForm.title.trim() || !annForm.body.trim()}
                            onClick={() => {
                              if (editingAnn) {
                                setCaAnnouncements(prev => prev.map(a => a.id === editingAnn.id ? { ...a, title: annForm.title, body: annForm.body, type: annForm.type, status: 'PENDING' } : a))
                              } else {
                                const newAnn: CAAnnouncement = { id: `CA${Date.now()}`, communityId: activeCommunityId, title: annForm.title, body: annForm.body, type: annForm.type, status: 'PENDING', createdAt: 'ตอนนี้' }
                                setCaAnnouncements(prev => [newAnn, ...prev])
                              }
                              setShowAnnForm(false); setEditingAnn(null)
                            }}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            📤 ส่งขออนุมัติ
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Announcement list for this community */}
                <div className="divide-y divide-white/10">
                  {caAnnouncements
                    .filter(a => a.communityId === activeCommunityId)
                    .map((ann) => (
                      <div key={ann.id} className="flex items-start gap-3 p-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          ann.type === 'warning' ? 'bg-amber-100' :
                          ann.type === 'success' ? 'bg-green-100' :
                          'bg-blue-100'
                        }`}>
                          <Megaphone className={`h-4 w-4 ${
                            ann.type === 'warning' ? 'text-amber-500' :
                            ann.type === 'success' ? 'text-green-500' :
                            'text-primary'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              ann.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                              ann.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {ann.status === 'PUBLISHED' ? '✅ เผยแพร่แล้ว' : ann.status === 'PENDING' ? '⏳ รอ SA อนุมัติ' : '❌ ถูกปฏิเสธ'}
                            </span>
                            <span className="text-xs text-slate-400 ml-auto">{ann.createdAt}</span>
                          </div>
                          <p className="font-semibold text-slate-800 text-sm">{ann.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{ann.body}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => { setEditingAnn(ann); setAnnForm({ title: ann.title, body: ann.body, type: ann.type }); setShowAnnForm(true) }}
                            className="w-7 h-7 rounded-lg glass-sm flex items-center justify-center hover:bg-blue-100 transition-colors">
                            <Pencil className="h-3.5 w-3.5 text-slate-500" />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => setCaAnnouncements(prev => prev.filter(a => a.id !== ann.id))}
                            className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  {caAnnouncements.filter(a => a.communityId === activeCommunityId).length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                      <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">ยังไม่มีประกาศ — ดัน “สร้างประกาศ” เพื่อส่งลูกค้าชุมชน</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/20">
                  <div className="flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2">
                    <Info className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">ประกาศจาก CA จะถูกแสดงหลังจาก Super Admin อนุมัติแล้วเท่านั้น</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </>
        )}

        {/* ── Request Additional Community Panel ── */}
        <AnimatePresence>
          {showRequestPanel && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={e => e.target === e.currentTarget && setShowRequestPanel(false)}>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                className="w-full max-w-lg glass-heavy rounded-3xl shadow-2xl overflow-hidden">
                <div className="glass-sm p-5 border-b border-primary/30">
                  <h3 className="font-extrabold text-slate-900 text-lg">ขอเพิ่มตลาดชุมชนใหม่</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    คำขอจะถูกส่งให้ Super Admin พิจารณา — โดยปกติใช้เวลา 1–3 วันทำการ
                  </p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-3 glass border border-primary/20 rounded-xl p-4">
                    <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                      Community Admin 1 บัญชีสามารถบริหารได้หลายตลาด
                      แต่ละตลาดมี dashboard, Provider pool และ Revenue Share แยกกันอิสระ
                      ทุกตลาดใหม่ต้องผ่านการอนุมัติจาก Super Admin
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-1.5">
                      <MapPin className="h-4 w-4 inline mr-1 text-primary" />
                      พื้นที่เป้าหมาย *
                    </label>
                    <input value={requestForm.location}
                      onChange={e => setRequestForm(f => ({ ...f, location: e.target.value }))}
                      placeholder="เช่น หมู่บ้านกรีนวิลล์ สมุทรปราการ"
                      className="w-full px-4 py-3 rounded-xl border glass border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-1.5">
                      เหตุผลในการขยาย *
                    </label>
                    <textarea value={requestForm.reason}
                      onChange={e => setRequestForm(f => ({ ...f, reason: e.target.value }))}
                      rows={3}
                      placeholder="อธิบายแผนการขยายและศักยภาพพื้นที่..."
                      className="w-full px-4 py-3 rounded-xl border glass border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all" />
                  </div>
                  <div className="flex items-start gap-2 glass-sm border border-amber-200/60 rounded-xl px-4 py-3">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      แต่ละตลาดใหม่จะเริ่มต้นด้วยช่วงทดลองฟรีตามที่ Super Admin กำหนด
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowRequestPanel(false)}
                      className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:glass-sm transition-colors">
                      ยกเลิก
                    </button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleSendRequest}
                      disabled={!requestForm.location || !requestForm.reason}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      <Send className="h-4 w-4" /> ส่งคำขอ
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      {/* Provider Detail Modal */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setSelectedProvider(null) }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-md glass-heavy rounded-2xl shadow-2xl overflow-hidden">
              <div className="glass-sm p-5 border-b border-white/20">
                <h3 className="font-extrabold text-lg text-slate-900">{selectedProvider.name}</h3>
                <p className="text-sm text-slate-500">{selectedProvider.category}</p>
              </div>
              <div className="p-5 space-y-3">
                {[
                  ['ประสบการณ์', selectedProvider.experience],
                  ['วันที่สมัคร', selectedProvider.applied],
                  ['โทรศัพท์', selectedProvider.phone],
                  ['หมายเหตุ', selectedProvider.note],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 text-sm py-1.5 border-b border-white/20 last:border-0">
                    <span className="text-slate-400 min-w-[100px]">{k}:</span>
                    <span className="font-semibold text-slate-800">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 px-5 py-4 border-t border-white/20 glass-sm/50">
                <button onClick={() => setSelectedProvider(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:glass-sm transition-colors">
                  ปิด
                </button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { approveProvider(selectedProvider.id); setSelectedProvider(null) }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <CheckCircle className="h-4 w-4" /> อนุมัติ
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { rejectProvider(selectedProvider.id); setSelectedProvider(null) }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors">
                  <XCircle className="h-4 w-4" /> ปฏิเสธ
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AppFooter />
    </main>
  )
}
