import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'
import { VerificationStatus, ProviderStatus } from '@chm/shared-types'

/**
 * Store profile entity. 1 user can own multiple store profiles across communities.
 * communityId = the store's main market (first/primary branch).
 * Additional markets are tracked via StoreMarket junction table.
 */
@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
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
    type: 'simple-enum',
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
    type: 'simple-enum',
    enum: ProviderStatus,
    default: ProviderStatus.ACTIVE,
  })
  providerStatus: ProviderStatus

  @Column({ name: 'left_community_at', nullable: true, type: 'datetime' })
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

  @Column({ name: 'id_card_url', nullable: true, type: 'text' })
  idCardUrl: string | null

  @Column({ name: 'business_template_code', nullable: true, type: 'text' })
  businessTemplateCode: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
