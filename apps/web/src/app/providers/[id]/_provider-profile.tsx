'use client'

import { motion } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  MapPin, Star, Shield, Clock, ChevronLeft, CheckCircle,
  MessageCircle, ChevronRight, Calendar, Package, Award, Heart, ShieldCheck,
} from 'lucide-react'
import { TrustBadge } from '@/components/trust-badge'
import Link from 'next/link'
import { lazy, Suspense } from 'react'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useFollowState, useToggleFollow } from '@/hooks/useFollow'
import { getProviderById } from '@/lib/mock-providers'

const MapView = lazy(() => import('@/components/map-view').then(m => ({ default: m.MapView })))

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const DAY_LABELS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

// Community-based coordinates for map centering
const COMMUNITY_COORDS: Record<string, { lat: number; lng: number }> = {
  '1':  { lat: 13.7240, lng: 100.4840 },
  '2':  { lat: 13.7460, lng: 100.5340 },
  '3':  { lat: 13.8696, lng: 100.5472 },
  '4':  { lat: 13.7590, lng: 100.6060 },
  '5':  { lat: 13.8000, lng: 100.4900 },
  '6':  { lat: 18.7883, lng: 98.9853  },
  '7':  { lat: 18.7960, lng: 98.9680  },
  '8':  { lat: 7.8804,  lng: 98.2922  },
  '9':  { lat: 16.4322, lng: 102.8236 },
  '10': { lat: 7.0086,  lng: 100.4770 },
  '11': { lat: 13.7400, lng: 100.5710 },
  '12': { lat: 19.9105, lng: 99.8406  },
  '13': { lat: 14.9700, lng: 102.1011 },
  '14': { lat: 12.6840, lng: 101.2520 },
  '15': { lat: 9.5400,  lng: 100.0640 },
  // Phase 13: ชุมชนทั่วประเทศ
  '16': { lat: 17.4138, lng: 102.7869 },
  '17': { lat: 15.2448, lng: 104.8453 },
  '18': { lat: 12.9350, lng: 100.8825 },
  '19': { lat: 9.1400,  lng: 99.3275  },
  '20': { lat: 18.2888, lng: 99.4977  },
  '21': { lat: 15.7047, lng: 100.1368 },
  '22': { lat: 13.5990, lng: 100.6000 },
  '23': { lat: 8.4304,  lng: 99.9631  },
  '24': { lat: 14.0063, lng: 99.5481  },
  '25': { lat: 18.3609, lng: 103.6521 },
}

export default function ProviderProfileClient({ id }: { id: string }) {
  useAuthGuard()
  const { data: followed = false } = useFollowState(id)
  const toggleFollow = useToggleFollow()

  const provider = getProviderById(id)

  // Fallback for unknown IDs
  if (!provider) {
    return (
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-slate-700 mb-2">ไม่พบผู้ให้บริการนี้</h1>
          <p className="text-slate-500 mb-6">ผู้ให้บริการ #{id} ยังไม่ได้ลงทะเบียน หรืออาจไม่มีในระบบ</p>
          <Link href="/marketplace" className="text-blue-600 hover:underline font-medium">← กลับ Marketplace</Link>
        </section>
        <AppFooter />
      </main>
    )
  }

  const primaryCommunityId = provider.communityIds[0] ?? ''
  const coords = COMMUNITY_COORDS[primaryCommunityId] ?? { lat: 13.7563, lng: 100.5018 }

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
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{provider.name}</h1>
                      {provider.verified && <Shield className="h-4 w-4 text-blue-500" />}
                      <TrustBadge score={provider.trustScore} size="md" showScore />
                    </div>
                    <p className="text-sm text-slate-500">{provider.tagline}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{provider.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">{provider.rating}</span>
                      <span className="text-sm text-slate-400">({provider.reviews})</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFollow.mutate({ providerId: id, currentlyFollowing: followed ?? false })}
                      disabled={toggleFollow.isPending}
                      aria-label={followed ? 'เลิกติดตาม' : 'ติดตาม Provider'}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold transition-all ${
                        followed
                          ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-900/30 dark:border-rose-600 dark:text-rose-400'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500 dark:bg-slate-800 dark:border-slate-600'
                      }`}
                    >
                      <Heart className={`h-4 w-4 transition-colors ${followed ? 'fill-rose-500 text-rose-500' : ''}`} />
                      {followed ? 'ติดตามแล้ว' : 'ติดตาม'}
                    </motion.button>
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
                {provider.listings.map((listing, i) => (
                  <motion.div key={listing.id} variants={fadeUp} custom={i} whileHover={{ x: 4 }}>
                    <Link href={`/marketplace/${listing.id}` as string}
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
              <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                <div>
                  <h2 className="font-extrabold text-lg text-slate-900">รีวิว ({provider.reviews})</h2>
                  {/* RV-2: Transparency indicator (mock 100% for static pages) */}
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-green-700 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>ความโปร่งใส 100%</span>
                    <span className="text-slate-400 font-normal">— แสดงรีวิวทั้งหมด</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-2xl font-extrabold text-slate-900">{provider.rating}</span>
                </div>
              </div>
              <div className="space-y-5">
                {provider.providerReviews.map((review) => (
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
                <Link href={`/communities/${provider.communityIds[0]}` as string}
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

      {/* ── Location map ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" /> พื้นที่ให้บริการ
          </h2>
          <Suspense fallback={<div className="w-full h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />}>
            <MapView
              listings={[{
                id: provider.id, title: provider.name, provider: provider.name,
                price: provider.listings[0]?.price ?? 0,
                unit: provider.listings[0]?.unit ?? '-',
                lat: coords.lat, lng: coords.lng,
                category: provider.category,
                status: provider.online ? 'available' : 'offline',
                rating: provider.rating, image: provider.avatar,
              }]}
              centerLat={coords.lat}
              centerLng={coords.lng}
              zoom={15}
            />
          </Suspense>
        </motion.div>
      </section>

      <AppFooter />
    </main>
  )
}
