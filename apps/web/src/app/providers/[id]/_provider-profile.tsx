'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  MapPin, Star, Shield, Clock, ChevronLeft, CheckCircle,
  MessageCircle, ChevronRight, Calendar, Package, Award,
} from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const MOCK_PROVIDER = {
  id: '1',
  name: 'คุณแม่สมใจ',
  avatar: '👩‍🍳',
  tagline: 'อาหารกล่องทำมือ ส่งตรงถึงบ้าน',
  bio: 'รับทำอาหารกล่องหลากหลายเมนู ทั้งข้าวราดแกง อาหารตามสั่ง ส้มตำ ลาบ ทำจากวัตถุดิบสดใหม่ทุกวัน ประสบการณ์กว่า 5 ปี ในชุมชนหมู่บ้านศรีนคร ลูกค้าประจำกว่า 80 ครัวเรือน',
  verified: true,
  online: true,
  trustScore: 98,
  rating: 4.9,
  reviews: 128,
  completedBookings: 342,
  memberSince: 'ม.ค. 2567',
  community: 'หมู่บ้านศรีนคร',
  communityId: '1',
  area: 'บางแค, กรุงเทพฯ',
  responseTime: '< 1 ชั่วโมง',
  category: 'อาหารและเครื่องดื่ม',
  badges: ['ยืนยันตัวตน', 'Top Provider', 'ส่งตรงเวลา 100%'],
  availableDays: [0, 1, 2, 3, 4],
  openTime: '07:00',
  closeTime: '17:00',
}

const MOCK_LISTINGS = [
  { id: '1', title: 'ทำอาหารกล่องส่งถึงที่', price: 80, unit: 'กล่อง', image: '🍱', rating: 4.9, reviews: 128, available: true },
  { id: '2', title: 'ส้มตำถาด', price: 60, unit: 'ถาด', image: '🥗', rating: 4.8, reviews: 64, available: true },
  { id: '3', title: 'ลาบหมูรสเด็ด', price: 70, unit: 'จาน', image: '🍖', rating: 4.7, reviews: 42, available: false },
]

const MOCK_REVIEWS = [
  { id: '1', user: 'คุณวิภา', rating: 5, comment: 'อร่อยมาก ส้มตำรสจัดถูกใจ ส่งตรงเวลาทุกวัน', date: '5 มี.ค. 2569', avatar: '👩' },
  { id: '2', user: 'คุณสมศักดิ์', rating: 5, comment: 'สั่งรายเดือนมา 3 เดือนแล้ว ไม่เคยผิดหวัง ราคาคุ้มมาก', date: '28 ก.พ. 2569', avatar: '👨' },
  { id: '3', user: 'คุณนิตยา', rating: 4, comment: 'รสชาติดี วัตถุดิบสด ปริมาณพอดี แนะนำเมนูลาบ', date: '20 ก.พ. 2569', avatar: '👩‍💼' },
]

const DAY_LABELS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

export default function ProviderProfileClient() {
  const provider = MOCK_PROVIDER

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/marketplace" className="hover:text-blue-600 flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" /> Marketplace
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{provider.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left col ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero card */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-28 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600" />
              <div className="px-6 pb-6">
                <div className="flex items-end justify-between -mt-10 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                    {provider.avatar}
                  </div>
                  {provider.online ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> ออนไลน์
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">ออฟไลน์</span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h1 className="text-xl font-extrabold text-slate-900">{provider.name}</h1>
                      {provider.verified && <Shield className="h-4 w-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-slate-500">{provider.tagline}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{provider.category}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-xl font-extrabold text-slate-900">{provider.rating}</span>
                    <span className="text-sm text-slate-400">({provider.reviews})</span>
                  </div>
                </div>

                {/* Trust score */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-20 flex-shrink-0">Trust Score</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${provider.trustScore}%` }} />
                  </div>
                  <span className="text-sm font-extrabold text-blue-600">{provider.trustScore}</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {provider.badges.map((badge) => (
                    <span key={badge}
                      className="flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                      <Award className="h-3 w-3" /> {badge}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{provider.bio}</p>

                {/* Available days */}
                <div className="flex items-center gap-1.5 mt-4 flex-wrap">
                  {DAY_LABELS.map((d, idx) => (
                    <span key={idx} className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                      provider.availableDays.includes(idx)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-300'
                    }`}>{d}</span>
                  ))}
                  <span className="text-xs text-slate-400 ml-1">
                    {provider.openTime}–{provider.closeTime} น.
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={stagger} initial="hidden" animate="show"
              className="grid grid-cols-3 gap-3">
              {[
                { icon: CheckCircle, label: 'งานเสร็จแล้ว', value: `${provider.completedBookings} งาน`, color: 'text-green-600', bg: 'bg-green-50' },
                { icon: Clock, label: 'ตอบกลับ', value: provider.responseTime, color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Calendar, label: 'สมาชิกตั้งแต่', value: provider.memberSince, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((s, i) => (
                <motion.div key={s.label} variants={fadeUp} custom={i}
                  className={`${s.bg} rounded-2xl p-4 text-center border border-slate-100`}>
                  <s.icon className={`h-5 w-5 ${s.color} mx-auto mb-1.5`} />
                  <div className="font-extrabold text-sm text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Listings */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-blue-500" />
                <h2 className="font-extrabold text-lg text-slate-900">บริการทั้งหมด</h2>
              </div>
              <div className="space-y-3">
                {MOCK_LISTINGS.map((listing, i) => (
                  <motion.div key={listing.id} variants={fadeUp} custom={i} whileHover={{ x: 4 }}>
                    <Link href={`/marketplace/${listing.id}` as any}
                      className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {listing.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm">{listing.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${listing.available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {listing.available ? 'รับงาน' : 'งานเต็ม'}
                          </span>
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-slate-600">{listing.rating}</span>
                          <span className="text-xs text-slate-400">({listing.reviews})</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-extrabold text-blue-600">฿{listing.price}</div>
                        <div className="text-xs text-slate-400">/{listing.unit}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-extrabold text-lg text-slate-900">รีวิว ({provider.reviews})</h2>
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-2xl font-extrabold text-slate-900">{provider.rating}</span>
                </div>
              </div>
              <div className="space-y-5">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-800">{review.user}</span>
                        <span className="text-xs text-slate-400">{review.date}</span>
                      </div>
                      <div className="flex mb-1.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right col: Contact card ── */}
          <div className="lg:col-span-1">
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="sticky top-24 space-y-4">

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl p-6">
                <h3 className="font-extrabold text-slate-900 mb-4">ติดต่อผู้ให้บริการ</h3>
                <div className="space-y-3 mb-5 text-sm">
                  {[
                    { icon: MapPin, label: provider.community },
                    { icon: MapPin, label: provider.area },
                    { icon: Clock, label: `ตอบกลับ ${provider.responseTime}` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-slate-600">
                      <item.icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      {item.label}
                    </div>
                  ))}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/auth/signin"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                    <MessageCircle className="h-4 w-4" /> ส่งข้อความ
                  </Link>
                </motion.div>
                <p className="mt-3 text-center text-xs text-slate-400">ไม่มีค่าใช้จ่ายในการติดต่อ</p>
              </div>

              {/* Community link */}
              <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">ชุมชน</p>
                <Link href={`/communities/${provider.communityId}` as any}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">🏘️</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-800">{provider.community}</p>
                    <p className="text-xs text-slate-500">{provider.area}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </Link>
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
