'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  Bell, CheckCircle, Clock, Star, Package, Megaphone,
  DollarSign, MapPin, X, Check, ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useNotifications, useMarkAllRead } from '@/hooks/useNotifications'
import { useDateFormat } from '@/hooks/useDateFormat'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }

type NotifType = 'booking' | 'review' | 'announcement' | 'system' | 'payment'

interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
  href?: string
}

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  booking:      { icon: Package,     color: 'text-blue-600',  bg: 'bg-blue-100'   },
  review:       { icon: Star,        color: 'text-amber-600', bg: 'bg-amber-100'  },
  announcement: { icon: Megaphone,   color: 'text-purple-600',bg: 'bg-purple-100' },
  system:       { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100'  },
  payment:      { icon: DollarSign,  color: 'text-emerald-600', bg: 'bg-emerald-100' },
}

const FILTER_TABS = [
  { key: 'ALL',  label: 'ทั้งหมด' },
  { key: 'unread', label: 'ยังไม่อ่าน' },
  { key: 'booking', label: 'การจอง' },
  { key: 'announcement', label: 'ประกาศ' },
]

export default function NotificationsPage() {
  useAuthGuard()
  const { data: rawNotifs = [], isLoading } = useNotifications()
  const { fmtShort } = useDateFormat()
  const markAllReadMutation = useMarkAllRead()
  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [localRead, setLocalRead] = useState<Set<string>>(new Set())

  const notifs: Notification[] = rawNotifs
    .filter(n => !dismissed.has(n.id))
    .map(n => ({
      id: n.id,
      type: n.type as NotifType,
      title: n.title,
      body: n.body,
      time: fmtShort(n.createdAt),
      read: n.read || localRead.has(n.id),
      href: n.href,
    }))

  const unreadCount = notifs.filter(n => !n.read).length

  const filtered = notifs.filter(n => {
    if (activeTab === 'unread') return !n.read
    if (activeTab === 'ALL') return true
    return n.type === activeTab
  })

  function markRead(id: string) {
    setLocalRead(prev => new Set([...prev, id]))
  }

  function markAllRead() {
    setLocalRead(new Set(notifs.map(n => n.id)))
    markAllReadMutation.mutate()
  }

  function dismiss(id: string) {
    setDismissed(prev => new Set([...prev, id]))
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Bell className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-extrabold text-slate-900">การแจ้งเตือน</h1>
              {unreadCount > 0 && (
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-extrabold">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">{unreadCount > 0 ? `${unreadCount} รายการยังไม่ได้อ่าน` : 'อ่านครบทุกรายการแล้ว'}</p>
          </div>
          {unreadCount > 0 && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors">
              <Check className="h-3.5 w-3.5" /> อ่านทั้งหมด
            </motion.button>
          )}
        </motion.div>

        {/* Filter tabs */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="flex gap-2 overflow-x-auto pb-1 mb-5">
          {FILTER_TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-bold transition-all ${
                activeTab === t.key ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/80 text-slate-600 border border-slate-200 hover:border-blue-200'
              }`}>{t.label}</button>
          ))}
        </motion.div>

        {/* Notifications list */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center py-16">
              <Bell className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="font-bold text-slate-500">ไม่มีการแจ้งเตือน</p>
              <p className="text-sm text-slate-400 mt-1">เราจะแจ้งเตือนเมื่อมีอัพเดตสำคัญ</p>
            </motion.div>
          ) : (
            <motion.div key="list" variants={stagger} initial="hidden" animate="show" className="space-y-2">
              {filtered.map((notif, i) => {
                const cfg = TYPE_CONFIG[notif.type]
                const Icon = cfg.icon
                const content = (
                  <motion.div key={notif.id} variants={fadeUp} custom={i}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    className={`relative rounded-2xl border p-4 transition-all ${
                      notif.read
                        ? 'bg-white/70 border-slate-100'
                        : 'bg-white/95 border-blue-100 shadow-sm shadow-blue-50'
                    }`}>
                    {/* Unread dot */}
                    {!notif.read && (
                      <div className="absolute top-4 right-11 w-2 h-2 rounded-full bg-blue-500" />
                    )}

                    {/* Dismiss */}
                    <button onClick={() => dismiss(notif.id)}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                      <X className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    <div className="flex items-start gap-3 pr-6">
                      <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0" onClick={() => markRead(notif.id)}>
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-bold leading-snug ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                            {notif.title}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{notif.body}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {notif.time}
                          </span>
                          {notif.href && (
                            <Link href={notif.href as any}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                              ดูรายละเอียด <ChevronRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
                return content
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings link */}
        {notifs.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={10}
            className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              จัดการการแจ้งเตือนได้ที่{' '}
              <Link href="/profile" className="text-blue-500 hover:underline font-medium">โปรไฟล์ของฉัน</Link>
            </p>
          </motion.div>
        )}

      </section>
      <AppFooter />
    </main>
  )
}
