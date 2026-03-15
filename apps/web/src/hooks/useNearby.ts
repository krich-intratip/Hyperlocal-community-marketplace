'use client'
import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { geoApi, type NearbyProvider } from '@/lib/api'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

function buildMockNearby(lat: number, lng: number, radius: number): NearbyProvider[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `nearby-${i}`,
    displayName: `ร้านตัวอย่าง ${i + 1}`,
    bio: 'บริการคุณภาพดี ราคาเป็นมิตร',
    category: ['food', 'repair', 'tutoring', 'health', 'home'][i % 5],
    avatarUrl: null,
    rating: 4.2 + (i % 3) * 0.2,
    reviewCount: 12 + i * 7,
    distanceKm: Number((0.3 + i * 0.8).toFixed(1)),
    latitude: lat + (Math.random() - 0.5) * 0.05,
    longitude: lng + (Math.random() - 0.5) * 0.05,
    isVerified: i < 3,
  })).filter(p => p.distanceKm <= radius)
}

export type GeolocationState = 'idle' | 'loading' | 'success' | 'denied' | 'error'

export function useNearby() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoState, setGeoState] = useState<GeolocationState>('idle')
  const [radius, setRadius] = useState(5)
  const [category, setCategory] = useState('')

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoState('error')
      return
    }
    setGeoState('loading')
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoState('success')
      },
      err => {
        setGeoState(err.code === 1 ? 'denied' : 'error')
      },
      { timeout: 10000, enableHighAccuracy: true },
    )
  }, [])

  const { data: providers, isLoading, isFetching, refetch } = useQuery<NearbyProvider[]>({
    queryKey: ['nearby', coords, radius, category],
    queryFn: async () => {
      if (!coords) return []
      if (!USE_REAL_API) return buildMockNearby(coords.lat, coords.lng, radius)
      const res = await geoApi.getNearby(coords.lat, coords.lng, radius, category || undefined)
      return (res.data ?? res) as unknown as NearbyProvider[]
    },
    enabled: !!coords,
    staleTime: 2 * 60_000,
  })

  return { coords, geoState, radius, setRadius, category, setCategory, providers, isLoading, isFetching, refetch, requestLocation }
}
