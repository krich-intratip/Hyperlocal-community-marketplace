import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'
import { VerificationStatus, ProviderStatus } from '@chm/shared-types'

/**
 * Business rule: 1 user account = 1 provider profile = 1 community.
 * If a provider wants to operate in multiple communities they must use separate accounts.
 * Enforced at DB level via UNIQUE(user_id) and at service level via ConflictException.
 */
@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })          // ← 1 account → 1 provider profile only
  @Column({ name: 'user_id', unique: true })
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

  /**
   * Operational status — controlled by the provider themselves.
   * LEFT means they vacated this community (e.g. moved away).
   * When LEFT, the unique userId constraint is released so they can
   * re-apply to a new community with the same account.
   */
  @Column({
    name: 'provider_status',
    type: 'enum',
    enum: ProviderStatus,
    default: ProviderStatus.ACTIVE,
  })
  providerStatus: ProviderStatus

  @Column({ name: 'left_community_at', nullable: true, type: 'timestamptz' })
  leftCommunityAt: Date | null

  @Column({ name: 'left_reason', nullable: true, type: 'text' })
  leftReason: string | null

  /* ── Location / KYC fields ── */
  @Column({ name: 'address', nullable: true, type: 'text' })
  address: string | null

  @Column({ name: 'location_lat', nullable: true, type: 'double precision' })
  locationLat: number | null

  @Column({ name: 'location_lng', nullable: true, type: 'double precision' })
  locationLng: number | null

  @Column({ name: 'id_card_url', nullable: true })
  idCardUrl: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
