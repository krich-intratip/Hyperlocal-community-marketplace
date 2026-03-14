'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import {
  Users, Search, ChevronLeft, Shield, ShieldOff,
  CheckCircle, XCircle, RefreshCw, Filter, Crown,
} from 'lucide-react'
import Link from 'next/link'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useAdminUsers, useSetUserStatus, useSetUserRole } from '@/hooks/useAdmin'
import type { AdminUser } from '@/lib/api'
import { formatDateMedTH } from '@/lib/date-utils'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.04 } }),
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin', COMMUNITY_ADMIN: 'Community Admin',
  PROVIDER: 'Provider', CUSTOMER: 'ลูกค้า',
}
const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-violet-100 text-violet-700',
  COMMUNITY_ADMIN: 'bg-blue-100 text-blue-700',
  PROVIDER: 'bg-amber-100 text-amber-700',
  CUSTOMER: 'bg-slate-100 text-slate-600',
}
const ROLES = ['SUPER_ADMIN', 'COMMUNITY_ADMIN', 'PROVIDER', 'CUSTOMER']

export default function AdminUsersPage() {
  useAuthGuard(['superadmin'])

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    user: AdminUser; action: 'suspend' | 'activate' | 'role'; newRole?: string
  } | null>(null)

  const { data, isLoading, refetch } = useAdminUsers({
    search: search || undefined,
    role: roleFilter || undefined,
    isActive: activeFilter || undefined,
    page, limit: 20,
  })

  const setStatus = useSetUserStatus()
  const setRole   = useSetUserRole()

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function handleConfirm() {
    if (!confirmModal) return
    const { user, action, newRole } = confirmModal
    setConfirmModal(null)
    try {
      if (action === 'suspend' || action === 'activate') {
        await setStatus.mutateAsync({ userId: user.id, isActive: action === 'activate' })
        showToast(action === 'activate' ? `เปิดใช้งาน ${user.displayName} แล้ว` : `ระงับ ${user.displayName} แล้ว`)
      } else if (action === 'role' && newRole) {
        await setRole.mutateAsync({ userId: user.id, role: newRole })
        showToast(`เปลี่ยน role ${user.displayName} เป็น ${ROLE_LABELS[newRole]} แล้ว`)
      }
    } catch {
      showToast('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  const users = data?.users ?? []

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-bold">
            <CheckCircle className="h-4 w-4 text-green-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-heavy rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                confirmModal.action === 'suspend' ? 'bg-red-50' : 'bg-green-50'
              }`}>
                {confirmModal.action === 'suspend'
                  ? <ShieldOff className="h-7 w-7 text-red-500" />
                  : confirmModal.action === 'activate'
                  ? <Shield className="h-7 w-7 text-green-600" />
                  : <Crown className="h-7 w-7 text-violet-600" />}
              </div>
              <h3 className="font-extrabold text-slate-900 mb-1">
                {confirmModal.action === 'suspend' ? `ระงับ ${confirmModal.user.displayName}?`
                  : confirmModal.action === 'activate' ? `เปิดใช้งาน ${confirmModal.user.displayName}?`
                  : `เปลี่ยน Role เป็น ${ROLE_LABELS[confirmModal.newRole ?? '']}?`}
              </h3>
              <p className="text-sm text-slate-500 mb-5">{confirmModal.user.email}</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600">
                  ยกเลิก
                </button>
                <button onClick={handleConfirm}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white ${
                    confirmModal.action === 'suspend' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
                  }`}>
                  ยืนยัน
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/dashboard/superadmin" className="hover:text-primary flex items-center gap-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Super Admin
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">จัดการผู้ใช้</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" /> จัดการผู้ใช้งาน
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {data?.total ?? 0} ผู้ใช้ทั้งหมด
              </p>
            </div>
            <button onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/20 text-sm font-bold text-slate-600 hover:text-primary transition-colors">
              <RefreshCw className="h-4 w-4" /> รีเฟรช
            </button>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-2xl p-4 mb-5 flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="ค้นหา ชื่อ หรือ อีเมล..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary/30"
              />
            </div>
            {/* Role filter */}
            <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary/30">
              <option value="">ทุก Role</option>
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
            {/* Status filter */}
            <select value={activeFilter} onChange={e => { setActiveFilter(e.target.value); setPage(1) }}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary/30">
              <option value="">ทุกสถานะ</option>
              <option value="true">ใช้งานอยู่</option>
              <option value="false">ถูกระงับ</option>
            </select>
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 opacity-40" />
                กำลังโหลด...
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Filter className="h-10 w-10 mx-auto mb-3 opacity-30" />
                ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left">
                      <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">ผู้ใช้</th>
                      <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">Role</th>
                      <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">สถานะ</th>
                      <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">วันสมัคร</th>
                      <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <motion.tr key={user.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet-100 flex items-center justify-center text-sm font-extrabold text-primary flex-shrink-0">
                              {user.displayName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{user.displayName}</p>
                              <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <select
                            value={user.role}
                            onChange={e => setConfirmModal({ user, action: 'role', newRole: e.target.value })}
                            className={`text-xs font-bold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${ROLE_COLORS[user.role] ?? 'bg-slate-100 text-slate-600'}`}>
                            {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                          </select>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                            user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {user.isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {user.isActive ? 'ใช้งานอยู่' : 'ถูกระงับ'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-400">
                          {formatDateMedTH(user.createdAt)}
                        </td>
                        <td className="px-5 py-3.5">
                          {user.isActive ? (
                            <button
                              onClick={() => setConfirmModal({ user, action: 'suspend' })}
                              className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                              <ShieldOff className="h-3.5 w-3.5" /> ระงับ
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmModal({ user, action: 'activate' })}
                              className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-800 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
                              <Shield className="h-3.5 w-3.5" /> เปิดใช้งาน
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {(data?.pages ?? 0) > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  หน้า {data?.page} / {data?.pages} (ทั้งหมด {data?.total} คน)
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold glass-sm disabled:opacity-40">
                    ก่อนหน้า
                  </button>
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= (data?.pages ?? 1)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold glass-sm disabled:opacity-40">
                    ถัดไป
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <AppFooter />
      </main>
    </>
  )
}
