'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { TrendingUp, Star, CalendarCheck, DollarSign, Plus, ChevronRight, Clock, CheckCircle, Eye } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07 },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const MOCK_ORDERS = [
  { id: 'O001', customer: 'คุณวิภา', service: 'อาหารกล่อง ×3', date: '8 มี.ค. 2569', time: '11:00', status: 'confirmed', amount: 240 },
  { id: 'O002', customer: 'คุณสมศักดิ์', service: 'อาหารกล่อง ×2', date: '8 มี.ค. 2569', time: '12:00', status: 'pending', amount: 160 },
  { id: 'O003', customer: 'คุณนิตยา', service: 'อาหารกล่อง ×5', date: '7 มี.ค. 2569', time: '11:30', status: 'completed', amount: 400 },
  { id: 'O004', customer: 'คุณประหยัด', service: 'อาหารกล่อง ×1', date: '6 มี.ค. 2569', time: '12:00', status: 'completed', amount: 80 },
]

const MOCK_LISTINGS = [
  { id: '1', title: 'ทำอาหารกล่องส่งถึงที่', price: 80, unit: 'กล่อง', views: 234, bookings: 128, rating: 4.9, active: true },
  { id: '2', title: 'อาหารคลีนออเดอร์ล่วงหน้า', price: 120, unit: 'กล่อง', views: 89, bookings: 34, rating: 4.8, active: true },
]

const STATUS_CONFIG = {
  confirmed: { label: 'ยืนยันแล้ว', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  pending: { label: 'รอยืนยัน', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  completed: { label: 'เสร็จแล้ว', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
}

export default function ProviderDashboardPage() {
  const thisMonthRevenue = MOCK_ORDERS.filter(o => o.status !== 'pending').reduce((s, o) => s + o.amount, 0)
  const completedOrders = MOCK_ORDERS.filter(o => o.status === 'completed').length

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
            <Link href="/providers/listings/new"
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
                const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
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
              <Link href="/providers/listings/new" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> เพิ่ม
              </Link>
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
      </section>

      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-slate-400">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}
