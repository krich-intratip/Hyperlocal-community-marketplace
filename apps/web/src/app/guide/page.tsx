'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import {
  MapPin, UserPlus, Search, CalendarCheck, Star, Shield,
  ChevronRight, Users, Briefcase, Settings, HelpCircle,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

export default function GuidePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-blue-100/60 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Community<span className="text-blue-600"> Hyper</span>
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/guide" className="text-sm font-semibold text-blue-600">คู่มือ</Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">เกี่ยวกับ</Link>
            <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors">
              สมัครฟรี
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
          <HelpCircle className="h-4 w-4" />
          คู่มือการใช้งาน
        </motion.div>
        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          เริ่มต้นใช้งาน
          <span className="text-blue-600"> ง่ายมาก</span>
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="text-lg text-slate-500 max-w-2xl mx-auto">
          ไม่ว่าคุณจะเป็นลูกค้าที่หาบริการ หรือผู้ให้บริการที่อยากเพิ่มรายได้
          — เริ่มต้นได้ในไม่กี่ขั้นตอน
        </motion.p>
      </section>

      {/* Role selector tabs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Customer Guide */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
          className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">สำหรับลูกค้า</h2>
            <span className="text-sm bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full border border-blue-200">ผู้ใช้บริการ</span>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CUSTOMER_STEPS.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} custom={i}
                whileHover={{ y: -4 }}
                className="relative p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm">
                <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
                <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center mb-4`}>
                  <step.Icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Provider Guide */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
          className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">สำหรับผู้ให้บริการ</h2>
            <span className="text-sm bg-amber-50 text-amber-600 font-semibold px-3 py-1 rounded-full border border-amber-200">Service Provider</span>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROVIDER_STEPS.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} custom={i}
                whileHover={{ y: -4 }}
                className="relative p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm">
                <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
                <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center mb-4`}>
                  <step.Icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Community Admin Guide */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
          className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">สำหรับ Community Admin</h2>
            <span className="text-sm bg-purple-50 text-purple-600 font-semibold px-3 py-1 rounded-full border border-purple-200">ผู้ดูแลชุมชน</span>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ADMIN_STEPS.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} custom={i}
                whileHover={{ y: -4 }}
                className="relative p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm">
                <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-purple-500 text-white text-xs font-black flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
                <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center mb-4`}>
                  <step.Icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* FAQ */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">คำถามที่พบบ่อย</h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FAQS.map((faq, i) => (
              <motion.div key={faq.q} variants={fadeUp} custom={i}
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">{faq.q}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-500 mb-6">พร้อมแล้ว? เริ่มต้นได้เลยวันนี้</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link href="/auth/signin"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
              สมัครสมาชิกฟรี <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-400">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}

const CUSTOMER_STEPS = [
  { Icon: UserPlus, title: 'สมัครสมาชิก', desc: 'ลงทะเบียนด้วย Google Account ในไม่กี่วินาที ไม่ต้องจำรหัสผ่าน', bg: 'bg-blue-50', color: 'text-blue-600' },
  { Icon: MapPin, title: 'เลือกชุมชน', desc: 'เข้าร่วมชุมชนในพื้นที่ของคุณ เพื่อดูบริการที่อยู่ใกล้บ้าน', bg: 'bg-green-50', color: 'text-green-600' },
  { Icon: Search, title: 'ค้นหาบริการ', desc: 'เลือกหมวดหมู่ที่ต้องการ หรือค้นหาด้วยชื่อบริการ/ผู้ให้บริการ', bg: 'bg-amber-50', color: 'text-amber-600' },
  { Icon: CalendarCheck, title: 'จองและรับบริการ', desc: 'เลือกวันเวลา ยืนยันการจอง และรอรับบริการถึงบ้าน', bg: 'bg-purple-50', color: 'text-purple-600' },
]

const PROVIDER_STEPS = [
  { Icon: UserPlus, title: 'สมัครเป็นผู้ให้บริการ', desc: 'กรอกข้อมูลโปรไฟล์ ทักษะ และประสบการณ์ของคุณ', bg: 'bg-amber-50', color: 'text-amber-600' },
  { Icon: Shield, title: 'ผ่านการยืนยันตัวตน', desc: 'ทีมงานตรวจสอบและอนุมัติโปรไฟล์ภายใน 24-48 ชั่วโมง', bg: 'bg-green-50', color: 'text-green-600' },
  { Icon: Briefcase, title: 'สร้าง Listings', desc: 'เพิ่มบริการที่ให้ ราคา รูปภาพ และรายละเอียดให้ครบถ้วน', bg: 'bg-blue-50', color: 'text-blue-600' },
  { Icon: Star, title: 'รับงานและสะสมรีวิว', desc: 'รับการจอง ให้บริการ และสะสมคะแนน Trust Score เพื่อดึงดูดลูกค้า', bg: 'bg-purple-50', color: 'text-purple-600' },
]

const ADMIN_STEPS = [
  { Icon: MapPin, title: 'สร้างชุมชนของคุณ', desc: 'ติดต่อทีมงานเพื่อเปิดชุมชนในพื้นที่ของคุณ ในฐานะ Community Franchise Operator', bg: 'bg-purple-50', color: 'text-purple-600' },
  { Icon: Users, title: 'จัดการผู้ให้บริการ', desc: 'อนุมัติผู้ให้บริการในชุมชน ตั้งค่า trial period และดูแล ecosystem', bg: 'bg-blue-50', color: 'text-blue-600' },
  { Icon: Settings, title: 'ดู Dashboard รายได้', desc: 'ติดตาม commission และ revenue share ที่ได้รับจากบุ๊กกิ้งในชุมชน', bg: 'bg-green-50', color: 'text-green-600' },
]

const FAQS = [
  { q: 'ค่าบริการแพลตฟอร์มคิดเท่าไหร่?', a: 'ช่วงทดลองใช้งาน (Trial Period) ไม่มีค่าใช้จ่าย หลังจากนั้นแพลตฟอร์มเก็บ commission 10-12% จากยอดบุ๊กกิ้งที่สำเร็จ' },
  { q: 'ผู้ให้บริการต้องรอนานแค่ไหนถึงจะได้รับการอนุมัติ?', a: 'ทีมงานตรวจสอบและอนุมัติภายใน 24-48 ชั่วโมงในวันทำการ หลังจากส่งข้อมูลครบถ้วน' },
  { q: 'การชำระเงินปลอดภัยไหม?', a: 'ระบบชำระเงินออนไลน์จะเปิดใช้ใน Sprint ถัดไป ปัจจุบัน (MVP) รองรับการนัดหมายและจองคิวก่อน' },
  { q: 'ลูกค้าสามารถรีวิวผู้ให้บริการได้ไหม?', a: 'ได้เลย หลังจากบุ๊กกิ้งเสร็จสิ้น ลูกค้าสามารถให้ดาว 1-5 และเขียนรีวิว ซึ่งจะแสดงใน Trust Score ของผู้ให้บริการ' },
  { q: 'Community Admin ได้รับรายได้อย่างไร?', a: 'Community Admin ได้รับ revenue share จาก commission ที่เกิดในชุมชนของตน อัตรา share กำหนดตามข้อตกลง franchise' },
  { q: 'มีบริการกี่ประเภท?', a: 'ปัจจุบันรองรับ 10 หมวดหมู่ ได้แก่ อาหาร, งานช่าง, งานบ้าน, ติวเตอร์, ดูแลผู้สูงอายุ, สินค้าทำมือ, สุขภาพ, เกษตร, ฟรีแลนซ์ และ Community Sharing' },
]
