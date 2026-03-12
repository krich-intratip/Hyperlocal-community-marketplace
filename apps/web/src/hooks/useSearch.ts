'use client'

import { useState, useEffect } from 'react'
import { MOCK_LISTINGS } from '@/lib/mock-listings'

export interface SearchResult {
  id: string
  title: string
  provider: string
  category: string
  image: string
  price: number
  unit: string
  rating: number
}

export function useSearch(query: string, debounceMs = 300) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    const t = setTimeout(() => {
      const q = query.toLowerCase()
      const found = MOCK_LISTINGS
        .filter((l) =>
          l.title.toLowerCase().includes(q) ||
          l.provider.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          l.community.toLowerCase().includes(q)
        )
        .slice(0, 6)
        .map<SearchResult>((l) => ({
          id: l.id,
          title: l.title,
          provider: l.provider,
          category: l.category,
          image: l.image,
          price: l.price,
          unit: l.unit,
          rating: l.rating,
        }))
      setResults(found)
      setLoading(false)
    }, debounceMs)
    return () => { clearTimeout(t); setLoading(false) }
  }, [query, debounceMs])

  return { results, loading }
}
