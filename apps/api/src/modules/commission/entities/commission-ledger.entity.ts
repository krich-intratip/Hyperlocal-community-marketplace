import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { CommissionLedgerStatus } from '@chm/shared-types'
import { Community } from '../../communities/entities/community.entity'

/**
 * CommissionLedger
 * One record per booking that generates commission.
 * Created when payment is held; status → SETTLED on booking COMPLETED; CANCELLED on refund.
 *
 * Commission formula:
 *   commissionableAmount = booking.totalAmount - booking.shippingAmount (default 0)
 *   commissionAmount     = commissionableAmount × commissionRate / 100
 *   revenueShareAmount   = commissionAmount × revenueShareRate / 100
 */
@Entity('commission_ledger')
export class CommissionLedger {
    @PrimaryGeneratedColumn('uuid')
    id: string

    /** FK to Booking (not a TypeORM relation — avoids circular dep across modules) */
    @Column({ name: 'booking_id' })
    bookingId: string

    @Column({ name: 'community_id' })
    communityId: string

    @ManyToOne(() => Community, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'community_id' })
    community: Community

    @Column({ name: 'provider_id' })
    providerId: string

    /** Gross amount eligible for commission (excludes shipping costs) */
    @Column({ name: 'gross_amount', type: 'decimal', precision: 12, scale: 2 })
    grossAmount: number

    /** Commission rate (%) at the time of transaction — snapshot, not live */
    @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2 })
    commissionRate: number

    /** Platform commission = grossAmount × commissionRate / 100 */
    @Column({ name: 'commission_amount', type: 'decimal', precision: 12, scale: 2 })
    commissionAmount: number

    /** Revenue share rate (%) for Community Admin at the time of transaction */
    @Column({ name: 'revenue_share_rate', type: 'decimal', precision: 5, scale: 2 })
    revenueShareRate: number

    /** CA's portion = commissionAmount × revenueShareRate / 100 */
    @Column({ name: 'revenue_share_amount', type: 'decimal', precision: 12, scale: 2 })
    revenueShareAmount: number

    /** If a commission rate promotion/override was applied, record it here */
    @Column({ name: 'rate_override_id', nullable: true })
    rateOverrideId: string

    @Column({
        name: 'status',
        type: 'simple-enum',
        enum: CommissionLedgerStatus,
        default: CommissionLedgerStatus.PENDING,
    })
    status: CommissionLedgerStatus

    @Column({ name: 'transaction_date', type: 'datetime' })
    transactionDate: Date

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}
