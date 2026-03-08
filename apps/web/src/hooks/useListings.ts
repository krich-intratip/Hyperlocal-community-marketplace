'use client'

import { useQuery } from '@tanstack/react-query'
import { MOCK_LISTINGS, getListingById, type MockListing } from '@/lib/mock-listings'

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

// ── Mock fetchers (swap with real API calls later) ────────────────────────────
async function fetchListings(filters: ListingFilters = {}): Promise<MockListing[]> {
  await new Promise((r) => setTimeout(r, 200)) // simulate network latency
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
  return results
}

async function fetchListingById(id: string): Promise<MockListing | null> {
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
