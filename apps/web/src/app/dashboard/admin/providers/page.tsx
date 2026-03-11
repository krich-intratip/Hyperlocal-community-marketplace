'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import {
  ChevronLeft, Search, CheckCircle, XCircle, Clock, Shield,
  Star, MapPin, Eye, ChevronRight, Filter, Users,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

type ProviderStatus = 'pending' | 'approved' | 'suspended'

interface Provider {
  id: string; name: string; category: string; avatar: string
  appliedDate: string; rating: number; bookings: number
  community: string; status: ProviderStatus; trustScore: number
  bio: string; phone: string
}

const MOCK_PROVIDERS: Provider[] = [
  { id: '1', name: 'คุณแม่สมใจ', category: 'อาหาร', avatar: '👩‍🍳', appliedDate: '1 มี.ค. 2569', rating: 4.9, bookings: 342, community: 'หมู่บ้านศรีนคร', status: 'approved', trustScore: 98, bio: 'ทำอาหารกล่องมา 5 ปี ลูกค้าประจำ 80 ครัวเรือน', phone: '08X-XXX-XXXX' },
  { id: '2', name: 'ช่างสมชาย', category: 'งานช่าง', avatar: '👨‍🔧', appliedDate: '5 มี.ค. 2569', rating: 0, bookings: 0, community: 'หมู่บ้านศรีนคร', status: 'pending', trustScore: 0, bio: 'ช่างแอร์ประสบการณ์ 10 ปี', phone: '09X-XXX-XXXX' },
  { id: '3', name: 'ครูน้องใหม่', category: 'สอนพิเศษ', avatar: '👩‍🏫', appliedDate: '3 มี.ค. 2569', rating: 5.0, bookings: 42, community: 'คอนโด The Base', status: 'approved', trustScore: 94, bio: 'ครูสอนภาษาอังกฤษประถม ป.1–6', phone: '08X-YYY-XXXX' },
  { id: '4', name: 'คุณสมศรี', category: 'ดูแลผู้สูงอายุ', avatar: '👩‍⚕️', appliedDate: '7 มี.ค. 2569', rating: 0, bookings: 0, community: 'หมู่บ้านศรีนคร', status: 'pending', trustScore: 0, bio: 'พยาบาลเกษียณ ดูแลผู้สูงอายุ 15 ปี', phone: '09X-YYY-XXXX' },
  { id: '5', name: 'ร้านป้าแดง', category: 'สินค้าทำมือ', avatar: '👩‍🎨', appliedDate: '28 ก.พ. 2569', rating: 4.8, bookings: 56, community: 'หมู่บ้านศรีนคร', status: 'suspended', trustScore: 62, bio: 'กระเป๋าผ้าทอมือ handmade', phone: '08X-ZZZ-XXXX' },
  { id: '6', name: 'ดีไซเนอร์เอ', category: 'ฟรีแลนซ์', avatar: '👨‍💻', appliedDate: '9 มี.ค. 2569', rating: 0, bookings: 0, community: 'คอนโด The Base', status: 'pending', trustScore: 0, bio: 'ออกแบบ Logo & Brand Identity', phone: '09X-ZZZ-XXXX' },
]

const STATUS_CONFIG: Record<ProviderStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending:   { label: 'รอพิจารณา', color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: Clock },
  approved:  { label: 'อนุมัติแล้ว', color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200',  icon: CheckCircle },
  suspended: { label: 'ระงับบัญชี', color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200',    icon: XCircle },
}

const FILTER_TABS: { key: ProviderStatus | 'ALL'; label: string }[] = [
  { key: 'ALL',       label: 'ทั้งหมด' },
  { key: 'pending',   label: 'รอพิจารณา' },
  { key: 'approved',  label: 'อนุมัติแล้ว' },
  { key: 'suspended', label: 'ระงับ' },
]

function DetailModal({ provider, onClose, onAction }: {
  provider: Provider
  onClose: () => void
  onAction: (id: string, action: 'approve' | 'reject' | 'suspend' | 'reinstate') => void
}) {
  const cfg = STATUS_CONFIG[provider.status]
  const StatusIcon = cfg.icon
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        className="glass-heavy rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-slate-900">รายละเอียด Provider</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:glass-sm flex items-center justify-center text-slate-500">✕</button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 mb-4 p-4 glass-sm rounded-2xl">
          <div className="w-14 h-14 rounded-2xl glass border-white/20 flex items-center justify-center text-3xl shadow-sm">{provider.avatar}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900">{provider.name}</h3>
              {provider.status === 'approved' && <Shield className="h-4 w-4 text-primary" />}
            </div>
            <p className="text-sm text-slate-500">{provider.category} · {provider.community}</p>
            <span className={`mt-1 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
              <StatusIcon className="h-3 w-3" /> {cfg.label}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-5">
          {[
            { label: 'สมัครวันที่', value: provider.appliedDate },
            { label: 'เบอร์โทร', value: provider.phone },
            { label: 'ชุมชน', value: provider.community },
            { label: 'ประวัติ', value: provider.bio },
            ...(provider.status === 'approved' ? [
              { label: 'Trust Score', value: `${provider.trustScore}/100` },
              { label: 'Rating', value: `${provider.rating} ⭐ (${provider.bookings} งาน)` },
            ] : []),
          ].map(row => (
            <div key={row.label} className="flex gap-3 text-sm">
              <span className="text-slate-400 w-24 flex-shrink-0">{row.label}</span>
              <span className="text-slate-800 font-medium">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {provider.status === 'pending' && (
            <>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => onAction(provider.id, 'approve')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors">
                <CheckCircle className="h-4 w-4" /> อนุมัติ Provider
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => onAction(provider.id, 'reject')}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                <XCircle className="h-4 w-4" /> ปฏิเสธ
              </motion.button>
            </>
          )}
          {provider.status === 'approved' && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => onAction(provider.id, 'suspend')}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
              <XCircle className="h-4 w-4" /> ระงับบัญชี
            </motion.button>
          )}
          {provider.status === 'suspended' && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => onAction(provider.id, 'reinstate')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors">
              <CheckCircle className="h-4 w-4" /> คืนสถานะ
            </motion.button>
          )}
          <Link href={`/providers/${provider.id}` as any}
            className="w-full flex items-center justify-center gap-2 rounded-xl glass-sm py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors">
            <Eye className="h-4 w-4" /> ดู Public Profile
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminProvidersPage() {
  useAuthGuard(['admin', 'superadmin'])
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS)
  const [activeFilter, setActiveFilter] = useState<ProviderStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)

  const filtered = providers
    .filter(p => activeFilter === 'ALL' || p.status === activeFilter)
    .filter(p => !search || p.name.includes(search) || p.category.includes(search))

  const counts = providers.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {} as Record<ProviderStatus, number>)

  function handleAction(id: string, action: 'approve' | 'reject' | 'suspend' | 'reinstate') {
    setProviders(prev => prev.map(p => {
      if (p.id !== id) return p
      if (action === 'approve') return { ...p, status: 'approved' as ProviderStatus, trustScore: 80 }
      if (action === 'reject' || action === 'suspend') return { ...p, status: 'suspended' as ProviderStatus }
      if (action === 'reinstate') return { ...p, status: 'approved' as ProviderStatus }
      return p
    }))
    setSelectedProvider(null)
  }

  return (
    <>
      <AnimatePresence>
        {selectedProvider && (
          <DetailModal
            provider={selectedProvider}
            onClose={() => setSelectedProvider(null)}
            onAction={handleAction}
          />
        )}
      </AnimatePresence>

      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

          {/* Breadcrumb */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/dashboard/admin" className="hover:text-primary flex items-center gap-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">จัดการ Providers</span>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" /> จัดการ Providers
            </h1>
            <p className="text-sm text-slate-500 mt-1">อนุมัติ ระงับ และดูแล Providers ในชุมชน</p>
          </motion.div>

          {/* Stat cards */}
          <motion.div variants={stagger} initial="hidden" animate="show"
            className="grid grid-cols-3 gap-3 mb-6">
            {(['pending', 'approved', 'suspended'] as ProviderStatus[]).map((s, i) => {
              const cfg = STATUS_CONFIG[s]
              return (
                <motion.button key={s} variants={fadeUp} custom={i}
                  onClick={() => setActiveFilter(s)}
                  className={`rounded-2xl p-4 border text-center transition-all ${
                    activeFilter === s ? `${cfg.bg} ${cfg.border}` : 'glass-sm hover:border-white/30'
                  }`}>
                  <div className={`text-2xl font-extrabold ${cfg.color}`}>{counts[s] ?? 0}</div>
                  <div className={`text-xs font-medium mt-0.5 ${activeFilter === s ? cfg.color : 'text-slate-500'}`}>{cfg.label}</div>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Search + filter */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="mb-5 space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อ, หมวดหมู่..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border glass border-white/20/90 text-sm text-slate-800 placeholder-slate-400 focus:border-primary/30 outline-none" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTER_TABS.map(t => (
                <button key={t.key} onClick={() => setActiveFilter(t.key)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-bold transition-all ${
                    activeFilter === t.key ? 'bg-primary text-white shadow-sm' : 'glass-sm text-slate-600 hover:border-primary/30'
                  }`}>{t.label}</button>
              ))}
            </div>
          </motion.div>

          {/* Provider list */}
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-16">
                <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                <p className="font-bold text-slate-500">ไม่พบ Provider</p>
              </motion.div>
            ) : (
              <motion.div key="list" variants={stagger} initial="hidden" animate="show" className="space-y-3">
                {filtered.map((provider, i) => {
                  const cfg = STATUS_CONFIG[provider.status]
                  const StatusIcon = cfg.icon
                  return (
                    <motion.div key={provider.id} variants={fadeUp} custom={i} whileHover={{ y: -2 }}>
                      <div className="glass-card rounded-2xl p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl glass-sm flex items-center justify-center text-2xl flex-shrink-0">
                            {provider.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-slate-900 text-sm">{provider.name}</h3>
                              <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                                <StatusIcon className="h-3 w-3" /> {cfg.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                              <span>{provider.category}</span>
                              <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{provider.community}</span>
                              {provider.status === 'approved' && provider.rating > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{provider.rating} ({provider.bookings} งาน)
                                </span>
                              )}
                              <span>สมัคร {provider.appliedDate}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            {provider.status === 'pending' && (
                              <>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAction(provider.id, 'approve')}
                                  className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                                  <CheckCircle className="h-3.5 w-3.5" /> อนุมัติ
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAction(provider.id, 'reject')}
                                  className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                                  <XCircle className="h-3.5 w-3.5" /> ปฏิเสธ
                                </motion.button>
                              </>
                            )}
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedProvider(provider)}
                              className="w-9 h-9 rounded-xl border border-slate-200 hover:border-primary/30 hover:glass-sm flex items-center justify-center transition-all">
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      <AppFooter />
      </main>
    </>
  )
}
