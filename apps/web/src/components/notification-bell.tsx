'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, X, ChevronRight, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications, useMarkAllRead } from '@/hooks/useNotifications'
import { formatDateShort } from '@/lib/date'

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins < 1)   return 'เมื่อกี้'
  if (mins < 60)  return `${mins} นาทีที่แล้ว`
  if (hours < 24) return `${hours} ชม.ที่แล้ว`
  if (days === 1) return 'เมื่อวาน'
  if (days <= 7)  return `${days} วันที่แล้ว`
  return formatDateShort(iso)
}

const TYPE_ICON: Record<string, string> = {
  booking: '📦',
  review:  '⭐',
  promo:   '🎉',
  system:  '🔔',
}

// ── NotificationBell Component ────────────────────────────────────────────────

/**
 * NotificationBell — animated bell icon with dropdown panel.
 *
 * - Shows dynamic unread badge from useNotifications()
 * - Dropdown lists 5 most recent notifications
 * - "Mark all read" + "ดูทั้งหมด" footer link
 * - Click-outside to close
 */
export function NotificationBell() {
  const [open, setOpen]           = useState(false)
  const [localRead, setLocalRead] = useState<Set<string>>(new Set())
  const ref = useRef<HTMLDivElement>(null)

  const { data: rawNotifs = [] } = useNotifications()
  const markAllMutation = useMarkAllRead()

  // Merge server read-status with optimistic local read-set
  const notifs = rawNotifs.map((n) => ({
    ...n,
    read: n.read || localRead.has(n.id),
  }))

  const unreadCount = notifs.filter((n) => !n.read).length
  const recent      = notifs.slice(0, 5)

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function markRead(id: string) {
    setLocalRead((prev) => new Set([...prev, id]))
  }

  function markAllRead() {
    setLocalRead(new Set(rawNotifs.map((n) => n.id)))
    markAllMutation.mutate()
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div ref={ref} className="relative">

      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label={`การแจ้งเตือน${unreadCount > 0 ? ` (${unreadCount} ใหม่)` : ''}`}
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -14, 14, -8, 8, 0] } : { rotate: 0 }}
          transition={unreadCount > 0 ? { repeat: Infinity, repeatDelay: 4, duration: 0.5 } : {}}
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </motion.div>

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                การแจ้งเตือน
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs font-normal text-blue-600 dark:text-blue-400">
                    {unreadCount} ใหม่
                  </span>
                )}
              </h3>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <CheckCheck className="h-3 w-3" />
                    อ่านทั้งหมด
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700/50">
              {recent.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 dark:text-slate-500">ไม่มีการแจ้งเตือน</p>
                </div>
              ) : (
                recent.map((n) => {
                  const icon = TYPE_ICON[n.type] ?? '🔔'
                  const inner = (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => { markRead(n.id); setOpen(false) }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { markRead(n.id); setOpen(false) } }}
                      className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                        !n.read ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <p
                            className={`text-sm leading-snug line-clamp-1 flex-1 ${
                              !n.read
                                ? 'font-semibold text-slate-900 dark:text-white'
                                : 'font-medium text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {relativeTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  )

                  return n.href ? (
                    <Link key={n.id} href={n.href as `/${string}`}>
                      {inner}
                    </Link>
                  ) : (
                    <div key={n.id}>{inner}</div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 dark:border-slate-700">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                ดูการแจ้งเตือนทั้งหมด
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
