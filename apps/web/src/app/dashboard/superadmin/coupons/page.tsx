'use client'
import { useState } from 'react'
import { useAdminCoupons, useCreateCoupon, useToggleCoupon } from '@/hooks/useCoupon'
import { formatDateMedTH } from '@/lib/date-utils'
import { Tag, Plus, ToggleLeft, ToggleRight, ChevronLeft, Percent, DollarSign, Truck } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { CouponType } from '@/lib/api'

const TYPE_LABEL: Record<CouponType, string> = {
  PERCENT: '% ส่วนลด',
  FIXED: '฿ ลดตรง',
  FREE_DELIVERY: 'ฟรีค่าส่ง',
}
const TYPE_ICON: Record<CouponType, React.ReactNode> = {
  PERCENT: <Percent className="w-3.5 h-3.5" />,
  FIXED: <DollarSign className="w-3.5 h-3.5" />,
  FREE_DELIVERY: <Truck className="w-3.5 h-3.5" />,
}
const TYPE_COLOR: Record<CouponType, string> = {
  PERCENT: 'bg-violet-100 text-violet-700',
  FIXED: 'bg-emerald-100 text-emerald-700',
  FREE_DELIVERY: 'bg-sky-100 text-sky-700',
}

export default function CouponsManagementPage() {
  const { data: coupons, isLoading } = useAdminCoupons()
  const createCoupon = useCreateCoupon()
  const toggleCoupon = useToggleCoupon()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    code: '',
    description: '',
    type: 'PERCENT' as CouponType,
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: '',
    maxUses: '',
    maxUsesPerUser: 1,
    expiresAt: '',
  })
  const [formError, setFormError] = useState('')

  async function handleCreate() {
    setFormError('')
    if (!form.code.trim()) { setFormError('กรุณาใส่โค้ด'); return }
    if (form.discountValue <= 0) { setFormError('ส่วนลดต้องมากกว่า 0'); return }
    try {
      await createCoupon.mutateAsync({
        code: form.code.trim().toUpperCase(),
        description: form.description || undefined,
        type: form.type,
        discountValue: form.discountValue,
        minOrderAmount: form.minOrderAmount,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        maxUsesPerUser: form.maxUsesPerUser,
        expiresAt: form.expiresAt || undefined,
      })
      setShowForm(false)
      setForm({
        code: '', description: '', type: 'PERCENT', discountValue: 10,
        minOrderAmount: 0, maxDiscountAmount: '', maxUses: '', maxUsesPerUser: 1, expiresAt: '',
      })
    } catch {
      setFormError('สร้างคูปองไม่สำเร็จ')
    }
  }

  const active = coupons?.filter(c => c.isActive) ?? []
  const inactive = coupons?.filter(c => !c.isActive) ?? []

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard/superadmin" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary">
          <ChevronLeft className="w-4 h-4" /> SuperAdmin
        </Link>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" /> จัดการคูปอง
        </h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> สร้างคูปอง
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'คูปองทั้งหมด', value: coupons?.length ?? 0, color: 'text-indigo-600' },
          { label: 'ใช้งานอยู่', value: active.length, color: 'text-emerald-600' },
          { label: 'ปิดใช้งาน', value: inactive.length, color: 'text-rose-500' },
        ].map(k => (
          <div key={k.label} className="glass-card rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-xl p-4 mb-6 overflow-hidden"
          >
            <h3 className="font-semibold text-slate-700 mb-4">สร้างคูปองใหม่</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 mb-1 block">โค้ด *</label>
                <input
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="เช่น SUMMER20"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50 uppercase"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 mb-1 block">คำอธิบาย</label>
                <input
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="เช่น ส่วนลดต้อนรับสมาชิกใหม่"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">ประเภท</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as CouponType }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50"
                >
                  <option value="PERCENT">% ส่วนลด</option>
                  <option value="FIXED">฿ ลดตรง</option>
                  <option value="FREE_DELIVERY">ฟรีค่าส่ง</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">
                  มูลค่าส่วนลด {form.type === 'PERCENT' ? '(%)' : form.type === 'FIXED' ? '(฿)' : '(ไม่ต้องกรอก)'}
                </label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={e => setForm(f => ({ ...f, discountValue: Number(e.target.value) }))}
                  disabled={form.type === 'FREE_DELIVERY'}
                  min={0}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">ยอดสั่งซื้อขั้นต่ำ (฿)</label>
                <input
                  type="number"
                  value={form.minOrderAmount}
                  onChange={e => setForm(f => ({ ...f, minOrderAmount: Number(e.target.value) }))}
                  min={0}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">จำกัดการใช้สูงสุด (ว่าง=ไม่จำกัด)</label>
                <input
                  type="number"
                  value={form.maxUses}
                  onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
                  min={1}
                  placeholder="ไม่จำกัด"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">ใช้ได้/คน</label>
                <input
                  type="number"
                  value={form.maxUsesPerUser}
                  onChange={e => setForm(f => ({ ...f, maxUsesPerUser: Number(e.target.value) }))}
                  min={1}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">วันหมดอายุ</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
            </div>
            {formError && <p className="text-xs text-rose-500 mt-2">{formError}</p>}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreate}
                disabled={createCoupon.isPending}
                className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-bold disabled:opacity-50 hover:bg-primary/90"
              >
                {createCoupon.isPending ? 'กำลังสร้าง...' : '✓ สร้างคูปอง'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupon list */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {coupons?.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass-card rounded-xl p-4 flex items-start gap-3 ${!c.isActive ? 'opacity-60' : ''}`}
            >
              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${TYPE_COLOR[c.type]} shrink-0`}>
                {TYPE_ICON[c.type]} {TYPE_LABEL[c.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-800 tracking-wide">{c.code}</span>
                  {!c.isActive && (
                    <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">ปิดใช้งาน</span>
                  )}
                </div>
                {c.description && <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>}
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <span className="text-xs text-slate-500">
                    ลด{' '}
                    {c.type === 'PERCENT'
                      ? `${c.discountValue}%`
                      : c.type === 'FIXED'
                      ? `฿${c.discountValue}`
                      : 'ค่าส่ง'}
                    {c.maxDiscountAmount ? ` (สูงสุด ฿${c.maxDiscountAmount})` : ''}
                  </span>
                  {c.minOrderAmount > 0 && (
                    <span className="text-xs text-slate-400">ขั้นต่ำ ฿{c.minOrderAmount}</span>
                  )}
                  <span className="text-xs text-slate-400">
                    ใช้แล้ว {c.usedCount}/{c.maxUses ?? '∞'}
                  </span>
                  {c.expiresAt && (
                    <span className="text-xs text-amber-600">หมด {formatDateMedTH(c.expiresAt)}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleCoupon.mutate({ id: c.id, active: c.isActive })}
                disabled={toggleCoupon.isPending}
                className="shrink-0 text-slate-400 hover:text-primary transition-colors disabled:opacity-50"
              >
                {c.isActive
                  ? <ToggleRight className="w-6 h-6 text-primary" />
                  : <ToggleLeft className="w-6 h-6" />}
              </button>
            </motion.div>
          ))}
          {!coupons?.length && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-2">🎟️</p>
              <p>ยังไม่มีคูปอง — กด &quot;สร้างคูปอง&quot; เพื่อเริ่ม</p>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
