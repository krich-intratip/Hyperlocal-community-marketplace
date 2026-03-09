import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'
import { TrialStatus } from '@chm/shared-types'

@Entity('communities')
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Index({ unique: true })
  @Column({ unique: true })
  slug: string

  /**
   * Unique invite code for this community's franchise manager.
   * Generated once on franchise approval (e.g. MKT-BKK-001).
   * Used to build invite links: /join/{inviteCode}
   * Non-expiring as long as the admin's franchise is active.
   */
  @Index({ unique: true })
  @Column({ name: 'invite_code', unique: true, nullable: true })
  inviteCode: string

  @Column({ nullable: true, type: 'text' })
  description: string

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string

  /**
   * Primary admin of this community (from the original franchise application).
   * Additional admins are tracked via community_admin_grants table.
   * A single user can be admin of multiple communities — see CommunityAdminGrant entity.
   */
  @Column({ name: 'admin_id' })
  adminId: string

  @Column({ name: 'geo_boundary', nullable: true, type: 'text' })
  geoBoundary: string

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column({ name: 'trial_start_date', nullable: true, type: 'timestamptz' })
  trialStartDate: Date

  @Column({ name: 'trial_end_date', nullable: true, type: 'timestamptz' })
  trialEndDate: Date

  @Column({ name: 'trial_status', type: 'enum', enum: TrialStatus, default: TrialStatus.NOT_STARTED })
  trialStatus: TrialStatus

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 5.00 })
  commissionRate: number

  @Column({ name: 'revenue_share_rate', type: 'decimal', precision: 5, scale: 2, default: 40.00 })
  revenueShareRate: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
