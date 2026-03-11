'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AppFooter } from '@/components/app-footer'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import {
  Building2, MapPin, User, ChevronRight,
  ChevronLeft, CheckCircle, TrendingUp, Info
} from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '@/lib/date'
import Link from 'next/link'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}

const STEPS = [
  { id: 1, label: 'ขอพื้นที่', icon: MapPin },
  { id: 2, label: 'ข้อมูลตัวคุณ', icon: User },
  { id: 3, label: 'แรงจูงใจ', icon: TrendingUp },
  { id: 4, label: 'ยืนยัน', icon: CheckCircle },
]

const PROVINCES = [
  'กรุงเทพมหานคร', 'เชียงใหม่', 'ภูเก็ต', 'ขอนแก่น', 'นครราชสีมา',
  'ชลบุรี', 'เชียงราย', 'อุดรธานี', 'สงขลา', 'นนทบุรี',
  'สมุทรปราการ', 'ปทุมธานี', 'นครปฐม', 'ระยอง', 'สุราษฎร์ธานี',
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
  useAuthGuard()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    // Step 1 — ขอพื้นที่ (ยังไม่ใช่ชุมชน)
    requestedCommunityType: '',
    requestedProvince: '',
    requestedDistrict: '',
    requestedSubDistrict: '',
    targetCommunityName: '',
    estimatedHouseholds: '',
    // Step 2 — ข้อมูลผู้สมัคร
    fullName: '',
    idCard: '',
    phone: '',
    email: '',
    lineId: '',
    occupation: '',
    // Step 3 — แรงจูงใจ
    why: '',
    experience: '',
    marketingPlan: '',
    agreeTerms: false,
    agreeRevShare: false,
    agreeRules: false,
  })

  function update(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  const today = formatDate(new Date())

  const step3Valid = form.agreeTerms && form.agreeRevShare && form.agreeRules

  if (submitted) {
    return (
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />
        <div className="max-w-xl mx-auto px-4 pt-20 pb-20 text-center">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
            <div className="w-24 h-24 rounded-full glass-sm flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">ส่งใบสมัครสำเร็จ!</h1>
            <p className="text-lg text-slate-500 mb-2">
              ใบสมัครของ <strong className="text-slate-800">{form.fullName}</strong> ถูกรับแล้ว
            </p>
            <p className="text-base text-slate-400 mb-6">
              Super Admin จะตรวจสอบและ<strong className="text-blue-600"> กำหนดพื้นที่</strong>ให้คุณภายใน 3–5 วันทำการ
              เมื่อได้รับการอนุมัติ คุณจะสามารถ<strong className="text-blue-600"> สร้างตลาดชุมชน</strong>และ<strong className="text-blue-600">อนุมัติ Provider</strong>ในพื้นที่นั้นได้
            </p>
            <div className="glass rounded-2xl p-5 mb-4 text-left space-y-3">
              <p className="font-extrabold text-primary text-sm mb-2">ขั้นตอนถัดไปหลังได้รับอนุมัติ</p>
              {[
                { n: '1', t: 'Super Admin อนุมัติ + กำหนดพื้นที่', d: 'ทีมงานตรวจสอบและระบุโลเคชั่นชุมชนให้คุณ' },
                { n: '2', t: 'คุณสร้างตลาดชุมชนในพื้นที่ที่ได้รับ', d: 'ตั้งชื่อ กำหนด Zone และเปิดตลาด' },
                { n: '3', t: 'ตรวจ/อนุมัติ Provider เข้าร่วม', d: 'ผู้ค้าและผู้ให้บริการสมัครเข้าตลาดของคุณ' },
                { n: '4', t: 'ลูกค้าใช้งานตลาด — คุณรับ Revenue Share', d: 'ลูกค้าสมัครฟรี ค้นหาบริการในรัศมี' },
              ].map(s => (
                <div key={s.n} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">{s.n}</div>
                  <div>
                    <p className="font-bold text-blue-800 text-sm">{s.t}</p>
                    <p className="text-xs text-slate-500">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-sm rounded-2xl p-4 mb-6 text-left space-y-1.5">
              <p className="font-bold text-slate-700 text-sm mb-2">สรุปใบสมัคร</p>
              {[
                ['พื้นที่ที่ขอ', `${form.requestedProvince} / ${form.requestedDistrict}`],
                ['ชุมชนเป้าหมาย', form.targetCommunityName || '(Super Admin กำหนดให้)'],
                ['ผู้สมัคร', form.fullName],
                ['เบอร์โทร', form.phone],
                ['วันที่สมัคร', today],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2 text-sm">
                  <span className="text-slate-400 min-w-[120px]">{k}:</span>
                  <span className="font-semibold text-slate-800">{v}</span>
                </div>
              ))}
            </div>
            <Link href="/franchise" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary/90 transition-colors">
              กลับหน้า Franchise
            </Link>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl glass-sm flex items-center justify-center">
              <Building2 className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-sm font-bold text-amber-600 glass-sm px-3 py-1 rounded-full border border-amber-200/60">
              Community Franchise Program
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">สมัครเป็นผู้จัดการตลาดชุมชน</h1>
          <p className="text-base text-slate-500 mt-1">
            ขอพื้นที่เปิดตลาด → Super Admin อนุมัติ + กำหนดโลเคชั่น → สร้างตลาด → อนุมัติ Provider → รับ Revenue Share
          </p>
        </motion.div>

        {/* Flow banner */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="flex items-center glass-sm border border-white/20 rounded-2xl p-3 mb-6 overflow-x-auto gap-0">
          {[
            { icon: '📝', label: 'สมัครขอพื้นที่' },
            { icon: '✅', label: 'Super Admin อนุมัติ' },
            { icon: '🏘️', label: 'สร้างตลาดชุมชน' },
            { icon: '🛒', label: 'Approve Provider' },
            { icon: '💰', label: 'Revenue Share' },
          ].map((f, i, arr) => (
            <div key={f.label} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center px-2">
                <span className="text-lg mb-0.5">{f.icon}</span>
                <span className="text-xs font-semibold text-slate-600 text-center leading-tight max-w-[72px]">{f.label}</span>
              </div>
              {i < arr.length - 1 && <ChevronRight className="h-4 w-4 text-slate-300 mx-1" />}
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
                  step === s.id ? 'bg-primary text-white shadow-lg shadow-primary/20' :
                  'glass-sm text-slate-400'
                }`}>
                  {step > s.id ? '✓' : s.id}
                </div>
                <span className={`text-xs mt-1 font-semibold text-center ${
                  step >= s.id ? 'text-slate-700' : 'text-slate-400'
                }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 mb-4 rounded-full transition-all ${step > s.id ? 'bg-green-400' : 'bg-white/20'}`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Form card */}
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-6">

            {/* ── STEP 1: ขอพื้นที่ ── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-primary" /> ขอพื้นที่เปิดตลาดชุมชน
                  </h2>
                  <div className="flex items-start gap-2 glass border border-primary/20 rounded-xl px-4 py-3">
                    <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">
                      คุณกำลัง<strong> ขอพื้นที่</strong> — Super Admin จะเป็นผู้<strong>อนุมัติและกำหนด</strong>โลเคชั่นสุดท้ายให้คุณ
                      หลังอนุมัติแล้วคุณจึงจะ<strong>สร้างตลาดชุมชน</strong>ได้
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ประเภทชุมชนที่ต้องการ *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COMMUNITY_TYPES.map(ct => (
                      <button key={ct.id} type="button" onClick={() => update('requestedCommunityType', ct.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          form.requestedCommunityType === ct.id
                            ? 'border-primary/50 glass-sm'
                            : 'glass border-white/20 hover:border-primary/30'
                        }`}>
                        <div className="text-xl mb-1">{ct.icon}</div>
                        <div className="text-sm font-bold text-slate-800">{ct.label}</div>
                        <div className="text-xs text-slate-400">{ct.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">จังหวัด *</label>
                    <select value={form.requestedProvince} onChange={e => update('requestedProvince', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass border-white/20 text-base text-slate-800 focus:outline-none focus:border-primary/50">
                      <option value="">เลือกจังหวัด</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">เขต/อำเภอ *</label>
                    <input value={form.requestedDistrict} onChange={e => update('requestedDistrict', e.target.value)}
                      placeholder="เช่น บางรัก, เมือง"
                      className="w-full px-4 py-3 rounded-xl glass border-white/20 text-base text-slate-800 focus:outline-none focus:border-primary/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">แขวง/ตำบล (ถ้ามี)</label>
                  <input value={form.requestedSubDistrict} onChange={e => update('requestedSubDistrict', e.target.value)}
                    placeholder="เช่น สีลม, ท่าแพ"
                    className="w-full px-4 py-3 rounded-xl glass border-white/20 text-base text-slate-800 focus:outline-none focus:border-primary/50" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">ชื่อชุมชน/โครงการที่ตั้งใจ (ถ้ามี)</label>
                  <input value={form.targetCommunityName} onChange={e => update('targetCommunityName', e.target.value)}
                    placeholder="เช่น หมู่บ้านศรีนคร, คอนโด The Base Rama9"
                    className="w-full px-4 py-3 rounded-xl glass border-white/20 text-base text-slate-800 focus:outline-none focus:border-primary/50" />
                  <p className="text-xs text-slate-400 mt-1">Super Admin อาจกำหนดพื้นที่ที่แตกต่างออกไปได้</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">จำนวนครัวเรือนโดยประมาณ *</label>
                  <select value={form.estimatedHouseholds} onChange={e => update('estimatedHouseholds', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass border-white/20 text-base text-slate-800 focus:outline-none focus:border-primary/50">
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
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> ข้อมูลผู้สมัคร
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
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{f.label}</label>
                      <input value={form[f.field as keyof typeof form] as string}
                        onChange={e => update(f.field, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 rounded-xl glass border-white/20 text-base text-slate-800 focus:outline-none focus:border-primary/50" />
                    </div>
                  ))}
                </div>

                <div className="glass-sm border border-amber-200/60 rounded-xl p-4">
                  <p className="text-sm text-amber-800 font-semibold">
                    🔒 ข้อมูลส่วนตัวของคุณจะถูกเก็บเป็นความลับ ใช้เพื่อยืนยันตัวตนเท่านั้น
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP 3: แรงจูงใจ + ข้อตกลง ── */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> แรงจูงใจและแผนงาน
                </h2>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    ทำไมคุณถึงอยากเปิดตลาดชุมชนในพื้นที่นี้? *
                  </label>
                  <textarea value={form.why} onChange={e => update('why', e.target.value)}
                    rows={3} placeholder="เล่าความผูกพันกับชุมชนและแรงบันดาลใจ..."
                    className="w-full px-4 py-3 rounded-xl glass border-white/20 text-base text-slate-800 focus:outline-none focus:border-primary/50 resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    ประสบการณ์ที่เกี่ยวข้อง
                  </label>
                  <textarea value={form.experience} onChange={e => update('experience', e.target.value)}
                    rows={2} placeholder="เช่น เคยเป็นนิติบุคคลหมู่บ้าน 3 ปี, เคยทำธุรกิจออนไลน์..."
                    className="w-full px-4 py-3 rounded-xl glass border-white/20 text-base text-slate-800 focus:outline-none focus:border-primary/50 resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    แผนดึง Provider เข้าร่วมตลาดหลังเปิด
                  </label>
                  <textarea value={form.marketingPlan} onChange={e => update('marketingPlan', e.target.value)}
                    rows={2} placeholder="เช่น ติดประกาศในหมู่บ้าน โพสต์กลุ่ม LINE ชุมชน..."
                    className="w-full px-4 py-3 rounded-xl glass border-white/20 text-base text-slate-800 focus:outline-none focus:border-primary/50 resize-none" />
                </div>

                <div className="space-y-3 pt-3 border-t border-white/20">
                  <p className="text-sm font-extrabold text-slate-700">ข้อตกลงที่ต้องยอมรับ *</p>
                  {[
                    { field: 'agreeTerms', label: 'ฉันยอมรับข้อกำหนดและเงื่อนไข Franchise ของแพลตฟอร์ม' },
                    { field: 'agreeRevShare', label: 'ฉันเข้าใจโครงสร้าง Revenue Share (10% ของ Commission) และยอมรับว่า Super Admin มีสิทธิ์ Suspend, Takeover หรือโอนย้ายชุมชนได้ตามกฎ' },
                    { field: 'agreeRules', label: 'ฉันยืนยันว่าข้อมูลที่ให้เป็นความจริง และยินดีให้ Super Admin ตรวจสอบก่อนอนุมัติ' },
                  ].map(ag => (
                    <label key={ag.field} className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={form[ag.field as keyof typeof form] as boolean}
                        onChange={e => update(ag.field, e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0" />
                      <span className="text-sm text-slate-600">{ag.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 4: ยืนยัน ── */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" /> ตรวจสอบก่อนส่ง
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      section: '📍 พื้นที่ที่ขอ',
                      items: [
                        ['ประเภท', COMMUNITY_TYPES.find(c => c.id === form.requestedCommunityType)?.label ?? '-'],
                        ['จังหวัด / อำเภอ', `${form.requestedProvince} / ${form.requestedDistrict}`],
                        ['ชุมชนเป้าหมาย', form.targetCommunityName || '(Super Admin กำหนดให้)'],
                        ['ขนาด', form.estimatedHouseholds],
                      ],
                    },
                    {
                      section: '👤 ผู้สมัคร',
                      items: [
                        ['ชื่อ', form.fullName],
                        ['โทร', form.phone],
                        ['Email', form.email],
                        ['LINE', form.lineId || '-'],
                      ],
                    },
                  ].map(s => (
                    <div key={s.section} className="glass-sm rounded-xl p-4">
                      <p className="font-bold text-slate-700 text-sm mb-2">{s.section}</p>
                      {s.items.map(([k, v]) => (
                        <div key={k} className="flex gap-2 text-sm py-0.5">
                          <span className="text-slate-400 min-w-[120px]">{k}:</span>
                          <span className="font-semibold text-slate-700 truncate">{v}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="glass-sm border border-green-200/60 rounded-xl p-4">
                  <p className="text-sm text-green-700">
                    หลังส่งใบสมัคร <strong>Super Admin</strong> จะอนุมัติและ<strong>กำหนดโลเคชั่น</strong>ให้คุณภายใน 3–5 วันทำการ
                    จากนั้นคุณจะสามารถ<strong>สร้างตลาดชุมชน</strong>และ<strong>อนุมัติ Provider</strong>ในพื้นที่นั้นได้
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/20">
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-primary transition-colors">
                  <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
                </button>
              ) : <div />}

              {step < 4 ? (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(s => s + 1)}
                  disabled={step === 3 && !step3Valid}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  ถัดไป <ChevronRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setSubmitted(true)}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-colors">
                  <CheckCircle className="h-5 w-5" /> ส่งใบสมัคร
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
      <AppFooter />
    </main>
  )
}
