'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { Heart, Trash2, Star, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useWishlistStore } from '@/store/wishlist.store'
import { formatDateMedTH } from '@/lib/date-utils'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'เมื่อกี้'
  if (mins < 60) return `${mins} นาทีที่แล้ว`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days} วันที่แล้ว`
  return formatDateMedTH(iso)
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

const CAT_CHIP: Record<string, string> = {
  FOOD:              'cat-food',
  REPAIR:            'cat-repair',
  HOME_SERVICES:     'cat-home',
  TUTORING:          'cat-tutoring',
  ELDERLY_CARE:      'cat-elderly',
  HANDMADE:          'cat-handmade',
  HEALTH_WELLNESS:   'cat-health',
  AGRICULTURE:       'cat-agri',
  FREELANCE:         'cat-freelance',
  COMMUNITY_SHARING: 'cat-community',
}

const CAT_NAMES: Record<string, string> = {
  ALL: 'ทั้งหมด', FOOD: 'อาหาร', REPAIR: 'งานช่าง',
  HOME_SERVICES: 'งานบ้าน', TUTORING: 'สอนพิเศษ', ELDERLY_CARE: 'ดูแลผู้สูงอายุ',
  HANDMADE: 'สินค้าทำมือ', HEALTH_WELLNESS: 'สุขภาพ', AGRICULTURE: 'เกษตร',
  FREELANCE: 'ฟรีแลนซ์', COMMUNITY_SHARING: 'Community Sharing',
}

export default function SavedPage() {
  const { items, remove, clear, count } = useWishlistStore()
  const total = count()

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
              รายการที่บันทึกไว้
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {total > 0 ? `${total} รายการ` : 'ยังไม่มีรายการที่บันทึก'}
            </p>
          </div>
          {total > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              ล้างทั้งหมด
            </button>
          )}
        </motion.div>

        {/* Empty state */}
        {total === 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-7xl mb-5">🤍</div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
              ยังไม่มีรายการที่บันทึกไว้
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              กดไอคอน ❤️ บนสินค้าหรือบริการที่คุณสนใจ เพื่อบันทึกไว้ดูภายหลัง
            </p>
            <Link href="/marketplace"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-md">
              <ShoppingBag className="h-4 w-4" />
              สำรวจตลาด
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

        {/* Wishlist grid */}
        {total > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden" animate="show"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                  whileHover={{ y: -4, boxShadow: '0 16px 36px -10px rgba(239,68,68,0.12)' }}
                >
                  <div className="relative rounded-2xl glass-card overflow-hidden group">
                    {/* Remove button */}
                    <button
                      onClick={() => remove(item.id)}
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm opacity-90 hover:opacity-100 transition-all hover:scale-110"
                      title="ถอดออกจาก Wishlist"
                    >
                      <Heart className="h-3.5 w-3.5 fill-current" />
                    </button>

                    {/* Image placeholder */}
                    <Link href={`/marketplace/${item.id}`}>
                      <div className="h-36 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                        {item.image}
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link href={`/marketplace/${item.id}`}>
                        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{item.provider}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2 text-sm">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-200">{item.rating}</span>
                        <span className="text-slate-400 dark:text-slate-500">· {item.community}</span>
                      </div>

                      {/* Category chip */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${CAT_CHIP[item.category] ?? 'glass-sm text-slate-500'}`}>
                          {CAT_NAMES[item.category] ?? item.category}
                        </span>
                      </div>

                      {/* Price + added time */}
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                            ฿{item.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">/{item.priceUnit}</span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {relativeTime(item.addedAt)}
                        </span>
                      </div>

                      {/* CTA */}
                      <Link href={`/marketplace/${item.id}`}
                        className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Browse more CTA */}
        {total > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={items.length + 1}
            className="mt-10 flex justify-center">
            <Link href="/marketplace"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              สำรวจสินค้าเพิ่มเติม <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

      </section>

      <AppFooter />
    </main>
  )
}
