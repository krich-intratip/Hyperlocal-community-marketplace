'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import {
  CheckCircle, Clock, AlertTriangle, Loader2, Smartphone,
  RefreshCw, ChevronLeft, ShieldCheck, CreditCard, Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useInitiatePayment, usePaymentStatus, useSimulatePay } from '@/hooks/usePayments'
import type { PaymentMethod } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

function useCountdown(expiresAt: string | undefined) {
  const [remaining, setRemaining] = useState(0)
  useEffect(() => {
    if (!expiresAt) return
    const tick = () => setRemaining(Math.max(0, new Date(expiresAt).getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiresAt])
  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  return { remaining, label: `${minutes}:${String(seconds).padStart(2, '0')}` }
}

export default function PaymentPageContent() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get('orderId') ?? undefined

  const initiate = useInitiatePayment()
  const simulate = useSimulatePay()

  // Read method stored by cart page
  const storedMethod = (typeof window !== 'undefined'
    ? sessionStorage.getItem('chm:payMethod') ?? 'promptpay'
    : 'promptpay') as PaymentMethod

  // Poll payment status (stops when settled)
  const pollingEnabled = !initiate.isPending && !!initiate.data
  const { data: payment } = usePaymentStatus(orderId, pollingEnabled)

  // Initiate payment on mount
  useEffect(() => {
    if (orderId && !initiate.data && !initiate.isPending) {
      initiate.mutate({ orderId, method: storedMethod })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  // Auto-redirect on payment success
  useEffect(() => {
    if (payment?.status === 'PAID') {
      const timer = setTimeout(() => {
        router.push(`/orders/${payment.orderId}`)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [payment?.status, payment?.orderId, router])

  const livePayment = initiate.data ?? payment
  const { label: countdownLabel, remaining } = useCountdown(livePayment?.expiresAt)

  // ── State: no orderId ──────────────────────────────────────────────────────
  if (!orderId) {
    return (
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />
        <section className="max-w-md mx-auto px-4 pt-20 pb-24 text-center">
          <AlertTriangle className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">ไม่พบหมายเลขออเดอร์</h1>
          <p className="text-sm text-slate-500 mb-6">กรุณากลับไปที่ตะกร้าสินค้าและลองใหม่</p>
          <Link href="/cart" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
            <ChevronLeft className="h-4 w-4" /> กลับตะกร้า
          </Link>
        </section>
        <AppFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-md mx-auto px-4 pt-8 pb-24">
        {/* Breadcrumb */}
        <Link href="/cart" className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" /> กลับตะกร้า
        </Link>

        <AnimatePresence mode="wait">
          {/* ── Initiating ── */}
          {initiate.isPending && (
            <motion.div key="loading"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card rounded-3xl p-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="font-bold text-slate-700">กำลังสร้าง QR Code...</p>
            </motion.div>
          )}

          {/* ── Error initiating ── */}
          {initiate.isError && !livePayment && (
            <motion.div key="error"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card rounded-3xl p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <h2 className="font-extrabold text-slate-900 mb-2">ไม่สามารถสร้างการชำระเงินได้</h2>
              <p className="text-sm text-slate-500 mb-5">{(initiate.error as Error)?.message ?? 'กรุณาลองใหม่'}</p>
              <button onClick={() => initiate.mutate({ orderId, method: storedMethod })}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
                <RefreshCw className="h-4 w-4" /> ลองอีกครั้ง
              </button>
            </motion.div>
          )}

          {/* ── PAID — Success ── */}
          {livePayment?.status === 'PAID' && (
            <motion.div key="paid"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="glass-card rounded-3xl p-8 text-center">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">ชำระเงินสำเร็จ!</h2>
              <p className="text-slate-500 text-sm mb-5">กำลังพาคุณไปที่รายละเอียดออเดอร์...</p>
              <div className="flex justify-center">
                <div className="w-32 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div className="h-full bg-green-500 rounded-full"
                    initial={{ width: 0 }} animate={{ width: '100%' }}
                    transition={{ duration: 2.5 }} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── EXPIRED / CANCELLED ── */}
          {(livePayment?.status === 'EXPIRED' || livePayment?.status === 'CANCELLED') && (
            <motion.div key="expired"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card rounded-3xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
                <Clock className="h-10 w-10 text-amber-500" />
              </div>
              <h2 className="font-extrabold text-slate-900 mb-2">
                {livePayment.status === 'EXPIRED' ? 'QR Code หมดอายุแล้ว' : 'การชำระเงินถูกยกเลิก'}
              </h2>
              <p className="text-sm text-slate-500 mb-5">กรุณาสร้าง QR Code ใหม่เพื่อชำระเงิน</p>
              <button
                onClick={() => initiate.mutate({ orderId, method: storedMethod })}
                disabled={initiate.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors disabled:opacity-50">
                <RefreshCw className="h-4 w-4" /> สร้าง QR ใหม่
              </button>
            </motion.div>
          )}

          {/* ── PENDING — show QR / card form ── */}
          {livePayment?.status === 'PENDING' && (
            <motion.div key="pending"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4">
              {/* Header card */}
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                      {livePayment.method === 'promptpay' ? 'ชำระด้วย PromptPay' : 'ชำระด้วยบัตรเครดิต/เดบิต'}
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900">
                      ฿{livePayment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    {livePayment.method === 'promptpay'
                      ? <Smartphone className="h-6 w-6 text-primary" />
                      : <CreditCard className="h-6 w-6 text-primary" />}
                  </div>
                </div>
                {/* Countdown */}
                <div className={`flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2 ${
                  remaining < 60000 ? 'bg-red-50 text-red-600' : 'glass-sm text-slate-600'
                }`}>
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>หมดเวลาใน {countdownLabel}</span>
                  {remaining < 60000 && <span className="text-xs font-normal ml-auto">กำลังจะหมดอายุ!</span>}
                </div>
              </div>

              {/* PromptPay QR */}
              {livePayment.method === 'promptpay' && (
                <div className="glass-card rounded-3xl p-6 text-center">
                  <p className="text-sm font-bold text-slate-700 mb-4">สแกน QR Code ด้วยแอปธนาคาร</p>
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/mock-qr.svg"
                      alt="PromptPay QR Code"
                      className="w-52 h-52 mx-auto rounded-2xl border-4 border-slate-100"
                    />
                    {!USE_REAL_API && (
                      <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        DEV MODE
                      </div>
                    )}
                  </div>
                  <div className="mt-4 glass-sm rounded-xl px-4 py-3">
                    <p className="text-xs text-slate-500 mb-0.5">หมายเลข PromptPay</p>
                    <p className="font-bold text-slate-800 tracking-widest">081-234-5678</p>
                    <p className="text-xs text-slate-400 mt-0.5">ชื่อบัญชี: CHM Community Market</p>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                    ปลอดภัย · ระบบ PromptPay มาตรฐานธนาคาร
                  </div>
                </div>
              )}

              {/* Card form (mock) */}
              {livePayment.method === 'card' && (
                <div className="glass-card rounded-3xl p-6 space-y-3">
                  <p className="text-sm font-bold text-slate-700">กรอกข้อมูลบัตร</p>
                  <input readOnly value="4242 4242 4242 4242"
                    placeholder="หมายเลขบัตร"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 font-mono outline-none focus:border-primary/30" />
                  <div className="grid grid-cols-2 gap-3">
                    <input readOnly value="12/28" placeholder="MM/YY"
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-primary/30" />
                    <input readOnly value="123" placeholder="CVV"
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-primary/30" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-500" /> ข้อมูลบัตรเข้ารหัส SSL/TLS
                  </div>
                </div>
              )}

              {/* Dev simulate button */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => simulate.mutate(livePayment.id)}
                disabled={simulate.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 text-base font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 disabled:opacity-60 transition-colors">
                {simulate.isPending
                  ? <><Loader2 className="h-5 w-5 animate-spin" /> กำลังดำเนินการ...</>
                  : <><Zap className="h-5 w-5" /> จำลองการชำระเงิน ✓</>}
              </motion.button>

              <p className="text-center text-xs text-slate-400">
                ออเดอร์ #{orderId?.slice(-8).toUpperCase()} · ระบบจะอัปเดตสถานะอัตโนมัติหลังชำระ
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <AppFooter />
    </main>
  )
}
