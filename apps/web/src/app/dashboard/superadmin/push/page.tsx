'use client'
import { MarketBackground } from '@/components/market-background'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { usePushStats, useAdminSendPush } from '@/hooks/usePush'
import { useState } from 'react'

export default function AdminPushPage() {
  useAuthGuard(['superadmin'])
  const { data: stats } = usePushStats()
  const sendMutation = useAdminSendPush()
  const [form, setForm] = useState({ title: '', body: '', url: '' })
  const [sent, setSent] = useState<{ sent: number; failed: number } | null>(null)

  const handleSend = () => {
    sendMutation.mutate(
      { title: form.title, body: form.body, url: form.url || undefined },
      {
        onSuccess: result => {
          setSent(result)
          setForm({ title: '', body: '', url: '' })
        },
      },
    )
  }

  return (
    <div className="min-h-screen relative">
      <MarketBackground />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">🔔 Push Notifications</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-primary">{stats?.active ?? 0}</div>
            <div className="text-sm text-slate-500 mt-1">Active Subscribers</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-slate-600">{stats?.total ?? 0}</div>
            <div className="text-sm text-slate-500 mt-1">Total Registered</div>
          </div>
        </div>

        {/* Send notification form */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-slate-700 mb-4">📤 ส่ง Broadcast Notification</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">หัวข้อ *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                maxLength={100}
                placeholder="เช่น: ออเดอร์ใหม่เข้ามาแล้ว!"
                className="w-full px-3 py-2 glass-sm rounded-lg text-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">ข้อความ *</label>
              <textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                maxLength={300}
                rows={3}
                placeholder="รายละเอียดการแจ้งเตือน..."
                className="w-full px-3 py-2 glass-sm rounded-lg text-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                URL เมื่อคลิก (ไม่จำเป็น)
              </label>
              <input
                type="url"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3 py-2 glass-sm rounded-lg text-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!form.title || !form.body || sendMutation.isPending}
              className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {sendMutation.isPending ? 'กำลังส่ง...' : '📤 ส่ง Broadcast'}
            </button>
          </div>

          {sent && (
            <div className="mt-4 p-3 glass-sm rounded-xl text-sm text-emerald-700">
              ✅ ส่งสำเร็จ {sent.sent} ราย{' '}
              {sent.failed > 0 ? `(ล้มเหลว ${sent.failed} ราย)` : ''}
            </div>
          )}
        </div>

        {/* Info note */}
        <div className="glass-sm rounded-xl p-4 text-xs text-slate-500">
          <p className="font-medium text-slate-600 mb-1">📝 หมายเหตุ</p>
          <p>
            ระบบ Push Notification ใช้ Web Push API (VAPID). ต้องกำหนด VAPID keys
            ในการ production เพื่อส่งแจ้งเตือนจริง ปัจจุบันอยู่ในโหมด simulation.
          </p>
        </div>
      </div>
    </div>
  )
}
