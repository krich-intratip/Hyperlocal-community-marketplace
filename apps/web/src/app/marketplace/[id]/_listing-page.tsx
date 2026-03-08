'use client'

import { motion } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { MapPin, Star, Shield, Clock, Phone, Calendar, ChevronLeft, ChevronRight, CheckCircle, MessageCircle, Package, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { ProviderStatusBadge } from '@/components/provider-status'
import { useT } from '@/hooks/useT'
import { getListingById } from '@/lib/mock-listings'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}

const DAY_LABELS = ['จ','อ','พ','พฤ','ศ','ส','อา']

function StockBar({ stock, max }: { stock: number; max: number }) {
  const pct = max > 0 ? (stock / max) * 100 : 0
  const color = stock === 0 ? 'bg-slate-300 dark:bg-slate-600'
    : pct <= 20 ? 'bg-red-500' : pct <= 50 ? 'bg-amber-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-sm font-bold min-w-[2.5rem] text-right ${
        stock === 0 ? 'text-slate-400' : pct <= 20 ? 'text-red-500' : 'text-green-600'
      }`}>{stock === 0 ? 'หมด' : `${stock}/${max}`}</span>
    </div>
  )
}

const REVIEWS_BY_ID: Record<string, { id: string; user: string; rating: number; comment: string; date: string; avatar: string }[]> = {
  '1': [
    { id: 'r1', user: 'คุณวิภา', rating: 5, comment: 'อร่อยมาก ส้มตำรสจัดถูกใจ ส่งตรงเวลาทุกวัน', date: '5 มี.ค. 2569', avatar: '👩' },
    { id: 'r2', user: 'คุณสมศักดิ์', rating: 5, comment: 'สั่งรายเดือนมา 3 เดือนแล้ว ไม่เคยผิดหวัง ราคาคุ้มมาก', date: '28 ก.พ. 2569', avatar: '👨' },
    { id: 'r3', user: 'คุณนิตยา', rating: 4, comment: 'รสชาติดี วัตถุดิบสด ปริมาณพอดี แนะนำเมนูลาบ', date: '20 ก.พ. 2569', avatar: '👩‍💼' },
  ],
  '2': [
    { id: 'r1', user: 'คุณประหยัด', rating: 5, comment: 'ช่างมาตรงเวลา ล้างแอร์สะอาดมาก แอร์เย็นขึ้นชัดเจน', date: '4 มี.ค. 2569', avatar: '👨' },
    { id: 'r2', user: 'คุณสมหญิง', rating: 5, comment: 'ราคาสมเหตุสมผล งานเรียบร้อย มีใบรับประกัน แนะนำเลย', date: '25 ก.พ. 2569', avatar: '👩' },
  ],
  '3': [
    { id: 'r1', user: 'คุณแม่บี', rating: 5, comment: 'ครูสอนเก่งมาก ลูกชอบมาก คะแนนอังกฤษดีขึ้นเยอะ', date: '6 มี.ค. 2569', avatar: '👩' },
    { id: 'r2', user: 'คุณพ่อต้น', rating: 5, comment: 'วิธีสอนสนุก ลูกไม่เบื่อ ครูใจดีอธิบายชัดเจน', date: '1 มี.ค. 2569', avatar: '👨' },
  ],
  '4': [
    { id: 'r1', user: 'คุณมาลี', rating: 5, comment: 'ทีมงานขยัน ทำสะอาดทั่วถึงทุกมุม ห้องน้ำเงาเลย', date: '7 มี.ค. 2569', avatar: '👩' },
    { id: 'r2', user: 'คุณวิรัตน์', rating: 4, comment: 'บริการดี ตรงเวลา แต่อยากให้ใช้น้ำยาอ่อนกว่านี้หน่อย', date: '22 ก.พ. 2569', avatar: '👨' },
  ],
  '5': [
    { id: 'r1', user: 'คุณลูกสาว', rating: 5, comment: 'คุณสมศรีใจดีมาก ดูแลคุณตาเหมือนญาติ ไว้วางใจได้', date: '3 มี.ค. 2569', avatar: '👩' },
  ],
  '6': [
    { id: 'r1', user: 'คุณเจน', rating: 5, comment: 'กระเป๋าสวยมาก งานละเอียด ผ้าทนทาน สีไม่ตก คุ้มค่ามาก', date: '5 มี.ค. 2569', avatar: '👩' },
    { id: 'r2', user: 'คุณฝ้าย', rating: 5, comment: 'ซื้อเป็นของขวัญ ผู้รับชอบมาก สั่งทำลายพิเศษได้ด้วย', date: '27 ก.พ. 2569', avatar: '👩‍💼' },
  ],
  '7': [
    { id: 'r1', user: 'คุณปิยะ', rating: 5, comment: 'หมอนวดฝีมือดีมาก นวดถูกจุด ปวดหายเลย นัดซ้ำแน่นอน', date: '8 มี.ค. 2569', avatar: '👨' },
    { id: 'r2', user: 'คุณนก', rating: 5, comment: 'นวดแล้วผ่อนคลายมาก มือนวดดีมาก แนะนำเมนูนวดกดจุด', date: '2 มี.ค. 2569', avatar: '👩' },
  ],
  '8': [
    { id: 'r1', user: 'คุณสุ', rating: 5, comment: 'ผักสดมาก รสชาติดีกว่าซื้อห้างชัดเจน คุ้มมาก', date: '4 มี.ค. 2569', avatar: '👩' },
    { id: 'r2', user: 'คุณบอล', rating: 4, comment: 'ผักสดดี แต่บางสัปดาห์เมนูซ้ำ ถ้าหลากหลายกว่านี้จะ 5 ดาว', date: '19 ก.พ. 2569', avatar: '👨' },
  ],
  '9': [
    { id: 'r1', user: 'คุณเต้', rating: 5, comment: 'โลโก้ออกมาสวยมาก ตรงใจ แก้ไขให้จนพอใจ มืออาชีพมาก', date: '6 มี.ค. 2569', avatar: '👨' },
  ],
  '10': [
    { id: 'r1', user: 'คุณแก้ว', rating: 5, comment: 'ยืมหม้อทอดมาทำงานเลี้ยง สะดวกมาก ของสะอาด ราคาถูก', date: '3 มี.ค. 2569', avatar: '👩' },
  ],
  '11': [
    { id: 'r1', user: 'คุณดาว', rating: 5, comment: 'ช่างมาเร็วมาก ท่อรั่วซ่อมเสร็จในชั่วโมงเดียว ราคาตรงไปตรงมา', date: '7 มี.ค. 2569', avatar: '👩' },
    { id: 'r2', user: 'คุณอ้น', rating: 4, comment: 'งานดี เรียบร้อย แต่โทรหาค่อนข้างยาก ควรตอบเร็วกว่านี้', date: '21 ก.พ. 2569', avatar: '👨' },
  ],
  '12': [
    { id: 'r1', user: 'คุณเอ', rating: 5, comment: 'อาหารสะอาด อร่อย แคลอรี่ชัดเจน ลดน้ำหนักได้ผลจริง', date: '8 มี.ค. 2569', avatar: '👩' },
    { id: 'r2', user: 'คุณโอ๊ต', rating: 5, comment: 'สั่งรายเดือน อาหารสม่ำเสมอ ส่งตรงเวลาทุกวัน ประทับใจ', date: '3 มี.ค. 2569', avatar: '👨' },
  ],
}

export default function ListingDetailClient({ id }: { id: string }) {
  const t = useT()
  const [selectedDate, setSelectedDate] = useState('')
  const [qty, setQty] = useState(1)
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const listing = getListingById(id)

  if (!listing) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950">
        <MarketBackground />
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 pt-20 pb-20 text-center">
          <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-slate-700 dark:text-white mb-2">ไม่พบ Listing นี้</h1>
          <p className="text-slate-500 mb-6">Listing หมายเลข {id} ไม่มีในระบบ</p>
          <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white hover:bg-blue-700">
            <ChevronLeft className="h-4 w-4" /> กลับ Marketplace
          </Link>
        </div>
      </main>
    )
  }

  const reviews = REVIEWS_BY_ID[id] ?? []
  const selectedMenuStock = listing.menuStock?.find((m) => m.name === selectedMenu)
  const effectivePrice = selectedMenuStock?.price ?? listing.price

  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/marketplace" className="hover:text-blue-600 flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" /> Marketplace
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-200 font-medium">{listing.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: details ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hero image */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="relative h-64 rounded-2xl bg-gradient-to-br from-blue-50 to-amber-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-8xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              {listing.image}
              <div className="absolute top-4 left-4">
                <ProviderStatusBadge status={listing.status} />
              </div>
              {listing.providerVerified && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                  <Shield className="h-3.5 w-3.5" /> ยืนยันแล้ว
                </div>
              )}
            </motion.div>

            {/* Title & basic info */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="bg-white/90 dark:bg-slate-800 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">{listing.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-base text-slate-500 dark:text-slate-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-700 dark:text-slate-200">{listing.rating}</span>
                  <span>({listing.reviews} {t.common.reviews})</span>
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

              {/* Available days */}
              <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                {DAY_LABELS.map((d, idx) => (
                  <span key={idx} className={`text-sm px-2 py-1 rounded-lg font-bold ${
                    listing.availableDays.includes(idx)
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600'
                  }`}>{d}</span>
                ))}
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-1 font-medium">
                  {listing.openTime}–{listing.closeTime} น.
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {listing.tags.map((tag) => (
                  <span key={tag} className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">{listing.description}</p>
            </motion.div>

            {/* Food stock / menu selector — only show if listing has menuStock */}
            {listing.menuStock && listing.menuStock.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="bg-white/90 dark:bg-slate-800 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-blue-500" />
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">เมนูและสต็อกคงเหลือ</h2>
              </div>
              <div className="space-y-3">
                {listing.menuStock.map(m => (
                  <div key={m.name}
                    onClick={() => m.stock > 0 && setSelectedMenu(m.name === selectedMenu ? null : m.name)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      m.stock === 0 ? 'opacity-50 cursor-not-allowed border-slate-100 dark:border-slate-700' :
                      selectedMenu === m.name
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 cursor-pointer'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 cursor-pointer'
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-base text-slate-800 dark:text-slate-100">{m.name}</span>
                      <span className="font-extrabold text-base text-blue-600">฿{m.price}</span>
                    </div>
                    <StockBar stock={m.stock} max={m.max} />
                    {m.stock === 0 && (
                      <p className="text-sm text-red-500 font-bold mt-1">หมดแล้ว</p>
                    )}
                  </div>
                ))}
              </div>
              {selectedMenu && (
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-3">
                  ✓ เลือก: {selectedMenu} — ราคา ฿{effectivePrice}/{listing.unit}
                </p>
              )}
            </motion.div>
            )}

            {/* Provider info */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="bg-white/90 dark:bg-slate-800 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">เกี่ยวกับผู้ให้บริการ</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-4xl">
                  {listing.providerAvatar}
                </div>
                <div>
                  <div className="font-bold text-lg text-slate-800 dark:text-slate-100">{listing.provider}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">สมาชิกตั้งแต่ {listing.providerSince}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${listing.providerTrustScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-blue-600">Trust {listing.providerTrustScore}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Clock, label: listing.responseTime },
                  { icon: Phone, label: 'ติดต่อผ่านแอป' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-base text-slate-500 dark:text-slate-400">
                    <item.icon className="h-4 w-4 text-slate-400" />
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
              className="bg-white/90 dark:bg-slate-800 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  รีวิวจากลูกค้า ({listing.reviews})
                </h2>
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{listing.rating}</span>
                </div>
              </div>
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-base text-slate-800 dark:text-slate-100">{review.user}</span>
                        <span className="text-sm text-slate-400 dark:text-slate-500">{review.date}</span>
                      </div>
                      <div className="flex mb-1.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-base text-slate-600 dark:text-slate-300">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Booking card ── */}
          <div className="lg:col-span-1">
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="sticky top-24 bg-white/95 dark:bg-slate-800 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl p-6">

              <div className="mb-4">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  ฿{effectivePrice.toLocaleString()}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-base ml-1">/{listing.unit}</span>
              </div>

              {/* Status */}
              <div className="mb-4">
                <ProviderStatusBadge status={listing.status} />
              </div>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                    <Calendar className="h-4 w-4 inline mr-1" />{t.booking.date}
                  </label>
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-base bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>

                {selectedMenu && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                    เมนู: {selectedMenu}
                  </div>
                )}

                <div>
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-300 block mb-1.5">{t.booking.qty}</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-lg text-slate-800 dark:text-slate-100">−</button>
                    <span className="font-extrabold text-lg text-slate-800 dark:text-slate-100 min-w-[2ch] text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-lg text-slate-800 dark:text-slate-100">+</button>
                    <span className="text-base text-slate-500 dark:text-slate-400">{listing.unit}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mb-5">
                <div className="flex justify-between text-base mb-1">
                  <span className="text-slate-500 dark:text-slate-400">฿{effectivePrice} × {qty} {listing.unit}</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">฿{(effectivePrice * qty).toLocaleString()}</span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link href="/auth/signin"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                  {t.marketplace.bookNow} <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 px-6 py-3 text-base font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-300 transition-colors">
                <MessageCircle className="h-4 w-4" /> {t.marketplace.contact}
              </motion.button>

              <div className="mt-4 text-center text-sm text-slate-400 dark:text-slate-500">
                {t.booking.noFee}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <AppFooter />
    </main>
  )
}
