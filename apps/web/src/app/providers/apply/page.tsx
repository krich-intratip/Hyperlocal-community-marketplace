'use client'

import { motion } from 'framer-motion'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import { ChevronRight, CheckCircle, Star, TrendingUp, Users, Upload } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}

const CATEGORIES = [
  { slug: 'FOOD', name: 'อาหาร', icon: '🍱' },
  { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧' },
  { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠' },
  { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚' },
  { slug: 'ELDERLY_CARE', name: 'ดูแลผู้สูงอายุ', icon: '👴' },
  { slug: 'HANDMADE', name: 'สินค้าทำมือ', icon: '🎨' },
  { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ & ความงาม', icon: '💆' },
  { slug: 'AGRICULTURE', name: 'เกษตรชุมชน', icon: '🌿' },
  { slug: 'FREELANCE', name: 'ฟรีแลนซ์', icon: '💻' },
  { slug: 'COMMUNITY_SHARING', name: 'Community Sharing', icon: '🤝' },
]

export default function ProviderApplyPage() {
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', bio: '', experience: '', price: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-20">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-sm font-medium text-amber-700 mb-6">
            <Star className="h-4 w-4" />
            สมัครเป็นผู้ให้บริการ
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            เริ่มสร้างรายได้<span className="text-amber-500">จากทักษะ</span>
          </h1>
          <p className="text-slate-500">กรอกข้อมูลเพียงไม่กี่ขั้นตอน ทีมงานจะตรวจสอบและอนุมัติภายใน 24–48 ชั่วโมง</p>
        </motion.div>

        {/* Benefits */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: TrendingUp, label: 'สร้างรายได้', desc: 'จากทักษะที่มี' },
            { icon: Users, label: 'ลูกค้าในชุมชน', desc: 'ใกล้บ้านคุณ' },
            { icon: Star, label: 'Trust Score', desc: 'สะสมชื่อเสียง' },
          ].map((b) => (
            <div key={b.label} className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm">
              <b.icon className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-800">{b.label}</div>
              <div className="text-xs text-slate-500">{b.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Step indicator */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s < step ? 'bg-green-500 text-white' : s === step ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {s < step ? '✓' : s}
              </div>
              <div className={`text-xs font-medium ${s === step ? 'text-slate-700' : 'text-slate-400'}`}>
                {['เลือกหมวดหมู่', 'ข้อมูลส่วนตัว', 'ยืนยัน'][s - 1]}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 ${s < step ? 'bg-green-300' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </motion.div>

        {/* Form card */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-xl p-8">

          {/* Step 1: Category */}
          {step === 1 && (
            <div>
              <h2 className="font-bold text-xl text-slate-900 mb-2">เลือกหมวดบริการ</h2>
              <p className="text-sm text-slate-500 mb-6">คุณให้บริการด้านไหน? (เลือกได้ 1 หมวดหลัก)</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <motion.button key={cat.slug} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      selectedCategory === cat.slug
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                    }`}>
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                    {selectedCategory === cat.slug && (
                      <CheckCircle className="h-4 w-4 text-amber-500 ml-auto" />
                    )}
                  </motion.button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => selectedCategory && setStep(2)}
                disabled={!selectedCategory}
                className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                ถัดไป <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          )}

          {/* Step 2: Personal info */}
          {step === 2 && (
            <div>
              <h2 className="font-bold text-xl text-slate-900 mb-2">ข้อมูลส่วนตัว</h2>
              <p className="text-sm text-slate-500 mb-6">ข้อมูลนี้จะแสดงในโปรไฟล์ผู้ให้บริการของคุณ</p>
              <div className="space-y-4">
                {[
                  { name: 'name', label: 'ชื่อ-นามสกุล *', placeholder: 'กรอกชื่อจริง', type: 'text' },
                  { name: 'phone', label: 'เบอร์โทรศัพท์ *', placeholder: '0812345678', type: 'tel' },
                  { name: 'price', label: 'ราคาเริ่มต้น (บาท) *', placeholder: 'เช่น 300', type: 'number' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">{field.label}</label>
                    <input type={field.type} name={field.name} value={form[field.name as keyof typeof form]}
                      onChange={handleChange} placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">แนะนำตัวสั้นๆ *</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                    placeholder="เล่าให้ลูกค้าทราบว่าคุณทำอะไร มีประสบการณ์แค่ไหน..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none transition-all" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                    <Upload className="h-4 w-4 inline mr-1" />รูปโปรไฟล์ (ถ้ามี)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-amber-300 transition-colors cursor-pointer">
                    <div className="text-3xl mb-2">📸</div>
                    <p className="text-sm text-slate-500">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG ขนาดไม่เกิน 5MB</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  ย้อนกลับ
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => form.name && form.phone && form.bio && setStep(3)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all">
                  ถัดไป <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="font-bold text-xl text-slate-900 mb-3">พร้อมส่งใบสมัคร!</h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                ข้อมูลของคุณครบถ้วนแล้ว เมื่อสมัครสมาชิก ทีมงานจะตรวจสอบ
                และอนุมัติโปรไฟล์ภายใน <strong>24–48 ชั่วโมง</strong>
              </p>
              <div className="bg-slate-50 rounded-2xl p-4 text-left mb-6 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-slate-600">หมวด: {CATEGORIES.find(c => c.slug === selectedCategory)?.name}</span>
                </div>
                {form.name && <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-slate-600">ชื่อ: {form.name}</span></div>}
                {form.price && <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-slate-600">ราคาเริ่มต้น: ฿{form.price}</span></div>}
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link href="/auth/signin"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 transition-colors">
                  สมัครสมาชิกและยืนยัน <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <button onClick={() => setStep(2)} className="mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                แก้ไขข้อมูล
              </button>
            </div>
          )}
        </motion.div>
      </section>

      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-slate-400">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}
