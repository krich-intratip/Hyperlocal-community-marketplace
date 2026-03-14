'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, ChevronLeft, Store, Package, Loader2, Inbox } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useAuthStore } from '@/store/auth.store'
import {
  useConversations,
  useConversationMessages,
  useSendMessage,
  useMarkConversationRead,
} from '@/hooks/useMessages'
import type { ConversationSummary } from '@/lib/api'
import { relativeTimeTH } from '@/lib/date-utils'

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string | null) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] ?? '') + (parts[1][0] ?? '')
    : (parts[0]?.[0] ?? '?')
}

function relativeTime(iso: string | null): string {
  if (!iso) return ''
  try {
    return relativeTimeTH(iso)
  } catch {
    return ''
  }
}

// ── Conversation list item ────────────────────────────────────────────────────

function ConvItem({
  conv,
  active,
  onClick,
}: {
  conv: ConversationSummary
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b border-white/20
        ${active ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-white/20'}`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        {initials(conv.providerDisplayName)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-slate-800 truncate">
            {conv.providerDisplayName ?? 'ผู้ให้บริการ'}
          </span>
          <span className="text-[10px] text-slate-400 flex-shrink-0">
            {relativeTime(conv.lastMessageAt)}
          </span>
        </div>

        {conv.orderId && (
          <div className="flex items-center gap-1 mb-0.5">
            <Package className="h-3 w-3 text-primary" />
            <span className="text-[10px] text-primary font-semibold">
              ออเดอร์ #{conv.orderId.slice(0, 8).toUpperCase()}
            </span>
          </div>
        )}

        <p className="text-xs text-slate-500 truncate">
          {conv.lastMessagePreview ?? 'เริ่มการสนทนา'}
        </p>
      </div>

      {conv.unreadCount > 0 && (
        <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
        </span>
      )}
    </button>
  )
}

// ── Chat thread ───────────────────────────────────────────────────────────────

function ChatThread({ conv }: { conv: ConversationSummary }) {
  const { user } = useAuthStore()
  const { data: messages = [], isLoading } = useConversationMessages(conv.id)
  const sendMsg = useSendMessage(conv.id)
  const markRead = useMarkConversationRead()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Mark as read when conversation opens
  useEffect(() => {
    if (conv.unreadCount > 0) markRead.mutate(conv.id)
  }, [conv.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function handleSend() {
    const body = input.trim()
    if (!body || sendMsg.isPending) return
    sendMsg.mutate(body)
    setInput('')
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/30 glass-sm">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
          {initials(conv.providerDisplayName)}
        </div>
        <div>
          <p className="font-bold text-sm text-slate-800">{conv.providerDisplayName ?? 'ผู้ให้บริการ'}</p>
          {conv.orderId && (
            <p className="text-[11px] text-primary flex items-center gap-1">
              <Package className="h-3 w-3" />
              ออเดอร์ #{conv.orderId.slice(0, 8).toUpperCase()}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center pt-10">
            <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-slate-400 pt-10">
            ยังไม่มีข้อความ เริ่มการสนทนาได้เลย
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === user?.id || msg.senderId === 'user-customer'
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${isMine
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white/70 text-slate-800 border border-white/40 rounded-bl-sm'
                    }`}
                >
                  <p>{msg.body}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-slate-400'}`}>
                    {relativeTime(msg.createdAt)}
                    {isMine && !msg.isRead && <span className="ml-1">· ส่งแล้ว</span>}
                    {isMine && msg.isRead && <span className="ml-1">· อ่านแล้ว</span>}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/30 glass-sm">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="พิมพ์ข้อความ... (Enter เพื่อส่ง)"
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 glass border border-white/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-slate-400 max-h-32 leading-relaxed"
            style={{ overflowY: input.split('\n').length > 3 ? 'auto' : 'hidden' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sendMsg.isPending}
            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            {sendMsg.isPending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Send className="h-4 w-4" />
            }
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">Enter ส่ง · Shift+Enter ขึ้นบรรทัดใหม่</p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MessagesPageInner() {
  useAuthGuard()
  const params = useSearchParams()
  const { data: conversations = [], isLoading } = useConversations()
  const [selectedId, setSelectedId] = useState<string | null>(params.get('cid'))
  const [mobileShowThread, setMobileShowThread] = useState(!!params.get('cid'))

  const selectedConv = conversations.find((c) => c.id === selectedId) ?? null

  function selectConv(conv: ConversationSummary) {
    setSelectedId(conv.id)
    setMobileShowThread(true)
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-extrabold text-slate-900">ข้อความ</h1>
          {conversations.reduce((s, c) => s + c.unreadCount, 0) > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">
              {conversations.reduce((s, c) => s + c.unreadCount, 0)} ใหม่
            </span>
          )}
        </div>

        <div className="glass-card rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 260px)', minHeight: 480 }}>
          <div className="flex h-full">

            {/* ── Left: conversation list ── */}
            <div className={`w-full md:w-80 border-r border-white/30 flex flex-col
              ${mobileShowThread ? 'hidden md:flex' : 'flex'}`}>

              <div className="px-4 py-3 border-b border-white/20 glass-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">การสนทนา</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center pt-12">
                    <Loader2 className="h-5 w-5 text-slate-300 animate-spin" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                    <Inbox className="h-10 w-10 text-slate-300 mb-3" />
                    <p className="font-semibold text-slate-500">ยังไม่มีการสนทนา</p>
                    <p className="text-xs text-slate-400 mt-1">
                      ติดต่อผู้ให้บริการจากหน้ารายการสินค้า
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {conversations.map((conv, i) => (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <ConvItem
                          conv={conv}
                          active={conv.id === selectedId}
                          onClick={() => selectConv(conv)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* ── Right: chat thread ── */}
            <div className={`flex-1 flex flex-col
              ${mobileShowThread ? 'flex' : 'hidden md:flex'}`}>

              {/* Mobile back button */}
              <div className="md:hidden px-4 py-2 border-b border-white/20">
                <button
                  onClick={() => setMobileShowThread(false)}
                  className="flex items-center gap-1 text-sm text-primary font-semibold"
                >
                  <ChevronLeft className="h-4 w-4" /> กลับ
                </button>
              </div>

              {selectedConv ? (
                <ChatThread key={selectedConv.id} conv={selectedConv} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <Store className="h-12 w-12 text-slate-200 mb-4" />
                  <p className="font-bold text-slate-400">เลือกการสนทนา</p>
                  <p className="text-sm text-slate-400 mt-1">
                    คลิกที่การสนทนาด้านซ้ายเพื่อดูข้อความ
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </main>
  )
}
