'use client'
import { useState, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pushApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

// VAPID public key — replace with real key before production
const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??
  'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const buf = new ArrayBuffer(rawData.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < rawData.length; i++) {
    view[i] = rawData.charCodeAt(i)
  }
  return buf
}

export type PushPermission = 'default' | 'granted' | 'denied' | 'unsupported'

export function usePushSubscription() {
  const user = useAuthStore(s => s.user)
  const qc = useQueryClient()
  const [permission, setPermission] = useState<PushPermission>(() => {
    if (typeof window === 'undefined') return 'default'
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission as PushPermission
  })
  const [isSubscribing, setIsSubscribing] = useState(false)

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!USE_REAL_API || !user) return false
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false

    setIsSubscribing(true)
    try {
      const perm = await Notification.requestPermission()
      setPermission(perm as PushPermission)
      if (perm !== 'granted') return false

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
      const json = sub.toJSON()
      const keys = json.keys as Record<string, string>
      await pushApi.subscribe({
        endpoint: json.endpoint ?? '',
        p256dh: keys['p256dh'] ?? '',
        auth: keys['auth'] ?? '',
        userAgent: navigator.userAgent.slice(0, 200),
      })
      qc.invalidateQueries({ queryKey: ['push', 'subscriptions'] })
      return true
    } catch {
      return false
    } finally {
      setIsSubscribing(false)
    }
  }, [user, qc])

  return { permission, isSubscribing, subscribe }
}

export function useAdminSendPush() {
  return useMutation({
    mutationFn: async (data: {
      userIds?: string[]
      title: string
      body: string
      url?: string
    }): Promise<{ sent: number; failed: number }> => {
      if (!USE_REAL_API) return { sent: 5, failed: 0 }
      const res = await pushApi.send(data)
      return res.data
    },
  })
}

export function usePushStats() {
  const user = useAuthStore(s => s.user)
  return useQuery({
    queryKey: ['push', 'stats'],
    queryFn: async () => {
      if (!USE_REAL_API) return { total: 128, active: 97 }
      const res = await pushApi.getStats()
      return res.data
    },
    enabled: user?.role === 'superadmin',
  })
}
