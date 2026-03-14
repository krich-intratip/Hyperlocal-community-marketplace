'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import {
  ChevronLeft, Package, AlertTriangle, CheckCircle2, XCircle,
  Infinity, Edit2, RefreshCw, Loader2, Search, Filter,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useProviderInventory, useUpdateStock } from '@/hooks/useInventory'
import type { InventoryListing } from '@/lib/api'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.05 } }),
}

// ── Stock status helper ───────────────────────────────────────────────────────

function stockStatus(l: InventoryListing): 'unlimited' | 'ok' | 'low' | 'out' {
  if (l.stockQty === null) return 'unlimited'
  if (l.stockQty === 0)   return 'out'
  if (l.stockQty <= l.lowStockThreshold) return 'low'
  return 'ok'
}

const STATUS_CFG = {
  unlimited: { label: 'ไม่จำกัด',   cls: 'bg-slate-100 text-slate-500',   bar: 'bg-slate-300',   icon: Infinity },
  ok:        { label: 'มีสต็อก',    cls: 'bg-green-100 text-green-700',   bar: 'bg-green-500',   icon: CheckCircle2 },
  low:       { label: 'ใกล้หมด',   cls: 'bg-amber-100 text-amber-700',   bar: 'bg-amber-400',   icon: AlertTriangle },
  out:       { label: 'หมดสต็อก',  cls: 'bg-red-100 text-red-600',       bar: 'bg-red-500',     icon: XCircle },
}

// ── Edit stock modal ──────────────────────────────────────────────────────────

function EditStockModal({
  listing,
  onClose,
}: {
  listing: InventoryListing
  onClose: () => void
}) {
  const [mode, setMode] = useState<'tracked' | 'unlimited'>(
    listing.stockQty === null ? 'unlimited' : 'tracked',
  )
  const [qty, setQty]         = useState(listing.stockQty ?? 0)
  const [threshold, setThresh] = useState(listing.lowStockThreshold)
  const { mutate, isPending }  = useUpdateStock()

  function save() {
    mutate(
      {
        id: listing.id,
        data: {
          stockQty: mode === 'unlimited' ? null : qty,
          lowStockThreshold: threshold,
        },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-heavy rounded-3xl shadow-2xl w-full max-w-sm p-7"
      >
        <h3 className="font-extrabold text-slate-900 text-lg mb-1">จัดการสต็อก</h3>
        <p className="text-sm text-slate-500 mb-5 truncate">{listing.title}</p>

        {/* Mode selector */}
        <div className="flex gap-2 mb-5">
          {(['tracked', 'unlimited'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === m
                  ? 'bg-primary text-white shadow-sm'
                  : 'glass-sm text-slate-600 hover:text-primary'
              }`}>
              {m === 'tracked' ? '📦 ติดตามสต็อก' : '∞ ไม่จำกัด'}
            </button>
          ))}
        </div>

        {mode === 'tracked' && (
          <div className="space-y-4 mb-5">
            {/* Stock quantity */}
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block">จำนวนสต็อกปัจจุบัน</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(Math.max(0, qty - 1))}
                  className="w-9 h-9 rounded-xl glass-sm font-bold text-slate-700 hover:bg-slate-200 transition-all">
                  −
                </button>
                <input
                  type="number" min={0} value={qty}
                  onChange={e => setQty(Math.max(0, Number(e.target.value)))}
                  className="flex-1 text-center font-extrabold text-xl bg-transparent border border-slate-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 rounded-xl glass-sm font-bold text-slate-700 hover:bg-slate-200 transition-all">
                  +
                </button>
              </div>
              {qty === 0 && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">
                  ⚠️ ตั้ง 0 จะปิดการมองเห็น listing โดยอัตโนมัติ
                </p>
              )}
            </div>

            {/* Low stock threshold */}
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                แจ้งเตือนเมื่อสต็อก ≤ <span className="text-amber-600">{threshold}</span> ชิ้น
              </label>
              <input
                type="range" min={1} max={20} value={threshold}
                onChange={e => setThresh(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                <span>1</span><span>10</span><span>20</span>
              </div>
            </div>
          </div>
        )}

        {mode === 'unlimited' && (
          <div className="glass-sm rounded-xl p-4 mb-5 text-sm text-slate-500 flex items-center gap-2">
            <Infinity className="h-4 w-4 text-slate-400" />
            ไม่ติดตามสต็อก — ลูกค้าสั่งได้ไม่จำกัด
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl glass-sm text-sm font-bold text-slate-600">
            ยกเลิก
          </button>
          <button onClick={save} disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            บันทึก
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

type StockFilter = 'all' | 'tracked' | 'low' | 'out'

export default function ProviderInventoryPage() {
  useAuthGuard(['provider', 'admin', 'superadmin'])
  const [filter, setFilter]   = useState<StockFilter>('all')
  const [search, setSearch]   = useState('')
  const [editing, setEditing] = useState<InventoryListing | null>(null)

  const { data = [], isLoading, refetch, isFetching } = useProviderInventory()

  // Summary counts
  const lowCount = data.filter(l => stockStatus(l) === 'low').length
  const outCount = data.filter(l => stockStatus(l) === 'out').length
  const trackedCount = data.filter(l => l.stockQty !== null).length

  const filtered = data.filter(l => {
    const q = search.toLowerCase()
    if (q && !l.title.toLowerCase().includes(q)) return false
    if (filter === 'tracked') return l.stockQty !== null
    if (filter === 'low')    return stockStatus(l) === 'low'
    if (filter === 'out')    return stockStatus(l) === 'out'
    return true
  })

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard/provider" className="hover:text-primary flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" /> Provider Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">คลังสินค้า</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="h-6 w-6 text-violet-500" /> คลังสินค้า
            </h1>
            <p className="text-sm text-slate-500 mt-1">จัดการสต็อกสินค้าและรับการแจ้งเตือนสต็อกต่ำ</p>
          </div>
          <button onClick={() => refetch()} disabled={isFetching}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-sm text-xs font-bold text-slate-600 hover:text-primary disabled:opacity-50 transition-all">
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            รีเฟรช
          </button>
        </motion.div>

        {/* Summary KPI row */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'รายการทั้งหมด',  value: data.length,    cls: 'text-slate-700',  bg: 'glass-sm' },
            { label: 'ใกล้หมดสต็อก', value: lowCount,        cls: 'text-amber-600', bg: 'bg-amber-50/80 border-amber-200' },
            { label: 'หมดสต็อก',      value: outCount,        cls: 'text-red-600',   bg: 'bg-red-50/80 border-red-200' },
          ].map(k => (
            <div key={k.label} className={`${k.bg} border rounded-2xl p-4 text-center`}>
              <div className={`text-2xl font-extrabold ${k.cls}`}>{k.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Alerts — low / out stock */}
        {(lowCount > 0 || outCount > 0) && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="rounded-2xl bg-amber-50/80 border border-amber-200 px-4 py-3 mb-5 flex items-start gap-2.5">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              {outCount > 0 && <><strong>{outCount} รายการหมดสต็อก</strong> — ลูกค้าจะไม่เห็น listing เหล่านี้</>}
              {outCount > 0 && lowCount > 0 && <br />}
              {lowCount > 0 && <><strong>{lowCount} รายการสต็อกเหลือน้อย</strong> — กรุณาเติมสต็อกเร็วๆ นี้</>}
            </p>
          </motion.div>
        )}

        {/* Search + Filter */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 glass-sm rounded-xl px-3 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-1.5">
            {([
              { key: 'all', label: 'ทั้งหมด' },
              { key: 'tracked', label: `ติดตาม (${trackedCount})` },
              { key: 'low', label: `⚠️ ต่ำ (${lowCount})` },
              { key: 'out', label: `❌ หมด (${outCount})` },
            ] as const).map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filter === f.key ? 'bg-primary text-white' : 'glass-sm text-slate-600 hover:text-primary'
                }`}>
                <Filter className="h-3 w-3 inline mr-1" />{f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Listing grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">ไม่พบสินค้าที่ตรงกัน</p>
          </div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="glass-card rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/10">
              {filtered.map((listing, i) => {
                const ss = stockStatus(listing)
                const cfg = STATUS_CFG[ss]
                const pct = listing.stockQty !== null
                  ? Math.min(100, Math.round((listing.stockQty / Math.max(1, listing.stockQty + listing.lowStockThreshold * 2)) * 100))
                  : 100

                return (
                  <motion.div key={listing.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/20 transition-colors">

                    {/* Image / emoji */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center flex-shrink-0 text-2xl overflow-hidden">
                      {listing.images?.[0]
                        ? <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                        : '📦'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-slate-800 text-sm truncate">{listing.title}</p>
                        {listing.status === 'INACTIVE' && (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            ปิดอยู่
                          </span>
                        )}
                      </div>

                      {/* Stock bar */}
                      {ss !== 'unlimited' ? (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${cfg.bar} rounded-full transition-all`}
                              style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-600 flex-shrink-0">
                            {listing.stockQty} ชิ้น
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 mt-0.5">ไม่จำกัด</p>
                      )}
                    </div>

                    {/* Status badge */}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1 ${cfg.cls}`}>
                      <cfg.icon className="h-3 w-3" />
                      {cfg.label}
                    </span>

                    {/* Edit button */}
                    <button onClick={() => setEditing(listing)}
                      className="w-8 h-8 rounded-xl glass-sm flex items-center justify-center text-slate-500 hover:text-primary transition-colors flex-shrink-0">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </section>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <EditStockModal listing={editing} onClose={() => setEditing(null)} />
        )}
      </AnimatePresence>

      <AppFooter />
    </main>
  )
}
