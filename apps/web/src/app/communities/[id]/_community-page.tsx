'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  MapPin, Users, Star, Calendar, ChevronLeft, ChevronRight,
  Shield, CheckCircle, Bell, Megaphone, Crown, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const MOCK_COMMUNITY = {
  id: '1', name: 'หมู่บ้านศรีนคร', area: 'บางแค, กรุงเทพฯ', emoji: '🏘️',
  description: 'ชุมชนอยู่อาศัยขนาดกลางในเขตบางแค กรุงเทพฯ มีผู้ให้บริการหลากหลายทั้งอาหาร ช่าง และบริการในบ้าน รองรับสมาชิกกว่า 248 ครัวเรือน',
  members: 248, providers: 34, rating: 4.8, totalBookings: 1204,
  trial: true, trialEnd: '30 เม.ย. 2569',
  admin: 'คุณประเสริฐ วงศ์สมบัติ', founded: 'ม.ค. 2567',
  tags: ['อาหาร', 'งานช่าง', 'งานบ้าน', 'สุขภาพ'],
}

const MOCK_PROVIDERS = [
  { id: '1', name: 'คุณแม่สมใจ', service: 'อาหารกล่อง', rating: 4.9, reviews: 128, emoji: '👩‍🍳', verified: true, category: 'FOOD' },
  { id: '2', name: 'ช่างสมชาย', service: 'ซ่อมแอร์ / ประปา', rating: 4.8, reviews: 87, emoji: '👨‍🔧', verified: true, category: 'REPAIR' },
  { id: '3', name: 'แม่บ้านสาวิตรี', service: 'ทำความสะอาดบ้าน', rating: 4.7, reviews: 64, emoji: '🧹', verified: true, category: 'HOME_SERVICES' },
  { id: '4', name: 'หมอนวดประเสริฐ', service: 'นวดแผนไทย', rating: 4.9, reviews: 45, emoji: '💆', verified: false, category: 'HEALTH_WELLNESS' },
  { id: '5', name: 'ครูมาลี', service: 'สอนคณิตศาสตร์ ม.ต้น', rating: 4.8, reviews: 38, emoji: '📚', verified: true, category: 'TUTORING' },
  { id: '6', name: 'น้องเบล', service: 'ดูแลผู้สูงอายุ', rating: 5.0, reviews: 22, emoji: '👵', verified: true, category: 'ELDERLY_CARE' },
]

const MOCK_RECENT = [
  { emoji: '🍱', title: 'ข้าวหน้าหมูทอด', provider: 'คุณแม่สมใจ', price: 80 },
  { emoji: '🔧', title: 'ล้างแอร์', provider: 'ช่างสมชาย', price: 500 },
  { emoji: '🧹', title: 'ทำความสะอาดรายสัปดาห์', provider: 'แม่บ้านสาวิตรี', price: 800 },
]

const PROVIDER_CATEGORIES = [
  { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 10 },
  { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 7 },
  { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 6 },
  { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ', icon: '💆', color: 'bg-pink-50 border-pink-100', bar: 'bg-pink-400', count: 5 },
  { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚', color: 'bg-purple-50 border-purple-100', bar: 'bg-purple-400', count: 4 },
  { slug: 'ELDERLY_CARE', name: 'ดูแลผู้สูงอายุ', icon: '👵', color: 'bg-teal-50 border-teal-100', bar: 'bg-teal-400', count: 2 },
]

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
    title: 'ช่วงทดลองใช้งาน 90 วัน', createdAt: '10 มี.ค. 2569',
    body: 'ทุกชุมชนได้รับช่วงทดลองใช้งานระบบฟรี 90 วัน ไม่มีค่าธรรมเนียมและค่า Commission ในช่วงนี้ ใช้โอกาสนี้ Onboard ผู้ให้บริการและสร้างฐานสมาชิกได้เลย',
  },
  {
    id: 2, fromSA: false, authorName: 'คุณประเสริฐ วงศ์สมบัติ', authorBadge: 'Community Admin',
    title: 'ประกาศรับสมัครผู้ให้บริการอาหาร', createdAt: '15 มี.ค. 2569',
    body: 'ขณะนี้ชุมชนหมู่บ้านศรีนครต้องการผู้ให้บริการอาหาร เช่น ข้าวกล่อง ขนม อาหารเช้า เพิ่มเติม สนใจสมัครได้เลยที่เมนู "สมัครเป็นผู้ให้บริการ"',
  },
]

export default function CommunityDetailClient() {
  const community = MOCK_COMMUNITY
  const maxCount = Math.max(...PROVIDER_CATEGORIES.map(c => c.count))

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
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[
                { label: 'สมาชิก', value: community.members.toLocaleString() },
                { label: 'ผู้ให้บริการ', value: community.providers },
                { label: 'งานเสร็จแล้ว', value: community.totalBookings.toLocaleString() },
                { label: 'คะแนน', value: `${community.rating}★` },
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

            {/* Announcements */}
            {MOCK_ANNOUNCEMENTS.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
                className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone className="h-5 w-5 text-amber-500" />
                  <h2 className="font-bold text-slate-900">ประกาศจากชุมชน</h2>
                </div>
                <div className="space-y-4">
                  {MOCK_ANNOUNCEMENTS.map((ann, i) => (
                    <motion.div key={ann.id} variants={fadeUp} custom={i}
                      className={`rounded-xl p-4 border ${ann.fromSA ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${ann.fromSA ? 'bg-blue-600' : 'bg-amber-500'}`}>
                          {ann.fromSA
                            ? <Crown className="h-4 w-4 text-white" />
                            : <Bell className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ann.fromSA ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'}`}>
                              {ann.authorBadge}
                            </span>
                            <span className="text-xs text-slate-500">{ann.authorName}</span>
                            <span className="text-xs text-slate-400 ml-auto">{ann.createdAt}</span>
                          </div>
                          <p className="font-semibold text-slate-900 text-sm mb-1">{ann.title}</p>
                          <p className="text-slate-600 text-xs leading-relaxed">{ann.body}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* About */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-3">เกี่ยวกับชุมชน</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{community.description}</p>
              <div className="flex flex-wrap gap-2">
                {community.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </motion.div>

            {/* Provider Infographic */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-slate-900">ผู้ให้บริการในชุมชน</h2>
                <Link href={`/marketplace?community=${community.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  ดูทั้งหมด <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <p className="text-xs text-slate-500 mb-5">รวม {community.providers} ราย ใน {PROVIDER_CATEGORIES.length} หมวด</p>

              {/* Bar infographic */}
              <div className="space-y-3 mb-6">
                {PROVIDER_CATEGORIES.map((cat) => (
                  <div key={cat.slug} className="flex items-center gap-3">
                    <span className="text-lg w-7 flex-shrink-0 text-center">{cat.icon}</span>
                    <span className="text-xs text-slate-600 w-20 flex-shrink-0">{cat.name}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${cat.bar}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(cat.count / maxCount) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-8 text-right">{cat.count}</span>
                  </div>
                ))}
              </div>

              {/* Provider cards */}
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
                {MOCK_PROVIDERS.slice(0, 4).map((provider, i) => (
                  <motion.div key={provider.id} variants={fadeUp} custom={i}
                    whileHover={{ x: 4 }}>
                  <Link href={`/marketplace?community=${community.id}&provider=${provider.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">
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
                  </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Recent listings */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
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

          {/* Right: Join + category summary cards */}
          <div className="space-y-5">
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="sticky top-24 space-y-4">

              {/* Join card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl p-6 space-y-4">
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
                    เข้าร่วมเป็นลูกค้า <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <Link href="/providers/apply"
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
                  สมัครเป็นผู้ให้บริการ <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <p className="text-center text-xs text-slate-400">CA: {community.admin}</p>
              </div>

              {/* Category count mini-cards */}
              <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">หมวดที่มีในชุมชน</p>
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDER_CATEGORIES.map(cat => (
                    <div key={cat.slug} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cat.color}`}>
                      <span className="text-base">{cat.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-700">{cat.count} ราย</div>
                        <div className="text-xs text-slate-500 leading-tight">{cat.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
