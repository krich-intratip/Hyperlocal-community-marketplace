'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronDown, TrendingUp, TrendingDown, Zap, BarChart3 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import {
  getCategoryInsight,
  CATEGORY_INSIGHTS,
  PERFORMANCE_BAND_CONFIG,
  PRIORITY_CONFIG,
  ALL_CATEGORIES,
  type ProviderCategory,
} from '@/lib/category-insights'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

// ── Performance Score Ring (SVG) ─────────────────────────────────────────────────

function ScoreRing({ score, band }: { score: number; band: keyof typeof PERFORMANCE_BAND_CONFIG }) {
  const cfg = PERFORMANCE_BAND_CONFIG[band]
  const r = 52
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <motion.circle cx="72" cy="72" r={r} fill="none"
          className={cfg.ring}
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center z-10">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className={`text-3xl font-extrabold ${cfg.color}`}>
          {score}
        </motion.div>
        <div className="text-xs text-slate-500 font-medium">/100</div>
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────────

export default function ProviderInsightsClient() {
  useAuthGuard(['provider', 'admin', 'superadmin'])

  const [selectedCategory, setSelectedCategory] = useState<ProviderCategory>('FOOD')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const insight = getCategoryInsight(selectedCategory)
  const bandCfg = PERFORMANCE_BAND_CONFIG[insight.performanceBand]

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard/provider" className="hover:text-primary flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" /> Provider Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Insights</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-purple-600" /> AI Insight Engine
          </h1>
          <p className="text-sm text-slate-500 mt-1">วิเคราะห์เชิงลึกและคำแนะนำสำหรับธุรกิจแต่ละประเภท</p>
        </motion.div>

        {/* Category Selector */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="relative mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">หมวดธุรกิจ:</span>
            <div className="relative">
              <button onClick={() => setDropdownOpen(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-sm font-bold text-slate-800hover:border-primary/30 transition-all">
                <span>{insight.categoryEmoji}</span>
                <span>{insight.categoryLabel}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-56 glass-heavy rounded-2xl shadow-xl overflow-hidden z-30">
                    {ALL_CATEGORIES.map(cat => {
                      const c = CATEGORY_INSIGHTS[cat]
                      return (
                        <button key={cat}
                          onClick={() => { setSelectedCategory(cat); setDropdownOpen(false) }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                            cat === selectedCategory ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700 hover:glass-sm'
                          }`}>
                          <span className="text-base">{c.categoryEmoji}</span>
                          <span>{c.categoryLabel}</span>
                          {cat === selectedCategory && <span className="ml-auto text-purple-500 text-xs">✓</span>}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Performance Score + Band */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedCategory}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

              {/* Score Ring */}
              <div className={`${bandCfg.bg} ${bandCfg.border} border rounded-2xl p-6 flex items-center gap-6`}>
                <ScoreRing score={insight.performanceScore} band={insight.performanceBand} />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Performance Score</p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${bandCfg.bg} ${bandCfg.color} ${bandCfg.border} border mb-3`}>
                    {insight.performanceBand === 'excellent' && '🏆'}
                    {insight.performanceBand === 'good' && '👍'}
                    {insight.performanceBand === 'fair' && '⚠️'}
                    {insight.performanceBand === 'needs_improvement' && '❗'}
                    {bandCfg.label}
                  </div>
                  <p className="text-xs text-slate-600">
                    ประเมินจากคะแนนรีวิว อัตราสำเร็จงาน รายได้ และการตอบสนอง
                  </p>
                </div>
              </div>

              {/* Category KPIs */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  KPI หลักหมวด{insight.categoryLabel}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {insight.kpis.map((kpi) => (
                    <div key={kpi.label} className="glass-sm rounded-xl p-3">
                      <div className="text-lg mb-0.5">{kpi.icon}</div>
                      <div className="font-extrabold text-slate-900 text-base">
                        {kpi.value}
                        <span className="text-xs text-slate-500 font-normal ml-1">{kpi.unit}</span>
                      </div>
                      <div className="text-xs text-slate-500">{kpi.label}</div>
                      {kpi.trend !== 0 && (
                        <div className={`flex items-center gap-0.5 text-xs font-bold mt-1 ${
                          (kpi.trend > 0) === kpi.trendUp ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {kpi.trend > 0
                            ? <TrendingUp className="h-3 w-3" />
                            : <TrendingDown className="h-3 w-3" />
                          }
                          {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Narrative */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <p className="font-bold text-purple-900 text-sm mb-2">
                    AI Analysis — {insight.categoryLabel} {insight.categoryEmoji}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">{insight.aiNarrative}</p>
                </div>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div variants={stagger} initial="hidden" animate="show">
              <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-lg">💡</span> คำแนะนำที่ AI ชี้แนะ
                <span className="text-xs text-slate-400 font-normal ml-1">
                  ({insight.recommendations.length} ข้อ เรียงตามความสำคัญ)
                </span>
              </h2>
              <div className="space-y-4">
                {insight.recommendations.map((rec, i) => {
                  const pCfg = PRIORITY_CONFIG[rec.priority]
                  return (
                    <motion.div key={rec.title} variants={fadeUp} custom={i} whileHover={{ x: 4 }}
                      className="flex items-start gap-4 p-5 rounded-2xl glass-card">
                      <div className="text-2xl flex-shrink-0 mt-0.5">{rec.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="font-bold text-slate-900 text-sm">{rec.title}</p>
                          <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${pCfg.bg} ${pCfg.text} border ${pCfg.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
                            {pCfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Footer Nav */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={8}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {[
                { label: 'ดู Analytics Charts', desc: 'กราฟรายได้และการจอง', href: '/dashboard/provider/analytics', emoji: '📊' },
                { label: 'จัดการรีวิว', desc: 'Sentiment & คำตอบรีวิว', href: '/dashboard/provider/reviews', emoji: '⭐' },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 p-4 rounded-xl glass border-white/20 hover:border-primary/30 transition-all">
                  <span className="text-xl">{item.emoji}</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </motion.div>

          </motion.div>
        </AnimatePresence>

      </section>
      <AppFooter />
    </main>
  )
}
