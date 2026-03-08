'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import type { UserRole } from '@/store/auth.store'

/**
 * Client-side auth guard hook.
 * Redirects to /auth/signin if not logged in.
 * Optionally restrict to specific roles.
 */
export function useAuthGuard(allowedRoles?: UserRole[]) {
  const { isLoggedIn, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/auth/signin')
      return
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/dashboard')
    }
  }, [isLoggedIn, user, router, allowedRoles])

  return { isLoggedIn, user }
}
