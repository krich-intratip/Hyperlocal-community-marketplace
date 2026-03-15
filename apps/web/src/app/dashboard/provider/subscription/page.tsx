'use client'
import { MarketBackground } from '@/components/market-background'
import { useMySubscription, usePlans, useCancelSubscription } from '@/hooks/useSubscription'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useState } from 'react'
import type { SubscriptionTier } from '@/lib/api'

const TIER_COLORS: Record<SubscriptionTier, string> = {
  FREE: 'from-slate-400 to-slate-600',
  BASIC: 'from-blue-500 to-blue-700',
  PRO: 'from-violet-500 to-purple-700',
  ENTERPRISE: 'from-amber-500 to-orange-600',
}

const TIER_LABELS: Record<SubscriptionTier, string> = {
  FREE: 'ฟรี',
  BASIC: 'พื้นฐาน',
  PRO: 'โปร',
  ENTERPRISE: 'องค์กร',
}

const TIER_ORDER: Record<SubscriptionTier, number> = {
  FREE: 0,
  BASIC: 1,
  PRO: 2,
  ENTERPRISE: 3,
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ProviderSubscriptionPage() {
  useAuthGuard(['provider', 'superadmin'])
  const { data: sub, isLoading: subLoading } = useMySubscription()
  const { data: plans, isLoading: plansLoading } = usePlans()
  const cancelMutation = useCancelSubscription()
  const [showCancel, setShowCancel] = useState(false)

  const isLoading = subLoading || plansLoading

  return (
    <div className="min-h-screen relative">
      <MarketBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">📦 แผนสมาชิก</h1>

        {isLoading ? (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400">กำลังโหลด...</div>
        ) : sub ? (
          <>
            {/* Current plan card */}
            <div className={`bg-gradient-to-r ${TIER_COLORS[sub.tier]} rounded-2xl p-6 text-white mb-6 shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">แผนปัจจุบัน</p>
                  <h2 className="text-2xl font-black mt-1">{TIER_LABELS[sub.tier]}</h2>
                  {sub.expiresAt && (
                    <p className="text-white/80 text-sm mt-1">หมดอายุ: {formatDate(sub.expiresAt)}</p>
                  )}
                  {sub.cancelledAt && (
                    <p className="text-white/70 text-xs mt-1">⚠️ ยกเลิกแล้ว — ใช้ได้ถึงวันหมดอายุ</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">ราคา</p>
                  <p className="text-2xl font-bold">
                    {sub.priceTHB === 0 ? 'ฟรี' : `฿${sub.priceTHB.toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Cancel button (non-FREE only) */}
            {sub.tier !== 'FREE' && !sub.cancelledAt && (
              <div className="mb-6">
                {showCancel ? (
                  <div className="glass-card rounded-xl p-4 border border-red-200">
                    <p className="text-sm text-slate-600 mb-3">
                      ยืนยันการยกเลิก? แผนจะยังใช้งานได้จนถึงวันหมดอายุ
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => cancelMutation.mutate(undefined, { onSuccess: () => setShowCancel(false) })}
                        disabled={cancelMutation.isPending}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                      >
                        {cancelMutation.isPending ? 'กำลังยกเลิก...' : 'ยืนยันยกเลิก'}
                      </button>
                      <button onClick={() => setShowCancel(false)} className="px-4 py-2 glass-sm rounded-lg text-sm">
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowCancel(true)} className="text-sm text-red-500 hover:underline">
                    ยกเลิกแผนสมาชิก
                  </button>
                )}
              </div>
            )}

            {/* Plan comparison */}
            <h2 className="text-lg font-semibold text-slate-700 mb-4">เปรียบเทียบแผน</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans?.map(plan => (
                <div
                  key={plan.tier}
                  className={`glass-card rounded-xl p-5 ${sub.tier === plan.tier ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${TIER_COLORS[plan.tier as SubscriptionTier]}`}>
                        {plan.nameTH}
                      </span>
                      {sub.tier === plan.tier && (
                        <span className="ml-2 text-xs text-primary font-medium">✓ แผนปัจจุบัน</span>
                      )}
                    </div>
                    <span className="font-bold text-slate-700">
                      {plan.priceMonthlyTHB === 0 ? 'ฟรี' : `฿${plan.priceMonthlyTHB}/เดือน`}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>📋 รายการสินค้า: {plan.maxListings === -1 ? 'ไม่จำกัด' : plan.maxListings}</li>
                    <li>🖼️ รูปภาพ/รายการ: {plan.maxImages === -1 ? 'ไม่จำกัด' : plan.maxImages}</li>
                    <li>⭐ สล็อตแนะนำ: {plan.featuredSlots === -1 ? 'ไม่จำกัด' : plan.featuredSlots}</li>
                    <li>{plan.analyticsAccess ? '✅' : '❌'} Analytics</li>
                    <li>{plan.prioritySupport ? '✅' : '❌'} Priority support</li>
                  </ul>
                  {sub.tier !== plan.tier && (
                    <a
                      href="/pricing"
                      className={`mt-3 block text-center text-xs py-1.5 rounded-lg text-white bg-gradient-to-r ${TIER_COLORS[plan.tier as SubscriptionTier]} hover:opacity-90`}
                    >
                      {TIER_ORDER[plan.tier as SubscriptionTier] > TIER_ORDER[sub.tier] ? 'อัปเกรด' : 'ดูรายละเอียด'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
