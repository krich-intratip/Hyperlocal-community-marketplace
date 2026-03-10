import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_NOTIFICATIONS, type MockNotification } from '@/lib/mock-notifications'

// ── State Interface ───────────────────────────────────────────────────────────

interface NotificationsState {
  notifications: MockNotification[]
  // Computed
  unreadCount: () => number
  // Actions
  markRead: (id: string) => void
  markAllRead: () => void
  addNotification: (n: MockNotification) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: MOCK_NOTIFICATIONS,

      // Derived — call as a function to get fresh count
      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      addNotification: (notification) =>
        set((s) => ({
          notifications: [notification, ...s.notifications],
        })),

      removeNotification: (id) =>
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: 'chm-notifications',
      version: 1, // bump to reset persisted state when schema changes
    },
  ),
)
