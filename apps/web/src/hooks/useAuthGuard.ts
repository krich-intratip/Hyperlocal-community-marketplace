'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import type { UserRole } from '@/store/auth.store'

/**
 * Client-side auth guard hook.
 * Redirects to /auth/signin?redirect=<current-path> if not logged in.
 * Optionally restrict to specific roles.
 */
export function useAuthGuard(allowedRoles?: UserRole[]) {
  const { isLoggedIn, user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoggedIn) {
      const redirect = pathname && pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : ''
      router.replace(`/auth/signin${redirect}`)
      return
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/dashboard')
    }
  }, [isLoggedIn, user, router, allowedRoles, pathname])

  return { isLoggedIn, user }
}
