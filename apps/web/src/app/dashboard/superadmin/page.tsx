'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import Link from 'next/link'
import {
  Crown, Building2, Users, TrendingUp, DollarSign, ShieldCheck,
  Clock, CheckCircle, Pause, ArrowRightLeft, BarChart3,
  Megaphone, Settings, ChevronRight, AlertTriangle, Globe,
} from 'lucide-react'
import { useT } from '@/hooks/useT'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

// ── Mock Data ──────────────────────────────────────────────────────────────────

const PLATFORM_STATS = {
  totalCommunities: 12,
  activeCommunities: 9,
  pendingApplications: 3,
  suspendedCommunities: 1,
  totalProviders: 340,
  totalMembers: 2840,
  totalBookingsMonth: 8421,
  totalRevenueMonth: 842100,
  totalRevenueSharePaid: 84210,
  avgTrustScore: 94,
}

const RECENT_APPLICATIONS = [
  { id: 'C004', name: 'หมู่บ้านกรีนวิลล์เชียงใหม่', province: 'เชียงใหม่', manager: 'คุณนิตยา สุขสันต์', appliedDate: '5 มี.ค. 2569', type: 'หมู่บ้านจัดสรร' },
  { id: 'C005', name: 'คอนโด Ideo Sukhumvit', province: 'กรุงเทพฯ', manager: 'คุณเอกชัย รวยมาก', appliedDate: '7 มี.ค. 2569', type: 'คอนโดมิเนียม' },
  { id: 'C007', name: 'ชุมชนบ้านใหม่ขอนแก่น', province: 'ขอนแก่น', manager: 'คุณสมชาย ดีมาก', appliedDate: '9 มี.ค. 2569', type: 'ชุมชนเมือง' },
]

const TOP_COMMUNITIES = [
  { id: 'C001', name: 'หมู่บ้านศรีนคร', province: 'กรุงเทพฯ', providers: 34, bookings: 1204, revenue: 85400, trustScore: 98 },
  { id: 'C002', name: 'คอนโด The Base Rama9', province: 'กรุงเทพฯ', providers: 21, bookings: 876, revenue: 62000, trustScore: 95 },
  { id: 'C003', name: 'ชุมชนเมืองทอง', province: 'นนทบุรี', providers: 18, bookings: 654, revenue: 44000, trustScore: 91 },
]

const ALERTS = [
  { id: 1, type: 'warning', message: 'ชุมชนริมแม่น้ำปิง — Trust Score ต่ำกว่า 40 ต้องพิจารณา Takeover', link: '/dashboard/superadmin/franchise' },
  { id: 2, type: 'info', message: '3 ใบสมัคร Franchise ใหม่รอการอนุมัติ', link: '/dashboard/superadmin/franchise' },
]

const QUICK_LINKS = [
  { href: '/dashboard/superadmin/franchise', icon: Building2, label: 'จัดการ Franchise', desc: 'อนุมัติ / ระงับ / Takeover', color: 'text-blue-600', bg: 'bg-blue-50' },
  { href: '/dashboard/superadmin/franchise', icon: Megaphone, label: 'ประกาศ Global', desc: 'สร้างและจัดการประกาศ', color: 'text-amber-600', bg: 'bg-amber-50' },
  { href: '/marketplace', icon: Globe, label: 'Marketplace', desc: 'ดูตลาดในฐานะผู้ใช้', color: 'text-purple-600', bg: 'bg-purple-50' },
  { href: '/communities', icon: Users, label: 'ชุมชนทั้งหมด', desc: 'ดูภาพรวมชุมชน', color: 'text-green-600', bg: 'bg-green-50' },
]

// ── Component ──────────────────────────────────────────────────────────────────

export default function SuperAdminDashboardPage() {
  useAuthGuard(['superadmin'])
  const t = useT()

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <MarketBackground />
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-bold text-amber-600">{t.superadmin.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Platform Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            ภาพรวมระบบ Community Hyper Marketplace ทั้งหมด
          </p>
        </motion.div>

        {/* Alerts */}
        {ALERTS.length > 0 && (
          <motion.div variants={stagger} initial="hidden" animate="show" className="mb-6 space-y-2">
            {ALERTS.map((alert, i) => (
              <motion.div key={alert.id} variants={fadeUp} custom={i}>
                <Link href={alert.link as any}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-opacity hover:opacity-80 ${
                    alert.type === 'warning'
                      ? 'bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300'
                      : 'bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                  }`}>
                  {alert.type === 'warning'
                    ? <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    : <Clock className="h-4 w-4 flex-shrink-0" />}
                  <span className="flex-1">{alert.message}</span>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Platform Stats */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-2">
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">{t.superadmin.platform_stats}</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'ชุมชนทั้งหมด', value: PLATFORM_STATS.totalCommunities, icon: Building2, color: 'text-slate-600', bg: 'bg-white dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' },
            { label: 'เปิดใช้งาน', value: PLATFORM_STATS.activeCommunities, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-700' },
            { label: 'รอ Approve', value: PLATFORM_STATS.pendingApplications, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-700' },
            { label: 'Provider รวม', value: `${PLATFORM_STATS.totalProviders}+`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-700' },
            { label: 'Booking/เดือน', value: PLATFORM_STATS.totalBookingsMonth.toLocaleString(), icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-700' },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i}
              className={`${s.bg} rounded-2xl p-4 border ${s.border}`}>
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue Stats */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div variants={fadeUp} custom={0}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
            <TrendingUp className="h-6 w-6 mb-3 opacity-80" />
            <div className="text-2xl font-extrabold">฿{(PLATFORM_STATS.totalRevenueMonth / 1000).toFixed(0)}K</div>
            <div className="text-blue-100 text-sm mt-0.5">รายได้รวม/เดือน (GMV)</div>
          </motion.div>
          <motion.div variants={fadeUp} custom={1}
            className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-5 text-white">
            <DollarSign className="h-6 w-6 mb-3 opacity-80" />
            <div className="text-2xl font-extrabold">฿{(PLATFORM_STATS.totalRevenueSharePaid / 1000).toFixed(0)}K</div>
            <div className="text-green-100 text-sm mt-0.5">Revenue Share จ่ายแล้ว/เดือน</div>
          </motion.div>
          <motion.div variants={fadeUp} custom={2}
            className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-5 text-white">
            <ShieldCheck className="h-6 w-6 mb-3 opacity-80" />
            <div className="text-2xl font-extrabold">{PLATFORM_STATS.avgTrustScore}%</div>
            <div className="text-purple-100 text-sm mt-0.5">Trust Score เฉลี่ยทั้งระบบ</div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Pending Applications */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t.superadmin.pending_franchise}</h3>
                <span className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{RECENT_APPLICATIONS.length}</span>
              </div>
              <Link href="/dashboard/superadmin/franchise"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                ดูทั้งหมด <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {RECENT_APPLICATIONS.map((app) => (
                <div key={app.id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{app.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {app.province} · {app.type} · {app.manager}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">ยื่น {app.appliedDate}</p>
                  </div>
                  <Link href="/dashboard/superadmin/franchise"
                    className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                    {t.superadmin.review}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Communities */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Top Communities</h3>
              </div>
              <Link href="/dashboard/superadmin/franchise"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                {t.superadmin.communities_title} <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {TOP_COMMUNITIES.map((c, idx) => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-extrabold text-slate-500">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{c.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.province} · {c.providers} provider</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">฿{(c.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-slate-400">{c.bookings.toLocaleString()} booking</div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    c.trustScore >= 95 ? 'bg-green-100 text-green-700' :
                    c.trustScore >= 80 ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{c.trustScore}%</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="mb-4">
          <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">เมนูหลัก</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {QUICK_LINKS.map((link, i) => (
            <motion.div key={link.href + link.label} variants={fadeUp} custom={i} whileHover={{ y: -4 }}>
              <Link href={link.href as any}
                className="flex flex-col gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-600 transition-all group shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${link.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{link.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{link.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors self-end mt-auto" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </section>
    </main>
  )
}
