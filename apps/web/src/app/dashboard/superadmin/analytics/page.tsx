'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  BarChart3, TrendingUp, DollarSign, ShoppingBag,
  Download, Crown, RefreshCw,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useAnalytics } from '@/hooks/useAnalytics'
import type { AnalyticsMonthlySeries } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatMonth(m: string) {
  const [y, mo] = m.split('-')
  const monthNames = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${monthNames[parseInt(mo)]} ${parseInt(y) + 543}`
}

function formatTHB(n: number) {
  return n.toLocaleString('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 })
}

function exportCSV(series: (AnalyticsMonthlySeries & { label: string })[]) {
  const header = 'เดือน,จำนวนออเดอร์,ยอดขายรวม (บาท),ค่าคอมมิชชัน (บาท)\n'
  const rows = series
    .map((r) => `${r.label},${r.orders},${r.sales},${r.commission}`)
    .join('\n')
  const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function AnalyticsDashboardPage() {
  useAuthGuard(['superadmin', 'admin'])

  const [months, setMonths] = useState(6)
  const [activeChart, setActiveChart] = useState<'sales' | 'orders'>('sales')

  const { data, isFetching, refetch } = useAnalytics(months)

  const series = (data?.monthlySeries ?? []).map((r) => ({
    ...r,
    label: formatMonth(r.month),
  }))

  const summary = data?.summary ?? { totalOrders: 0, totalSales: 0, totalCommission: 0 }
  const topProviders = data?.topProviders ?? []

  const handleExport = useCallback(() => {
    exportCSV(series)
  }, [series])

  const summaryCards = [
    {
      label: 'ออเดอร์ทั้งหมด',
      value: summary.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'text-primary',
      bg: 'glass-sm',
      border: 'border-primary/30',
    },
    {
      label: 'ยอดขายรวม',
      value: formatTHB(summary.totalSales),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    {
      label: 'ค่าคอมมิชชัน',
      value: formatTHB(summary.totalCommission),
      icon: DollarSign,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
  ]

  return (
    <main className="min-h-screen overflow-x-hidden glass-sm">
      <MarketBackground />
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-bold text-amber-600">Super Admin</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-7 w-7 text-primary" />
                Analytics Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                ยอดขาย ออเดอร์ และค่าคอมมิชชันรายเดือน
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Period selector */}
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                      months === m
                        ? 'bg-primary text-white'
                        : 'glass-sm text-slate-600'
                    }`}
                  >
                    {m} เดือน
                  </button>
                ))}
              </div>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg glass border-white/20 text-slate-700 hover:glass-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                {isFetching ? 'กำลังโหลด...' : 'Refresh'}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg glass border-white/20 text-slate-700 hover:glass-sm transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
            </div>
          </div>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {summaryCards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div key={card.label} variants={fadeUp} custom={i}
                className={`rounded-2xl border p-5 ${card.bg} ${card.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${card.color}`} />
                  <span className="text-xs font-medium text-slate-500">{card.label}</span>
                </div>
                <p className={`text-2xl font-extrabold ${card.color}`}>{card.value}</p>
                <p className="text-xs text-slate-400 mt-1">{months} เดือนที่ผ่านมา</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Chart toggle */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="mb-4 flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-700 flex-1">
            แนวโน้มรายเดือน
          </h2>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {(['sales', 'orders'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActiveChart(v)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeChart === v
                    ? 'bg-slate-700 text-white'
                    : 'glass-sm text-slate-600'
                }`}
              >
                {v === 'sales' ? 'ยอดขาย' : 'ออเดอร์'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Line chart */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="rounded-2xl border glass border-white/20 p-6 mb-8">
          <ResponsiveContainer width="100%" height={300}>
            {activeChart === 'sales' ? (
              <LineChart data={series} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatTHB(Number(v))} />
                <Legend />
                <Line type="monotone" dataKey="sales" name="ยอดขาย (บาท)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="commission" name="คอมมิชชัน (บาท)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <BarChart data={series} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" name="จำนวนออเดอร์" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Top providers table */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}>
          <h2 className="text-base font-bold text-slate-700 mb-4">
            Top 5 Providers (ตาม Revenue)
          </h2>
          <div className="rounded-2xl border glass border-white/20 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="glass-sm border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 w-8">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">ชื่อ Provider</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">ออเดอร์</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Revenue (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {topProviders.map((p, i) => (
                  <tr key={p.providerId}
                    className="border-b border-white/20 hover:glass-sm/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{p.providerName}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{p.orders.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      {formatTHB(p.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Status note */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
          className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>
            ข้อมูลจาก <code className="font-mono glass-sm px-1 rounded">GET /dashboard/analytics</code>
            {' '}— cache อัพเดตทุก 5 นาที
          </span>
        </motion.div>

      </section>

      <AppFooter />
    </main>
  )
}
