'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  Calendar, Clock, MapPin, ChevronRight, Search, Filter,
  CheckCircle, XCircle, AlertCircle, Package, Star, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useBookings } from '@/hooks/useBookings'
import { useDateFormat } from '@/hooks/useDateFormat'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.06 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

type BookingStatus = 'upcoming' | 'pending' | 'completed' | 'cancelled'

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  upcoming:  { label: 'ยืนยันแล้ว', color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: Clock },
  pending:   { label: 'รอยืนยัน',   color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: AlertCircle },
  completed: { label: 'เสร็จสิ้น',  color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  icon: CheckCircle },
  cancelled: { label: 'ยกเลิก',     color: 'text-slate-500',  bg: 'bg-slate-50',  border: 'border-slate-200',  icon: XCircle },
}

const FILTER_TABS: { key: BookingStatus | 'ALL'; label: string }[] = [
  { key: 'ALL',       label: 'ทั้งหมด' },
  { key: 'upcoming',  label: 'ยืนยันแล้ว' },
  { key: 'pending',   label: 'รอยืนยัน' },
  { key: 'completed', label: 'เสร็จสิ้น' },
  { key: 'cancelled', label: 'ยกเลิก' },
]

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState<BookingStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const { data: allBookings = [], isLoading } = useBookings()
  const { fmt } = useDateFormat()

  const filtered = allBookings
    .filter(b => activeFilter === 'ALL' || b.status === activeFilter)
    .filter(b => !search || b.listingTitle.includes(search) || b.provider.includes(search) || b.id.includes(search))

  const counts = allBookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1
    return acc
  }, {} as Record<BookingStatus, number>)

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Package className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-slate-900">การจองของฉัน</h1>
          </div>
          <p className="text-sm text-slate-500">ติดตามสถานะการจองบริการทั้งหมด</p>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-4 gap-3 mb-6">
          {(['upcoming', 'pending', 'completed', 'cancelled'] as BookingStatus[]).map((s, i) => {
            const cfg = STATUS_CONFIG[s]
            return (
              <motion.button key={s} variants={fadeUp} custom={i}
                onClick={() => setActiveFilter(s)}
                className={`rounded-2xl p-3 text-center border transition-all ${
                  activeFilter === s ? `${cfg.bg} ${cfg.border}` : 'bg-white/80 border-slate-100 hover:border-slate-200'
                }`}>
                <div className={`text-xl font-extrabold ${cfg.color}`}>{counts[s] ?? 0}</div>
                <div className={`text-xs mt-0.5 font-medium ${activeFilter === s ? cfg.color : 'text-slate-500'}`}>{cfg.label}</div>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Search + Filter tabs */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาบริการ, ผู้ให้บริการ, หมายเลขจอง..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 outline-none" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTER_TABS.map(t => (
              <button key={t.key} onClick={() => setActiveFilter(t.key)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-bold transition-all ${
                  activeFilter === t.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/80 text-slate-600 border border-slate-200 hover:border-blue-200'
                }`}>{t.label}</button>
            ))}
          </div>
        </motion.div>

        {/* Bookings list */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white/80 border border-slate-100 h-28 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center py-16">
              <Package className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="font-bold text-slate-500">ไม่พบการจอง</p>
              <p className="text-sm text-slate-400 mt-1 mb-5">ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</p>
              <Link href="/marketplace"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                ไปที่ Marketplace <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div key="list" variants={stagger} initial="hidden" animate="show"
              className="space-y-3">
              {filtered.map((booking, i) => {
                const cfg = STATUS_CONFIG[booking.status as BookingStatus] ?? STATUS_CONFIG['upcoming']
                const StatusIcon = cfg.icon
                return (
                  <motion.div key={booking.id} variants={fadeUp} custom={i} whileHover={{ y: -2 }}>
                    <Link href={`/bookings/${booking.id}` as any}
                      className="block bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all p-5 group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                          {booking.listingImage}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm">{booking.listingTitle}</h3>
                              <p className="text-xs text-slate-500 mt-0.5">{booking.provider} · {booking.community}</p>
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                              <StatusIcon className="h-3 w-3" /> {cfg.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {fmt(booking.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {booking.time} น.
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {booking.community}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <span className="text-xs text-slate-400">#{booking.id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {booking.reviewLeft === false && booking.status === 'completed' && (
                                <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                  รอรีวิว
                                </span>
                              )}
                              <span className="font-extrabold text-blue-600">฿{booking.total.toLocaleString()}</span>
                              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA for empty state */}
        {!isLoading && allBookings.length === 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="text-center py-16">
            <Package className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-600 mb-2">ยังไม่มีการจอง</h2>
            <p className="text-sm text-slate-400 mb-6">เริ่มหาบริการในชุมชนของคุณได้เลย</p>
            <Link href="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
              🛍️ ไปที่ Marketplace <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

      </section>
      <AppFooter />
    </main>
  )
}
