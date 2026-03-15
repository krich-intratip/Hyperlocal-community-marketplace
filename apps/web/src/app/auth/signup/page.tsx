'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { ArrowRight, Eye, EyeOff, CheckCircle, ChevronLeft } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRegister } from '@/hooks/useAuthMutations'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

type Role = 'customer' | 'provider' | 'admin'
type Step = 'role' | 'form' | 'done'

const ROLES: { id: Role; emoji: string; label: string; desc: string; color: string; border: string; bg: string; ctaColor: string }[] = [
  {
    id: 'customer', emoji: '🛍️',
    label: 'ลูกค้า', desc: 'หาบริการในชุมชนใกล้บ้าน — สมัครฟรีตลอดกาล',
    color: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    ctaColor: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/30',
  },
  {
    id: 'provider', emoji: '⭐',
    label: 'ผู้ให้บริการ', desc: 'รับงาน สร้างรายได้จากทักษะในชุมชน',
    color: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    ctaColor: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200 dark:shadow-amber-900/30',
  },
  {
    id: 'admin', emoji: '🏘️',
    label: 'ผู้จัดการตลาด', desc: 'เปิดตลาดชุมชนของคุณเอง รับ Revenue Share 10%',
    color: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
    ctaColor: 'bg-green-600 hover:bg-green-700 shadow-green-200 dark:shadow-green-900/30',
  },
]

const BENEFITS: Record<Role, string[]> = {
  customer: ['ค้นหาบริการในรัศมีที่กำหนดได้', 'จองออนไลน์ 24/7', 'ดูรีวิวจากคนในชุมชน', 'ไม่มีค่าสมาชิก'],
  provider: ['สร้าง Listing ได้ไม่จำกัด', 'ระบบจัดการออเดอร์', 'ถอนเงินรายสัปดาห์', 'Trust Score สร้างความน่าเชื่อถือ'],
  admin: ['Revenue Share 10% จากทุก Booking', 'จัดการ Provider เอง', 'Dashboard วิเคราะห์ตลาด', 'สิทธิ์ประกาศชุมชน'],
}

const STEPS: { key: Step; label: string }[] = [
  { key: 'role', label: 'บทบาท' },
  { key: 'form', label: 'ข้อมูล' },
  { key: 'done', label: 'เสร็จ' },
]
const STEP_IDX: Record<Step, number> = { role: 0, form: 1, done: 2 }

function SignUpPageInner() {
  const [step, setStep] = useState<Step>('role')
  const [selectedRole, setSelectedRole] = useState<Role>('customer')
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [errors, setErrors] = useState<Partial<typeof form & { api: string }>>({})
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')

  const refCode = searchParams.get('ref') ?? ''

  const register = useRegister()
  const role = ROLES.find(r => r.id === selectedRole)!

  function validate() {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'กรุณากรอกชื่อ'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'อีเมลไม่ถูกต้อง'
    if (form.password.length < 8) e.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setErrors({})

    try {
      await register.mutateAsync({
        email: form.email,
        password: form.password,
        displayName: form.name,
        role: selectedRole,
        phone: form.phone || undefined,
        ...(refCode ? { referralCode: refCode } : {}),
      })
      setStep('done')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErrors({ api: msg ?? 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่' })
    }
  }

  function handleGoogleSignup() {
    const dest = redirectTo ?? (selectedRole === 'provider' ? '/dashboard/provider' : selectedRole === 'admin' ? '/franchise/apply' : '/marketplace')
    const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(dest)}`
    window.location.href = `${API_URL}/auth/google?state=${encodeURIComponent(callbackUrl)}`
  }

  useEffect(() => {
    if (step !== 'done') return
    const dest = redirectTo ?? (selectedRole === 'provider' ? '/dashboard/provider' : selectedRole === 'admin' ? '/franchise/apply' : '/marketplace')
    const t = setTimeout(() => { router.push(dest) }, 2500)
    return () => clearTimeout(t)
  }, [step, selectedRole, router, redirectTo])

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-md mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* Step indicator */}
        {step !== 'done' && (
          <div className="flex items-center justify-center gap-0 mb-8">
            {STEPS.filter(s => s.key !== 'done').map((s, i, arr) => {
              const active = STEP_IDX[step] === i
              const done = STEP_IDX[step] > i
              return (
                <div key={s.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all ${
                      done ? 'bg-primary border-primary text-white'
                      : active ? 'glass border-primary text-primary shadow-md'
                      : 'glass border-white/20 text-slate-300'
                    }`}>
                      {done ? <CheckCircle className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1 font-bold ${
                      active ? 'text-primary' : done ? 'text-primary/60' : 'text-slate-300'
                    }`}>{s.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`w-12 h-0.5 mx-1 mb-4 transition-all ${
                      STEP_IDX[step] > i ? 'bg-primary' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── Step: role ── */}
        {step === 'role' && (
          <>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-4 py-1.5 text-sm font-bold text-green-700 dark:text-green-400 mb-5">
                🎉 สมัครฟรี — ไม่มีค่าใช้จ่าย
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">สมัครสมาชิก</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">เลือกบทบาทของคุณเพื่อเริ่มต้น</p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="space-y-3 mb-6">
              {ROLES.map((r) => (
                <motion.button key={r.id} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                  onClick={() => setSelectedRole(r.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedRole === r.id
                      ? `${r.border} ${r.bg} shadow-sm`
                      : 'glass hover:border-white/50'
                  }`}>
                  <span className="text-2xl flex-shrink-0">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm ${selectedRole === r.id ? r.color : 'text-slate-700 dark:text-slate-200'}`}>{r.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{r.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                    selectedRole === r.id ? `${r.border} bg-current` : 'border-slate-300 dark:border-slate-600'
                  }`} />
                </motion.button>
              ))}
            </motion.div>

            {/* Benefits */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="glass rounded-2xl p-4 mb-5">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">สิทธิ์ที่ได้รับ</p>
              <ul className="space-y-1.5">
                {BENEFITS[selectedRole].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="space-y-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setStep('form')}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-white shadow-lg transition-colors ${role.ctaColor}`}>
                {role.emoji} สมัครเป็น{role.label} <ArrowRight className="h-4 w-4" />
              </motion.button>

              {/* Google OAuth — real */}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 rounded-xl glass border-2 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white/30 hover:shadow-md transition-all">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                สมัครด้วย Google (เร็วกว่า)
              </motion.button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                มีบัญชีแล้ว?{' '}
                <Link href="/auth/signin" className="font-bold text-primary hover:underline">เข้าสู่ระบบ</Link>
              </p>
            </motion.div>
          </>
        )}

        {/* ── Step: form ── */}
        {step === 'form' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <motion.button variants={fadeUp} initial="hidden" animate="show" custom={0}
                onClick={() => setStep('role')}
                className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-primary">
                <ChevronLeft className="h-4 w-4" /> เปลี่ยนบทบาท
              </motion.button>
              <Link href="/auth/signin" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary">
                มีบัญชีแล้ว? เข้าสู่ระบบ
              </Link>
            </div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="text-center mb-6">
              <span className="text-3xl">{role.emoji}</span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 mb-1">สมัครเป็น{role.label}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">กรอกข้อมูลเพื่อสร้างบัญชี</p>
            </motion.div>

            <motion.form variants={fadeUp} initial="hidden" animate="show" custom={2}
              onSubmit={handleSubmit}
              className="glass-card rounded-3xl p-6 space-y-4">

              {/* Referral banner */}
              {refCode && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 px-4 py-3 flex items-center gap-2">
                  <span className="text-lg">🎁</span>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                    คุณถูกชวนโดยเพื่อน — สมัครแล้วเพื่อนจะได้รับแต้มโบนัส!
                  </p>
                </div>
              )}

              {/* API error */}
              {errors.api && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-4 py-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.api}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="เช่น สมใจ ใจดี"
                  className={`w-full rounded-xl border px-4 py-3 text-sm glass text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all ${
                    errors.name ? 'border-red-400 focus:border-red-500' : 'border-white/20 focus:border-primary/50'
                  }`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm glass text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-white/20 focus:border-primary/50'
                  }`} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  รหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all ${
                      errors.password ? 'border-red-400 focus:border-red-500' : 'border-white/20 focus:border-primary/50'
                    }`} />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Phone (optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  เบอร์โทรศัพท์ <span className="text-slate-400 font-normal">(ไม่บังคับ)</span>
                </label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="08X-XXX-XXXX"
                  className="w-full rounded-xl border border-white/20 focus:border-primary/50 px-4 py-3 text-sm glass text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={register.isPending}
                whileHover={register.isPending ? {} : { scale: 1.02 }} whileTap={register.isPending ? {} : { scale: 0.97 }}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all ${role.ctaColor} disabled:opacity-60 disabled:cursor-not-allowed`}>
                {register.isPending ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <>{role.emoji} สร้างบัญชี <ArrowRight className="h-4 w-4" /></>
                )}
              </motion.button>

              <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                การสมัครถือว่ายอมรับ{' '}
                <a href="/terms" className="underline hover:text-blue-600">ข้อกำหนด</a>
                {' '}และ{' '}
                <a href="/privacy" className="underline hover:text-blue-600">นโยบายความเป็นส่วนตัว</a>
              </p>
            </motion.form>
          </>
        )}

        {/* ── Step: done ── */}
        {step === 'done' && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="text-center py-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">สมัครสำเร็จ!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
              ยินดีต้อนรับ <span className="font-bold text-slate-700 dark:text-slate-200">{form.name}</span> สู่ Community Hyper
            </p>
            {selectedRole === 'provider' && (
              <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5">
                ⭐ รอ Community Admin อนุมัติ Profile ของคุณ จะแจ้งผลทางอีเมลภายใน 24 ชั่วโมง
              </p>
            )}
            {selectedRole === 'admin' && (
              <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-3 mb-5">
                🏘️ กรอกใบสมัครเปิดตลาดชุมชนเพื่อรับสิทธิ์ Community Admin
              </p>
            )}
            <div className="flex flex-col gap-3 mt-6">
              {selectedRole === 'customer' && (
                <Link href="/marketplace"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white hover:bg-blue-700 transition-colors">
                  🛍️ ไปที่ Marketplace <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {selectedRole === 'provider' && (
                <Link href="/dashboard/provider"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-bold text-white hover:bg-amber-600 transition-colors">
                  ⭐ ไปที่ Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {selectedRole === 'admin' && (
                <Link href="/franchise/apply"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-base font-bold text-white hover:bg-green-700 transition-colors">
                  🏘️ กรอกใบสมัครเปิดตลาด <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </section>
    </main>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpPageInner />
    </Suspense>
  )
}
