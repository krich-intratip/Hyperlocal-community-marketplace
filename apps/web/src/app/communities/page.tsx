'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { MapPin, Users, Calendar, ChevronRight, Search, Star, Navigation, Loader2, AlertCircle, X, SlidersHorizontal } from 'lucide-react'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const CommunityMap = dynamic(
  () => import('@/components/community-map').then(m => ({ default: m.CommunityMap })),
  { ssr: false, loading: () => <div className="h-64 w-full rounded-2xl bg-slate-100 animate-pulse" /> }
)

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

/* ── Mock data with coordinates ── */
type Community = {
  id: string; name: string; area: string; members: number; providers: number
  rating: number; emoji: string; tags: string[]; trial: boolean; trialEnd: string | null
  lat: number; lng: number; serviceRadius: number  // km — radius ที่ผู้ให้บริการในชุมชนนี้ cover
}

const MOCK_COMMUNITIES: Community[] = [
  { id: '1', name: 'หมู่บ้านศรีนคร',      area: 'บางแค, กรุงเทพฯ',    members: 248, providers: 34,  rating: 4.8, emoji: '🏘️', tags: ['อาหาร', 'งานช่าง', 'งานบ้าน'],            trial: true,  trialEnd: '30 เม.ย. 2569', lat: 13.7200, lng: 100.4200, serviceRadius: 5  },
  { id: '2', name: 'คอนโด The Base',       area: 'ลาดพร้าว, กรุงเทพฯ', members: 512, providers: 67,  rating: 4.9, emoji: '🏙️', tags: ['อาหาร', 'ติวเตอร์', 'สุขภาพ'],           trial: true,  trialEnd: '15 มี.ค. 2569', lat: 13.8150, lng: 100.5700, serviceRadius: 3  },
  { id: '3', name: 'ชุมชนเมืองทอง',        area: 'นนทบุรี',            members: 890, providers: 120, rating: 4.7, emoji: '🌳', tags: ['อาหาร', 'งานช่าง', 'เกษตร'],            trial: false, trialEnd: null,            lat: 13.8800, lng: 100.5400, serviceRadius: 8  },
  { id: '4', name: 'หมู่บ้านกรีนวิลล์',    area: 'สมุทรปราการ',        members: 156, providers: 22,  rating: 4.6, emoji: '🌿', tags: ['งานบ้าน', 'ดูแลผู้สูงอายุ'],             trial: true,  trialEnd: '01 มิ.ย. 2569', lat: 13.5990, lng: 100.6100, serviceRadius: 4  },
  { id: '5', name: 'เมืองเชียงใหม่ซิตี้',  area: 'เมือง, เชียงใหม่',   members: 340, providers: 55,  rating: 4.8, emoji: '⛰️', tags: ['อาหาร', 'สินค้าทำมือ', 'ท่องเที่ยว'], trial: false, trialEnd: null,            lat: 18.7900, lng: 98.9800,  serviceRadius: 10 },
  { id: '6', name: 'ชุมชนริมน้ำ',           area: 'ปทุมธานี',           members: 203, providers: 31,  rating: 4.5, emoji: '🌊', tags: ['เกษตร', 'อาหาร', 'Community Sharing'], trial: true,  trialEnd: '20 พ.ค. 2569', lat: 14.0200, lng: 100.5300, serviceRadius: 6  },
]

const RADIUS_OPTIONS = [3, 5, 10, 20, 50]

/* ── Haversine distance (km) ── */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function fmtDist(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} ม.` : `${km.toFixed(1)} กม.`
}

type GeoState = 'idle' | 'loading' | 'granted' | 'denied' | 'unavailable'

export default function CommunitiesPage() {
  const [search, setSearch]           = useState('')
  const [geoState, setGeoState]       = useState<GeoState>('idle')
  const [userPos, setUserPos]         = useState<{ lat: number; lng: number } | null>(null)
  const [searchRadius, setSearchRadius] = useState(10)   // km
  const [nearbyOnly, setNearbyOnly]   = useState(false)
  const [showRadiusPicker, setShowRadiusPicker] = useState(false)

  /* ── Geolocation ── */
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setGeoState('unavailable'); return }
    setGeoState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoState('granted')
        setNearbyOnly(true)
      },
      () => setGeoState('denied'),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }, [])

  const clearLocation = useCallback(() => {
    setUserPos(null)
    setGeoState('idle')
    setNearbyOnly(false)
  }, [])

  /* ── Filter + sort ── */
  const withDistance = MOCK_COMMUNITIES.map((c) => ({
    ...c,
    distKm: userPos ? haversine(userPos.lat, userPos.lng, c.lat, c.lng) : null,
    /* within service radius = ลูกค้าอยู่ในรัศมีที่ provider ของชุมชนนี้ cover */
    inServiceArea: userPos
      ? haversine(userPos.lat, userPos.lng, c.lat, c.lng) <= c.serviceRadius
      : true,
  }))

  const filtered = withDistance
    .filter((c) => {
      const matchSearch = c.name.includes(search) || c.area.includes(search) || c.tags.some((t) => t.includes(search))
      if (nearbyOnly && userPos) {
        return matchSearch && (c.distKm ?? Infinity) <= searchRadius
      }
      return matchSearch
    })
    .sort((a, b) => {
      if (nearbyOnly && a.distKm !== null && b.distKm !== null) return a.distKm - b.distKm
      return 0
    })

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6 text-center">
        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
          ตลาดชุมชน<span className="text-blue-600">ใกล้คุณ</span>
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="text-lg text-slate-500 mb-7">
          ใช้ Location ปัจจุบันเพื่อค้นหาตลาดและผู้ให้บริการในรัศมีที่คุณต้องการ
        </motion.p>

        {/* Search + Geo bar */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="max-w-xl mx-auto space-y-3">

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชุมชน, พื้นที่, หรือประเภทบริการ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          </div>

          {/* Geo controls */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Near Me button */}
            {geoState !== 'granted' ? (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={requestLocation}
                disabled={geoState === 'loading'}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-60 transition-colors">
                {geoState === 'loading'
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> กำลังหาตำแหน่ง...</>
                  : <><Navigation className="h-4 w-4" /> ค้นหาใกล้ฉัน</>}
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-xl bg-green-100 border border-green-200 px-4 py-2 text-sm font-bold text-green-700">
                  <Navigation className="h-3.5 w-3.5 fill-green-500 text-green-500" />
                  ใช้ตำแหน่งปัจจุบัน
                </div>
                <button onClick={clearLocation}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors" title="ล้างตำแหน่ง">
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            )}

            {/* Radius picker */}
            {geoState === 'granted' && (
              <div className="relative">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowRadiusPicker(p => !p)}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 transition-colors">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  รัศมี {searchRadius} กม.
                </motion.button>
                <AnimatePresence>
                  {showRadiusPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-20 flex gap-2">
                      {RADIUS_OPTIONS.map((r) => (
                        <button key={r} onClick={() => { setSearchRadius(r); setShowRadiusPicker(false) }}
                          className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                            searchRadius === r
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                          }`}>
                          {r} กม.
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Error states */}
          <AnimatePresence>
            {geoState === 'denied' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                ไม่ได้รับอนุญาตเข้าถึง Location — กรุณาอนุญาตใน Browser Settings แล้วลองใหม่
              </motion.div>
            )}
            {geoState === 'unavailable' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                Browser ไม่รองรับ Geolocation — ค้นหาด้วยชื่อพื้นที่แทนได้เลย
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Result summary */}
        {nearbyOnly && userPos && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm text-slate-500 mt-4">
            พบ <strong className="text-blue-600">{filtered.length} ชุมชน</strong> ในรัศมี {searchRadius} กม. จากตำแหน่งของคุณ
          </motion.p>
        )}
      </section>

      {/* Map view */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <CommunityMap
            markers={filtered.map(c => ({
              id: c.id,
              lat: c.lat,
              lng: c.lng,
              title: c.name,
              description: c.area,
              color: c.trial ? 'amber' : 'blue',
            }))}
            center={userPos ? [userPos.lat, userPos.lng] : [13.75, 100.52]}
            zoom={userPos ? 11 : 9}
            className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
            onMarkerClick={(id) => { window.location.href = `/communities/${id}` }}
          />
          <p className="text-xs text-slate-400 mt-1.5 text-center">คลิกที่ pin เพื่อดูรายละเอียดชุมชน</p>
        </motion.div>
      </section>

      {/* Community Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((community, i) => (
            <motion.div key={community.id} variants={fadeUp} custom={i}
              whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(37,99,235,0.12)' }}>
              <Link href={`/communities/${community.id}`}
                className="block p-6 rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{community.emoji}</span>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {community.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {community.area}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {community.trial && (
                      <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200 whitespace-nowrap">
                        ฟรี
                      </span>
                    )}
                    {/* Distance badge */}
                    {community.distKm !== null && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        community.inServiceArea
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        📍 {fmtDist(community.distKm)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Service area indicator */}
                {community.distKm !== null && (
                  <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg mb-3 ${
                    community.inServiceArea
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}>
                    <Navigation className={`h-3 w-3 ${community.inServiceArea ? 'fill-blue-400' : ''}`} />
                    {community.inServiceArea
                      ? `อยู่ในพื้นที่บริการ (รัศมี ${community.serviceRadius} กม.)`
                      : `นอกพื้นที่บริการ — ห่าง ${fmtDist(community.distKm)}`}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {community.members.toLocaleString()} สมาชิก
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {community.rating}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">{community.providers} Provider</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {community.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Trial info */}
                {community.trial && community.trialEnd && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-3 border border-green-100">
                    <Calendar className="h-3.5 w-3.5" />
                    ทดลองฟรีถึง {community.trialEnd}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{community.providers} ผู้ให้บริการในชุมชน</span>
                  <ChevronRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20">
            <div className="text-5xl mb-4">{nearbyOnly ? '📍' : '🔍'}</div>
            <p className="text-slate-600 font-semibold mb-1">
              {nearbyOnly ? `ไม่พบชุมชนในรัศมี ${searchRadius} กม.` : 'ไม่พบชุมชนที่ตรงกับคำค้นหา'}
            </p>
            {nearbyOnly && (
              <p className="text-sm text-slate-400 mb-5">ลองขยายรัศมีการค้นหาให้กว้างขึ้น</p>
            )}
            {nearbyOnly && (
              <div className="flex gap-2 justify-center flex-wrap">
                {RADIUS_OPTIONS.filter(r => r > searchRadius).slice(0, 3).map(r => (
                  <button key={r} onClick={() => setSearchRadius(r)}
                    className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-sm font-bold text-blue-600 hover:bg-blue-100 transition-colors">
                    ขยายเป็น {r} กม.
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* CTA — Request community */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mt-12 text-center">
          <p className="text-slate-500 mb-4">ไม่พบชุมชนในพื้นที่ของคุณ?</p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link href="/franchise/apply"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
              🏘️ ขอเปิดตลาดชุมชนในพื้นที่ของคุณ <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
      <AppFooter />
    </main>
  )
}
