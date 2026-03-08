'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  ChevronLeft, Calendar, Clock, Users, MessageSquare,
  CheckCircle, Star, Shield, MapPin, ArrowRight, Minus, Plus, Copy, Smartphone,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { getListingById } from '@/lib/mock-listings'
import { useDateFormat } from '@/hooks/useDateFormat'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
const DAY_LABELS_TH = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']
const DAY_LABELS_EN = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']
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

type Step = 'details' | 'confirm' | 'payment' | 'done'
type PayMethod = 'promptpay' | 'cash'

export default function BookingFormClient({ id }: { id: string }) {
  const listing = getListingById(id)
  const { fmtLong, locale } = useDateFormat()
  const DAY_LABELS = locale === 'en' ? DAY_LABELS_EN : DAY_LABELS_TH
  const [step, setStep] = useState<Step>('details')
  const [qty, setQty] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedMenus, setSelectedMenus] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingId] = useState(`B${Date.now().toString().slice(-6)}`)
  const [payMethod, setPayMethod] = useState<PayMethod>('promptpay')
  const [payLoading, setPayLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const days = getNextDays(14)
  const total = (listing?.price ?? 0) * qty
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
    setTimeout(() => { setLoading(false); setStep('payment') }, 800)
  }

  function handlePayConfirm() {
    setPayLoading(true)
    setTimeout(() => { setPayLoading(false); setStep('done') }, 1800)
  }

  function copyPromptPay() {
    navigator.clipboard?.writeText('0812345678').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isAvailableDay = (date: Date) => {
    if (!listing) return false
    const dow = (date.getDay() + 6) % 7
    return listing.availableDays.includes(dow)
  }

  if (!listing) {
    return (
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-20 pb-20 text-center">
          <p className="text-2xl font-extrabold text-slate-700 mb-2">ไม่พบ Listing นี้</p>
          <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white hover:bg-blue-700 mt-4">
            <ChevronLeft className="h-4 w-4" /> กลับ Marketplace
          </Link>
        </div>
      </main>
    )
  }

  const menuOptions = listing.menuStock?.map(m => m.name) ?? []

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
                  {listing.providerVerified && <Shield className="h-3.5 w-3.5 text-blue-500" />}
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
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-all">
                  <Minus className="h-4 w-4 text-slate-600" />
                </button>
                <span className="text-2xl font-extrabold text-slate-900 w-10 text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(20, q + 1))}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-all">
                  <Plus className="h-4 w-4 text-slate-600" />
                </button>
                <span className="text-sm text-slate-500">{listing.unit} (สูงสุด 20)</span>
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
                {menuOptions.map(m => (
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
                { label: 'วันที่', value: selectedDate ? fmtLong(selectedDate) : '' },
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
                ) : <>ไปชำระเงิน ฿{grandTotal.toLocaleString()} <ArrowRight className="h-4 w-4" /></>}
              </motion.button>
              <button onClick={() => setStep('details')}
                className="w-full text-center text-sm text-slate-500 hover:text-blue-600 py-2 transition-colors">
                ← แก้ไขข้อมูล
              </button>
            </motion.div>
          </>
        )}

        {/* ── Step: payment ── */}
        {step === 'payment' && (
          <>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="text-center mb-5">
              <h1 className="text-2xl font-extrabold text-slate-900">ชำระเงิน</h1>
              <p className="text-sm text-slate-500 mt-1">เลือกวิธีชำระ</p>
            </motion.div>

            {/* Payment method selector */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="grid grid-cols-2 gap-3 mb-5">
              {([['promptpay', '🇹🇭 PromptPay', 'โอนผ่าน QR Code'], ['cash', '💵 เงินสด', 'ชำระเมื่อผู้ให้บริการมาถึง']] as const).map(([id, label, desc]) => (
                <button key={id} onClick={() => setPayMethod(id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    payMethod === id
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                  <p className="font-bold text-sm text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </button>
              ))}
            </motion.div>

            {/* PromptPay QR */}
            {payMethod === 'promptpay' && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 mb-5 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">สแกน QR เพื่อชำระ</p>
                {/* Mock QR — SVG-based */}
                <div className="mx-auto w-48 h-48 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                  <svg width="160" height="160" viewBox="0 0 160 160" className="rounded-xl">
                    <rect width="160" height="160" fill="white"/>
                    {/* QR pattern mock */}
                    {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
                      const inCorner = (r<3&&c<3)||(r<3&&c>3)||(r>3&&c<3)
                      const val = inCorner ? 1 : ((r*7+c*3+r+c)%3===0 ? 1 : 0)
                      return val ? <rect key={`${r}-${c}`} x={8+c*20} y={8+r*20} width="18" height="18" rx="2" fill="#1e293b"/> : null
                    }))}
                    <rect x="8" y="8" width="58" height="58" rx="4" fill="none" stroke="#1e293b" strokeWidth="4"/>
                    <rect x="94" y="8" width="58" height="58" rx="4" fill="none" stroke="#1e293b" strokeWidth="4"/>
                    <rect x="8" y="94" width="58" height="58" rx="4" fill="none" stroke="#1e293b" strokeWidth="4"/>
                    <rect x="18" y="18" width="38" height="38" rx="2" fill="#1e293b"/>
                    <rect x="104" y="18" width="38" height="38" rx="2" fill="#1e293b"/>
                    <rect x="18" y="104" width="38" height="38" rx="2" fill="#1e293b"/>
                  </svg>
                </div>
                <p className="font-extrabold text-2xl text-blue-700 mb-1">฿{grandTotal.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mb-4">โอนให้ <span className="font-bold text-slate-700">{listing.provider}</span></p>
                <div className="flex items-center justify-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200">
                  <Smartphone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="font-bold text-slate-700 text-sm tracking-wider">081-234-5678</span>
                  <button onClick={copyPromptPay}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors ml-1">
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </button>
                </div>
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-4">
                  ⚠️ QR นี้เป็นตัวอย่าง Demo — อย่าโอนเงินจริง
                </p>
              </motion.div>
            )}

            {/* Cash info */}
            {payMethod === 'cash' && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0 text-xl">💵</div>
                  <div>
                    <p className="font-bold text-slate-900 mb-1">ชำระเงินสดเมื่อผู้ให้บริการมาถึง</p>
                    <p className="text-sm text-slate-500">เตรียมเงินสด <span className="font-bold text-slate-800">฿{grandTotal.toLocaleString()}</span> ไว้ให้พร้อม ผู้ให้บริการจะออกใบเสร็จให้หลังจีนหน้า</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="space-y-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                disabled={payLoading}
                onClick={handlePayConfirm}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-colors disabled:opacity-60">
                {payLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : <>✅ {payMethod === 'promptpay' ? 'โอนแล้ว ยืนยันการจอง' : 'ยืนยันการจอง'} <ArrowRight className="h-4 w-4" /></>}
              </motion.button>
              <button onClick={() => setStep('confirm')}
                className="w-full text-center text-sm text-slate-500 hover:text-blue-600 py-2 transition-colors">
                ← กลับไปยืนยันรายละเอียด
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
              <p>📅 {fmtLong(selectedDate)} เวลา {selectedTime} น.</p>
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
