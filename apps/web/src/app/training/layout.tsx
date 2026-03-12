import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'โหมดฝึกอบรม | Community Hyperlocal Marketplace',
  description: 'โหมดฝึกอบรมสำหรับ Community Hyperlocal Marketplace — ข้อมูล Mock เพื่อการเรียนรู้',
  robots: { index: false, follow: false }, // don't index training pages
}

/**
 * Training mode layout.
 * Routes under /training/* ALWAYS show the amber training banner,
 * regardless of the system-level mode setting.
 * This gives training instructors a permanent, shareable URL.
 */
export default function TrainingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-[60] w-full bg-amber-400 border-b border-amber-500 py-2 px-4 text-center text-sm font-semibold text-amber-900">
        <span className="mr-1.5">🎓</span>
        <strong>โหมดฝึกอบรม</strong>
        <span className="mx-2 opacity-60">—</span>
        ข้อมูลทั้งหมดเป็นข้อมูล Mock สำหรับการฝึกอบรมเท่านั้น ไม่ใช่ข้อมูลจริง
      </div>
      {children}
    </>
  )
}
