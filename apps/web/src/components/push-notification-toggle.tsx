'use client'
import { usePushSubscription } from '@/hooks/usePush'

export function PushNotificationToggle() {
  const { permission, isSubscribing, subscribe } = usePushSubscription()

  if (permission === 'unsupported') return null

  return (
    <div className="glass-sm rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-700">🔔 การแจ้งเตือน Push</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {permission === 'granted'
            ? 'เปิดใช้งานแล้ว'
            : permission === 'denied'
              ? 'ถูกบล็อก — เปิดใน Browser Settings'
              : 'รับการแจ้งเตือนออเดอร์และข้อความ'}
        </p>
      </div>
      {permission === 'default' && (
        <button
          onClick={subscribe}
          disabled={isSubscribing}
          className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium disabled:opacity-50"
        >
          {isSubscribing ? 'กำลังเปิด...' : 'เปิดใช้งาน'}
        </button>
      )}
      {permission === 'granted' && (
        <span className="text-xs text-emerald-600 font-medium">✅ เปิดแล้ว</span>
      )}
      {permission === 'denied' && (
        <span className="text-xs text-red-500">🚫 ถูกบล็อก</span>
      )}
    </div>
  )
}
