'use client'

import { useSystemMode } from '@/hooks/useSystemMode'

/** Amber sticky banner shown at the top of every page when Training Mode is active. */
export function TrainingModeBanner() {
  const { data } = useSystemMode()
  if (!data?.isTrainingMode) return null

  return (
    <div className="sticky top-0 z-[60] w-full bg-amber-400/95 backdrop-blur-sm border-b border-amber-500 py-1.5 px-4 text-center text-sm font-medium text-amber-900">
      <span className="mr-1.5">🎓</span>
      <strong>โหมดฝึกอบรม</strong>
      <span className="mx-2 opacity-60">—</span>
      ข้อมูลทั้งหมดเป็นข้อมูล Mock สำหรับการฝึกอบรมเท่านั้น ไม่ใช่ข้อมูลจริง
    </div>
  )
}
