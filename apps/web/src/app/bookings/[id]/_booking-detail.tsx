'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  ChevronLeft, Calendar, Clock, MapPin, MessageCircle, Star,
  CheckCircle, XCircle, AlertCircle, Shield, Phone, ChevronRight,
  Package, ThumbsUp, X,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useDateFormat } from '@/hooks/useDateFormat'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'


const MOCK_BOOKING_DATA = {
  id: 'B240285',
  listingId: '7',
  title: 'นวดแผนไทย ออกนอกสถานที่',
  provider: 'หมอนวดประเสริฐ',
  providerId: '3',
  providerAvatar: '👨‍⚕️',
  providerPhone: '08X-XXX-XXXX',
  providerRating: 4.9,
  image: '💆',
  date: '2026-03-05',
  time: '18:00',
  qty: 1,
  unit: 'ชั่วโมง',
  price: 400,
  platformFee: 20,
  total: 420,
  address: '88 หมู่บ้านกรีนวิลล์ ซ.3',
  community: 'หมู่บ้านกรีนวิลล์',
  note: '',
  menus: [] as string[],
  status: 'completed' as BookingStatus,
  canReview: true,
  timeline: [
    { label: 'สร้างการจอง', time: '2026-03-04T20:15', done: true },
    { label: 'ผู้ให้บริการยืนยัน', time: '2026-03-04T21:02', done: true },
    { label: 'ให้บริการแล้ว', time: '2026-03-05T19:05', done: true },
    { label: 'รีวิวแล้ว', time: '', done: false },
  ],
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending:   { label: 'รอยืนยัน',   color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: AlertCircle },
  confirmed: { label: 'ยืนยันแล้ว', color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: Clock },
  completed: { label: 'เสร็จสิ้น',  color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  icon: CheckCircle },
  cancelled: { label: 'ยกเลิก',     color: 'text-slate-500',  bg: 'bg-slate-50',  border: 'border-slate-200',  icon: XCircle },
}

function ReviewModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: number, c: string) => void }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hover, setHover] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-slate-900">รีวิวบริการ</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="text-center mb-5">
          <p className="text-sm text-slate-500 mb-3">คุณพอใจกับบริการแค่ไหน?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-110">
                <Star className={`h-8 w-8 ${
                  s <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                }`} />
              </button>
            ))}
          </div>
          <p className="text-sm font-bold text-amber-600 mt-2">
            {['', 'แย่มาก', 'พอใช้', 'ดี', 'ดีมาก', 'ยอดเยี่ยม'][rating]}
          </p>
        </div>

        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
          placeholder="บอกประสบการณ์ของคุณ... (ไม่บังคับ)"
          className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none transition-all mb-4" />

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => onSubmit(rating, comment)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-base font-bold text-white hover:bg-amber-600 transition-colors shadow-lg shadow-amber-100">
          <ThumbsUp className="h-4 w-4" /> ส่งรีวิว
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default function BookingDetailClient() {
  useAuthGuard()
  const booking = MOCK_BOOKING_DATA
  const cfg = STATUS_CONFIG[booking.status]
  const StatusIcon = cfg.icon
  const { fmt, fmtDT } = useDateFormat()

  const [showReview, setShowReview] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [reviewData, setReviewData] = useState<{ rating: number; comment: string } | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  function handleReview(rating: number, comment: string) {
    setReviewData({ rating, comment })
    setReviewed(true)
    setShowReview(false)
  }

  return (
    <>
      <AnimatePresence>
        {showReview && (
          <ReviewModal onClose={() => setShowReview(false)} onSubmit={handleReview} />
        )}
      </AnimatePresence>

      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />

        <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

          {/* Breadcrumb */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/bookings" className="hover:text-blue-600 flex items-center gap-1">
              <ChevronLeft className="h-3.5 w-3.5" /> การจองของฉัน
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-mono font-medium">#{booking.id}</span>
          </motion.div>

          {/* Status banner */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
            className={`rounded-2xl p-4 mb-5 border flex items-center gap-3 ${cfg.bg} ${cfg.border}`}>
            <StatusIcon className={`h-5 w-5 flex-shrink-0 ${cfg.color}`} />
            <div>
              <p className={`font-extrabold ${cfg.color}`}>{cfg.label}</p>
              {booking.status === 'pending' && (
                <p className="text-xs text-amber-600 mt-0.5">รอผู้ให้บริการยืนยัน — ปกติภายใน 1 ชั่วโมง</p>
              )}
              {booking.status === 'confirmed' && (
                <p className="text-xs text-blue-600 mt-0.5">นัดหมายได้รับการยืนยันแล้ว</p>
              )}
              {booking.status === 'completed' && !reviewed && booking.canReview && (
                <p className="text-xs text-green-600 mt-0.5">บริการเสร็จสิ้น — รีวิวเพื่อช่วยชุมชน!</p>
              )}
            </div>
          </motion.div>

          {/* Main info card */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">

            {/* Service */}
            <div className="flex items-center gap-4 pb-5 border-b border-slate-100 mb-5">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-3xl flex-shrink-0">
                {booking.image}
              </div>
              <div className="flex-1">
                <h1 className="font-extrabold text-slate-900 text-base">{booking.title}</h1>
                <p className="text-sm text-slate-500 mt-0.5">{booking.community}</p>
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                <StatusIcon className="h-3 w-3" /> {cfg.label}
              </span>
            </div>

            {/* Details grid */}
            <div className="space-y-3">
              {[
                { icon: Calendar, label: 'วันที่', value: fmt(booking.date) },
                { icon: Clock,    label: 'เวลา',   value: `${booking.time} น.` },
                { icon: Package,  label: 'จำนวน',  value: `${booking.qty} ${booking.unit}` },
                { icon: MapPin,   label: 'ที่อยู่', value: booking.address },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-3 text-sm">
                  <row.icon className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-400 w-14 flex-shrink-0">{row.label}</span>
                  <span className="text-slate-800 font-medium">{row.value}</span>
                </div>
              ))}
              {booking.menus.length > 0 && (
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-slate-400 w-14 flex-shrink-0 pl-7">เมนู</span>
                  <span className="text-slate-800 font-medium">{booking.menus.join(', ')}</span>
                </div>
              )}
              {booking.note && (
                <div className="flex items-start gap-3 text-sm">
                  <MessageCircle className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-400 w-14 flex-shrink-0">หมายเหตุ</span>
                  <span className="text-slate-800">{booking.note}</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>ค่าบริการ (฿{booking.price} × {booking.qty} {booking.unit})</span>
                <span>฿{(booking.price * booking.qty).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>ค่าบริการแพลตฟอร์ม</span>
                <span>฿{booking.platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-slate-900 pt-1.5 border-t border-slate-100">
                <span>รวมทั้งหมด</span>
                <span className="text-blue-700">฿{booking.total.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Provider card */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">ผู้ให้บริการ</p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                {booking.providerAvatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-slate-900 text-sm">{booking.provider}</p>
                  <Shield className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{booking.providerRating}</span>
                  <span>· {booking.community}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/providers/${booking.providerId}` as any}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  โปรไฟล์ <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">ขั้นตอนการจอง</p>
            <div className="space-y-0">
              {booking.timeline.map((step, idx) => {
                const isLast = idx === booking.timeline.length - 1
                const isDone = step.done || (step.label === 'รีวิวแล้ว' && reviewed)
                return (
                  <div key={step.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isDone ? 'bg-green-500 border-green-500' : 'bg-white border-slate-200'
                      }`}>
                        {isDone ? <CheckCircle className="h-4 w-4 text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                      </div>
                      {!isLast && <div className={`w-0.5 h-8 mt-1 ${isDone ? 'bg-green-300' : 'bg-slate-200'}`} />}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                      {(step.time || (step.label === 'รีวิวแล้ว' && reviewed)) && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {step.label === 'รีวิวแล้ว' && reviewed ? 'เพิ่งรีวิว' : fmtDT(step.time)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Review result */}
          {reviewed && reviewData && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4.5}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="h-4 w-4 text-amber-600" />
                <p className="font-bold text-amber-700">รีวิวของคุณ</p>
              </div>
              <div className="flex mb-2">
                {Array.from({ length: reviewData.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              {reviewData.comment && <p className="text-sm text-amber-800">{reviewData.comment}</p>}
            </motion.div>
          )}

          {/* Actions */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="space-y-3">

            {/* Review button */}
            {booking.canReview && !reviewed && booking.status === 'completed' && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowReview(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-amber-100 hover:bg-amber-600 transition-colors">
                <Star className="h-5 w-5" /> รีวิวบริการนี้
              </motion.button>
            )}

            {/* Rebook */}
            {booking.status === 'completed' && (
              <Link href={`/marketplace/${booking.listingId}/book` as any}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                🔄 จองอีกครั้ง
              </Link>
            )}

            {/* Cancel */}
            {(booking.status === 'pending' || booking.status === 'confirmed') && !showCancelConfirm && (
              <button onClick={() => setShowCancelConfirm(true)}
                className="w-full text-center text-sm text-red-500 hover:text-red-700 py-2 transition-colors">
                ยกเลิกการจอง
              </button>
            )}

            {showCancelConfirm && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-bold text-red-700">ยืนยันการยกเลิก?</p>
                <p className="text-xs text-red-600">การยกเลิกหลังยืนยันอาจมีค่าธรรมเนียม ขึ้นอยู่กับนโยบายของผู้ให้บริการ</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    ไม่ยกเลิก
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-red-500 text-sm font-bold text-white hover:bg-red-600 transition-colors">
                    ยืนยันยกเลิก
                  </button>
                </div>
              </motion.div>
            )}

            {/* Back */}
            <Link href="/bookings"
              className="block text-center text-sm text-slate-500 hover:text-blue-600 py-2 transition-colors">
              ← กลับรายการจอง
            </Link>
          </motion.div>

        </section>
      <AppFooter />
      </main>
    </>
  )
}
