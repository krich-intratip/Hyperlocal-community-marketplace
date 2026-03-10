'use client'

import { useQuery } from '@tanstack/react-query'
import { MOCK_LISTINGS, getListingById, type MockListing } from '@/lib/mock-listings'
import { listingsApi } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

// ── Query Keys ────────────────────────────────────────────────────────────────
export const listingKeys = {
  all: ['listings'] as const,
  list: (filters?: ListingFilters) => [...listingKeys.all, 'list', filters] as const,
  detail: (id: string) => [...listingKeys.all, 'detail', id] as const,
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ListingFilters {
  search?: string
  category?: string
  status?: MockListing['status'] | 'ALL'
  sortBy?: 'rating' | 'price'
  radiusKm?: number
}

// ── Fetchers ──────────────────────────────────────────────────────────────────
async function fetchListings(filters: ListingFilters = {}): Promise<MockListing[]> {
  if (USE_REAL_API) {
    const res = await listingsApi.list({
      search: filters.search,
      category: filters.category !== 'ALL' ? filters.category : undefined,
      status: filters.status !== 'ALL' ? filters.status : undefined,
    })
    return res.data.data as unknown as MockListing[]
  }

  await new Promise((r) => setTimeout(r, 200))
  let results = [...MOCK_LISTINGS]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.provider.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }
  if (filters.category && filters.category !== 'ALL') {
    results = results.filter((l) => l.category === filters.category)
  }
  if (filters.status && filters.status !== 'ALL') {
    results = results.filter((l) => l.status === filters.status)
  }
  if (filters.sortBy === 'price') {
    results = results.sort((a, b) => a.price - b.price)
  } else {
    results = results.sort((a, b) => b.rating - a.rating)
  }
  // Promoted listings always surface first (stable — preserves inner sort order)
  results = [
    ...results.filter((l) => l.isPromoted),
    ...results.filter((l) => !l.isPromoted),
  ]
  return results
}

async function fetchListingById(id: string): Promise<MockListing | null> {
  if (USE_REAL_API) {
    const res = await listingsApi.get(id)
    return res.data.data as unknown as MockListing
  }
  await new Promise((r) => setTimeout(r, 100))
  return getListingById(id) ?? null
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: listingKeys.list(filters),
    queryFn: () => fetchListings(filters),
    staleTime: 30 * 1000,
  })
}

export function useListing(id: string) {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: () => fetchListingById(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  })
}
