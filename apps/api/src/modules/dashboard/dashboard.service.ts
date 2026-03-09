import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Booking } from '../bookings/entities/booking.entity'
import { Review } from '../reviews/entities/review.entity'
import { Provider } from '../providers/entities/provider.entity'
import { BookingStatus } from '@chm/shared-types'

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Provider) private readonly providerRepo: Repository<Provider>,
  ) {}

  async getProviderDashboard(userId: string) {
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider) return null
    const [totalBookings, pendingBookings, completedBookings] = await Promise.all([
      this.bookingRepo.count({ where: { providerId: provider.id } }),
      this.bookingRepo.count({ where: { providerId: provider.id, status: BookingStatus.PENDING_PAYMENT } }),
      this.bookingRepo.count({ where: { providerId: provider.id, status: BookingStatus.COMPLETED } }),
    ])
    const revenueResult = await this.bookingRepo
      .createQueryBuilder('b')
      .select('SUM(b.total_amount - b.commission_amount)', 'netRevenue')
      .where('b.provider_id = :providerId AND b.status = :status', { providerId: provider.id, status: BookingStatus.COMPLETED })
      .getRawOne()
    return { provider, totalBookings, pendingBookings, completedBookings, netRevenue: parseFloat(revenueResult?.netRevenue) || 0 }
  }

  async getCommunityAdminDashboard(communityId: string) {
    const [totalBookings, completedBookings] = await Promise.all([
      this.bookingRepo.count({ where: { communityId } }),
      this.bookingRepo.count({ where: { communityId, status: BookingStatus.COMPLETED } }),
    ])
    const revenueResult = await this.bookingRepo
      .createQueryBuilder('b')
      .select('SUM(b.commission_amount)', 'totalCommission')
      .addSelect('SUM(b.revenue_share_amount)', 'totalRevenueShare')
      .where('b.community_id = :communityId AND b.status = :status', { communityId, status: BookingStatus.COMPLETED })
      .getRawOne()
    return {
      communityId, totalBookings, completedBookings,
      totalCommission: parseFloat(revenueResult?.totalCommission) || 0,
      revenueShare: parseFloat(revenueResult?.totalRevenueShare) || 0,
    }
  }

  async getSuperAdminDashboard() {
    const [totalBookings, totalProviders, completedBookings] = await Promise.all([
      this.bookingRepo.count(),
      this.providerRepo.count({ where: { isActive: true } }),
      this.bookingRepo.count({ where: { status: BookingStatus.COMPLETED } }),
    ])
    const revenueResult = await this.bookingRepo
      .createQueryBuilder('b')
      .select('SUM(b.commission_amount)', 'totalCommission')
      .where('b.status = :status', { status: BookingStatus.COMPLETED })
      .getRawOne()
    return {
      totalBookings, totalProviders, completedBookings,
      totalCommission: parseFloat(revenueResult?.totalCommission) || 0,
    }
  }

  async getAnalytics(communityId?: string, months = 6) {
    const from = new Date()
    from.setMonth(from.getMonth() - months + 1)
    from.setDate(1)
    from.setHours(0, 0, 0, 0)

    const baseQb = this.bookingRepo
      .createQueryBuilder('b')
      .where('b.status = :status', { status: BookingStatus.COMPLETED })
      .andWhere('b.created_at >= :from', { from })

    if (communityId) baseQb.andWhere('b.community_id = :communityId', { communityId })

    // Monthly time-series: orders, sales, commission
    const monthlySeries = await baseQb
      .clone()
      .select("TO_CHAR(DATE_TRUNC('month', b.created_at), 'YYYY-MM')", 'month')
      .addSelect('COUNT(b.id)', 'orders')
      .addSelect('SUM(b.total_amount)', 'sales')
      .addSelect('SUM(b.commission_amount)', 'commission')
      .groupBy("DATE_TRUNC('month', b.created_at)")
      .orderBy("DATE_TRUNC('month', b.created_at)", 'ASC')
      .getRawMany()

    // Top 5 providers by completed bookings revenue
    const topProviders = await baseQb
      .clone()
      .select('b.provider_id', 'providerId')
      .addSelect('p.name', 'providerName')
      .addSelect('COUNT(b.id)', 'orders')
      .addSelect('SUM(b.total_amount - b.commission_amount)', 'revenue')
      .leftJoin('b.provider', 'p')
      .groupBy('b.provider_id')
      .addGroupBy('p.name')
      .orderBy('revenue', 'DESC')
      .limit(5)
      .getRawMany()

    // Summary totals
    const totals = await baseQb
      .clone()
      .select('COUNT(b.id)', 'totalOrders')
      .addSelect('SUM(b.total_amount)', 'totalSales')
      .addSelect('SUM(b.commission_amount)', 'totalCommission')
      .getRawOne()

    return {
      period: { from, months },
      communityId: communityId ?? null,
      summary: {
        totalOrders: parseInt(totals?.totalOrders) || 0,
        totalSales: parseFloat(totals?.totalSales) || 0,
        totalCommission: parseFloat(totals?.totalCommission) || 0,
      },
      monthlySeries: monthlySeries.map((r) => ({
        month: r.month,
        orders: parseInt(r.orders) || 0,
        sales: parseFloat(r.sales) || 0,
        commission: parseFloat(r.commission) || 0,
      })),
      topProviders: topProviders.map((r) => ({
        providerId: r.providerId,
        providerName: r.providerName,
        orders: parseInt(r.orders) || 0,
        revenue: parseFloat(r.revenue) || 0,
      })),
    }
  }
}
