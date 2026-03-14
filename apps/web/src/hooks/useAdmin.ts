'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, type AdminUser, type RevenueSummary, type PlatformStats } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

// ── Users ─────────────────────────────────────────────────────────────────────

export function useAdminUsers(params?: {
  search?: string; role?: string; isActive?: string; page?: number; limit?: number
}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_USER_LIST
      const res = await adminApi.listUsers(params)
      return res.data as unknown as { users: AdminUser[]; total: number; page: number; limit: number; pages: number }
    },
    staleTime: 30_000,
  })
}

export function useSetUserStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      adminApi.setUserStatus(userId, isActive).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useSetUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminApi.setUserRole(userId, role).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

// ── Providers ─────────────────────────────────────────────────────────────────

export function useAdminPendingProviders() {
  return useQuery({
    queryKey: ['admin', 'providers', 'pending'],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_PENDING_PROVIDERS
      const res = await adminApi.getPendingAll()
      return res.data as unknown as unknown[]
    },
    staleTime: 30_000,
  })
}

export function useAdminAllProviders(params?: { status?: string; communityId?: string }) {
  return useQuery({
    queryKey: ['admin', 'providers', 'all', params],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_ALL_PROVIDERS
      const res = await adminApi.getAllProviders(params)
      return res.data as unknown as unknown[]
    },
    staleTime: 30_000,
  })
}

export function useAdminApproveProvider() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.approveProvider(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'providers'] })
    },
  })
}

export function useAdminRejectProvider() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.rejectProvider(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'providers'] })
    },
  })
}

// ── Revenue & Stats ───────────────────────────────────────────────────────────

export function useAdminRevenue() {
  return useQuery<RevenueSummary>({
    queryKey: ['admin', 'revenue'],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_REVENUE
      const res = await adminApi.getRevenue()
      return res.data as unknown as RevenueSummary
    },
    staleTime: 60_000,
  })
}

export function useAdminStats() {
  return useQuery<PlatformStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_STATS
      const res = await adminApi.getStats()
      return res.data as unknown as PlatformStats
    },
    staleTime: 60_000,
  })
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_USER_LIST = {
  users: [
    { id: 'u1', email: 'admin@chm.dev', displayName: 'Super Admin', role: 'SUPER_ADMIN', isActive: true, loginProvider: 'email', createdAt: '2026-01-01T00:00:00Z' },
    { id: 'u2', email: 'somchai@example.com', displayName: 'สมชาย ใจดี', role: 'PROVIDER', isActive: true, loginProvider: 'email', createdAt: '2026-01-15T00:00:00Z' },
    { id: 'u3', email: 'malee@example.com', displayName: 'มาลี สวัสดี', role: 'CUSTOMER', isActive: true, loginProvider: 'google', createdAt: '2026-02-01T00:00:00Z' },
    { id: 'u4', email: 'wichai@example.com', displayName: 'วิชัย รักดี', role: 'CUSTOMER', isActive: false, loginProvider: 'email', createdAt: '2026-02-10T00:00:00Z' },
    { id: 'u5', email: 'admin2@community.co.th', displayName: 'ผู้ดูแลชุมชน', role: 'COMMUNITY_ADMIN', isActive: true, loginProvider: 'google', createdAt: '2026-03-01T00:00:00Z' },
  ] as AdminUser[],
  total: 5, page: 1, limit: 20, pages: 1,
}

const MOCK_PENDING_PROVIDERS = [
  { id: 'p1', displayName: 'ร้านอาหารทดสอบ', communityId: '1', verificationStatus: 'PENDING', createdAt: '2026-03-10T00:00:00Z' },
  { id: 'p2', displayName: 'ช่างซ่อมไฟฟ้า', communityId: '3', verificationStatus: 'PENDING', createdAt: '2026-03-12T00:00:00Z' },
]

const MOCK_ALL_PROVIDERS = [
  { id: 'p1', displayName: 'ร้านอาหารทดสอบ', communityId: '1', verificationStatus: 'APPROVED', providerStatus: 'ACTIVE' },
  { id: 'p2', displayName: 'ช่างซ่อมไฟฟ้า', communityId: '3', verificationStatus: 'PENDING', providerStatus: 'ACTIVE' },
  { id: 'p3', displayName: 'ครูสอนภาษา', communityId: '2', verificationStatus: 'APPROVED', providerStatus: 'ACTIVE' },
]

const MOCK_REVENUE: RevenueSummary = {
  gmv: 842100, platformFees: 42105, totalOrders: 1240,
  completedOrders: 1180, cancelledOrders: 60,
  paidPayments: 1195, totalRevenue: 887610,
  thisMonth: { gmv: 125000, fees: 6250, orders: 186 },
  statusBreakdown: { COMPLETED: 1180, CANCELLED_BY_CUSTOMER: 45, CANCELLED_BY_PROVIDER: 15, IN_PROGRESS: 12, CONFIRMED: 8 },
  methodBreakdown: { promptpay: 920, cod: 240, card: 35 },
  topCommunities: [
    { communityId: '1', gmv: 210000 },
    { communityId: '2', gmv: 185000 },
    { communityId: '3', gmv: 142000 },
    { communityId: '4', gmv: 98000 },
    { communityId: '5', gmv: 76000 },
  ],
}

const MOCK_STATS: PlatformStats = {
  totalUsers: 2840, activeUsers: 2720,
  totalProviders: 340, pendingProviders: 8,
  totalOrders: 1240,
}
