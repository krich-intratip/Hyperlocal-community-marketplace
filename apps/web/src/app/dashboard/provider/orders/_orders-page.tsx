'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import {
  Package, Clock, CheckCircle2, XCircle, Truck,
  RefreshCw, Loader2, AlertTriangle, ShoppingBag, CreditCard,
} from 'lucide-react'
import { useState } from 'react'
import { useProviderOrders, useUpdateOrderStatus } from '@/hooks/useOrders'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import type { Order, OrderStatus } from '@/types'
import { formatDateTimeTH } from '@/lib/date-utils'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.05 },
  }),
}

interface StatusConfig {
  label: string
  color: string
  Icon: React.ComponentType<{ className?: string }>
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  PENDING_PAYMENT:       { label: 'รอชำระ',           color: 'text-slate-500 bg-slate-100',   Icon: CreditCard },
  PAYMENT_HELD:          { label: 'ชำระแล้ว รอยืนยัน', color: 'text-amber-600 bg-amber-50',   Icon: Clock },
  CONFIRMED:             { label: 'ยืนยันแล้ว',        color: 'text-blue-600 bg-blue-50',     Icon: CheckCircle2 },
  IN_PROGRESS:           { label: 'กำลังทำ',           color: 'text-violet-600 bg-violet-50', Icon: RefreshCw },
  PENDING_CONFIRMATION:  { label: 'รอลูกค้ายืนยัน',   color: 'text-sky-600 bg-sky-50',       Icon: Clock },
  COMPLETED:             { label: 'เสร็จสิ้น',         color: 'text-green-600 bg-green-50',   Icon: CheckCircle2 },
  CANCELLED_BY_CUSTOMER: { label: 'ลูกค้ายกเลิก',      color: 'text-rose-600 bg-rose-50',     Icon: XCircle },
  CANCELLED_BY_PROVIDER: { label: 'ร้านยกเลิก',        color: 'text-rose-600 bg-rose-50',     Icon: XCircle },
}

interface ActionDef {
  label: string
  next: OrderStatus
  style: string
}

/** Actions available for provider at each status */
const PROVIDER_ACTIONS: Partial<Record<OrderStatus, ActionDef[]>> = {
  PAYMENT_HELD:         [
    { label: 'ยืนยันออเดอร์', next: 'CONFIRMED',             style: 'bg-primary text-white hover:bg-primary/90' },
    { label: 'ยกเลิก',        next: 'CANCELLED_BY_PROVIDER', style: 'border border-rose-300 text-rose-500 hover:bg-rose-50' },
  ],
  CONFIRMED:            [
    { label: 'เริ่มทำ',       next: 'IN_PROGRESS',           style: 'bg-violet-600 text-white hover:bg-violet-700' },
    { label: 'ยกเลิก',        next: 'CANCELLED_BY_PROVIDER', style: 'border border-rose-300 text-rose-500 hover:bg-rose-50' },
  ],
  IN_PROGRESS:          [
    { label: 'ส่งมอบแล้ว',   next: 'PENDING_CONFIRMATION',  style: 'bg-sky-600 text-white hover:bg-sky-700' },
    { label: 'เสร็จสิ้น',    next: 'COMPLETED',             style: 'bg-green-600 text-white hover:bg-green-700' },
  ],
  PENDING_CONFIRMATION: [
    { label: 'เสร็จสิ้น',    next: 'COMPLETED',             style: 'bg-green-600 text-white hover:bg-green-700' },
  ],
}

const FILTER_TABS: { id: string; label: string; statuses: OrderStatus[] }[] = [
  { id: 'active',    label: 'งานที่ต้องดำเนิน',  statuses: ['PAYMENT_HELD', 'CONFIRMED', 'IN_PROGRESS', 'PENDING_CONFIRMATION'] },
  { id: 'pending',   label: 'รอชำระ',             statuses: ['PENDING_PAYMENT'] },
  { id: 'completed', label: 'เสร็จสิ้น',          statuses: ['COMPLETED'] },
  { id: 'cancelled', label: 'ยกเลิก',              statuses: ['CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_PROVIDER'] },
  { id: 'all',       label: 'ทั้งหมด',             statuses: [] },
]

const DELIVERY_LABEL: Record<string, string> = {
  self_pickup:  '🚶 รับเอง',
  lineman:      '🛵 Lineman',
  grab_express: '🚗 Grab Express',
}

function OrderCard({ order, idx }: { order: Order; idx: number }) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus(order.id)
  const status   = order.status
  const cfg      = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING_PAYMENT
  const actions  = PROVIDER_ACTIONS[status] ?? []
  const delivery = order.deliveryMethod ?? 'self_pickup'

  return (
    <motion.div
      variants={fadeUp} custom={idx}
      initial="hidden" animate="show"
      className="glass-card rounded-2xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-sm text-slate-500 mt-0.5">
            {formatDateTimeTH(order.createdAt)}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
          <cfg.Icon className="h-3.5 w-3.5" />
          {cfg.label}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-slate-700">{item.listingTitle} ×{item.qty}</span>
            <span className="font-semibold text-slate-800">฿{item.lineTotal.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div className="flex items-center justify-between pt-2 border-t border-white/30">
        <div className="flex items-center gap-3">
          <span className="text-xs glass-sm px-2 py-0.5 rounded-full text-slate-600">
            {DELIVERY_LABEL[delivery] ?? delivery}
          </span>
          {order.trackingId && (
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
              <Truck className="h-3 w-3" />{order.trackingId}
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">ยอดรวม</p>
          <p className="text-base font-extrabold text-slate-900">฿{order.total.toLocaleString()}</p>
        </div>
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex gap-2 pt-1">
          {actions.map((action) => (
            <button
              key={action.next}
              onClick={() => updateStatus(action.next)}
              disabled={isPending}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${action.style}`}
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function ProviderOrdersPage() {
  useAuthGuard(['provider', 'admin', 'superadmin'])
  const [activeTab, setActiveTab] = useState('active')
  const { data: orders = [], isLoading, isError, refetch } = useProviderOrders()

  const currentTab = FILTER_TABS.find((t) => t.id === activeTab)!
  const filtered = currentTab.statuses.length === 0
    ? orders
    : orders.filter((o) => (currentTab.statuses as string[]).includes(o.status))

  const badgeCounts = Object.fromEntries(
    FILTER_TABS.map((t) => [
      t.id,
      t.statuses.length === 0
        ? orders.length
        : orders.filter((o) => (t.statuses as string[]).includes(o.status)).length,
    ]),
  )

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-24">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">ออเดอร์ขาเข้า</h1>
                <p className="text-sm text-slate-500">{orders.length} ออเดอร์ทั้งหมด</p>
              </div>
            </div>
            <button onClick={() => refetch()}
              className="p-2 rounded-xl hover:bg-white/30 transition-colors" title="รีเฟรช">
              <RefreshCw className={`h-4 w-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="flex gap-2 overflow-x-auto pb-1 mb-5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'glass text-slate-600 hover:bg-white/40'
              }`}
            >
              {tab.label}
              {(badgeCounts[tab.id] ?? 0) > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-primary/15 text-primary'
                }`}>
                  {badgeCounts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          </div>
        ) : isError ? (
          <motion.div variants={fadeUp} initial="hidden" animate="show"
            className="glass-card rounded-2xl p-8 text-center">
            <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">ไม่สามารถโหลดออเดอร์ได้</p>
            <button onClick={() => refetch()} className="mt-4 text-sm text-primary hover:underline">ลองใหม่</button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div variants={fadeUp} initial="hidden" animate="show"
            className="glass-card rounded-2xl p-10 text-center">
            <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">ไม่มีออเดอร์ในหมวดนี้</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((order, i) => (
                <OrderCard key={order.id} order={order} idx={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <AppFooter />
    </main>
  )
}
