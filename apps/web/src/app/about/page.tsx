'use client'

import Link from 'next/link'
import { AppFooter } from '@/components/app-footer'
import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { MapPin, Target, Heart, TrendingUp, Users, Zap, Globe, ArrowRight, Code2, GitBranch } from 'lucide-react'
import { APP_VERSION, APP_UPDATED, APP_DEVELOPER } from '@/lib/version'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-nav sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Community<span className="text-primary"> Hyper</span>
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/guide" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">คู่มือ</Link>
            <Link href="/about" className="text-sm font-semibold text-primary">เกี่ยวกับ</Link>
            <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
              สมัครฟรี
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="inline-flex items-center gap-2 rounded-full glass-sm border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6">
          <Heart className="h-4 w-4" />
          เกี่ยวกับเรา
        </motion.div>
        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-6 leading-snug">
          Local Economy
          <span className="text-primary"> Operating System</span>
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          เราเชื่อว่าเศรษฐกิจที่แข็งแกร่งเริ่มต้นจากชุมชน — Community Hyper Marketplace
          คือโครงสร้างพื้นฐานดิจิทัลที่ช่วยให้ทุกชุมชนมี marketplace เป็นของตัวเอง
        </motion.p>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
        >
          <motion.div variants={fadeUp} whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-primary text-white shadow-xl shadow-primary/30">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-extrabold mb-3">Vision</h2>
            <p className="text-blue-100 leading-relaxed">
              เป็น "Local Economy Operating System" สำหรับทุกชุมชนในประเทศไทย —
              ที่ที่ทุกคนสามารถหาบริการและให้บริการได้อย่างเชื่อถือได้ ในพื้นที่ที่ตนอยู่
            </p>
          </motion.div>
          <motion.div variants={fadeUp} whileHover={{ y: -4 }}
            className="p-8 rounded-3xl glass-card">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">Mission</h2>
            <p className="text-slate-500 leading-relaxed">
              สร้างแพลตฟอร์มที่เชื่อมต่อผู้ให้บริการท้องถิ่นกับลูกค้าในชุมชน ส่งเสริมการกระจาย
              รายได้ และสร้างเศรษฐกิจชุมชนที่ยั่งยืน
            </p>
          </motion.div>
        </motion.div>

        {/* Core Values */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-20">
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-3">Core Values</h2>
          <p className="text-center text-slate-500 mb-12">หลักการที่เราใช้สร้างทุกอย่าง</p>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} variants={fadeUp} custom={i} whileHover={{ y: -5, scale: 1.01 }}
                className="p-6 rounded-2xl glass-card">
                <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center mb-4`}>
                  <v.Icon className={`h-6 w-6 ${v.color}`} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Model */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-20">
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-3">โมเดลธุรกิจ</h2>
          <p className="text-center text-slate-500 mb-12">Franchise Marketplace Model</p>
          <div className="relative">
            {/* Flow diagram */}
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BUSINESS_MODEL.map((item, i) => (
                <motion.div key={item.role} variants={fadeUp} custom={i}
                  className="relative p-6 rounded-2xl glass-card text-center">
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-4`}>
                    <item.Icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${item.badgeBg} ${item.badgeColor}`}>
                    {item.role}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  {i < BUSINESS_MODEL.length - 1 && (
                    <div className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-10 h-10 rounded-full glass-sm shadow flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* 10 Verticals */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-20">
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-3">10 หมวดบริการ</h2>
          <p className="text-center text-slate-500 mb-12">ครอบคลุมบริการชุมชนครบวงจร</p>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {VERTICALS.map((v, i) => (
              <motion.div key={v.name} variants={fadeUp} custom={i}
                whileHover={{ scale: 1.05, y: -3 }}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl glass-card hover:border-primary/30 hover:shadow-md transition-all">
                <span className="text-3xl">{v.icon}</span>
                <span className="text-xs font-semibold text-center text-slate-600">{v.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* MVP Roadmap */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-20">
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-3">Roadmap MVP</h2>
          <p className="text-center text-slate-500 mb-12">4 Sprints × 2 สัปดาห์</p>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="space-y-3">
            {ROADMAP.map((sprint, i) => (
              <motion.div key={sprint.title} variants={fadeUp} custom={i}
                whileHover={{ x: 4 }}
                className={`flex items-start gap-4 p-5 rounded-2xl border ${sprint.active ? 'glass border-primary/20' : 'glass-sm border-white/20'} shadow-sm`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm ${sprint.active ? 'bg-primary text-white' : 'glass-sm text-slate-500'}`}>
                  S{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800">{sprint.title}</h3>
                    {sprint.active && <span className="text-xs bg-primary/90 text-white px-2 py-0.5 rounded-full font-semibold">กำลังพัฒนา</span>}
                  </div>
                  <p className="text-sm text-slate-500">{sprint.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-3">Tech Stack</h2>
          <p className="text-center text-slate-500 mb-12">Full-stack TypeScript Monorepo</p>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3">
            {TECH.map((t, i) => (
              <motion.span key={t} variants={fadeUp} custom={i}
                whileHover={{ scale: 1.06, y: -2 }}
                className="px-4 py-2 rounded-xl glass text-sm font-semibold text-slate-700 cursor-default">
                {t}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>
      {/* ── Version Info ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="glass-card rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white text-base">Build Info</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Community Hyper Marketplace</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-sm border border-primary/20 text-primary text-sm font-bold">
                <GitBranch className="h-3.5 w-3.5" /> v{APP_VERSION}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 text-sm">
            <div className="rounded-xl glass-sm px-4 py-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Version</p>
              <p className="font-bold text-slate-800 dark:text-slate-100">v{APP_VERSION}</p>
            </div>
            <div className="rounded-xl glass-sm px-4 py-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Updated</p>
              <p className="font-bold text-slate-800 dark:text-slate-100">{APP_UPDATED}</p>
            </div>
            <div className="rounded-xl glass-sm px-4 py-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Developer</p>
              <p className="font-bold text-slate-800 dark:text-slate-100">{APP_DEVELOPER}</p>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {TECH.map(t => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-lg glass-sm text-slate-600 dark:text-slate-300 font-medium">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <AppFooter />
    </main>
  )
}

const VALUES = [
  { Icon: Heart, title: 'Community First', desc: 'ทุกการตัดสินใจเริ่มจากคำถามว่า "สิ่งนี้ดีกับชุมชนไหม?"', bg: 'bg-red-50', color: 'text-red-500' },
  { Icon: Users, title: 'Trust & Transparency', desc: 'ระบบรีวิว Trust Score และความโปร่งใสด้าน commission สร้างความไว้วางใจ', bg: 'bg-blue-50', color: 'text-primary' },
  { Icon: TrendingUp, title: 'Local Economy Growth', desc: 'รายได้กระจายสู่ชุมชน ไม่รวมศูนย์ที่แพลตฟอร์มเพียงฝ่ายเดียว', bg: 'bg-green-50', color: 'text-green-600' },
  { Icon: Zap, title: 'Hyperlocal Focus', desc: 'เน้นบริการใกล้บ้าน ไม่ใช่ national marketplace ที่ไกลเกินจริง', bg: 'bg-amber-50', color: 'text-amber-600' },
  { Icon: Globe, title: 'Franchise Model', desc: 'Community Admin คือ franchise operator ที่มีส่วนได้ส่วนเสียในชุมชน', bg: 'bg-purple-50', color: 'text-purple-600' },
  { Icon: Target, title: 'Sustainable Revenue', desc: 'โมเดลรายได้ที่ยั่งยืน — commission จากการใช้งานจริง ไม่ใช่ subscription บังคับ', bg: 'bg-teal-50', color: 'text-teal-600' },
]

const BUSINESS_MODEL = [
  { Icon: Users, role: 'Customer', title: 'หาบริการใกล้บ้าน', desc: 'เข้าร่วมชุมชน จองบริการ และรีวิวผู้ให้บริการ', bg: 'bg-blue-50', color: 'text-primary', badgeBg: 'bg-blue-100', badgeColor: 'text-blue-700' },
  { Icon: Zap, role: 'Provider', title: 'สร้างรายได้จากทักษะ', desc: 'ลงทะเบียน สร้าง listings รับงาน และสะสม reputation', bg: 'bg-amber-50', color: 'text-amber-600', badgeBg: 'bg-amber-100', badgeColor: 'text-amber-700' },
  { Icon: Globe, role: 'Community Admin', title: 'บริหารชุมชน + รับ Revenue Share', desc: 'ดูแล ecosystem ของชุมชน อนุมัติ providers รับ revenue share จาก commission', bg: 'bg-purple-50', color: 'text-purple-600', badgeBg: 'bg-purple-100', badgeColor: 'text-purple-700' },
]

const VERTICALS = [
  { name: 'อาหาร', icon: '🍱' }, { name: 'งานช่าง', icon: '🔧' },
  { name: 'งานบ้าน', icon: '🏠' }, { name: 'สอนพิเศษ', icon: '📚' },
  { name: 'ดูแลผู้สูงอายุ', icon: '👴' }, { name: 'สินค้าทำมือ', icon: '🎨' },
  { name: 'สุขภาพ', icon: '💆' }, { name: 'เกษตรชุมชน', icon: '🌿' },
  { name: 'ฟรีแลนซ์', icon: '💻' }, { name: 'Community Sharing', icon: '🤝' },
]

const ROADMAP = [
  { title: 'Sprint 1 — Foundation', desc: 'Monorepo skeleton, Google OAuth, Community system, User roles', active: true },
  { title: 'Sprint 2 — Marketplace', desc: 'Provider onboarding & verification, Listings, Marketplace browse & search', active: false },
  { title: 'Sprint 3 — Transactions', desc: 'Booking flow, Dashboards (provider/admin/super-admin), Notifications', active: false },
  { title: 'Sprint 4 — Trust & Launch', desc: 'Reviews, Trust Score, Landing pages optimization, QA & performance', active: false },
]

const TECH = [
  'Next.js 15', 'NestJS', 'TypeScript', 'Tailwind CSS', 'shadcn/ui',
  'Framer Motion', 'TanStack Query', 'Supabase (PostgreSQL + PostGIS)',
  'Redis', 'TypeORM', 'Google OAuth', 'Turborepo', 'pnpm', 'Docker',
]
