'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { ArrowRight, Users, Star, Store, Eye, EyeOff, Mail, Chrome } from 'lucide-react'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import type { AuthUser } from '@/store/auth.store'
import { useEmailLogin } from '@/hooks/useAuthMutations'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1'

/** Allow only relative paths as redirect targets to prevent open-redirect attacks */
function sanitizeRedirect(url: string | null): string {
  if (!url) return '/dashboard'
  // Must start with / but not // (protocol-relative URLs)
  if (/^\/[^/]/.test(url)) return url
  return '/dashboard'
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

type Role = 'customer' | 'provider' | 'admin'

const ROLES: { id: Role; icon: React.ElementType; emoji: string; label: string; desc: string; color: string; border: string; bg: string }[] = [
  {
    id: 'customer', icon: Users, emoji: '🛍️',
    label: 'ลูกค้า', desc: 'หาบริการในชุมชนใกล้บ้าน — สมัครฟรี!',
    color: 'text-blue-700', border: 'border-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    id: 'provider', icon: Star, emoji: '⭐',
    label: 'ผู้ให้บริการ', desc: 'รับงาน สร้างรายได้จากทักษะในชุมชน',
    color: 'text-amber-700', border: 'border-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    id: 'admin', icon: Store, emoji: '🏘️',
    label: 'ผู้จัดการตลาด', desc: 'สมัครเปิดตลาดชุมชน — ขอพื้นที่จาก Super Admin',
    color: 'text-green-700', border: 'border-green-300', bg: 'bg-green-50 dark:bg-green-900/20',
  },
]

const MOCK_USERS: Record<Role, AuthUser> = {
  customer: { id: 'u001', name: 'คุณวิภาวดี', email: 'vipavadee@example.com', avatar: '👩', role: 'customer', verified: true },
  provider: { id: 'u002', name: 'คุณสมชาย', email: 'somchai@example.com', avatar: '⭐', role: 'provider', verified: true },
  admin:    { id: 'u003', name: 'คุณสมศักดิ์', email: 'somsak@example.com', avatar: '🏘️', role: 'admin', verified: true },
}

function SignInPageInner() {
  const [selectedRole, setSelectedRole] = useState<Role>('customer')
  const [authMode, setAuthMode] = useState<'google' | 'email'>('google')
  const [emailForm, setEmailForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const emailLogin = useEmailLogin()

  function getDestination(role: string) {
    const safeRedirect = sanitizeRedirect(redirectTo)
    if (safeRedirect !== '/dashboard') return safeRedirect
    if (role === 'provider') return '/dashboard/provider'
    if (role === 'admin' || role === 'community_admin') return '/dashboard/admin'
    if (role === 'superadmin') return '/dashboard/superadmin'
    return '/dashboard'
  }

  function handleGoogleLogin() {
    const safeRedirect = sanitizeRedirect(redirectTo)
    const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(safeRedirect)}`
    window.location.href = `${API_URL}/auth/google?state=${encodeURIComponent(callbackUrl)}`
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!emailForm.email || !emailForm.password) {
      setEmailError('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }
    setEmailError('')
    try {
      await emailLogin.mutateAsync({ email: emailForm.email, password: emailForm.password })
      const role = useAuthStore.getState().user?.role ?? 'customer'
      router.push(getDestination(role))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setEmailError(msg ?? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
  }

  function handleMockLogin() {
    setLoading(true)
    setTimeout(() => {
      login(MOCK_USERS[selectedRole])
      router.push(getDestination(selectedRole))
    }, 800)
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-md mx-auto px-4 sm:px-6 pt-14 pb-20">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-4 py-1.5 text-sm font-bold text-green-700 dark:text-green-400 mb-5">
            🎉 สมัครฟรี — ไม่มีค่าใช้จ่าย
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">ยินดีต้อนรับ</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            เลือกบทบาทของคุณ แล้วเข้าสู่ระบบด้วย Google ได้เลย
          </p>
        </motion.div>

        {/* Role selector */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="space-y-2.5 mb-6">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">คุณคือ...</p>
          {ROLES.map((role) => (
            <motion.button key={role.id} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                selectedRole === role.id
                  ? `${role.border} ${role.bg} shadow-sm`
                  : 'glass hover:border-white/50'
              }`}>
              <span className="text-2xl flex-shrink-0">{role.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm ${selectedRole === role.id ? role.color : 'text-slate-700 dark:text-slate-200'}`}>
                  {role.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{role.desc}</div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                selectedRole === role.id ? `${role.border} bg-current` : 'border-slate-300 dark:border-slate-600'
              }`} />
            </motion.button>
          ))}
        </motion.div>

        {/* Sign-in card */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="glass-card rounded-3xl p-6 space-y-4">

          {/* Auth mode tabs */}
          <div className="flex rounded-xl glass p-1 gap-1">
            <button onClick={() => setAuthMode('google')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                authMode === 'google' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill={authMode === 'google' ? 'white' : '#4285F4'} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill={authMode === 'google' ? 'white' : '#34A853'} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill={authMode === 'google' ? 'white' : '#FBBC05'} d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill={authMode === 'google' ? 'white' : '#EA4335'} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button onClick={() => setAuthMode('email')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                authMode === 'email' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}>
              <Mail className="h-4 w-4" /> อีเมล
            </button>
          </div>

          {/* Google mode */}
          {authMode === 'google' && (
            <>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 rounded-xl glass border-2 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-white/30 hover:shadow-md transition-all">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                เข้าสู่ระบบด้วย Google
              </motion.button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-xs text-slate-400">หรือ</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleMockLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-60">
                {selectedRole === 'customer' ? '🛍️' : selectedRole === 'provider' ? '⭐' : '🏘️'} เข้าสู่ระบบ Demo
                <span className="text-xs opacity-60">(ทดลองใช้)</span>
              </motion.button>
            </>
          )}

          {/* Email mode */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              {emailError && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-4 py-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">อีเมล</label>
                <input type="email" value={emailForm.email}
                  onChange={e => setEmailForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/20 focus:border-primary/50 px-4 py-3 text-sm glass text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">รหัสผ่าน</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={emailForm.password}
                    onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="รหัสผ่านของคุณ"
                    className="w-full rounded-xl border border-white/20 focus:border-primary/50 px-4 py-3 pr-11 text-sm glass text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <motion.button type="submit" disabled={emailLogin.isPending}
                whileHover={emailLogin.isPending ? {} : { scale: 1.02, y: -1 }}
                whileTap={emailLogin.isPending ? {} : { scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 hover:bg-primary/90 transition-colors disabled:opacity-60">
                {emailLogin.isPending ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <>เข้าสู่ระบบ <ArrowRight className="h-4 w-4" /></>
                )}
              </motion.button>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                ยังไม่มีบัญชี?{' '}
                <Link href="/auth/signup" className="font-bold text-primary hover:underline">สมัครสมาชิก</Link>
              </p>
            </form>
          )}

          <p className="text-center text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            การสมัครถือว่ายอมรับ{' '}
            <a href="/terms" className="underline hover:text-blue-600">ข้อกำหนด</a>
            {' '}และ{' '}
            <a href="/privacy" className="underline hover:text-blue-600">นโยบายความเป็นส่วนตัว</a>
          </p>
        </motion.div>

        {/* Trust signals */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '🔒', label: 'OAuth 2.0 Secure' },
            { icon: '🛡️', label: 'ไม่เก็บรหัสผ่าน' },
            { icon: '✅', label: 'Google Verified' },
          ].map((t) => (
            <div key={t.label} className="glass-sm p-3 rounded-xl">
              <div className="text-xl mb-1">{t.icon}</div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{t.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Browse without signin */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
          className="mt-5 text-center">
          <a href="/communities"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            ดูตลาดชุมชนก่อนสมัครก็ได้ →
          </a>
        </motion.div>
      </section>
    </main>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInPageInner />
    </Suspense>
  )
}
