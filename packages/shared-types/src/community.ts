import { MembershipRole, TrialStatus } from './enums'

export interface Community {
  id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  adminId: string
  geoBoundary?: string
  isActive: boolean
  trialStartDate?: string
  trialEndDate?: string
  trialStatus: TrialStatus
  commissionRate: number
  revenueShareRate: number
  createdAt: string
  updatedAt: string
}

export interface CommunityMember {
  id: string
  userId: string
  communityId: string
  role: MembershipRole
  joinedAt: string
}

export interface CreateCommunityDto {
  name: string
  slug: string
  description?: string
  geoBoundary?: string
  commissionRate?: number
  revenueShareRate?: number
  trialStartDate?: string
  trialEndDate?: string
}
