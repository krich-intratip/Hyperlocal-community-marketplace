'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ChevronLeft, Star, MessageCircle, ThumbsUp, ThumbsDown, Minus,
  Reply, CheckCircle, Eye, EyeOff, ShieldCheck, Loader2,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useAuthStore } from '@/store/auth.store'
import {
  useProviderReviewsManage,
  useReviewReply,
  useSetReviewVisibility,
} from '@/hooks/useReviews'
import { formatDateMedTH } from '@/lib/date-utils'
import {
  MOCK_REVIEWS,
  RATING_DISTRIBUTION,
  PROVIDER_SUMMARY,
  type MockReview,
  type ReviewSentiment,
} from '@/lib/mock-provider-analytics'
import type { Review } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

type FilterTab = 'all' | 'positive' | 'negative' | 'unanswered' | 'hidden'

const SENTIMENT_CONFIG: Record<ReviewSentiment, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string; bg: string; border: string
}> = {
  positive: { label: 'เชิงบวก', icon: ThumbsUp,   color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200' },
  neutral:  { label: 'กลางๆ',   icon: Minus,      color: 'text-slate-600', bg: 'glass-sm',     border: 'border-white/20' },
  negative: { label: 'เชิงลบ',  icon: ThumbsDown, color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200' },
}

function sentimentFromRating(rating: number): ReviewSentiment {
  if (rating >= 4) return 'positive'
  if (rating === 3) return 'neutral'
  return 'negative'
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i}
          className={`h-3.5 w-3.5 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  )
}

function formatDate(dateStr: string) {
  return formatDateMedTH(dateStr)
}

// ── ReviewCard ────────────────────────────────────────────────────────────────

function ReviewCard({
  review,
  onReply,
  onToggleVisibility,
  togglingId,
}: {
  review: MockReview & { isVisible?: boolean; realId?: string }
  onReply?: (id: string, text: string) => void
  onToggleVisibility?: (id: string, visible: boolean) => void
  togglingId?: string | null
}) {
  const [replyMode, setReplyMode] = useState(false)
  const [replyText, setReplyText] = useState(review.replyText ?? '')
  const [replied, setReplied] = useState(review.replied)
  const [savedReply, setSavedReply] = useState(review.replyText ?? '')
  const sentCfg = SENTIMENT_CONFIG[review.sentiment]
  const SentIcon = sentCfg.icon
  const isHidden = review.isVisible === false
  const isToggling = togglingId === review.id

  const handleSendReply = () => {
    if (!replyText.trim()) return
    setSavedReply(replyText)
    setReplied(true)
    setReplyMode(false)
    onReply?.(review.id, replyText)
  }

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -1 }}
      className={`glass-card rounded-2xl p-5 transition-opacity ${isHidden ? 'opacity-60' : 'opacity-100'}`}>

      {/* Hidden badge */}
      {isHidden && (
        <div className="flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-500 w-fit">
          <EyeOff className="h-3 w-3" />
          ซ่อนจากสาธารณะ
        </div>
      )}

      {/* Review header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {review.customer.charAt(3) || '?'}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{review.customer}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRow rating={review.rating} />
              <span className="text-xs text-slate-400">{formatDate(review.date)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${sentCfg.bg} ${sentCfg.color} border ${sentCfg.border}`}>
            <SentIcon className="h-3 w-3" />
            {sentCfg.label}
          </div>
          {/* Visibility toggle */}
          {onToggleVisibility && (
            <button
              onClick={() => onToggleVisibility(review.id, !review.isVisible)}
              disabled={isToggling}
              title={isHidden ? 'แสดงรีวิวนี้' : 'ซ่อนรีวิวนี้'}
              className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                isHidden
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500'
              }`}>
              {isToggling
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : isHidden
                  ? <Eye className="h-3.5 w-3.5" />
                  : <EyeOff className="h-3.5 w-3.5" />
              }
            </button>
          )}
        </div>
      </div>

      {/* Review body */}
      <p className="text-sm text-slate-700 leading-relaxed mb-2">&ldquo;{review.text}&rdquo;</p>
      <p className="text-xs text-slate-400 mb-4">บริการ: {review.listing}</p>

      {/* Existing reply */}
      {replied && savedReply && !replyMode && (
        <div className="glass border border-primary/20 rounded-xl p-3 mb-3 flex items-start gap-2">
          <Reply className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-700 mb-0.5">คุณตอบแล้ว</p>
            <p className="text-xs text-primary">{savedReply}</p>
          </div>
        </div>
      )}

      {/* Reply button / form */}
      {!replyMode && (
        <button onClick={() => setReplyMode(true)}
          className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
            replied ? 'text-slate-400 hover:text-primary' : 'text-primary hover:text-blue-700'
          }`}>
          <MessageCircle className="h-3.5 w-3.5" />
          {replied ? 'แก้ไขการตอบ' : 'ตอบรีวิวนี้'}
        </button>
      )}

      <AnimatePresence>
        {replyMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
              rows={3} placeholder="พิมพ์คำตอบสำหรับลูกค้า..."
              className="w-full mt-3 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all" />
            <div className="flex gap-2 mt-2">
              <button onClick={() => setReplyMode(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:glass-sm transition-colors">
                ยกเลิก
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSendReply}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors">
                <CheckCircle className="h-3.5 w-3.5" /> ส่งคำตอบ
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── TransparencyBadge ─────────────────────────────────────────────────────────

function TransparencyBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-50 text-green-700 border-green-200'
    : score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-700 border-rose-200'
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${color}`}>
      <ShieldCheck className="h-4 w-4" />
      <span>ความโปร่งใส {score}%</span>
      <div className="w-20 h-1.5 rounded-full bg-white/60 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProviderReviewsClient() {
  useAuthGuard(['provider', 'admin', 'superadmin'])
  const { user } = useAuthStore()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [starFilter, setStarFilter] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // RV-2: Use manage endpoint (all reviews incl. hidden) for provider dashboard
  const { data: realReviews } = useProviderReviewsManage(user?.id ?? '')
  const reviewReply    = useReviewReply()
  const setVisibility  = useSetReviewVisibility()

  // Map real API reviews to the MockReview shape, or fall back to mock
  const reviews: (MockReview & { isVisible?: boolean })[] = (realReviews && realReviews.length > 0)
    ? realReviews.map((r: Review) => ({
        id: r.id,
        customer: r.reviewerMasked ?? r.reviewerId,
        rating: r.rating,
        date: r.createdAt,
        text: r.comment ?? '',
        sentiment: sentimentFromRating(r.rating),
        listing: r.listingTitle ?? '',
        replied: !!r.providerReply,
        replyText: r.providerReply ?? undefined,
        isVisible: r.isVisible,
      }))
    : MOCK_REVIEWS.map(m => ({ ...m, isVisible: true }))

  const handleReply = (reviewId: string, replyText: string) => {
    if (!user?.id) return
    reviewReply.mutate({ id: reviewId, replyText, providerId: user.id })
  }

  const handleToggleVisibility = async (reviewId: string, makeVisible: boolean) => {
    if (!user?.id) return
    setTogglingId(reviewId)
    try {
      await setVisibility.mutateAsync({ id: reviewId, isVisible: makeVisible, providerId: user.id })
    } finally {
      setTogglingId(null)
    }
  }

  // Counts
  const visibleCount    = reviews.filter(r => r.isVisible !== false).length
  const hiddenCount     = reviews.filter(r => r.isVisible === false).length
  const positiveCount   = reviews.filter(r => r.sentiment === 'positive').length
  const neutralCount    = reviews.filter(r => r.sentiment === 'neutral').length
  const negativeCount   = reviews.filter(r => r.sentiment === 'negative').length
  const unansweredCount = reviews.filter(r => !r.replied && r.isVisible !== false).length
  const transparencyScore = reviews.length > 0
    ? Math.round((visibleCount / reviews.length) * 100)
    : 100

  const filteredReviews = reviews.filter(r => {
    if (starFilter !== null && r.rating !== starFilter) return false
    if (activeFilter === 'positive')   return r.sentiment === 'positive' && r.isVisible !== false
    if (activeFilter === 'negative')   return r.sentiment === 'negative' && r.isVisible !== false
    if (activeFilter === 'unanswered') return !r.replied && r.isVisible !== false
    if (activeFilter === 'hidden')     return r.isVisible === false
    return true
  })

  const responseRate = visibleCount > 0
    ? Math.round((reviews.filter(r => r.replied && r.isVisible !== false).length / visibleCount) * 100)
    : 0

  const avgRating = reviews.filter(r => r.isVisible !== false).length > 0
    ? (reviews.filter(r => r.isVisible !== false).reduce((sum, r) => sum + r.rating, 0) / visibleCount).toFixed(1)
    : PROVIDER_SUMMARY.avgRating

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
          <span className="text-slate-700 font-medium">รีวิว</span>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Star className="h-6 w-6 text-amber-500 fill-amber-500" /> จัดการรีวิว
              </h1>
              <p className="text-sm text-slate-500 mt-1">Sentiment analysis · อนุมัติ/ซ่อนรีวิว · PDPA compliant</p>
            </div>
            <TransparencyBadge score={transparencyScore} />
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'รีวิวทั้งหมด', value: reviews.length,    icon: '📝', color: 'glass-sm' },
            { label: 'คะแนนเฉลี่ย',  value: `${avgRating} ⭐`, icon: '⭐', color: 'bg-amber-50' },
            { label: 'อัตราตอบ',     value: `${responseRate}%`, icon: '💬', color: 'bg-green-50' },
            { label: 'ซ่อนอยู่',     value: hiddenCount,        icon: '🙈', color: 'bg-rose-50' },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} whileHover={{ y: -2 }}
              className={`${s.color} rounded-2xl p-4 border border-white shadow-sm`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Rating Distribution + Sentiment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

          {/* Rating Distribution */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="glass-card rounded-2xl p-5">
            <h2 className="font-extrabold text-slate-900 text-sm mb-4">การกระจายคะแนน</h2>
            <div className="space-y-2.5">
              {RATING_DISTRIBUTION.map(item => (
                <button key={item.star}
                  onClick={() => setStarFilter(starFilter === item.star ? null : item.star)}
                  className={`w-full flex items-center gap-3 text-sm transition-opacity ${
                    starFilter !== null && starFilter !== item.star ? 'opacity-40' : 'opacity-100'
                  }`}>
                  <div className="flex items-center gap-1 w-16 flex-shrink-0">
                    <span className="text-xs font-bold text-slate-600 w-3">{item.star}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2.5 rounded-full glass-sm overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.6, delay: item.star * 0.05 }}
                      className="h-full rounded-full bg-amber-400" />
                  </div>
                  <span className="text-xs text-slate-500 w-12 text-right flex-shrink-0">
                    {item.count} ({item.pct}%)
                  </span>
                </button>
              ))}
            </div>
            {starFilter !== null && (
              <button onClick={() => setStarFilter(null)}
                className="mt-3 text-xs text-primary font-bold hover:underline">
                ดูทั้งหมด ×
              </button>
            )}
          </motion.div>

          {/* Sentiment + Transparency */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="glass-card rounded-2xl p-5">
            <h2 className="font-extrabold text-slate-900 text-sm mb-4">Sentiment Analysis</h2>
            <div className="space-y-4">
              {[
                { type: 'positive' as ReviewSentiment, count: positiveCount },
                { type: 'neutral'  as ReviewSentiment, count: neutralCount  },
                { type: 'negative' as ReviewSentiment, count: negativeCount },
              ].map(({ type, count }) => {
                const cfg  = SENTIMENT_CONFIG[type]
                const SIcon = cfg.icon
                const pct  = visibleCount > 0 ? Math.round((count / visibleCount) * 100) : 0
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <div className={`flex items-center gap-2 text-xs font-bold ${cfg.color}`}>
                        <SIcon className="h-3.5 w-3.5" /> {cfg.label}
                      </div>
                      <span className="text-xs text-slate-500">{count} รีวิว ({pct}%)</span>
                    </div>
                    <div className="h-2.5 rounded-full glass-sm overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`h-full rounded-full ${
                          type === 'positive' ? 'bg-green-400' :
                          type === 'neutral'  ? 'bg-slate-300' : 'bg-red-400'
                        }`} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Transparency explanation */}
            <div className="mt-5 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-blue-700 mb-1">
                <ShieldCheck className="h-3.5 w-3.5 inline mr-1" />
                ความโปร่งใส {transparencyScore}%
              </p>
              <p className="text-xs text-blue-600 leading-relaxed">
                {visibleCount} จาก {reviews.length} รีวิวแสดงต่อสาธารณะ
                {transparencyScore < 80 && ' — ลองเพิ่มรีวิวที่มองเห็นเพื่อสร้างความน่าเชื่อถือ'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="flex items-center gap-2 flex-wrap mb-5">
          {([
            { key: 'all',        label: 'ทั้งหมด',   count: reviews.length },
            { key: 'positive',   label: 'เชิงบวก',   count: positiveCount  },
            { key: 'negative',   label: 'เชิงลบ',   count: negativeCount  },
            { key: 'unanswered', label: 'ยังไม่ตอบ', count: unansweredCount },
            { key: 'hidden',     label: '🙈 ซ่อนอยู่', count: hiddenCount   },
          ] as const).map(tab => (
            <button key={tab.key}
              onClick={() => setActiveFilter(tab.key as FilterTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab.key
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'glass-sm text-slate-600 hover:border-primary/30'
              }`}>
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeFilter === tab.key ? 'bg-white/20 text-white' : 'glass-sm text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Review List */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-medium">ไม่พบรีวิวในหมวดนี้</p>
            </div>
          ) : (
            filteredReviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                onReply={handleReply}
                onToggleVisibility={handleToggleVisibility}
                togglingId={togglingId}
              />
            ))
          )}
        </motion.div>

        {/* Bottom Nav */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={12}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {[
            { label: 'Analytics Charts', desc: 'ดูกราฟแนวโน้มรายได้', href: '/dashboard/provider/analytics', emoji: '📊' },
            { label: 'AI Insights',      desc: 'คำแนะนำปรับปรุงธุรกิจ', href: '/dashboard/provider/insights', emoji: '🤖' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 p-4 rounded-xl glass border-white/20 hover:border-amber-300 transition-all">
              <span className="text-xl">{item.emoji}</span>
              <div>
                <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </Link>
          ))}
        </motion.div>

      </section>
      <AppFooter />
    </main>
  )
}
