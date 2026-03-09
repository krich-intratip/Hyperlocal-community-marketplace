import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'customer' | 'provider' | 'admin' | 'superadmin'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar: string
  avatarUrl?: string
  role: UserRole
  verified: boolean
}

interface AuthState {
  user: AuthUser | null
  isLoggedIn: boolean
  login: (user: AuthUser) => void
  logout: () => void
  updateUser: (partial: Partial<AuthUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      updateUser: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : null })),
    }),
    { name: 'chm-auth' }
  )
)
