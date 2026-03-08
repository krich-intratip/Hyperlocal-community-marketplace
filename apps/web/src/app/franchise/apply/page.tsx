'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { MarketBackground as _MB } from '@/components/market-background'
import {
  Building2, MapPin, User, Phone, FileText, ChevronRight,
  ChevronLeft, CheckCircle, DollarSign, Users, TrendingUp, Shield
} from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '@/lib/date'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}

const STEPS = [
  { id: 1, label: 'ข้อมูลพื้นที่', icon: MapPin },
  { id: 2, label: 'ข้อมูลผู้สมัคร', icon: User },
  { id: 3, label: 'แผนธุรกิจ', icon: TrendingUp },
  { id: 4, label: 'ยืนยัน', icon: CheckCircle },
]

const PROVINCES = [
  'กรุงเทพมหานคร', 'เชียงใหม่', 'ภูเก็ต', 'ขอนแก่น', 'นครราชสีมา',
  'ชลบุรี', 'เชียงราย', 'อุดรธานี', 'สงขลา', 'นนทบุรี',
]

const COMMUNITY_TYPES = [
  { id: 'village', label: 'หมู่บ้านจัดสรร', icon: '🏘️', desc: 'บ้านเดี่ยว ทาวน์เฮ้าส์ ในโครงการ' },
  { id: 'condo', label: 'คอนโดมิเนียม', icon: '🏢', desc: 'อาคารชุด คอนโดขนาดกลาง-ใหญ่' },
  { id: 'university', label: 'มหาวิทยาลัย', icon: '🎓', desc: 'ชุมชนรอบสถาบันการศึกษา' },
  { id: 'commercial', label: 'ย่านพาณิชย์', icon: '🏪', desc: 'ชุมชนตลาด ย่านธุรกิจ' },
  { id: 'industrial', label: 'นิคมอุตสาหกรรม', icon: '🏭', desc: 'ชุมชนรอบโรงงาน นิคมฯ' },
  { id: 'rural', label: 'ชุมชนชนบท', icon: '🌾', desc: 'ตำบล หมู่บ้านในชนบท' },
]

export default function FranchiseApplyPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    // Step 1
    communityName: '',
    communityType: '',
    province: '',
    district: '',
    address: '',
    estimatedHouseholds: '',
    // Step 2
    fullName: '',
    idCard: '',
    phone: '',
    email: '',
    lineId: '',
    occupation: '',
    // Step 3
    why: '',
    experience: '',
    capitalReady: '',
    marketingPlan: '',
    agreeTerms: false,
    agreeRevShare: false,
  })

  function update(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  const today = formatDate(new Date())

  if (submitted) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950">
        <MarketBackground />
        <Navbar />
        <div className="max-w-xl mx-auto px-4 pt-20 pb-20 text-center">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">ส่งใบสมัครสำเร็จ!</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-2">
              เราได้รับใบสมัครของ <strong className="text-slate-800 dark:text-slate-200">{form.fullName}</strong> แล้ว
            </p>
            <p className="text-base text-slate-400 dark:text-slate-500 mb-8">
              ทีมงานจะตรวจสอบและติดต่อกลับภายใน <strong className="text-blue-600">3–5 วันทำการ</strong> ทาง {form.email || form.phone}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-5 mb-6 text-left space-y-2">
              <p className="font-bold text-blue-800 dark:text-blue-300 text-base mb-3">สรุปใบสมัคร</p>
              {[
                ['ชุมชนที่สมัคร', form.communityName],
                ['จังหวัด', form.province],
                ['ผู้สมัคร', form.fullName],
                ['เบอร์โทร', form.phone],
                ['วันที่สมัคร', today],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2 text-sm">
                  <span className="text-slate-500 dark:text-slate-400 min-w-[120px]">{k}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{v}</span>
                </div>
              ))}
            </div>
            <a href="/franchise" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors">
              ดูข้อมูล Franchise
            </a>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950">
      <MarketBackground />
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-sm font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              Community Franchise Program
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">สมัครเป็นผู้จัดการตลาดชุมชน</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
            เป็นเจ้าของตลาดบริการชุมชนในพื้นที่ของคุณ รับ Revenue Share จากทุก Transaction
          </p>
        </motion.div>

        {/* Benefits strip */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: DollarSign, label: 'Revenue Share 10%', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/30' },
            { icon: Users, label: 'จัดการชุมชนเอง', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
            { icon: Shield, label: 'ช่วงทดลองฟรี', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' },
          ].map(b => (
            <div key={b.label} className={`${b.bg} rounded-xl p-3 text-center`}>
              <b.icon className={`h-5 w-5 ${b.color} mx-auto mb-1`} />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{b.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Step indicator */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`flex flex-col items-center flex-1 ${i > 0 ? '' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s.id ? 'bg-green-500 text-white' :
                  step === s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' :
                  'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {step > s.id ? '✓' : s.id}
                </div>
                <span className={`text-xs mt-1 font-semibold text-center ${
                  step >= s.id ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'
                }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 mb-4 rounded-full transition-all ${step > s.id ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Form card */}
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

            {/* ────── STEP 1: ข้อมูลพื้นที่ ────── */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" /> ข้อมูลพื้นที่ชุมชน
                </h2>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">ประเภทชุมชน *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COMMUNITY_TYPES.map(ct => (
                      <button key={ct.id} type="button" onClick={() => update('communityType', ct.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          form.communityType === ct.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                        }`}>
                        <div className="text-xl mb-1">{ct.icon}</div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{ct.label}</div>
                        <div className="text-xs text-slate-400">{ct.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">ชื่อชุมชน / โครงการ *</label>
                  <input value={form.communityName} onChange={e => update('communityName', e.target.value)}
                    placeholder="เช่น หมู่บ้านศรีนคร, คอนโด The Base Rama9"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">จังหวัด *</label>
                    <select value={form.province} onChange={e => update('province', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300">
                      <option value="">เลือกจังหวัด</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">เขต/อำเภอ *</label>
                    <input value={form.district} onChange={e => update('district', e.target.value)}
                      placeholder="เช่น บางรัก, เมือง"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">จำนวนครัวเรือนโดยประมาณ *</label>
                  <select value={form.estimatedHouseholds} onChange={e => update('estimatedHouseholds', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <option value="">เลือกขนาดชุมชน</option>
                    <option value="50-200">50–200 ครัวเรือน (ขนาดเล็ก)</option>
                    <option value="200-500">200–500 ครัวเรือน (ขนาดกลาง)</option>
                    <option value="500-2000">500–2,000 ครัวเรือน (ขนาดใหญ่)</option>
                    <option value="2000+">2,000+ ครัวเรือน (ขนาดใหญ่มาก)</option>
                  </select>
                </div>
              </div>
            )}

            {/* ────── STEP 2: ข้อมูลผู้สมัคร ────── */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" /> ข้อมูลผู้สมัคร
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: 'fullName', label: 'ชื่อ-นามสกุล *', placeholder: 'ชื่อจริง นามสกุลจริง' },
                    { field: 'idCard', label: 'เลขบัตรประชาชน *', placeholder: '1-XXXX-XXXXX-XX-X' },
                    { field: 'phone', label: 'เบอร์โทรศัพท์ *', placeholder: '08X-XXX-XXXX' },
                    { field: 'email', label: 'อีเมล *', placeholder: 'your@email.com' },
                    { field: 'lineId', label: 'LINE ID', placeholder: '@yourlineid' },
                    { field: 'occupation', label: 'อาชีพปัจจุบัน', placeholder: 'เช่น นักธุรกิจ, นิติบุคคลหมู่บ้าน' },
                  ].map(f => (
                    <div key={f.field}>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">{f.label}</label>
                      <input value={form[f.field as keyof typeof form] as string}
                        onChange={e => update(f.field, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold">
                    🔒 ข้อมูลส่วนตัวของคุณจะถูกเก็บเป็นความลับ ใช้เพื่อยืนยันตัวตนเท่านั้น
                  </p>
                </div>
              </div>
            )}

            {/* ────── STEP 3: แผนธุรกิจ ────── */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" /> แผนธุรกิจและแรงจูงใจ
                </h2>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    ทำไมคุณถึงอยากเป็นผู้จัดการตลาดชุมชนในพื้นที่นี้? *
                  </label>
                  <textarea value={form.why} onChange={e => update('why', e.target.value)}
                    rows={3} placeholder="เล่าแรงบันดาลใจและความผูกพันกับชุมชน..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    ประสบการณ์ที่เกี่ยวข้อง (บริหารชุมชน, ธุรกิจ, IT)
                  </label>
                  <textarea value={form.experience} onChange={e => update('experience', e.target.value)}
                    rows={2} placeholder="เช่น เคยเป็นนิติบุคคลหมู่บ้าน 3 ปี, เคยทำธุรกิจขายออนไลน์..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    ทุนเริ่มต้นที่พร้อม (สำหรับ marketing ชุมชน)
                  </label>
                  <select value={form.capitalReady} onChange={e => update('capitalReady', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <option value="">เลือกช่วงทุน</option>
                    <option value="0">ยังไม่มี (ใช้ช่วงทดลองฟรีก่อน)</option>
                    <option value="5000-20000">5,000–20,000 บาท</option>
                    <option value="20000-50000">20,000–50,000 บาท</option>
                    <option value="50000+">50,000 บาทขึ้นไป</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    แผนการดึงดูด Provider เข้ามาในตลาด
                  </label>
                  <textarea value={form.marketingPlan} onChange={e => update('marketingPlan', e.target.value)}
                    rows={2} placeholder="เช่น ติดประกาศในหมู่บ้าน, โพสต์กลุ่ม LINE ชุมชน, จัดกิจกรรม..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                </div>

                {/* Agreement checkboxes */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                  {[
                    { field: 'agreeTerms', label: 'ฉันยอมรับ ข้อกำหนดและเงื่อนไข Franchise และ กฎของแพลตฟอร์ม' },
                    { field: 'agreeRevShare', label: 'ฉันเข้าใจโครงสร้าง Revenue Share (10% จากยอด Commission ในพื้นที่) และ กรณีที่อาจถูก Suspend หรือ Transfer ชุมชน' },
                  ].map(ag => (
                    <label key={ag.field} className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={form[ag.field as keyof typeof form] as boolean}
                        onChange={e => update(ag.field, e.target.checked)}
                        className="mt-1 w-4 h-4 accent-blue-600 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{ag.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ────── STEP 4: ยืนยัน ────── */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" /> ตรวจสอบข้อมูลก่อนส่ง
                </h2>

                <div className="space-y-3">
                  {[
                    { section: '📍 พื้นที่', items: [['ประเภท', COMMUNITY_TYPES.find(c => c.id === form.communityType)?.label ?? '-'], ['ชุมชน', form.communityName], ['จังหวัด', `${form.province} / ${form.district}`], ['ครัวเรือน', form.estimatedHouseholds]] },
                    { section: '👤 ผู้สมัคร', items: [['ชื่อ', form.fullName], ['โทร', form.phone], ['Email', form.email], ['LINE', form.lineId || '-']] },
                    { section: '📋 แผนธุรกิจ', items: [['ทุนพร้อม', form.capitalReady || '-'], ['ประสบการณ์', form.experience ? '✓ มีข้อมูล' : '-']] },
                  ].map(s => (
                    <div key={s.section} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
                      <p className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-2">{s.section}</p>
                      {s.items.map(([k, v]) => (
                        <div key={k} className="flex gap-2 text-sm py-0.5">
                          <span className="text-slate-400 min-w-[100px]">{k}:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{v}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    หลังส่งใบสมัคร Super Admin จะตรวจสอบและติดต่อกลับภายใน <strong>3–5 วันทำการ</strong>
                    หากผ่าน คุณจะได้รับ <strong>Community Admin Dashboard</strong> พร้อมช่วงทดลองใช้งานฟรี
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100 dark:border-slate-700">
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
                  <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
                </button>
              ) : <div />}

              {step < 4 ? (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                  ถัดไป <ChevronRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setSubmitted(true)}
                  disabled={!form.agreeTerms || !form.agreeRevShare}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <CheckCircle className="h-5 w-5" /> ส่งใบสมัคร
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-base text-slate-400 dark:text-slate-500">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}
