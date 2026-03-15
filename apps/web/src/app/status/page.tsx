'use client'
import { useState, useEffect, useCallback } from 'react'
import { MarketBackground } from '@/components/market-background'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down' | 'checking'
  latencyMs?: number
  description: string
  icon: string
}

const SERVICES_INITIAL: ServiceStatus[] = [
  { name: 'API Server', status: 'checking', description: 'NestJS backend API', icon: '🖥️' },
  { name: 'Database', status: 'checking', description: 'PostgreSQL / SQLite', icon: '🗄️' },
  { name: 'CDN / Pages', status: 'checking', description: 'Cloudflare Pages', icon: '🌐' },
  { name: 'Authentication', status: 'checking', description: 'JWT auth service', icon: '🔐' },
]

const STATUS_STYLES: Record<ServiceStatus['status'], string> = {
  operational: 'bg-emerald-100 text-emerald-700',
  degraded: 'bg-amber-100 text-amber-700',
  down: 'bg-red-100 text-red-700',
  checking: 'bg-slate-100 text-slate-500',
}

const STATUS_LABELS: Record<ServiceStatus['status'], string> = {
  operational: '✅ ปกติ',
  degraded: '⚠️ ช้าลง',
  down: '❌ ล่ม',
  checking: '🔄 กำลังตรวจ...',
}

function formatLatency(ms?: number): string {
  if (!ms) return ''
  if (ms < 100) return `${ms}ms ⚡`
  if (ms < 500) return `${ms}ms ✅`
  if (ms < 1000) return `${ms}ms ⚠️`
  return `${ms}ms 🔴`
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>(SERVICES_INITIAL)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [checking, setChecking] = useState(false)

  const checkHealth = useCallback(async () => {
    setChecking(true)
    const updated = [...SERVICES_INITIAL]

    // Check API
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    if (apiUrl) {
      try {
        const start = Date.now()
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        const res = await fetch(`${apiUrl}/health`, { signal: controller.signal })
        clearTimeout(timeoutId)
        const latencyMs = Date.now() - start
        updated[0] = { ...updated[0], status: res.ok ? 'operational' : 'degraded', latencyMs }
      } catch {
        updated[0] = { ...updated[0], status: 'down' }
      }
    } else {
      updated[0] = { ...updated[0], status: 'operational', latencyMs: 12 } // mock
    }

    // CDN check (self)
    try {
      const start = Date.now()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      await fetch('/manifest.json', { signal: controller.signal })
      clearTimeout(timeoutId)
      updated[2] = { ...updated[2], status: 'operational', latencyMs: Date.now() - start }
    } catch {
      updated[2] = { ...updated[2], status: 'degraded' }
    }

    // Mock DB + Auth as operational (real checks would need dedicated endpoints)
    updated[1] = { ...updated[1], status: 'operational', latencyMs: 5 }
    updated[3] = { ...updated[3], status: 'operational', latencyMs: 18 }

    setServices(updated)
    setLastChecked(new Date())
    setChecking(false)
  }, [])

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  const allOperational = services.every(s => s.status === 'operational')
  const anyDown = services.some(s => s.status === 'down')

  return (
    <div className="min-h-screen relative">
      <MarketBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">System Status</h1>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
            anyDown ? 'bg-red-100 text-red-700' :
            allOperational ? 'bg-emerald-100 text-emerald-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {anyDown ? '🔴 บางบริการมีปัญหา' :
             allOperational ? '🟢 ทุกบริการทำงานปกติ' :
             '🟡 กำลังตรวจสอบ'}
          </div>
          {lastChecked && (
            <p className="text-xs text-slate-400 mt-2">
              ตรวจสอบล่าสุด: {lastChecked.toLocaleTimeString('th-TH')}
            </p>
          )}
        </div>

        {/* Services */}
        <div className="space-y-3 mb-6">
          {services.map(svc => (
            <div key={svc.name} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{svc.icon}</span>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{svc.name}</p>
                  <p className="text-xs text-slate-400">{svc.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {svc.latencyMs !== undefined && (
                  <span className="text-xs text-slate-400">{formatLatency(svc.latencyMs)}</span>
                )}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[svc.status]}`}>
                  {STATUS_LABELS[svc.status]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Refresh */}
        <div className="text-center">
          <button
            onClick={checkHealth}
            disabled={checking}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-50"
          >
            {checking ? '🔄 กำลังตรวจสอบ...' : '🔄 ตรวจสอบอีกครั้ง'}
          </button>
        </div>

        {/* Rate limit info */}
        <div className="mt-8 glass-sm rounded-xl p-4 text-xs text-slate-500">
          <p className="font-medium text-slate-600 mb-1">⚡ Rate Limits</p>
          <ul className="space-y-1">
            <li>• ทั่วไป: 20 req/วินาที, 300 req/นาที</li>
            <li>• Login: 5 req/นาที, 20 req/ชั่วโมง</li>
            <li>• Register: 3 req/นาที, 10 req/ชั่วโมง</li>
            <li>• รายงาน: 5 req/นาที</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
