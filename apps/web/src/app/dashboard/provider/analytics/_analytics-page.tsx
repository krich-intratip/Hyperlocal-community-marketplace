'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  ChevronLeft, TrendingUp, DollarSign, CalendarCheck, Star,
  Download, BarChart3, Activity,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import {
  REVENUE_TREND,
  BOOKINGS_BY_DAY,
  RATING_TREND,
  BOOKING_STATUS_PIE,
  PROVIDER_SUMMARY,
} from '@/lib/mock-provider-analytics'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

type Period = '7d' | '30d' | '1y'

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

export default function ProviderAnalyticsClient() {
  useAuthGuard(['provider', 'admin', 'superadmin'])
  const [period, setPeriod] = useState<Period>('1y')

  const chartData = period === '7d' ? REVENUE_TREND.slice(-3)
    : period === '30d' ? REVENUE_TREND.slice(-6)
    : REVENUE_TREND

  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0)
  const totalBookings = chartData.reduce((s, d) => s + d.bookings, 0)

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard/provider" className="hover:text-primary flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" /> Provider Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Analytics</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> วิเคราะห์ธุรกิจ
          </h1>
          <p className="text-sm text-slate-500 mt-1">ภาพรวมรายได้ การจอง และแนวโน้มธุรกิจของคุณ</p>
        </motion.div>

        {/* Period Selector */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="flex items-center gap-2 mb-6">
          <span className="text-xs text-slate-500 font-medium">ช่วงเวลา:</span>
          {(['7d', '30d', '1y'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === p
                  ? 'bg-primary text-white shadow-sm'
                  : 'glass-sm text-slate-600 hover:border-primary/30'
              }`}>
              {p === '7d' ? '7 วัน' : p === '30d' ? '30 วัน' : '12 เดือน'}
            </button>
          ))}
          <button className="ml-auto flex items-center gap-1.5 text-xs font-bold text-primary hover:text-blue-700 px-3 py-1.5 rounded-lg border border-primary/30 glass-sm hover:bg-blue-100 transition-all">
            <Download className="h-3.5 w-3.5" /> ดาวน์โหลด CSV
          </button>
        </motion.div>

        {/* KPI Summary Cards */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'รายได้รวม', value: `฿${fmt(totalRevenue)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', change: `+${PROVIDER_SUMMARY.revenueGrowth}%` },
            { label: 'ออเดอร์รวม', value: totalBookings, icon: CalendarCheck, color: 'text-primary', bg: 'glass-sm', change: `+${PROVIDER_SUMMARY.bookingsGrowth}%` },
            { label: 'คะแนนเฉลี่ย', value: `${PROVIDER_SUMMARY.avgRating} ⭐`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', change: '+0.05' },
            { label: 'ลูกค้าซ้ำ', value: `${PROVIDER_SUMMARY.repeatCustomerRate}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', change: '+8%' },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} custom={i} whileHover={{ y: -3 }}
              className="p-5 rounded-2xl glass-card">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                {stat.label}
                <span className="text-green-600 font-bold">{stat.change}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue Area Chart */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-slate-900">แนวโน้มรายได้</h2>
              <p className="text-xs text-slate-500 mt-0.5">รายได้รวมและจำนวนการจองรายเดือน</p>
            </div>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => `฿${fmt(v)}`} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={60} />
              <Tooltip
                formatter={(value) => [`฿${Number(value).toLocaleString()}`, 'รายได้']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5}
                fill="url(#revGrad)" dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bottom 2-column Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Bookings by Day of Week — BarChart */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="glass-card rounded-2xl p-6">
            <h2 className="font-extrabold text-slate-900 mb-1">การจองตามวัน</h2>
            <p className="text-xs text-slate-500 mb-4">จำนวนออเดอร์เฉลี่ยแต่ละวันในสัปดาห์</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={BOOKINGS_BY_DAY} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value) => [Number(value), 'ออเดอร์']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="bookings" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Rating Trend — LineChart */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="glass-card rounded-2xl p-6">
            <h2 className="font-extrabold text-slate-900 mb-1">แนวโน้มคะแนนรีวิว</h2>
            <p className="text-xs text-slate-500 mb-4">คะแนนเฉลี่ยและจำนวนรีวิว 6 เดือนล่าสุด</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={RATING_TREND} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis domain={[4.4, 5.0]} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'rating' ? `${Number(value).toFixed(2)} ⭐` : `${Number(value)} รีวิว`,
                    name === 'rating' ? 'คะแนน' : 'รีวิว',
                  ]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Line type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Booking Status Pie + Summary */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-slate-900">สถานะการจอง</h2>
              <p className="text-xs text-slate-500 mt-0.5">สัดส่วนออเดอร์ตามสถานะ</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width={200} height={180}>
              <PieChart>
                <Pie data={BOOKING_STATUS_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  paddingAngle={3} dataKey="value">
                  {BOOKING_STATUS_PIE.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${Number(value)}%`, '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 flex-1">
              {BOOKING_STATUS_PIE.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full glass-sm w-24">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-8 text-right">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Nav */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {[
            { label: 'Insights เชิงลึก', desc: 'คำแนะนำ AI สำหรับธุรกิจคุณ', href: '/dashboard/provider/insights', color: 'bg-purple-600', emoji: '🤖' },
            { label: 'จัดการรีวิว', desc: 'ตอบรีวิวและวิเคราะห์ Sentiment', href: '/dashboard/provider/reviews', color: 'bg-amber-500', emoji: '⭐' },
          ].map((item, i) => (
            <motion.div key={item.label} variants={fadeUp} custom={i} whileHover={{ y: -2 }}>
              <Link href={item.href}
                className="flex items-center gap-4 p-5 rounded-2xl glass-card hover:border-slate-200 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {item.emoji}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </section>
      <AppFooter />
    </main>
  )
}
