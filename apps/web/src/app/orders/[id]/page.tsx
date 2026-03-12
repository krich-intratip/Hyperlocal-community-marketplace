'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import {
  Package, ChevronLeft, CheckCircle, Clock, Truck, ShoppingBag,
  XCircle, AlertTriangle, MapPin, CreditCard, RotateCcw,
  Printer, Star,
} from 'lucide-react'
import { useCartStore } from '@/store/cart.store'

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
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  useAuthGuard()
  const { id } = use(params)
  const order = buildMockOrder(id)
  const isCancelled = order.status === 'CANCELLED'
  const isCompleted = order.status === 'COMPLETED'
  const currentIdx  = statusIndex(order.status)

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

        {/* Order Items */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
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
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
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
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
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
