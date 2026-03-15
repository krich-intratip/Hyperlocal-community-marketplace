import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoyaltyAccount, LoyaltyTier } from './entities/loyalty-account.entity'
import { LoyaltyTransaction } from './entities/loyalty-transaction.entity'

// 1 point per ฿10 spent
const POINTS_PER_BAHT = 0.1
// 100 points = ฿10 discount
const REDEEM_RATE = 0.1 // baht per point

const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  BRONZE: 0,
  SILVER: 500,
  GOLD: 2000,
  PLATINUM: 5000,
}

const TIER_MULTIPLIERS: Record<LoyaltyTier, number> = {
  BRONZE: 1.0,
  SILVER: 1.2,
  GOLD: 1.5,
  PLATINUM: 2.0,
}

function calcTier(totalEarned: number): LoyaltyTier {
  if (totalEarned >= TIER_THRESHOLDS.PLATINUM) return 'PLATINUM'
  if (totalEarned >= TIER_THRESHOLDS.GOLD) return 'GOLD'
  if (totalEarned >= TIER_THRESHOLDS.SILVER) return 'SILVER'
  return 'BRONZE'
}

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectRepository(LoyaltyAccount)
    private readonly accountRepo: Repository<LoyaltyAccount>,
    @InjectRepository(LoyaltyTransaction)
    private readonly txRepo: Repository<LoyaltyTransaction>,
  ) {}

  async getOrCreateAccount(customerId: string): Promise<LoyaltyAccount> {
    let account = await this.accountRepo.findOne({ where: { customerId } })
    if (!account) {
      account = this.accountRepo.create({ customerId, points: 0, totalEarned: 0, totalRedeemed: 0, tier: 'BRONZE' })
      account = await this.accountRepo.save(account)
    }
    return account
  }

  async getAccount(customerId: string): Promise<LoyaltyAccount & { nextTier: LoyaltyTier | null; pointsToNextTier: number | null; redeemValue: number }> {
    const account = await this.getOrCreateAccount(customerId)
    const tierOrder: LoyaltyTier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']
    const currentIdx = tierOrder.indexOf(account.tier)
    const nextTier = currentIdx < tierOrder.length - 1 ? tierOrder[currentIdx + 1] : null
    const pointsToNextTier = nextTier ? TIER_THRESHOLDS[nextTier] - account.totalEarned : null
    const redeemValue = Math.floor(account.points * REDEEM_RATE)
    return { ...account, nextTier, pointsToNextTier, redeemValue }
  }

  async getTransactions(customerId: string, limit = 20): Promise<LoyaltyTransaction[]> {
    return this.txRepo.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }

  /** Called on order COMPLETED — earn points from finalAmount */
  async earnPoints(customerId: string, orderId: string, amountPaid: number): Promise<void> {
    const account = await this.getOrCreateAccount(customerId)
    const multiplier = TIER_MULTIPLIERS[account.tier]
    const earned = Math.floor(amountPaid * POINTS_PER_BAHT * multiplier)
    if (earned <= 0) return

    account.points += earned
    account.totalEarned += earned
    account.tier = calcTier(account.totalEarned)
    await this.accountRepo.save(account)

    await this.txRepo.save(this.txRepo.create({
      customerId,
      type: 'EARN',
      points: earned,
      balance: account.points,
      description: `รับแต้มจากคำสั่งซื้อ (x${multiplier})`,
      orderId,
    }))
  }

  /** Validate and calculate discount from points — call BEFORE order creation */
  async validateRedeem(customerId: string, pointsToRedeem: number): Promise<{ discount: number }> {
    if (pointsToRedeem <= 0) return { discount: 0 }
    const account = await this.getOrCreateAccount(customerId)
    if (account.points < pointsToRedeem) {
      throw new BadRequestException(`แต้มไม่เพียงพอ (มีแต้ม ${account.points} แต้ม)`)
    }
    const discount = Math.floor(pointsToRedeem * REDEEM_RATE * 100) / 100
    return { discount }
  }

  /** Called when order is created with pointsToRedeem > 0 */
  async redeemPoints(customerId: string, orderId: string, pointsToRedeem: number): Promise<void> {
    if (pointsToRedeem <= 0) return
    const account = await this.getOrCreateAccount(customerId)
    if (account.points < pointsToRedeem) {
      throw new BadRequestException(`แต้มไม่เพียงพอ`)
    }
    account.points -= pointsToRedeem
    account.totalRedeemed += pointsToRedeem
    await this.accountRepo.save(account)

    await this.txRepo.save(this.txRepo.create({
      customerId,
      type: 'REDEEM',
      points: -pointsToRedeem,
      balance: account.points,
      description: `แลกแต้มลดราคา`,
      orderId,
    }))
  }

  /** Award bonus points (e.g. referral reward) — no multiplier applied */
  async awardBonus(customerId: string, orderId: string, points: number, description: string): Promise<void> {
    const account = await this.getOrCreateAccount(customerId)
    account.points += points
    account.totalEarned += points
    account.tier = calcTier(account.totalEarned)
    await this.accountRepo.save(account)

    await this.txRepo.save(this.txRepo.create({
      customerId,
      type: 'BONUS',
      points,
      balance: account.points,
      description,
      orderId,
    }))
  }

  /** Called when order is cancelled — restore redeemed points */
  async restorePoints(customerId: string, orderId: string, pointsRedeemed: number): Promise<void> {
    if (!pointsRedeemed || pointsRedeemed <= 0) return
    const account = await this.getOrCreateAccount(customerId)
    account.points += pointsRedeemed
    account.totalRedeemed = Math.max(0, account.totalRedeemed - pointsRedeemed)
    await this.accountRepo.save(account)

    await this.txRepo.save(this.txRepo.create({
      customerId,
      type: 'RESTORE',
      points: pointsRedeemed,
      balance: account.points,
      description: `คืนแต้มจากการยกเลิกคำสั่งซื้อ`,
      orderId,
    }))
  }
}
