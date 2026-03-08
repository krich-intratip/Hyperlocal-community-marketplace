import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, Index,
} from 'typeorm'
import { BookingStatus } from '@chm/shared-types'

/**
 * BookingTimeline — immutable audit log of every state transition.
 *
 * Every time booking.status changes, a new timeline entry is appended.
 * Never updated, never deleted. Used for:
 *   - Audit trail (accounting, disputes)
 *   - Dashboard analytics
 *   - Trust score calculation
 *   - Fraud detection
 */
@Entity('booking_timeline')
@Index(['bookingId'])
@Index(['actorId'])
export class BookingTimeline {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'booking_id' })
  bookingId: string

  @Column({ name: 'from_status', type: 'enum', enum: BookingStatus, nullable: true })
  fromStatus: BookingStatus | null    // null = initial creation

  @Column({ name: 'to_status', type: 'enum', enum: BookingStatus })
  toStatus: BookingStatus

  /**
   * Who triggered this transition.
   * System-triggered actions (auto-release, no-show timer) use actorType='SYSTEM'
   */
  @Column({ name: 'actor_id', nullable: true })
  actorId: string | null             // userId (Customer / Provider / CA / SA)

  @Column({
    name: 'actor_type',
    type: 'enum',
    enum: ['CUSTOMER', 'PROVIDER', 'COMMUNITY_ADMIN', 'SUPER_ADMIN', 'SYSTEM'],
    default: 'SYSTEM',
  })
  actorType: 'CUSTOMER' | 'PROVIDER' | 'COMMUNITY_ADMIN' | 'SUPER_ADMIN' | 'SYSTEM'

  @Column({ nullable: true, type: 'text' })
  note: string | null                // เหตุผล / หมายเหตุ

  /** JSON snapshot ของ booking ณ ขณะนั้น (optional, for deep audit) */
  @Column({ name: 'snapshot', nullable: true, type: 'jsonb' })
  snapshot: Record<string, unknown> | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
