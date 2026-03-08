import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Community } from './entities/community.entity'
import { CommunityMember } from './entities/community-member.entity'
import { MembershipRole, TrialStatus } from '@chm/shared-types'

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
    @InjectRepository(CommunityMember)
    private readonly memberRepo: Repository<CommunityMember>,
  ) {}

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
}
