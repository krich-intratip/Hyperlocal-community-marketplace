import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'
import { VerificationStatus } from '@chm/shared-types'

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'community_id' })
  communityId: string

  @Column({ name: 'display_name' })
  displayName: string

  @Column({ nullable: true, type: 'text' })
  bio: string

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string

  @Column({ name: 'service_radius', nullable: true, type: 'float' })
  serviceRadius: number

  @Column({
    name: 'verification_status',
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus

  @Column({ name: 'trust_score', type: 'decimal', precision: 3, scale: 2, default: 0.00 })
  trustScore: number

  @Column({ name: 'total_completed_bookings', default: 0 })
  totalCompletedBookings: number

  @Column({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, default: 0.00 })
  averageRating: number

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
