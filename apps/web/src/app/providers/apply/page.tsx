'use client'

import { motion } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { MarketBackground } from '@/components/market-background'
import { Navbar } from '@/components/navbar'
import {
  ChevronRight, CheckCircle, Star, TrendingUp, Users,
  Upload, AlertTriangle, MapPin, Info, Navigation, Loader2, ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}

const CATEGORIES = [
  { slug: 'FOOD',              name: 'อาหาร',              icon: '🍱' },
  { slug: 'REPAIR',            name: 'งานช่าง',             icon: '🔧' },
  { slug: 'HOME_SERVICES',     name: 'งานบ้าน',             icon: '🏠' },
  { slug: 'TUTORING',          name: 'สอนพิเศษ',            icon: '📚' },
  { slug: 'ELDERLY_CARE',      name: 'ดูแลผู้สูงอายุ',      icon: '👴' },
  { slug: 'HANDMADE',          name: 'สินค้าทำมือ',         icon: '🎨' },
  { slug: 'HEALTH_WELLNESS',   name: 'สุขภาพ & ความงาม',   icon: '💆' },
  { slug: 'AGRICULTURE',       name: 'เกษตรชุมชน',          icon: '🌿' },
  { slug: 'FREELANCE',         name: 'ฟรีแลนซ์',            icon: '💻' },
  { slug: 'COMMUNITY_SHARING', name: 'Community Sharing',   icon: '🤝' },
]

/* Mock — will come from API /communities (active only) */
const MOCK_COMMUNITIES = [
  { id: '1', name: 'หมู่บ้านศรีนคร',     area: 'บางแค, กรุงเทพฯ',    providers: 34,  emoji: '🏘️' },
  { id: '2', name: 'คอนโด The Base',      area: 'ลาดพร้าว, กรุงเทพฯ', providers: 67,  emoji: '🏙️' },
  { id: '3', name: 'ชุมชนเมืองทอง',       area: 'นนทบุรี',             providers: 120, emoji: '🌳' },
  { id: '4', name: 'หมู่บ้านกรีนวิลล์',   area: 'สมุทรปราการ',         providers: 22,  emoji: '🌿' },
  { id: '6', name: 'ชุมชนริมน้ำ',          area: 'ปทุมธานี',            providers: 31,  emoji: '🌊' },
]

const STEPS = ['เลือกชุมชน', 'เลือกหมวดหมู่', 'ข้อมูลของคุณ', 'ที่อยู่ & ยืนยันตัวตน', 'ยืนยัน']

type GeoState = 'idle' | 'loading' | 'granted' | 'denied'

export default function ProviderApplyPage() {
  const [step, setStep]                           = useState(1)
  const [selectedCommunity, setSelectedCommunity] = useState('')
  const [selectedCategory, setSelectedCategory]   = useState('')
  const [form, setForm]                           = useState({
    name: '', phone: '', bio: '', price: '',
    addressLine: '', subdistrict: '', district: '', province: '', postalCode: '',
  })
  const [locationPin, setLocationPin]             = useState<{ lat: number; lng: number } | null>(null)
  const [geoState, setGeoState]                   = useState<GeoState>('idle')
  const [idCardName, setIdCardName]               = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const selectedComm = MOCK_COMMUNITIES.find(c => c.id === selectedCommunity)

  const pinMyLocation = () => {
    if (!navigator.geolocation) return
    setGeoState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationPin({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoState('granted')
      },
      () => setGeoState('denied'),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-20">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-sm font-medium text-amber-700 mb-5">
            <Star className="h-4 w-4" />
            สมัครเป็นผู้ให้บริการ / ผู้ค้า
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            เริ่มสร้างรายได้<span className="text-amber-500">จากทักษะ</span>
          </h1>
          <p className="text-slate-500 text-sm">กรอกข้อมูลไม่กี่ขั้นตอน Community Admin จะตรวจสอบและอนุมัติภายใน 24–48 ชั่วโมง</p>
        </motion.div>

        {/* ── Business Rule Warning ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="mb-7 rounded-2xl border-2 border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-extrabold text-amber-800 dark:text-amber-300 mb-1.5">
                ⚠️ 1 บัญชี = 1 ตลาดชุมชนเท่านั้น
              </p>
              <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1 leading-relaxed">
                <li>• บัญชีนี้จะผูกกับตลาดชุมชนที่คุณเลือก <strong>ตลอดไป</strong></li>
                <li>• ไม่สามารถย้ายหรือเพิ่มชุมชนอื่นในบัญชีเดิมได้</li>
                <li>• หากต้องการขยายไปชุมชนอื่น ต้องใช้ <strong>บัญชีใหม่</strong> (Google account อื่น)</li>
              </ul>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-amber-600 dark:text-amber-500">
                <Info className="h-3.5 w-3.5" />
                กฎนี้ช่วยให้ระบบ commission ถูกต้องและชัดเจนสำหรับผู้จัดการตลาดแต่ละชุมชน
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="grid grid-cols-3 gap-3 mb-7">
          {[
            { icon: TrendingUp, label: 'สร้างรายได้', desc: 'จากทักษะที่มี' },
            { icon: Users,      label: 'ลูกค้าในชุมชน', desc: 'ใกล้บ้านคุณ' },
            { icon: Star,       label: 'Trust Score',  desc: 'สะสมชื่อเสียง' },
          ].map((b) => (
            <div key={b.label} className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm">
              <b.icon className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-800">{b.label}</div>
              <div className="text-xs text-slate-500">{b.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Step indicator */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="flex items-center mb-7">
          {STEPS.map((label, idx) => {
            const s = idx + 1
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    s < step ? 'bg-green-500 text-white' : s === step ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {s < step ? '✓' : s}
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${s === step ? 'text-slate-700' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {s < STEPS.length && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${s < step ? 'bg-green-300' : 'bg-slate-200'}`} />
                )}
              </div>
            )
          })}
        </motion.div>

        {/* Form card */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
          className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-xl p-8">

          {/* ── Step 1: เลือกชุมชน ── */}
          {step === 1 && (
            <div>
              <h2 className="font-bold text-xl text-slate-900 mb-1">เลือกตลาดชุมชนของคุณ</h2>
              <p className="text-sm text-slate-500 mb-5">
                เลือกชุมชนที่คุณอาศัยหรือให้บริการอยู่ — <strong className="text-amber-600">เปลี่ยนไม่ได้หลังยืนยัน</strong>
              </p>
              <div className="space-y-2.5">
                {MOCK_COMMUNITIES.map((comm) => (
                  <motion.button key={comm.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCommunity(comm.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedCommunity === comm.id
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                    }`}>
                    <span className="text-2xl flex-shrink-0">{comm.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-800">{comm.name}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="h-3 w-3" />{comm.area}
                        <span className="ml-2 text-blue-600 font-medium">{comm.providers} Provider</span>
                      </div>
                    </div>
                    {selectedCommunity === comm.id && (
                      <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => selectedCommunity && setStep(2)}
                disabled={!selectedCommunity}
                className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                ยืนยันเลือกชุมชนนี้ <ChevronRight className="h-4 w-4" />
              </motion.button>
              <p className="text-center text-xs text-slate-400 mt-3">
                ไม่พบชุมชนของคุณ?{' '}
                <Link href="/franchise/apply" className="text-amber-600 hover:underline font-semibold">
                  ขอเปิดตลาดชุมชนใหม่
                </Link>
              </p>
            </div>
          )}

          {/* ── Step 2: เลือกหมวดหมู่ ── */}
          {step === 2 && (
            <div>
              <h2 className="font-bold text-xl text-slate-900 mb-1">เลือกหมวดบริการ</h2>
              <p className="text-sm text-slate-500 mb-5">คุณให้บริการด้านไหนใน <strong>{selectedComm?.name}</strong>? (เลือกได้ 1 หมวดหลัก)</p>
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
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  ย้อนกลับ
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => selectedCategory && setStep(3)}
                  disabled={!selectedCategory}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  ถัดไป <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          )}

          {/* ── Step 3: ข้อมูลส่วนตัว ── */}
          {step === 3 && (
            <div>
              <h2 className="font-bold text-xl text-slate-900 mb-1">ข้อมูลของคุณ</h2>
              <p className="text-sm text-slate-500 mb-5">ข้อมูลนี้จะแสดงในโปรไฟล์ผู้ให้บริการในชุมชน <strong>{selectedComm?.name}</strong></p>
              <div className="space-y-4">
                {[
                  { name: 'name',  label: 'ชื่อ-นามสกุล *',           placeholder: 'กรอกชื่อจริง',   type: 'text'   },
                  { name: 'phone', label: 'เบอร์โทรศัพท์ *',           placeholder: '0812345678',      type: 'tel'    },
                  { name: 'price', label: 'ราคาเริ่มต้น (บาท) *',      placeholder: 'เช่น 300',        type: 'number' },
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
                <button onClick={() => setStep(2)}
                  className="flex-1 rounded-xl border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  ย้อนกลับ
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => form.name && form.phone && form.bio && setStep(4)}
                  disabled={!form.name || !form.phone || !form.bio}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  ถัดไป <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          )}

          {/* ── Step 4: ที่อยู่ & ยืนยันตัวตน (KYC) ── */}
          {step === 4 && (
            <div>
              <h2 className="font-bold text-xl text-slate-900 mb-1">ที่อยู่ & ยืนยันตัวตน</h2>
              <p className="text-sm text-slate-500 mb-2">ข้อมูลนี้ใช้เพื่อยืนยันตัวตนและป้องกันการสมัครปลอม</p>

              {/* Anti-fraud notice */}
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5">
                <ShieldCheck className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  ข้อมูลที่อยู่และบัตรประชาชนจะถูกเข้ารหัสและใช้เพื่อการยืนยันตัวตนเท่านั้น
                  ไม่มีการเปิดเผยต่อบุคคลที่สาม
                </p>
              </div>

              <div className="space-y-4">
                {/* Structured address */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                    <MapPin className="h-4 w-4 inline mr-1 text-amber-500" />
                    บ้านเลขที่ / ถนน *
                  </label>
                  <input name="addressLine" value={form.addressLine} onChange={handleChange}
                    placeholder="เช่น 123/4 ถ.สุขุมวิท"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">แขวง / ตำบล *</label>
                    <input name="subdistrict" value={form.subdistrict} onChange={handleChange}
                      placeholder="เช่น คลองเตย"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">เขต / อำเภอ *</label>
                    <input name="district" value={form.district} onChange={handleChange}
                      placeholder="เช่น คลองเตย"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">จังหวัด *</label>
                    <input name="province" value={form.province} onChange={handleChange}
                      placeholder="เช่น กรุงเทพมหานคร"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">รหัสไปรษณีย์ *</label>
                    <input name="postalCode" value={form.postalCode} onChange={handleChange}
                      placeholder="เช่น 10110" maxLength={5} inputMode="numeric"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all" />
                  </div>
                </div>

                {/* Map pin */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                    <Navigation className="h-4 w-4 inline mr-1 text-blue-500" />
                    ปักหมุดที่ตั้งในแผนที่ *
                  </label>
                  {locationPin ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-green-700">📍 ปักหมุดแล้ว</p>
                        <p className="text-xs text-green-600 mt-0.5">
                          {locationPin.lat.toFixed(5)}, {locationPin.lng.toFixed(5)}
                        </p>
                      </div>
                      <button onClick={() => { setLocationPin(null); setGeoState('idle') }}
                        className="text-xs text-slate-400 hover:text-red-500 transition-colors">ล้าง</button>
                    </div>
                  ) : (
                    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={pinMyLocation}
                      disabled={geoState === 'loading'}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-4 text-sm font-semibold text-blue-600 hover:bg-blue-100 disabled:opacity-60 transition-all">
                      {geoState === 'loading'
                        ? <><Loader2 className="h-4 w-4 animate-spin" /> กำลังหาตำแหน่ง...</>
                        : <><Navigation className="h-4 w-4" /> ใช้ตำแหน่ง GPS ปัจจุบัน</>}
                    </motion.button>
                  )}
                  {geoState === 'denied' && (
                    <p className="text-xs text-red-500 mt-1.5">ไม่ได้รับอนุญาต — กรุณาอนุญาต Location ใน Browser Settings</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1.5">ใช้สำหรับแสดงระยะห่างให้ลูกค้าทราบ และยืนยันพื้นที่ให้บริการ</p>
                </div>

                {/* ID Card upload */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                    <ShieldCheck className="h-4 w-4 inline mr-1 text-amber-500" />
                    บัตรประชาชน (ด้านหน้า) * — เพื่อยืนยันตัวตน
                  </label>
                  <label className="block border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-amber-300 transition-colors cursor-pointer">
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => setIdCardName(e.target.files?.[0]?.name ?? '')} />
                    {idCardName ? (
                      <div>
                        <div className="text-2xl mb-1">✅</div>
                        <p className="text-sm font-semibold text-green-600">{idCardName}</p>
                        <p className="text-xs text-slate-400 mt-1">คลิกเพื่อเปลี่ยนไฟล์</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-3xl mb-2">🪪</div>
                        <p className="text-sm text-slate-500">คลิกเพื่ออัปโหลดบัตรประชาชน</p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG ขนาดไม่เกิน 10MB — ไฟล์จะถูกเข้ารหัส</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(3)}
                  className="flex-1 rounded-xl border-2 border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  ย้อนกลับ
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { const ok = form.addressLine && form.subdistrict && form.district && form.province && form.postalCode && locationPin && idCardName; if (ok) setStep(5) }}
                  disabled={!form.addressLine || !form.subdistrict || !form.district || !form.province || !form.postalCode || !locationPin || !idCardName}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  ถัดไป <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          )}

          {/* ── Step 5: ยืนยัน ── */}
          {step === 5 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="font-bold text-xl text-slate-900 mb-3">ตรวจสอบข้อมูลก่อนยืนยัน</h2>

              {/* Summary */}
              <div className="bg-slate-50 rounded-2xl p-5 text-left mb-5 space-y-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedComm?.emoji}</span>
                  <div>
                    <span className="text-xs text-slate-400">ตลาดชุมชน (เปลี่ยนไม่ได้)</span>
                    <p className="font-bold text-slate-800">{selectedComm?.name} — {selectedComm?.area}</p>
                  </div>
                </div>
                <div className="h-px bg-slate-200" />
                {[
                  { label: 'หมวดบริการ', value: CATEGORIES.find(c => c.slug === selectedCategory)?.icon + ' ' + CATEGORIES.find(c => c.slug === selectedCategory)?.name },
                  { label: 'ชื่อ', value: form.name },
                  { label: 'ราคาเริ่มต้น', value: form.price ? `฿${form.price}` : '-' },
                  { label: 'ที่อยู่', value: `${form.addressLine} แขวง${form.subdistrict} เขต${form.district} ${form.province} ${form.postalCode}` },
                  { label: 'GPS', value: locationPin ? `${locationPin.lat.toFixed(5)}, ${locationPin.lng.toFixed(5)}` : '-' },
                  { label: 'บัตรประชาชน', value: idCardName || '-' },
                ].map(r => (
                  <div key={r.label} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 flex-shrink-0">{r.label}:</span>
                    <span className="font-semibold text-slate-700 break-all">{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Final warning */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left mb-5">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  เมื่อยืนยันแล้ว บัญชีนี้จะถูกผูกกับ <strong>{selectedComm?.name}</strong> ถาวร
                  หากต้องการสมัครชุมชนอื่น ต้องใช้บัญชี Google อื่น
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <a href="/auth/signin"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 transition-colors">
                  สมัครสมาชิกและส่งใบสมัคร <ChevronRight className="h-4 w-4" />
                </a>
              </motion.div>
              <button onClick={() => setStep(4)} className="mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                แก้ไขข้อมูล
              </button>
            </div>
          )}
        </motion.div>
      </section>
      <AppFooter />
    </main>
  )
}
