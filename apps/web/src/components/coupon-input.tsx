'use client'
import { useState } from 'react'
import { Tag, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useValidateCoupon } from '@/hooks/useCoupon'

interface CouponInputProps {
  orderTotal: number
  providerId?: string
  onApply: (code: string, discountAmount: number) => void
  onRemove: () => void
  appliedCode?: string
  appliedDiscount?: number
}

export function CouponInput({
  orderTotal,
  providerId,
  onApply,
  onRemove,
  appliedCode,
  appliedDiscount,
}: CouponInputProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const validate = useValidateCoupon()

  async function handleApply() {
    if (!code.trim()) return
    setError('')
    const result = await validate.mutateAsync({ code: code.trim(), orderTotal, providerId })
    if (result.valid) {
      onApply(code.trim().toUpperCase(), result.discountAmount)
      setCode('')
    } else {
      setError(result.message)
    }
  }

  if (appliedCode) {
    return (
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
        <div className="flex-1">
          <span className="text-sm font-bold text-emerald-700">{appliedCode}</span>
          <span className="text-xs text-emerald-600 ml-2">ลด ฿{appliedDiscount?.toLocaleString()}</span>
        </div>
        <button onClick={onRemove} className="text-slate-400 hover:text-slate-600 transition-colors">
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleApply()}
            placeholder="ใส่โค้ดส่วนลด"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary/50 text-slate-700 uppercase placeholder-normal placeholder:normal-case"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={!code.trim() || validate.isPending}
          className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center gap-1.5"
        >
          {validate.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ใช้'}
        </button>
      </div>
      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1">
          <XCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  )
}
