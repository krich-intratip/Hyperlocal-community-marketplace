'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { MapPin, Users, Star, Calendar, ChevronLeft, ChevronRight, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const MOCK_COMMUNITY = {
  id: '1',
  name: 'หมู่บ้านศรีนคร',
  area: 'บางแค, กรุงเทพฯ',
  emoji: '🏘️',
  description: 'ชุมชนอยู่อาศัยขนาดกลางในเขตบางแค กรุงเทพฯ มีผู้ให้บริการหลากหลายทั้งอาหาร ช่าง และบริการในบ้าน รองรับสมาชิกกว่า 248 ครัวเรือน',
  members: 248,
  providers: 34,
  rating: 4.8,
  totalBookings: 1204,
  trial: true,
  trialEnd: '30 เม.ย. 2569',
  admin: 'คุณประเสริฐ วงศ์สมบัติ',
  founded: 'ม.ค. 2567',
  tags: ['อาหาร', 'งานช่าง', 'งานบ้าน', 'สุขภาพ'],
}

const MOCK_PROVIDERS = [
  { id: '1', name: 'คุณแม่สมใจ', service: 'อาหารกล่อง', rating: 4.9, reviews: 128, emoji: '👩‍🍳', verified: true, category: 'FOOD' },
  { id: '2', name: 'ช่างสมชาย', service: 'ซ่อมแอร์ / ประปา', rating: 4.8, reviews: 87, emoji: '👨‍🔧', verified: true, category: 'REPAIR' },
  { id: '3', name: 'แม่บ้านสาวิตรี', service: 'ทำความสะอาดบ้าน', rating: 4.7, reviews: 64, emoji: '🧹', verified: true, category: 'HOME_SERVICES' },
  { id: '4', name: 'หมอนวดประเสริฐ', service: 'นวดแผนไทย', rating: 4.9, reviews: 45, emoji: '💆', verified: false, category: 'HEALTH_WELLNESS' },
]

const MOCK_RECENT = [
  { emoji: '🍱', title: 'ข้าวหน้าหมูทอด', provider: 'คุณแม่สมใจ', price: 80 },
  { emoji: '🔧', title: 'ล้างแอร์', provider: 'ช่างสมชาย', price: 500 },
  { emoji: '🧹', title: 'ทำความสะอาดรายสัปดาห์', provider: 'แม่บ้านสาวิตรี', price: 800 },
]

export default function CommunityDetailPage() {
  const community = MOCK_COMMUNITY

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/communities" className="hover:text-blue-600 flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" /> ชุมชนทั้งหมด
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{community.name}</span>
        </motion.div>

        {/* Hero card */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
          <div className="absolute top-4 right-6 text-7xl opacity-20">{community.emoji}</div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-4xl mb-2">{community.emoji}</div>
                <h1 className="text-3xl font-extrabold mb-1">{community.name}</h1>
                <div className="flex items-center gap-1.5 text-blue-200 text-sm">
                  <MapPin className="h-4 w-4" />{community.area}
                </div>
              </div>
              {community.trial && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/30">
                  <div className="text-xs text-blue-100 mb-1">ช่วงทดลอง</div>
                  <div className="font-bold text-sm">ฟรีถึง</div>
                  <div className="text-xs text-blue-100">{community.trialEnd}</div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: 'สมาชิก', value: community.members.toLocaleString() },
                { label: 'ผู้ให้บริการ', value: community.providers },
                { label: 'งานเสร็จแล้ว', value: community.totalBookings.toLocaleString() },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-extrabold">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* About */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-3">เกี่ยวกับชุมชน</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{community.description}</p>
              <div className="flex flex-wrap gap-2">
                {community.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Providers */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">ผู้ให้บริการในชุมชน</h2>
                <Link href={`/marketplace?community=${community.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  ดูทั้งหมด <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <motion.div variants={stagger} initial="hidden" animate="show"
                className="space-y-3">
                {MOCK_PROVIDERS.map((provider, i) => (
                  <motion.div key={provider.id} variants={fadeUp} custom={i}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
                      {provider.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 text-sm">{provider.name}</span>
                        {provider.verified && <Shield className="h-3.5 w-3.5 text-blue-500" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{provider.service}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-700">{provider.rating}</span>
                      <span className="text-slate-400 text-xs">({provider.reviews})</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Recent listings */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5">บริการล่าสุด</h2>
              <div className="space-y-3">
                {MOCK_RECENT.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.provider}</p>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">฿{item.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Join card */}
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="sticky top-24 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl p-6 space-y-4">
              <h3 className="font-bold text-slate-900">เข้าร่วมชุมชน</h3>

              {community.trial && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
                  <Calendar className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-700">ช่วงทดลองใช้ฟรี</p>
                    <p className="text-xs text-green-600">ถึง {community.trialEnd} — ไม่มีค่าใช้จ่าย</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                {[
                  { icon: CheckCircle, label: `ผู้ให้บริการ ${community.providers} ราย` },
                  { icon: Star, label: `คะแนนเฉลี่ย ${community.rating}/5.0` },
                  { icon: Users, label: `สมาชิก ${community.members.toLocaleString()} คน` },
                  { icon: Shield, label: 'ผู้ให้บริการผ่านการยืนยัน' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-slate-600">
                    <item.icon className="h-4 w-4 text-blue-500" />
                    {item.label}
                  </div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link href="/auth/signin"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                  เข้าร่วมชุมชน <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <p className="text-center text-xs text-slate-400">
                Community Admin: {community.admin}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-slate-400">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}
