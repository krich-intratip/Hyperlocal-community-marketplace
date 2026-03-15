import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Referral, ReferralStatus } from './entities/referral.entity'
import { LoyaltyService } from '../loyalty/loyalty.service'

const REFERRAL_BONUS_POINTS = 50   // referrer earns 50 pts when referred completes first order

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(Referral)
    private readonly referralRepo: Repository<Referral>,
    private readonly loyaltyService: LoyaltyService,
  ) {}

  /** Generate unique 8-char alphanumeric code for a user */
  private generateCode(userId: string): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const hash = userId.replace(/-/g, '').substring(0, 4).toUpperCase()
    let suffix = ''
    for (let i = 0; i < 4; i++) {
      suffix += chars[Math.floor(Math.random() * chars.length)]
    }
    return `CHM-${hash.substring(0, 2)}${suffix}`
  }

  /** Get or create referral code for a user */
  async getMyCode(userId: string): Promise<{ code: string; referralLink: string }> {
    // Check if user already has any referral code (as referrer)
    const existing = await this.referralRepo.findOne({ where: { referrerId: userId } })
    if (existing) {
      return { code: existing.code, referralLink: `https://chm.pages.dev/signup?ref=${existing.code}` }
    }

    const code = this.generateCode(userId)
    const referral = await this.referralRepo.save(
      this.referralRepo.create({
        referrerId: userId,
        referredId: null,
        code,
        status: 'PENDING',
        bonusAwarded: false,
        bonusPoints: REFERRAL_BONUS_POINTS,
      }),
    )
    return { code: referral.code, referralLink: `https://chm.pages.dev/signup?ref=${referral.code}` }
  }

  /** Get referral stats for a user */
  async getStats(userId: string): Promise<{
    code: string
    referralLink: string
    totalReferred: number
    completedReferrals: number
    totalBonusEarned: number
    referrals: Array<{ id: string; status: ReferralStatus; bonusPoints: number; createdAt: Date; completedAt: Date | null }>
  }> {
    const { code, referralLink } = await this.getMyCode(userId)
    const all = await this.referralRepo.find({ where: { referrerId: userId }, order: { createdAt: 'DESC' } })
    const completed = all.filter(r => r.status === 'COMPLETED')
    const totalBonusEarned = completed.filter(r => r.bonusAwarded).reduce((s, r) => s + r.bonusPoints, 0)
    return {
      code,
      referralLink,
      totalReferred: all.filter(r => r.referredId !== null).length,
      completedReferrals: completed.length,
      totalBonusEarned,
      referrals: all.filter(r => r.referredId !== null).map(r => ({
        id: r.id,
        status: r.status,
        bonusPoints: r.bonusPoints,
        createdAt: r.createdAt,
        completedAt: r.completedAt,
      })),
    }
  }

  /** Called during registration: link referral code to new user */
  async applyReferralCode(code: string, newUserId: string): Promise<void> {
    if (!code) return
    const referral = await this.referralRepo.findOne({ where: { code } })
    if (!referral) return  // invalid code → silently ignore
    if (referral.referrerId === newUserId) return  // can't refer yourself

    // Create a new referral record for this specific referrer→referred pair
    const newReferral = this.referralRepo.create({
      referrerId: referral.referrerId,
      referredId: newUserId,
      code,
      status: 'PENDING',
      bonusAwarded: false,
      bonusPoints: REFERRAL_BONUS_POINTS,
    })
    await this.referralRepo.save(newReferral)
  }

  /** Called when referred user completes their first order → award bonus to referrer */
  async awardReferralBonus(referredUserId: string, orderId: string): Promise<void> {
    const referral = await this.referralRepo.findOne({
      where: { referredId: referredUserId, status: 'PENDING', bonusAwarded: false },
    })
    if (!referral) return

    // Award bonus points to referrer
    await this.loyaltyService.awardBonus(
      referral.referrerId,
      orderId,
      referral.bonusPoints,
      `โบนัสแนะนำเพื่อน`,
    )

    referral.status = 'COMPLETED'
    referral.bonusAwarded = true
    referral.completedAt = new Date()
    await this.referralRepo.save(referral)
  }
}
