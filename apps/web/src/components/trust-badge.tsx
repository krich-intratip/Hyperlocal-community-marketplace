/**
 * TrustBadge — displays a colour-coded trust tier for a provider.
 *
 * Tiers (based on trustScore 0-100):
 *   ≥ 90  → 🔵 "น่าเชื่อถือ"  (blue)
 *   ≥ 75  → 🟢 "ดี"           (green)
 *   < 75  → 🟡 "ใหม่"         (amber)
 */

export type TrustTier = 'trusted' | 'good' | 'new'

export function getTrustTier(score: number): TrustTier {
  if (score >= 90) return 'trusted'
  if (score >= 75) return 'good'
  return 'new'
}

const TRUST_CONFIG: Record<TrustTier, {
  label: string
  color: string
  bg: string
  border: string
  dot: string
}> = {
  trusted: {
    label: 'น่าเชื่อถือ',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-700',
    dot: 'bg-blue-500',
  },
  good: {
    label: 'ดี',
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-50 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-700',
    dot: 'bg-green-500',
  },
  new: {
    label: 'ใหม่',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-700',
    dot: 'bg-amber-400',
  },
}

interface TrustBadgeProps {
  score: number
  /** 'sm' = compact (listing card), 'md' = full label (provider profile) */
  size?: 'sm' | 'md'
  /** Show numeric score alongside the label */
  showScore?: boolean
}

export function TrustBadge({ score, size = 'sm', showScore = false }: TrustBadgeProps) {
  const tier = getTrustTier(score)
  const cfg = TRUST_CONFIG[tier]

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold border ${cfg.bg} ${cfg.color} ${cfg.border} ${
        size === 'md' ? 'text-xs' : 'text-[11px]'
      }`}
      title={`Trust Score: ${score}/100`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
      {showScore && <span className="opacity-70 ml-0.5">{score}</span>}
    </span>
  )
}
