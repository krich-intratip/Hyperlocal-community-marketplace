'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import {
  Building2, CheckCircle, XCircle, AlertTriangle, Users, DollarSign,
  Search, ChevronRight, MoreVertical, Shield, Phone, Mail,
  ArrowRightLeft, Pause, Play, Eye, MessageCircle, Crown, MapPin,
  TrendingUp, Clock, Zap
} from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '@/lib/date'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

type CommunityStatus = 'pending' | 'active' | 'suspended' | 'takeover'

interface CommunityManager {
  id: string
  communityName: string
  province: string
  type: string
  managerName: string
  managerPhone: string
  managerEmail: string
  managerId: string // ID card last 4
  status: CommunityStatus
  appliedDate: string
  activeDate?: string
  providers: number
  bookingsMonth: number
  revenueMonth: number
  revenueSharePaid: number
  trustScore: number
  violations: number
  notes?: string
  trialEnd?: string
}

const MOCK_COMMUNITIES: CommunityManager[] = [
  {
    id: 'C001', communityName: 'หมู่บ้านศรีนคร', province: 'กรุงเทพฯ', type: 'หมู่บ้านจัดสรร',
    managerName: 'คุณวิชัย มั่นคง', managerPhone: '089-123-4567', managerEmail: 'wichai@email.com', managerId: '****1234',
    status: 'active', appliedDate: '2026-01-10', activeDate: '2026-01-20',
    providers: 34, bookingsMonth: 287, revenueMonth: 85400, revenueSharePaid: 8540,
    trustScore: 98, violations: 0, trialEnd: '30/04/2569',
  },
  {
    id: 'C002', communityName: 'คอนโด The Base Rama9', province: 'กรุงเทพฯ', type: 'คอนโดมิเนียม',
    managerName: 'คุณสมหญิง ใจดี', managerPhone: '081-234-5678', managerEmail: 'somying@email.com', managerId: '****5678',
    status: 'active', appliedDate: '2026-01-15', activeDate: '2026-01-25',
    providers: 21, bookingsMonth: 194, revenueMonth: 62000, revenueSharePaid: 6200,
    trustScore: 95, violations: 0, trialEnd: '31/05/2569',
  },
  {
    id: 'C003', communityName: 'ชุมชนเมืองทองธานี', province: 'นนทบุรี', type: 'หมู่บ้านจัดสรร',
    managerName: 'คุณประสิทธิ์ ดีงาม', managerPhone: '086-345-6789', managerEmail: 'prasit@email.com', managerId: '****9012',
    status: 'suspended', appliedDate: '2025-12-01', activeDate: '2025-12-15',
    providers: 18, bookingsMonth: 0, revenueMonth: 0, revenueSharePaid: 3200,
    trustScore: 45, violations: 3,
    notes: 'พบการปล่อยให้ Provider หลอกลวงลูกค้า และไม่ตอบสนองต่อการแจ้งเตือน 3 ครั้ง',
  },
  {
    id: 'C004', communityName: 'หมู่บ้านกรีนวิลล์เชียงใหม่', province: 'เชียงใหม่', type: 'หมู่บ้านจัดสรร',
    managerName: 'คุณนิตยา สุขสันต์', managerPhone: '082-456-7890', managerEmail: 'nitaya@email.com', managerId: '****3456',
    status: 'pending', appliedDate: '2026-03-05',
    providers: 0, bookingsMonth: 0, revenueMonth: 0, revenueSharePaid: 0,
    trustScore: 0, violations: 0,
  },
  {
    id: 'C005', communityName: 'คอนโด Ideo Sukhumvit', province: 'กรุงเทพฯ', type: 'คอนโดมิเนียม',
    managerName: 'คุณเอกชัย รวยมาก', managerPhone: '083-567-8901', managerEmail: 'eakachai@email.com', managerId: '****7890',
    status: 'pending', appliedDate: '2026-03-07',
    providers: 0, bookingsMonth: 0, revenueMonth: 0, revenueSharePaid: 0,
    trustScore: 0, violations: 0,
  },
  {
    id: 'C006', communityName: 'ชุมชนริมแม่น้ำปิง', province: 'เชียงใหม่', type: 'ชุมชนชนบท',
    managerName: 'คุณมานพ ขยันดี', managerPhone: '084-678-9012', managerEmail: 'manop@email.com', managerId: '****2345',
    status: 'takeover', appliedDate: '2025-11-01', activeDate: '2025-11-20',
    providers: 12, bookingsMonth: 45, revenueMonth: 12000, revenueSharePaid: 1800,
    trustScore: 30, violations: 5,
    notes: 'ผู้จัดการเดิมถูก Takeover เนื่องจากละเมิดกฎร้ายแรง กำลังหาผู้จัดการคนใหม่',
  },
]

const STATUS_CFG: Record<CommunityStatus, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  pending: { label: 'รอ Approve', bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-700', icon: Clock },
  active: { label: 'เปิดใช้งาน', bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-700', icon: CheckCircle },
  suspended: { label: 'ระงับการใช้งาน', bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-700', icon: Pause },
  takeover: { label: 'Takeover แล้ว', bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-700', icon: ArrowRightLeft },
}

type ModalType = 'approve' | 'reject' | 'suspend' | 'resume' | 'takeover' | 'transfer' | 'contact' | 'detail' | null

export default function SuperAdminFranchisePage() {
  const [communities, setCommunities] = useState<CommunityManager[]>(MOCK_COMMUNITIES)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<CommunityStatus | 'ALL'>('ALL')
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityManager | null>(null)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [actionNote, setActionNote] = useState('')
  const [transferTo, setTransferTo] = useState('')

  const filtered = communities
    .filter(c => filterStatus === 'ALL' || c.status === filterStatus)
    .filter(c => !search || c.communityName.includes(search) || c.managerName.includes(search) || c.province.includes(search))

  const stats = {
    total: communities.length,
    active: communities.filter(c => c.status === 'active').length,
    pending: communities.filter(c => c.status === 'pending').length,
    suspended: communities.filter(c => c.status === 'suspended').length,
    totalRevenue: communities.reduce((s, c) => s + c.revenueMonth, 0),
    totalRevenueShare: communities.reduce((s, c) => s + c.revenueSharePaid, 0),
  }

  function openModal(community: CommunityManager, type: ModalType) {
    setSelectedCommunity(community)
    setModalType(type)
    setActionNote('')
    setTransferTo('')
  }

  function executeAction() {
    if (!selectedCommunity) return
    setCommunities(prev => prev.map(c => {
      if (c.id !== selectedCommunity.id) return c
      if (modalType === 'approve') return { ...c, status: 'active', activeDate: new Date().toISOString().split('T')[0] }
      if (modalType === 'reject') return { ...c, status: 'suspended', notes: actionNote }
      if (modalType === 'suspend') return { ...c, status: 'suspended', violations: c.violations + 1, notes: actionNote }
      if (modalType === 'resume') return { ...c, status: 'active', notes: undefined }
      if (modalType === 'takeover') return { ...c, status: 'takeover', notes: actionNote }
      return c
    }))
    setModalType(null)
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950">
      <MarketBackground />
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-bold text-amber-600">Super Admin</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">จัดการ Franchise ชุมชน</h1>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Approve, Suspend, Takeover และโอนย้ายผู้จัดการตลาดชุมชน</p>
          </div>
          <motion.a href="/franchise" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-xl border-2 border-amber-400 px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
            <Building2 className="h-4 w-4" /> หน้า Franchise
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: 'ทั้งหมด', value: stats.total, icon: Building2, color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800' },
            { label: 'เปิดใช้งาน', value: stats.active, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/30' },
            { label: 'รอ Approve', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
            { label: 'ระงับแล้ว', value: stats.suspended, icon: Pause, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/30' },
            { label: 'รายได้/เดือน', value: `฿${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
            { label: 'Rev.Share จ่าย', value: `฿${(stats.totalRevenueShare / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i}
              className={`${s.bg} rounded-2xl p-4 border border-slate-100 dark:border-slate-700`}>
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pending alert */}
        {stats.pending > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 mb-6">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p className="text-base text-amber-800 dark:text-amber-300 font-semibold">
              มี <strong>{stats.pending} ชุมชน</strong> รอการ Approve — กรุณาตรวจสอบและดำเนินการ
            </p>
            <button onClick={() => setFilterStatus('pending')}
              className="ml-auto text-sm font-bold text-amber-700 dark:text-amber-400 hover:underline whitespace-nowrap">
              ดูทั้งหมด →
            </button>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
          className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="ค้นหาชุมชน ผู้จัดการ จังหวัด..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div className="flex gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 overflow-hidden">
            {(['ALL', 'pending', 'active', 'suspended', 'takeover'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 text-sm font-bold transition-colors ${filterStatus === s ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'}`}>
                {s === 'ALL' ? 'ทั้งหมด' : STATUS_CFG[s].label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Community list */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {filtered.map((community, i) => {
            const cfg = STATUS_CFG[community.status]
            return (
              <motion.div key={community.id} variants={fadeUp} custom={i}
                className="bg-white/90 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{community.communityName}</h3>
                        <span className={`inline-flex items-center gap-1 text-sm px-2.5 py-0.5 rounded-full border font-bold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          <cfg.icon className="h-3.5 w-3.5" /> {cfg.label}
                        </span>
                        {community.violations > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 border border-red-200 font-bold">
                            <AlertTriangle className="h-3 w-3" /> {community.violations} violations
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{community.province} · {community.type}</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{community.managerName}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{community.managerPhone}</span>
                        <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{community.managerEmail}</span>
                      </div>

                      {/* Stats row */}
                      {community.status === 'active' && (
                        <div className="flex flex-wrap gap-4 text-sm">
                          {[
                            { label: 'Provider', value: community.providers, icon: Users },
                            { label: 'Booking/เดือน', value: community.bookingsMonth, icon: TrendingUp },
                            { label: 'รายได้/เดือน', value: `฿${community.revenueMonth.toLocaleString()}`, icon: DollarSign },
                            { label: 'Rev.Share', value: `฿${community.revenueSharePaid.toLocaleString()}`, icon: Zap },
                            { label: 'Trust Score', value: community.trustScore, icon: Shield },
                          ].map(s => (
                            <div key={s.label} className="flex items-center gap-1.5">
                              <s.icon className="h-3.5 w-3.5 text-slate-400" />
                              <span className="text-slate-500 dark:text-slate-400">{s.label}:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{s.value}</span>
                            </div>
                          ))}
                          {community.trialEnd && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-green-500" />
                              <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">ทดลองถึง {community.trialEnd}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Pending info */}
                      {community.status === 'pending' && (
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                          ยื่นใบสมัครเมื่อ: <strong>{formatDate(community.appliedDate)}</strong>
                        </p>
                      )}

                      {/* Notes for suspended/takeover */}
                      {community.notes && (
                        <div className="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl px-3 py-2">
                          <p className="text-sm text-red-700 dark:text-red-400">{community.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Right: action buttons */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {/* View detail */}
                      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                        onClick={() => openModal(community, 'detail')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-colors">
                        <Eye className="h-4 w-4" /> รายละเอียด
                      </motion.button>

                      {/* Contact */}
                      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                        onClick={() => openModal(community, 'contact')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-600 border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <MessageCircle className="h-4 w-4" /> ติดต่อ
                      </motion.button>

                      {/* Pending → Approve/Reject */}
                      {community.status === 'pending' && (
                        <>
                          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                            onClick={() => openModal(community, 'approve')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-green-700 bg-green-100 dark:bg-green-900/40 hover:bg-green-200 transition-colors">
                            <CheckCircle className="h-4 w-4" /> Approve
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                            onClick={() => openModal(community, 'reject')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 transition-colors">
                            <XCircle className="h-4 w-4" /> ปฏิเสธ
                          </motion.button>
                        </>
                      )}

                      {/* Active → Suspend / Takeover / Transfer */}
                      {community.status === 'active' && (
                        <>
                          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                            onClick={() => openModal(community, 'suspend')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 transition-colors">
                            <Pause className="h-4 w-4" /> Suspend
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                            onClick={() => openModal(community, 'takeover')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 transition-colors">
                            <Shield className="h-4 w-4" /> Takeover
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                            onClick={() => openModal(community, 'transfer')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 transition-colors">
                            <ArrowRightLeft className="h-4 w-4" /> โอนย้าย
                          </motion.button>
                        </>
                      )}

                      {/* Suspended → Resume */}
                      {(community.status === 'suspended' || community.status === 'takeover') && (
                        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                          onClick={() => openModal(community, 'resume')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-green-700 bg-green-100 dark:bg-green-900/40 hover:bg-green-200 transition-colors">
                          <Play className="h-4 w-4" /> เปิดใหม่
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-base">ไม่พบชุมชนที่ตรงกัน</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* ─────────── MODAL ─────────── */}
      <AnimatePresence>
        {modalType && selectedCommunity && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setModalType(null) }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

              {/* Modal header */}
              <div className={`p-5 border-b border-slate-100 dark:border-slate-700 ${
                modalType === 'approve' ? 'bg-green-50 dark:bg-green-900/20' :
                modalType === 'suspend' || modalType === 'reject' ? 'bg-red-50 dark:bg-red-900/20' :
                modalType === 'takeover' ? 'bg-purple-50 dark:bg-purple-900/20' :
                modalType === 'transfer' ? 'bg-indigo-50 dark:bg-indigo-900/20' :
                'bg-slate-50 dark:bg-slate-800'
              }`}>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {modalType === 'approve' && '✅ Approve ชุมชน'}
                  {modalType === 'reject' && '❌ ปฏิเสธใบสมัคร'}
                  {modalType === 'suspend' && '⏸️ Suspend ชุมชน'}
                  {modalType === 'resume' && '▶️ เปิดใช้งานอีกครั้ง'}
                  {modalType === 'takeover' && '🛡️ Takeover ชุมชน'}
                  {modalType === 'transfer' && '↔️ โอนย้ายผู้จัดการ'}
                  {modalType === 'contact' && '💬 ติดต่อผู้จัดการ'}
                  {modalType === 'detail' && '📋 รายละเอียดชุมชน'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{selectedCommunity.communityName}</p>
              </div>

              <div className="p-5 space-y-4">
                {/* Detail modal */}
                {modalType === 'detail' && (
                  <div className="space-y-3">
                    {[
                      ['ชุมชน', selectedCommunity.communityName],
                      ['ประเภท', selectedCommunity.type],
                      ['จังหวัด', selectedCommunity.province],
                      ['ผู้จัดการ', selectedCommunity.managerName],
                      ['เลขบัตร (บางส่วน)', selectedCommunity.managerId],
                      ['โทรศัพท์', selectedCommunity.managerPhone],
                      ['อีเมล', selectedCommunity.managerEmail],
                      ['วันที่สมัคร', formatDate(selectedCommunity.appliedDate)],
                      ['วันที่เปิดใช้งาน', selectedCommunity.activeDate ? formatDate(selectedCommunity.activeDate) : '-'],
                      ['Violations', String(selectedCommunity.violations)],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <span className="text-sm text-slate-400 min-w-[140px]">{k}</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{v}</span>
                      </div>
                    ))}
                    {selectedCommunity.notes && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                        <p className="text-sm text-red-700 dark:text-red-400">{selectedCommunity.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact modal */}
                {modalType === 'contact' && (
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 space-y-2">
                      <p className="font-bold text-blue-800 dark:text-blue-300 text-base">{selectedCommunity.managerName}</p>
                      <p className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400"><Phone className="h-4 w-4" />{selectedCommunity.managerPhone}</p>
                      <p className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400"><Mail className="h-4 w-4" />{selectedCommunity.managerEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">ส่งข้อความ (บันทึก Log)</label>
                      <textarea value={actionNote} onChange={e => setActionNote(e.target.value)}
                        rows={3} placeholder="พิมพ์ข้อความที่ต้องการส่ง..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                    </div>
                  </div>
                )}

                {/* Approve modal */}
                {modalType === 'approve' && (
                  <div className="space-y-3">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                      <p className="text-base text-green-800 dark:text-green-300 font-semibold">
                        อนุมัติ <strong>{selectedCommunity.communityName}</strong> ให้เปิดตลาดชุมชนได้
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        ผู้จัดการ: {selectedCommunity.managerName} จะได้รับ Dashboard และสามารถเชิญ Provider เข้าระบบได้ทันที
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">หมายเหตุ (optional)</label>
                      <input value={actionNote} onChange={e => setActionNote(e.target.value)}
                        placeholder="เช่น ให้ช่วงทดลอง 3 เดือน..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    </div>
                  </div>
                )}

                {/* Suspend / Reject modal */}
                {(modalType === 'suspend' || modalType === 'reject') && (
                  <div className="space-y-3">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                      <p className="text-base text-red-800 dark:text-red-300 font-semibold">
                        {modalType === 'suspend' ? 'ระงับการดำเนินงาน' : 'ปฏิเสธใบสมัคร'} — {selectedCommunity.communityName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">เหตุผล *</label>
                      <textarea value={actionNote} onChange={e => setActionNote(e.target.value)}
                        rows={3} placeholder="ระบุเหตุผลให้ชัดเจน เพื่อบันทึกประวัติและแจ้งผู้จัดการ..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                    </div>
                  </div>
                )}

                {/* Takeover modal */}
                {modalType === 'takeover' && (
                  <div className="space-y-3">
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                      <p className="text-base font-bold text-purple-800 dark:text-purple-300 mb-1">⚠️ การ Takeover จะ:</p>
                      <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1 list-disc list-inside">
                        <li>ถอดสิทธิ์ผู้จัดการคนปัจจุบันทันที</li>
                        <li>Super Admin เข้ามาดูแลแทนชั่วคราว</li>
                        <li>ตลาดชุมชนยังเปิดให้ลูกค้าใช้งานได้ปกติ</li>
                        <li>บันทึกประวัติไว้ในระบบถาวร</li>
                      </ul>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">เหตุผล Takeover *</label>
                      <textarea value={actionNote} onChange={e => setActionNote(e.target.value)}
                        rows={3} placeholder="ละเอียดเหตุผล เช่น ละเมิดกฎข้อ 3.2 เรื่องการโกง Commission..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                    </div>
                  </div>
                )}

                {/* Transfer modal */}
                {modalType === 'transfer' && (
                  <div className="space-y-3">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                      <p className="text-base text-indigo-800 dark:text-indigo-300 font-semibold">
                        โอนย้ายชุมชน <strong>{selectedCommunity.communityName}</strong> ให้ผู้จัดการคนใหม่
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">อีเมลหรือรหัสผู้จัดการคนใหม่ *</label>
                      <input value={transferTo} onChange={e => setTransferTo(e.target.value)}
                        placeholder="email@domain.com หรือ User ID"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">เหตุผลการโอน *</label>
                      <textarea value={actionNote} onChange={e => setActionNote(e.target.value)}
                        rows={2} placeholder="เช่น ผู้จัดการเดิมขอลาออก ส่งมอบให้รองผู้จัดการ..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                    </div>
                  </div>
                )}

                {/* Resume modal */}
                {modalType === 'resume' && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                    <p className="text-base text-green-800 dark:text-green-300 font-semibold">
                      เปิดใช้งาน <strong>{selectedCommunity.communityName}</strong> อีกครั้ง
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">ตลาดชุมชนจะกลับมาใช้งานได้ทันที</p>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <button onClick={() => setModalType(null)}
                  className="px-5 py-2.5 rounded-xl text-base font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  ยกเลิก
                </button>
                {modalType !== 'detail' && (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={executeAction}
                    disabled={(modalType === 'suspend' || modalType === 'reject' || modalType === 'takeover') && !actionNote}
                    className={`px-5 py-2.5 rounded-xl text-base font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      modalType === 'approve' || modalType === 'resume' ? 'bg-green-600 hover:bg-green-700' :
                      modalType === 'suspend' || modalType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                      modalType === 'takeover' ? 'bg-purple-600 hover:bg-purple-700' :
                      modalType === 'transfer' ? 'bg-indigo-600 hover:bg-indigo-700' :
                      'bg-blue-600 hover:bg-blue-700'
                    }`}>
                    {modalType === 'approve' && '✅ Approve'}
                    {modalType === 'reject' && '❌ ปฏิเสธ'}
                    {modalType === 'suspend' && '⏸ Suspend'}
                    {modalType === 'resume' && '▶ เปิดใหม่'}
                    {modalType === 'takeover' && '🛡 Takeover'}
                    {modalType === 'transfer' && '↔ โอนย้าย'}
                    {modalType === 'contact' && '📨 ส่งข้อความ'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-base text-slate-400 dark:text-slate-500">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}
