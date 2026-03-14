import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike, IsNull, Not } from 'typeorm'
import { UserRole, VerificationStatus } from '@chm/shared-types'
import { User } from '../users/entities/user.entity'
import { Provider } from '../providers/entities/provider.entity'
import { Order } from '../orders/entities/order.entity'
import { Payment } from '../payments/entities/payment.entity'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)     private readonly userRepo: Repository<User>,
    @InjectRepository(Provider) private readonly providerRepo: Repository<Provider>,
    @InjectRepository(Order)    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Payment)  private readonly paymentRepo: Repository<Payment>,
  ) {}

  // ── User Management ──────────────────────────────────────────────────────────

  async listUsers(query: {
    search?: string
    role?: string
    isActive?: string
    page?: number
    limit?: number
  }) {
    const page  = Math.max(1, query.page  ?? 1)
    const limit = Math.min(100, Math.max(1, query.limit ?? 20))

    const where: Record<string, unknown>[] = []
    const base: Record<string, unknown> = {}

    if (query.role && Object.values(UserRole).includes(query.role as UserRole)) {
      base['role'] = query.role
    }
    if (query.isActive !== undefined) {
      base['isActive'] = query.isActive === 'true'
    }

    if (query.search) {
      where.push({ ...base, displayName: ILike(`%${query.search}%`) })
      where.push({ ...base, email: ILike(`%${query.search}%`) })
    } else {
      where.push(base)
    }

    const [users, total] = await this.userRepo.findAndCount({
      where: where.length === 1 && Object.keys(where[0]).length === 0 ? {} : where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return { users, total, page, limit, pages: Math.ceil(total / limit) }
  }

  async setUserStatus(userId: string, isActive: boolean) {
    await this.userRepo.update(userId, { isActive })
    const user = await this.userRepo.findOne({ where: { id: userId } })
    return { success: true, user }
  }

  async setUserRole(userId: string, role: UserRole) {
    await this.userRepo.update(userId, { role })
    const user = await this.userRepo.findOne({ where: { id: userId } })
    return { success: true, user }
  }

  // ── Provider Applications ─────────────────────────────────────────────────────

  async getPendingAll() {
    return this.providerRepo.find({
      where: { verificationStatus: VerificationStatus.PENDING },
      order: { createdAt: 'ASC' },
    })
  }

  async getAllProviders(query: { status?: string; communityId?: string }) {
    const where: Record<string, unknown> = {}
    if (query.status) where['verificationStatus'] = query.status
    if (query.communityId) where['communityId'] = query.communityId
    else where['communityId'] = Not(IsNull())
    return this.providerRepo.find({ where, order: { createdAt: 'DESC' } })
  }

  // ── Revenue Analytics ─────────────────────────────────────────────────────────

  async getRevenueSummary() {
    // Aggregate from orders
    const orders = await this.orderRepo.find()
    const payments = await this.paymentRepo.find({ where: { status: 'PAID' } })

    const completedOrders = orders.filter(o =>
      ['COMPLETED', 'PAYMENT_HELD', 'CONFIRMED', 'IN_PROGRESS', 'PENDING_CONFIRMATION'].includes(o.status)
    )
    const cancelledOrders = orders.filter(o =>
      ['CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_PROVIDER'].includes(o.status)
    )

    const gmv            = completedOrders.reduce((s, o) => s + (o.subtotal ?? 0), 0)
    const platformFees   = completedOrders.reduce((s, o) => s + (o.platformFee ?? 0), 0)
    const totalOrders    = orders.length
    const paidPayments   = payments.length
    const totalRevenue   = payments.reduce((s, p) => s + (p.amount ?? 0), 0)

    // This month
    const now     = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthOrders = completedOrders.filter(o => new Date(o.createdAt) >= monthStart)
    const thisMonthGMV    = thisMonthOrders.reduce((s, o) => s + (o.subtotal ?? 0), 0)
    const thisMonthFees   = thisMonthOrders.reduce((s, o) => s + (o.platformFee ?? 0), 0)

    // Order status breakdown
    const statusBreakdown: Record<string, number> = {}
    for (const o of orders) {
      statusBreakdown[o.status] = (statusBreakdown[o.status] ?? 0) + 1
    }

    // Payment method breakdown
    const methodBreakdown: Record<string, number> = {}
    for (const p of payments) {
      methodBreakdown[p.method] = (methodBreakdown[p.method] ?? 0) + 1
    }

    // Top communities by GMV
    const byComm: Record<string, number> = {}
    for (const o of completedOrders) {
      byComm[o.communityId] = (byComm[o.communityId] ?? 0) + (o.subtotal ?? 0)
    }
    const topCommunities = Object.entries(byComm)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([communityId, gmv]) => ({ communityId, gmv }))

    return {
      gmv,
      platformFees,
      totalOrders,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      paidPayments,
      totalRevenue,
      thisMonth: { gmv: thisMonthGMV, fees: thisMonthFees, orders: thisMonthOrders.length },
      statusBreakdown,
      methodBreakdown,
      topCommunities,
    }
  }

  // ── Platform Stats ────────────────────────────────────────────────────────────

  async getPlatformStats() {
    const [totalUsers, activeUsers, totalProviders, pendingProviders, totalOrders] = await Promise.all([
      this.userRepo.count(),
      this.userRepo.count({ where: { isActive: true } }),
      this.providerRepo.count({ where: { verificationStatus: VerificationStatus.APPROVED } }),
      this.providerRepo.count({ where: { verificationStatus: VerificationStatus.PENDING } }),
      this.orderRepo.count(),
    ])
    return { totalUsers, activeUsers, totalProviders, pendingProviders, totalOrders }
  }
}
