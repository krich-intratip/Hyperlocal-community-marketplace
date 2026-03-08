'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { MapPin, Star, Shield, Clock, Phone, Calendar, ChevronLeft, ChevronRight, CheckCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}

const MOCK_LISTING = {
  id: '1',
  title: 'ทำอาหารกล่องส่งถึงที่',
  description: 'รับทำอาหารกล่องหลากหลายเมนู ทั้งข้าวราดแกง อาหารตามสั่ง ส้มตำ ลาบ ทำจากวัตถุดิบสด ปรุงรสอร่อย สั่งล่วงหน้า 1 วัน จัดส่งถึงบ้านในรัศมี 3 กม. ราคาเหมาะสม รับทั้งแบบรายวันและรายเดือน',
  provider: 'คุณแม่สมใจ',
  providerAvatar: '👩‍🍳',
  providerSince: 'ม.ค. 2567',
  providerVerified: true,
  providerTrustScore: 98,
  category: 'FOOD',
  price: 80,
  unit: 'กล่อง',
  rating: 4.9,
  reviews: 128,
  community: 'หมู่บ้านศรีนคร',
  area: 'บางแค, กรุงเทพฯ',
  distance: '0.3 กม.',
  image: '🍱',
  tags: ['ข้าว', 'ส้มตำ', 'ลาบ', 'อาหารตามสั่ง', 'ส่งถึงบ้าน'],
  availability: ['จ–ศ 07:00–18:00', 'ส–อา 08:00–14:00'],
  responseTime: 'ตอบกลับใน < 1 ชั่วโมง',
  completedBookings: 342,
}

const MOCK_REVIEWS = [
  { id: '1', user: 'คุณวิภา', rating: 5, comment: 'อร่อยมาก ส้มตำรสจัดถูกใจ ส่งตรงเวลาทุกวัน', date: '5 มี.ค. 2569', avatar: '👩' },
  { id: '2', user: 'คุณสมศักดิ์', rating: 5, comment: 'สั่งรายเดือนมา 3 เดือนแล้ว ไม่เคยผิดหวัง ราคาคุ้มมาก', date: '28 ก.พ. 2569', avatar: '👨' },
  { id: '3', user: 'คุณนิตยา', rating: 4, comment: 'รสชาติดี วัตถุดิบสด ปริมาณพอดี แนะนำเมนูลาบ', date: '20 ก.พ. 2569', avatar: '👩‍💼' },
]

export default function ListingDetailPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [qty, setQty] = useState(1)
  const listing = MOCK_LISTING

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
          <span className="text-slate-700 font-medium">{listing.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Listing details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hero image */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="h-64 rounded-2xl bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center text-8xl border border-slate-100 shadow-sm">
              {listing.image}
            </motion.div>

            {/* Title & basic info */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-2xl font-extrabold text-slate-900">{listing.title}</h1>
                {listing.providerVerified && (
                  <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full font-semibold">
                    <Shield className="h-3 w-3" /> ยืนยันแล้ว
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-700">{listing.rating}</span>
                  <span>({listing.reviews} รีวิว)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {listing.community} · {listing.distance}
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {listing.completedBookings} งานเสร็จแล้ว
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {listing.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-slate-600 leading-relaxed">{listing.description}</p>
            </motion.div>

            {/* Provider info */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">เกี่ยวกับผู้ให้บริการ</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                  {listing.providerAvatar}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{listing.provider}</div>
                  <div className="text-sm text-slate-500">สมาชิกตั้งแต่ {listing.providerSince}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="h-2 w-20 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${listing.providerTrustScore}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-blue-600">Trust {listing.providerTrustScore}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { icon: Clock, label: listing.responseTime },
                  { icon: Phone, label: 'ติดต่อผ่านแอป' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-slate-500">
                    <item.icon className="h-4 w-4 text-slate-400" />
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">รีวิวจากลูกค้า ({listing.reviews})</h2>
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-xl font-extrabold text-slate-900">{listing.rating}</span>
                </div>
              </div>
              <div className="space-y-4">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-800 text-sm">{review.user}</span>
                        <span className="text-xs text-slate-400">{review.date}</span>
                      </div>
                      <div className="flex mb-1">
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

          {/* Right: Booking card */}
          <div className="lg:col-span-1">
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="sticky top-24 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl p-6">
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-slate-900">฿{listing.price.toLocaleString()}</span>
                <span className="text-slate-400 text-sm ml-1">/{listing.unit}</span>
              </div>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                    <Calendar className="h-3.5 w-3.5 inline mr-1" />วันที่ต้องการ
                  </label>
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">จำนวน</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 font-bold">−</button>
                    <span className="font-bold text-slate-800 min-w-[2ch] text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)}
                      className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 font-bold">+</button>
                    <span className="text-sm text-slate-500">{listing.unit}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-5">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">฿{listing.price} × {qty} {listing.unit}</span>
                  <span className="font-semibold">฿{(listing.price * qty).toLocaleString()}</span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link href="/auth/signin"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                  จองบริการ <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-blue-300 transition-colors">
                <MessageCircle className="h-4 w-4" /> ติดต่อผู้ให้บริการ
              </motion.button>

              <div className="mt-4 text-center text-xs text-slate-400">
                ไม่มีค่าธรรมเนียมการจอง
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
