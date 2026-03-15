'use client'
import { useState, useEffect } from 'react'
import { useMySchedule, useMyHolidays, useUpdateSchedule, useAddHoliday, useRemoveHoliday } from '@/hooks/useSchedule'
import { formatDateMedTH } from '@/lib/date-utils'
import { Calendar, Save, Plus, Trash2, CheckCircle, ChevronLeft, Package } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { DaySchedule } from '@/lib/api'

const DAY_NAMES = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์']
const DAY_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

export default function ProviderSchedulePage() {
  const { data: schedule, isLoading: loadingSched } = useMySchedule()
  const { data: holidays } = useMyHolidays()
  const updateSchedule = useUpdateSchedule()
  const addHoliday = useAddHoliday()
  const removeHoliday = useRemoveHoliday()

  const [localSchedule, setLocalSchedule] = useState<DaySchedule[]>([])
  const [newHolidayDate, setNewHolidayDate] = useState('')
  const [newHolidayReason, setNewHolidayReason] = useState('')
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'weekly' | 'holidays'>('weekly')

  useEffect(() => {
    if (schedule) setLocalSchedule(schedule.map(d => ({ ...d })))
  }, [schedule])

  function toggleDay(dayOfWeek: number) {
    setLocalSchedule(prev => prev.map(d =>
      d.dayOfWeek === dayOfWeek ? { ...d, isOpen: !d.isOpen } : d
    ))
  }

  function updateTime(dayOfWeek: number, field: 'openTime' | 'closeTime', value: string) {
    setLocalSchedule(prev => prev.map(d =>
      d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d
    ))
  }

  async function handleSave() {
    await updateSchedule.mutateAsync(localSchedule)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleAddHoliday() {
    if (!newHolidayDate) return
    await addHoliday.mutateAsync({ date: newHolidayDate, reason: newHolidayReason || undefined })
    setNewHolidayDate('')
    setNewHolidayReason('')
  }

  if (loadingSched) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  )

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard/provider" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </Link>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> ตั้งค่าเวลาทำการ
        </h1>
        <div className="w-20" />
      </div>

      {/* Saved toast */}
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-bold">
            <CheckCircle className="w-4 h-4" /> บันทึกสำเร็จ
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 glass-sm rounded-xl p-1">
        {(['weekly', 'holidays'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === t ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t === 'weekly' ? '📅 ตารางรายสัปดาห์' : '🏖️ วันหยุด / ปิดร้าน'}
          </button>
        ))}
      </div>

      {/* Weekly Schedule */}
      {tab === 'weekly' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card rounded-xl divide-y divide-white/30 mb-4">
            {localSchedule.map((day, i) => (
              <motion.div key={day.dayOfWeek}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-4">
                {/* Day badge */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  day.isOpen ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {DAY_SHORT[day.dayOfWeek]}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-700 text-sm">{DAY_NAMES[day.dayOfWeek]}</p>
                  {day.isOpen && (
                    <div className="flex items-center gap-1 mt-1">
                      <input type="time" value={day.openTime}
                        onChange={e => updateTime(day.dayOfWeek, 'openTime', e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700 w-24" />
                      <span className="text-slate-400 text-xs">–</span>
                      <input type="time" value={day.closeTime}
                        onChange={e => updateTime(day.dayOfWeek, 'closeTime', e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700 w-24" />
                    </div>
                  )}
                  {!day.isOpen && <p className="text-xs text-slate-400 mt-0.5">ปิดทำการ</p>}
                </div>

                {/* Toggle */}
                <button onClick={() => toggleDay(day.dayOfWeek)}
                  className={`relative w-12 h-6 rounded-full transition-all shrink-0 ${
                    day.isOpen ? 'bg-primary' : 'bg-slate-200'
                  }`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    day.isOpen ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </motion.div>
            ))}
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave} disabled={updateSchedule.isPending}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3.5 font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60">
            {updateSchedule.isPending ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : <Save className="w-4 h-4" />}
            บันทึกตารางเวลา
          </motion.button>
        </motion.div>
      )}

      {/* Holidays */}
      {tab === 'holidays' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Add holiday */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> เพิ่มวันหยุด/ปิดร้าน
            </h3>
            <div className="space-y-2">
              <input type="date" value={newHolidayDate} onChange={e => setNewHolidayDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary/50" />
              <input type="text" value={newHolidayReason} onChange={e => setNewHolidayReason(e.target.value)}
                placeholder="เหตุผล (ไม่บังคับ) เช่น วันสงกรานต์"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary/50" />
              <button onClick={handleAddHoliday} disabled={!newHolidayDate || addHoliday.isPending}
                className="w-full bg-primary text-white rounded-xl py-2.5 text-sm font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors">
                {addHoliday.isPending ? 'กำลังบันทึก...' : '+ เพิ่มวันหยุด'}
              </button>
            </div>
          </div>

          {/* Holiday list */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold text-slate-700 mb-3">รายการวันหยุด ({holidays?.length ?? 0} วัน)</h3>
            {!holidays || holidays.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">🏖️</p>
                <p className="text-slate-400 text-sm">ยังไม่มีวันหยุดที่ตั้งไว้</p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-2">
                  {[...holidays].sort((a, b) => a.date.localeCompare(b.date)).map(h => (
                    <motion.div key={h.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                      className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-sm">🗓️</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-700">{formatDateMedTH(h.date)}</p>
                        {h.reason && <p className="text-xs text-slate-400">{h.reason}</p>}
                      </div>
                      <button onClick={() => removeHoliday.mutate(h.date)}
                        disabled={removeHoliday.isPending}
                        className="text-rose-400 hover:text-rose-600 transition-colors p-1 disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      )}
    </main>
  )
}
