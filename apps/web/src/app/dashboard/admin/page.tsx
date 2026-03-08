'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { Users, DollarSign, TrendingUp, Shield, CheckCircle, XCircle, Clock, ChevronRight, BarChart3, Settings } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07 },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const PENDING_PROVIDERS = [
  { id: 'P001', name: 'ช่างวิชัย', category: 'งานช่าง 🔧', applied: '7 มี.ค. 2569', experience: '5 ปี' },
  { id: 'P002', name: 'ครูสมหญิง', category: 'สอนพิเศษ 📚', applied: '8 มี.ค. 2569', experience: '3 ปี' },
  { id: 'P003', name: 'คุณสมพงษ์', category: 'งานบ้าน 🏠', applied: '8 มี.ค. 2569', experience: '2 ปี' },
]

const COMMUNITY_STATS = {
  name: 'หมู่บ้านศรีนคร',
  members: 248,
  providers: 34,
  pendingProviders: 3,
  totalBookings: 1204,
  monthBookings: 87,
  revenue: 8500,
  revenueShare: 850,
  trial: true,
  trialEnd: '30 เม.ย. 2569',
}

export default function CommunityAdminDashboardPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm text-slate-500 mb-1">Community Admin Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">🏘️ {COMMUNITY_STATS.name}</h1>
            {COMMUNITY_STATS.trial && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full mt-2 font-semibold">
                ช่วงทดลองฟรีถึง {COMMUNITY_STATS.trialEnd}
              </span>
            )}
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/dashboard/admin/settings"
              className="flex items-center gap-2 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 transition-colors">
              <Settings className="h-4 w-4" /> ตั้งค่า
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats grid */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'สมาชิกทั้งหมด', value: COMMUNITY_STATS.members, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'ผู้ให้บริการ', value: COMMUNITY_STATS.providers, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'บุ๊กกิ้งเดือนนี้', value: COMMUNITY_STATS.monthBookings, icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Revenue Share', value: `฿${COMMUNITY_STATS.revenueShare.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
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
          {/* Pending provider approvals */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">รออนุมัติผู้ให้บริการ</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                {COMMUNITY_STATS.pendingProviders} รายการ
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {PENDING_PROVIDERS.map((provider, i) => (
                <motion.div key={provider.id} variants={fadeUp} custom={i}
                  className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 flex-shrink-0 text-sm">
                    {provider.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 text-sm">{provider.name}</div>
                    <div className="text-xs text-slate-500">{provider.category} · ประสบการณ์ {provider.experience}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> สมัคร {provider.applied}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                      className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors" title="อนุมัติ">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                      className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors" title="ปฏิเสธ">
                      <XCircle className="h-4 w-4 text-red-500" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Revenue breakdown */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">รายได้และ Revenue Share</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'ยอดบุ๊กกิ้งรวม (เดือนนี้)', value: `฿${COMMUNITY_STATS.revenue.toLocaleString()}`, color: 'text-slate-900' },
                { label: 'Commission แพลตฟอร์ม (10%)', value: `-฿${(COMMUNITY_STATS.revenue * 0.1).toLocaleString()}`, color: 'text-red-500' },
                { label: 'Revenue Share ของคุณ (10%)', value: `+฿${COMMUNITY_STATS.revenueShare.toLocaleString()}`, color: 'text-green-600' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-600">{row.label}</span>
                  <span className={`font-bold text-sm ${row.color}`}>{row.value}</span>
                </div>
              ))}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 border border-green-100">
                  <TrendingUp className="h-4 w-4" />
                  <span>รายได้เพิ่มขึ้น <strong>+23%</strong> จากเดือนที่แล้ว</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trial period management */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
            className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">จัดการช่วงทดลองใช้</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">สถานะช่วงทดลอง</span>
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">กำลังดำเนินอยู่</span>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">วันสิ้นสุดช่วงทดลอง</label>
                <input type="date" defaultValue="2026-04-30"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white" />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                บันทึกการเปลี่ยนแปลง
              </motion.button>
            </div>
          </motion.div>

          {/* Community overview */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7}
            className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">ภาพรวมชุมชน</h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'บุ๊กกิ้งทั้งหมด', value: COMMUNITY_STATS.totalBookings.toLocaleString() },
                { label: 'อัตราความสำเร็จ', value: '94%' },
                { label: 'คะแนนเฉลี่ยชุมชน', value: '4.8 ⭐' },
                { label: 'ผู้ให้บริการที่ Verified', value: `${COMMUNITY_STATS.providers - COMMUNITY_STATS.pendingProviders}/${COMMUNITY_STATS.providers}` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-600">{row.label}</span>
                  <span className="font-bold text-sm text-slate-800">{row.value}</span>
                </div>
              ))}
              <Link href="/communities/1"
                className="flex items-center justify-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700 pt-2">
                ดูหน้าชุมชน <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-slate-400">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}
