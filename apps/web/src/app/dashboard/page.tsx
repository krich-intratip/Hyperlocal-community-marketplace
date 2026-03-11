'use client'

import { motion } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { CalendarCheck, Star, MessageCircle, MapPin, ChevronRight, Clock, CheckCircle, XCircle, Package, DollarSign, Users, Shield } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useBookings } from '@/hooks/useBookings'
import { useDateFormat } from '@/hooks/useDateFormat'
import { useAuthGuard } from '@/hooks/useAuthGuard'

type Role = 'customer' | 'provider' | 'admin' | 'superadmin'
const ROLE_CONFIG: Record<Role, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  customer:   { label: 'ลูกค้า',           emoji: '🛍️', color: 'text-blue-700',  bg: 'glass-sm',  border: 'border-primary/30'  },
  provider:   { label: 'ผู้ให้บริการ',     emoji: '⭐', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  admin:      { label: 'Admin ชุมชน',       emoji: '🏘️', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  superadmin: { label: 'Super Admin',       emoji: '👑', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07 },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const STATUS_CONFIG = {
  confirmed: { label: 'ยืนยันแล้ว', bg: 'glass-sm', text: 'text-primary', icon: CheckCircle, border: 'border-primary/30' },
  pending: { label: 'รอยืนยัน', bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock, border: 'border-amber-100' },
  completed: { label: 'เสร็จแล้ว', bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle, border: 'border-green-100' },
  cancelled: { label: 'ยกเลิก', bg: 'bg-red-50', text: 'text-red-500', icon: XCircle, border: 'border-red-100' },
}

export default function CustomerDashboardPage() {
  const { user } = useAuthGuard()
  const [role, setRole] = useState<Role>((user?.role as Role) ?? 'customer')
  const { data: bookings = [] } = useBookings()
  const { fmt } = useDateFormat()
  const completed = bookings.filter((b) => b.status === 'completed').length
  const totalSpent = bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.total, 0)
  const roleCfg = ROLE_CONFIG[role]

  const ROLE_DASHBOARD_LINKS: Record<Role, { href: string; label: string }> = {
    customer:   { href: '/dashboard',            label: 'แดชบอร์ดลูกค้า' },
    provider:   { href: '/dashboard/provider',   label: 'Provider Dashboard' },
    admin:      { href: '/dashboard/admin',      label: 'Admin Dashboard' },
    superadmin: { href: '/dashboard/superadmin', label: 'Super Admin' },
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Role switcher */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="mb-6 p-4 glass-card rounded-2xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">ดูในฐานะ</p>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(ROLE_CONFIG) as Role[]).map(r => {
              const cfg = ROLE_CONFIG[r]
              return (
                <button key={r} onClick={() => setRole(r)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                    role === r ? `${cfg.border} ${cfg.bg} ${cfg.color}` : 'border-white/20 glass text-slate-600 hover:border-white/40'
                  }`}>
                  {cfg.emoji} {cfg.label}
                </button>
              )
            })}
          </div>
          {role !== 'customer' && (
            <Link href={ROLE_DASHBOARD_LINKS[role].href as any}
              className={`mt-3 inline-flex items-center gap-1.5 text-xs font-bold ${roleCfg.color} hover:underline`}>
              ไปที่ {ROLE_DASHBOARD_LINKS[role].label} <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-slate-500 mb-1">👋 ยินดีต้อนรับกลับ — วันนี้มีการจอง 2 รายการรอยืนยัน</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">แดชบอร์ดของฉัน</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/bookings"
                className="inline-flex items-center gap-2 rounded-xl glass border border-white/20 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary/30 transition-colors">
                <Package className="h-4 w-4 text-primary" /> การจองทั้งหมด
              </Link>
              <Link href="/marketplace"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
                🛍️ ค้นหาบริการ
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'การจองทั้งหมด', value: bookings.length, icon: CalendarCheck, color: 'text-primary', bg: 'glass-sm' },
            { label: 'เสร็จแล้ว', value: completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'ยอดใช้จ่าย', value: `฿${totalSpent.toLocaleString()}`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'ชุมชนที่เข้าร่วม', value: 2, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} custom={i}
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl glass-card">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bookings */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
          className="glass-card rounded-2xl mb-6">
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="font-bold text-slate-900">การจองของฉัน</h2>
            <Link href="/marketplace" className="text-sm text-primary font-medium hover:text-primary/80 flex items-center gap-1">
              จองเพิ่ม <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {bookings.slice(0, 4).map((booking, i) => {
              const cfg = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG['pending']
              return (
                <motion.div key={booking.id} variants={fadeUp} custom={i}
                  className="flex items-center gap-4 p-5 hover:bg-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl glass-sm flex items-center justify-center text-2xl flex-shrink-0">
                    {booking.listingImage}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 text-sm">{booking.listingTitle}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{booking.provider}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />{fmt(booking.date)} · {booking.time}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-slate-900 text-sm">฿{booking.total.toLocaleString()}</div>
                    <div className={`inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <cfg.icon className="h-3 w-3" /> {cfg.label}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/bookings', icon: '�', label: 'การจองทั้งหมด', desc: 'ดูสถานะและรีวิว' },
            { href: '/marketplace', icon: '🛍️', label: 'หาบริการใหม่', desc: 'เลือกบริการในชุมชน' },
            { href: '/dashboard/provider', icon: '⭐', label: 'Dashboard Provider', desc: 'จัดการ listings และรายได้' },
          ].map((action, i) => (
            <motion.div key={action.href} variants={fadeUp} custom={i} whileHover={{ y: -3 }}>
              <Link href={action.href as any}
                className="flex items-center gap-4 p-5 rounded-2xl glass-card hover:border-primary/30 transition-all group">
                <span className="text-3xl">{action.icon}</span>
                <div>
                  <div className="font-semibold text-slate-800 text-sm group-hover:text-primary transition-colors">{action.label}</div>
                  <div className="text-xs text-slate-500">{action.desc}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-primary/60 group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <AppFooter />
    </main>
  )
}
