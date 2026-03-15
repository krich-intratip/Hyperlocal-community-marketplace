import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProviderSubscription } from './entities/provider-subscription.entity'
import { SubscriptionTier } from '@chm/shared-types'
import { SUBSCRIPTION_PLANS } from './subscription-plans'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(ProviderSubscription)
    private readonly subRepo: Repository<ProviderSubscription>,
  ) {}

  /** Get all available plans */
  getPlans() {
    return Object.values(SUBSCRIPTION_PLANS)
  }

  /** Get current subscription for a provider (by providerId) */
  async getMySubscription(providerId: string): Promise<ProviderSubscription> {
    const sub = await this.subRepo.findOne({ where: { providerId } })
    if (!sub) {
      // Auto-create FREE tier subscription
      return this.subRepo.save(
        this.subRepo.create({
          providerId,
          tier: SubscriptionTier.FREE,
          startsAt: new Date(),
          expiresAt: null,
          priceTHB: 0,
          isActive: true,
          autoRenew: false,
        }),
      )
    }
    return sub
  }

  /** Upgrade/change subscription tier (Super Admin or payment hook) */
  async setTier(
    providerId: string,
    tier: SubscriptionTier,
    months = 1,
  ): Promise<ProviderSubscription> {
    const plan = SUBSCRIPTION_PLANS[tier]
    if (!plan) throw new BadRequestException(`Invalid tier: ${tier}`)

    let sub = await this.subRepo.findOne({ where: { providerId } })
    const now = new Date()
    const expiresAt = tier === SubscriptionTier.FREE
      ? null
      : new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000)

    if (!sub) {
      sub = this.subRepo.create({ providerId })
    }

    sub.tier = tier
    sub.priceTHB = plan.priceMonthlyTHB * months
    sub.startsAt = now
    sub.expiresAt = expiresAt
    sub.isActive = true
    sub.cancelledAt = null

    return this.subRepo.save(sub)
  }

  /** Cancel subscription (revert to FREE) */
  async cancel(providerId: string): Promise<ProviderSubscription> {
    const sub = await this.subRepo.findOne({ where: { providerId } })
    if (!sub) throw new NotFoundException('ไม่พบข้อมูล Subscription')
    sub.cancelledAt = new Date()
    sub.autoRenew = false
    // Revert to FREE at expiry — mark but keep active until expiresAt
    return this.subRepo.save(sub)
  }

  /** SuperAdmin: list all subscriptions with optional tier filter */
  async listAll(tier?: SubscriptionTier): Promise<ProviderSubscription[]> {
    const where = tier ? { tier } : {}
    return this.subRepo.find({ where, order: { createdAt: 'DESC' } })
  }

  /** Check if provider has at least given tier */
  async hasTier(providerId: string, minTier: SubscriptionTier): Promise<boolean> {
    const tierOrder = [SubscriptionTier.FREE, SubscriptionTier.BASIC, SubscriptionTier.PRO, SubscriptionTier.ENTERPRISE]
    const sub = await this.getMySubscription(providerId)
    // Check not expired
    if (sub.expiresAt && sub.expiresAt < new Date()) return minTier === SubscriptionTier.FREE
    return tierOrder.indexOf(sub.tier) >= tierOrder.indexOf(minTier)
  }
}
