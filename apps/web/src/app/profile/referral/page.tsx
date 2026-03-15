'use client'
import { useState } from 'react'
import { useReferralStats } from '@/hooks/useReferral'
import { formatDateMedTH } from '@/lib/date-utils'
import { Copy, Check, Users, Gift, Star, Share2 } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function ReferralPage() {
  const { data: stats, isLoading } = useReferralStats()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!stats) return
    await navigator.clipboard.writeText(stats.referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (!stats) return
    if (navigator.share) {
      await navigator.share({ title: 'CHM — ตลาดชุมชน', text: `สมัครสมาชิก CHM ด้วยโค้ดชวนเพื่อน ${stats.code} รับแต้มโบนัสทันที!`, url: stats.referralLink })
    } else {
      handleCopy()
    }
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  )

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500">กรุณาเข้าสู่ระบบก่อน</p>
    </div>
  )

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors">
          ← กลับหน้าโปรไฟล์
        </Link>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-rose-500 p-6 text-white shadow-xl mb-6 relative overflow-hidden"
      >
        <div className="absolute -top-6 -right-6 text-9xl opacity-10 select-none">🎁</div>
        <h1 className="text-2xl font-bold mb-1">แนะนำเพื่อน รับแต้ม!</h1>
        <p className="text-sm opacity-80 mb-4">ทุกครั้งที่เพื่อนสั่งซื้อสำเร็จครั้งแรก คุณจะได้รับ 50 แต้มทันที</p>

        {/* Referral code */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <p className="text-xs opacity-70 mb-1">โค้ดของคุณ</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold tracking-wider">{stats.code}</span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" />
                แชร์
              </button>
            </div>
          </div>
          <p className="text-xs opacity-60 mt-2 truncate">{stats.referralLink}</p>
        </div>
      </motion.div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'เพื่อนที่ชวน', value: stats.totalReferred, icon: <Users className="w-4 h-4" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'สั่งซื้อแล้ว', value: stats.completedReferrals, icon: <Check className="w-4 h-4" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'แต้มที่ได้', value: stats.totalBonusEarned, icon: <Star className="w-4 h-4" />, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(card => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-xl p-3 text-center"
          >
            <div className={`w-8 h-8 ${card.bg} ${card.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
              {card.icon}
            </div>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Gift className="w-4 h-4 text-primary" /> วิธีชวนเพื่อน
        </h3>
        <div className="space-y-3">
          {[
            { step: '1', text: 'แชร์โค้ดหรือลิงก์ให้เพื่อน', color: 'bg-indigo-100 text-indigo-700' },
            { step: '2', text: 'เพื่อนสมัครสมาชิกด้วยโค้ดของคุณ', color: 'bg-violet-100 text-violet-700' },
            { step: '3', text: 'เพื่อนสั่งซื้อสำเร็จครั้งแรก → คุณได้ 50 แต้มทันที!', color: 'bg-rose-100 text-rose-700' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${item.color}`}>
                {item.step}
              </div>
              <p className="text-sm text-slate-600 pt-1">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral list */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" /> รายชื่อเพื่อนที่ชวน ({stats.referrals.length})
        </h3>
        {stats.referrals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">🤝</p>
            <p className="text-slate-400 text-sm">ยังไม่มีเพื่อนที่ชวนมา</p>
            <p className="text-slate-400 text-xs mt-1">แชร์โค้ดด้านบนให้เพื่อน ๆ ได้เลย!</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {stats.referrals.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${r.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {r.status === 'COMPLETED' ? '✓' : '⏳'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">เพื่อนคนที่ {i + 1}</p>
                    <p className="text-xs text-slate-400">ชวนเมื่อ {formatDateMedTH(r.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {r.status === 'COMPLETED' ? (
                      <span className="text-sm font-semibold text-emerald-600">+{r.bonusPoints} แต้ม</span>
                    ) : (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">รอสั่งซื้อ</span>
                    )}
                    {r.completedAt && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatDateMedTH(r.completedAt)}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </main>
  )
}
