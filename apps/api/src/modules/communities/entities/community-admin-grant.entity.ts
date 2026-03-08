import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'
import { CommunityAdminGrantStatus } from '@chm/shared-types'

/**
 * Community Admin ↔ Community relationship table.
 *
 * Business rule:
 * - 1 Community Admin account CAN manage MULTIPLE communities.
 * - BUT each additional community requires a separate Super Admin approval.
 * - Each community still has its own isolated dashboard, revenue share, and provider pool.
 * - The first community is granted during the initial franchise application approval.
 * - Subsequent communities require a new request (status: PENDING → APPROVED by Super Admin).
 *
 * Contrast with Provider rule:
 * - Provider: 1 account = 1 community (hard limit, must use new account for each)
 * - Community Admin: 1 account = N communities (soft limit, Super Admin approval per community)
 */
@Entity('community_admin_grants')
@Index(['adminUserId', 'communityId'], { unique: true })
export class CommunityAdminGrant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'admin_user_id' })
  adminUserId: string

  @Column({ name: 'community_id', nullable: true })
  communityId: string | null     // null = requested but community not created yet

  @Column({ name: 'requested_location', nullable: true, type: 'text' })
  requestedLocation: string | null

  @Column({ name: 'request_reason', nullable: true, type: 'text' })
  requestReason: string | null

  @Column({
    name: 'grant_status',
    type: 'enum',
    enum: CommunityAdminGrantStatus,
    default: CommunityAdminGrantStatus.PENDING,
  })
  grantStatus: CommunityAdminGrantStatus

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedBy: string | null      // Super Admin userId who approved/rejected

  @Column({ name: 'reviewed_at', nullable: true, type: 'timestamptz' })
  reviewedAt: Date | null

  @Column({ name: 'revoke_reason', nullable: true, type: 'text' })
  revokeReason: string | null

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean             // true = first/main community from original franchise application

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
