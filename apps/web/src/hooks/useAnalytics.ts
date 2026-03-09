'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'
import type { AnalyticsResponse } from '@/types'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

// ── Mock fallback data ─────────────────────────────────────────────────────────

const MOCK_ANALYTICS: AnalyticsResponse = {
  period: 6,
  summary: { totalOrders: 2605, totalSales: 2152100, totalCommission: 215210 },
  monthlySeries: [
    { month: '2025-10', orders: 312, sales: 248400, commission: 24840 },
    { month: '2025-11', orders: 389, sales: 312000, commission: 31200 },
    { month: '2025-12', orders: 501, sales: 422800, commission: 42280 },
    { month: '2026-01', orders: 448, sales: 371600, commission: 37160 },
    { month: '2026-02', orders: 534, sales: 445200, commission: 44520 },
    { month: '2026-03', orders: 421, sales: 352100, commission: 35210 },
  ],
  topProviders: [
    { providerId: '1', providerName: 'แม่สมร อาหารอีสาน', orders: 142, revenue: 62800 },
    { providerId: '2', providerName: 'ช่างสมชาย ซ่อมบ้าน', orders: 98, revenue: 48500 },
    { providerId: '3', providerName: 'ทีมแม่บ้านสะอาด', orders: 87, revenue: 43200 },
    { providerId: '4', providerName: 'ครูน้องใหม่สอนพิเศษ', orders: 76, revenue: 38400 },
    { providerId: '5', providerName: 'เบเกอรี่ป้าแดง', orders: 64, revenue: 29800 },
  ],
}

// ── Fetcher ────────────────────────────────────────────────────────────────────

async function fetchAnalytics(months: number, communityId?: string): Promise<AnalyticsResponse> {
  if (USE_REAL_API) {
    const res = await dashboardApi.getAnalytics({ months, communityId })
    return res.data
  }
  await new Promise((r) => setTimeout(r, 200))
  return {
    ...MOCK_ANALYTICS,
    period: months,
    monthlySeries: MOCK_ANALYTICS.monthlySeries.slice(-months),
  }
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useAnalytics(months: number, communityId?: string) {
  return useQuery({
    queryKey: ['analytics', months, communityId],
    queryFn: () => fetchAnalytics(months, communityId),
    staleTime: 5 * 60 * 1000,  // 5 min — matches backend Redis cache TTL
    placeholderData: (prev) => prev,  // keep previous data while refetching
  })
}
