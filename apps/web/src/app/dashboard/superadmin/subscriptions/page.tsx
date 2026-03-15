'use client'
import { MarketBackground } from '@/components/market-background'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useQuery } from '@tanstack/react-query'
import { subscriptionApi, ProviderSubscription, SubscriptionTier } from '@/lib/api'
import { useAdminSetTier } from '@/hooks/useSubscription'
import { useState } from 'react'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

const TIER_COLORS: Record<SubscriptionTier, string> = {
  FREE: 'bg-slate-100 text-slate-600',
  BASIC: 'bg-blue-100 text-blue-700',
  PRO: 'bg-violet-100 text-violet-700',
  ENTERPRISE: 'bg-amber-100 text-amber-700',
}

const MOCK_SUBS: ProviderSubscription[] = [
  { id: '1', providerId: 'p1', tier: 'PRO', startsAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30*24*60*60*1000).toISOString(), priceTHB: 699, isActive: true, autoRenew: true, cancelledAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', providerId: 'p2', tier: 'BASIC', startsAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 15*24*60*60*1000).toISOString(), priceTHB: 299, isActive: true, autoRenew: false, cancelledAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', providerId: 'p3', tier: 'FREE', startsAt: new Date().toISOString(), expiresAt: null, priceTHB: 0, isActive: true, autoRenew: false, cancelledAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', providerId: 'p4', tier: 'ENTERPRISE', startsAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 365*24*60*60*1000).toISOString(), priceTHB: 1999, isActive: true, autoRenew: true, cancelledAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminSubscriptionsPage() {
  useAuthGuard(['superadmin'])
  const [filterTier, setFilterTier] = useState<SubscriptionTier | ''>('')
  const [setTierForm, setSetTierForm] = useState({ providerId: '', tier: 'BASIC' as SubscriptionTier, months: 1 })
  const setTierMutation = useAdminSetTier()

  const { data: subs = [], isLoading } = useQuery({
    queryKey: ['subscription', 'admin', 'list', filterTier],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_SUBS
      const res = await subscriptionApi.adminListAll(filterTier || undefined)
      return res.data
    },
  })

  // KPI
  const kpi = {
    total: subs.length,
    pro: subs.filter(s => s.tier === 'PRO').length,
    enterprise: subs.filter(s => s.tier === 'ENTERPRISE').length,
    revenue: subs.reduce((sum, s) => sum + (s.priceTHB ?? 0), 0),
  }

  return (
    <div className="min-h-screen relative">
      <MarketBackground />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">💳 จัดการ Subscriptions</h1>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'ทั้งหมด', value: kpi.total, icon: '📊' },
            { label: 'Pro', value: kpi.pro, icon: '⭐' },
            { label: 'Enterprise', value: kpi.enterprise, icon: '🏢' },
            { label: 'รายได้รวม (เดือนนี้)', value: `฿${kpi.revenue.toLocaleString()}`, icon: '💰' },
          ].map(k => (
            <div key={k.label} className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{k.icon}</div>
              <div className="text-xl font-bold text-slate-800">{k.value}</div>
              <div className="text-xs text-slate-500">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Set tier form */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-slate-700 mb-4">🔧 ตั้งค่า Tier ให้ Provider</h2>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Provider ID"
              value={setTierForm.providerId}
              onChange={e => setSetTierForm(f => ({ ...f, providerId: e.target.value }))}
              className="flex-1 min-w-[160px] px-3 py-2 glass-sm rounded-lg text-sm border border-white/30"
            />
            <select
              value={setTierForm.tier}
              onChange={e => setSetTierForm(f => ({ ...f, tier: e.target.value as SubscriptionTier }))}
              className="px-3 py-2 glass-sm rounded-lg text-sm border border-white/30"
            >
              {(['FREE', 'BASIC', 'PRO', 'ENTERPRISE'] as SubscriptionTier[]).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={12}
              value={setTierForm.months}
              onChange={e => setSetTierForm(f => ({ ...f, months: parseInt(e.target.value) || 1 }))}
              className="w-20 px-3 py-2 glass-sm rounded-lg text-sm border border-white/30"
              placeholder="เดือน"
            />
            <button
              onClick={() => setTierMutation.mutate(setTierForm)}
              disabled={setTierMutation.isPending || !setTierForm.providerId}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {setTierMutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
          {setTierMutation.isSuccess && (
            <p className="mt-2 text-sm text-emerald-600">✅ อัปเดตสำเร็จ</p>
          )}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['', 'FREE', 'BASIC', 'PRO', 'ENTERPRISE'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterTier === t ? 'bg-primary text-white' : 'glass-sm text-slate-600 hover:bg-white'
              }`}
            >
              {t || 'ทั้งหมด'}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center text-slate-400 py-12">กำลังโหลด...</div>
        ) : (
          <div className="space-y-3">
            {subs.map(sub => (
              <div key={sub.id} className="glass-card rounded-xl p-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[120px]">
                  <p className="text-xs text-slate-400">Provider ID</p>
                  <p className="text-sm font-mono text-slate-700">{sub.providerId.slice(0, 8)}...</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[sub.tier]}`}>
                  {sub.tier}
                </span>
                <div className="text-sm text-slate-600">
                  ฿{sub.priceTHB.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">
                  หมดอายุ: {formatDate(sub.expiresAt)}
                </div>
                <div className={`text-xs font-medium ${sub.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {sub.isActive ? '● Active' : '● Inactive'}
                </div>
                {sub.cancelledAt && (
                  <span className="text-xs text-red-400">ยกเลิกแล้ว</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
