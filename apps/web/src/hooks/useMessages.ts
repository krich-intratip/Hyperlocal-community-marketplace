'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi, type ConversationSummary, type ChatMessage } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: ConversationSummary[] = [
  {
    id: 'conv-001',
    customerId: 'user-customer',
    providerId: 'provider-1',
    providerUserId: 'user-provider-1',
    providerDisplayName: 'คุณแม่สมใจ ขายอาหาร',
    orderId: 'ORD-001',
    lastMessagePreview: 'ขอบคุณที่สั่งนะคะ จะเตรียมให้เสร็จภายใน 30 นาที',
    lastMessageAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'conv-002',
    customerId: 'user-customer',
    providerId: 'provider-2',
    providerUserId: 'user-provider-2',
    providerDisplayName: 'ช่างสมชาย ซ่อมบ้าน',
    orderId: null,
    lastMessagePreview: 'ได้เลยครับ วันจันทร์ผมว่างตั้งแต่ 9 โมง',
    lastMessageAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    createdAt: new Date(Date.now() - 48 * 3600_000).toISOString(),
    unreadCount: 0,
  },
]

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-001': [
    {
      id: 'msg-1', conversationId: 'conv-001', senderId: 'user-customer',
      body: 'สวัสดีครับ ขอสั่งข้าวราดแกง 2 จานนะครับ', isRead: true,
      createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    },
    {
      id: 'msg-2', conversationId: 'conv-001', senderId: 'user-provider-1',
      body: 'สวัสดีค่ะ รับออเดอร์แล้วนะคะ', isRead: true,
      createdAt: new Date(Date.now() - 1.9 * 3600_000).toISOString(),
    },
    {
      id: 'msg-3', conversationId: 'conv-001', senderId: 'user-provider-1',
      body: 'ขอบคุณที่สั่งนะคะ จะเตรียมให้เสร็จภายใน 30 นาที', isRead: false,
      createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    },
  ],
  'conv-002': [
    {
      id: 'msg-4', conversationId: 'conv-002', senderId: 'user-customer',
      body: 'สวัสดีครับ อยากให้ช่วยซ่อมหลังคาหน่อยได้ไหมครับ', isRead: true,
      createdAt: new Date(Date.now() - 48 * 3600_000).toISOString(),
    },
    {
      id: 'msg-5', conversationId: 'conv-002', senderId: 'user-provider-2',
      body: 'ได้เลยครับ วันจันทร์ผมว่างตั้งแต่ 9 โมง', isRead: true,
      createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    },
  ],
}

// ── Query keys ────────────────────────────────────────────────────────────────

export const msgKeys = {
  conversations: ['messages', 'conversations'] as const,
  messages: (id: string) => ['messages', 'thread', id] as const,
  unread: ['messages', 'unread'] as const,
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useConversations() {
  return useQuery({
    queryKey: msgKeys.conversations,
    queryFn: async (): Promise<ConversationSummary[]> => {
      if (USE_REAL_API) {
        const res = await messagesApi.list()
        return (res.data as any) ?? []
      }
      await new Promise((r) => setTimeout(r, 120))
      return MOCK_CONVERSATIONS
    },
    staleTime: 30_000,
  })
}

export function useConversationMessages(conversationId: string | null) {
  return useQuery({
    queryKey: msgKeys.messages(conversationId ?? ''),
    enabled: !!conversationId,
    queryFn: async (): Promise<ChatMessage[]> => {
      if (USE_REAL_API) {
        const res = await messagesApi.getMessages(conversationId!)
        return (res.data as any) ?? []
      }
      await new Promise((r) => setTimeout(r, 80))
      return MOCK_MESSAGES[conversationId!] ?? []
    },
    staleTime: 10_000,
    refetchInterval: 8_000, // poll for new messages every 8s
  })
}

export function useUnreadMessageCount() {
  return useQuery({
    queryKey: msgKeys.unread,
    queryFn: async (): Promise<number> => {
      if (USE_REAL_API) {
        const res = await messagesApi.getUnreadCount()
        return (res.data as any)?.count ?? 0
      }
      return MOCK_CONVERSATIONS.reduce((s, c) => s + c.unreadCount, 0)
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}

export function useStartConversation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: { providerId: string; orderId?: string; message: string }) => {
      if (USE_REAL_API) {
        const res = await messagesApi.start(dto)
        return res.data
      }
      await new Promise((r) => setTimeout(r, 300))
      // Return mock conversation
      return { conversation: MOCK_CONVERSATIONS[0], messages: [] }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: msgKeys.conversations })
      qc.invalidateQueries({ queryKey: msgKeys.unread })
    },
  })
}

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: string): Promise<ChatMessage> => {
      if (USE_REAL_API) {
        const res = await messagesApi.send(conversationId, body)
        return res.data as unknown as ChatMessage
      }
      await new Promise((r) => setTimeout(r, 150))
      return {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: 'user-customer',
        body,
        isRead: false,
        createdAt: new Date().toISOString(),
      }
    },
    onSuccess: (newMsg) => {
      // Optimistically append to thread
      qc.setQueryData<ChatMessage[]>(msgKeys.messages(conversationId), (old) =>
        old ? [...old, newMsg] : [newMsg],
      )
      qc.invalidateQueries({ queryKey: msgKeys.conversations })
    },
  })
}

export function useMarkConversationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (USE_REAL_API) {
        await messagesApi.markRead(conversationId)
        return
      }
      await new Promise((r) => setTimeout(r, 100))
    },
    onSuccess: (_data, conversationId) => {
      qc.invalidateQueries({ queryKey: msgKeys.conversations })
      qc.invalidateQueries({ queryKey: msgKeys.unread })
      // Clear unread on the local thread too
      qc.setQueryData<ChatMessage[]>(msgKeys.messages(conversationId), (old) =>
        old?.map((m) => ({ ...m, isRead: true })),
      )
    },
  })
}
