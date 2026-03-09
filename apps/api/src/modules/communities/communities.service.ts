import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Community } from './entities/community.entity'
import { CommunityMember } from './entities/community-member.entity'
import { MembershipRole, TrialStatus, MemberApprovalStatus } from '@chm/shared-types'

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
    @InjectRepository(CommunityMember)
    private readonly memberRepo: Repository<CommunityMember>,
  ) { }

  findAll() {
    return this.communityRepo.find({ where: { isActive: true } })
  }

  async findById(id: string) {
    const community = await this.communityRepo.findOne({ where: { id, isActive: true } })
    if (!community) throw new NotFoundException('Community not found')
    return community
  }

  async join(communityId: string, userId: string) {
    const community = await this.findById(communityId)
    const existing = await this.memberRepo.findOne({ where: { communityId, userId } })
    if (existing) throw new ConflictException('Already a member of this community')
    const member = this.memberRepo.create({ communityId: community.id, userId, role: MembershipRole.MEMBER })
    return this.memberRepo.save(member)
  }

  async leave(communityId: string, userId: string) {
    await this.memberRepo.delete({ communityId, userId })
    return { success: true }
  }

  getMembers(communityId: string) {
    return this.memberRepo.find({ where: { communityId } })
  }

  async isInTrialPeriod(communityId: string): Promise<boolean> {
    const community = await this.findById(communityId)
    if (community.trialStatus !== TrialStatus.ACTIVE) return false
    const now = new Date()
    if (community.trialStartDate && community.trialEndDate) {
      return now >= community.trialStartDate && now <= community.trialEndDate
    }
    return false
  }

  async setTrialPeriod(communityId: string, startDate: Date, endDate: Date) {
    await this.communityRepo.update(communityId, {
      trialStartDate: startDate,
      trialEndDate: endDate,
      trialStatus: TrialStatus.ACTIVE,
    })
    return this.findById(communityId)
  }

  /* ─── Invite Link System ────────────────────────────────────────── */

  /** Generate a new unique 10-char alphanumeric invite code */
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    return Array.from({ length: 10 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join('')
  }

  /**
   * Ensure a community has an invite code; generate one if missing.
   * Safe to call multiple times (idempotent).
   */
  async ensureInviteCode(communityId: string): Promise<string> {
    const community = await this.findById(communityId)
    if (community.inviteCode) return community.inviteCode

    let code: string
    let attempts = 0
    do {
      code = this.generateInviteCode()
      attempts++
      if (attempts > 10) throw new Error('Failed to generate unique invite code')
    } while (await this.communityRepo.findOne({ where: { inviteCode: code } }))

    await this.communityRepo.update(communityId, { inviteCode: code })
    return code
  }

  /**
   * GET /communities/join/:code (public)
   * Returns community preview for invite landing page.
   */
  async getByInviteCode(code: string) {
    const community = await this.communityRepo.findOne({
      where: { inviteCode: code, isActive: true },
    })
    if (!community) throw new NotFoundException('Invite code is invalid or the community is no longer active')
    return {
      id: community.id,
      name: community.name,
      slug: community.slug,
      logoUrl: community.logoUrl,
      description: community.description,
      isActive: community.isActive,
    }
  }

  /**
   * Called by CA to fetch their own invite code (generates one if not set).
   * Returns: { inviteCode, communityName }
   */
  async getInviteCodeForAdmin(adminUserId: string) {
    const membership = await this.memberRepo.findOne({
      where: { userId: adminUserId, role: MembershipRole.ADMIN },
      relations: ['community'],
    })
    if (!membership) throw new NotFoundException('No admin community found for this user')
    const inviteCode = await this.ensureInviteCode(membership.communityId)
    return {
      inviteCode,
      communityName: membership.community?.name ?? '',
    }
  }

  /**
   * Get all PENDING provider members in the CA's community.
   */
  async getPendingMembers(adminUserId: string) {
    const membership = await this.memberRepo.findOne({
      where: { userId: adminUserId, role: MembershipRole.ADMIN },
    })
    if (!membership) throw new NotFoundException('No admin community found for this user')
    return this.memberRepo.find({
      where: {
        communityId: membership.communityId,
        approvalStatus: MemberApprovalStatus.PENDING,
      },
      order: { joinedAt: 'ASC' },
    })
  }

  /**
   * CA approves a pending provider member.
   */
  async approveMember(memberId: string, approvedByUserId: string) {
    const member = await this.memberRepo.findOne({ where: { id: memberId } })
    if (!member) throw new NotFoundException('Member not found')
    if (member.approvalStatus !== MemberApprovalStatus.PENDING) {
      throw new ConflictException('Member is not in PENDING status')
    }
    member.approvalStatus = MemberApprovalStatus.APPROVED
    member.approvedBy = approvedByUserId
    member.approvedAt = new Date()
    return this.memberRepo.save(member)
  }

  /**
   * CA rejects a pending provider member.
   */
  async rejectMember(memberId: string, rejectedByUserId: string) {
    const member = await this.memberRepo.findOne({ where: { id: memberId } })
    if (!member) throw new NotFoundException('Member not found')
    if (member.approvalStatus !== MemberApprovalStatus.PENDING) {
      throw new ConflictException('Member is not in PENDING status')
    }
    member.approvalStatus = MemberApprovalStatus.REJECTED
    member.approvedBy = rejectedByUserId
    member.approvedAt = new Date()
    return this.memberRepo.save(member)
  }
}
