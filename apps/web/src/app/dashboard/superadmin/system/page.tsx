'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Settings, ChevronLeft, GraduationCap, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useSystemMode, useSetSystemMode } from '@/hooks/useSystemMode'
import { toast } from 'sonner'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
}

export default function SystemSettingsPage() {
  useAuthGuard(['superadmin'])

  const { data: modeData, isLoading } = useSystemMode()
  const setMode = useSetSystemMode()
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingMode, setPendingMode] = useState<boolean | null>(null)

  const isTraining = modeData?.isTrainingMode ?? true

  const handleToggleClick = (targetTraining: boolean) => {
    if (targetTraining === isTraining) return
    setPendingMode(targetTraining)
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    if (pendingMode === null) return
    setMode.mutate(pendingMode, {
      onSuccess: () => {
        toast.success(
          pendingMode
            ? '🎓 เปลี่ยนเป็นโหมดฝึกอบรมแล้ว'
            : '✅ เปลี่ยนเป็นโหมดใช้งานจริงแล้ว',
        )
        setShowConfirm(false)
        setPendingMode(null)
      },
      onError: () => {
        toast.error('เกิดข้อผิดพลาด — ไม่สามารถเปลี่ยนโหมดได้')
        setShowConfirm(false)
      },
    })
  }

  return (
    <main className="relative min-h-screen">
      <MarketBackground />
      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Back */}
        <Link href="/dashboard/superadmin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          กลับไปแดชบอร์ด
        </Link>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Settings className="h-6 w-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ตั้งค่าระบบ</h1>
            <p className="text-sm text-slate-500">จัดการโหมดการทำงานของแพลตฟอร์ม</p>
          </div>
        </motion.div>

        {/* Current mode card */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-6">
          {isLoading ? (
            <div className="glass-card rounded-2xl p-8 flex items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>กำลังโหลด...</span>
            </div>
          ) : (
            <div className={`glass-card rounded-2xl p-6 border-2 transition-colors ${isTraining ? 'border-amber-300 bg-amber-50/60' : 'border-green-300 bg-green-50/60'}`}>
              <div className="flex items-center gap-3 mb-4">
                {isTraining ? (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-900">โหมดปัจจุบัน: ฝึกอบรม</p>
                      <p className="text-xs text-amber-700">ระบบใช้ข้อมูล Mock — ไม่กระทบข้อมูลจริง</p>
                    </div>
                    <span className="ml-auto px-3 py-1 rounded-full bg-amber-200 text-amber-800 text-xs font-bold">🎓 TRAINING</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-green-900">โหมดปัจจุบัน: ใช้งาน</p>
                      <p className="text-xs text-green-700">ระบบเชื่อมต่อกับฐานข้อมูลจริง (Supabase)</p>
                    </div>
                    <span className="ml-auto px-3 py-1 rounded-full bg-green-200 text-green-800 text-xs font-bold">✅ PRODUCTION</span>
                  </>
                )}
              </div>

              {/* Toggle buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => handleToggleClick(true)}
                  disabled={isTraining || setMode.isPending}
                  className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
                    ${isTraining
                      ? 'bg-amber-200 text-amber-700 cursor-default'
                      : 'bg-white border border-amber-300 text-amber-700 hover:bg-amber-50'}`}
                >
                  <GraduationCap className="h-4 w-4" />
                  โหมดฝึกอบรม
                  {isTraining && <span className="text-xs">(ใช้งานอยู่)</span>}
                </button>

                <button
                  onClick={() => handleToggleClick(false)}
                  disabled={!isTraining || setMode.isPending}
                  className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
                    ${!isTraining
                      ? 'bg-green-200 text-green-700 cursor-default'
                      : 'bg-white border border-green-300 text-green-700 hover:bg-green-50'}`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  โหมดใช้งาน
                  {!isTraining && <span className="text-xs">(ใช้งานอยู่)</span>}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Info cards */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass-card rounded-2xl p-5 border border-amber-200 bg-amber-50/40">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4 text-amber-600" />
              <h3 className="font-bold text-amber-900 text-sm">โหมดฝึกอบรม</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-800">
              <li>• ใช้ข้อมูล Mock จาก SQLite3 seed</li>
              <li>• แสดง banner สีเหลืองบนทุกหน้า</li>
              <li>• URL /training/* เข้าถึงได้เสมอ</li>
              <li>• ไม่กระทบข้อมูลจริงใดๆ</li>
              <li>• เหมาะสำหรับ: demo, onboarding, ทดสอบ</li>
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-green-200 bg-green-50/40">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <h3 className="font-bold text-green-900 text-sm">โหมดใช้งาน</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-green-800">
              <li>• เชื่อมต่อ Supabase (PostgreSQL)</li>
              <li>• ไม่มี banner แสดงบนหน้าปกติ</li>
              <li>• ข้อมูลจริงทั้งหมด</li>
              <li>• ต้องตั้งค่า APP_ENV=production</li>
              <li>• เหมาะสำหรับ: ใช้งานจริงกับผู้ใช้จริง</li>
            </ul>
          </div>
        </motion.div>

        {/* Warning */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}>
          <div className="glass rounded-2xl p-4 border border-slate-200 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">
              <strong>หมายเหตุ:</strong> การเปลี่ยนโหมดมีผลต่อ banner ที่แสดงและข้อมูลในระบบทันที
              สำหรับการเปลี่ยนไปโหมดใช้งาน ต้องตั้งค่า{' '}
              <code className="bg-slate-100 px-1 rounded text-xs">APP_ENV=production</code>{' '}
              และ <code className="bg-slate-100 px-1 rounded text-xs">DATABASE_URL</code>{' '}
              ใน Cloudflare Pages environment variables ก่อน
            </p>
          </div>
        </motion.div>
      </div>

      <AppFooter />

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-heavy rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pendingMode ? 'bg-amber-100' : 'bg-green-100'}`}>
                {pendingMode ? (
                  <GraduationCap className="h-5 w-5 text-amber-600" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
              </div>
              <h3 className="font-bold text-slate-900">
                ยืนยันการเปลี่ยนโหมด
              </h3>
            </div>

            <p className="text-sm text-slate-600 mb-2">
              คุณต้องการเปลี่ยนระบบเป็น{' '}
              <strong>{pendingMode ? 'โหมดฝึกอบรม 🎓' : 'โหมดใช้งาน ✅'}</strong>?
            </p>

            {!pendingMode && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800">
                <strong>คำเตือน:</strong> ตรวจสอบว่าได้ตั้งค่า APP_ENV=production และ
                DATABASE_URL ใน Cloudflare Pages แล้วก่อนเปลี่ยนโหมด
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowConfirm(false); setPendingMode(null) }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirm}
                disabled={setMode.isPending}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-colors flex items-center justify-center gap-2
                  ${pendingMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {setMode.isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
                ยืนยัน
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}
