'use client'

import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import type { AuthUser } from '@/store/auth.store'

const ROLE_EMOJI: Record<string, string> = {
  customer: '🛍️',
  provider: '⭐',
  admin: '🏘️',
  superadmin: '🔑',
}

function mapResponseToAuthUser(data: {
  id: string
  email: string
  displayName: string
  role: string
  avatarUrl?: string | null
}): AuthUser {
  return {
    id: data.id,
    name: data.displayName,
    email: data.email,
    avatar: ROLE_EMOJI[data.role] ?? '👤',
    avatarUrl: data.avatarUrl ?? undefined,
    role: data.role as AuthUser['role'],
    verified: true,
  }
}

export function useRegister() {
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (dto: {
      email: string
      password: string
      displayName: string
      role: 'customer' | 'provider' | 'admin'
      phone?: string
    }) => authApi.register(dto),

    onSuccess: (res) => {
      login(mapResponseToAuthUser(res.data))
    },
  })
}

export function useEmailLogin() {
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (dto: { email: string; password: string }) => authApi.login(dto),

    onSuccess: (res) => {
      login(mapResponseToAuthUser(res.data))
    },
  })
}
