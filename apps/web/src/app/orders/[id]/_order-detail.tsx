'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import {
  Package, ChevronLeft, CheckCircle, Clock, Truck, ShoppingBag,
  XCircle, AlertTriangle, MapPin, CreditCard, RotateCcw,
  Printer, Star, Phone, Navigation, MessageSquare,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.38, delay: i * 0.07 } }),
}

// ── Mock order timeline ───────────────────────────────────────────────────────
type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'READY' | 'COMPLETED' | 'CANCELLED'

interface TimelineStep {
  status: OrderStatus
  label: string
  desc: string
  icon: React.ElementType
  color: string
}

const TIMELINE: TimelineStep[] = [
  { status: 'PENDING_PAYMENT', label: 'รอชำระเงิน',      desc: 'ออเดอร์ถูกสร้างแล้ว รอการชำระเงิน',       icon: CreditCard,   color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { status: 'PAID',            label: 'ชำระเงินแล้ว',     desc: 'ได้รับการชำระเงิน กำลังแจ้งร้านค้า',     icon: CheckCircle,  color: 'text-blue-500 bg-blue-50 border-blue-200' },
  { status: 'PROCESSING',      label: 'กำลังเตรียมออเดอร์', desc: 'ร้านค้ากำลังเตรียมสินค้า/บริการของคุณ', icon: Package,      color: 'text-violet-500 bg-violet-50 border-violet-200' },
  { status: 'READY',           label: 'พร้อมส่ง/รับ',     desc: 'ออเดอร์พร้อมแล้ว กำลังจัดส่ง',         icon: Truck,        color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
  { status: 'COMPLETED',       label: 'สำเร็จ',            desc: 'ออเดอร์เสร็จสมบูรณ์ ขอบคุณที่ใช้บริการ', icon: ShoppingBag,  color: 'text-green-500 bg-green-50 border-green-200' },
]

const STATUS_ORDER: OrderStatus[] = ['PENDING_PAYMENT','PAID','PROCESSING','READY','COMPLETED']

function statusIndex(s: OrderStatus) { return STATUS_ORDER.indexOf(s) }

// ── Mock order builder from orderId ──────────────────────────────────────────
interface MockOrderItem { name: string; qty: number; price: number; emoji: string }
interface MockOrder {
  id: string
  status: OrderStatus
  provider: string
  community: string
  address: string
  payMethod: string
  createdAt: string
  items: MockOrderItem[]
  subtotal: number
  platformFee: number
  discount: number
  grandTotal: number
  promoCode?: string
}

// ── Mock delivery tracking ────────────────────────────────────────────────────
type DeliveryCarrier = 'lineman' | 'grab_express' | 'self_pickup'
interface MockDelivery {
  carrier: DeliveryCarrier
  trackingId: string
  courierName: string
  courierAvatar: string
  courierPhone: string
  eta: string
  currentStep: number  // 0-3
}

const DELIVERY_STEPS = [
  { label: 'รับออเดอร์แล้ว',      desc: 'ร้านค้ายืนยันออเดอร์' },
  { label: 'ไรเดอร์รับสินค้า',    desc: 'ไรเดอร์กำลังไปรับที่ร้าน' },
  { label: 'กำลังจัดส่ง',          desc: 'กำลังเดินทางมาหาคุณ' },
  { label: 'ส่งถึงแล้ว',           desc: 'รับสินค้าเรียบร้อย' },
]

function buildMockDelivery(orderId: string): MockDelivery | null {
  // Only show delivery for orders with courier (not self-pickup)
  const hash = orderId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  if (hash % 3 === 0) return null  // ~33% self-pickup orders have no tracking
  const isGrab = hash % 2 === 0
  const trackNum = String(hash).padStart(6, '0')
  return {
    carrier: isGrab ? 'grab_express' : 'lineman',
    trackingId: isGrab ? `GX-${trackNum}` : `LM-${trackNum}`,
    courierName: isGrab ? 'อรรถ คล่องส่ง' : 'สมชาย ขยันส่ง',
    courierAvatar: isGrab ? '🚗' : '🛵',
    courierPhone: isGrab ? '082-345-6789' : '081-234-5678',
    eta: '14:45 น.',
    currentStep: 2,  // กำลังจัดส่ง (in transit)
  }
}

function buildMockOrder(id: string): MockOrder {
  const items: MockOrderItem[] = [
    { name: 'ข้าวราดแกง', qty: 2, price: 80, emoji: '🍱' },
    { name: 'ส้มตำ', qty: 1, price: 60, emoji: '🥗' },
  ]
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const platformFee = Math.round(subtotal * 0.05)
  return {
    id,
    status: 'PROCESSING',
    provider: 'คุณแม่สมใจ',
    community: 'หมู่บ้านศรีนคร',
    address: '99/5 หมู่ 3 ต.บางแค อ.บางแค กทม. 10160',
    payMethod: 'PromptPay',
    createdAt: '12 มี.ค. 2569 เวลา 10:32 น.',
    items,
    subtotal,
    platformFee,
    discount: 0,
    grandTotal: subtotal + platformFee,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function OrderDetailClient({ id }: { id: string }) {
  useAuthGuard()
  const order = buildMockOrder(id)
  const delivery = buildMockDelivery(id)
  const isCancelled = order.status === 'CANCELLED'
  const isCompleted = order.status === 'COMPLETED'
  const currentIdx  = statusIndex(order.status)
  const showDelivery = delivery !== null && !isCancelled && (order.status === 'PROCESSING' || order.status === 'READY' || order.status === 'COMPLETED')

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">

        {/* Back */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-6">
          <Link href="/bookings" className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
            <ChevronLeft className="h-4 w-4" /> การจองและออเดอร์
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="glass-card rounded-2xl p-5 mb-5">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-slate-500">ออเดอร์ #{order.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900">{order.provider}</h1>
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {order.community}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> สั่งเมื่อ {order.createdAt}
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="glass-card rounded-2xl p-5 mb-5">
          <h2 className="font-bold text-slate-800 mb-5 text-sm">ติดตามออเดอร์</h2>

          {isCancelled ? (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-700 text-sm">ออเดอร์ถูกยกเลิก</p>
                <p className="text-xs text-red-500 mt-0.5">ระบบจะคืนเงินภายใน 3-5 วันทำการ</p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {TIMELINE.map((step, i) => {
                const done    = i < currentIdx
                const current = i === currentIdx
                const future  = i > currentIdx
                return (
                  <div key={step.status} className="flex gap-4">
                    {/* Icon + line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        done    ? 'bg-green-500 border-green-500 text-white' :
                        current ? `${step.color} border-current` :
                                  'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        {done
                          ? <CheckCircle className="h-4 w-4" />
                          : <step.icon className="h-4 w-4" />}
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div className={`w-0.5 h-8 my-1 transition-all ${done ? 'bg-green-400' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-4 flex-1 ${future ? 'opacity-40' : ''}`}>
                      <p className={`text-sm font-bold ${current ? 'text-slate-900' : done ? 'text-green-700' : 'text-slate-500'}`}>
                        {step.label}
                        {current && <span className="ml-2 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">ตอนนี้</span>}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Delivery Tracking */}
        {showDelivery && delivery && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="glass-card rounded-2xl p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary" /> ติดตามการจัดส่ง
              </h2>
              <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                delivery.carrier === 'lineman' ? 'bg-green-100 text-green-700' : 'bg-[#00b14f]/10 text-[#00b14f]'
              }`}>
                <span>{delivery.carrier === 'lineman' ? '🛵' : '🚗'}</span>
                <span>{delivery.carrier === 'lineman' ? 'Lineman' : 'Grab Express'}</span>
              </div>
            </div>

            {/* ETA banner */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
              <Navigation className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800">กำลังจัดส่ง — คาดถึง {delivery.eta}</p>
                <p className="text-[11px] text-amber-600">Tracking ID: {delivery.trackingId}</p>
              </div>
              <Link href={`/delivery/track/${delivery.trackingId}`}
                className="ml-auto text-xs font-bold text-primary hover:underline whitespace-nowrap">
                ดูแผนที่ →
              </Link>
            </div>

            {/* Steps */}
            <div className="flex items-start gap-0 mb-4 relative">
              {DELIVERY_STEPS.map((step, i) => {
                const done    = i < delivery.currentStep
                const current = i === delivery.currentStep
                const future  = i > delivery.currentStep
                return (
                  <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                    {i < DELIVERY_STEPS.length - 1 && (
                      <div className={`absolute top-3.5 left-1/2 right-0 h-0.5 -translate-y-1/2 ${done ? 'bg-green-400' : 'bg-slate-200'}`} />
                    )}
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center relative z-10 mb-1.5 transition-all ${
                      done    ? 'bg-green-500 border-green-500 text-white' :
                      current ? 'bg-primary border-primary text-white' :
                                'bg-white border-slate-200 text-slate-300'
                    }`}>
                      {done ? <CheckCircle className="h-3.5 w-3.5" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                    </div>
                    <p className={`text-[10px] font-bold leading-tight ${
                      current ? 'text-primary' : done ? 'text-green-700' : future ? 'text-slate-300' : ''
                    }`}>{step.label}</p>
                  </div>
                )
              })}
            </div>

            {/* Courier card */}
            <div className="flex items-center gap-3 glass-sm rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                {delivery.courierAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{delivery.courierName}</p>
                <p className="text-xs text-slate-400">ไรเดอร์</p>
              </div>
              <a href={`tel:${delivery.courierPhone.replace(/-/g, '')}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors">
                <Phone className="h-3.5 w-3.5" /> โทร
              </a>
            </div>
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={showDelivery ? 4 : 3}
          className="glass-card rounded-2xl p-5 mb-5">
          <h2 className="font-bold text-slate-800 mb-4 text-sm">รายการออเดอร์</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{item.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">x{item.qty}</p>
                </div>
                <p className="text-sm font-bold text-slate-800">฿{(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>ยอดรวมสินค้า</span>
              <span>฿{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>ส่วนลด {order.promoCode && `(${order.promoCode})`}</span>
                <span>-฿{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-slate-600">
              <span>ค่าบริการแพลตฟอร์ม (5%)</span>
              <span>฿{order.platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-white/20">
              <span>ยอดรวมทั้งหมด</span>
              <span className="text-primary">฿{order.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Delivery Info */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={showDelivery ? 5 : 4}
          className="glass-card rounded-2xl p-5 mb-5">
          <h2 className="font-bold text-slate-800 mb-3 text-sm">ข้อมูลการจัดส่ง</h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-700">ที่อยู่จัดส่ง</p>
                <p className="text-slate-500 text-xs mt-0.5">{order.address}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CreditCard className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-700">วิธีชำระเงิน</p>
                <p className="text-slate-500 text-xs mt-0.5">{order.payMethod}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={showDelivery ? 6 : 5}
          className="flex flex-wrap gap-3">
          {isCompleted && (
            <>
              <Link href={`/returns/new?orderId=${order.id}` as any}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-sm border border-white/40 text-sm font-semibold text-slate-700 hover:border-primary/40 transition-all">
                <RotateCcw className="h-4 w-4" /> ขอคืนสินค้า
              </Link>
              <Link href="/marketplace"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-sm border border-white/40 text-sm font-semibold text-slate-700 hover:border-amber-300 transition-all">
                <Star className="h-4 w-4 text-amber-400" /> เขียนรีวิว
              </Link>
            </>
          )}
          {!isCompleted && !isCancelled && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
              <AlertTriangle className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <p className="text-xs text-blue-700">หากมีปัญหา กรุณาติดต่อ Community Admin ของคุณ</p>
            </div>
          )}
          {/* ติดต่อผู้ให้บริการ — links to messages page */}
          <Link href="/messages"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-sm border border-white/40 text-sm font-semibold text-slate-700 hover:border-indigo-300 transition-all">
            <MessageSquare className="h-4 w-4 text-indigo-500" /> ติดต่อผู้ให้บริการ
          </Link>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-sm border border-white/40 text-sm font-semibold text-slate-500 hover:border-slate-300 transition-all ml-auto">
            <Printer className="h-4 w-4" /> พิมพ์ใบเสร็จ
          </button>
        </motion.div>

      </section>
      <AppFooter />
    </main>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { label: string; cls: string }> = {
    PENDING_PAYMENT: { label: 'รอชำระเงิน',     cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    PAID:            { label: 'ชำระแล้ว',       cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    PROCESSING:      { label: 'กำลังเตรียม',    cls: 'bg-violet-100 text-violet-700 border-violet-200' },
    READY:           { label: 'พร้อมส่ง',       cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    COMPLETED:       { label: 'สำเร็จ',          cls: 'bg-green-100 text-green-700 border-green-200' },
    CANCELLED:       { label: 'ยกเลิกแล้ว',    cls: 'bg-red-100 text-red-600 border-red-200' },
  }
  const c = config[status]
  return (
    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${c.cls}`}>
      {c.label}
    </span>
  )
}
