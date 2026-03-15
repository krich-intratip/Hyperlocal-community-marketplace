'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportApi, Report, ReportStats, ReportStatus, ReportType } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

const MOCK_REPORTS: Report[] = [
  { id: 'r1', reporterId: 'u1', type: 'LISTING', targetId: 'l1', reason: 'SPAM', description: 'This is spam', status: 'PENDING', adminNote: null, resolvedBy: null, resolvedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'r2', reporterId: 'u2', type: 'PROVIDER', targetId: 'p1', reason: 'FAKE', description: 'Fake provider', status: 'RESOLVED', adminNote: 'Investigated and resolved', resolvedBy: 'admin1', resolvedAt: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'r3', reporterId: 'u3', type: 'REVIEW', targetId: 'rv1', reason: 'INAPPROPRIATE', description: null, status: 'PENDING', adminNote: null, resolvedBy: null, resolvedAt: null, createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date().toISOString() },
]

const MOCK_STATS: ReportStats = { pending: 2, resolved: 1, dismissed: 0, total: 3 }

export function useSubmitReport() {
  return useMutation({
    mutationFn: (data: { type: ReportType; targetId: string; reason: string; description?: string }) => {
      if (!USE_REAL_API) return Promise.resolve({ data: MOCK_REPORTS[0] })
      return reportApi.create(data as Parameters<typeof reportApi.create>[0])
    },
  })
}

export function useAdminReports(status?: ReportStatus, type?: ReportType) {
  const user = useAuthStore(s => s.user)
  return useQuery({
    queryKey: ['reports', 'admin', status, type],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_REPORTS
      const res = await reportApi.listAll({ status, type })
      return res.data
    },
    enabled: user?.role === 'superadmin' || user?.role === 'admin',
  })
}

export function useReportStats() {
  const user = useAuthStore(s => s.user)
  return useQuery({
    queryKey: ['reports', 'stats'],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_STATS
      const res = await reportApi.getStats()
      return res.data
    },
    enabled: user?.role === 'superadmin' || user?.role === 'admin',
  })
}

export function useResolveReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, adminNote }: { id: string; status: 'RESOLVED' | 'DISMISSED'; adminNote?: string }) =>
      reportApi.resolve(id, { status, adminNote }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}
