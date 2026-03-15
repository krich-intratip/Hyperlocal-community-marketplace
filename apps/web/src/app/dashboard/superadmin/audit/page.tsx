'use client'
import { MarketBackground } from '@/components/market-background'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useAuditLogs, useAuditStats } from '@/hooks/useAudit'
import { useState } from 'react'
import type { AuditAction } from '@/lib/api'

const ACTION_COLORS: Partial<Record<AuditAction, string>> = {
  LOGIN_SUCCESS: 'bg-emerald-100 text-emerald-700',
  LOGIN_FAILED: 'bg-red-100 text-red-700',
  ACCESS_DENIED: 'bg-red-100 text-red-700',
  REGISTER: 'bg-blue-100 text-blue-700',
  PROVIDER_APPROVED: 'bg-emerald-100 text-emerald-700',
  PROVIDER_REJECTED: 'bg-amber-100 text-amber-700',
  ORDER_STATUS_CHANGED: 'bg-violet-100 text-violet-700',
  LISTING_CREATED: 'bg-blue-100 text-blue-700',
  LISTING_DELETED: 'bg-red-100 text-red-700',
  SUBSCRIPTION_CHANGED: 'bg-amber-100 text-amber-700',
  SYSTEM_MODE_CHANGED: 'bg-orange-100 text-orange-700',
}

const ACTION_ICONS: Partial<Record<AuditAction, string>> = {
  LOGIN_SUCCESS: '✅',
  LOGIN_FAILED: '❌',
  ACCESS_DENIED: '🚫',
  REGISTER: '👤',
  LOGOUT: '👋',
  PROVIDER_APPROVED: '✅',
  PROVIDER_REJECTED: '❌',
  ORDER_STATUS_CHANGED: '📦',
  LISTING_CREATED: '📋',
  LISTING_DELETED: '🗑️',
  SUBSCRIPTION_CHANGED: '💳',
  REPORT_RESOLVED: '🚩',
  SYSTEM_MODE_CHANGED: '⚙️',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('th-TH', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

function parseMeta(meta: string | null): string {
  if (!meta) return ''
  try { return JSON.stringify(JSON.parse(meta), null, 1) } catch { return meta }
}

const FILTER_ACTIONS: { value: AuditAction | ''; label: string }[] = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'LOGIN_FAILED', label: '❌ Login ล้มเหลว' },
  { value: 'ACCESS_DENIED', label: '🚫 Access Denied' },
  { value: 'LOGIN_SUCCESS', label: '✅ Login สำเร็จ' },
  { value: 'PROVIDER_APPROVED', label: '✅ Provider Approved' },
  { value: 'ORDER_STATUS_CHANGED', label: '📦 Order Changed' },
  { value: 'SUBSCRIPTION_CHANGED', label: '💳 Subscription' },
]

export default function AuditLogPage() {
  useAuthGuard(['superadmin'])
  const [filterAction, setFilterAction] = useState<AuditAction | ''>('')
  const [filterSuccess, setFilterSuccess] = useState<boolean | undefined>(undefined)

  const { data: statsData } = useAuditStats()
  const { data, isLoading } = useAuditLogs({
    action: filterAction || undefined,
    success: filterSuccess,
    limit: 100,
  })

  const logs = data?.logs ?? []
  const total = data?.total ?? 0

  return (
    <div className="min-h-screen relative">
      <MarketBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">🔐 Audit Log</h1>
          <span className="text-xs text-slate-400">รีเฟรชทุก 30 วินาที</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-primary">{statsData?.total?.toLocaleString() ?? 0}</div>
            <div className="text-sm text-slate-500 mt-1">Event ทั้งหมด</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-500">{statsData?.failedLast24h ?? 0}</div>
            <div className="text-sm text-slate-500 mt-1">Failed Events (24h)</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-500">{statsData?.loginFailedLast24h ?? 0}</div>
            <div className="text-sm text-slate-500 mt-1">Login Failed (24h)</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Action filter */}
          <div className="flex flex-wrap gap-1.5">
            {FILTER_ACTIONS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilterAction(f.value as AuditAction | '')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterAction === f.value ? 'bg-primary text-white' : 'glass-sm text-slate-600 hover:bg-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* Success filter */}
          <div className="flex gap-1.5">
            {([undefined, true, false] as const).map(v => (
              <button
                key={String(v)}
                onClick={() => setFilterSuccess(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterSuccess === v ? 'bg-violet-500 text-white' : 'glass-sm text-slate-600 hover:bg-white'
                }`}
              >
                {v === undefined ? '🔍 ทั้งหมด' : v ? '✅ สำเร็จ' : '❌ ล้มเหลว'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-3">แสดง {logs.length} จากทั้งหมด {total} รายการ</p>

        {/* Log table */}
        {isLoading ? (
          <div className="text-center text-slate-400 py-12">กำลังโหลด...</div>
        ) : logs.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-slate-500">ไม่พบ audit log</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map(log => (
              <div
                key={log.id}
                className={`glass-card rounded-xl p-3 border-l-4 ${log.success ? 'border-l-emerald-400' : 'border-l-red-400'}`}
              >
                <div className="flex flex-wrap items-start gap-3">
                  {/* Action badge */}
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    ACTION_COLORS[log.action] ?? 'bg-slate-100 text-slate-600'
                  }`}>
                    {ACTION_ICONS[log.action] ?? '📝'} {log.action.replace(/_/g, ' ')}
                  </span>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      {log.userId && <span>👤 {log.userId.slice(0, 8)}...</span>}
                      {log.resource && <span>📁 {log.resource}{log.resourceId ? ` #${log.resourceId.slice(0, 8)}` : ''}</span>}
                      {log.ipAddress && <span>🌐 {log.ipAddress}</span>}
                      <span className="text-slate-400">{formatDate(log.createdAt)}</span>
                    </div>
                    {log.meta && (
                      <pre className="mt-1 text-xs text-slate-400 bg-slate-50/50 rounded px-2 py-1 overflow-x-auto max-w-full">
                        {parseMeta(log.meta)}
                      </pre>
                    )}
                    {log.userAgent && (
                      <p className="mt-0.5 text-xs text-slate-300 truncate">{log.userAgent}</p>
                    )}
                  </div>

                  {/* Success indicator */}
                  <span className={`text-xs font-medium flex-shrink-0 ${log.success ? 'text-emerald-500' : 'text-red-500'}`}>
                    {log.success ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
