'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import {
  TrendingUp, DollarSign, ShoppingCart, CheckCircle, XCircle,
  CreditCard, QrCode, Truck, ChevronLeft, RefreshCw, Building2,
} from 'lucide-react'
import Link from 'next/link'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useAdminRevenue, useAdminStats } from '@/hooks/useAdmin'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.05 } }),
}

const METHOD_ICONS: Record<string, React.ReactNode> = {
  promptpay: <QrCode className="h-4 w-4" />,
  card: <CreditCard className="h-4 w-4" />,
  cod: <Truck className="h-4 w-4" />,
}
const METHOD_LABELS: Record<string, string> = {
  promptpay: 'PromptPay',
  card: 'บัตรเครดิต',
  cod: 'เก็บเงินปลายทาง',
}
const STATUS_COLORS: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-indigo-100 text-indigo-700',
  CANCELLED_BY_CUSTOMER: 'bg-red-100 text-red-600',
  CANCELLED_BY_PROVIDER: 'bg-rose-100 text-rose-600',
}
const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'สำเร็จ',
  IN_PROGRESS: 'กำลังดำเนินการ',
  CONFIRMED: 'ยืนยันแล้ว',
  CANCELLED_BY_CUSTOMER: 'ยกเลิกโดยลูกค้า',
  CANCELLED_BY_PROVIDER: 'ยกเลิกโดย Provider',
}

export default function AdminRevenuePage() {
  useAuthGuard(['superadmin'])

  const { data: rev, isLoading: revLoading, refetch } = useAdminRevenue()
  const { data: stats, isLoading: statsLoading } = useAdminStats()

  const isLoading = revLoading || statsLoading

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard/superadmin" className="hover:text-primary flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" /> Super Admin
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">รายได้แพลตฟอร์ม</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" /> รายได้แพลตฟอร์ม
            </h1>
            <p className="text-sm text-slate-500 mt-1">ภาพรวม GMV, ค่าธรรมเนียม และสถิติออเดอร์ทั้งหมด</p>
          </div>
          <button onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/20 text-sm font-bold text-slate-600 hover:text-primary transition-colors">
            <RefreshCw className="h-4 w-4" /> รีเฟรช
          </button>
        </div>

        {isLoading ? (
          <div className="p-20 text-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 opacity-40" />
            กำลังโหลด...
          </div>
        ) : (
          <>
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: 'GMV รวม', value: `฿${((rev?.gmv ?? 0) / 1000).toFixed(0)}K`,
                  sub: `เดือนนี้ ฿${((rev?.thisMonth.gmv ?? 0) / 1000).toFixed(0)}K`,
                  icon: TrendingUp, gradient: 'from-blue-600 to-blue-700', i: 0,
                },
                {
                  label: 'ค่าธรรมเนียมแพลตฟอร์ม', value: `฿${((rev?.platformFees ?? 0) / 1000).toFixed(0)}K`,
                  sub: `เดือนนี้ ฿${((rev?.thisMonth.fees ?? 0) / 1000).toFixed(0)}K`,
                  icon: DollarSign, gradient: 'from-green-600 to-emerald-600', i: 1,
                },
                {
                  label: 'ออเดอร์ทั้งหมด', value: (rev?.totalOrders ?? 0).toLocaleString(),
                  sub: `เดือนนี้ ${rev?.thisMonth.orders ?? 0} ออเดอร์`,
                  icon: ShoppingCart, gradient: 'from-violet-600 to-indigo-600', i: 2,
                },
                {
                  label: 'ออเดอร์สำเร็จ', value: (rev?.completedOrders ?? 0).toLocaleString(),
                  sub: `ยกเลิก ${rev?.cancelledOrders ?? 0} ออเดอร์`,
                  icon: CheckCircle, gradient: 'from-rose-500 to-pink-600', i: 3,
                },
              ].map((card) => (
                <motion.div key={card.label} variants={fadeUp} initial="hidden" animate="show" custom={card.i}
                  className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white`}>
                  <card.icon className="h-5 w-5 mb-3 opacity-80" />
                  <div className="text-2xl font-extrabold">{card.value}</div>
                  <div className="text-white/70 text-xs mt-1">{card.label}</div>
                  <div className="text-white/50 text-xs mt-0.5">{card.sub}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

              {/* Order Status Breakdown */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
                className="glass-card rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-slate-800 text-sm">สถานะออเดอร์</h3>
                </div>
                <div className="p-5 space-y-3">
                  {Object.entries(rev?.statusBreakdown ?? {}).map(([status, count]) => {
                    const total = rev?.totalOrders ?? 1
                    const pct = Math.round((count / total) * 100)
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-600'}`}>
                            {STATUS_LABELS[status] ?? status}
                          </span>
                          <span className="text-sm font-bold text-slate-800">{count.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Payment Method Breakdown */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
                className="glass-card rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-slate-800 text-sm">วิธีชำระเงิน</h3>
                </div>
                <div className="p-5 space-y-4">
                  {Object.entries(rev?.methodBreakdown ?? {}).map(([method, count]) => {
                    const total = Object.values(rev?.methodBreakdown ?? {}).reduce((a, b) => a + b, 0) || 1
                    const pct = Math.round((count / total) * 100)
                    return (
                      <div key={method}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            {METHOD_ICONS[method] ?? <CreditCard className="h-4 w-4" />}
                            {METHOD_LABELS[method] ?? method}
                          </div>
                          <span className="text-sm font-bold text-slate-800">{count.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Top Communities by GMV */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
              className="glass-card rounded-2xl overflow-hidden mb-6">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-slate-800 text-sm">Top Communities by GMV</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {(rev?.topCommunities ?? []).map((c, i) => {
                  const maxGmv = rev?.topCommunities?.[0]?.gmv ?? 1
                  const pct = Math.round((c.gmv / maxGmv) * 100)
                  return (
                    <div key={c.communityId} className="px-5 py-3.5 flex items-center gap-4">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-extrabold text-primary flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <Link href={`/communities/${c.communityId}` as any}
                            className="text-sm font-bold text-slate-800 hover:text-primary transition-colors">
                            ชุมชน #{c.communityId}
                          </Link>
                          <span className="text-sm font-extrabold text-slate-900">
                            ฿{(c.gmv / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Platform Stats Summary */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7}
              className="glass-card rounded-2xl p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> สรุปสถิติแพลตฟอร์ม
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: 'ผู้ใช้ทั้งหมด', value: (stats?.totalUsers ?? 0).toLocaleString() },
                  { label: 'ผู้ใช้ active', value: (stats?.activeUsers ?? 0).toLocaleString() },
                  { label: 'Provider ทั้งหมด', value: (stats?.totalProviders ?? 0).toLocaleString() },
                  { label: 'Provider รอ Approve', value: (stats?.pendingProviders ?? 0).toLocaleString() },
                  { label: 'ออเดอร์รวม', value: (stats?.totalOrders ?? 0).toLocaleString() },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-extrabold text-slate-900">{s.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </section>

      <AppFooter />
    </main>
  )
}
