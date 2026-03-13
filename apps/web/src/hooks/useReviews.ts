'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '@/lib/api'
import type { CreateReviewDto } from '@/types'
import { bookingKeys } from '@/hooks/useBookings'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

// ── Query keys ────────────────────────────────────────────────────────────────

export const reviewKeys = {
  byBooking:      (bookingId: string)  => ['reviews', 'booking', bookingId]             as const,
  byProvider:     (providerId: string) => ['reviews', 'provider', providerId]            as const,
  byProviderMgmt: (providerId: string) => ['reviews', 'provider', providerId, 'manage'] as const,
  providerStats:  (providerId: string) => ['reviews', 'provider', providerId, 'stats']  as const,
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Check if a review already exists for a specific booking */
export function useBookingReview(bookingId: string) {
  return useQuery({
    queryKey: reviewKeys.byBooking(bookingId),
    queryFn: async () => {
      if (!USE_REAL_API || !bookingId) return null
      const res = await reviewsApi.getByBooking(bookingId)
      return res.data.data ?? null
    },
    enabled: !!bookingId && USE_REAL_API,
    staleTime: 60 * 1000,
  })
}

/** List visible reviews for a provider — public, PDPA-safe (used on public profile page) */
export function useProviderReviews(providerId: string) {
  return useQuery({
    queryKey: reviewKeys.byProvider(providerId),
    queryFn: async () => {
      if (!USE_REAL_API || !providerId) return []
      const res = await reviewsApi.listByProvider(providerId)
      return res.data.data ?? []
    },
    enabled: !!providerId && USE_REAL_API,
    staleTime: 60 * 1000,
  })
}

/**
 * RV-2: List ALL reviews (visible + hidden) for provider dashboard management.
 * Uses the authenticated manage endpoint.
 */
export function useProviderReviewsManage(providerId: string) {
  return useQuery({
    queryKey: reviewKeys.byProviderMgmt(providerId),
    queryFn: async () => {
      if (!USE_REAL_API || !providerId) return []
      const res = await reviewsApi.listByProviderManage(providerId)
      return res.data.data ?? []
    },
    enabled: !!providerId && USE_REAL_API,
    staleTime: 30 * 1000,
  })
}

/** Get provider's aggregate review stats (includes transparencyScore) */
export function useProviderReviewStats(providerId: string) {
  return useQuery({
    queryKey: reviewKeys.providerStats(providerId),
    queryFn: async () => {
      if (!USE_REAL_API || !providerId) return {
        averageRating: 0, totalReviews: 0, visibleReviews: 0, transparencyScore: 100,
      }
      const res = await reviewsApi.getProviderStats(providerId)
      return res.data.data ?? {
        averageRating: 0, totalReviews: 0, visibleReviews: 0, transparencyScore: 100,
      }
    },
    enabled: !!providerId && USE_REAL_API,
    staleTime: 2 * 60 * 1000,
  })
}

/** Submit a review for a completed booking */
export function useSubmitReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateReviewDto) => {
      if (USE_REAL_API) {
        const res = await reviewsApi.create(dto)
        return res.data.data
      }
      await new Promise((r) => setTimeout(r, 600))
      return null
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: bookingKeys.all })
      qc.invalidateQueries({ queryKey: reviewKeys.byBooking(variables.bookingId) })
    },
  })
}

/** Provider replies to a review */
export function useReviewReply() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      replyText,
      providerId,
    }: {
      id: string
      replyText: string
      providerId: string
    }) => {
      if (USE_REAL_API) {
        await reviewsApi.reply(id, replyText)
      } else {
        await new Promise((r) => setTimeout(r, 400))
      }
      return { id, replyText, providerId }
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: reviewKeys.byProvider(variables.providerId) })
      qc.invalidateQueries({ queryKey: reviewKeys.byProviderMgmt(variables.providerId) })
    },
  })
}

/**
 * RV-2: Provider sets a review's visibility (approve = true / hide = false).
 * On success, invalidates manage list + public list + stats.
 */
export function useSetReviewVisibility() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      isVisible,
      providerId,
    }: {
      id: string
      isVisible: boolean
      providerId: string
    }) => {
      if (USE_REAL_API) {
        const res = await reviewsApi.setVisibility(id, isVisible)
        return res.data
      }
      await new Promise((r) => setTimeout(r, 300))
      return { success: true, isVisible }
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: reviewKeys.byProviderMgmt(variables.providerId) })
      qc.invalidateQueries({ queryKey: reviewKeys.byProvider(variables.providerId) })
      qc.invalidateQueries({ queryKey: reviewKeys.providerStats(variables.providerId) })
    },
  })
}
