'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { useAuthStore } from '@/store/auth.store'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuthStore()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const redirectTo = searchParams.get('redirect') ?? '/dashboard'

    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(user => {
        login({
          id: user.id,
          name: user.displayName ?? user.name ?? user.email,
          email: user.email,
          avatar: user.avatarUrl ?? '👤',
          role: user.role ?? 'customer',
          verified: user.emailVerified ?? true,
        })
        setStatus('success')
        setTimeout(() => {
          if (user.role === 'provider') router.replace('/dashboard/provider')
          else if (user.role === 'admin') router.replace('/franchise/apply')
          else router.replace(redirectTo)
        }, 800)
      })
      .catch(() => {
        setStatus('error')
        setTimeout(() => router.replace('/auth/signin'), 2000)
      })
  }, [login, router, searchParams])

  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 flex items-center justify-center">
      <MarketBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 relative px-6">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">กำลังเข้าสู่ระบบ...</p>
            <p className="text-sm text-slate-400 mt-1">กรุณารอสักครู่</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">เข้าสู่ระบบสำเร็จ!</p>
            <p className="text-sm text-slate-400 mt-1">กำลังพาคุณไปยังหน้าถัดไป...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">เกิดข้อผิดพลาด</p>
            <p className="text-sm text-slate-400 mt-1">กำลังพากลับหน้าเข้าสู่ระบบ...</p>
          </>
        )}
      </motion.div>
    </main>
  )
}
