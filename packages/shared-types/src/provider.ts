import { VerificationStatus } from './enums'

export interface Provider {
  id: string
  userId: string
  communityId: string
  displayName: string
  bio?: string
  avatarUrl?: string
  serviceRadius?: number
  verificationStatus: VerificationStatus
  trustScore: number
  totalCompletedBookings: number
  averageRating: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProviderAvailability {
  id: string
  providerId: string
  availableDays: number[]
  startTime: string
  endTime: string
}

export interface ApplyProviderDto {
  communityId: string
  displayName: string
  bio?: string
  serviceRadius?: number
}
