import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Cron } from '@nestjs/schedule'
import { Payout } from './entities/payout.entity'
import { PayoutStatus } from '@chm/shared-types'
import { CommissionService } from '../commission/commission.service'
import { Community } from '../communities/entities/community.entity'

@Injectable()
export class PayoutService {
    constructor(
        @InjectRepository(Payout)
        private readonly payoutRepo: Repository<Payout>,

        @InjectRepository(Community)
        private readonly communityRepo: Repository<Community>,

        private readonly commissionService: CommissionService,
    ) { }

    /**
   * Generate DRAFT payout records for all active communities based on the previous month.
   * Runs automatically at 00:05 on the 1st of each month.
   */
    @Cron('5 0 1 * *')
    async generateMonthlyPayouts(): Promise<void> {
        const now = new Date()
        const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
        const month = now.getMonth() === 0 ? 12 : now.getMonth()
        const period = `${year}-${String(month).padStart(2, '0')}`

        const from = new Date(year, month - 1, 1)
        const to = new Date(year, month, 0, 23, 59, 59, 999)

        const communities = await this.communityRepo.find({ where: { isActive: true } })

        for (const community of communities) {
            // Skip if payout already created for this period+community
            const existing = await this.payoutRepo.findOne({
                where: { communityId: community.id, period },
            })
            if (existing) continue

            const { totalCommission, revenueShareAmount, transactionCount } =
                await this.commissionService.aggregateForPeriod(community.id, from, to)

            if (transactionCount === 0) continue // No activity — skip payout record

            const payout = this.payoutRepo.create({
                communityId: community.id,
                period,
                totalCommission,
                revenueShareAmount,
                transactionCount,
                status: PayoutStatus.DRAFT,
            })
            await this.payoutRepo.save(payout)
        }
    }

    /** List all payout records — Super Admin view */
    async findAll(filters?: {
        status?: PayoutStatus
        period?: string
        communityId?: string
    }) {
        const qb = this.payoutRepo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.community', 'community')
            .orderBy('p.period', 'DESC')
            .addOrderBy('p.createdAt', 'DESC')

        if (filters?.status) qb.andWhere('p.status = :status', { status: filters.status })
        if (filters?.period) qb.andWhere('p.period = :period', { period: filters.period })
        if (filters?.communityId) qb.andWhere('p.communityId = :communityId', { communityId: filters.communityId })

        return qb.getMany()
    }

    /** Get payout history for a specific community — CA view */
    async findByCommunity(communityId: string) {
        return this.payoutRepo.find({
            where: { communityId },
            order: { period: 'DESC' },
        })
    }

    /** Super Admin: approve a payout */
    async approve(id: string, approvedBy: string): Promise<Payout> {
        const payout = await this.payoutRepo.findOne({ where: { id } })
        if (!payout) throw new NotFoundException(`Payout ${id} not found`)
        if (payout.status !== PayoutStatus.DRAFT && payout.status !== PayoutStatus.PENDING_APPROVAL) {
            throw new ConflictException(`Payout is already in status: ${payout.status}`)
        }
        payout.status = PayoutStatus.APPROVED
        payout.approvedBy = approvedBy
        payout.approvedAt = new Date()
        return this.payoutRepo.save(payout)
    }

    /** Super Admin: mark as paid with evidence */
    async markPaid(id: string, dto: {
        paymentReference: string
        paymentEvidenceUrl?: string
        notes?: string
    }): Promise<Payout> {
        const payout = await this.payoutRepo.findOne({ where: { id } })
        if (!payout) throw new NotFoundException(`Payout ${id} not found`)
        if (payout.status !== PayoutStatus.APPROVED) {
            throw new ConflictException(`Payout must be APPROVED before marking as paid`)
        }
        payout.status = PayoutStatus.PAID
        payout.paidAt = new Date()
        payout.paymentReference = dto.paymentReference
        if (dto.paymentEvidenceUrl) payout.paymentEvidenceUrl = dto.paymentEvidenceUrl
        if (dto.notes) payout.notes = dto.notes
        return this.payoutRepo.save(payout)
    }

    async findOne(id: string): Promise<Payout> {
        const payout = await this.payoutRepo.findOne({
            where: { id },
            relations: ['community'],
        })
        if (!payout) throw new NotFoundException(`Payout ${id} not found`)
        return payout
    }
}
