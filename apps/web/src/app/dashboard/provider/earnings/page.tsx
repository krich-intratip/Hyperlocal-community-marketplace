'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import {
  ChevronLeft, DollarSign, TrendingUp, Calendar, Download,
  CheckCircle, Clock, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

type Period = '7d' | '30d' | '90d'

const WEEKLY_DATA = [
  { label: 'จ', value: 640 }, { label: 'อ', value: 480 }, { label: 'พ', value: 800 },
  { label: 'พฤ', value: 560 }, { label: 'ศ', value: 960 }, { label: 'ส', value: 320 },
  { label: 'อา', value: 240 },
]

const MONTHLY_DATA = [
  { label: 'ม.ค.', value: 12400 }, { label: 'ก.พ.', value: 18200 }, { label: 'มี.ค.', value: 22800 },
]

const PAYOUTS = [
  { id: 'P001', date: '1 มี.ค. 2569', amount: 7840, status: 'paid', period: '16–28 ก.พ.' },
  { id: 'P002', date: '15 ก.พ. 2569', amount: 6320, status: 'paid', period: '1–15 ก.พ.' },
  { id: 'P003', date: '1 ก.พ. 2569', amount: 5480, status: 'paid', period: '16–31 ม.ค.' },
  { id: 'P004', date: '15 ม.ค. 2569', amount: 4920, status: 'paid', period: '1–15 ม.ค.' },
]

const RECENT_TRANSACTIONS = [
  { id: 'T001', service: 'อาหารกล่อง ×5', customer: 'คุณวิภา',   date: '8 มี.ค.', gross: 400, fee: 20, net: 380 },
  { id: 'T002', service: 'อาหารกล่อง ×3', customer: 'คุณสมศักดิ์', date: '8 มี.ค.', gross: 240, fee: 12, net: 228 },
  { id: 'T003', service: 'อาหารกล่อง ×8', customer: 'คุณนิตยา',   date: '7 มี.ค.', gross: 640, fee: 32, net: 608 },
  { id: 'T004', service: 'อาหารคลีน ×2',  customer: 'คุณประหยัด', date: '7 มี.ค.', gross: 240, fee: 12, net: 228 },
  { id: 'T005', service: 'อาหารกล่อง ×4', customer: 'คุณมาลี',    date: '6 มี.ค.', gross: 320, fee: 16, net: 304 },
]

export default function ProviderEarningsPage() {
  useAuthGuard(['provider', 'admin', 'superadmin'])
  const [period, setPeriod] = useState<Period>('30d')

  const chartData = period === '7d' ? WEEKLY_DATA : MONTHLY_DATA
  const maxVal = Math.max(...chartData.map(d => d.value))

  const totalGross = RECENT_TRANSACTIONS.reduce((s, t) => s + t.gross, 0)
  const totalFees  = RECENT_TRANSACTIONS.reduce((s, t) => s + t.fee, 0)
  const totalNet   = RECENT_TRANSACTIONS.reduce((s, t) => s + t.net, 0)
  const pendingPayout = 3580

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
          <span className="text-slate-700 font-medium">รายได้</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-500" /> รายได้ของฉัน
          </h1>
          <p className="text-sm text-slate-500 mt-1">สรุปรายรับและประวัติการโอนเงิน</p>
        </motion.div>

        {/* Summary cards */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'รายได้รวม/เดือน', value: `฿${totalGross.toLocaleString()}`, icon: TrendingUp, color: 'text-primary', bg: 'glass-sm', border: 'border-primary/30', change: '+12%' },
            { label: 'รายได้สุทธิ', value: `฿${totalNet.toLocaleString()}`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', change: '+12%' },
            { label: 'รอโอน', value: `฿${pendingPayout.toLocaleString()}`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', change: null },
            { label: 'ค่าธรรมเนียม (5%)', value: `฿${totalFees.toLocaleString()}`, icon: DollarSign, color: 'text-slate-500', bg: 'glass-sm', border: '', change: null },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i}
              className={`${s.bg} ${s.border} border rounded-2xl p-4`}>
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

        {/* Chart */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="glass-card rounded-2xl p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-slate-900">กราฟรายได้</h2>
            <div className="flex gap-1.5">
              {(['7d', '30d', '90d'] as Period[]).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    period === p ? 'bg-primary text-white' : 'glass-sm text-slate-600 hover:bg-slate-200'
                  }`}>{p === '7d' ? '7 วัน' : p === '30d' ? '30 วัน' : '3 เดือน'}</button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-slate-700">
                  {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}K` : d.value}
                </span>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(d.value / maxVal) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 min-h-[4px]" />
                <span className="text-xs text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent transactions */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="glass-card rounded-2xl overflow-hidden mb-5">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
            <h2 className="font-extrabold text-slate-900">รายการล่าสุด</h2>
            <button className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-blue-700">
              <Download className="h-3.5 w-3.5" /> ดาวน์โหลด CSV
            </button>
          </div>
          <div className="divide-y divide-white/10">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm">{tx.service}</p>
                  <p className="text-xs text-slate-500">{tx.customer} · {tx.date}</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div className="text-slate-500">ก่อนหัก ฿{tx.gross}</div>
                  <div className="text-red-400">ค่าธรรมเนียม -฿{tx.fee}</div>
                </div>
                <div className="font-extrabold text-green-600 flex-shrink-0">+฿{tx.net}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payout history */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
          className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/20">
            <h2 className="font-extrabold text-slate-900">ประวัติการโอนเงิน</h2>
            <p className="text-xs text-slate-500 mt-0.5">โอนทุกวันที่ 1 และ 15 ของเดือน</p>
          </div>
          <div className="divide-y divide-white/10">
            {PAYOUTS.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">รอบ {p.period}</p>
                  <p className="text-xs text-slate-500">โอน {p.date}</p>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900">฿{p.amount.toLocaleString()}</div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">โอนแล้ว</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </section>
      <AppFooter />
    </main>
  )
}
