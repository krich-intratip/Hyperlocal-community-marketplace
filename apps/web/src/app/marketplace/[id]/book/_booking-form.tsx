'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  ChevronLeft, Calendar, Clock, Users, MessageSquare,
  CheckCircle, Star, Shield, MapPin, ArrowRight, Minus, Plus,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}

const MOCK_LISTING = {
  id: '1',
  title: 'ทำอาหารกล่องส่งถึงที่',
  provider: 'คุณแม่สมใจ',
  providerId: '1',
  category: 'อาหารและเครื่องดื่ม',
  price: 80,
  unit: 'กล่อง',
  image: '🍱',
  rating: 4.9,
  reviews: 128,
  community: 'หมู่บ้านศรีนคร',
  verified: true,
  availableDays: [0, 1, 2, 3, 4],
  openTime: '07:00',
  closeTime: '17:00',
  minQty: 1,
  maxQty: 20,
  menuOptions: ['ข้าวราดแกง', 'ส้มตำ+ข้าวเหนียว', 'ลาบหมู+ข้าวเหนียว', 'ไก่ทอด+ข้าว'],
}

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
const DAY_LABELS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']
const DAY_FULL = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']

function getNextDays(n: number) {
  const days: Date[] = []
  const today = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

type Step = 'details' | 'confirm' | 'done'

export default function BookingFormClient() {
  const listing = MOCK_LISTING
  const [step, setStep] = useState<Step>('details')
  const [qty, setQty] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedMenus, setSelectedMenus] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingId] = useState(`B${Date.now().toString().slice(-6)}`)

  const days = getNextDays(14)
  const total = listing.price * qty
  const platformFee = Math.round(total * 0.05)
  const grandTotal = total + platformFee

  function toggleMenu(menu: string) {
    setSelectedMenus(prev =>
      prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
    )
  }

  function canProceed() {
    return selectedDate !== null && selectedTime !== '' && address.trim() !== ''
  }

  function handleConfirm() {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep('done') }, 1500)
  }

  const dayOfWeek = selectedDate ? (selectedDate.getDay() + 6) % 7 : -1
  const isAvailableDay = (date: Date) => {
    const dow = (date.getDay() + 6) % 7
    return listing.availableDays.includes(dow)
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Breadcrumb */}
        {step !== 'done' && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href={`/marketplace/${listing.id}` as any}
              className="hover:text-blue-600 flex items-center gap-1">
              <ChevronLeft className="h-3.5 w-3.5" /> {listing.title}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">จองบริการ</span>
          </motion.div>
        )}

        {/* ── Step: details ── */}
        {step === 'details' && (
          <>
            {/* Listing summary */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 mb-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-3xl flex-shrink-0">{listing.image}</div>
              <div className="flex-1 min-w-0">
                <h1 className="font-extrabold text-slate-900 text-base">{listing.title}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                  <span>{listing.provider}</span>
                  {listing.verified && <Shield className="h-3.5 w-3.5 text-blue-500" />}
                  <span>·</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-700">{listing.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <MapPin className="h-3 w-3" /> {listing.community}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-extrabold text-blue-600 text-lg">฿{listing.price}</div>
                <div className="text-xs text-slate-400">/{listing.unit}</div>
              </div>
            </motion.div>

            {/* Quantity */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-blue-500" />
                <h2 className="font-bold text-slate-800">จำนวน</h2>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setQty(q => Math.max(listing.minQty, q - 1))}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-all">
                  <Minus className="h-4 w-4 text-slate-600" />
                </button>
                <span className="text-2xl font-extrabold text-slate-900 w-10 text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(listing.maxQty, q + 1))}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-all">
                  <Plus className="h-4 w-4 text-slate-600" />
                </button>
                <span className="text-sm text-slate-500">{listing.unit} (สูงสุด {listing.maxQty})</span>
              </div>
            </motion.div>

            {/* Date picker */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-blue-500" />
                <h2 className="font-bold text-slate-800">วันที่ต้องการ <span className="text-red-500">*</span></h2>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {days.map((d, i) => {
                  const available = isAvailableDay(d)
                  const isSelected = selectedDate?.toDateString() === d.toDateString()
                  const dow = (d.getDay() + 6) % 7
                  return (
                    <button key={i} disabled={!available}
                      onClick={() => { setSelectedDate(d); setSelectedTime('') }}
                      className={`flex-shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : available ? 'border-slate-200 hover:border-blue-300 text-slate-700'
                        : 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
                      }`}>
                      <span className="text-[10px] mb-0.5">{DAY_LABELS[dow]}</span>
                      <span className="text-base font-extrabold">{d.getDate()}</span>
                      <span className="text-[10px] mt-0.5">{d.toLocaleString('th-TH', { month: 'short' })}</span>
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                รับงาน: {listing.availableDays.map(d => DAY_FULL[d]).join(', ')} เวลา {listing.openTime}–{listing.closeTime}
              </p>
            </motion.div>

            {/* Time picker */}
            {selectedDate && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <h2 className="font-bold text-slate-800">เวลา <span className="text-red-500">*</span></h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map(t => {
                    const [h] = t.split(':').map(Number)
                    const [oh] = listing.openTime.split(':').map(Number)
                    const [ch] = listing.closeTime.split(':').map(Number)
                    const avail = h >= oh && h < ch
                    return (
                      <button key={t} disabled={!avail}
                        onClick={() => setSelectedTime(t)}
                        className={`px-3.5 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${
                          selectedTime === t ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : avail ? 'border-slate-200 hover:border-blue-300 text-slate-700'
                          : 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
                        }`}>{t}</button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Menu options */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
              <h2 className="font-bold text-slate-800 mb-3">เลือกเมนู <span className="text-slate-400 text-xs font-normal">(ไม่บังคับ)</span></h2>
              <div className="flex flex-wrap gap-2">
                {listing.menuOptions.map(m => (
                  <button key={m} onClick={() => toggleMenu(m)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all ${
                      selectedMenus.includes(m)
                        ? 'border-blue-400 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-blue-200 text-slate-600'
                    }`}>{m}</button>
                ))}
              </div>
            </motion.div>

            {/* Address */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-blue-500" />
                <h2 className="font-bold text-slate-800">ที่อยู่จัดส่ง <span className="text-red-500">*</span></h2>
              </div>
              <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3}
                placeholder="บ้านเลขที่, ซอย, ถนน, แขวง/ตำบล..."
                className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none transition-all" />
            </motion.div>

            {/* Note */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <h2 className="font-bold text-slate-800">หมายเหตุ <span className="text-slate-400 text-xs font-normal">(ไม่บังคับ)</span></h2>
              </div>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                placeholder="เช่น ไม่ใส่ผัก, แพ้อาหารทะเล, โทรก่อนส่ง..."
                className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none transition-all" />
            </motion.div>

            {/* Price summary */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={8}
              className="bg-blue-50 rounded-2xl p-5 mb-5 border border-blue-100">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>฿{listing.price} × {qty} {listing.unit}</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>ค่าบริการแพลตฟอร์ม (5%)</span>
                  <span>฿{platformFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 flex justify-between font-extrabold text-slate-900 text-base">
                  <span>รวมทั้งหมด</span>
                  <span className="text-blue-700">฿{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={9}>
              <motion.button
                whileHover={canProceed() ? { scale: 1.02 } : {}}
                whileTap={canProceed() ? { scale: 0.97 } : {}}
                disabled={!canProceed()}
                onClick={() => setStep('confirm')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                ยืนยันข้อมูลการจอง <ArrowRight className="h-5 w-5" />
              </motion.button>
              {!canProceed() && (
                <p className="text-center text-xs text-slate-400 mt-2">กรุณาเลือกวันที่ เวลา และที่อยู่จัดส่ง</p>
              )}
            </motion.div>
          </>
        )}

        {/* ── Step: confirm ── */}
        {step === 'confirm' && (
          <>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="text-center mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900">ยืนยันการจอง</h1>
              <p className="text-sm text-slate-500 mt-1">ตรวจสอบรายละเอียดก่อนชำระเงิน</p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 mb-5 space-y-4">

              {/* Service */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <span className="text-3xl">{listing.image}</span>
                <div>
                  <p className="font-bold text-slate-900">{listing.title}</p>
                  <p className="text-sm text-slate-500">{listing.provider} · {listing.community}</p>
                </div>
              </div>

              {/* Details */}
              {[
                { label: 'วันที่', value: selectedDate?.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) ?? '' },
                { label: 'เวลา', value: `${selectedTime} น.` },
                { label: 'จำนวน', value: `${qty} ${listing.unit}` },
                { label: 'ที่อยู่', value: address },
                ...(selectedMenus.length > 0 ? [{ label: 'เมนู', value: selectedMenus.join(', ') }] : []),
                ...(note ? [{ label: 'หมายเหตุ', value: note }] : []),
              ].map(row => (
                <div key={row.label} className="flex gap-4 text-sm">
                  <span className="text-slate-400 w-20 flex-shrink-0">{row.label}</span>
                  <span className="text-slate-800 font-medium">{row.value}</span>
                </div>
              ))}

              {/* Total */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm text-slate-500 mb-1">
                  <span>ค่าบริการ (฿{listing.price} × {qty})</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>ค่าบริการแพลตฟอร์ม</span>
                  <span>฿{platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-extrabold text-lg text-slate-900">
                  <span>รวม</span>
                  <span className="text-blue-700">฿{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="space-y-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                disabled={loading}
                onClick={handleConfirm}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors disabled:opacity-60">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : <>✅ ยืนยันและชำระเงิน ฿{grandTotal.toLocaleString()}</>}
              </motion.button>
              <button onClick={() => setStep('details')}
                className="w-full text-center text-sm text-slate-500 hover:text-blue-600 py-2 transition-colors">
                ← แก้ไขข้อมูล
              </button>
            </motion.div>
          </>
        )}

        {/* ── Step: done ── */}
        {step === 'done' && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="text-center py-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">จองสำเร็จ!</h2>
            <p className="text-slate-500 text-sm mb-1">หมายเลขการจอง</p>
            <p className="text-2xl font-extrabold text-blue-600 mb-4">{bookingId}</p>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-sm text-blue-700 text-left space-y-1">
              <p>📅 {selectedDate?.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })} เวลา {selectedTime} น.</p>
              <p>👤 {listing.provider} จะโทรยืนยันภายใน 1 ชั่วโมง</p>
              <p>📍 {address}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/bookings"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white hover:bg-blue-700 transition-colors">
                ดูรายการจองทั้งหมด <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/marketplace"
                className="w-full text-center text-sm text-slate-500 hover:text-blue-600 py-2 transition-colors">
                กลับไป Marketplace
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  )
}
