'use client'

import Link from 'next/link'
import { MapPin, Shield, Users, ArrowRight, Sparkles, Store, Bell, ChevronRight, CheckCircle, UserCheck } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MarketBackground } from '@/components/market-background'
import { useT } from '@/hooks/useT'
import { APP_VERSION, APP_UPDATED, APP_DEVELOPER } from '@/lib/version'
import { formatDateMedTH } from '@/lib/date-utils'

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
  const t = useT()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const STATS = [
    { value: `${ACTIVE_COMMUNITIES.length}`, label: t.home.stats.communities },
    { value: `${ACTIVE_COMMUNITIES.reduce((a, c) => a + c.providers, 0)}+`, label: t.home.stats.providers },
    { value: '10+', label: t.home.stats.categories },
    { value: '100%', label: t.home.stats.trial },
  ]

  const FEATURES = [
    { Icon: MapPin, title: t.home.feature1_title, desc: t.home.feature1_desc, bg: 'glass-sm', color: 'text-primary' },
    { Icon: Shield, title: t.home.feature2_title, desc: t.home.feature2_desc, bg: 'glass-sm', color: 'text-emerald-600' },
    { Icon: Users, title: t.home.feature3_title, desc: t.home.feature3_desc, bg: 'glass-sm', color: 'text-violet-600' },
  ]

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-nav sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200/50">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">Community<span className="text-gradient-primary"> Hyper</span></span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/communities" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">{t.nav.communities}</Link>
            <Link href="/franchise" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">{t.nav.franchise}</Link>
            <Link href="/auth/signin" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">{t.nav.signin}</Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 hover:bg-primary/90 transition-colors">
                {t.nav.register}
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
          {ann.link && <Link href={ann.link as any} className="underline font-bold ml-1">อ่านเพิ่มเติม</Link>}
        </motion.div>
      ))}

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              {t.home.badge}
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-5 leading-snug">
              {t.home.headline1}
              <br />
              <span className="relative inline-block">
                <span className="text-gradient-primary">{t.home.headline2}</span>
                <motion.span className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-200 rounded-full"
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }} />
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="max-w-xl mx-auto text-base sm:text-lg text-slate-500 mb-10 leading-relaxed">
              {t.home.sub}
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href="/communities"
                  className="inline-flex items-center gap-2 justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/60 hover:bg-primary/90 transition-colors">
                  🛍️ {t.home.cta_browse} <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href="/auth/signin?role=provider"
                  className="inline-flex items-center gap-2 justify-center rounded-xl glass px-6 py-3 text-sm font-semibold text-slate-700 hover:border-amber-300 hover:text-amber-700 transition-colors">
                  <Sparkles className="h-4 w-4 text-amber-500" /> {t.home.cta_provider}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href="/franchise"
                  className="inline-flex items-center gap-2 justify-center rounded-xl border border-amber-300/60 glass px-6 py-3 text-sm font-semibold text-amber-700 hover:border-amber-400 transition-colors">
                  <Store className="h-4 w-4" /> {t.home.cta_franchise}
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" animate="show"
              className="mt-14 flex flex-wrap justify-center gap-8 sm:gap-12">
              {STATS.map((s) => (
                <motion.div key={s.label} variants={fadeUp} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{s.value}</div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Join Us — 3 Roles Section ── */}
      <section className="border-y border-white/30 dark:border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-900 mb-2">{t.home.roles_title}</h2>
            <p className="text-center text-slate-500 text-sm sm:text-base mb-10">{t.home.roles_sub}</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Customer card */}
            <motion.div variants={fadeUp} custom={0}
              whileHover={{ y: -8, boxShadow: '0 24px 48px -12px rgba(37,99,235,0.18)' }}
              className="relative rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 p-7 text-white overflow-hidden group shadow-lg shadow-indigo-300/30">
              <div className="absolute top-3 right-4 text-6xl opacity-20">🛍️</div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 text-2xl">🛍️</div>
                <h3 className="text-lg font-extrabold mb-2">{t.home.customer_title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">{t.home.customer_sub}</p>
                <ul className="space-y-1.5 mb-5">
                  {t.home.customer_features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
                      <CheckCircle className="h-3.5 w-3.5 text-blue-300 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/auth/signin"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-blue-600 font-bold py-2.5 text-sm hover:bg-blue-50 transition-colors">
                    {t.home.customer_cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Provider card */}
            <motion.div variants={fadeUp} custom={1}
              whileHover={{ y: -8, boxShadow: '0 24px 48px -12px rgba(245,158,11,0.18)' }}
              className="relative rounded-3xl glass-card p-7 overflow-hidden group">
              <div className="absolute top-3 right-4 text-6xl opacity-10">⭐</div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 text-2xl">⭐</div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">{t.home.provider_title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">{t.home.provider_sub}</p>
                <div className="flex items-center gap-2 glass-sm rounded-xl px-3 py-2 mb-4">
                  <UserCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <p className="text-xs text-blue-700 font-medium">{t.home.provider_note}</p>
                </div>
                <ul className="space-y-1.5 mb-5">
                  {t.home.provider_features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/providers/apply"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white font-bold py-2.5 text-sm hover:bg-amber-600 shadow-md shadow-amber-200/50 transition-colors">
                    {t.home.provider_cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Community Admin card */}
            <motion.div variants={fadeUp} custom={2}
              whileHover={{ y: -8, boxShadow: '0 24px 48px -12px rgba(124,58,237,0.18)' }}
              className="relative rounded-3xl glass-card p-7 overflow-hidden group">
              <div className="absolute top-3 right-4 text-6xl opacity-10">🏘️</div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 text-2xl">🏘️</div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">{t.home.admin_title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">{t.home.admin_sub}</p>
                <div className="flex items-center gap-2 glass-sm rounded-xl px-3 py-2 mb-4">
                  <UserCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <p className="text-xs text-blue-700 font-medium">{t.home.admin_note}</p>
                </div>
                <ul className="space-y-1.5 mb-5">
                  {t.home.admin_features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/franchise/apply"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 text-white font-bold py-2.5 text-sm hover:bg-violet-700 shadow-md shadow-violet-200/50 transition-colors">
                    {t.home.admin_cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Active Communities ── */}
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{t.home.communities_title}</h2>
                <p className="text-slate-500 mt-1 text-sm">{t.home.communities_sub}</p>
              </div>
              <Link href="/communities" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0">
                {t.home.communities_see_all} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex items-center gap-2 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm text-green-700 font-medium">{ACTIVE_COMMUNITIES.length} {t.home.communities_live}</span>
            </div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACTIVE_COMMUNITIES.map((c, i) => (
              <motion.div key={c.id} variants={fadeUp} custom={i}
                whileHover={{ y: -5, boxShadow: '0 16px 32px -8px rgba(37,99,235,0.12)' }}>
                <Link href={`/communities/${c.id}`}
                  className="block glass-card rounded-2xl p-5 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">{c.emoji}</div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm">{c.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <MapPin className="h-3 w-3" />{c.area}
                        </div>
                      </div>
                    </div>
                    {c.trial && (
                      <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{t.home.communities_trial}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center glass-sm rounded-xl py-2">
                      <div className="font-bold text-slate-900 text-sm">{c.providers}</div>
                      <div className="text-xs text-slate-500">{t.home.communities_providers}</div>
                    </div>
                    <div className="text-center glass-sm rounded-xl py-2">
                      <div className="font-bold text-slate-900 text-sm">{c.members}</div>
                      <div className="text-xs text-slate-500">{t.home.communities_members}</div>
                    </div>
                    <div className="text-center glass-sm rounded-xl py-2">
                      <div className="font-bold text-slate-900 text-sm">{c.categories}</div>
                      <div className="text-xs text-slate-500">{t.home.communities_categories}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map(tag => (
                      <span key={tag} className="text-xs glass-sm text-primary px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="border-y border-white/30 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-900 mb-10">{t.home.features_title}</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i}
                whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(37,99,235,0.15)' }}
                className="group text-center p-8 rounded-2xl glass-card cursor-default transition-all">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <f.Icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-base mb-2 text-slate-800">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Category grid ── */}
      <section className="bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-2">{t.home.categories_title}</h2>
            <p className="text-center text-indigo-200/70 mb-10 text-sm">{t.home.categories_sub}</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.slug} variants={fadeUp} custom={i * 0.5} whileHover={{ scale: 1.07, y: -4 }} whileTap={{ scale: 0.96 }}>
                <Link href={`/marketplace?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/40 hover:bg-white/20 transition-all group">
                  <span className="text-3xl group-hover:scale-110 transition-transform inline-block">{cat.icon}</span>
                  <span className="text-xs font-semibold text-center text-white/80 group-hover:text-white transition-colors">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gradient-to-br from-indigo-950 to-violet-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center space-y-2">
          <p className="text-sm text-slate-500">{t.home.footer}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
              v{APP_VERSION}
            </span>
            <span className="text-xs text-slate-500">อัพเดทล่าสุด {formatDateMedTH(APP_UPDATED)}</span>
            <span className="text-xs font-semibold text-indigo-400">by {APP_DEVELOPER}</span>
          </div>
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
