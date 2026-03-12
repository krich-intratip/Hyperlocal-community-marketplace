'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ChevronLeft, Star, MessageCircle, ThumbsUp, ThumbsDown, Minus,
  Reply, CheckCircle,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useAuthStore } from '@/store/auth.store'
import { useProviderReviews, useReviewReply } from '@/hooks/useReviews'
import {
  MOCK_REVIEWS,
  RATING_DISTRIBUTION,
  PROVIDER_SUMMARY,
  type MockReview,
  type ReviewSentiment,
} from '@/lib/mock-provider-analytics'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

type FilterTab = 'all' | 'positive' | 'negative' | 'unanswered'

const SENTIMENT_CONFIG: Record<ReviewSentiment, { label: string; icon: typeof ThumbsUp; color: string; bg: string; border: string }> = {
  positive: { label: 'เชิงบวก',   icon: ThumbsUp,   color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200' },
  neutral:  { label: 'กลางๆ',     icon: Minus,      color: 'text-slate-600', bg: 'glass-sm',   border: 'border-white/20' },
  negative: { label: 'เชิงลบ',   icon: ThumbsDown,  color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200'   },
}

/** Derive sentiment from a 1-5 rating (no NLP needed for MVP) */
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

function useDateFmt(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ReviewCard({
  review,
  onReply,
}: {
  review: MockReview
  onReply?: (id: string, text: string) => void
}) {
  const [replyMode, setReplyMode] = useState(false)
  const [replyText, setReplyText] = useState(review.replyText ?? '')
  const [replied, setReplied] = useState(review.replied)
  const [savedReply, setSavedReply] = useState(review.replyText ?? '')
  const sentCfg = SENTIMENT_CONFIG[review.sentiment]
  const SentIcon = sentCfg.icon

  const handleSendReply = () => {
    if (!replyText.trim()) return
    // Optimistic local update first for immediate UI feedback
    setSavedReply(replyText)
    setReplied(true)
    setReplyMode(false)
    // Persist to API
    onReply?.(review.id, replyText)
  }

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -1 }}
      className="glass-card rounded-2xl p-5">

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
              <span className="text-xs text-slate-400">{useDateFmt(review.date)}</span>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${sentCfg.bg} ${sentCfg.color} border ${sentCfg.border}`}>
          <SentIcon className="h-3 w-3" />
          {sentCfg.label}
        </div>
      </div>

      {/* Review body */}
      <p className="text-sm text-slate-700 leading-relaxed mb-2">"{review.text}"</p>
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

// ── Main Component ────────────────────────────────────────────────────────────────

export default function ProviderReviewsClient() {
  useAuthGuard(['provider', 'admin', 'superadmin'])
  const { user } = useAuthStore()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [starFilter, setStarFilter] = useState<number | null>(null)

  // Real data — falls back to mock when API is unavailable
  const { data: realReviews } = useProviderReviews(user?.id ?? '')
  const reviewReply = useReviewReply()

  // Map real API reviews to the MockReview shape used by this UI, or fall back to mock
  const reviews: MockReview[] = (realReviews && realReviews.length > 0)
    ? realReviews.map(r => ({
        id: r.id,
        customer: r.reviewerId,
        rating: r.rating,
        date: r.createdAt,
        text: r.comment ?? '',
        sentiment: sentimentFromRating(r.rating),
        listing: r.listingTitle ?? '',
        replied: !!r.providerReply,
        replyText: r.providerReply ?? undefined,
      }))
    : MOCK_REVIEWS

  const handleReply = (reviewId: string, replyText: string) => {
    if (!user?.id) return
    reviewReply.mutate({ id: reviewId, replyText, providerId: user.id })
  }

  const positiveCount = reviews.filter(r => r.sentiment === 'positive').length
  const neutralCount  = reviews.filter(r => r.sentiment === 'neutral').length
  const negativeCount = reviews.filter(r => r.sentiment === 'negative').length
  const unansweredCount = reviews.filter(r => !r.replied).length

  const filteredReviews = reviews.filter(r => {
    if (starFilter !== null && r.rating !== starFilter) return false
    if (activeFilter === 'positive')  return r.sentiment === 'positive'
    if (activeFilter === 'negative')  return r.sentiment === 'negative'
    if (activeFilter === 'unanswered') return !r.replied
    return true
  })

  const responseRate = reviews.length > 0
    ? Math.round((reviews.filter(r => r.replied).length / reviews.length) * 100)
    : 0

  // Use real average rating if available, else from mock summary
  const avgRating = (realReviews && realReviews.length > 0)
    ? (realReviews.reduce((sum, r) => sum + r.rating, 0) / realReviews.length).toFixed(1)
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
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" /> จัดการรีวิว
          </h1>
          <p className="text-sm text-slate-500 mt-1">วิเคราะห์ Sentiment และตอบรีวิวลูกค้า</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'รีวิวทั้งหมด',  value: reviews.length, icon: '📝', color: 'glass-sm'   },
            { label: 'คะแนนเฉลี่ย',   value: `${avgRating} ⭐`, icon: '⭐', color: 'bg-amber-50' },
            { label: 'อัตราตอบ',      value: `${responseRate}%`,  icon: '💬', color: 'bg-green-50'  },
            { label: 'ยังไม่ตอบ',     value: unansweredCount,     icon: '⏰', color: 'bg-red-50'    },
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
                  className={`w-full flex items-center gap-3 text-sm group transition-opacity ${
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

          {/* Sentiment Breakdown */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="glass-card rounded-2xl p-5">
            <h2 className="font-extrabold text-slate-900 text-sm mb-4">Sentiment Analysis</h2>
            <div className="space-y-4">
              {[
                { type: 'positive' as ReviewSentiment, count: positiveCount },
                { type: 'neutral'  as ReviewSentiment, count: neutralCount  },
                { type: 'negative' as ReviewSentiment, count: negativeCount },
              ].map(({ type, count }) => {
                const cfg = SENTIMENT_CONFIG[type]
                const SIcon = cfg.icon
                const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
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

            {/* AI Sentiment summary */}
            <div className="mt-5 p-3 bg-purple-50 border border-purple-100 rounded-xl">
              <p className="text-xs font-bold text-purple-700 mb-1">🤖 AI Summary</p>
              <p className="text-xs text-purple-600 leading-relaxed">
                รีวิวเชิงบวก {reviews.length > 0 ? Math.round((positiveCount / reviews.length) * 100) : 0}% บ่งชี้ถึงความพึงพอใจสูง
                ประเด็นที่ลูกค้ายกถึงบ่อย: ความสะอาด ความตรงเวลา และรสชาติ
                ควรตอบรีวิวเชิงลบทุกข้อภายใน 24 ชม.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="flex items-center gap-2 flex-wrap mb-5">
          {([
            { key: 'all',       label: 'ทั้งหมด',    count: reviews.length },
            { key: 'positive',  label: 'เชิงบวก',    count: positiveCount },
            { key: 'negative',  label: 'เชิงลบ',    count: negativeCount },
            { key: 'unanswered',label: 'ยังไม่ตอบ', count: unansweredCount },
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
              <ReviewCard key={review.id} review={review} onReply={handleReply} />
            ))
          )}
        </motion.div>

        {/* Bottom Nav */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={12}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {[
            { label: 'Analytics Charts', desc: 'ดูกราฟแนวโน้มรายได้', href: '/dashboard/provider/analytics', emoji: '📊' },
            { label: 'AI Insights', desc: 'คำแนะนำปรับปรุงธุรกิจ', href: '/dashboard/provider/insights', emoji: '🤖' },
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
