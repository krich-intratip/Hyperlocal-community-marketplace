'use client'
import { MarketBackground } from '@/components/market-background'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useAdminReports, useReportStats, useResolveReport } from '@/hooks/useReport'
import { useState } from 'react'
import type { ReportStatus, ReportType } from '@/lib/api'

const STATUS_COLORS: Record<ReportStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  REVIEWED: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  DISMISSED: 'bg-slate-100 text-slate-500',
}

const TYPE_ICONS: Record<ReportType, string> = {
  LISTING: '📋',
  PROVIDER: '🏪',
  REVIEW: '⭐',
  MESSAGE: '💬',
}

const REASON_LABELS: Record<string, string> = {
  SPAM: '📢 สแปม',
  INAPPROPRIATE: '🔞 ไม่เหมาะสม',
  FAKE: '🎭 เท็จ',
  SCAM: '💸 หลอกลวง',
  HARASSMENT: '😡 คุกคาม',
  OTHER: '❓ อื่นๆ',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminReportsPage() {
  useAuthGuard(['superadmin'])
  const [filterStatus, setFilterStatus] = useState<ReportStatus | undefined>(undefined)
  const [filterType, setFilterType] = useState<ReportType | undefined>(undefined)
  const [resolveModal, setResolveModal] = useState<{ id: string; action: 'RESOLVED' | 'DISMISSED' } | null>(null)
  const [adminNote, setAdminNote] = useState('')

  const { data: reports = [], isLoading } = useAdminReports(filterStatus, filterType)
  const { data: stats } = useReportStats()
  const resolveMutation = useResolveReport()

  const handleResolve = () => {
    if (!resolveModal) return
    resolveMutation.mutate(
      { id: resolveModal.id, status: resolveModal.action, adminNote: adminNote.trim() || undefined },
      { onSuccess: () => { setResolveModal(null); setAdminNote('') } },
    )
  }

  return (
    <div className="min-h-screen relative">
      <MarketBackground />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">🚩 จัดการรายงาน</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'รอตรวจสอบ', value: stats?.pending ?? 0, icon: '⏳', color: 'text-amber-600' },
            { label: 'แก้ไขแล้ว', value: stats?.resolved ?? 0, icon: '✅', color: 'text-emerald-600' },
            { label: 'ยกเลิก', value: stats?.dismissed ?? 0, icon: '🚫', color: 'text-slate-500' },
            { label: 'ทั้งหมด', value: stats?.total ?? 0, icon: '📊', color: 'text-primary' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex gap-1.5">
            {([undefined, 'PENDING', 'RESOLVED', 'DISMISSED'] as const).map(s => (
              <button
                key={s ?? 'all'}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterStatus === s ? 'bg-primary text-white' : 'glass-sm text-slate-600 hover:bg-white'
                }`}
              >
                {s ?? 'ทั้งหมด'}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {([undefined, 'LISTING', 'PROVIDER', 'REVIEW'] as const).map(t => (
              <button
                key={t ?? 'all-type'}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterType === t ? 'bg-violet-500 text-white' : 'glass-sm text-slate-600 hover:bg-white'
                }`}
              >
                {t ? `${TYPE_ICONS[t]} ${t}` : '🔍 ทุกประเภท'}
              </button>
            ))}
          </div>
        </div>

        {/* Reports list */}
        {isLoading ? (
          <div className="text-center text-slate-400 py-12">กำลังโหลด...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-slate-500">ไม่มีรายงานในขณะนี้</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(report => (
              <div key={report.id} className="glass-card rounded-xl p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="text-2xl">{TYPE_ICONS[report.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[report.status]}`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-slate-500">{report.type}</span>
                      <span className="text-xs text-slate-400">· {formatDate(report.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium">{REASON_LABELS[report.reason]}</p>
                    {report.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{report.description}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1 font-mono">Target: {report.targetId.slice(0, 12)}...</p>
                    {report.adminNote && (
                      <p className="text-xs text-emerald-600 mt-1">📝 {report.adminNote}</p>
                    )}
                  </div>
                  {report.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setResolveModal({ id: report.id, action: 'RESOLVED' })}
                        className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium"
                      >
                        ✅ แก้ไข
                      </button>
                      <button
                        onClick={() => setResolveModal({ id: report.id, action: 'DISMISSED' })}
                        className="px-3 py-1.5 glass-sm text-slate-500 rounded-lg text-xs"
                      >
                        🚫 ยกเลิก
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resolve Modal */}
        {resolveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="glass-card rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="font-bold text-slate-800 mb-4">
                {resolveModal.action === 'RESOLVED' ? '✅ ยืนยันการแก้ไข' : '🚫 ยืนยันการยกเลิก'}
              </h3>
              <textarea
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder="หมายเหตุ (ไม่จำเป็น)"
                rows={3}
                className="w-full px-3 py-2 glass-sm rounded-lg text-sm border border-white/30 focus:outline-none resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleResolve}
                  disabled={resolveMutation.isPending}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 ${
                    resolveModal.action === 'RESOLVED' ? 'bg-emerald-500' : 'bg-slate-500'
                  }`}
                >
                  {resolveMutation.isPending ? 'กำลังบันทึก...' : 'ยืนยัน'}
                </button>
                <button
                  onClick={() => setResolveModal(null)}
                  className="flex-1 py-2 glass-sm rounded-xl text-sm text-slate-600"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
