import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from '../orders/entities/order.entity'
import { Listing } from '../listings/entities/listing.entity'
import { ListingStatus } from '@chm/shared-types'

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  async getPlatformAnalytics() {
    const [orders, listings] = await Promise.all([
      this.orderRepo.find({ order: { createdAt: 'ASC' } }),
      this.listingRepo.find(),
    ])

    // ── KPI ──────────────────────────────────────────────────────────────────
    const completedOrders = orders.filter(o => o.status === 'COMPLETED')
    const totalRevenue = completedOrders.reduce((s, o) => s + Number(o.total ?? 0), 0)
    const totalOrders = orders.length
    const activeListings = listings.filter(l => l.status === ListingStatus.ACTIVE).length

    // unique customers
    const uniqueCustomers = new Set(orders.map(o => o.customerId)).size

    // ── Daily revenue (last 30 days) ──────────────────────────────────────────
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const recentOrders = orders.filter(o => new Date(o.createdAt) >= thirtyDaysAgo)

    const dailyMap = new Map<string, { date: string; revenue: number; orders: number }>()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().split('T')[0]
      dailyMap.set(key, { date: key, revenue: 0, orders: 0 })
    }
    for (const o of recentOrders) {
      const key = new Date(o.createdAt).toISOString().split('T')[0]
      if (dailyMap.has(key)) {
        const entry = dailyMap.get(key)!
        entry.orders += 1
        if (o.status === 'COMPLETED') {
          entry.revenue += Number(o.total ?? 0)
        }
      }
    }
    const dailyRevenue = Array.from(dailyMap.values())

    // ── Monthly revenue (last 6 months) ──────────────────────────────────────
    const monthlyMap = new Map<string, { month: string; revenue: number; orders: number }>()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyMap.set(key, { month: key, revenue: 0, orders: 0 })
    }
    for (const o of orders) {
      const d = new Date(o.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (monthlyMap.has(key)) {
        const entry = monthlyMap.get(key)!
        entry.orders += 1
        if (o.status === 'COMPLETED') {
          entry.revenue += Number(o.total ?? 0)
        }
      }
    }
    const monthlyRevenue = Array.from(monthlyMap.values())

    // ── Order status breakdown ────────────────────────────────────────────────
    const statusCount = orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1
      return acc
    }, {})
    const orderStatusBreakdown = Object.entries(statusCount).map(([status, count]) => ({ status, count }))

    // ── Category distribution ─────────────────────────────────────────────────
    const catCount = listings.reduce<Record<string, number>>((acc, l) => {
      const cat = l.category ?? 'other'
      acc[cat] = (acc[cat] ?? 0) + 1
      return acc
    }, {})
    const categoryDistribution = Object.entries(catCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // ── Top providers ─────────────────────────────────────────────────────────
    const providerStats = new Map<string, { providerId: string; orderCount: number; revenue: number }>()
    for (const o of completedOrders) {
      if (!o.providerId) continue
      const prev = providerStats.get(o.providerId) ?? { providerId: o.providerId, orderCount: 0, revenue: 0 }
      prev.orderCount += 1
      prev.revenue += Number(o.total ?? 0)
      providerStats.set(o.providerId, prev)
    }
    const topProviders = Array.from(providerStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // ── Conversion rate ───────────────────────────────────────────────────────
    const conversionRate =
      totalOrders > 0 ? Math.round((completedOrders.length / totalOrders) * 100 * 10) / 10 : 0

    // ── Growth (compare this month vs last month) ─────────────────────────────
    const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`
    const thisMonth = monthlyMap.get(thisMonthKey) ?? { revenue: 0, orders: 0 }
    const lastMonth = monthlyMap.get(lastMonthKey) ?? { revenue: 0, orders: 0 }
    const revenueGrowth =
      lastMonth.revenue > 0
        ? Math.round(((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100 * 10) / 10
        : 0
    const ordersGrowth =
      lastMonth.orders > 0
        ? Math.round(((thisMonth.orders - lastMonth.orders) / lastMonth.orders) * 100 * 10) / 10
        : 0

    return {
      kpi: {
        totalRevenue,
        totalOrders,
        completedOrders: completedOrders.length,
        activeListings,
        uniqueCustomers,
        conversionRate,
        revenueGrowth,
        ordersGrowth,
      },
      dailyRevenue,
      monthlyRevenue,
      orderStatusBreakdown,
      categoryDistribution,
      topProviders,
    }
  }
}
