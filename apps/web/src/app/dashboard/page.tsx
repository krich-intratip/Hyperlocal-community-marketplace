'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { CalendarCheck, Star, MessageCircle, MapPin, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07 },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const MOCK_BOOKINGS = [
  { id: 'B001', service: 'ทำอาหารกล่อง', provider: 'คุณแม่สมใจ', date: '8 มี.ค. 2569', time: '11:30', status: 'confirmed', price: 240, emoji: '🍱' },
  { id: 'B002', service: 'ล้างแอร์', provider: 'ช่างสมชาย', date: '10 มี.ค. 2569', time: '09:00', status: 'pending', price: 500, emoji: '🔧' },
  { id: 'B003', service: 'ทำความสะอาดบ้าน', provider: 'แม่บ้านสาวิตรี', date: '5 มี.ค. 2569', time: '13:00', status: 'completed', price: 800, emoji: '🧹' },
  { id: 'B004', service: 'นวดแผนไทย', provider: 'หมอนวดประเสริฐ', date: '1 มี.ค. 2569', time: '16:00', status: 'cancelled', price: 400, emoji: '💆' },
]

const STATUS_CONFIG = {
  confirmed: { label: 'ยืนยันแล้ว', bg: 'bg-blue-50', text: 'text-blue-600', icon: CheckCircle, border: 'border-blue-100' },
  pending: { label: 'รอยืนยัน', bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock, border: 'border-amber-100' },
  completed: { label: 'เสร็จแล้ว', bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle, border: 'border-green-100' },
  cancelled: { label: 'ยกเลิก', bg: 'bg-red-50', text: 'text-red-500', icon: XCircle, border: 'border-red-100' },
}

export default function CustomerDashboardPage() {
  const completed = MOCK_BOOKINGS.filter((b) => b.status === 'completed').length
  const totalSpent = MOCK_BOOKINGS.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.price, 0)

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-8">
          <p className="text-sm text-slate-500 mb-1">ยินดีต้อนรับกลับ 👋</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">แดชบอร์ดของฉัน</h1>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'การจองทั้งหมด', value: MOCK_BOOKINGS.length, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'เสร็จแล้ว', value: completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'ยอดใช้จ่าย', value: `฿${totalSpent.toLocaleString()}`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'ชุมชนที่เข้าร่วม', value: 2, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} custom={i}
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-100 shadow-sm">
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
          className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm mb-6">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">การจองของฉัน</h2>
            <Link href="/marketplace" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              จองเพิ่ม <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_BOOKINGS.map((booking, i) => {
              const cfg = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG]
              return (
                <motion.div key={booking.id} variants={fadeUp} custom={i}
                  className="flex items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {booking.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 text-sm">{booking.service}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{booking.provider}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />{booking.date} · {booking.time}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-slate-900 text-sm">฿{booking.price}</div>
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
            { href: '/marketplace', icon: '🛍️', label: 'หาบริการใหม่', desc: 'เลือกบริการในชุมชน' },
            { href: '/communities', icon: '🏘️', label: 'ดูชุมชน', desc: 'เข้าร่วมชุมชนเพิ่ม' },
            { href: '/providers/apply', icon: '⭐', label: 'เป็นผู้ให้บริการ', desc: 'สร้างรายได้จากทักษะ' },
          ].map((action, i) => (
            <motion.div key={action.href} variants={fadeUp} custom={i} whileHover={{ y: -3 }}>
              <Link href={action.href}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                <span className="text-3xl">{action.icon}</span>
                <div>
                  <div className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{action.label}</div>
                  <div className="text-xs text-slate-500">{action.desc}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-slate-400">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}
