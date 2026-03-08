'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import {
  Building2, DollarSign, Users, TrendingUp, Shield, ChevronRight,
  CheckCircle, MapPin, Star, BarChart3, Zap, Globe
} from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const BENEFITS = [
  { icon: DollarSign, title: 'Revenue Share 10%', desc: 'รับส่วนแบ่งรายได้จากทุก Booking ในชุมชนของคุณ ไม่มีเพดาน', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/30' },
  { icon: Users, title: 'จัดการชุมชนเอง', desc: 'อนุมัติ Provider รายใหม่ ตั้งราคา Promoted Listings ดูแลคุณภาพบริการ', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
  { icon: Shield, title: 'ช่วงทดลองฟรี', desc: 'แพลตฟอร์มให้ช่วงทดลองตามที่ตกลง ไม่มีค่าใช้จ่ายในการเริ่มต้น', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' },
  { icon: BarChart3, title: 'ข้อมูล Real-time', desc: 'Dashboard แสดงยอด Booking รายได้ และ Trust Score ของทุก Provider', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
  { icon: Zap, title: 'เครื่องมือครบครัน', desc: 'ระบบจัดการ Promotion, Notification ชุมชน และ Campaign Marketing', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/30' },
  { icon: Globe, title: 'แบรนด์ระดับชาติ', desc: 'อยู่ภายใต้แบรนด์ Community Hyper Marketplace ที่น่าเชื่อถือ', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
]

const STEPS_PROCESS = [
  { step: '01', title: 'ยื่นใบสมัคร', desc: 'กรอกข้อมูลชุมชน ข้อมูลผู้สมัคร และแผนธุรกิจเบื้องต้น' },
  { step: '02', title: 'Super Admin ตรวจสอบ', desc: 'ทีมงานตรวจสอบคุณสมบัติและติดต่อสัมภาษณ์สั้นๆ ภายใน 3–5 วัน' },
  { step: '03', title: 'Onboarding ชุมชน', desc: 'ได้รับ Dashboard, ช่วงทดลองใช้งาน และคู่มือการจัดการชุมชน' },
  { step: '04', title: 'เปิดตลาดชุมชน', desc: 'เชิญ Provider เข้าระบบ ประกาศในชุมชน และเริ่มรับ Revenue Share' },
]

const REVENUE_MODEL = [
  { label: 'ยอด Booking รวม/เดือน', example: '฿100,000', note: 'ตัวอย่างชุมชนขนาดกลาง' },
  { label: 'Commission แพลตฟอร์ม (10–12%)', example: '฿10,000–12,000', note: '' },
  { label: 'Revenue Share ของคุณ (10% ของ Commission)', example: '฿1,000–1,200', note: 'ต่อเดือน', highlight: true },
  { label: 'ที่ชุมชนขนาดใหญ่ (฿500,000/เดือน)', example: '฿5,000–6,000', note: 'ต่อเดือน', highlight: true },
]

const ACTIVE_COMMUNITIES = [
  { name: 'หมู่บ้านศรีนคร', province: 'กรุงเทพฯ', providers: 34, rating: 4.8, bookings: 1204 },
  { name: 'คอนโด The Base', province: 'กรุงเทพฯ', providers: 21, rating: 4.9, bookings: 876 },
  { name: 'ชุมชนเมืองทอง', province: 'นนทบุรี', providers: 18, rating: 4.7, bookings: 654 },
]

export default function FranchisePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950">
      <MarketBackground />
      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-4 py-1.5 rounded-full mb-5">
            <Building2 className="h-4 w-4" /> Community Franchise Program
          </span>
        </motion.div>
        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
          เป็นเจ้าของ<span className="text-amber-500">ตลาดชุมชน</span><br />ในพื้นที่ของคุณ
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="text-xl text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Community Franchise Model — บริหารตลาดบริการชุมชน รับ Revenue Share จาก Booking ทุกรายการ
          ไม่ต้องลงทุนระบบ เราสร้างเทคโนโลยีให้คุณแล้ว
        </motion.p>
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/franchise/apply"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-7 py-3.5 text-lg font-bold text-white shadow-xl shadow-amber-200 hover:bg-amber-600 transition-colors">
              สมัครเป็นผู้จัดการชุมชน <ChevronRight className="h-5 w-5" />
            </Link>
          </motion.div>
          <Link href="#revenue" className="text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors">
            ดูรายได้ที่เป็นไปได้ →
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'ชุมชนที่เปิดแล้ว', value: '12', suffix: 'ชุมชน' },
            { label: 'ผู้ให้บริการรวม', value: '340+', suffix: 'ราย' },
            { label: 'Booking/เดือน', value: '8,400+', suffix: 'ครั้ง' },
            { label: 'Revenue Share จ่ายแล้ว', value: '฿84,000', suffix: '/เดือน' },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i}
              className="bg-white/85 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 text-center">
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-blue-600 font-bold">{s.suffix}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-8">
          สิ่งที่คุณได้รับ
        </motion.h2>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => (
            <motion.div key={b.title} variants={fadeUp} custom={i} whileHover={{ y: -4 }}
              className="bg-white/90 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
              <div className={`w-12 h-12 rounded-xl ${b.bg} flex items-center justify-center mb-4`}>
                <b.icon className={`h-6 w-6 ${b.color}`} />
              </div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-1">{b.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Revenue model */}
      <section id="revenue" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-2">
          รายได้ที่คุณจะได้รับ
        </motion.h2>
        <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
          className="text-center text-slate-500 dark:text-slate-400 mb-8 text-base">
          Revenue Share คำนวณจากยอด Commission ที่แพลตฟอร์มเก็บในพื้นที่ชุมชนของคุณ
        </motion.p>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
          className="bg-white/90 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          {REVENUE_MODEL.map((row, i) => (
            <div key={i} className={`flex items-center justify-between px-6 py-4 ${
              row.highlight ? 'bg-green-50 dark:bg-green-900/20 border-t-2 border-green-200 dark:border-green-700' : 'border-b border-slate-100 dark:border-slate-700'
            }`}>
              <div>
                <p className={`text-base font-semibold ${row.highlight ? 'text-green-800 dark:text-green-300' : 'text-slate-700 dark:text-slate-200'}`}>{row.label}</p>
                {row.note && <p className="text-sm text-slate-400 dark:text-slate-500">{row.note}</p>}
              </div>
              <p className={`text-xl font-extrabold ${row.highlight ? 'text-green-600' : 'text-slate-800 dark:text-slate-100'}`}>{row.example}</p>
            </div>
          ))}
        </motion.div>
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-3">* ตัวเลขเป็นการประมาณการ ขึ้นอยู่กับขนาดและกิจกรรมในชุมชน</p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-8">
          ขั้นตอนการสมัคร
        </motion.h2>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS_PROCESS.map((s, i) => (
            <motion.div key={s.step} variants={fadeUp} custom={i}
              className="bg-white/90 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
              <div className="text-4xl font-extrabold text-blue-100 dark:text-blue-900 mb-3">{s.step}</div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-1">{s.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Active communities */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-8">
          ชุมชนที่เปิดตลาดแล้ว
        </motion.h2>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {ACTIVE_COMMUNITIES.map((c, i) => (
            <motion.div key={c.name} variants={fadeUp} custom={i} whileHover={{ y: -4 }}
              className="bg-white/90 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">{c.province}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-3">{c.name}</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-xl font-extrabold text-slate-900 dark:text-white">{c.providers}</p><p className="text-xs text-slate-400">Provider</p></div>
                <div><p className="text-xl font-extrabold text-amber-500">{c.rating}</p><p className="text-xs text-slate-400">⭐ Rating</p></div>
                <div><p className="text-xl font-extrabold text-slate-900 dark:text-white">{c.bookings.toLocaleString()}</p><p className="text-xs text-slate-400">Booking</p></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-10 shadow-2xl shadow-amber-200 dark:shadow-amber-900/30">
          <h2 className="text-3xl font-extrabold text-white mb-3">พร้อมเปิดตลาดชุมชนของคุณแล้วหรือยัง?</h2>
          <p className="text-amber-100 text-base mb-6">ส่งใบสมัครวันนี้ ทีมงานติดต่อกลับภายใน 3–5 วันทำการ</p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/franchise/apply"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-extrabold text-amber-600 shadow-lg hover:bg-amber-50 transition-colors">
              สมัครเลย <ChevronRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-base text-slate-400 dark:text-slate-500">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}
