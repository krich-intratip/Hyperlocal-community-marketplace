'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { MapPin, Users, Calendar, ChevronRight, Search, Star } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const MOCK_COMMUNITIES = [
  { id: '1', name: 'หมู่บ้านศรีนคร', area: 'บางแค, กรุงเทพฯ', members: 248, providers: 34, rating: 4.8, emoji: '🏘️', tags: ['อาหาร', 'งานช่าง', 'งานบ้าน'], trial: true, trialEnd: '30 เม.ย. 2569' },
  { id: '2', name: 'คอนโด The Base', area: 'ลาดพร้าว, กรุงเทพฯ', members: 512, providers: 67, rating: 4.9, emoji: '🏙️', tags: ['อาหาร', 'ติวเตอร์', 'สุขภาพ'], trial: true, trialEnd: '15 มี.ค. 2569' },
  { id: '3', name: 'ชุมชนเมืองทอง', area: 'นนทบุรี', members: 890, providers: 120, rating: 4.7, emoji: '🌳', tags: ['อาหาร', 'งานช่าง', 'เกษตร'], trial: false, trialEnd: null },
  { id: '4', name: 'หมู่บ้านกรีนวิลล์', area: 'สมุทรปราการ', members: 156, providers: 22, rating: 4.6, emoji: '🌿', tags: ['งานบ้าน', 'ดูแลผู้สูงอายุ'], trial: true, trialEnd: '01 มิ.ย. 2569' },
  { id: '5', name: 'เมืองเชียงใหม่ซิตี้', area: 'เมือง, เชียงใหม่', members: 340, providers: 55, rating: 4.8, emoji: '⛰️', tags: ['อาหาร', 'สินค้าทำมือ', 'ท่องเที่ยว'], trial: false, trialEnd: null },
  { id: '6', name: 'ชุมชนริมน้ำ', area: 'ปทุมธานี', members: 203, providers: 31, rating: 4.5, emoji: '🌊', tags: ['เกษตร', 'อาหาร', 'Community Sharing'], trial: true, trialEnd: '20 พ.ค. 2569' },
]

export default function CommunitiesPage() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_COMMUNITIES.filter(
    (c) => c.name.includes(search) || c.area.includes(search) || c.tags.some((t) => t.includes(search))
  )

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          เลือก<span className="text-blue-600">ชุมชน</span>ของคุณ
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="text-lg text-slate-500 mb-8">
          ค้นหาชุมชนในพื้นที่ของคุณ แล้วเริ่มหาบริการที่ต้องการได้เลย
        </motion.p>

        {/* Search bar */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อชุมชน, พื้นที่, หรือประเภทบริการ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
          />
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
                  {community.trial && (
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200 whitespace-nowrap">
                      ฟรี
                    </span>
                  )}
                </div>

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
                  <div className="text-xs text-blue-600 font-medium">{community.providers} ผู้ให้บริการ</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
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
                    ช่วงทดลองฟรีถึง {community.trialEnd}
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
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-500">ไม่พบชุมชนที่ตรงกับคำค้นหา</p>
          </motion.div>
        )}

        {/* CTA — Request community */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mt-12 text-center">
          <p className="text-slate-500 mb-4">ไม่พบชุมชนของคุณ?</p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/communities/request"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors">
              ขอเปิดชุมชนใหม่ <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-slate-400">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}
