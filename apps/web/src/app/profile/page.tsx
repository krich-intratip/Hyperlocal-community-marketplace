'use client'

import { motion } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  User, Mail, Phone, MapPin, Camera, CheckCircle,
  Star, Package, Shield, ChevronRight, Pencil, X, Save,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const MOCK_USER = {
  name: 'คุณวิภาวดี มีสุข',
  email: 'wipa@example.com',
  phone: '081-234-5678',
  address: '123/4 ซ.ศรีนคร 5 ต.บางกอกน้อย กรุงเทพ 10700',
  community: 'หมู่บ้านศรีนคร',
  avatar: '👩',
  role: 'customer',
  joinedDate: 'มกราคม 2569',
  totalBookings: 12,
  completedBookings: 10,
  totalSpent: 8640,
  rating: 4.8,
}

const MENU_ITEMS = [
  { href: '/bookings', icon: Package, label: 'การจองของฉัน', desc: '12 รายการ', badge: '2 รอยืนยัน' },
  { href: '/dashboard', icon: Star, label: 'Dashboard', desc: 'สถิติและภาพรวม', badge: null },
  { href: '/providers/apply', icon: Shield, label: 'สมัครเป็น Provider', desc: 'สร้างรายได้จากทักษะ', badge: null },
  { href: '/notifications', icon: Bell, label: 'การแจ้งเตือน', desc: 'ข่าวสารและ Updates', badge: '3 ใหม่' },
]

import { Bell } from 'lucide-react'

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: MOCK_USER.name,
    phone: MOCK_USER.phone,
    address: MOCK_USER.address,
  })
  const [saved, setSaved] = useState(false)

  function handleSave() {
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
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-5xl mx-auto shadow-lg border-4 border-white">
              {MOCK_USER.avatar}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
              <Camera className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-4 mb-1">{form.name}</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {MOCK_USER.community}
            </span>
            <span>·</span>
            <span>สมาชิกตั้งแต่ {MOCK_USER.joinedDate}</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            🛍️ ลูกค้า · ยืนยันแล้ว
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'จองทั้งหมด', value: MOCK_USER.totalBookings, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'เสร็จสิ้น', value: MOCK_USER.completedBookings, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'ใช้จ่ายรวม', value: `฿${MOCK_USER.totalSpent.toLocaleString()}`, color: 'text-amber-600', bg: 'bg-amber-50' },
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
          className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-slate-900">ข้อมูลส่วนตัว</h2>
            <button onClick={() => setEditing(v => !v)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                editing ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600'
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
                  className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-2.5 text-sm text-slate-800 outline-none" />
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
                <p className="text-sm font-medium text-slate-800 px-1">{MOCK_USER.email}</p>
                <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
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
                  className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-2.5 text-sm text-slate-800 outline-none" />
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
                  className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-2.5 text-sm text-slate-800 outline-none resize-none" />
              ) : (
                <p className="text-sm font-medium text-slate-800 px-1">{form.address}</p>
              )}
            </div>

            {editing && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
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
                className="flex items-center gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center flex-shrink-0 transition-colors">
                  <item.icon className="h-5 w-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                {item.badge && (
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex-shrink-0">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Danger zone */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
          className="mt-6 p-4 border border-red-100 rounded-2xl bg-red-50/50">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-2">Danger Zone</p>
          <div className="flex gap-3 flex-wrap">
            <button className="text-xs font-bold text-red-500 hover:text-red-700 py-1 transition-colors">
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
