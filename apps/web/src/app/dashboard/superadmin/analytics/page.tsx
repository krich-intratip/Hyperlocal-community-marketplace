'use client'
import { useState } from 'react'
import { usePlatformAnalytics } from '@/hooks/usePlatformAnalytics'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Package, RefreshCw, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

const STATUS_LABEL: Record<string, string> = {
  COMPLETED: 'สำเร็จ',
  CONFIRMED: 'ยืนยันแล้ว',
  IN_PROGRESS: 'กำลังดำเนินการ',
  PENDING_PAYMENT: 'รอชำระ',
  PENDING_CONFIRMATION: 'รอยืนยัน',
  CANCELLED_BY_CUSTOMER: 'ยกเลิกโดยลูกค้า',
  CANCELLED_BY_PROVIDER: 'ยกเลิกโดย Provider',
  PAYMENT_HELD: 'ถือชำระ',
}

const CAT_LABEL: Record<string, string> = {
  food: '🍜 อาหาร', repair: '🔧 ซ่อมแซม', tutoring: '📚 สอน',
  home: '🏠 บ้าน', health: '💊 สุขภาพ', agri: '🌾 เกษตร',
  freelance: '💻 ฟรีแลนซ์', elderly: '👴 ผู้สูงอายุ',
  handmade: '🎨 งานฝีมือ', community: '🏘️ ชุมชน',
}

type ChartMode = 'daily' | 'monthly'

export default function PlatformAnalyticsPage() {
  const { data, isLoading, refetch, isFetching } = usePlatformAnalytics()
  const [chartMode, setChartMode] = useState<ChartMode>('daily')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartData: Record<string, any>[] = chartMode === 'daily' ? (data?.dailyRevenue ?? []) : (data?.monthlyRevenue ?? [])

  const kpiCards = data ? [
    {
      label: 'รายได้รวม', value: `฿${data.kpi.totalRevenue.toLocaleString()}`,
      growth: data.kpi.revenueGrowth, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50',
    },
    {
      label: 'คำสั่งซื้อทั้งหมด', value: data.kpi.totalOrders.toLocaleString(),
      growth: data.kpi.ordersGrowth, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50',
    },
    {
      label: 'ลูกค้า', value: data.kpi.uniqueCustomers.toLocaleString(),
      growth: null as number | null, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50',
    },
    {
      label: 'รายการสินค้าเปิดใช้', value: data.kpi.activeListings.toLocaleString(),
      growth: null as number | null, icon: Package, color: 'text-sky-600', bg: 'bg-sky-50',
    },
  ] : []

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  )

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard/superadmin" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary">
          <ChevronLeft className="w-4 h-4" /> SuperAdmin
        </Link>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          📊 Platform Analytics
        </h1>
        <button onClick={() => void refetch()} disabled={isFetching}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          รีเฟรช
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpiCards.map((k, i) => (
          <motion.div key={k.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="glass-card rounded-xl p-4">
            <div className={`w-9 h-9 ${k.bg} ${k.color} rounded-xl flex items-center justify-center mb-3`}>
              <k.icon className="w-4 h-4" />
            </div>
            <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
            {k.growth !== null && (
              <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${k.growth >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {k.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.growth >= 0 ? '+' : ''}{k.growth}% vs เดือนที่แล้ว
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Conversion rate banner */}
      {data && (
        <div className="glass-card rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="text-3xl font-bold text-primary">{data.kpi.conversionRate}%</div>
          <div>
            <p className="font-semibold text-slate-700">Conversion Rate</p>
            <p className="text-xs text-slate-500">{data.kpi.completedOrders.toLocaleString()} / {data.kpi.totalOrders.toLocaleString()} คำสั่งซื้อ สำเร็จ</p>
          </div>
          <div className="ml-auto w-40 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${data.kpi.conversionRate}%` }} />
          </div>
        </div>
      )}

      {/* Revenue chart */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-700">รายได้และคำสั่งซื้อ</h2>
          <div className="flex gap-1 glass-sm rounded-lg p-0.5">
            {(['daily', 'monthly'] as ChartMode[]).map(m => (
              <button key={m} onClick={() => setChartMode(m)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  chartMode === m ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-700'
                }`}>
                {m === 'daily' ? '30 วัน' : '6 เดือน'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey={chartMode === 'daily' ? 'date' : 'month'}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickFormatter={(v: string) => chartMode === 'daily' ? v.slice(5) : v.slice(0, 7)} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
            <Tooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, 'รายได้']} />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#rev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: Pie + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Order status pie */}
        <div className="glass-card rounded-xl p-4">
          <h2 className="font-semibold text-slate-700 mb-4">สถานะคำสั่งซื้อ</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data?.orderStatusBreakdown ?? []}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={75}
              >
                {(data?.orderStatusBreakdown ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, STATUS_LABEL[name as string] ?? name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category bar */}
        <div className="glass-card rounded-xl p-4">
          <h2 className="font-semibold text-slate-700 mb-4">หมวดหมู่ยอดนิยม</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.categoryDistribution ?? []} layout="vertical" margin={{ left: 60, right: 8, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(v: string) => CAT_LABEL[v] ?? v} width={60} />
              <Tooltip formatter={(value) => [value, 'รายการ']} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top providers */}
      <div className="glass-card rounded-xl p-4">
        <h2 className="font-semibold text-slate-700 mb-4">Top Providers (รายได้)</h2>
        <div className="space-y-3">
          {(data?.topProviders ?? []).map((p, i) => {
            const maxRev = data!.topProviders[0]?.revenue ?? 1
            return (
              <div key={p.providerId} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-slate-700' : i === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 truncate">Provider #{p.providerId.slice(-6)}</span>
                    <span className="text-emerald-600 font-bold shrink-0 ml-2">฿{p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      style={{ width: `${(p.revenue / maxRev) * 100}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{p.orderCount} คำสั่งซื้อ</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
