'use client'
import { useQuery } from '@tanstack/react-query'
import { searchApi, type SearchParams, type SearchResult } from '@/lib/api'
import type { Listing } from '@/types'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

function buildMockResults(params: SearchParams): SearchResult {
  const mockListings: Listing[] = Array.from({ length: 12 }, (_, i) => ({
    id: `mock-${i}`,
    title: `บริการตัวอย่าง ${i + 1}${params.q ? ` — "${params.q}"` : ''}`,
    description: 'รายละเอียดบริการตัวอย่างสำหรับ development mode',
    price: 100 + i * 50,
    category: params.category ?? 'food',
    communityId: params.communityId ?? 'cm-1',
    status: 'ACTIVE',
    images: [],
    providerId: `provider-${i}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as Listing))
  return { data: mockListings, total: mockListings.length, page: params.page ?? 1, limit: params.limit ?? 20 }
}

export function useAdvancedSearch(params: SearchParams, enabled = true) {
  return useQuery<SearchResult>({
    queryKey: ['advanced-search', params],
    queryFn: async () => {
      if (!USE_REAL_API) return buildMockResults(params)
      const res = await searchApi.search(params)
      return (res.data ?? res) as unknown as SearchResult
    },
    enabled,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })
}
