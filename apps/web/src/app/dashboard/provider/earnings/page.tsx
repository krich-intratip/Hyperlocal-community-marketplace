'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import {
  ChevronLeft, DollarSign, TrendingUp, CheckCircle, Clock,
  ArrowUpRight, Download, RefreshCw, Loader2, AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useProviderEarnings, type EarningsPeriod } from '@/hooks/useEarnings'
import { formatDateTimeTH, formatDateMedTH } from '@/lib/date-utils'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { MonthlyEarning } from '@/lib/api'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  COMPLETED:            { label: 'สำเร็จ',        cls: 'bg-green-100 text-green-700' },
  CONFIRMED:            { label: 'ยืนยันแล้ว',    cls: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS:          { label: 'กำลังทำ',       cls: 'bg-indigo-100 text-indigo-700' },
  PENDING_CONFIRMATION: { label: 'รอยืนยัน',      cls: 'bg-amber-100 text-amber-700' },
  PAYMENT_HELD:         { label: 'ชำระแล้ว',      cls: 'bg-violet-100 text-violet-700' },
  PENDING_PAYMENT:      { label: 'รอชำระ',         cls: 'bg-slate-100 text-slate-600' },
  CANCELLED_BY_CUSTOMER:{ label: 'ยกเลิก',        cls: 'bg-red-100 text-red-600' },
  CANCELLED_BY_PROVIDER:{ label: 'ยกเลิก',        cls: 'bg-red-100 text-red-600' },
}

// ── Month label: "2026-03" → "มี.ค. 2569" ────────────────────────────────────

function monthLabel(m: string): string {
  const [y, mo] = m.split('-').map(Number)
  return formatDateMedTH(new Date(y, (mo ?? 1) - 1, 1)).replace(/^\d+ /, '')   // strip day
}

// ── CSV export ────────────────────────────────────────────────────────────────

function downloadCsv(
  transactions: { id: string; service: string; date: string; gross: number; fee: number; net: number; status: string }[],
) {
  const header = 'ออเดอร์,บริการ,วันที่,ยอดก่อนหัก,ค่าธรรมเนียม,รายได้สุทธิ,สถานะ'
  const rows = transactions.map(t =>
    [
      t.id.slice(-8).toUpperCase(),
      `"${t.service}"`,
      formatDateTimeTH(t.date),
      t.gross,
      t.fee,
      t.net,
      STATUS_LABEL[t.status]?.label ?? t.status,
    ].join(','),
  )
  const blob = new Blob(['\uFEFF' + [header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `earnings-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Recharts custom tooltip ───────────────────────────────────────────────────

function EarningsTooltip({ active, payload, label }: {
  active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-xl px-4 py-3 text-sm shadow-lg border border-white/30">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: ฿{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ProviderEarningsPage() {
  useAuthGuard(['provider', 'admin', 'superadmin'])
  const [period, setPeriod] = useState<EarningsPeriod>('30d')
  const [chart, setChart]   = useState<'area' | 'bar'>('area')

  const { data, isLoading, isError, refetch, isFetching } = useProviderEarnings(period)

  // Augment monthly data with label
  const chartData: (MonthlyEarning & { label: string })[] = (data?.monthlyBreakdown ?? []).map(m => ({
    ...m,
    label: monthLabel(m.month),
  }))

  const summaryCards = [
    {
      label: 'รายได้รวม',
      value: `฿${(data?.totalGross ?? 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'glass-sm border-primary/30',
      change: '+12%',
    },
    {
      label: 'รายได้สุทธิ',
      value: `฿${(data?.totalNet ?? 0).toLocaleString()}`,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50/80 border-green-100',
      change: '+12%',
    },
    {
      label: 'รอโอนเข้า',
      value: `฿${(data?.pendingPayout ?? 0).toLocaleString()}`,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50/80 border-amber-100',
      change: null,
    },
    {
      label: 'ค่าธรรมเนียม (5%)',
      value: `฿${(data?.totalFees ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-slate-500',
      bg: 'glass-sm',
      change: null,
    },
  ]

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard/provider" className="hover:text-primary flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" /> Provider Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">รายได้ของฉัน</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-500" /> รายได้ของฉัน
            </h1>
            <p className="text-sm text-slate-500 mt-1">สรุปรายรับ ค่าธรรมเนียม และประวัติการโอนเงิน</p>
          </div>
          <button onClick={() => refetch()} disabled={isFetching}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-sm text-xs font-bold text-slate-600 hover:text-primary disabled:opacity-50 transition-all">
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            รีเฟรช
          </button>
        </motion.div>

        {/* Period tabs */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="flex gap-2 mb-6">
          {(['7d', '30d', '90d', 'all'] as EarningsPeriod[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
                period === p
                  ? 'bg-primary text-white shadow-sm'
                  : 'glass-sm text-slate-600 hover:text-primary'
              }`}>
              {p === '7d' ? '7 วัน' : p === '30d' ? '30 วัน' : p === '90d' ? '90 วัน' : 'ทั้งหมด'}
            </button>
          ))}
        </motion.div>

        {/* Loading / error */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {isError && (
          <div className="glass-card rounded-2xl p-6 flex items-center gap-3 text-red-600 mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-semibold">ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่</p>
          </div>
        )}

        {data && (
          <>
            {/* Summary cards */}
            <motion.div variants={stagger} initial="hidden" animate="show"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {summaryCards.map((s, i) => (
                <motion.div key={s.label} variants={fadeUp} custom={i}
                  className={`${s.bg} border rounded-2xl p-4`}>
                  <s.icon className={`h-4 w-4 ${s.color} mb-2`} />
                  <div className="font-extrabold text-lg text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    {s.label}
                    {s.change && (
                      <span className="flex items-center gap-0.5 text-green-600 font-bold">
                        <ArrowUpRight className="h-3 w-3" />{s.change}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Completed order count */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="glass-sm rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              ออเดอร์สำเร็จในช่วงนี้:
              <span className="font-extrabold text-green-600">{data.completedOrders} ออเดอร์</span>
            </motion.div>

            {/* Chart */}
            {chartData.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
                className="glass-card rounded-2xl p-6 mb-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-extrabold text-slate-900">กราฟรายได้รายเดือน</h2>
                  <div className="flex gap-1.5">
                    {(['area', 'bar'] as const).map(t => (
                      <button key={t} onClick={() => setChart(t)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          chart === t ? 'bg-primary text-white' : 'glass-sm text-slate-600'
                        }`}>
                        {t === 'area' ? 'เส้น' : 'แท่ง'}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  {chart === 'area' ? (
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }}
                        tickFormatter={v => `฿${(v / 1000).toFixed(0)}K`} />
                      <Tooltip content={<EarningsTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="gross" name="ยอดขายรวม"
                        stroke="#6366f1" fill="url(#grossGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="net" name="รายได้สุทธิ"
                        stroke="#22c55e" fill="url(#netGrad)" strokeWidth={2} />
                    </AreaChart>
                  ) : (
                    <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }}
                        tickFormatter={v => `฿${(v / 1000).toFixed(0)}K`} />
                      <Tooltip content={<EarningsTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="gross" name="ยอดขายรวม"  fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="net"   name="รายได้สุทธิ" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Transaction list */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="glass-card rounded-2xl overflow-hidden mb-5">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
                <div>
                  <h2 className="font-extrabold text-slate-900">รายการทั้งหมด</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{data.transactions.length} รายการ</p>
                </div>
                <button
                  onClick={() => downloadCsv(data.transactions)}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-blue-700 transition-colors">
                  <Download className="h-3.5 w-3.5" /> ดาวน์โหลด CSV
                </button>
              </div>

              {data.transactions.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">ยังไม่มีรายการในช่วงนี้</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {data.transactions.map((tx) => {
                    const s = STATUS_LABEL[tx.status] ?? { label: tx.status, cls: 'bg-slate-100 text-slate-600' }
                    return (
                      <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/20 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate">{tx.service}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            #{tx.id.slice(-8).toUpperCase()} · {formatDateTimeTH(tx.date)}
                          </p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.cls}`}>
                          {s.label}
                        </span>
                        <div className="text-right text-xs text-slate-400 flex-shrink-0">
                          <div className="text-slate-500">฿{tx.gross.toLocaleString()}</div>
                          <div className="text-red-400">-฿{tx.fee.toLocaleString()}</div>
                        </div>
                        <div className={`font-extrabold flex-shrink-0 ${
                          tx.status === 'COMPLETED' ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          +฿{tx.net.toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>

            {/* Payout info banner */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
              className="glass-sm rounded-2xl px-5 py-4 flex items-start gap-3 border border-green-200/50">
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">รอบการโอนเงิน</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Platform โอนรายได้สุทธิ (หัก 5%) ทุกวันที่ <strong>1</strong> และ <strong>15</strong> ของเดือน
                  ผ่านบัญชีที่ลงทะเบียนไว้ในโปรไฟล์ Provider
                </p>
                {data.pendingPayout > 0 && (
                  <p className="text-xs font-bold text-amber-600 mt-1.5">
                    ยอดรอโอนปัจจุบัน: ฿{data.pendingPayout.toLocaleString()}
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </section>
      <AppFooter />
    </main>
  )
}
