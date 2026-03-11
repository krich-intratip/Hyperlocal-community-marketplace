'use client'

import { motion } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  User, Mail, Phone, MapPin, Camera, CheckCircle,
  Star, Package, Shield, ChevronRight, Pencil, X, Save, Bell,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useAuthStore } from '@/store/auth.store'
import { useAvatarUpload } from '@/hooks/useAvatarUpload'
import { usersApi } from '@/lib/api'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const ROLE_LABEL: Record<string, string> = {
  customer: 'ลูกค้า',
  provider: 'ผู้ให้บริการ',
  admin: 'ผู้จัดการตลาด',
  superadmin: 'Super Admin',
}

const MENU_ITEMS = [
  { href: '/bookings', icon: Package, label: 'การจองของฉัน', desc: '12 รายการ', badge: '2 รอยืนยัน' },
  { href: '/dashboard', icon: Star, label: 'Dashboard', desc: 'สถิติและภาพรวม', badge: null },
  { href: '/providers/apply', icon: Shield, label: 'สมัครเป็น Provider', desc: 'สร้างรายได้จากทักษะ', badge: null },
  { href: '/notifications', icon: Bell, label: 'การแจ้งเตือน', desc: 'ข่าวสารและ Updates', badge: '3 ใหม่' },
]

export default function ProfilePage() {
  const { user } = useAuthGuard()
  const { updateUser, logout } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: '',
    address: '',
  })
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { upload, uploading, preview, uploadError } = useAvatarUpload()

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.name }))
  }, [user?.name])

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file)
    if (url) {
      try { await usersApi.updateProfile({ avatarUrl: url }) } catch { /* silent */ }
      updateUser({ avatarUrl: url })
    }
    e.target.value = ''
  }

  function handleSave() {
    updateUser({ name: form.name })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      {/* Save toast */}
      {saved && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-bold">
          <CheckCircle className="h-4 w-4" /> บันทึกสำเร็จ
        </motion.div>
      )}

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

        {/* Avatar + name */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="text-center mb-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-3xl glass-sm flex items-center justify-center text-5xl mx-auto shadow-lg border-4 border-white/30 overflow-hidden">
              {(preview || user?.avatarUrl) ? (
                <img src={preview ?? user!.avatarUrl!} alt="รูปโปรไฟล์" className="w-full h-full object-cover" />
              ) : (
                user?.avatar ?? '👤'
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors disabled:opacity-60">
              <Camera className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          {uploadError && (
            <p className="text-xs text-red-500 mt-2">{uploadError}</p>
          )}
          <h1 className="text-xl font-extrabold text-slate-900 mt-4 mb-1">{form.name || user?.name}</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <span>สมาชิก Community Hyper</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary glass-sm border border-primary/20 px-3 py-1 rounded-full">
            {user?.avatar} {ROLE_LABEL[user?.role ?? 'customer']} · {user?.verified ? 'ยืนยันแล้ว' : 'รอยืนยัน'}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'จองทั้งหมด', value: 12, color: 'text-primary', bg: 'glass-sm' },
            { label: 'เสร็จสิ้น', value: 10, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'ใช้จ่ายรวม', value: '฿8,640', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i}
              className={`${s.bg} rounded-2xl p-4 text-center`}>
              <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Profile info card */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="glass-card rounded-2xl p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-slate-900">ข้อมูลส่วนตัว</h2>
            <button onClick={() => setEditing(v => !v)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                editing ? 'border-red-200 text-red-500 hover:bg-red-50/30' : 'border-white/20 glass-sm text-slate-600 hover:border-primary/30 hover:text-primary'
              }`}>
              {editing ? <><X className="h-3.5 w-3.5" /> ยกเลิก</> : <><Pencil className="h-3.5 w-3.5" /> แก้ไข</>}
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5">
                <User className="h-3.5 w-3.5" /> ชื่อ-นามสกุล
              </label>
              {editing ? (
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-xl border border-white/20 focus:border-primary/50 glass px-4 py-2.5 text-sm text-slate-800 outline-none" />
              ) : (
                <p className="text-sm font-medium text-slate-800 px-1">{form.name}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5">
                <Mail className="h-3.5 w-3.5" /> อีเมล
              </label>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-800 px-1">{user?.email ?? '-'}</p>
                <span className="text-xs font-bold text-emerald-600 glass-sm border border-emerald-200/50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <CheckCircle className="h-3 w-3" /> ยืนยันแล้ว
                </span>
              </div>
              {editing && <p className="text-xs text-slate-400 mt-1 px-1">เปลี่ยนอีเมลผ่านหน้าตั้งค่าบัญชี</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5">
                <Phone className="h-3.5 w-3.5" /> เบอร์โทรศัพท์
              </label>
              {editing ? (
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-xl border border-white/20 focus:border-primary/50 glass px-4 py-2.5 text-sm text-slate-800 outline-none" />
              ) : (
                <p className="text-sm font-medium text-slate-800 px-1">{form.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5">
                <MapPin className="h-3.5 w-3.5" /> ที่อยู่
              </label>
              {editing ? (
                <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  rows={2}
                  className="w-full rounded-xl border border-white/20 focus:border-primary/50 glass px-4 py-2.5 text-sm text-slate-800 outline-none resize-none" />
              ) : (
                <p className="text-sm font-medium text-slate-800 px-1">{form.address}</p>
              )}
            </div>

            {editing && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                <Save className="h-4 w-4" /> บันทึกการเปลี่ยนแปลง
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
          {MENU_ITEMS.map((item, i) => (
            <motion.div key={item.href} variants={fadeUp} custom={i} whileHover={{ y: -2 }}>
              <Link href={item.href as any}
                className="flex items-center gap-4 p-4 glass-card rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-xl glass-sm group-hover:bg-white/40 flex items-center justify-center flex-shrink-0 transition-colors">
                  <item.icon className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                {item.badge && (
                  <span className="text-xs font-bold text-primary glass-sm border border-primary/20 px-2 py-0.5 rounded-full flex-shrink-0">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary/60 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Danger zone */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
          className="mt-6 p-4 border border-red-100 rounded-2xl bg-red-50/50">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-2">Danger Zone</p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={logout}
              className="text-xs font-bold text-red-500 hover:text-red-700 py-1 transition-colors">
              ออกจากระบบ
            </button>
            <span className="text-slate-300">|</span>
            <button className="text-xs font-bold text-slate-400 hover:text-red-500 py-1 transition-colors">
              ลบบัญชี
            </button>
          </div>
        </motion.div>

      </section>
      <AppFooter />
    </main>
  )
}
