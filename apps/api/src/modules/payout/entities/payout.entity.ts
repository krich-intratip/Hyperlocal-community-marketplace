import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { PayoutStatus } from '@chm/shared-types'
import { Community } from '../../communities/entities/community.entity'

/**
 * Payout
 * One record per Community Admin per calendar month.
 * Generated automatically by a cron job on the 1st of each month (DRAFT).
 * Super Admin reviews → APPROVED → PROCESSING → PAID.
 */
@Entity('payouts')
export class Payout {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'community_id' })
    communityId: string

    @ManyToOne(() => Community, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'community_id' })
    community: Community

    /** Billing period in YYYY-MM format (e.g. "2026-03") */
    @Column({ name: 'period', length: 7 })
    period: string

    /** Sum of all settled commissionAmount for this community in the period */
    @Column({ name: 'total_commission', type: 'decimal', precision: 12, scale: 2, default: 0 })
    totalCommission: number

    /** 40% of totalCommission — the amount actually paid to the CA */
    @Column({ name: 'revenue_share_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    revenueShareAmount: number

    @Column({ name: 'transaction_count', type: 'int', default: 0 })
    transactionCount: number

    @Column({
        name: 'status',
        type: 'enum',
        enum: PayoutStatus,
        default: PayoutStatus.DRAFT,
    })
    status: PayoutStatus

    /** Super Admin userId who approved this payout */
    @Column({ name: 'approved_by', nullable: true })
    approvedBy: string

    @Column({ name: 'approved_at', nullable: true, type: 'timestamptz' })
    approvedAt: Date

    @Column({ name: 'paid_at', nullable: true, type: 'timestamptz' })
    paidAt: Date

    /** Reference from the payment gateway (e.g. bank transfer ref, slip no.) */
    @Column({ name: 'payment_reference', nullable: true })
    paymentReference: string

    /** URL of uploaded payment evidence (bank slip / screenshot) stored in cloud storage */
    @Column({ name: 'payment_evidence_url', nullable: true })
    paymentEvidenceUrl: string

    @Column({ name: 'notes', nullable: true, type: 'text' })
    notes: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}
