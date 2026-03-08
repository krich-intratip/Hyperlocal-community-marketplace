import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'
import { BookingStatus, PaymentStatus } from '@chm/shared-types'

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'listing_id' })
  listingId: string

  @Column({ name: 'customer_id' })
  customerId: string

  @Column({ name: 'provider_id' })
  providerId: string

  @Column({ name: 'community_id' })
  communityId: string

  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  scheduledAt: Date

  @Column({ nullable: true, type: 'text' })
  note: string

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number

  @Column({ name: 'commission_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  commissionAmount: number

  @Column({ name: 'revenue_share_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  revenueShareAmount: number

  @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
