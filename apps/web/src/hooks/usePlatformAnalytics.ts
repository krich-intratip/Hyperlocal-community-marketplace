'use client'
import { useQuery } from '@tanstack/react-query'
import { analyticsApi, type PlatformAnalytics } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

function buildMock(): PlatformAnalytics {
  const now = new Date()
  const daily = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now.getTime() - (29 - i) * 86400_000)
    return {
      date: d.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 15000 + 3000),
      orders: Math.floor(Math.random() * 40 + 10),
    }
  })
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    return { month: key, revenue: Math.floor(Math.random() * 200000 + 80000), orders: Math.floor(Math.random() * 800 + 200) }
  })
  return {
    kpi: { totalRevenue: 1240000, totalOrders: 3842, completedOrders: 3100, activeListings: 245, uniqueCustomers: 892, conversionRate: 80.7, revenueGrowth: 12.3, ordersGrowth: 8.5 },
    dailyRevenue: daily,
    monthlyRevenue: monthly,
    orderStatusBreakdown: [
      { status: 'COMPLETED', count: 3100 },
      { status: 'CONFIRMED', count: 280 },
      { status: 'IN_PROGRESS', count: 156 },
      { status: 'PENDING_PAYMENT', count: 200 },
      { status: 'CANCELLED_BY_CUSTOMER', count: 106 },
    ],
    categoryDistribution: [
      { category: 'food', count: 82 },
      { category: 'repair', count: 45 },
      { category: 'tutoring', count: 38 },
      { category: 'home', count: 29 },
      { category: 'health', count: 24 },
      { category: 'agri', count: 15 },
      { category: 'freelance', count: 12 },
    ],
    topProviders: Array.from({ length: 5 }, (_, i) => ({
      providerId: `provider-${i + 1}`,
      orderCount: 150 - i * 20,
      revenue: 85000 - i * 12000,
    })),
  }
}

export function usePlatformAnalytics() {
  const user = useAuthStore(s => s.user)
  return useQuery<PlatformAnalytics>({
    queryKey: ['analytics', 'platform'],
    queryFn: async () => {
      if (!USE_REAL_API) return buildMock()
      const res = await analyticsApi.getPlatform()
      return (res.data ?? res) as unknown as PlatformAnalytics
    },
    enabled: !!user && ['superadmin', 'admin'].includes(user.role ?? ''),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })
}
