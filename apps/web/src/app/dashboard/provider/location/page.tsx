'use client'
import { useState } from 'react'
import { geoApi } from '@/lib/api'
import { MapPin, Navigation, CheckCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ProviderLocationPage() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'saved' | 'denied' | 'error'>('idle')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  async function detectAndSave() {
    if (!navigator.geolocation) { setState('error'); return }
    setState('loading')
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords
        setCoords({ lat: latitude, lng: longitude })
        setState('success')
      },
      err => setState(err.code === 1 ? 'denied' : 'error'),
      { timeout: 10000, enableHighAccuracy: true },
    )
  }

  async function handleSave() {
    if (!coords) return
    try {
      await geoApi.setMyLocation(coords.lat, coords.lng)
      setState('saved')
    } catch {
      setState('error')
    }
  }

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/provider" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">ตั้งค่าตำแหน่งร้านค้า</h1>
        <p className="text-slate-500 text-sm mt-2">ลูกค้าจะค้นพบร้านของคุณผ่านฟีเจอร์ &ldquo;ใกล้บ้าน&rdquo;</p>
      </div>

      <div className="glass-card rounded-2xl p-6 text-center">
        {state === 'idle' && (
          <>
            <p className="text-slate-600 text-sm mb-6">กด &ldquo;ตรวจจับตำแหน่ง&rdquo; เพื่อบันทึกพิกัดร้านของคุณ</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={detectAndSave}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold mx-auto hover:bg-primary/90 transition-colors">
              <Navigation className="w-4 h-4" /> ตรวจจับตำแหน่ง
            </motion.button>
          </>
        )}

        {state === 'loading' && (
          <div className="py-4">
            <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-slate-500">กำลังตรวจจับตำแหน่ง...</p>
          </div>
        )}

        {state === 'success' && coords && (
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-sm text-emerald-700 font-semibold">ตรวจพบตำแหน่งแล้ว ✓</p>
              <p className="text-xs text-emerald-600 mt-1">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
            </div>
            <button onClick={() => void handleSave()}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
              💾 บันทึกตำแหน่งนี้
            </button>
            <button onClick={() => void detectAndSave()} className="text-sm text-slate-400 hover:text-slate-600">ตรวจจับใหม่</button>
          </div>
        )}

        {state === 'saved' && (
          <div className="py-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">บันทึกตำแหน่งสำเร็จ!</p>
            <p className="text-sm text-slate-500 mt-1">ร้านของคุณจะปรากฏในผลค้นหา &ldquo;ใกล้บ้าน&rdquo;</p>
            <Link href="/dashboard/provider" className="text-sm text-primary hover:underline mt-4 block">
              กลับ Dashboard
            </Link>
          </div>
        )}

        {state === 'denied' && (
          <div className="py-4">
            <p className="text-3xl mb-2">🚫</p>
            <p className="font-semibold text-slate-700">ไม่ได้รับอนุญาต GPS</p>
            <p className="text-sm text-slate-500 mt-1 mb-4">เปิดสิทธิ์ตำแหน่งในการตั้งค่าเบราว์เซอร์แล้วลองใหม่</p>
            <button onClick={() => void detectAndSave()} className="text-sm text-primary hover:underline">ลองอีกครั้ง</button>
          </div>
        )}

        {state === 'error' && (
          <div className="py-4">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="text-slate-600 mb-4">เกิดข้อผิดพลาด กรุณาลองใหม่</p>
            <button onClick={() => void detectAndSave()} className="text-sm text-primary hover:underline">ลองอีกครั้ง</button>
          </div>
        )}
      </div>
    </main>
  )
}
