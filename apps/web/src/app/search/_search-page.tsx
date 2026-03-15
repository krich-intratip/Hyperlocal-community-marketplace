'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { SortBy } from '@/lib/api'

const CATEGORIES = [
  { value: '', label: 'ทุกหมวด' },
  { value: 'food', label: '🍜 อาหาร' },
  { value: 'repair', label: '🔧 ซ่อมแซม' },
  { value: 'home', label: '🏠 บ้าน' },
  { value: 'tutoring', label: '📚 สอนพิเศษ' },
  { value: 'health', label: '💊 สุขภาพ' },
  { value: 'agri', label: '🌾 เกษตร' },
  { value: 'freelance', label: '💻 ฟรีแลนซ์' },
  { value: 'elderly', label: '👴 ผู้สูงอายุ' },
  { value: 'handmade', label: '🎨 งานฝีมือ' },
  { value: 'community', label: '🏘️ ชุมชน' },
]

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'newest', label: 'ใหม่ล่าสุด' },
  { value: 'price_asc', label: 'ราคา: น้อย→มาก' },
  { value: 'price_desc', label: 'ราคา: มาก→น้อย' },
  { value: 'rating', label: 'คะแนนสูงสุด' },
  { value: 'popular', label: 'ยอดนิยม' },
]

export function SearchPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')
  const [minRating, setMinRating] = useState<number | undefined>(
    searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined
  )
  const [sortBy, setSortBy] = useState<SortBy>((searchParams.get('sortBy') as SortBy) ?? 'newest')
  const [page, setPage] = useState(Number(searchParams.get('page') ?? '1'))
  const [showFilters, setShowFilters] = useState(false)
  const [inputQ, setInputQ] = useState(q)

  const params = {
    q: q || undefined,
    category: category || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating,
    sortBy,
    page,
    limit: 20,
  }

  const { data, isLoading, isFetching } = useAdvancedSearch(params)

  // Sync URL with state
  useEffect(() => {
    const qs = new URLSearchParams()
    if (q) qs.set('q', q)
    if (category) qs.set('category', category)
    if (minPrice) qs.set('minPrice', minPrice)
    if (maxPrice) qs.set('maxPrice', maxPrice)
    if (minRating) qs.set('minRating', String(minRating))
    if (sortBy !== 'newest') qs.set('sortBy', sortBy)
    if (page > 1) qs.set('page', String(page))
    router.replace(`/search?${qs.toString()}`, { scroll: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, minPrice, maxPrice, minRating, sortBy, page])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setQ(inputQ)
    setPage(1)
  }

  function clearFilters() {
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setMinRating(undefined)
    setSortBy('newest')
    setPage(1)
  }

  const hasFilters = Boolean(category || minPrice || maxPrice || minRating || sortBy !== 'newest')
  const totalPages = data ? Math.ceil(data.total / 20) : 0

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 pt-6 pb-20">

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={inputQ}
                onChange={e => setInputQ(e.target.value)}
                placeholder="ค้นหาบริการ เช่น อาหาร, ซ่อมแอร์, สอนคณิต..."
                className="w-full pl-10 pr-4 py-3 glass-card rounded-xl text-sm text-slate-700 border border-white/30 focus:border-primary/50 outline-none"
              />
              {inputQ && (
                <button type="button" onClick={() => { setInputQ(''); setQ(''); setPage(1) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit"
              className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
              ค้นหา
            </button>
            <button type="button" onClick={() => setShowFilters(v => !v)}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-1.5 ${
                showFilters || hasFilters ? 'bg-primary text-white border-primary' : 'glass-card border-white/30 text-slate-600'
              }`}>
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">ตัวกรอง</span>
              {hasFilters && <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />}
            </button>
          </div>
        </form>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-xl p-4 mb-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-700 text-sm">ตัวกรองการค้นหา</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1">
                    <X className="w-3 h-3" /> ล้างตัวกรอง
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">หมวดหมู่</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map(cat => (
                      <button key={cat.value} onClick={() => { setCategory(cat.value); setPage(1) }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          category === cat.value ? 'bg-primary text-white' : 'glass-sm text-slate-600 hover:bg-white/60'
                        }`}>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price + Rating */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">ช่วงราคา (฿)</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1) }}
                        placeholder="ต่ำสุด" min={0}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary/50" />
                      <span className="text-slate-400">–</span>
                      <input type="number" value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1) }}
                        placeholder="สูงสุด" min={0}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">คะแนนขั้นต่ำ</label>
                    <div className="flex gap-1.5">
                      {[0, 3, 4, 5].map(r => (
                        <button key={r} onClick={() => { setMinRating(r || undefined); setPage(1) }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                            (minRating ?? 0) === r ? 'bg-amber-400 text-white' : 'glass-sm text-slate-600 hover:bg-white/60'
                          }`}>
                          {r === 0 ? 'ทั้งหมด' : <><Star className="w-3 h-3" />{r}+</>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sort + results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            {isLoading ? 'กำลังค้นหา...' : (
              data ? `พบ ${data.total.toLocaleString()} รายการ${q ? ` สำหรับ "${q}"` : ''}` : ''
            )}
          </p>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value as SortBy); setPage(1) }}
            className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-primary/50 glass-sm text-slate-600">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Results grid */}
        <div className={`transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl h-52 animate-pulse" />
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">🔍</p>
              <h3 className="text-lg font-bold text-slate-700 mb-1">ไม่พบผลลัพธ์</h3>
              <p className="text-slate-400 text-sm mb-4">ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง</p>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90">
                  ล้างตัวกรองทั้งหมด
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.data.map((listing, i) => (
                <motion.div key={listing.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link href={`/marketplace/${listing.id}` as string}
                    className="glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all block group">
                    {/* Image */}
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-3xl">
                      {listing.category === 'FOOD' ? '🍜'
                        : listing.category === 'REPAIR' ? '🔧'
                        : listing.category === 'EDUCATION' ? '📚'
                        : listing.category === 'CARE' ? '💊'
                        : '⭐'}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-primary font-bold text-sm mt-1.5">
                        ฿{listing.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 glass-card rounded-xl disabled:opacity-40 hover:bg-white/60 transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i))
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                    page === p ? 'bg-primary text-white' : 'glass-card text-slate-600 hover:bg-white/60'
                  }`}>
                  {p}
                </button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 glass-card rounded-xl disabled:opacity-40 hover:bg-white/60 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        )}
      </section>
      <AppFooter />
    </main>
  )
}
