'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { recommendationsApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import { useWishlistStore } from '@/store/wishlist.store'
import type { MockListing } from '@/lib/mock-listings'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

// ── Types ──────────────────────────────────────────────────────────────────────

export type RecommendationReason = 'based_on_orders' | 'based_on_wishlist' | 'popular'

export interface RecommendationsResult {
  listings: MockListing[]
  isPersonalized: boolean
  reason: RecommendationReason
  isLoading: boolean
}

// ── Query keys ─────────────────────────────────────────────────────────────────

export const recommendationsKeys = {
  forUser: (userId?: string) => ['recommendations', userId ?? 'anon'] as const,
}

// ── Hook ───────────────────────────────────────────────────────────────────────

/**
 * SR-1: Smart Recommendations
 *
 * Returns personalized listing recommendations based on:
 * - Real API (production): order history via GET /recommendations?userId=
 * - Mock mode (dev/training): wishlist category scoring → promoted listings fallback
 *
 * @param allListings - Full listing pool from useListings() for mock-mode scoring
 */
export function useRecommendations(allListings: MockListing[]): RecommendationsResult {
  const userId = useAuthStore((s) => s.user?.id)
  const wishlistItems = useWishlistStore((s) => s.items)

  const wishlistCategories = useMemo(
    () => [...new Set(wishlistItems.map(i => i.category).filter((c): c is string => Boolean(c)))],
    [wishlistItems],
  )

  // ── Real API query ─────────────────────────────────────────────────────────
  const apiQuery = useQuery({
    queryKey: recommendationsKeys.forUser(userId),
    queryFn: async (): Promise<MockListing[]> => {
      const res = await recommendationsApi.get(userId)
      // Backend returns Listing[] directly (no ApiResponse wrapper)
      return (Array.isArray(res.data) ? res.data : []) as MockListing[]
    },
    enabled: USE_REAL_API,
    staleTime: 3 * 60 * 1000,
  })

  // ── Mock-mode scoring (computed, no network) ───────────────────────────────
  const mockRecs = useMemo((): RecommendationsResult => {
    if (allListings.length === 0) {
      return { listings: [], isPersonalized: false, reason: 'popular', isLoading: false }
    }

    if (wishlistCategories.length > 0) {
      const scored = allListings
        .map(l => ({
          l,
          score: (wishlistCategories.includes(l.category) ? 3 : 0) + (l.isPromoted ? 1 : 0),
        }))
        .sort((a, b) => b.score - a.score)
      return {
        listings: scored.slice(0, 8).map(s => s.l),
        isPersonalized: true,
        reason: 'based_on_wishlist',
        isLoading: false,
      }
    }

    const popular = [...allListings]
      .sort((a, b) => (b.isPromoted ? 1 : 0) - (a.isPromoted ? 1 : 0))
      .slice(0, 8)
    return { listings: popular, isPersonalized: false, reason: 'popular', isLoading: false }
  }, [allListings, wishlistCategories])

  // ── Return real API result or mock ────────────────────────────────────────
  if (!USE_REAL_API) return mockRecs

  const apiListings = apiQuery.data ?? []
  const isPersonalized = !!userId && apiListings.length > 0
  return {
    listings: apiListings,
    isPersonalized,
    reason: isPersonalized ? 'based_on_orders' : 'popular',
    isLoading: apiQuery.isLoading,
  }
}
