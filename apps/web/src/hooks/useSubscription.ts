'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi, PlanConfig, ProviderSubscription, SubscriptionTier } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

const MOCK_PLANS: PlanConfig[] = [
  { tier: 'FREE', nameEN: 'Free', nameTH: 'ฟรี', priceMonthlyTHB: 0, maxListings: 5, maxImages: 3, featuredSlots: 0, analyticsAccess: false, prioritySupport: false, customBranding: false },
  { tier: 'BASIC', nameEN: 'Basic', nameTH: 'พื้นฐาน', priceMonthlyTHB: 299, maxListings: 20, maxImages: 8, featuredSlots: 2, analyticsAccess: true, prioritySupport: false, customBranding: false },
  { tier: 'PRO', nameEN: 'Pro', nameTH: 'โปร', priceMonthlyTHB: 699, maxListings: 100, maxImages: 20, featuredSlots: 10, analyticsAccess: true, prioritySupport: true, customBranding: false },
  { tier: 'ENTERPRISE', nameEN: 'Enterprise', nameTH: 'องค์กร', priceMonthlyTHB: 1999, maxListings: -1, maxImages: -1, featuredSlots: -1, analyticsAccess: true, prioritySupport: true, customBranding: true },
]

const MOCK_SUBSCRIPTION: ProviderSubscription = {
  id: 'sub-mock-1',
  providerId: 'provider-mock-1',
  tier: 'FREE',
  startsAt: new Date().toISOString(),
  expiresAt: null,
  priceTHB: 0,
  isActive: true,
  autoRenew: false,
  cancelledAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function usePlans() {
  return useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_PLANS
      const res = await subscriptionApi.getPlans()
      return res.data
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useMySubscription() {
  const user = useAuthStore(s => s.user)
  return useQuery({
    queryKey: ['subscription', 'me', user?.id],
    queryFn: async () => {
      if (!USE_REAL_API || !user) return MOCK_SUBSCRIPTION
      const res = await subscriptionApi.getMySubscription()
      return res.data
    },
    enabled: !!user,
  })
}

export function useCancelSubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => subscriptionApi.cancel(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscription'] }),
  })
}

export function useAdminSetTier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ providerId, tier, months }: { providerId: string; tier: SubscriptionTier; months?: number }) =>
      subscriptionApi.adminSetTier(providerId, tier, months),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscription'] }),
  })
}
