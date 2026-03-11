import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn, Unique,
} from 'typeorm'
import { MembershipRole, MemberApprovalStatus } from '@chm/shared-types'
import { Community } from './community.entity'

@Entity('community_members')
@Unique(['userId', 'communityId'])
export class CommunityMember {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'community_id' })
  communityId: string

  @ManyToOne(() => Community)
  @JoinColumn({ name: 'community_id' })
  community: Community

  @Column({ type: 'simple-enum', enum: MembershipRole, default: MembershipRole.MEMBER })
  role: MembershipRole

  /**
   * The invite code used when this member joined (null = signed up directly).
   * Links back to Community.inviteCode of the inviting franchise manager.
   */
  @Column({ name: 'invited_by_code', nullable: true })
  invitedByCode: string

  /**
   * Approval status for providers/traders joining this community.
   * Customers are auto-approved (APPROVED on signup).
   * Providers start as PENDING and require CA or Super Admin approval.
   */
  @Column({
    name: 'approval_status',
    type: 'simple-enum',
    enum: MemberApprovalStatus,
    default: MemberApprovalStatus.PENDING,
  })
  approvalStatus: MemberApprovalStatus

  /** userId of the CA or Super Admin who approved/rejected this member */
  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string

  @Column({ name: 'approved_at', nullable: true, type: 'datetime' })
  approvedAt: Date

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date
}
