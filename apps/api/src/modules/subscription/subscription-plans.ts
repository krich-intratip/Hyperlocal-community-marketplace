import { SubscriptionTier } from '@chm/shared-types'

export interface PlanConfig {
  tier: SubscriptionTier
  nameEN: string
  nameTH: string
  priceMonthlyTHB: number
  maxListings: number
  maxImages: number
  featuredSlots: number       // number of featured/boosted listings
  analyticsAccess: boolean
  prioritySupport: boolean
  customBranding: boolean
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, PlanConfig> = {
  [SubscriptionTier.FREE]: {
    tier: SubscriptionTier.FREE,
    nameEN: 'Free',
    nameTH: 'ฟรี',
    priceMonthlyTHB: 0,
    maxListings: 5,
    maxImages: 3,
    featuredSlots: 0,
    analyticsAccess: false,
    prioritySupport: false,
    customBranding: false,
  },
  [SubscriptionTier.BASIC]: {
    tier: SubscriptionTier.BASIC,
    nameEN: 'Basic',
    nameTH: 'พื้นฐาน',
    priceMonthlyTHB: 299,
    maxListings: 20,
    maxImages: 8,
    featuredSlots: 2,
    analyticsAccess: true,
    prioritySupport: false,
    customBranding: false,
  },
  [SubscriptionTier.PRO]: {
    tier: SubscriptionTier.PRO,
    nameEN: 'Pro',
    nameTH: 'โปร',
    priceMonthlyTHB: 699,
    maxListings: 100,
    maxImages: 20,
    featuredSlots: 10,
    analyticsAccess: true,
    prioritySupport: true,
    customBranding: false,
  },
  [SubscriptionTier.ENTERPRISE]: {
    tier: SubscriptionTier.ENTERPRISE,
    nameEN: 'Enterprise',
    nameTH: 'องค์กร',
    priceMonthlyTHB: 1999,
    maxListings: -1,          // unlimited (-1 = unlimited)
    maxImages: -1,
    featuredSlots: -1,
    analyticsAccess: true,
    prioritySupport: true,
    customBranding: true,
  },
}
