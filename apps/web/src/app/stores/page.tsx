'use client'

import { Suspense } from 'react'
import { useState, useMemo, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import { TrustBadge } from '@/components/trust-badge'
import { MOCK_LISTINGS } from '@/lib/mock-listings'
import {
  Store, Filter, X, Star, MapPin, CheckCircle,
  ChevronRight, SlidersHorizontal, ShieldCheck, UmbrellaOff,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

// ── derive unique providers from listings ──────────────────────────────────────
interface ProviderCard {
  providerId: string
  providerName: string
  providerAvatar: string
  providerVerified: boolean
  providerTrustScore: number
  providerBio: string
  providerSince: string
  community: string
  communityId: string
  categories: string[]
  listingCount: number
  avgRating: number
  totalReviews: number
  shopStatus: string
  isPromoted: boolean
  topListingId: string
}

const CAT_LABEL: Record<string, string> = {
  FOOD: '🍱 อาหาร', REPAIR: '🔧 ซ่อมแซม', HOME_SERVICES: '🏠 งานบ้าน',
  TUTORING: '📚 สอนพิเศษ', HEALTH_WELLNESS: '💊 สุขภาพ',
  AGRICULTURE: '🌾 เกษตร', FREELANCE: '💻 ฟรีแลนซ์',
  ELDERLY_CARE: '🧓 ดูแลผู้สูงอายุ', HANDMADE: '🎨 งานฝีมือ',
  COMMUNITY_SHARING: '🤝 แบ่งปัน',
}
const CAT_CHIP: Record<string, string> = {
  FOOD: 'cat-food', REPAIR: 'cat-repair', HOME_SERVICES: 'cat-home',
  TUTORING: 'cat-tutoring', HEALTH_WELLNESS: 'cat-health',
  AGRICULTURE: 'cat-agri', FREELANCE: 'cat-freelance',
  ELDERLY_CARE: 'cat-elderly', HANDMADE: 'cat-handmade',
  COMMUNITY_SHARING: 'cat-community',
}
const SORT_OPTIONS = [
  { value: 'rating', label: '⭐ เรตติ้งสูงสุด' },
  { value: 'reviews', label: '💬 รีวิวมากสุด' },
  { value: 'trust', label: '🛡️ Trust Score' },
  { value: 'newest', label: '🆕 เพิ่งเข้าร่วม' },
]

function buildProviders(): ProviderCard[] {
  const map = new Map<string, ProviderCard>()
  for (const l of MOCK_LISTINGS) {
    const pid = l.providerId
    if (!map.has(pid)) {
      map.set(pid, {
        providerId: pid,
        providerName: l.provider,
        providerAvatar: l.providerAvatar,
        providerVerified: l.providerVerified,
        providerTrustScore: l.providerTrustScore,
        providerBio: l.providerBio,
        providerSince: l.providerSince,
        community: l.community,
        communityId: l.communityId,
        categories: [],
        listingCount: 0,
        avgRating: 0,
        totalReviews: 0,
        shopStatus: l.shopStatus ?? 'OPEN',
        isPromoted: l.isPromoted ?? false,
        topListingId: l.id,
      })
    }
    const p = map.get(pid)!
    if (!p.categories.includes(l.category)) p.categories.push(l.category)
    p.listingCount += 1
    p.totalReviews += l.reviews
    p.avgRating = (p.avgRating * (p.listingCount - 1) + l.rating) / p.listingCount
    if (l.rating > MOCK_LISTINGS.find((x) => x.id === p.topListingId)!.rating) {
      p.topListingId = l.id
    }
  }
  return Array.from(map.values())
}

const ALL_PROVIDERS = buildProviders()
const ALL_COMMUNITIES = [...new Set(ALL_PROVIDERS.map((p) => p.community))].sort()
const ALL_CATEGORIES = [...new Set(ALL_PROVIDERS.flatMap((p) => p.categories))].sort()

// ── Component ──────────────────────────────────────────────────────────────────
export default function StoresPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <Store className="h-8 w-8 animate-pulse text-primary" />
        </div>
        <AppFooter />
      </main>
    }>
      <StoresContent />
    </Suspense>
  )
}

function StoresContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const selCommunity = searchParams.get('community') ?? ''
  const selCategory  = searchParams.get('category') ?? ''
  const openOnly     = searchParams.get('open') === '1'
  const sortBy       = searchParams.get('sort') ?? 'rating'

  const [showFilters, setShowFilters] = useState(false)

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    startTransition(() => router.replace(`${pathname}?${p.toString()}`, { scroll: false }))
  }
  function toggleParam(key: string, current: boolean) {
    const p = new URLSearchParams(searchParams.toString())
    if (current) p.delete(key)
    else p.set(key, '1')
    startTransition(() => router.replace(`${pathname}?${p.toString()}`, { scroll: false }))
  }
  function clearAll() {
    startTransition(() => router.replace(pathname, { scroll: false }))
  }

  const filtered = useMemo(() => {
    let list = [...ALL_PROVIDERS]
    if (selCommunity) list = list.filter((p) => p.community === selCommunity)
    if (selCategory)  list = list.filter((p) => p.categories.includes(selCategory))
    if (openOnly)     list = list.filter((p) => p.shopStatus === 'OPEN')
    // sort
    if (sortBy === 'rating')  list.sort((a, b) => b.avgRating - a.avgRating)
    if (sortBy === 'reviews') list.sort((a, b) => b.totalReviews - a.totalReviews)
    if (sortBy === 'trust')   list.sort((a, b) => b.providerTrustScore - a.providerTrustScore)
    // promoted first
    list.sort((a, b) => (b.isPromoted ? 1 : 0) - (a.isPromoted ? 1 : 0))
    return list
  }, [selCommunity, selCategory, openOnly, sortBy])

  const activeFilters = [selCommunity, selCategory, openOnly ? 'เปิดบริการ' : ''].filter(Boolean)

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Store className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-primary">ร้านค้าทั้งหมด</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            เลือกร้านที่ใช่สำหรับคุณ
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {ALL_PROVIDERS.length} ร้านค้าจาก {ALL_COMMUNITIES.length} ชุมชน
          </p>
        </motion.div>

        {/* Filter bar */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Toggle filter panel */}
            <button onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                showFilters ? 'bg-primary text-white border-primary' : 'glass border-white/40 text-slate-700 hover:border-primary/40'
              }`}>
              <SlidersHorizontal className="h-4 w-4" />
              ตัวกรอง
              {activeFilters.length > 0 && (
                <span className="bg-white/30 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Sort */}
            <select value={sortBy} onChange={(e) => setParam('sort', e.target.value)}
              className="glass border border-white/40 rounded-xl text-sm font-semibold text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent">
              {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>

            {/* Open only toggle */}
            <button onClick={() => toggleParam('open', openOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                openOnly ? 'bg-green-500 text-white border-green-400' : 'glass border-white/40 text-slate-600 hover:border-green-300'
              }`}>
              <CheckCircle className="h-4 w-4" />
              เปิดบริการ
            </button>

            {/* Active filter chips */}
            {selCommunity && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full">
                <MapPin className="h-3 w-3" /> {selCommunity}
                <button onClick={() => setParam('community', '')} className="ml-1 hover:text-indigo-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selCategory && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-violet-100 border border-violet-200 text-violet-700 text-xs font-bold rounded-full">
                {CAT_LABEL[selCategory] ?? selCategory}
                <button onClick={() => setParam('category', '')} className="ml-1 hover:text-violet-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {activeFilters.length > 0 && (
              <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors">
                ล้างทั้งหมด
              </button>
            )}
          </div>

          {/* Expanded filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                className="overflow-hidden">
                <div className="pt-4 mt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Community */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">ชุมชน</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_COMMUNITIES.map((c) => (
                        <button key={c} onClick={() => setParam('community', selCommunity === c ? '' : c)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            selCommunity === c
                              ? 'bg-primary text-white border-primary'
                              : 'glass-sm border-white/40 text-slate-600 hover:border-primary/40'
                          }`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Category */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">หมวดหมู่</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_CATEGORIES.map((cat) => (
                        <button key={cat} onClick={() => setParam('category', selCategory === cat ? '' : cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                            selCategory === cat
                              ? `${CAT_CHIP[cat] ?? ''} border-current opacity-100`
                              : 'glass-sm border-transparent text-slate-600 hover:border-primary/30'
                          }`}>
                          {CAT_LABEL[cat] ?? cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Result count */}
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="text-sm text-slate-500 mb-4">
          พบ <strong className="text-slate-800">{filtered.length}</strong> ร้านค้า
          {activeFilters.length > 0 && ' (ผ่านการกรอง)'}
        </motion.p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="glass-card rounded-2xl p-12 text-center">
            <Store className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold">ไม่พบร้านค้าที่ตรงกับเงื่อนไข</p>
            <button onClick={clearAll} className="mt-3 text-sm text-primary font-semibold hover:underline">
              ล้างตัวกรอง
            </button>
          </motion.div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((provider, i) => (
              <ProviderCardItem key={provider.providerId} provider={provider} index={i} />
            ))}
          </motion.div>
        )}
      </section>
      <AppFooter />
    </main>
  )
}

// ── Provider Card ──────────────────────────────────────────────────────────────
function ProviderCardItem({ provider, index }: { provider: ProviderCard; index: number }) {
  const isVacation = provider.shopStatus === 'VACATION'
  const isClosed   = provider.shopStatus === 'CLOSED'

  return (
    <motion.div variants={fadeUp} custom={index} whileHover={{ y: -4 }} className="group">
      <Link href={`/marketplace/${provider.topListingId}` as any}
        className="block glass-card rounded-2xl overflow-hidden transition-all hover:border-primary/30 border border-transparent">

        {/* Top accent */}
        {provider.isPromoted && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-1.5">
            <p className="text-xs font-bold text-white">🔥 โปรโมทร้านค้า</p>
          </div>
        )}
        {isVacation && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center gap-1.5">
            <UmbrellaOff className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-bold text-amber-700">ร้านปิดชั่วคราว (Vacation)</p>
          </div>
        )}
        {isClosed && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-1.5">
            <p className="text-xs font-bold text-red-600">🚫 ร้านปิดให้บริการ</p>
          </div>
        )}

        <div className="p-5">
          {/* Provider header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl glass-sm flex items-center justify-center text-2xl flex-shrink-0">
              {provider.providerAvatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-primary transition-colors">
                  {provider.providerName}
                </h3>
                {provider.providerVerified && (
                  <ShieldCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                )}
                <TrustBadge score={provider.providerTrustScore} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{provider.providerBio}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <strong className="text-slate-700">{provider.avgRating.toFixed(1)}</strong>
              <span>({provider.totalReviews} รีวิว)</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {provider.community}
            </span>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {provider.categories.map((cat) => (
              <span key={cat} className={`text-xs font-bold px-2 py-0.5 rounded-full ${CAT_CHIP[cat] ?? 'glass-sm text-slate-600'}`}>
                {CAT_LABEL[cat] ?? cat}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/20">
            <span className="text-xs text-slate-400">{provider.listingCount} บริการ · เข้าร่วม {provider.providerSince}</span>
            <span className="flex items-center gap-1 text-xs font-bold text-primary">
              ดูร้านค้า <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
