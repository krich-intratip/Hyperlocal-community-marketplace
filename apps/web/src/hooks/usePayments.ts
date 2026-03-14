'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsApi, type PaymentRecord, type PaymentMethod } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

export const paymentKeys = {
  order: (orderId: string) => ['payments', 'order', orderId] as const,
}

/** Initiate a payment — POST /payments/initiate */
export function useInitiatePayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: { orderId: string; method: PaymentMethod }) =>
      paymentsApi.initiate(dto).then((r) => r.data as unknown as PaymentRecord),
    onSuccess: (data) => {
      qc.setQueryData(paymentKeys.order(data.orderId), data)
    },
  })
}

/**
 * Poll payment status every 3 seconds.
 * Stops automatically when status is no longer PENDING.
 */
export function usePaymentStatus(orderId: string | undefined, enabled = true) {
  return useQuery<PaymentRecord | null>({
    queryKey: paymentKeys.order(orderId ?? ''),
    queryFn: async () => {
      if (!orderId) return null
      if (!USE_REAL_API) return mockPayment(orderId)
      const res = await paymentsApi.getByOrder(orderId)
      return res.data as unknown as PaymentRecord
    },
    enabled: !!orderId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (!status || status === 'PENDING') return 3000
      return false
    },
    staleTime: 0,
  })
}

/** Dev: simulate successful payment */
export function useSimulatePay() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (paymentId: string) =>
      paymentsApi.simulatePay(paymentId).then((r) => r.data as unknown as PaymentRecord),
    onSuccess: (data) => {
      qc.setQueryData(paymentKeys.order(data.orderId), data)
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

// ── Mock fallback ─────────────────────────────────────────────────────────────
function mockPayment(orderId: string): PaymentRecord {
  return {
    id: `mock-${orderId.slice(-8)}`,
    orderId,
    amount: 220,
    method: 'promptpay',
    status: 'PENDING',
    qrData: null,
    paidAt: null,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
