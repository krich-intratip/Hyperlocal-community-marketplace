'use client'
import { useQuery } from '@tanstack/react-query'
import { loyaltyApi, type LoyaltyAccount, type LoyaltyTransaction } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

// Mock data for dev mode
function buildMockAccount(): LoyaltyAccount {
  return {
    id: 'mock-loyalty-1',
    customerId: 'mock-user-1',
    points: 340,
    totalEarned: 890,
    totalRedeemed: 550,
    tier: 'SILVER',
    nextTier: 'GOLD',
    pointsToNextTier: 1110,
    redeemValue: 34,
    createdAt: new Date(Date.now() - 90 * 86400_000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function buildMockTransactions(): LoyaltyTransaction[] {
  return [
    { id: '1', customerId: 'mock-user-1', type: 'EARN',    points: 12,   balance: 340, description: 'รับแต้มจากคำสั่งซื้อ (x1.2)', orderId: 'ord-1', createdAt: new Date(Date.now() - 2 * 86400_000).toISOString() },
    { id: '2', customerId: 'mock-user-1', type: 'REDEEM',  points: -100, balance: 328, description: 'แลกแต้มลดราคา',                orderId: 'ord-2', createdAt: new Date(Date.now() - 5 * 86400_000).toISOString() },
    { id: '3', customerId: 'mock-user-1', type: 'EARN',    points: 25,   balance: 428, description: 'รับแต้มจากคำสั่งซื้อ (x1.2)', orderId: 'ord-3', createdAt: new Date(Date.now() - 8 * 86400_000).toISOString() },
    { id: '4', customerId: 'mock-user-1', type: 'EARN',    points: 8,    balance: 403, description: 'รับแต้มจากคำสั่งซื้อ (x1.2)', orderId: 'ord-4', createdAt: new Date(Date.now() - 12 * 86400_000).toISOString() },
    { id: '5', customerId: 'mock-user-1', type: 'RESTORE', points: 50,   balance: 395, description: 'คืนแต้มจากการยกเลิกคำสั่งซื้อ', orderId: 'ord-5', createdAt: new Date(Date.now() - 20 * 86400_000).toISOString() },
    { id: '6', customerId: 'mock-user-1', type: 'EARN',    points: 15,   balance: 345, description: 'รับแต้มจากคำสั่งซื้อ (x1.0)', orderId: 'ord-6', createdAt: new Date(Date.now() - 30 * 86400_000).toISOString() },
  ]
}

export function useLoyaltyAccount() {
  const user = useAuthStore(s => s.user)
  return useQuery<LoyaltyAccount>({
    queryKey: ['loyalty', 'account', user?.id],
    queryFn: async () => {
      if (!USE_REAL_API) return buildMockAccount()
      const res = await loyaltyApi.getAccount()
      return (res.data ?? res) as unknown as LoyaltyAccount
    },
    enabled: !!user,
    staleTime: 60_000,
  })
}

export function useLoyaltyTransactions(limit = 20) {
  const user = useAuthStore(s => s.user)
  return useQuery<LoyaltyTransaction[]>({
    queryKey: ['loyalty', 'transactions', user?.id, limit],
    queryFn: async () => {
      if (!USE_REAL_API) return buildMockTransactions()
      const res = await loyaltyApi.getTransactions(limit)
      return (res.data ?? res) as unknown as LoyaltyTransaction[]
    },
    enabled: !!user,
    staleTime: 60_000,
  })
}
