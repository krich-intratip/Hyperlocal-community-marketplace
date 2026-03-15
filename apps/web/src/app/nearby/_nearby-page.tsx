'use client'
import { useNearby } from '@/hooks/useNearby'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import { MapPin, Navigation, Star, CheckCircle, RefreshCw, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const RADII = [1, 3, 5, 10, 20]
const CATEGORIES = [
  { value: '', label: 'ทุกหมวด' },
  { value: 'food', label: '🍜 อาหาร' },
  { value: 'repair', label: '🔧 ซ่อมแซม' },
  { value: 'tutoring', label: '📚 สอน' },
  { value: 'health', label: '💊 สุขภาพ' },
  { value: 'home', label: '🏠 บ้าน' },
]

const CAT_EMOJI: Record<string, string> = {
  food: '🍜', repair: '🔧', tutoring: '📚', health: '💊', home: '🏠',
  agri: '🌾', freelance: '💻', elderly: '👴', handmade: '🎨', community: '🏘️',
}

function DistanceBadge({ km }: { km: number }) {
  const color = km < 1 ? 'bg-emerald-100 text-emerald-700' : km < 3 ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'
  const label = km < 1 ? `${Math.round(km * 1000)} ม.` : `${km.toFixed(1)} กม.`
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
}

export function NearbyPageInner() {
  const { coords, geoState, radius, setRadius, category, setCategory, providers, isLoading, isFetching, refetch, requestLocation } = useNearby()

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 pt-6 pb-20">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-3">
            <MapPin className="w-4 h-4" /> Hyperlocal Discovery
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">ร้านค้าใกล้บ้าน</h1>
          <p className="text-slate-500 text-sm">ค้นหาบริการในรัศมีที่คุณต้องการ</p>
        </div>

        {/* Location prompt */}
        {geoState === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 text-center mb-6">
            <div className="text-5xl mb-4">📍</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">เปิดใช้งานตำแหน่ง GPS</h2>
            <p className="text-slate-500 text-sm mb-6">อนุญาตให้เข้าถึงตำแหน่งเพื่อค้นหาร้านค้าใกล้คุณ</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={requestLocation}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold mx-auto hover:bg-primary/90 transition-colors">
              <Navigation className="w-4 h-4" /> เปิดใช้ GPS
            </motion.button>
          </motion.div>
        )}

        {geoState === 'loading' && (
          <div className="glass-card rounded-2xl p-8 text-center mb-6">
            <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-slate-500">กำลังค้นหาตำแหน่ง...</p>
          </div>
        )}

        {geoState === 'denied' && (
          <div className="glass-card rounded-2xl p-6 text-center mb-6 border border-rose-200">
            <p className="text-3xl mb-2">🚫</p>
            <p className="font-semibold text-slate-700 mb-1">ไม่ได้รับอนุญาตให้เข้าถึง GPS</p>
            <p className="text-sm text-slate-500 mb-4">กรุณาเปิดสิทธิ์ตำแหน่งในการตั้งค่าเบราว์เซอร์</p>
            <button onClick={requestLocation}
              className="text-sm text-primary hover:underline">ลองอีกครั้ง</button>
          </div>
        )}

        {geoState === 'error' && (
          <div className="glass-card rounded-2xl p-6 text-center mb-6 border border-amber-200">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="font-semibold text-slate-700 mb-1">เกิดข้อผิดพลาด</p>
            <button onClick={requestLocation} className="text-sm text-primary hover:underline mt-2">ลองอีกครั้ง</button>
          </div>
        )}

        {/* Filters (show after location success) */}
        {(geoState === 'success' || coords) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 space-y-3">
            {/* Coords display */}
            {coords && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                  {isFetching && <span className="text-primary text-xs animate-pulse">กำลังค้นหา...</span>}
                </div>
                <button onClick={() => void refetch()} disabled={isFetching}
                  className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50">
                  <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} /> รีเฟรช
                </button>
              </div>
            )}

            {/* Radius selector */}
            <div className="glass-card rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-slate-700">รัศมีการค้นหา</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {RADII.map(r => (
                  <button key={r} onClick={() => setRadius(r)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      radius === r ? 'bg-primary text-white' : 'glass-sm text-slate-600 hover:bg-white/60'
                    }`}>
                    {r < 1 ? `${r * 1000} ม.` : `${r} กม.`}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    category === cat.value ? 'bg-primary text-white' : 'glass-sm text-slate-600 hover:bg-white/60'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        {coords && (
          <div>
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="glass-card rounded-2xl h-24 animate-pulse" />)}
              </div>
            ) : !providers?.length ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-slate-700">ไม่พบร้านค้าในรัศมี {radius} กม.</p>
                <p className="text-slate-400 text-sm mt-1">ลองขยายรัศมีการค้นหา</p>
                <button onClick={() => setRadius(Math.min(50, radius * 2))}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold">
                  ขยายเป็น {Math.min(50, radius * 2)} กม.
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-500 mb-3">พบ {providers.length} ร้านในรัศมี {radius} กม.</p>
                <div className="space-y-3">
                  {providers.map((p, i) => (
                    <motion.div key={p.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link href={`/providers/${p.id}` as any}
                        className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all block group">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-2xl shrink-0">
                          {CAT_EMOJI[p.category ?? ''] ?? '🏪'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors">
                              {p.displayName}
                            </h3>
                            {p.isVerified && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
                          </div>
                          {p.bio && <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.bio}</p>}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="flex items-center gap-0.5 text-xs text-amber-600 font-semibold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {p.rating.toFixed(1)} ({p.reviewCount})
                            </span>
                            <DistanceBadge km={p.distanceKm} />
                          </div>
                        </div>
                        <MapPin className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
      <AppFooter />
    </main>
  )
}
