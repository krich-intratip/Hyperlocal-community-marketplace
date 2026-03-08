'use client'

import Link from 'next/link'
import { MapPin, Shield, Users, ArrowRight, Sparkles } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MarketBackground } from '@/components/market-background'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="border-b border-blue-100/60 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Community<span className="text-blue-600"> Hyper</span>
            </span>
          </motion.div>
          <div className="flex items-center gap-5">
            <Link href="/guide" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:block">
              คู่มือ
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:block">
              เกี่ยวกับ
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors"
              >
                สมัครฟรี
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            เปิดทดสอบระบบ — สมัครและใช้งานฟรี
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight"
          >
            ตลาดบริการชุมชน
            <br />
            <span className="relative inline-block">
              <span className="text-blue-600">ใกล้บ้านคุณ</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-200 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
              />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed"
          >
            เชื่อมต่อผู้ให้บริการในชุมชนกับผู้อยู่อาศัย — ช่าง, แม่บ้าน, ติวเตอร์, อาหาร
            และอีกมากมาย ผ่านแพลตฟอร์มที่น่าเชื่อถือ
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/communities"
                className="inline-flex items-center gap-2 justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
              >
                ค้นหาชุมชนของคุณ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/signin?role=provider"
                className="inline-flex items-center gap-2 justify-center rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm px-8 py-3.5 text-base font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                เป็นผู้ให้บริการ
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16"
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <div className="text-3xl font-black text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Feature cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(37,99,235,0.15)' }}
              className="group text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-slate-100 cursor-default transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                <f.Icon className={`h-7 w-7 ${f.color}`} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Category grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-3">
            หมวดบริการยอดนิยม
          </h2>
          <p className="text-center text-slate-500 mb-12">ครอบคลุม 10 หมวดบริการในชุมชน</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              variants={fadeUp}
              custom={i * 0.5}
              whileHover={{ scale: 1.07, y: -4 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                href={`/marketplace?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform inline-block">
                  {cat.icon}
                </span>
                <span className="text-sm font-semibold text-center text-slate-700 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 text-6xl">🏘️</div>
            <div className="absolute top-8 right-12 text-5xl">🤝</div>
            <div className="absolute bottom-6 left-16 text-5xl">⭐</div>
            <div className="absolute bottom-4 right-8 text-6xl">📍</div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              เริ่มต้นวันนี้ — ใช้งานฟรี
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              เข้าร่วมชุมชนของคุณ หาบริการที่ต้องการ หรือนำเสนอทักษะของคุณสู่ลูกค้าในละแวก
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-blue-600 shadow-lg hover:bg-blue-50 transition-colors"
              >
                เริ่มต้นเลย
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-400">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}

const STATS = [
  { value: '10+', label: 'หมวดบริการ' },
  { value: '100%', label: 'ฟรีช่วงทดลอง' },
  { value: 'Hyperlocal', label: 'เน้นชุมชนใกล้บ้าน' },
]

const FEATURES = [
  {
    Icon: MapPin,
    title: 'Hyperlocal',
    desc: 'ค้นหาบริการภายในชุมชนของคุณ — ใกล้บ้าน เดินทางสะดวก',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    Icon: Shield,
    title: 'น่าเชื่อถือ',
    desc: 'ผู้ให้บริการผ่านการยืนยันตัวตน มีระบบรีวิวและคะแนน Trust Score',
    bg: 'bg-green-50',
    color: 'text-green-600',
  },
  {
    Icon: Users,
    title: 'ชุมชนแข็งแกร่ง',
    desc: 'สร้างเศรษฐกิจชุมชน เชื่อมต่อผู้คน กระจายรายได้ในท้องถิ่น',
    bg: 'bg-purple-50',
    color: 'text-purple-600',
  },
]

const CATEGORIES = [
  { slug: 'FOOD', name: 'อาหาร', icon: '🍱' },
  { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧' },
  { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠' },
  { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚' },
  { slug: 'ELDERLY_CARE', name: 'ดูแลผู้สูงอายุ', icon: '👴' },
  { slug: 'HANDMADE', name: 'สินค้าทำมือ', icon: '🎨' },
  { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ', icon: '💆' },
  { slug: 'AGRICULTURE', name: 'เกษตรชุมชน', icon: '🌿' },
  { slug: 'FREELANCE', name: 'ฟรีแลนซ์', icon: '💻' },
  { slug: 'COMMUNITY_SHARING', name: 'Community Sharing', icon: '🤝' },
]
