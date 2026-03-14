'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { AppFooter } from '@/components/app-footer'
import {
  Store, ChevronLeft, RefreshCw, CheckCircle, XCircle,
  Clock, Filter, ShieldCheck, ShieldOff,
} from 'lucide-react'
import Link from 'next/link'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import {
  useAdminPendingProviders, useAdminAllProviders,
  useAdminApproveProvider, useAdminRejectProvider,
} from '@/hooks/useAdmin'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.04 } }),
}

const STATUS_COLORS: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-600',
}
const STATUS_LABELS: Record<string, string> = {
  APPROVED: 'อนุมัติแล้ว',
  PENDING: 'รออนุมัติ',
  REJECTED: 'ปฏิเสธ',
}

type TabKey = 'pending' | 'all'

export default function ProvidersMgmtPage() {
  useAuthGuard(['superadmin'])

  const [tab, setTab] = useState<TabKey>('pending')
  const [toast, setToast] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    id: string; name: string; action: 'approve' | 'reject'
  } | null>(null)

  const { data: pending, isLoading: pendingLoading, refetch: refetchPending } = useAdminPendingProviders()
  const { data: all, isLoading: allLoading, refetch: refetchAll } = useAdminAllProviders()
  const approve = useAdminApproveProvider()
  const reject = useAdminRejectProvider()

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function handleConfirm() {
    if (!confirmModal) return
    const { id, name, action } = confirmModal
    setConfirmModal(null)
    try {
      if (action === 'approve') {
        await approve.mutateAsync(id)
        showToast(`อนุมัติ ${name} แล้ว`)
      } else {
        await reject.mutateAsync(id)
        showToast(`ปฏิเสธ ${name} แล้ว`)
      }
    } catch {
      showToast('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  function refetch() {
    refetchPending()
    refetchAll()
  }

  const pendingList = (pending as { id: string; displayName: string; communityId: string; verificationStatus: string; createdAt: string }[]) ?? []
  const allList = (all as { id: string; displayName: string; communityId: string; verificationStatus: string; providerStatus: string }[]) ?? []
  const isLoading = tab === 'pending' ? pendingLoading : allLoading

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

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-heavy rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                confirmModal.action === 'approve' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                {confirmModal.action === 'approve'
                  ? <ShieldCheck className="h-7 w-7 text-green-600" />
                  : <ShieldOff className="h-7 w-7 text-red-500" />}
              </div>
              <h3 className="font-extrabold text-slate-900 mb-1">
                {confirmModal.action === 'approve' ? `อนุมัติ ${confirmModal.name}?` : `ปฏิเสธ ${confirmModal.name}?`}
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                {confirmModal.action === 'approve'
                  ? 'Provider นี้จะสามารถเปิดร้านและรับออเดอร์ได้ทันที'
                  : 'Provider นี้จะไม่สามารถเปิดร้านได้จนกว่าจะสมัครใหม่'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600">
                  ยกเลิก
                </button>
                <button onClick={handleConfirm}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white ${
                    confirmModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
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
            <span className="text-slate-700 font-medium">จัดการ Provider</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Store className="h-6 w-6 text-primary" /> จัดการ Provider
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                อนุมัติ / ปฏิเสธ / ดูรายชื่อ Provider ทั่วทั้งแพลตฟอร์ม
              </p>
            </div>
            <button onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/20 text-sm font-bold text-slate-600 hover:text-primary transition-colors">
              <RefreshCw className="h-4 w-4" /> รีเฟรช
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            {([
              { key: 'pending', label: 'รออนุมัติ', count: pendingList.length, icon: Clock, color: 'text-amber-600' },
              { key: 'all', label: 'ทั้งหมด', count: allList.length, icon: Filter, color: 'text-slate-600' },
            ] as { key: TabKey; label: string; count: number; icon: typeof Clock; color: string }[]).map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  tab === t.key ? 'bg-primary text-white' : 'glass border border-white/20 text-slate-600 hover:text-primary'
                }`}>
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.count > 0 && (
                  <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full ${
                    tab === t.key ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 opacity-40" />
                กำลังโหลด...
              </div>
            ) : tab === 'pending' ? (
              pendingList.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  ไม่มี Provider รออนุมัติ
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left">
                        <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">Provider</th>
                        <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">ชุมชน</th>
                        <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">วันสมัคร</th>
                        <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingList.map((p, i) => (
                        <motion.tr key={p.id}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-sm font-extrabold text-amber-600 flex-shrink-0">
                                {p.displayName.charAt(0)}
                              </div>
                              <p className="font-bold text-slate-800">{p.displayName}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-slate-500">ชุมชน #{p.communityId}</td>
                          <td className="px-5 py-3.5 text-xs text-slate-400">
                            {new Date(p.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setConfirmModal({ id: p.id, name: p.displayName, action: 'approve' })}
                                className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-800 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
                                <CheckCircle className="h-3.5 w-3.5" /> อนุมัติ
                              </button>
                              <button
                                onClick={() => setConfirmModal({ id: p.id, name: p.displayName, action: 'reject' })}
                                className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                <XCircle className="h-3.5 w-3.5" /> ปฏิเสธ
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              allList.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Filter className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  ไม่มีข้อมูล Provider
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left">
                        <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">Provider</th>
                        <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">ชุมชน</th>
                        <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">สถานะยืนยัน</th>
                        <th className="px-5 py-3 font-bold text-slate-500 text-xs uppercase tracking-wide">สถานะร้าน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allList.map((p, i) => (
                        <motion.tr key={p.id}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet-100 flex items-center justify-center text-sm font-extrabold text-primary flex-shrink-0">
                                {p.displayName.charAt(0)}
                              </div>
                              <p className="font-bold text-slate-800">{p.displayName}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-slate-500">ชุมชน #{p.communityId}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[p.verificationStatus] ?? 'bg-slate-100 text-slate-600'}`}>
                              {STATUS_LABELS[p.verificationStatus] ?? p.verificationStatus}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-500">{p.providerStatus ?? '-'}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </section>

        <AppFooter />
      </main>
    </>
  )
}
