'use client'
import { useState } from 'react'
import { useSubmitReport } from '@/hooks/useReport'
import type { ReportType, ReportReason } from '@/lib/api'

interface ReportButtonProps {
  type: ReportType
  targetId: string
  className?: string
}

const REASONS: { value: ReportReason; label: string }[] = [
  { value: 'SPAM', label: '📢 สแปม' },
  { value: 'INAPPROPRIATE', label: '🔞 เนื้อหาไม่เหมาะสม' },
  { value: 'FAKE', label: '🎭 ข้อมูลเท็จ' },
  { value: 'SCAM', label: '💸 หลอกลวง/ฉ้อโกง' },
  { value: 'HARASSMENT', label: '😡 คุกคาม/ข่มขู่' },
  { value: 'OTHER', label: '❓ อื่นๆ' },
]

export function ReportButton({ type, targetId, className = '' }: ReportButtonProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason>('SPAM')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const mutation = useSubmitReport()

  const handleSubmit = () => {
    mutation.mutate(
      { type, targetId, reason, description: description.trim() || undefined },
      {
        onSuccess: () => {
          setSubmitted(true)
          setTimeout(() => { setOpen(false); setSubmitted(false) }, 2000)
        },
      },
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors ${className}`}
      >
        🚩 รายงาน
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            {submitted ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">✅</div>
                <p className="font-semibold text-slate-700">ส่งรายงานเรียบร้อยแล้ว</p>
                <p className="text-sm text-slate-500 mt-1">ทีมงานจะตรวจสอบภายใน 24 ชม.</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-slate-800 mb-4">🚩 รายงานเนื้อหา</h3>

                {/* Reason select */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-600 mb-2 block">เหตุผล</label>
                  <div className="grid grid-cols-2 gap-2">
                    {REASONS.map(r => (
                      <button
                        key={r.value}
                        onClick={() => setReason(r.value)}
                        className={`text-xs px-3 py-2 rounded-lg border transition-all text-left ${
                          reason === r.value
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'border-white/30 glass-sm text-slate-600 hover:border-primary/50'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-600 mb-1 block">รายละเอียดเพิ่มเติม (ไม่จำเป็น)</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="อธิบายเพิ่มเติม..."
                    className="w-full px-3 py-2 glass-sm rounded-lg text-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  <p className="text-right text-xs text-slate-400">{description.length}/500</p>
                </div>

                {mutation.isError && (
                  <p className="text-sm text-red-500 mb-3">
                    {(mutation.error as Error)?.message || 'เกิดข้อผิดพลาด'}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                    className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-medium disabled:opacity-50"
                  >
                    {mutation.isPending ? 'กำลังส่ง...' : 'ส่งรายงาน'}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2 glass-sm rounded-xl text-sm text-slate-600"
                  >
                    ยกเลิก
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
