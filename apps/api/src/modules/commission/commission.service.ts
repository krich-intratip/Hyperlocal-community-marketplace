import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CommissionLedger } from './entities/commission-ledger.entity'
import { CommissionRateOverride } from './entities/commission-rate-override.entity'
import { CommissionLedgerStatus } from '@chm/shared-types'

@Injectable()
export class CommissionService {
    constructor(
        @InjectRepository(CommissionLedger)
        private readonly ledgerRepo: Repository<CommissionLedger>,

        @InjectRepository(CommissionRateOverride)
        private readonly overrideRepo: Repository<CommissionRateOverride>,
    ) { }

    /**
     * Get the effective commission rate for a given provider+community combination at a specific time.
     *
     * Priority (most specific wins):
     *   1. Override matching communityId + providerType
     *   2. Override matching communityId only (any providerType)
     *   3. Override with communityId=null (global)
     *   4. Community.commissionRate (caller provides fallback)
     */
    async getEffectiveRate(
        communityId: string,
        providerType: string | null,
        at: Date,
        fallbackRate: number,
    ): Promise<{ rate: number; overrideId: string | undefined }> {
        const active = await this.overrideRepo
            .createQueryBuilder('o')
            .where('o.isActive = true')
            .andWhere('o.validFrom <= :at', { at })
            .andWhere('(o.validTo IS NULL OR o.validTo >= :at)', { at })
            .andWhere(
                '(o.communityId = :communityId OR o.communityId IS NULL)',
                { communityId },
            )
            .orderBy(
                `CASE
          WHEN o.communityId = :communityId AND o.providerType = :providerType THEN 1
          WHEN o.communityId = :communityId AND o.providerType IS NULL THEN 2
          WHEN o.communityId IS NULL AND o.providerType = :providerType THEN 3
          ELSE 4
        END`,
                'ASC',
            )
            .setParameters({ communityId, providerType })
            .getOne()

        if (active) return { rate: Number(active.overrideRate), overrideId: active.id }
        return { rate: fallbackRate, overrideId: undefined }
    }

    /**
     * Create a CommissionLedger record when a booking payment is held.
     * shippingAmount is excluded from the commissionable base.
     *
     * @param bookingId - UUID of the booking
     * @param communityId - UUID of the community
     * @param providerId - UUID of the provider
     * @param grossAmount - discountedTotal from the Booking (post-discount, pre-commission)
     * @param shippingAmount - shipping fee excluded from commission (default 0)
     * @param communityCommissionRate - fallback rate from community.commissionRate
     * @param communityRevenueShareRate - fallback rate from community.revenueShareRate
     * @param providerType - MarketplaceCategory string for override lookup
     * @param transactionDate - when the transaction occurred
     */
    async createForBooking(params: {
        bookingId: string
        communityId: string
        providerId: string
        grossAmount: number
        shippingAmount?: number
        communityCommissionRate: number
        communityRevenueShareRate: number
        providerType?: string
        transactionDate: Date
    }): Promise<CommissionLedger> {
        const {
            bookingId, communityId, providerId,
            grossAmount, shippingAmount = 0,
            communityCommissionRate, communityRevenueShareRate,
            providerType, transactionDate,
        } = params

        const commissionableAmount = grossAmount - shippingAmount
        const { rate: commissionRate, overrideId: rateOverrideId } = await this.getEffectiveRate(
            communityId, providerType ?? null, transactionDate, communityCommissionRate,
        )

        const commissionAmount = parseFloat(
            ((commissionableAmount * commissionRate) / 100).toFixed(2),
        )
        const revenueShareAmount = parseFloat(
            ((commissionAmount * communityRevenueShareRate) / 100).toFixed(2),
        )

        const entry = this.ledgerRepo.create({
            bookingId, communityId, providerId,
            grossAmount: commissionableAmount,
            commissionRate,
            commissionAmount,
            revenueShareRate: communityRevenueShareRate,
            revenueShareAmount,
            rateOverrideId,
            status: CommissionLedgerStatus.PENDING,
            transactionDate,
        })

        return this.ledgerRepo.save(entry)
    }

    /** Mark a ledger entry as SETTLED (called when booking reaches COMPLETED) */
    async settle(bookingId: string): Promise<void> {
        await this.ledgerRepo.update(
            { bookingId, status: CommissionLedgerStatus.PENDING },
            { status: CommissionLedgerStatus.SETTLED },
        )
    }

    /** Mark a ledger entry as CANCELLED (called when booking is refunded) */
    async cancel(bookingId: string): Promise<void> {
        await this.ledgerRepo.update(
            { bookingId },
            { status: CommissionLedgerStatus.CANCELLED },
        )
    }

    /**
     * Aggregate settled commission for a community during a period (for payout generation).
     */
    async aggregateForPeriod(communityId: string, from: Date, to: Date) {
        const result = await this.ledgerRepo
            .createQueryBuilder('l')
            .select('SUM(l.commissionAmount)', 'totalCommission')
            .addSelect('SUM(l.revenueShareAmount)', 'revenueShareAmount')
            .addSelect('COUNT(l.id)', 'transactionCount')
            .where('l.communityId = :communityId', { communityId })
            .andWhere('l.status = :status', { status: CommissionLedgerStatus.SETTLED })
            .andWhere('l.transactionDate BETWEEN :from AND :to', { from, to })
            .getRawOne()

        return {
            totalCommission: parseFloat(result?.totalCommission ?? '0'),
            revenueShareAmount: parseFloat(result?.revenueShareAmount ?? '0'),
            transactionCount: parseInt(result?.transactionCount ?? '0', 10),
        }
    }

    /** List all active overrides (for Super Admin dashboard) */
    async listOverrides(communityId?: string) {
        const qb = this.overrideRepo
            .createQueryBuilder('o')
            .where('o.isActive = true')
            .orderBy('o.createdAt', 'DESC')

        if (communityId) qb.andWhere('o.communityId = :communityId', { communityId })
        return qb.getMany()
    }

    /** Create a new commission rate override (Super Admin only) */
    async createOverride(dto: {
        communityId?: string
        providerType?: string
        overrideRate: number
        validFrom: Date
        validTo?: Date
        reason?: string
        createdBy: string
    }): Promise<CommissionRateOverride> {
        const override = this.overrideRepo.create({
            ...dto,
            isActive: true,
        })
        return this.overrideRepo.save(override)
    }

    /** Deactivate an override */
    async deactivateOverride(id: string): Promise<void> {
        const override = await this.overrideRepo.findOne({ where: { id } })
        if (!override) throw new NotFoundException(`Override ${id} not found`)
        override.isActive = false
        await this.overrideRepo.save(override)
    }
}
