'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import {
  ShoppingCart, Trash2, Minus, Plus, ChevronLeft, ArrowRight,
  CheckCircle, Package, MapPin, Shield, Copy, Smartphone,
  Tag, X as XIcon, Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart.store'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useCreateOrder } from '@/hooks/useOrders'
import type { CreateOrderDto } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
}

type PayMethod = 'promptpay' | 'cash'
type Step = 'review' | 'payment' | 'done'
type DeliveryMethod = 'self_pickup' | 'lineman' | 'grab_express'

const DELIVERY_OPTIONS: { id: DeliveryMethod; label: string; emoji: string; desc: string; fee: number }[] = [
  { id: 'self_pickup',  label: 'รับเอง',      emoji: '🚶', desc: 'ไปรับที่ร้าน', fee: 0  },
  { id: 'lineman',      label: 'Lineman',      emoji: '🛵', desc: '~30-45 นาที', fee: 25 },
  { id: 'grab_express', label: 'Grab Express', emoji: '🚗', desc: '~45-60 นาที', fee: 35 },
]
const DELIVERY_FEE: Record<DeliveryMethod, number> = { self_pickup: 0, lineman: 25, grab_express: 35 }

function copyText(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard?.writeText(text).catch(() => {})
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}

export default function CartPage() {
  useAuthGuard()
  const { items, updateQty, removeItem, clearCart, totalPrice, itemsByProvider, clearProvider } = useCartStore()
  const grouped = itemsByProvider()
  const providerIds = Object.keys(grouped)
  const createOrder = useCreateOrder()

  const [step, setStep] = useState<Step>('review')
  const router = useRouter()
  const [payMethod, setPayMethod] = useState<PayMethod>('promptpay')
  const [payLoading, setPayLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [orderIds, setOrderIds] = useState<string[]>([])
  const [noteByItem, setNoteByItem] = useState<Record<string, string>>({})
  const [addressByProvider, setAddressByProvider] = useState<Record<string, string>>({})
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null)
  const [promoError, setPromoError] = useState('')
  const [deliveryMethodByProvider, setDeliveryMethodByProvider] = useState<Record<string, DeliveryMethod>>({})

  // ── Promo codes ──────────────────────────────────────────────────────────────
  const PROMO_CODES: Record<string, { label: string; calc: (sub: number) => number }> = {
    CHM10:    { label: 'ลด 10% ทุกออเดอร์',         calc: (s) => Math.round(s * 0.10) },
    NEWUSER:  { label: 'ลด ฿50 สำหรับลูกค้าใหม่',   calc: (s) => Math.min(50, s)      },
    HEALTH20: { label: 'ลด 20% เมนูสุขภาพ',         calc: (s) => Math.round(s * 0.20) },
    SUMMER15: { label: 'ลด 15% ซัมเมอร์เซล',        calc: (s) => Math.round(s * 0.15) },
  }

  function applyPromo() {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    const promo = PROMO_CODES[code]
    if (!promo) { setPromoError('โค้ดไม่ถูกต้องหรือหมดอายุแล้ว'); return }
    const discount = promo.calc(subtotal)
    setAppliedPromo({ code, discount, label: promo.label })
    setPromoError('')
    setPromoInput('')
  }
  function removePromo() { setAppliedPromo(null); setPromoError('') }

  const subtotal = totalPrice()
  const platformFee = Math.round(subtotal * 0.05)
  const discount = appliedPromo?.discount ?? 0
  const deliveryFeeTotal = providerIds.reduce((s, pid) => {
    const method = deliveryMethodByProvider[pid] ?? 'self_pickup'
    return s + (DELIVERY_FEE[method] ?? 0)
  }, 0)
  const grandTotal = subtotal + platformFee + deliveryFeeTotal - discount

  function canCheckout() {
    return items.length > 0 && providerIds.every((pid) => {
      const method = deliveryMethodByProvider[pid] ?? 'self_pickup'
      if (method === 'self_pickup') return true
      return (addressByProvider[pid] ?? '').trim() !== ''
    })
  }

  async function handlePlaceOrder() {
    setPayLoading(true)
    const ids: string[] = []
    for (const providerId of providerIds) {
      const provItems = grouped[providerId]
      const first = provItems[0]
      const delivMethod = deliveryMethodByProvider[providerId] ?? 'self_pickup'
      const dto: CreateOrderDto = {
        providerId: first.providerId,
        communityId: first.communityId,
        items: provItems.map((i) => ({
          listingId: i.listingId,
          qty: i.qty,
          note: noteByItem[i.id] || undefined,
        })),
        deliveryAddress: delivMethod !== 'self_pickup' ? (addressByProvider[providerId] || undefined) : undefined,
        paymentMethod: payMethod === 'promptpay' ? 'PROMPTPAY' : 'CASH',
        note: delivMethod !== 'self_pickup' ? delivMethod : undefined,
      }
      await new Promise<void>((resolve) => {
        createOrder.mutate(dto, {
          onSuccess: (res) => { const id = (res as any)?.data?.id ?? (res as any)?.id; if (id) ids.push(id); resolve() },
          onError: () => { ids.push(`O${Date.now().toString().slice(-6)}`); resolve() },
        })
      })
    }
    setOrderIds(ids)
    setPayLoading(false)
    clearCart()
    // Store payment method for the payment page
    const method = payMethod === 'cash' ? 'cod' : payMethod
    if (typeof window !== 'undefined') sessionStorage.setItem('chm:payMethod', method)
    if (ids.length > 0) {
      router.push(`/checkout/payment?orderId=${ids[0]}`)
    } else {
      setStep('done')
    }
  }

  if (step === 'done') {
    return (
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />
        <section className="max-w-lg mx-auto px-4 pt-16 pb-24 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="w-24 h-24 rounded-full glass-sm flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">สั่งซื้อสำเร็จ!</h1>
            <p className="text-slate-500 text-sm mb-5">คำสั่งซื้อของคุณได้รับการบันทึกแล้ว ผู้ให้บริการจะยืนยันภายใน 1 ชั่วโมง</p>
          </motion.div>
          {orderIds.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="glass-sm rounded-2xl p-4 mb-6 text-sm text-left space-y-1">
              <p className="font-bold text-primary mb-2">หมายเลขคำสั่งซื้อ</p>
              {orderIds.map((oid) => (
                <p key={oid} className="font-mono font-bold text-primary">#{oid}</p>
              ))}
            </motion.div>
          )}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="flex flex-col gap-3">
            <Link href="/bookings"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-white hover:bg-primary/90 transition-colors">
              ดูรายการจองทั้งหมด <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/marketplace"
              className="w-full text-center text-sm text-slate-400 hover:text-primary py-2 transition-colors">
              กลับไป Marketplace
            </Link>
          </motion.div>
        </section>
        <AppFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-24">

        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/marketplace" className="hover:text-primary flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" /> Marketplace
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5">
            <ShoppingCart className="h-3.5 w-3.5" /> ตะกร้าสินค้า
          </span>
        </motion.div>

        {/* Empty state */}
        {items.length === 0 && step === 'review' && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-center py-20">
            <Package className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-slate-600 dark:text-slate-300 mb-2">ตะกร้าว่างเปล่า</h2>
            <p className="text-sm text-slate-400 mb-6">เพิ่มสินค้าหรือบริการจาก Marketplace ก่อนสั่งซื้อ</p>
            <Link href="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary/90 transition-colors">
              ไปที่ Marketplace <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

        {/* ── Step: review ── */}
        {step === 'review' && items.length > 0 && (
          <>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="flex items-center justify-between mb-5">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                รายการสั่งซื้อ
                <span className="ml-2 text-sm font-normal text-slate-400">
                  ({items.reduce((s, i) => s + i.qty, 0)} รายการ)
                </span>
              </h1>
              <button onClick={() => clearCart()}
                className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
                ล้างทั้งหมด
              </button>
            </motion.div>

            {/* Items grouped by provider */}
            <AnimatePresence>
              {providerIds.map((providerId, pi) => {
                const provItems = grouped[providerId]
                const first = provItems[0]
                const provSubtotal = provItems.reduce((s, i) => s + i.price * i.qty, 0)
                return (
                  <motion.div key={providerId} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, x: 40 }} custom={pi + 2}
                    className="glass-card rounded-2xl p-5 mb-4">

                    {/* Provider header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/20 mb-4">
                      <span className="text-2xl">{first.providerAvatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{first.provider}</p>
                          <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {first.community}
                        </p>
                      </div>
                      <p className="font-extrabold text-primary text-sm flex-shrink-0">฿{provSubtotal.toLocaleString()}</p>
                    </div>

                    {/* Items */}
                    <div className="space-y-3 mb-4">
                      {provItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-xl glass-sm flex items-center justify-center text-2xl flex-shrink-0">
                            {item.listingImage}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">
                              {item.menuName ?? item.listingTitle}
                            </p>
                            {item.menuName && (
                              <p className="text-xs text-slate-400 truncate">{item.listingTitle}</p>
                            )}
                            <p className="text-xs text-primary font-bold">฿{item.price}/{item.unit}</p>
                            {/* Item note */}
                            <input
                              value={noteByItem[item.id] ?? ''}
                              onChange={(e) => setNoteByItem((prev) => ({ ...prev, [item.id]: e.target.value }))}
                              placeholder="หมายเหตุ (เช่น ไม่เผ็ด, แพ้อาหาร...)"
                              className="mt-1.5 w-full text-xs rounded-lg border border-white/20 px-2.5 py-1.5 glass text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-primary/40 transition-colors"
                            />
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-400 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="flex items-center gap-1">
                              <button onClick={() => updateQty(item.id, item.qty - 1)}
                                className="w-7 h-7 rounded-lg glass-sm flex items-center justify-center hover:bg-white/30 transition-all">
                                <Minus className="h-3 w-3 text-slate-500" />
                              </button>
                              <span className="w-7 text-center text-sm font-extrabold text-slate-800 dark:text-white">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, item.qty + 1)}
                                className="w-7 h-7 rounded-lg glass-sm flex items-center justify-center hover:bg-white/30 transition-all">
                                <Plus className="h-3 w-3 text-slate-500" />
                              </button>
                            </div>
                            <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
                              ฿{(item.price * item.qty).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery method selector */}
                    <div className="mb-3">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
                        <Truck className="h-3.5 w-3.5 inline mr-1" />วิธีรับสินค้า
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {DELIVERY_OPTIONS.map((opt) => {
                          const selected = (deliveryMethodByProvider[providerId] ?? 'self_pickup') === opt.id
                          return (
                            <button key={opt.id}
                              onClick={() => setDeliveryMethodByProvider((prev) => ({ ...prev, [providerId]: opt.id }))}
                              className={`flex flex-col items-center gap-0.5 p-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                                selected ? 'border-primary/60 bg-primary/5 text-primary' : 'border-white/20 glass-sm text-slate-600 hover:border-white/40'
                              }`}>
                              <span className="text-base">{opt.emoji}</span>
                              <span className="leading-tight">{opt.label}</span>
                              <span className={`text-[10px] font-normal ${selected ? 'text-primary/70' : 'text-slate-400'}`}>
                                {opt.fee === 0 ? 'ฟรี' : `฿${opt.fee}`}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Delivery address — only for courier methods */}
                    {(deliveryMethodByProvider[providerId] ?? 'self_pickup') !== 'self_pickup' ? (
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                          <MapPin className="h-3.5 w-3.5 inline mr-1" />ที่อยู่จัดส่ง <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={addressByProvider[providerId] ?? ''}
                          onChange={(e) => setAddressByProvider((prev) => ({ ...prev, [providerId]: e.target.value }))}
                          rows={2}
                          placeholder="บ้านเลขที่, ซอย, ถนน, แขวง, เขต..."
                          className="w-full rounded-xl border border-white/20 focus:border-primary/50 px-3 py-2.5 text-sm glass text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none resize-none transition-all"
                        />
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 bg-amber-50/80 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-700">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                        <span>รับที่ร้านโดยตรง — ผู้ให้บริการจะแจ้งสถานที่นัดรับหลังยืนยันออเดอร์</span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Promo Code */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={providerIds.length + 2}
              className="glass rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" /> โค้ดส่วนลด
              </p>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <div>
                    <p className="text-sm font-bold text-green-700">{appliedPromo.code}</p>
                    <p className="text-xs text-green-600">{appliedPromo.label} — ลด ฿{appliedPromo.discount.toLocaleString()}</p>
                  </div>
                  <button onClick={removePromo} className="text-green-400 hover:text-red-500 transition-colors">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    placeholder="กรอกโค้ด เช่น CHM10"
                    className="flex-1 px-3 py-2 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase placeholder-normal"
                  />
                  <button onClick={applyPromo}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors whitespace-nowrap">
                    ใช้โค้ด
                  </button>
                </div>
              )}
              {promoError && <p className="text-xs text-red-500 mt-1.5">{promoError}</p>}
              {!appliedPromo && !promoError && (
                <p className="text-xs text-slate-400 mt-1.5">ลองใช้: CHM10, NEWUSER, HEALTH20, SUMMER15</p>
              )}
            </motion.div>

            {/* Order summary */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={providerIds.length + 3}
              className="glass rounded-2xl p-5 mb-5 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>ยอดรวมสินค้า</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> ส่วนลด ({appliedPromo?.code})</span>
                  <span>-฿{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 text-xs">
                <span>ค่าบริการแพลตฟอร์ม (5%)</span>
                <span>฿{platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> ค่าจัดส่ง</span>
                {deliveryFeeTotal === 0
                  ? <span className="text-green-600 font-semibold">ฟรี</span>
                  : <span>฿{deliveryFeeTotal.toLocaleString()}</span>
                }
              </div>
              <div className="border-t border-white/20 pt-2 flex justify-between font-extrabold text-base text-slate-900 dark:text-white">
                <span>รวมทั้งหมด</span>
                <span className="text-primary">฿{grandTotal.toLocaleString()}</span>
              </div>
            </motion.div>

            <motion.button
              variants={fadeUp} initial="hidden" animate="show"
              custom={providerIds.length + 4}
              whileHover={canCheckout() ? { scale: 1.02 } : {}}
              whileTap={canCheckout() ? { scale: 0.97 } : {}}
              disabled={!canCheckout()}
              onClick={() => setStep('payment')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200/50 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              ไปชำระเงิน ฿{grandTotal.toLocaleString()} <ArrowRight className="h-5 w-5" />
            </motion.button>
            {!canCheckout() && items.length > 0 && (
              <p className="text-center text-xs text-slate-400 mt-2">กรุณากรอกที่อยู่จัดส่งให้ครบทุกร้านค้า</p>
            )}
          </>
        )}

        {/* ── Step: payment ── */}
        {step === 'payment' && (
          <>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="text-center mb-5">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">ชำระเงิน</h1>
              <p className="text-sm text-slate-500 mt-1">ยอดรวม <span className="font-extrabold text-primary">฿{grandTotal.toLocaleString()}</span></p>
            </motion.div>

            {/* Method selector */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="grid grid-cols-2 gap-3 mb-5">
              {([['promptpay', '🇹🇭 PromptPay', 'โอนผ่าน QR Code'], ['cash', '💵 เงินสด', 'ชำระเมื่อรับสินค้า/บริการ']] as const).map(([id, label, desc]) => (
                <button key={id} onClick={() => setPayMethod(id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    payMethod === id
                      ? 'border-primary/50 glass-sm'
                      : 'glass hover:border-white/30'
                  }`}>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </button>
              ))}
            </motion.div>

            {/* PromptPay QR */}
            {payMethod === 'promptpay' && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
                className="glass-card rounded-2xl p-6 mb-5 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">สแกน QR เพื่อชำระ</p>
                <div className="mx-auto w-48 h-48 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <rect width="160" height="160" fill="white"/>
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
                <p className="font-extrabold text-2xl text-primary mb-1">฿{grandTotal.toLocaleString()}</p>
                <div className="flex items-center justify-center gap-2 glass-sm rounded-xl px-4 py-2.5 mt-3">
                  <Smartphone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="font-bold text-slate-700 text-sm tracking-wider">081-234-5678</span>
                  <button onClick={() => copyText('0812345678', setCopied)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors ml-1">
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </button>
                </div>
                <p className="text-xs text-amber-600 glass-sm rounded-xl px-3 py-2 mt-4">
                  ⚠️ QR นี้เป็นตัวอย่าง Demo — อย่าโอนเงินจริง
                </p>
              </motion.div>
            )}

            {/* Cash */}
            {payMethod === 'cash' && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
                className="glass-card rounded-2xl p-6 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl glass-sm flex items-center justify-center flex-shrink-0 text-xl">💵</div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white mb-1">ชำระเงินสดเมื่อรับสินค้า/บริการ</p>
                    <p className="text-sm text-slate-500">เตรียมเงินสด <span className="font-bold text-slate-800 dark:text-slate-100">฿{grandTotal.toLocaleString()}</span> ให้พร้อม</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="space-y-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                disabled={payLoading}
                onClick={handlePlaceOrder}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-colors disabled:opacity-60">
                {payLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : <>✅ {payMethod === 'promptpay' ? 'โอนแล้ว ยืนยันคำสั่งซื้อ' : 'ยืนยันคำสั่งซื้อ'} <ArrowRight className="h-4 w-4" /></>}
              </motion.button>
              <button onClick={() => setStep('review')}
                className="w-full text-center text-sm text-slate-500 hover:text-primary py-2 transition-colors">
                ← กลับแก้ไขรายการ
              </button>
            </motion.div>
          </>
        )}
      </section>
      <AppFooter />
    </main>
  )
}
