'use client'

import { motion } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { Search, MapPin, Star, ChevronRight, SlidersHorizontal, Map, List, Wifi, WifiOff } from 'lucide-react'
import Link from 'next/link'
import { useState, lazy, Suspense } from 'react'
import { ProviderStatusBadge } from '@/components/provider-status'
import { useT } from '@/hooks/useT'
import { formatDateShort } from '@/lib/date'
import type { MapListing } from '@/components/map-view'
import { useListings } from '@/hooks/useListings'

const MapView = lazy(() => import('@/components/map-view').then(m => ({ default: m.MapView })))

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

const CATEGORIES = [
  { slug: 'ALL', icon: '🛍️' },
  { slug: 'FOOD', icon: '🍱' },
  { slug: 'REPAIR', icon: '🔧' },
  { slug: 'HOME_SERVICES', icon: '🏠' },
  { slug: 'TUTORING', icon: '📚' },
  { slug: 'ELDERLY_CARE', icon: '👴' },
  { slug: 'HANDMADE', icon: '🎨' },
  { slug: 'HEALTH_WELLNESS', icon: '💆' },
  { slug: 'AGRICULTURE', icon: '🌿' },
  { slug: 'FREELANCE', icon: '💻' },
  { slug: 'COMMUNITY_SHARING', icon: '🤝' },
]

const CAT_NAMES: Record<string, string> = {
  ALL: 'ทั้งหมด', FOOD: 'อาหาร', REPAIR: 'งานช่าง',
  HOME_SERVICES: 'งานบ้าน', TUTORING: 'สอนพิเศษ', ELDERLY_CARE: 'ดูแลผู้สูงอายุ',
  HANDMADE: 'สินค้าทำมือ', HEALTH_WELLNESS: 'สุขภาพ', AGRICULTURE: 'เกษตร',
  FREELANCE: 'ฟรีแลนซ์', COMMUNITY_SHARING: 'Community Sharing',
}

type ProviderStatus = 'available' | 'busy' | 'offline'

const DAY_LABELS = ['จ','อ','พ','พฤ','ศ','ส','อา']

function StockBar({ stock, max }: { stock: number; max: number }) {
  const pct = max > 0 ? (stock / max) * 100 : 0
  const color = stock === 0 ? 'bg-slate-300 dark:bg-slate-600'
    : pct <= 20 ? 'bg-red-500' : pct <= 50 ? 'bg-amber-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold min-w-[2rem] text-right ${
        stock === 0 ? 'text-slate-400' : pct <= 20 ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'
      }`}>{stock === 0 ? 'หมด' : String(stock)}</span>
    </div>
  )
}


export default function MarketplacePage() {
  const t = useT()
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'price'>('rating')
  const [statusFilter, setStatusFilter] = useState<ProviderStatus | 'ALL'>('ALL')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [radiusKm, setRadiusKm] = useState(5)

  const { data: allListings = [], isLoading } = useListings({ sortBy })

  const filtered = allListings
    .filter(l => activeCategory === 'ALL' || l.category === activeCategory)
    .filter(l => statusFilter === 'ALL' || l.status === statusFilter)
    .filter(l => !search || l.title.includes(search) || l.provider.includes(search) || l.tags.some(tag => tag.includes(search)))
    .filter(l => parseFloat(l.distance) <= radiusKm)

  const mapListings = filtered.map(l => ({
    id: l.id, title: l.title, provider: l.provider,
    price: l.price, unit: l.unit, lat: l.lat, lng: l.lng,
    category: l.category, status: l.status, rating: l.rating, image: l.image,
  }))

  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950">
      <MarketBackground />
      <Navbar />

      {/* Hero / Search */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-1">
            {t.marketplace.title}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-5">พบ {allListings.length} บริการในชุมชนของคุณ</p>
        </motion.div>

        {/* Search + sort */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder={t.marketplace.searchPlaceholder}
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-base text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as 'rating' | 'price')}
            className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-base text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer">
            <option value="rating">{t.marketplace.sortRating}</option>
            <option value="price">{t.marketplace.sortPrice}</option>
          </select>
        </motion.div>

        {/* Filter bar */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="flex flex-wrap items-center gap-3 mb-4">
          {/* Status filter */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 overflow-hidden">
            {(['ALL','available','busy','offline'] as const).map(val => (
              <button key={val} onClick={() => setStatusFilter(val)}
                className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
                  statusFilter === val ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
                }`}>
                {val === 'ALL' ? 'ทั้งหมด' : val === 'available' ? '🟢 ว่าง' : val === 'busy' ? '🟡 ไม่ว่าง' : '⚫ หยุด'}
              </button>
            ))}
          </div>

          {/* Radius filter */}
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{t.marketplace.filterRadius}</span>
            <input type="range" min={1} max={10} step={0.5} value={radiusKm}
              onChange={e => setRadiusKm(parseFloat(e.target.value))}
              className="w-20 accent-blue-600" />
            <span className="text-sm font-bold text-blue-600">{radiusKm} {t.common.km}</span>
          </div>

          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 overflow-hidden ml-auto">
            <button onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
              }`}>
              <List className="h-4 w-4" /> {t.marketplace.listView}
            </button>
            <button onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-colors ${
                viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
              }`}>
              <Map className="h-4 w-4" /> {t.marketplace.mapView}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Category tabs — wrap 2 rows on md+, horizontal scroll on mobile */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}>
          {/* Mobile: horizontal scroll */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => {
              const count = cat.slug === 'ALL'
                ? allListings.length
                : allListings.filter(l => l.category === cat.slug).length
              return (
                <motion.button key={cat.slug} whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border flex-shrink-0 ${
                    activeCategory === cat.slug
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                      : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>
                  <span>{cat.icon}</span>
                  <span>{CAT_NAMES[cat.slug]}</span>
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      activeCategory === cat.slug ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>{count}</span>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Desktop md+: wrap into 2 rows */}
          <div className="hidden md:flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const count = cat.slug === 'ALL'
                ? allListings.length
                : allListings.filter(l => l.category === cat.slug).length
              const isActive = activeCategory === cat.slug
              return (
                <motion.button key={cat.slug} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 dark:shadow-blue-900/30'
                      : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:text-blue-600'
                  }`}>
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span>{CAT_NAMES[cat.slug]}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold min-w-[1.25rem] text-center ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>{count}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Map view */}
      {viewMode === 'map' && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Suspense fallback={
            <div className="h-[480px] rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <p className="text-slate-400 text-base">{t.common.loading}</p>
            </div>
          }>
            <MapView listings={mapListings} onSelect={() => setViewMode('list')} />
          </Suspense>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 text-center">คลิก pin เพื่อดูรายละเอียด — แผนที่ © OpenStreetMap contributors</p>
        </section>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium mb-4">
            {isLoading ? 'กำลังโหลด...' : `${filtered.length} รายการ`}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white/80 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 h-64 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-slate-500 dark:text-slate-400">{t.marketplace.noResults}</p>
            </motion.div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((listing, i) => (
                <motion.div key={listing.id} variants={fadeUp} custom={i}
                  whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(37,99,235,0.12)' }}>
                  <Link href={`/marketplace/${listing.id}`}
                    className="block rounded-2xl bg-white/90 dark:bg-slate-800 backdrop-blur-sm border border-slate-100 dark:border-slate-700 shadow-sm hover:border-blue-200 dark:hover:border-blue-600 transition-all overflow-hidden group">

                    {/* Image + status overlay */}
                    <div className="relative h-40 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-6xl">
                      {listing.image}
                      <div className="absolute top-3 left-3">
                        <ProviderStatusBadge status={listing.status} size="sm" />
                      </div>
                      {listing.providerVerified && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center" title="ยืนยันแล้ว">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 line-clamp-2">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{listing.provider}</p>

                      {/* Rating + distance */}
                      <div className="flex items-center gap-3 mb-2 text-sm text-slate-400 dark:text-slate-500">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-700 dark:text-slate-200">{listing.rating}</span>
                          <span>({listing.reviews})</span>
                        </div>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {listing.distance}
                        </div>
                      </div>

                      {/* Schedule: available days */}
                      {listing.availableDays && (
                        <div className="flex items-center gap-1 mb-2 flex-wrap">
                          {DAY_LABELS.map((d, idx) => (
                            <span key={idx} className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                              listing.availableDays!.includes(idx)
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600'
                            }`}>{d}</span>
                          ))}
                          {listing.openTime && (
                            <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">{listing.openTime}–{listing.closeTime} น.</span>
                          )}
                        </div>
                      )}

                      {/* Food / handmade stock */}
                      {listing.menuStock && listing.menuStock.length > 0 && (
                        <div className="mb-3 space-y-1.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wide">สต็อกคงเหลือ</p>
                          {listing.menuStock.map(m => (
                            <div key={m.name}>
                              <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-slate-600 dark:text-slate-300">{m.name}</span>
                                <span className="font-semibold text-slate-500 dark:text-slate-400">{m.stock}/{m.max}</span>
                              </div>
                              <StockBar stock={m.stock} max={m.max} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {listing.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">{tag}</span>
                        ))}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-extrabold text-slate-900 dark:text-white">฿{listing.price.toLocaleString()}</span>
                          <span className="text-sm text-slate-400 dark:text-slate-500 ml-1">/{listing.unit}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      )}
      <AppFooter />
    </main>
  )
}
