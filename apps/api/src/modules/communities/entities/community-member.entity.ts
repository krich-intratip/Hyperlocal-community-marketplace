import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn, Unique,
} from 'typeorm'
import { MembershipRole } from '@chm/shared-types'
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

  @Column({ type: 'enum', enum: MembershipRole, default: MembershipRole.MEMBER })
  role: MembershipRole

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date
}
