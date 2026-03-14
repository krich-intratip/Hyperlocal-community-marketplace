'use client'
import { useLoyaltyAccount, useLoyaltyTransactions } from '@/hooks/useLoyalty'
import { formatDateTimeTH } from '@/lib/date-utils'
import { Star, TrendingUp, Gift, RotateCcw, Award, Coins } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { LoyaltyTransaction } from '@/lib/api'

const TIER_CONFIG = {
  BRONZE:   { label: 'บรอนซ์',   color: 'text-amber-700',  bg: 'bg-amber-100',  ring: 'ring-amber-400',  gradient: 'from-amber-600 to-amber-400',  emoji: '🥉' },
  SILVER:   { label: 'ซิลเวอร์', color: 'text-slate-600',  bg: 'bg-slate-100',  ring: 'ring-slate-400',  gradient: 'from-slate-500 to-slate-300',  emoji: '🥈' },
  GOLD:     { label: 'โกลด์',    color: 'text-yellow-600', bg: 'bg-yellow-100', ring: 'ring-yellow-400', gradient: 'from-yellow-500 to-yellow-300', emoji: '🥇' },
  PLATINUM: { label: 'แพลตินัม', color: 'text-purple-600', bg: 'bg-purple-100', ring: 'ring-purple-400', gradient: 'from-purple-600 to-indigo-400', emoji: '💎' },
} as const

type TierKey = keyof typeof TIER_CONFIG

const TX_ICON: Record<LoyaltyTransaction['type'], React.ReactNode> = {
  EARN:    <TrendingUp className="w-4 h-4 text-emerald-500" />,
  REDEEM:  <Gift className="w-4 h-4 text-indigo-500" />,
  RESTORE: <RotateCcw className="w-4 h-4 text-amber-500" />,
  BONUS:   <Star className="w-4 h-4 text-rose-500" />,
}

const TX_COLOR: Record<LoyaltyTransaction['type'], string> = {
  EARN:    'text-emerald-600',
  REDEEM:  'text-indigo-600',
  RESTORE: 'text-amber-600',
  BONUS:   'text-rose-600',
}

const TIER_MULTIPLIER: Record<TierKey, string> = {
  BRONZE:   'ได้รับแต้ม ×1.0',
  SILVER:   'ได้รับแต้ม ×1.2',
  GOLD:     'ได้รับแต้ม ×1.5',
  PLATINUM: 'ได้รับแต้ม ×2.0',
}

const TIER_THRESHOLDS: Record<TierKey, number> = {
  BRONZE: 0,
  SILVER: 500,
  GOLD: 2000,
  PLATINUM: 5000,
}

export default function PointsPage() {
  const { data: account, isLoading: loadingAccount } = useLoyaltyAccount()
  const { data: txs = [], isLoading: loadingTx } = useLoyaltyTransactions(30)

  if (loadingAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">กรุณาเข้าสู่ระบบก่อน</p>
      </div>
    )
  }

  const tier = TIER_CONFIG[account.tier]
  const currentThreshold = TIER_THRESHOLDS[account.tier]
  const nextThreshold = account.nextTier ? TIER_THRESHOLDS[account.nextTier] : account.totalEarned
  const progress = account.nextTier
    ? Math.min(100, ((account.totalEarned - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
    : 100

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-2xl mx-auto">
      {/* Back */}
      <div className="mb-6">
        <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors">
          ← กลับหน้าโปรไฟล์
        </Link>
      </div>

      {/* Loyalty Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-2xl bg-gradient-to-br ${tier.gradient} p-6 text-white shadow-xl mb-6 overflow-hidden`}
      >
        <div className="absolute -top-4 -right-4 text-8xl opacity-20 select-none">{tier.emoji}</div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-80 mb-1">ระดับสมาชิก</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{tier.emoji}</span>
              <span className="text-xl font-bold">{tier.label}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80 mb-1">แต้มสะสม</p>
            <p className="text-3xl font-bold">{account.points.toLocaleString()}</p>
            <p className="text-xs opacity-70">มูลค่า ฿{account.redeemValue}</p>
          </div>
        </div>

        {/* Progress to next tier */}
        {account.nextTier && (
          <div className="mt-4">
            <div className="flex justify-between text-xs opacity-80 mb-1">
              <span>{tier.label}</span>
              <span>{TIER_CONFIG[account.nextTier].label} (อีก {account.pointsToNextTier?.toLocaleString()} แต้ม)</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full">
              <div
                className="h-2 bg-white rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        {!account.nextTier && (
          <div className="mt-4 text-center text-sm font-medium opacity-90">
            🎉 คุณถึงระดับสูงสุดแล้ว! ขอบคุณที่ไว้วางใจเรา
          </div>
        )}
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {([
          { label: 'แต้มที่มี', value: account.points.toLocaleString(), sub: `฿${account.redeemValue} ส่วนลด`, color: 'text-indigo-600' },
          { label: 'แต้มสะสมทั้งหมด', value: account.totalEarned.toLocaleString(), sub: 'ตลอดการใช้งาน', color: 'text-emerald-600' },
          { label: 'แต้มที่ใช้ไป', value: account.totalRedeemed.toLocaleString(), sub: 'แลกแล้ว', color: 'text-rose-600' },
        ] as const).map(card => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-xl p-3 text-center"
          >
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
            <p className="text-[10px] text-slate-400">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* How to earn / redeem */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" /> วิธีสะสมและแลกแต้ม
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>ใช้จ่าย ฿10 = 1 แต้ม (คูณตามระดับ: ซิลเวอร์×1.2, โกลด์×1.5, แพลตินัม×2.0)</span>
          </div>
          <div className="flex items-start gap-2">
            <Gift className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
            <span>100 แต้ม = ส่วนลด ฿10 ใช้ได้ที่หน้าตะกร้าสินค้า</span>
          </div>
          <div className="flex items-start gap-2">
            <RotateCcw className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <span>แต้มจะถูกคืนอัตโนมัติเมื่อยกเลิกคำสั่งซื้อ</span>
          </div>
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" /> สิทธิประโยชน์ระดับ
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(TIER_CONFIG) as [TierKey, typeof TIER_CONFIG.BRONZE][]).map(([key, cfg]) => (
            <div
              key={key}
              className={`rounded-lg p-3 border-2 ${account.tier === key ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span>{cfg.emoji}</span>
                <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                {account.tier === key && (
                  <span className="text-[10px] bg-primary text-white rounded px-1">คุณอยู่ที่นี่</span>
                )}
              </div>
              <p className="text-xs text-slate-500">{TIER_MULTIPLIER[key]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Coins className="w-4 h-4 text-primary" /> ประวัติแต้ม
        </h3>
        {loadingTx ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse h-12 bg-slate-100 rounded-lg" />
            ))}
          </div>
        ) : txs.length === 0 ? (
          <p className="text-center text-slate-400 py-6">ยังไม่มีประวัติแต้ม</p>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {txs.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    {TX_ICON[tx.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{tx.description ?? tx.type}</p>
                    <p className="text-xs text-slate-400">{formatDateTimeTH(tx.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${TX_COLOR[tx.type]}`}>
                      {tx.points > 0 ? '+' : ''}{tx.points} แต้ม
                    </p>
                    <p className="text-xs text-slate-400">คงเหลือ {tx.balance}</p>
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
