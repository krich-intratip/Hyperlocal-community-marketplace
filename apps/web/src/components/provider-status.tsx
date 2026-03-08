'use client'

import { motion } from 'framer-motion'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { useT } from '@/hooks/useT'

export type ServiceStatus = 'available' | 'busy' | 'offline'

interface ProviderStatusBadgeProps {
  status: ServiceStatus
  size?: 'sm' | 'md'
}

export function ProviderStatusBadge({ status, size = 'md' }: ProviderStatusBadgeProps) {
  const t = useT()
  const cfg = {
    available: { label: t.status.available, bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800', dot: 'bg-green-500', Icon: CheckCircle },
    busy: { label: t.status.busy, bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500', Icon: Clock },
    offline: { label: t.status.offline, bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700', dot: 'bg-slate-400', Icon: XCircle },
  }[status]

  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  const padSize = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1'
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${cfg.bg} ${cfg.text} ${cfg.border} ${textSize} ${padSize}`}>
      <span className="relative flex">
        <span className={`${dotSize} rounded-full ${cfg.dot}`} />
        {status === 'available' && (
          <span className={`absolute inset-0 rounded-full ${cfg.dot} animate-ping opacity-60`} />
        )}
      </span>
      {cfg.label}
    </span>
  )
}

interface WeeklyScheduleProps {
  schedule: {
    day: number // 0=Mon … 6=Sun
    slots: { time: string; status: 'free' | 'booked' | 'closed' }[]
  }[]
}

export function WeeklySchedule({ schedule }: WeeklyScheduleProps) {
  const t = useT()

  const slotColor = {
    free: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    booked: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    closed: 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700',
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px]">
        {/* Day headers */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="text-xs text-slate-400 dark:text-slate-500 text-center py-1">{t.schedule.title}</div>
          {t.schedule.days.map((d) => (
            <div key={d} className="text-xs font-bold text-slate-600 dark:text-slate-300 text-center py-1">{d}</div>
          ))}
        </div>

        {/* Time slots */}
        {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
          <div key={time} className="grid grid-cols-8 gap-1 mb-1">
            <div className="text-xs text-slate-400 dark:text-slate-500 text-right pr-2 flex items-center justify-end">{time}</div>
            {schedule.map((dayData) => {
              const slot = dayData.slots.find((s) => s.time === time)
              const st = slot?.status ?? 'closed'
              return (
                <motion.div
                  key={dayData.day}
                  whileHover={{ scale: 1.12 }}
                  title={st === 'free' ? t.schedule.free : st === 'booked' ? t.schedule.booked : t.schedule.closed}
                  className={`h-7 rounded border cursor-default transition-all ${slotColor[st]}`}
                />
              )
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {(['free', 'booked', 'closed'] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded border ${slotColor[s]}`} />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {s === 'free' ? t.schedule.free : s === 'booked' ? t.schedule.booked : t.schedule.closed}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
