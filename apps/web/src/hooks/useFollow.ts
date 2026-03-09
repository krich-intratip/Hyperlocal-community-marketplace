'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { followApi } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

// ── Local storage key (mock persistence) ──────────────────────────────────────
const lsKey = (providerId: string) => `chm:follow:${providerId}`

// ── Query keys ────────────────────────────────────────────────────────────────
export const followKeys = {
  check: (providerId: string) => ['follow', providerId] as const,
}

// ── useFollowState — checks if current user follows a provider ─────────────────
export function useFollowState(providerId: string) {
  return useQuery({
    queryKey: followKeys.check(providerId),
    queryFn: async (): Promise<boolean> => {
      if (USE_REAL_API) {
        const res = await followApi.check(providerId)
        return res.data.data.following
      }
      // Mock: persist in localStorage
      return localStorage.getItem(lsKey(providerId)) === 'true'
    },
    staleTime: 60 * 1000,
    enabled: !!providerId,
  })
}

// ── useToggleFollow — follow/unfollow mutation ────────────────────────────────
export function useToggleFollow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      providerId,
      currentlyFollowing,
    }: {
      providerId: string
      currentlyFollowing: boolean
    }) => {
      const next = !currentlyFollowing
      if (USE_REAL_API) {
        if (currentlyFollowing) await followApi.unfollow(providerId)
        else await followApi.follow(providerId)
      } else {
        // Mock: small delay + localStorage
        await new Promise((r) => setTimeout(r, 150))
        if (next) localStorage.setItem(lsKey(providerId), 'true')
        else localStorage.removeItem(lsKey(providerId))
      }
      return next
    },
    onSuccess: (_next, { providerId }) => {
      qc.invalidateQueries({ queryKey: followKeys.check(providerId) })
    },
  })
}
