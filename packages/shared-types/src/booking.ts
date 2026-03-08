import {
  BookingStatus, EscrowStatus, PricingType,
  DisputeStatus, PromotionType, TaxType, TaxApplyTo,
} from './enums'

/** Frozen tax rule stored inside Booking.taxSnapshot */
export interface TaxSnapshotEntry {
  taxCode: string
  taxName: string
  taxType: TaxType
  rate: number
  applyTo: TaxApplyTo
  borneBy: 'CUSTOMER' | 'PROVIDER' | 'PLATFORM'
  isInclusive: boolean
  amount: number               // คำนวณ ณ เวลา checkout
}

export interface Booking {
  id: string

  /* Parties */
  listingId: string
  customerId: string
  providerId: string
  communityId: string

  /* Scheduling */
  scheduledAt: string
  extendedDeadline?: string
  providerStartedAt?: string
  providerCompletedAt?: string
  customerConfirmedAt?: string
  autoReleaseAt?: string

  /* State */
  status: BookingStatus
  note?: string
  customerRejectReason?: string
  cancellationReason?: string

  /* Pricing */
  pricingType: PricingType
  quotedAmount: number
  adjustedAmount?: number
  adjustedReason?: string
  priceAdjustmentApprovedBy?: string
  priceAdjustmentApprovedAt?: string
  finalAmount: number

  /* Discount */
  promotionId?: string
  discountAmount: number
  discountedTotal: number

  /* Tax */
  taxSnapshot?: TaxSnapshotEntry[]
  customerTaxTotal: number
  providerTaxTotal: number

  /* Commission breakdown */
  commissionRate: number
  revenueShareRate: number
  platformFee: number
  communityAdminShare: number
  providerPayout: number

  /* Escrow */
  escrowStatus: EscrowStatus
  escrowHeldAt?: string
  escrowReleasedAt?: string
  escrowRefundedAt?: string
  refundAmount?: number

  /* Trust impact */
  trustScoreDeducted: boolean
  trustDeductionAmount?: number

  /* Ban */
  bannedBy?: string
  banReason?: string

  createdAt: string
  updatedAt: string
}

/** Immutable audit log entry */
export interface BookingTimelineEntry {
  id: string
  bookingId: string
  fromStatus?: BookingStatus
  toStatus: BookingStatus
  actorId?: string
  actorType: 'CUSTOMER' | 'PROVIDER' | 'COMMUNITY_ADMIN' | 'SUPER_ADMIN' | 'SYSTEM'
  note?: string
  snapshot?: Record<string, unknown>
  createdAt: string
}

export interface BookingDispute {
  id: string
  bookingId: string
  openedByCustomerId: string
  providerId: string
  communityAdminId?: string
  reason: string
  customerEvidenceUrls?: string    // JSON string of URL[]
  providerResponse?: string
  providerEvidenceUrls?: string
  disputeStatus: DisputeStatus
  reviewedAt?: string
  resolvedAt?: string
  resolutionNote?: string
  resolvedRefundAmount?: number
  resolvedProviderPayout?: number
  escalatedToSaAt?: string
  escalatedReason?: string
  saDecision?: string
  saDecidedAt?: string
  saUserId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBookingDto {
  listingId: string
  scheduledAt: string
  note?: string
  couponCode?: string              // กรอก coupon code ตอน checkout
}

export interface ProviderCompleteBookingDto {
  note?: string
}

export interface CustomerConfirmBookingDto {
  confirmed: boolean
  rejectReason?: string            // ถ้า confirmed=false
}

export interface ExtendBookingTimeDto {
  extendHours: number              // 6–24
}

export interface OpenDisputeDto {
  reason: string
  evidenceUrls?: string[]          // upload URLs
}

export interface ResolveDisputeDto {
  resolution: 'FOR_CUSTOMER' | 'FOR_PROVIDER' | 'PARTIAL'
  resolutionNote: string
  resolvedRefundAmount?: number
  resolvedProviderPayout?: number
}
