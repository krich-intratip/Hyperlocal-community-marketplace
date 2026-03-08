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
      this.bookingRepo.count({ where: { providerId: provider.id, status: BookingStatus.PENDING } }),
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
}
