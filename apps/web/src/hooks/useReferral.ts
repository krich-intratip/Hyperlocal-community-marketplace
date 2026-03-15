'use client'
import { useQuery } from '@tanstack/react-query'
import { referralApi, type ReferralStats } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

function buildMockStats(): ReferralStats {
  return {
    code: 'CHM-AB4X',
    referralLink: 'https://chm.pages.dev/signup?ref=CHM-AB4X',
    totalReferred: 3,
    completedReferrals: 2,
    totalBonusEarned: 100,
    referrals: [
      { id: '1', status: 'COMPLETED', bonusPoints: 50, createdAt: new Date(Date.now() - 10 * 86400_000).toISOString(), completedAt: new Date(Date.now() - 8 * 86400_000).toISOString() },
      { id: '2', status: 'COMPLETED', bonusPoints: 50, createdAt: new Date(Date.now() - 20 * 86400_000).toISOString(), completedAt: new Date(Date.now() - 18 * 86400_000).toISOString() },
      { id: '3', status: 'PENDING',   bonusPoints: 50, createdAt: new Date(Date.now() - 3 * 86400_000).toISOString(),  completedAt: null },
    ],
  }
}

export function useReferralStats() {
  const user = useAuthStore(s => s.user)
  return useQuery<ReferralStats>({
    queryKey: ['referral', 'stats', user?.id],
    queryFn: async () => {
      if (!USE_REAL_API) return buildMockStats()
      const res = await referralApi.getStats()
      return (res.data ?? res) as unknown as ReferralStats
    },
    enabled: !!user,
    staleTime: 60_000,
  })
}
