'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { ChevronLeft, Package, AlertCircle, CheckCircle, Loader2, Upload } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useCreateReturn } from '@/hooks/useReturns'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}

const RETURN_REASONS = [
  { value: 'WRONG_ITEM',    label: 'ได้รับสินค้าผิดรายการ' },
  { value: 'DAMAGED',       label: 'สินค้าเสียหาย / ชำรุด' },
  { value: 'NOT_RECEIVED',  label: 'ไม่ได้รับสินค้า' },
  { value: 'QUALITY',       label: 'คุณภาพไม่ตรงตามที่ระบุ' },
  { value: 'CHANGED_MIND',  label: 'เปลี่ยนใจ / ไม่ต้องการสินค้าแล้ว' },
  { value: 'OTHER',         label: 'เหตุผลอื่น ๆ' },
]

export default function ReturnRequestPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <AppFooter />
      </main>
    }>
      <ReturnRequestContent />
    </Suspense>
  )
}

function ReturnRequestContent() {
  useAuthGuard()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') ?? ''

  const [reason, setReason]           = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted]     = useState(false)
  const [formError, setFormError]     = useState('')

  const createReturn = useCreateReturn()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!orderId) { setFormError('ไม่พบหมายเลขคำสั่งซื้อ กรุณากลับไปที่หน้าประวัติคำสั่งซื้อ'); return }
    if (!reason)  { setFormError('กรุณาเลือกเหตุผลการคืนสินค้า'); return }
    if (description.trim().length < 10) { setFormError('กรุณาอธิบายรายละเอียดอย่างน้อย 10 ตัวอักษร'); return }

    setFormError('')
    try {
      await createReturn.mutateAsync({ orderId, reason, description: description.trim() })
      setSubmitted(true)
    } catch {
      setFormError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-10 max-w-sm w-full text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-extrabold text-slate-800">ส่งคำขอคืนสินค้าแล้ว</h2>
            <p className="text-slate-500 text-sm">
              ทีมงานจะตรวจสอบและติดต่อกลับภายใน 1-3 วันทำการ
            </p>
            <p className="text-xs text-slate-400">หมายเลขคำสั่งซื้อ: <strong>{orderId}</strong></p>
            <Link href="/bookings"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary text-white px-6 py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors">
              ดูประวัติคำสั่งซื้อ
            </Link>
          </motion.div>
        </div>
        <AppFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/bookings" className="hover:text-primary flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" /> ประวัติคำสั่งซื้อ
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">แจ้งคืนสินค้า</span>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
              <Package className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">แจ้งคืนสินค้า / ขอเงินคืน</h1>
              {orderId && <p className="text-sm text-slate-500 mt-0.5">คำสั่งซื้อ: <strong className="text-primary font-mono">{orderId}</strong></p>}
            </div>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
            <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              คำขอคืนสินค้าจะถูกส่งให้ทีมงานพิจารณาภายใน 1-3 วันทำการ หากอนุมัติแล้วเงินจะคืนเข้าบัญชีภายใน 5-7 วันทำการ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Reason */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                เหตุผลการคืนสินค้า <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2">
                {RETURN_REASONS.map((r) => (
                  <label key={r.value}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      reason === r.value
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'glass border border-slate-200 hover:border-primary/30'
                    }`}>
                    <input type="radio" name="reason" value={r.value}
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-primary" />
                    <span className={`text-sm font-medium ${reason === r.value ? 'text-primary' : 'text-slate-700'}`}>
                      {r.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                รายละเอียดเพิ่มเติม <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="กรุณาอธิบายปัญหาที่พบ เช่น สภาพสินค้า ความเสียหาย หรือรายละเอียดอื่นๆ ที่เกี่ยวข้อง..."
                className="w-full rounded-2xl glass px-4 py-3 text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{description.length} ตัวอักษร (ขั้นต่ำ 10)</p>
            </div>

            {/* Photo upload note */}
            <div className="flex items-center gap-3 glass-sm rounded-xl px-4 py-3 text-sm text-slate-500">
              <Upload className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <span>แนบรูปถ่าย (ไม่จำเป็น) — ฟีเจอร์อัพโหลดรูปจะพร้อมใช้งานเร็วๆ นี้</span>
            </div>

            {/* Error */}
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {formError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={createReturn.isPending}
              className="w-full rounded-2xl bg-rose-500 text-white py-3.5 font-bold text-base shadow-md shadow-rose-200/40 hover:bg-rose-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {createReturn.isPending && <Loader2 className="h-5 w-5 animate-spin" />}
              ส่งคำขอคืนสินค้า
            </button>
            <p className="text-center text-xs text-slate-400">
              การส่งคำขอนี้จะถูกบันทึกและติดตามโดยทีมงาน Admin
            </p>
          </form>
        </motion.div>
      </section>
      <AppFooter />
    </main>
  )
}
