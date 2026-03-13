'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useSetPromotion } from '@/hooks/usePromotion'
import { MOCK_LISTINGS } from '@/lib/mock-listings'
import { Zap, Clock, Plus, X, CheckCircle, Trash2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const DISCOUNT_PRESETS = [10, 15, 20, 25, 30, 50]
const DURATION_PRESETS = [
  { label: '2 ชั่วโมง', hours: 2 },
  { label: '4 ชั่วโมง', hours: 4 },
  { label: '8 ชั่วโมง', hours: 8 },
  { label: '1 วัน', hours: 24 },
  { label: '2 วัน', hours: 48 },
  { label: '3 วัน', hours: 72 },
]

function useCountdown(endsAt?: string | null): string | null {
  const [label, setLabel] = useState<string | null>(null)
  useEffect(() => {
    if (!endsAt) { setLabel(null); return }
    function calc() {
      const diff = new Date(endsAt!).getTime() - Date.now()
      if (diff <= 0) { setLabel(null); return }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      if (h >= 24) { const d = Math.floor(h / 24); setLabel(`${d}วัน ${h % 24}ช`) }
      else if (h > 0) { setLabel(`${h}ช ${m}น`) }
      else { const s = Math.floor((diff % 60_000) / 1_000); setLabel(`${m}น ${s}ว`) }
    }
    calc()
    const t = setInterval(calc, 1_000)
    return () => clearInterval(t)
  }, [endsAt])
  return label
}

interface LocalPromo {
  listingId: string
  discountPercent: number
  discountEndsAt: string
}

// In mock mode, promotions are stored in sessionStorage
const PROMO_KEY = 'chm:mock-promotions'

function loadPromos(): LocalPromo[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(sessionStorage.getItem(PROMO_KEY) ?? '[]') }
  catch { return [] }
}

function savePromos(promos: LocalPromo[]) {
  sessionStorage.setItem(PROMO_KEY, JSON.stringify(promos))
}

function ListingCountdown({ endsAt }: { endsAt: string | null }) {
  const r = useCountdown(endsAt)
  if (!r) return <span className="text-slate-400 text-xs">หมดเวลาแล้ว</span>
  return (
    <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
      <Clock className="h-3 w-3" /> {r}
    </span>
  )
}

export default function ProviderPromotionsPage() {
  const { user } = useAuthGuard(['provider', 'superadmin'])
  const setPromotion = useSetPromotion()

  // Local mock state — mirrors sessionStorage
  const [promos, setPromos] = useState<LocalPromo[]>([])
  useEffect(() => { setPromos(loadPromos()) }, [])

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedListingId, setSelectedListingId] = useState('')
  const [discountPct, setDiscountPct] = useState(20)
  const [durationHours, setDurationHours] = useState(8)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const myListings = MOCK_LISTINGS.slice(0, 5) // simulate provider's own listings

  function getActivePromo(listingId: string): LocalPromo | null {
    const p = promos.find(p => p.listingId === listingId)
    if (!p) return null
    if (new Date(p.discountEndsAt) <= new Date()) return null
    return p
  }

  async function handleCreate() {
    if (!selectedListingId) return
    setSaving(true)
    const endsAt = new Date(Date.now() + durationHours * 3_600_000).toISOString()
    // call real API if available
    try {
      await setPromotion.mutateAsync({ listingId: selectedListingId, discountPercent: discountPct, discountEndsAt: endsAt })
    } catch {
      // mock fallback: store locally
    }
    const next = promos.filter(p => p.listingId !== selectedListingId)
    next.push({ listingId: selectedListingId, discountPercent: discountPct, discountEndsAt: endsAt })
    setPromos(next)
    savePromos(next)
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); setShowModal(false) }, 1200)
  }

  async function handleCancel(listingId: string) {
    try {
      await setPromotion.mutateAsync({ listingId, discountPercent: null, discountEndsAt: null })
    } catch { /* mock fallback */ }
    const next = promos.filter(p => p.listingId !== listingId)
    setPromos(next)
    savePromos(next)
  }

  const activeCount = promos.filter(p => new Date(p.discountEndsAt) > new Date()).length

  if (!user) return null

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* Breadcrumb */}
        <Link href="/dashboard/provider" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary mb-6">
          <ChevronLeft className="h-4 w-4" /> Provider Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="h-6 w-6 text-rose-500" /> Flash Sales & โปรโมชั่น
            </h1>
            <p className="text-sm text-slate-500 mt-1">จัดการโปรโมชั่นลดราคาชั่วคราวสำหรับบริการของคุณ</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setShowModal(true); setSaved(false) }}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-400 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-rose-200/40 hover:shadow-rose-300/50 transition-shadow">
            <Plus className="h-4 w-4" /> สร้างโปรโมชั่น
          </motion.button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-3xl font-extrabold text-rose-600">{activeCount}</p>
            <p className="text-xs text-slate-500 mt-1">โปรโมชั่นที่ใช้งานอยู่</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{myListings.length}</p>
            <p className="text-xs text-slate-500 mt-1">บริการทั้งหมด</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-3xl font-extrabold text-amber-600">{promos.length}</p>
            <p className="text-xs text-slate-500 mt-1">โปรโมชั่นรวมทั้งหมด</p>
          </div>
        </div>

        {/* Listings with promo status */}
        <div className="space-y-3">
          {myListings.map((listing) => {
            const promo = getActivePromo(listing.id)
            const isActive = !!promo
            return (
              <motion.div
                key={listing.id}
                layout
                className={`glass-card rounded-2xl p-4 flex items-center gap-4 ${isActive ? 'ring-2 ring-rose-400/40' : ''}`}>
                <div className="text-3xl w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl flex-shrink-0">
                  {listing.image}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{listing.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-500">฿{listing.price.toLocaleString()}/{listing.unit}</span>
                    {isActive && promo && (
                      <>
                        <span className="flex items-center gap-1 text-xs font-extrabold bg-rose-100 dark:bg-rose-900/30 text-rose-600 px-2 py-0.5 rounded-full">
                          <Zap className="h-2.5 w-2.5" /> -{promo.discountPercent}%
                        </span>
                        <span className="text-xs text-slate-500">
                          → ฿{Math.round(listing.price * (1 - promo.discountPercent / 100)).toLocaleString()}
                        </span>
                        <ListingCountdown endsAt={promo.discountEndsAt} />
                      </>
                    )}
                    {!isActive && (
                      <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">ไม่มีโปรโมชั่น</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isActive ? (
                    <button
                      onClick={() => handleCancel(listing.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-rose-600 border border-rose-200 dark:border-rose-700 px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" /> ยกเลิก
                    </button>
                  ) : (
                    <button
                      onClick={() => { setSelectedListingId(listing.id); setShowModal(true); setSaved(false) }}
                      className="flex items-center gap-1.5 text-xs font-bold text-rose-600 border border-rose-200 dark:border-rose-700 px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                      <Zap className="h-3.5 w-3.5" /> ตั้งโปรโมชั่น
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Create Promotion Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6">

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-rose-500" /> สร้าง Flash Sale
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Select listing */}
              <div className="mb-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">เลือกบริการ</label>
                <select
                  value={selectedListingId}
                  onChange={(e) => setSelectedListingId(e.target.value)}
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400/30">
                  <option value="">-- เลือกบริการ --</option>
                  {myListings.map((l) => (
                    <option key={l.id} value={l.id}>{l.image} {l.title} (฿{l.price}/{l.unit})</option>
                  ))}
                </select>
              </div>

              {/* Discount % */}
              <div className="mb-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  ส่วนลด: <span className="text-rose-600">{discountPct}%</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {DISCOUNT_PRESETS.map(p => (
                    <button key={p}
                      onClick={() => setDiscountPct(p)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors ${discountPct === p ? 'bg-rose-500 text-white border-rose-500' : 'glass text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>
                      -{p}%
                    </button>
                  ))}
                </div>
                <input type="range" min={5} max={80} step={5} value={discountPct}
                  onChange={(e) => setDiscountPct(parseInt(e.target.value))}
                  className="w-full accent-rose-500" />
              </div>

              {/* Duration */}
              <div className="mb-5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  ระยะเวลา: <span className="text-slate-900 dark:text-white">{durationHours < 24 ? `${durationHours} ชั่วโมง` : `${durationHours / 24} วัน`}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_PRESETS.map(p => (
                    <button key={p.hours}
                      onClick={() => setDurationHours(p.hours)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors ${durationHours === p.hours ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white' : 'glass text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {selectedListingId && (() => {
                const l = MOCK_LISTINGS.find(l => l.id === selectedListingId)
                if (!l) return null
                const finalPrice = Math.round(l.price * (1 - discountPct / 100))
                return (
                  <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-3 mb-5">
                    <p className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-1">ตัวอย่าง:</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{l.image}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{l.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-rose-600">฿{finalPrice.toLocaleString()}</span>
                          <span className="text-sm text-slate-400 line-through">฿{l.price.toLocaleString()}</span>
                          <span className="text-xs text-slate-500">/{l.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  ยกเลิก
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCreate}
                  disabled={!selectedListingId || saving}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                    saved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-rose-600 to-rose-400 text-white hover:shadow-lg hover:shadow-rose-200/40 disabled:opacity-50'
                  }`}>
                  {saved ? (
                    <><CheckCircle className="h-4 w-4" /> บันทึกแล้ว!</>
                  ) : saving ? (
                    '⏳ กำลังบันทึก...'
                  ) : (
                    <><Zap className="h-4 w-4" /> เริ่ม Flash Sale</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AppFooter />
    </main>
  )
}
