'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { MapPin, Chrome, ArrowRight, Shield, Users, Star } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function SignInPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-md mx-auto px-4 sm:px-6 pt-16 pb-20">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
            <Shield className="h-4 w-4" />
            เข้าสู่ระบบด้วย Google — ปลอดภัย 100%
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">ยินดีต้อนรับ</h1>
          <p className="text-slate-500">เข้าร่วมชุมชนหรือเป็นผู้ให้บริการได้เลยทันที</p>
        </motion.div>

        {/* Sign in card */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-xl p-8">

          {/* Google OAuth button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700 hover:border-blue-300 hover:shadow-lg transition-all"
          >
            <Chrome className="h-5 w-5 text-blue-500" />
            เข้าสู่ระบบด้วย Google
          </motion.button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">หรือ</span>
            </div>
          </div>

          {/* Role selection hint */}
          <p className="text-center text-sm text-slate-500 mb-4">สมัครในฐานะ...</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div whileHover={{ scale: 1.03 }}
              className="cursor-pointer p-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-blue-700">ลูกค้า</div>
              <div className="text-xs text-blue-500 mt-0.5">หาบริการในชุมชน</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }}
              className="cursor-pointer p-4 rounded-xl border-2 border-slate-200 bg-white text-center hover:border-amber-300 hover:bg-amber-50 transition-colors">
              <Star className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-700">ผู้ให้บริการ</div>
              <div className="text-xs text-slate-500 mt-0.5">สร้างรายได้จากทักษะ</div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
          >
            เริ่มต้นด้วย Google <ArrowRight className="h-4 w-4" />
          </motion.button>

          <p className="text-center text-xs text-slate-400 mt-5 leading-relaxed">
            การเข้าสู่ระบบถือว่าคุณยอมรับ{' '}
            <Link href="/terms" className="underline hover:text-blue-600">ข้อกำหนดการใช้งาน</Link>
            {' '}และ{' '}
            <Link href="/privacy" className="underline hover:text-blue-600">นโยบายความเป็นส่วนตัว</Link>
          </p>
        </motion.div>

        {/* Trust signals */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🔒', label: 'OAuth 2.0' },
            { icon: '🛡️', label: 'ไม่เก็บรหัสผ่าน' },
            { icon: '🏆', label: 'Google Verified' },
          ].map((t) => (
            <div key={t.label} className="p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-100">
              <div className="text-2xl mb-1">{t.icon}</div>
              <div className="text-xs font-medium text-slate-600">{t.label}</div>
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  )
}
