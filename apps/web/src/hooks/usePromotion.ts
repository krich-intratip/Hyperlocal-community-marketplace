'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listingsApi } from '@/lib/api'

export function useSetPromotion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      listingId,
      discountPercent,
      discountEndsAt,
    }: {
      listingId: string
      discountPercent: number | null
      discountEndsAt: string | null
    }) => listingsApi.setPromotion(listingId, { discountPercent, discountEndsAt }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}
