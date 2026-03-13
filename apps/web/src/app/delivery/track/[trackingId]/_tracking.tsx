'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import {
  ChevronLeft, CheckCircle, Phone, Navigation,
  Clock, MapPin, Package, Star,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.38, delay: i * 0.07 } }),
}

// ── Types ──────────────────────────────────────────────────────────────────────
type Carrier = 'lineman' | 'grab_express'

interface TrackingStep {
  label: string
  desc: string
  time: string
  done: boolean
  active: boolean
}

interface TrackingData {
  trackingId: string
  carrier: Carrier
  carrierLabel: string
  carrierColor: string
  carrierBg: string
  orderId: string
  courierName: string
  courierAvatar: string
  courierPhone: string
  courierRating: number
  eta: string
  etaMin: number
  steps: TrackingStep[]
  pickupName: string
  dropName: string
}

// ── Mock builder ───────────────────────────────────────────────────────────────
function buildTrackingData(trackingId: string): TrackingData {
  const isGrab = trackingId.startsWith('GX')
  const hash   = trackingId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

  const currentStep = Math.min(2, hash % 4) // 0-3, most likely in transit (2)

  const steps: TrackingStep[] = [
    {
      label: 'รับออเดอร์แล้ว',
      desc: 'ร้านค้ายืนยันออเดอร์',
      time: '14:10 น.',
      done:   currentStep > 0,
      active: currentStep === 0,
    },
    {
      label: 'ไรเดอร์รับสินค้า',
      desc: 'ไรเดอร์ถึงร้านแล้ว',
      time: currentStep >= 1 ? '14:22 น.' : '',
      done:   currentStep > 1,
      active: currentStep === 1,
    },
    {
      label: 'กำลังจัดส่ง',
      desc: 'กำลังเดินทางมาหาคุณ',
      time: currentStep >= 2 ? '14:28 น.' : '',
      done:   currentStep > 2,
      active: currentStep === 2,
    },
    {
      label: 'ส่งถึงแล้ว',
      desc: 'รับสินค้าเรียบร้อย',
      time: currentStep >= 3 ? '14:45 น.' : '',
      done:   currentStep === 3,
      active: false,
    },
  ]

  return {
    trackingId,
    carrier: isGrab ? 'grab_express' : 'lineman',
    carrierLabel: isGrab ? 'Grab Express' : 'Lineman',
    carrierColor: isGrab ? 'text-[#00b14f]' : 'text-green-600',
    carrierBg:    isGrab ? 'bg-[#00b14f]/10 border-[#00b14f]/20' : 'bg-green-50 border-green-200',
    orderId: `ORD-${trackingId.slice(-6)}`,
    courierName:   isGrab ? 'อรรถ คล่องส่ง' : 'สมชาย ขยันส่ง',
    courierAvatar: isGrab ? '🚗' : '🛵',
    courierPhone:  isGrab ? '082-345-6789' : '081-234-5678',
    courierRating: isGrab ? 4.9 : 4.8,
    eta: '14:45 น.',
    etaMin: 17,
    steps,
    pickupName:  'ร้านคุณแม่สมใจ',
    dropName:    '99/5 หมู่ 3 ต.บางแค กทม.',
  }
}

// ── Map Placeholder ────────────────────────────────────────────────────────────
function DeliveryMapPlaceholder({ data }: { data: TrackingData }) {
  return (
    <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 border border-white/40 shadow-inner">
      {/* Map grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={`h${i}`} x1="0" y1={`${i * 14.3}%`} x2="100%" y2={`${i * 14.3}%`} stroke="#6366f1" strokeWidth="0.5"/>
        ))}
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
          <line key={`v${i}`} x1={`${i * 9.1}%`} y1="0" x2={`${i * 9.1}%`} y2="100%" stroke="#6366f1" strokeWidth="0.5"/>
        ))}
      </svg>

      {/* Road */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M 30 200 Q 80 160 120 130 Q 180 80 280 70 Q 340 65 360 60"
          fill="none" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round"/>
        <path d="M 30 200 Q 80 160 120 130 Q 180 80 280 70 Q 340 65 360 60"
          fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8"/>
      </svg>

      {/* Origin pin */}
      <div className="absolute bottom-8 left-6 flex flex-col items-center gap-0.5">
        <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-sm">
          🏪
        </div>
        <div className="bg-white/90 rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-slate-600 shadow-sm">
          ร้านค้า
        </div>
      </div>

      {/* Destination pin */}
      <div className="absolute top-8 right-8 flex flex-col items-center gap-0.5">
        <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center text-sm animate-pulse">
          📍
        </div>
        <div className="bg-white/90 rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-slate-600 shadow-sm">
          ปลายทาง
        </div>
      </div>

      {/* Courier position (midway on path) */}
      <motion.div
        className="absolute"
        style={{ left: '43%', top: '42%' }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}>
        <div className="w-10 h-10 rounded-full bg-white shadow-lg border-2 border-primary flex items-center justify-center text-xl">
          {data.carrier === 'lineman' ? '🛵' : '🚗'}
        </div>
      </motion.div>

      {/* ETA badge */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
        ⏱ อีก ~{data.etaMin} นาที
      </div>

      {/* Carrier badge */}
      <div className={`absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${data.carrierBg} ${data.carrierColor} bg-white/80`}>
        <span>{data.carrier === 'lineman' ? '🛵' : '🚗'}</span>
        <span>{data.carrierLabel}</span>
      </div>
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function DeliveryTrackingClient({ trackingId }: { trackingId: string }) {
  const data = buildTrackingData(trackingId)

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-lg mx-auto px-4 sm:px-6 py-10 pb-20">

        {/* Back */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-5">
          <Link href="/bookings"
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
            <ChevronLeft className="h-4 w-4" /> การจองและออเดอร์
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="glass-card rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">ติดตามการจัดส่ง</span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 font-mono">{trackingId}</h1>
              <p className="text-xs text-slate-500 mt-0.5">ออเดอร์ #{data.orderId}</p>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${data.carrierBg} ${data.carrierColor}`}>
              <span>{data.carrier === 'lineman' ? '🛵' : '🚗'}</span>
              <span>{data.carrierLabel}</span>
            </div>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="mb-4">
          <DeliveryMapPlaceholder data={data} />
        </motion.div>

        {/* Route info */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="glass rounded-2xl px-4 py-3 mb-4">
          <div className="flex items-stretch gap-3">
            <div className="flex flex-col items-center gap-1 pt-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-0.5 flex-1 bg-slate-200" />
              <div className="w-2 h-2 rounded-full bg-red-400" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs text-slate-400">รับสินค้าจาก</p>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  <Package className="h-3.5 w-3.5 text-primary flex-shrink-0" /> {data.pickupName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">ส่งที่</p>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-red-400 flex-shrink-0" /> {data.dropName}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end justify-center gap-0.5 flex-shrink-0">
              <Clock className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-extrabold text-amber-600">{data.eta}</p>
              <p className="text-[10px] text-slate-400">คาดถึง</p>
            </div>
          </div>
        </motion.div>

        {/* Progress steps */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
          className="glass-card rounded-2xl p-5 mb-4">
          <h2 className="font-bold text-slate-800 text-sm mb-5">สถานะการจัดส่ง</h2>
          <div className="space-y-0">
            {data.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    step.done    ? 'bg-green-500 border-green-500 text-white' :
                    step.active  ? 'bg-primary border-primary text-white' :
                                   'bg-slate-100 border-slate-200 text-slate-300'
                  }`}>
                    {step.done
                      ? <CheckCircle className="h-4 w-4" />
                      : step.active
                        ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                            <Navigation className="h-4 w-4" />
                          </motion.div>
                        : <span className="text-xs font-bold">{i + 1}</span>
                    }
                  </div>
                  {i < data.steps.length - 1 && (
                    <div className={`w-0.5 h-8 my-1 transition-all ${step.done ? 'bg-green-400' : 'bg-slate-200'}`} />
                  )}
                </div>
                <div className={`pb-4 flex-1 ${!step.done && !step.active ? 'opacity-40' : ''}`}>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${
                      step.active ? 'text-primary' : step.done ? 'text-green-700' : 'text-slate-500'
                    }`}>{step.label}</p>
                    {step.active && (
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        ตอนนี้
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-slate-500">{step.desc}</p>
                    {step.time && <p className="text-xs text-slate-400 font-medium">· {step.time}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Courier card */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
          className="glass-card rounded-2xl p-5 mb-4">
          <h2 className="font-bold text-slate-800 text-sm mb-4">ข้อมูลไรเดอร์</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl glass-sm flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
              {data.courierAvatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-slate-900 text-base">{data.courierName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-amber-600">{data.courierRating}</span>
                <span className="text-xs text-slate-400">(ไรเดอร์มืออาชีพ)</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{data.carrierLabel} · ID {data.trackingId}</p>
            </div>
            <a href={`tel:${data.courierPhone.replace(/-/g, '')}`}
              className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-green-500 text-white hover:bg-green-600 transition-colors flex-shrink-0">
              <Phone className="h-5 w-5" />
              <span className="text-[10px] font-bold">โทร</span>
            </a>
          </div>
          <div className="mt-3 glass-sm rounded-xl px-3 py-2 text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            คาดว่าจะถึงภายใน <span className="font-bold text-slate-700">{data.eta}</span>
          </div>
        </motion.div>

        {/* Back to orders */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="flex gap-3">
          <Link href="/bookings"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-sm border border-white/40 text-sm font-bold text-slate-700 hover:border-primary/40 transition-all">
            <ChevronLeft className="h-4 w-4" /> ดูออเดอร์ทั้งหมด
          </Link>
          <Link href="/marketplace"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-sm font-bold text-primary hover:bg-primary/20 transition-all">
            🛒 สั่งเพิ่ม
          </Link>
        </motion.div>

      </section>
      <AppFooter />
    </main>
  )
}
