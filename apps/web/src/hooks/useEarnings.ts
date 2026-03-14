/**
 * useEarnings.ts — EARN-1 Provider Earnings hooks
 * Polls GET /orders/provider/earnings?period=...
 * Falls back to rich mock data when API is unavailable.
 */
import { useQuery } from '@tanstack/react-query'
import { earningsApi, type ProviderEarnings } from '@/lib/api'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

// ── Mock data fallback ────────────────────────────────────────────────────────

function buildMockEarnings(period: string): ProviderEarnings {
  const BASE_MONTHS = [
    { month: '2025-12', gross: 9400,  net: 8930,  orderCount: 23 },
    { month: '2026-01', gross: 12800, net: 12160, orderCount: 31 },
    { month: '2026-02', gross: 18200, net: 17290, orderCount: 44 },
    { month: '2026-03', gross: 22800, net: 21660, orderCount: 52 },
  ]

  const monthlyBreakdown = period === '7d' ? BASE_MONTHS.slice(-1)
    : period === '30d' ? BASE_MONTHS.slice(-2)
    : BASE_MONTHS

  const transactions = [
    { id: 'ord-001', service: 'อาหารกล่อง ×5',   date: '2026-03-08T09:00:00Z', gross: 400,  fee: 20,  net: 380,  status: 'COMPLETED' },
    { id: 'ord-002', service: 'อาหารกล่อง ×3',   date: '2026-03-08T11:30:00Z', gross: 240,  fee: 12,  net: 228,  status: 'COMPLETED' },
    { id: 'ord-003', service: 'อาหารกล่อง ×8',   date: '2026-03-07T14:00:00Z', gross: 640,  fee: 32,  net: 608,  status: 'COMPLETED' },
    { id: 'ord-004', service: 'อาหารคลีน ×2',    date: '2026-03-07T16:00:00Z', gross: 240,  fee: 12,  net: 228,  status: 'COMPLETED' },
    { id: 'ord-005', service: 'อาหารกล่อง ×4',   date: '2026-03-06T10:00:00Z', gross: 320,  fee: 16,  net: 304,  status: 'COMPLETED' },
    { id: 'ord-006', service: 'สลัดผัก ×3',      date: '2026-03-05T08:30:00Z', gross: 270,  fee: 13,  net: 257,  status: 'COMPLETED' },
    { id: 'ord-007', service: 'อาหารกล่อง ×10',  date: '2026-03-04T12:00:00Z', gross: 800,  fee: 40,  net: 760,  status: 'CONFIRMED' },
    { id: 'ord-008', service: 'อาหารคลีน ×5',    date: '2026-03-03T09:00:00Z', gross: 600,  fee: 30,  net: 570,  status: 'IN_PROGRESS' },
    { id: 'ord-009', service: 'อาหารกล่อง ×6',   date: '2026-02-28T11:00:00Z', gross: 480,  fee: 24,  net: 456,  status: 'COMPLETED' },
    { id: 'ord-010', service: 'สลัดผัก ×4',      date: '2026-02-27T13:00:00Z', gross: 360,  fee: 18,  net: 342,  status: 'COMPLETED' },
  ]

  const filteredTx = period === '7d'
    ? transactions.slice(0, 6)
    : period === '30d'
    ? transactions.slice(0, 8)
    : transactions

  const completedTx = filteredTx.filter(t => t.status === 'COMPLETED')
  const activeTx    = filteredTx.filter(t => t.status !== 'COMPLETED')

  return {
    period,
    totalGross:       completedTx.reduce((s, t) => s + t.gross, 0),
    totalFees:        completedTx.reduce((s, t) => s + t.fee,   0),
    totalNet:         completedTx.reduce((s, t) => s + t.net,   0),
    pendingPayout:    activeTx.reduce((s, t) => s + t.net, 0),
    completedOrders:  completedTx.length,
    monthlyBreakdown,
    transactions:     filteredTx,
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export type EarningsPeriod = '7d' | '30d' | '90d' | 'all'

export function useProviderEarnings(period: EarningsPeriod = '30d') {
  return useQuery<ProviderEarnings>({
    queryKey: ['provider', 'earnings', period],
    queryFn: async () => {
      if (!USE_REAL_API) return buildMockEarnings(period)
      const res = await earningsApi.get(period)
      return res.data ?? res as unknown as ProviderEarnings
    },
    staleTime: 2 * 60_000,
  })
}
