'use client'
import { useQuery } from '@tanstack/react-query'
import { auditApi, AuditLog, AuditStats, AuditAction } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

const MOCK_LOGS: AuditLog[] = [
  { id: 'a1', userId: 'u1', action: 'LOGIN_SUCCESS', resource: null, resourceId: null, meta: null, ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0 Chrome/120', success: true, createdAt: new Date().toISOString() },
  { id: 'a2', userId: null, action: 'LOGIN_FAILED', resource: null, resourceId: null, meta: '{"email":"test@test.com"}', ipAddress: '10.0.0.1', userAgent: 'curl/7.68.0', success: false, createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'a3', userId: 'u2', action: 'PROVIDER_APPROVED', resource: 'Provider', resourceId: 'p1', meta: null, ipAddress: '192.168.1.2', userAgent: 'Mozilla/5.0 Safari/17', success: true, createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: 'a4', userId: 'u3', action: 'ORDER_STATUS_CHANGED', resource: 'Order', resourceId: 'o1', meta: '{"from":"PENDING","to":"CONFIRMED"}', ipAddress: '192.168.1.3', userAgent: 'Mozilla/5.0 Firefox/120', success: true, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'a5', userId: null, action: 'ACCESS_DENIED', resource: 'Admin', resourceId: null, meta: '{"path":"/admin/users"}', ipAddress: '1.2.3.4', userAgent: 'python-requests/2.28', success: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
]

const MOCK_STATS: AuditStats = { total: 1248, failedLast24h: 7, loginFailedLast24h: 5 }

export function useAuditLogs(params?: { action?: AuditAction; success?: boolean; limit?: number }) {
  const user = useAuthStore(s => s.user)
  return useQuery({
    queryKey: ['audit', 'logs', params],
    queryFn: async () => {
      if (!USE_REAL_API) return { logs: MOCK_LOGS, total: MOCK_LOGS.length }
      const res = await auditApi.getLogs(params)
      return res.data
    },
    enabled: user?.role === 'superadmin',
    refetchInterval: 30000, // auto-refresh every 30s
  })
}

export function useAuditStats() {
  const user = useAuthStore(s => s.user)
  return useQuery({
    queryKey: ['audit', 'stats'],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_STATS
      const res = await auditApi.getStats()
      return res.data
    },
    enabled: user?.role === 'superadmin',
    refetchInterval: 60000,
  })
}
