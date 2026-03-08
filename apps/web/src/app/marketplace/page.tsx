'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { Search, MapPin, Star, Filter, ChevronRight, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

const CATEGORIES = [
  { slug: 'ALL', name: 'ทั้งหมด', icon: '🛍️' },
  { slug: 'FOOD', name: 'อาหาร', icon: '🍱' },
  { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧' },
  { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠' },
  { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚' },
  { slug: 'ELDERLY_CARE', name: 'ดูแลผู้สูงอายุ', icon: '👴' },
  { slug: 'HANDMADE', name: 'สินค้าทำมือ', icon: '🎨' },
  { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ', icon: '💆' },
  { slug: 'AGRICULTURE', name: 'เกษตร', icon: '🌿' },
  { slug: 'FREELANCE', name: 'ฟรีแลนซ์', icon: '💻' },
  { slug: 'COMMUNITY_SHARING', name: 'Community Sharing', icon: '🤝' },
]

const MOCK_LISTINGS = [
  { id: '1', title: 'ทำอาหารกล่องส่งถึงที่', provider: 'คุณแม่สมใจ', category: 'FOOD', price: 80, unit: 'กล่อง', rating: 4.9, reviews: 128, community: 'หมู่บ้านศรีนคร', distance: '0.3 กม.', image: '🍱', tags: ['ข้าว', 'ส้มตำ', 'ลาบ'], verified: true },
  { id: '2', title: 'ซ่อมแอร์บ้าน ล้างแอร์', provider: 'ช่างสมชาย', category: 'REPAIR', price: 500, unit: 'ครั้ง', rating: 4.8, reviews: 87, community: 'หมู่บ้านศรีนคร', distance: '0.8 กม.', image: '🔧', tags: ['แอร์', 'ซ่อม', 'ล้าง'], verified: true },
  { id: '3', title: 'สอนภาษาอังกฤษเด็กประถม', provider: 'ครูน้องใหม่', category: 'TUTORING', price: 300, unit: 'ชั่วโมง', rating: 5.0, reviews: 42, community: 'คอนโด The Base', distance: '1.2 กม.', image: '📚', tags: ['ภาษาอังกฤษ', 'ประถม', 'Online'], verified: true },
  { id: '4', title: 'ทำความสะอาดบ้านรายวัน', provider: 'บริษัท Clean Home', category: 'HOME_SERVICES', price: 800, unit: 'ครั้ง', rating: 4.7, reviews: 203, community: 'คอนโด The Base', distance: '0.5 กม.', image: '🏠', tags: ['บ้าน', 'คอนโด', 'รายวัน'], verified: true },
  { id: '5', title: 'ดูแลผู้สูงอายุกลางวัน', provider: 'คุณสมศรี', category: 'ELDERLY_CARE', price: 1200, unit: 'วัน', rating: 4.9, reviews: 31, community: 'ชุมชนเมืองทอง', distance: '2.1 กม.', image: '👴', tags: ['ผู้สูงอายุ', 'กลางวัน', 'บ้าน'], verified: false },
  { id: '6', title: 'กระเป๋าผ้าทอมือ handmade', provider: 'ร้านป้าแดง', category: 'HANDMADE', price: 350, unit: 'ใบ', rating: 4.8, reviews: 56, community: 'เมืองเชียงใหม่ซิตี้', distance: '3.4 กม.', image: '🎨', tags: ['กระเป๋า', 'ผ้าทอ', 'Handmade'], verified: true },
  { id: '7', title: 'นวดแผนไทย ออกนอกสถานที่', provider: 'หมอนวดประเสริฐ', category: 'HEALTH_WELLNESS', price: 400, unit: 'ชั่วโมง', rating: 4.9, reviews: 74, community: 'หมู่บ้านกรีนวิลล์', distance: '1.8 กม.', image: '💆', tags: ['นวด', 'แผนไทย', 'ถึงบ้าน'], verified: true },
  { id: '8', title: 'ผักออร์แกนิคส่งรายสัปดาห์', provider: 'สวนคุณลุงทอง', category: 'AGRICULTURE', price: 250, unit: 'ชุด', rating: 4.7, reviews: 38, community: 'ชุมชนริมน้ำ', distance: '4.2 กม.', image: '🌿', tags: ['ผัก', 'ออร์แกนิค', 'ส่งบ้าน'], verified: false },
  { id: '9', title: 'ออกแบบ Logo & Brand Identity', provider: 'ดีไซเนอร์เอ', category: 'FREELANCE', price: 3500, unit: 'งาน', rating: 4.8, reviews: 19, community: 'คอนโด The Base', distance: '0.9 กม.', image: '💻', tags: ['Logo', 'Design', 'Brand'], verified: true },
  { id: '10', title: 'ยืม-คืนอุปกรณ์ทำครัว', provider: 'Community Pool', category: 'COMMUNITY_SHARING', price: 50, unit: 'วัน', rating: 4.6, reviews: 22, community: 'ชุมชนเมืองทอง', distance: '0.7 กม.', image: '🤝', tags: ['ยืม', 'อุปกรณ์', 'แชร์'], verified: false },
  { id: '11', title: 'ซ่อมท่อน้ำ-ประปา', provider: 'ช่างวิชัย', category: 'REPAIR', price: 400, unit: 'ครั้ง', rating: 4.6, reviews: 52, community: 'หมู่บ้านศรีนคร', distance: '0.6 กม.', image: '🔧', tags: ['ท่อน้ำ', 'ประปา', 'ด่วน'], verified: true },
  { id: '12', title: 'อาหารคลีนออเดอร์ล่วงหน้า', provider: 'ครัวคลีนคลีน', category: 'FOOD', price: 120, unit: 'กล่อง', rating: 4.9, reviews: 95, community: 'คอนโด The Base', distance: '1.0 กม.', image: '🥗', tags: ['คลีน', 'ไดเอท', 'รายวัน'], verified: true },
]

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  const filtered = MOCK_LISTINGS
    .filter((l) => activeCategory === 'ALL' || l.category === activeCategory)
    .filter((l) => !search || l.title.includes(search) || l.provider.includes(search) || l.tags.some((t) => t.includes(search)))
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : a.price - b.price)

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      {/* Hero / Search */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            ค้นหา<span className="text-blue-600">บริการ</span>ในชุมชน
          </h1>
          <p className="text-slate-500 mb-6">พบ {MOCK_LISTINGS.length} บริการจากผู้ให้บริการในชุมชนของคุณ</p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาบริการ, ผู้ให้บริการ, แท็ก..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white/90 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3.5 rounded-2xl border border-slate-200 bg-white/90 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
          >
            <option value="rating">⭐ คะแนนสูงสุด</option>
            <option value="price">💰 ราคาต่ำสุด</option>
          </select>
        </motion.div>
      </section>

      {/* Category tabs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.slug}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(cat.slug)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat.slug
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                  : 'bg-white/80 text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Listings Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">{filtered.length} รายการ</p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <SlidersHorizontal className="h-4 w-4" />
            <span>กรอง</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-500">ไม่พบบริการที่ตรงกัน</p>
          </motion.div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((listing, i) => (
              <motion.div key={listing.id} variants={fadeUp} custom={i}
                whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(37,99,235,0.12)' }}>
                <Link href={`/marketplace/${listing.id}`}
                  className="block rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-100 shadow-sm hover:border-blue-200 transition-all overflow-hidden group">
                  {/* Image placeholder */}
                  <div className="h-36 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center text-5xl">
                    {listing.image}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                        {listing.title}
                      </h3>
                      {listing.verified && (
                        <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center" title="ยืนยันตัวตนแล้ว">
                          <span className="text-xs">✓</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mb-2">{listing.provider}</p>

                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-600">{listing.rating}</span>
                        <span>({listing.reviews})</span>
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {listing.distance}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {listing.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-slate-900">
                          ฿{listing.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">/{listing.unit}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-slate-400">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}
