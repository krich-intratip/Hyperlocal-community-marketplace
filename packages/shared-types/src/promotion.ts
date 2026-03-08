import { PromotionType, PromotionStatus } from './enums'

export interface Promotion {
  id: string
  providerId?: string
  communityId: string
  approvedByCaId?: string

  title: string
  description?: string
  bannerImageUrl?: string
  promotionType: PromotionType

  discountValue: number
  maxDiscountAmount?: number
  minOrderAmount?: number

  couponCode?: string
  applicableCategories?: string    // JSON array of MarketplaceCategory
  applicableListingIds?: string    // JSON array of listing UUIDs

  validFrom: string
  validTo: string
  usageLimit?: number
  usageLimitPerCustomer?: number
  usedCount: number

  promotionStatus: PromotionStatus
  rejectionReason?: string
  approvedAt?: string

  isBroadcast: boolean
  broadcastAt?: string
  displayOrder: number

  createdAt: string
  updatedAt: string
}

export interface CreatePromotionDto {
  title: string
  description?: string
  bannerImageUrl?: string
  promotionType: PromotionType
  discountValue: number
  maxDiscountAmount?: number
  minOrderAmount?: number
  couponCode?: string
  applicableCategories?: string[]
  applicableListingIds?: string[]
  validFrom: string
  validTo: string
  usageLimit?: number
  usageLimitPerCustomer?: number
}

export interface ApprovePromotionDto {
  approved: boolean
  rejectionReason?: string
}

export interface BroadcastPromotionDto {
  displayOrder?: number
}

/** Summary card shown on community landing page */
export interface PromotionBroadcastCard {
  id: string
  title: string
  description?: string
  bannerImageUrl?: string
  promotionType: PromotionType
  discountValue: number
  maxDiscountAmount?: number
  minOrderAmount?: number
  couponCode?: string            // แสดงต่อเมื่อ type = COUPON_CODE
  validTo: string
  providerDisplayName: string
  providerAvatarUrl?: string
  displayOrder: number
}
