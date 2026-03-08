'use client'

import Link from 'next/link'
import { MapPin, Shield, Users, ArrowRight, Sparkles, Store, Bell, ChevronRight, CheckCircle, UserCheck, Building2 } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MarketBackground } from '@/components/market-background'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

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
        initial={{ y: -64, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="border-b border-blue-100/60 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 400 }}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Community<span className="text-blue-600"> Hyper</span></span>
          </motion.div>
          <div className="flex items-center gap-5">
            <Link href="/communities" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:block">ชุมชน</Link>
            <Link href="/franchise" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:block">เปิดตลาด</Link>
            <Link href="/auth/signin" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">เข้าสู่ระบบ</Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors">
                สมัครฟรี
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ── SA Announcement Banner ── */}
      {SA_ANNOUNCEMENTS.filter(a => a.active).map((ann) => (
        <motion.div key={ann.id}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className={`w-full text-center py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 ${ann.type === 'warning' ? 'bg-amber-50 text-amber-800 border-b border-amber-200' : ann.type === 'success' ? 'bg-green-50 text-green-800 border-b border-green-200' : 'bg-blue-600 text-white'}`}>
          <Bell className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{ann.message}</span>
          {ann.link && <a href={ann.link} className="underline font-bold ml-1">อ่านเพิ่มเติม</a>}
        </motion.div>
      ))}

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            เปิดทดสอบระบบ — สมัครและใช้งานฟรี
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            ตลาดบริการชุมชน
            <br />
            <span className="relative inline-block">
              <span className="text-blue-600">ใกล้บ้านคุณ</span>
              <motion.span className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-200 rounded-full"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }} />
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed">
            เชื่อมต่อผู้ให้บริการในชุมชนกับผู้อยู่อาศัย — ช่าง, แม่บ้าน, ติวเตอร์, อาหาร และอีกมากมาย
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link href="/communities"
                className="inline-flex items-center gap-2 justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                🛍️ ค้นหาชุมชนของคุณ <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link href="/auth/signin?role=provider"
                className="inline-flex items-center gap-2 justify-center rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm px-7 py-3.5 text-base font-semibold text-slate-700 hover:border-amber-300 hover:text-amber-700 transition-colors">
                <Sparkles className="h-4 w-4 text-amber-500" /> เป็นผู้ให้บริการ
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link href="/franchise"
                className="inline-flex items-center gap-2 justify-center rounded-xl border-2 border-amber-200 bg-amber-50/80 backdrop-blur-sm px-7 py-3.5 text-base font-semibold text-amber-700 hover:border-amber-400 hover:bg-amber-100 transition-colors">
                <Store className="h-4 w-4" /> เปิดตลาดชุมชน
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate="show"
            className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16">
            {STATS.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <div className="text-3xl font-black text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Join Us — 3 Roles Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-3">เริ่มต้นในฐานะอะไร?</h2>
          <p className="text-center text-slate-500 mb-10">เลือกบทบาทที่ใช่สำหรับคุณ — สมัครครั้งเดียว ได้ทุกสิทธิ์</p>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Customer card */}
          <motion.div variants={fadeUp} custom={0}
            whileHover={{ y: -8, boxShadow: '0 24px 48px -12px rgba(37,99,235,0.18)' }}
            className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-7 text-white overflow-hidden group">
            <div className="absolute top-3 right-4 text-6xl opacity-20">🛍️</div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-5 text-3xl">🛍️</div>
              <h3 className="text-xl font-extrabold mb-2">สมาชิก / ลูกค้า</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-5">
                ค้นหาและจองบริการในชุมชนของคุณ อาหาร ช่าง แม่บ้าน และอีกมากมาย ใกล้บ้านเดินทางสะดวก
              </p>
              <ul className="space-y-1.5 mb-6">
                {['สมัครฟรี ไม่มีค่าธรรมเนียม', 'จองบริการได้ทันที', 'ระบบรีวิวและ Trust Score', 'รับโปรโมชันจากชุมชน'].map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-blue-100">
                    <CheckCircle className="h-3.5 w-3.5 text-blue-300 flex-shrink-0" />{t}
                  </li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/auth/signin"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-blue-600 font-bold py-3 text-sm hover:bg-blue-50 transition-colors">
                  สมัครเป็นลูกค้า — ฟรี <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Provider card */}
          <motion.div variants={fadeUp} custom={1}
            whileHover={{ y: -8, boxShadow: '0 24px 48px -12px rgba(245,158,11,0.18)' }}
            className="relative rounded-3xl bg-white/90 backdrop-blur-sm border-2 border-amber-200 p-7 overflow-hidden group">
            <div className="absolute top-3 right-4 text-6xl opacity-10">⭐</div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-5 text-3xl">⭐</div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">ผู้ให้บริการ / ผู้ค้า</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-3">
                นำเสนอบริการหรือสินค้าของคุณสู่คนในชุมชน สร้างรายได้เสริมหรือธุรกิจหลัก
              </p>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mb-4">
                <UserCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-700 font-medium">สมัครแล้ว = เป็นลูกค้าในระบบอัตโนมัติ</p>
              </div>
              <ul className="space-y-1.5 mb-6">
                {['รับงานผ่านแพลตฟอร์ม', 'ระบบ Escrow ปลอดภัย', 'สร้างโปรโมชัน / คูปอง', '1 บัญชี = 1 ชุมชน'].map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />{t}
                  </li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/providers/apply"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white font-bold py-3 text-sm hover:bg-amber-600 shadow-lg shadow-amber-100 transition-colors">
                  สมัครเป็นผู้ให้บริการ <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Community Admin card */}
          <motion.div variants={fadeUp} custom={2}
            whileHover={{ y: -8, boxShadow: '0 24px 48px -12px rgba(124,58,237,0.18)' }}
            className="relative rounded-3xl bg-white/90 backdrop-blur-sm border-2 border-purple-200 p-7 overflow-hidden group">
            <div className="absolute top-3 right-4 text-6xl opacity-10">🏘️</div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-5 text-3xl">🏘️</div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">ผู้จัดการตลาดชุมชน</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-3">
                เปิดตลาดชุมชนในพื้นที่ของคุณ บริหาร Provider รับ Revenue Share จากทุก transaction
              </p>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mb-4">
                <UserCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-700 font-medium">สมัครแล้ว = เป็นลูกค้าในระบบอัตโนมัติ</p>
              </div>
              <ul className="space-y-1.5 mb-6">
                {['รับ Revenue Share รายเดือน', 'บริหารหลายชุมชนได้', 'อนุมัติ Provider', 'ทดลองใช้ฟรี'].map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />{t}
                  </li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/franchise/apply"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 text-white font-bold py-3 text-sm hover:bg-purple-700 shadow-lg shadow-purple-100 transition-colors">
                  สมัครเปิดตลาด <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Active Communities ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">ตลาดชุมชนที่เปิดอยู่</h2>
              <p className="text-slate-500 mt-1">ค้นหาชุมชนในพื้นที่ของคุณ</p>
            </div>
            <Link href="/communities" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              ดูทั้งหมด <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Live counter */}
          <div className="flex items-center gap-2 mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-sm text-green-700 font-medium">{ACTIVE_COMMUNITIES.length} ชุมชนเปิดให้บริการอยู่ขณะนี้</span>
          </div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACTIVE_COMMUNITIES.map((c, i) => (
            <motion.div key={c.id} variants={fadeUp} custom={i}
              whileHover={{ y: -5, boxShadow: '0 16px 32px -8px rgba(37,99,235,0.12)' }}>
              <Link href={`/communities/${c.id}`}
                className="block bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 hover:border-blue-200 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">{c.emoji}</div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">{c.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="h-3 w-3" />{c.area}
                      </div>
                    </div>
                  </div>
                  {c.trial && (
                    <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium flex-shrink-0">ทดลองฟรี</span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center bg-slate-50 rounded-xl py-2">
                    <div className="font-bold text-slate-900 text-sm">{c.providers}</div>
                    <div className="text-xs text-slate-500">Provider</div>
                  </div>
                  <div className="text-center bg-slate-50 rounded-xl py-2">
                    <div className="font-bold text-slate-900 text-sm">{c.members}</div>
                    <div className="text-xs text-slate-500">สมาชิก</div>
                  </div>
                  <div className="text-center bg-slate-50 rounded-xl py-2">
                    <div className="font-bold text-slate-900 text-sm">{c.categories}</div>
                    <div className="text-xs text-slate-500">หมวด</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Feature cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} custom={i}
              whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(37,99,235,0.15)' }}
              className="group text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-slate-100 cursor-default transition-all">
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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-3">หมวดบริการยอดนิยม</h2>
          <p className="text-center text-slate-500 mb-12">ครอบคลุม 10 หมวดบริการในชุมชน</p>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.slug} variants={fadeUp} custom={i * 0.5} whileHover={{ scale: 1.07, y: -4 }} whileTap={{ scale: 0.96 }}>
              <Link href={`/marketplace?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all group">
                <span className="text-4xl group-hover:scale-110 transition-transform inline-block">{cat.icon}</span>
                <span className="text-sm font-semibold text-center text-slate-700 group-hover:text-blue-600 transition-colors">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
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

// ── Mock Data ──────────────────────────────────────────────────────────────────

interface Announcement {
  id: number
  active: boolean
  type: 'info' | 'warning' | 'success'
  message: string
  link?: string
}

const SA_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, active: true, type: 'info', message: '🎉 Community Hyper เปิดให้บริการอย่างเป็นทางการแล้ว! ทุกชุมชนใหม่ได้รับช่วงทดลองใช้ฟรี 90 วัน', link: '/about' },
]

const ACTIVE_COMMUNITIES = [
  { id: '1', name: 'หมู่บ้านศรีนคร', area: 'บางแค, กรุงเทพฯ', emoji: '🏘️', providers: 34, members: 248, categories: 6, trial: true, tags: ['อาหาร', 'ช่าง', 'งานบ้าน'] },
  { id: '2', name: 'The Base Rama 9', area: 'พระราม 9, กรุงเทพฯ', emoji: '🏙️', providers: 21, members: 180, categories: 5, trial: true, tags: ['อาหาร', 'สุขภาพ', 'ฟรีแลนซ์'] },
  { id: '3', name: 'บ้านมั่นคง เชียงใหม่', area: 'เมือง, เชียงใหม่', emoji: '🌄', providers: 18, members: 140, categories: 4, trial: false, tags: ['เกษตร', 'อาหาร', 'ทำมือ'] },
  { id: '4', name: 'ชุมชนริมน้ำ ปทุมธานี', area: 'เมือง, ปทุมธานี', emoji: '🌊', providers: 12, members: 95, categories: 3, trial: true, tags: ['อาหาร', 'ช่าง', 'ดูแลผู้สูงอายุ'] },
  { id: '5', name: 'ศุภาลัย วิลล์ ขอนแก่น', area: 'เมือง, ขอนแก่น', emoji: '🌻', providers: 15, members: 110, categories: 4, trial: false, tags: ['งานบ้าน', 'ติว', 'สุขภาพ'] },
  { id: '6', name: 'คอนโด Niche Mono', area: 'ลาดพร้าว, กรุงเทพฯ', emoji: '🏢', providers: 9, members: 72, categories: 3, trial: true, tags: ['อาหาร', 'ทำมือ', 'ฟรีแลนซ์'] },
]

const STATS = [
  { value: `${ACTIVE_COMMUNITIES.length}`, label: 'ตลาดชุมชน' },
  { value: `${ACTIVE_COMMUNITIES.reduce((a, c) => a + c.providers, 0)}+`, label: 'ผู้ให้บริการ' },
  { value: '10+', label: 'หมวดบริการ' },
  { value: '100%', label: 'ฟรีช่วงทดลอง' },
]

const FEATURES = [
  { Icon: MapPin, title: 'Hyperlocal', desc: 'ค้นหาบริการภายในชุมชนของคุณ — ใกล้บ้าน เดินทางสะดวก', bg: 'bg-blue-50', color: 'text-blue-600' },
  { Icon: Shield, title: 'น่าเชื่อถือ', desc: 'ผู้ให้บริการผ่านการยืนยันตัวตน มีระบบรีวิวและคะแนน Trust Score', bg: 'bg-green-50', color: 'text-green-600' },
  { Icon: Users, title: 'ชุมชนแข็งแกร่ง', desc: 'สร้างเศรษฐกิจชุมชน เชื่อมต่อผู้คน กระจายรายได้ในท้องถิ่น', bg: 'bg-purple-50', color: 'text-purple-600' },
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
