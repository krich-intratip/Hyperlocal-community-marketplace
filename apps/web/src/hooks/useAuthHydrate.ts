'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

/**
 * Hydrates Zustand auth store from the httpOnly JWT cookie by calling GET /auth/me.
 * Should be called once in the root layout or a top-level client component.
 * No-ops when already logged in or when no cookie is present.
 */
export function useAuthHydrate() {
  const { isLoggedIn, login } = useAuthStore()

  useEffect(() => {
    if (isLoggedIn) return
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(user => {
        if (!user) return
        login({
          id: user.id,
          name: user.displayName ?? user.name ?? user.email,
          email: user.email,
          avatar: user.avatarUrl ?? '👤',
          role: user.role ?? 'customer',
          verified: user.emailVerified ?? true,
        })
      })
      .catch(() => {})
  }, [isLoggedIn, login])
}
