'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { MapPin, Users, Calendar, ChevronRight, Search, Star, Navigation, Loader2, AlertCircle, X, SlidersHorizontal } from 'lucide-react'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useCommunities, type MockCommunity } from '@/hooks/useCommunities'

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
  const { data: communities = [], isLoading, isError } = useCommunities()
  const [search, setSearch]             = useState('')
  const [geoState, setGeoState]         = useState<GeoState>('idle')
  const [userPos, setUserPos]           = useState<{ lat: number; lng: number } | null>(null)
  const [searchRadius, setSearchRadius] = useState(10)
  const [nearbyOnly, setNearbyOnly]     = useState(false)
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
  const withDistance = communities.map((c: MockCommunity) => ({
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

  if (isLoading) {
    return (
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-slate-500 font-medium">กำลังโหลดชุมชน...</p>
          </div>
        </div>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
            <p className="text-slate-600 font-medium">โหลดชุมชนไม่ได้ กรุณาลองใหม่</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6 text-center">
        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
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
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass border-none text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Geo controls */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Near Me button */}
            {geoState !== 'granted' ? (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={requestLocation}
                disabled={geoState === 'loading'}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200/50 hover:bg-primary/90 disabled:opacity-60 transition-colors">
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
                  className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm font-bold text-slate-700 hover:border-primary/40 transition-colors">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  รัศมี {searchRadius} กม.
                </motion.button>
                <AnimatePresence>
                  {showRadiusPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute top-full mt-2 left-0 glass-heavy rounded-2xl shadow-xl p-3 z-20 flex gap-2">
                      {RADIUS_OPTIONS.map((r) => (
                        <button key={r} onClick={() => { setSearchRadius(r); setShowRadiusPicker(false) }}
                          className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                            searchRadius === r
                              ? 'bg-primary text-white'
                              : 'glass-sm text-slate-600 hover:text-primary'
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
                className="block p-6 rounded-2xl glass-card group">

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
                      <span className="text-xs cat-health font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                        ฟรี
                      </span>
                    )}
                    {/* Distance badge */}
                    {community.distKm !== null && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        community.inServiceArea
                          ? 'bg-primary/15 text-primary'
                          : 'glass-sm text-slate-500'
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
                      ? 'glass-sm text-primary'
                      : 'glass-sm text-slate-400'
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
                  <div className="text-xs text-primary font-medium">{community.providers} Provider</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {community.tags.map((tag) => (
                    <span key={tag} className="text-xs glass-sm text-primary px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Trial info */}
                {community.trial && community.trialEnd && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 glass-sm rounded-lg px-3 py-2 mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    ทดลองฟรีถึง {community.trialEnd}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{community.providers} ผู้ให้บริการในชุมชน</span>
                  <ChevronRight className="h-4 w-4 text-primary/60 group-hover:translate-x-1 transition-transform" />
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
                    className="px-4 py-2 rounded-xl glass text-sm font-bold text-primary hover:bg-white/30 transition-colors">
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
              className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-white/30 transition-colors">
              🏘️ ขอเปิดตลาดชุมชนในพื้นที่ของคุณ <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
      <AppFooter />
    </main>
  )
}
