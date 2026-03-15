'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import type { NearbyProvider } from '@/lib/api'
import { geoApi } from '@/lib/api'

const ProvidersMap = dynamic(
  () => import('@/components/providers-map').then(m => m.ProvidersMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center text-slate-500">
        กำลังโหลดแผนที่...
      </div>
    ),
  },
)

const DEFAULT_CENTER: [number, number] = [13.7563, 100.5018] // Bangkok

const MOCK_PROVIDERS: NearbyProvider[] = [
  {
    id: '1',
    displayName: 'ร้านส้มตำป้าแดง',
    bio: 'ส้มตำสูตรโบราณ รสชาติเด็ดดวง',
    category: 'food',
    avatarUrl: null,
    rating: 4.8,
    reviewCount: 128,
    distanceKm: 0.5,
    latitude: 13.760,
    longitude: 100.502,
    isVerified: true,
  },
  {
    id: '2',
    displayName: 'ช่างซ่อมไฟฟ้ามืออาชีพ',
    bio: 'ซ่อมไฟฟ้าบ้าน ราคาเป็นธรรม',
    category: 'repair',
    avatarUrl: null,
    rating: 4.6,
    reviewCount: 73,
    distanceKm: 1.2,
    latitude: 13.752,
    longitude: 100.510,
    isVerified: false,
  },
  {
    id: '3',
    displayName: 'ติวเตอร์ภาษาอังกฤษ',
    bio: 'สอนภาษาอังกฤษทุกระดับ',
    category: 'tutoring',
    avatarUrl: null,
    rating: 4.9,
    reviewCount: 201,
    distanceKm: 0.8,
    latitude: 13.765,
    longitude: 100.495,
    isVerified: true,
  },
]

export default function MapPageClient() {
  const [providers, setProviders] = useState<NearbyProvider[]>([])
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [loading, setLoading] = useState(true)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'done' | 'denied'>('idle')

  // Get user location
  useEffect(() => {
    setGeoStatus('loading')
    if (!navigator.geolocation) {
      setGeoStatus('denied')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const c: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setCenter(c)
        setGeoStatus('done')
      },
      () => setGeoStatus('denied'),
      { timeout: 8000 },
    )
  }, [])

  // Fetch providers when center is ready
  useEffect(() => {
    const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)
    if (!USE_REAL_API) {
      setProviders(MOCK_PROVIDERS)
      setLoading(false)
      return
    }
    const [lat, lng] = center
    const delta = 0.1
    geoApi
      .getInBounds({ north: lat + delta, south: lat - delta, east: lng + delta, west: lng - delta })
      .then(res => setProviders(res.data))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false))
  }, [center])

  return (
    <div className="min-h-screen relative">
      <MarketBackground />
      <Navbar />

      <div className="relative z-10 p-4 max-w-6xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-4 mt-4">
          <h1 className="text-2xl font-bold text-slate-800">🗺️ แผนที่ค้นหาร้านค้า</h1>
          <p className="text-slate-500 text-sm mt-1">
            {geoStatus === 'done'
              ? '📍 ใช้ตำแหน่งของคุณ'
              : geoStatus === 'denied'
              ? '📍 แสดงพื้นที่กรุงเทพ (ไม่มีสิทธิ์ GPS)'
              : geoStatus === 'loading'
              ? '📍 กำลังระบุตำแหน่ง...'
              : '📍 กรุงเทพมหานคร'}
          </p>
        </div>

        {/* Stats bar */}
        <div className="mb-4 flex items-center gap-4">
          <span className="glass-sm px-3 py-1.5 rounded-full text-sm text-slate-700">
            {loading ? 'กำลังโหลด...' : `พบ ${providers.length} ร้านค้า`}
          </span>
          <a href="/nearby" className="text-sm text-primary hover:underline">
            → ดูแบบรายการ
          </a>
        </div>

        {/* Map */}
        <div className="h-[600px] rounded-2xl overflow-hidden shadow-xl glass-card">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-500">
                <div className="text-4xl mb-2">🗺️</div>
                <p>กำลังโหลดแผนที่...</p>
              </div>
            </div>
          ) : (
            <ProvidersMap providers={providers} center={center} zoom={14} />
          )}
        </div>

        {/* Attribution */}
        <p className="mt-3 text-center text-xs text-slate-400">
          ข้อมูลแผนที่จาก OpenStreetMap • คลิกหมุดเพื่อดูข้อมูลร้านค้า
        </p>
      </div>

      <AppFooter />
    </div>
  )
}
