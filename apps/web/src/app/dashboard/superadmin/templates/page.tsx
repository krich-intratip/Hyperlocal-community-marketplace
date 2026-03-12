'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import {
  Layers, Plus, Edit2, Trash2, X, CheckCircle, Package2,
  ToggleLeft, ToggleRight, Search, ChevronLeft, Save,
} from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06 } }),
}

// ── Types ─────────────────────────────────────────────────────────────────────
const TEMPLATE_CODES = [
  'FOOD','REPAIR','HOME_SERVICES','TUTORING','ELDERLY_CARE',
  'HANDMADE','HEALTH_WELLNESS','AGRICULTURE','FREELANCE','COMMUNITY_SHARING',
] as const
const MODULE_CODES = [
  'POS','ONLINE_ORDER','PROMOTIONS','LOYALTY','RECEIPT',
  'CATALOG','INVENTORY','SUPPLIER',
  'BOOKING','DISPATCH','JOB_TRACKING',
  'MARKETPLACE','SEARCH','REVIEWS','ANNOUNCEMENTS',
  'EXPORT','STATEMENT',
] as const
const MODULE_CATEGORIES = ['COMMERCE','CATALOG','SERVICES','MARKETPLACE','FINANCE'] as const

type TemplateCode = typeof TEMPLATE_CODES[number]
type ModuleCode   = typeof MODULE_CODES[number]
type ModuleCat    = typeof MODULE_CATEGORIES[number]

interface BusinessTemplate {
  id: string
  code: TemplateCode
  name: string
  description: string
  defaultModules: ModuleCode[]
  inventoryPolicy: 'NONE' | 'COUNT' | 'INGREDIENT'
  enabled: boolean
  createdAt: string
}

interface PlatformModule {
  id: string
  code: ModuleCode
  name: string
  description: string
  category: ModuleCat
  isCore: boolean
  enabled: boolean
  createdAt: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const INIT_TEMPLATES: BusinessTemplate[] = [
  { id: 't1', code: 'FOOD', name: 'ธุรกิจอาหาร', description: 'ร้านอาหาร ข้าวกล่อง เบเกอรี ขนม', defaultModules: ['CATALOG','BOOKING','POS','PROMOTIONS','REVIEWS'], inventoryPolicy: 'INGREDIENT', enabled: true, createdAt: '2025-01-01' },
  { id: 't2', code: 'REPAIR', name: 'ซ่อมแซมและช่าง', description: 'ช่างซ่อมแอร์ ประปา ไฟฟ้า ทั่วไป', defaultModules: ['BOOKING','JOB_TRACKING','DISPATCH','REVIEWS'], inventoryPolicy: 'NONE', enabled: true, createdAt: '2025-01-01' },
  { id: 't3', code: 'HOME_SERVICES', name: 'งานบ้านและทำความสะอาด', description: 'แม่บ้าน ทำสวน ดูแลบ้าน', defaultModules: ['BOOKING','JOB_TRACKING','REVIEWS'], inventoryPolicy: 'NONE', enabled: true, createdAt: '2025-01-01' },
  { id: 't4', code: 'TUTORING', name: 'สอนพิเศษและกวดวิชา', description: 'สอนภาษา คณิต วิทย์ ดนตรี', defaultModules: ['BOOKING','CATALOG','REVIEWS'], inventoryPolicy: 'NONE', enabled: true, createdAt: '2025-01-15' },
  { id: 't5', code: 'ELDERLY_CARE', name: 'ดูแลผู้สูงอายุ', description: 'ผู้ดูแลผู้สูงอายุ พยาบาล ฟื้นฟู', defaultModules: ['BOOKING','JOB_TRACKING','REVIEWS'], inventoryPolicy: 'NONE', enabled: true, createdAt: '2025-01-15' },
  { id: 't6', code: 'HANDMADE', name: 'งานฝีมือและของขวัญ', description: 'เทียน สบู่ กระเช้า เครื่องประดับ', defaultModules: ['CATALOG','MARKETPLACE','PROMOTIONS','REVIEWS'], inventoryPolicy: 'COUNT', enabled: true, createdAt: '2025-02-01' },
  { id: 't7', code: 'HEALTH_WELLNESS', name: 'สุขภาพและความงาม', description: 'สปา นวด ฟิตเนส โภชนาการ', defaultModules: ['BOOKING','CATALOG','PROMOTIONS','LOYALTY','REVIEWS'], inventoryPolicy: 'NONE', enabled: true, createdAt: '2025-02-01' },
  { id: 't8', code: 'AGRICULTURE', name: 'เกษตรและผลิตผล', description: 'ผักสวนครัว ผลไม้ ปศุสัตว์', defaultModules: ['CATALOG','MARKETPLACE','INVENTORY','REVIEWS'], inventoryPolicy: 'COUNT', enabled: true, createdAt: '2025-02-15' },
  { id: 't9', code: 'FREELANCE', name: 'ฟรีแลนซ์และดิจิทัล', description: 'ออกแบบ เขียน โปรแกรม การตลาด', defaultModules: ['CATALOG','BOOKING','REVIEWS'], inventoryPolicy: 'NONE', enabled: true, createdAt: '2025-03-01' },
  { id: 't10', code: 'COMMUNITY_SHARING', name: 'แบ่งปันชุมชน', description: 'บริจาค แลกเปลี่ยน ยืม-คืน', defaultModules: ['CATALOG','ANNOUNCEMENTS','MARKETPLACE'], inventoryPolicy: 'NONE', enabled: true, createdAt: '2025-03-01' },
]

const INIT_MODULES: PlatformModule[] = [
  { id: 'm1',  code: 'POS',           name: 'ระบบ POS',           description: 'จุดขาย ออกใบเสร็จ รับชำระเงินหน้าร้าน', category: 'COMMERCE',    isCore: false, enabled: true,  createdAt: '2025-01-01' },
  { id: 'm2',  code: 'ONLINE_ORDER',  name: 'สั่งซื้อออนไลน์',    description: 'รับออเดอร์ผ่านแอป+เว็บ',                 category: 'COMMERCE',    isCore: true,  enabled: true,  createdAt: '2025-01-01' },
  { id: 'm3',  code: 'PROMOTIONS',    name: 'โปรโมชั่นและคูปอง',  description: 'สร้างโปร ลดราคา คูปองโค้ด',              category: 'COMMERCE',    isCore: false, enabled: true,  createdAt: '2025-01-01' },
  { id: 'm4',  code: 'LOYALTY',       name: 'Loyalty Points',     description: 'สะสมแต้ม แลกรางวัล',                     category: 'COMMERCE',    isCore: false, enabled: true,  createdAt: '2025-01-01' },
  { id: 'm5',  code: 'RECEIPT',       name: 'ใบเสร็จและบัญชี',    description: 'ออกใบเสร็จ e-Tax invoice',               category: 'COMMERCE',    isCore: false, enabled: true,  createdAt: '2025-01-01' },
  { id: 'm6',  code: 'CATALOG',       name: 'แค็ตตาล็อกสินค้า',   description: 'จัดการรายการสินค้า/บริการ',              category: 'CATALOG',     isCore: true,  enabled: true,  createdAt: '2025-01-01' },
  { id: 'm7',  code: 'INVENTORY',     name: 'จัดการสต็อก',        description: 'นับสต็อก แจ้งเตือนของใกล้หมด',           category: 'CATALOG',     isCore: false, enabled: true,  createdAt: '2025-01-01' },
  { id: 'm8',  code: 'SUPPLIER',      name: 'จัดการซัพพลายเออร์', description: 'ติดต่อ-สั่งสินค้าจากซัพพลายเออร์',      category: 'CATALOG',     isCore: false, enabled: false, createdAt: '2025-02-01' },
  { id: 'm9',  code: 'BOOKING',       name: 'ระบบจอง',             description: 'จองบริการ เลือกเวลา จ่ายเงินล่วงหน้า',  category: 'SERVICES',    isCore: true,  enabled: true,  createdAt: '2025-01-01' },
  { id: 'm10', code: 'DISPATCH',      name: 'Dispatch งาน',        description: 'มอบหมายงานให้ช่าง ติดตาม GPS',          category: 'SERVICES',    isCore: false, enabled: true,  createdAt: '2025-01-01' },
  { id: 'm11', code: 'JOB_TRACKING',  name: 'ติดตามงาน',           description: 'ลูกค้าติดตามความคืบหน้าแบบเรียลไทม์',  category: 'SERVICES',    isCore: false, enabled: true,  createdAt: '2025-01-01' },
  { id: 'm12', code: 'MARKETPLACE',   name: 'Marketplace',         description: 'ลิสต์สินค้า/บริการในตลาดชุมชน',         category: 'MARKETPLACE', isCore: true,  enabled: true,  createdAt: '2025-01-01' },
  { id: 'm13', code: 'SEARCH',        name: 'ค้นหาและแนะนำ',      description: 'Full-text search + AI recommendation',   category: 'MARKETPLACE', isCore: true,  enabled: true,  createdAt: '2025-01-01' },
  { id: 'm14', code: 'REVIEWS',       name: 'รีวิวและดาว',         description: 'ลูกค้ารีวิว ตอบกลับ วิเคราะห์ sentiment', category: 'MARKETPLACE', isCore: false, enabled: true, createdAt: '2025-01-01' },
  { id: 'm15', code: 'ANNOUNCEMENTS', name: 'ประกาศชุมชน',         description: 'แจ้งข่าว กิจกรรม โปรโมชั่นชุมชน',      category: 'MARKETPLACE', isCore: false, enabled: true,  createdAt: '2025-01-01' },
  { id: 'm16', code: 'EXPORT',        name: 'Export รายงาน',       description: 'Export CSV/Excel รายงานยอดขาย',         category: 'FINANCE',     isCore: false, enabled: true,  createdAt: '2025-02-01' },
  { id: 'm17', code: 'STATEMENT',     name: 'Statement รายเดือน',  description: 'สรุปรายรับ-รายจ่าย ต่อเดือน',          category: 'FINANCE',     isCore: false, enabled: true,  createdAt: '2025-02-01' },
]

const INV_LABEL: Record<string, string> = { NONE: 'ไม่นับสต็อก', COUNT: 'นับชิ้น/ล็อต', INGREDIENT: 'นับวัตถุดิบ' }
const CAT_COLOR: Record<ModuleCat, string> = {
  COMMERCE: 'bg-blue-100 text-blue-700', CATALOG: 'bg-violet-100 text-violet-700',
  SERVICES: 'bg-green-100 text-green-700', MARKETPLACE: 'bg-orange-100 text-orange-700',
  FINANCE: 'bg-rose-100 text-rose-700',
}

type ModalMode = 'none' | 'addTemplate' | 'editTemplate' | 'addModule' | 'editModule' | 'deleteConfirm'

// ── Main Component ─────────────────────────────────────────────────────────────
export default function TemplateBuilderPage() {
  useAuthGuard(['superadmin'])
  const [tab, setTab] = useState<'templates' | 'modules'>('templates')
  const [templates, setTemplates] = useState<BusinessTemplate[]>(INIT_TEMPLATES)
  const [modules, setModules]     = useState<PlatformModule[]>(INIT_MODULES)
  const [search, setSearch]       = useState('')
  const [modal, setModal]         = useState<ModalMode>('none')
  const [editTarget, setEditTarget] = useState<BusinessTemplate | PlatformModule | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; kind: 'template' | 'module' } | null>(null)
  const [saved, setSaved]           = useState(false)

  // ── Template form state ──────────────────────────────────────────────────────
  const [tForm, setTForm] = useState<Partial<BusinessTemplate>>({})

  // ── Module form state ────────────────────────────────────────────────────────
  const [mForm, setMForm] = useState<Partial<PlatformModule>>({})

  function openEditTemplate(t: BusinessTemplate) {
    setTForm({ ...t })
    setEditTarget(t)
    setModal('editTemplate')
  }
  function openAddTemplate() {
    setTForm({ code: 'FOOD', name: '', description: '', defaultModules: [], inventoryPolicy: 'NONE', enabled: true })
    setEditTarget(null)
    setModal('addTemplate')
  }
  function openEditModule(m: PlatformModule) {
    setMForm({ ...m })
    setEditTarget(m)
    setModal('editModule')
  }
  function openAddModule() {
    setMForm({ code: 'POS', name: '', description: '', category: 'COMMERCE', isCore: false, enabled: true })
    setEditTarget(null)
    setModal('addModule')
  }
  function openDelete(id: string, name: string, kind: 'template' | 'module') {
    setDeleteTarget({ id, name, kind })
    setModal('deleteConfirm')
  }

  function saveTemplate() {
    if (!tForm.name?.trim()) return
    if (editTarget) {
      setTemplates((prev) => prev.map((t) => t.id === editTarget.id ? { ...t, ...tForm } as BusinessTemplate : t))
    } else {
      const { id: _id, createdAt: _ca, ...rest } = tForm as BusinessTemplate
      const newT: BusinessTemplate = {
        id: `t${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10),
        ...rest,
      }
      setTemplates((prev) => [...prev, newT])
    }
    flash(); setModal('none')
  }
  function saveModule() {
    if (!mForm.name?.trim()) return
    if (editTarget) {
      setModules((prev) => prev.map((m) => m.id === editTarget.id ? { ...m, ...mForm } as PlatformModule : m))
    } else {
      const { id: _id, createdAt: _ca, ...rest } = mForm as PlatformModule
      const newM: PlatformModule = {
        id: `m${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10),
        ...rest,
      }
      setModules((prev) => [...prev, newM])
    }
    flash(); setModal('none')
  }
  function confirmDelete() {
    if (!deleteTarget) return
    if (deleteTarget.kind === 'template') setTemplates((p) => p.filter((t) => t.id !== deleteTarget.id))
    else setModules((p) => p.filter((m) => m.id !== deleteTarget.id))
    flash(); setModal('none')
  }
  function toggleTemplate(id: string) {
    setTemplates((p) => p.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t))
    flash()
  }
  function toggleModule(id: string) {
    setModules((p) => p.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m))
    flash()
  }
  function flash() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const filteredTemplates = templates.filter((t) =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.code.includes(search.toUpperCase())
  )
  const filteredModules = modules.filter((m) =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.code.includes(search.toUpperCase())
  )

  return (
    <main className="min-h-screen overflow-x-hidden">
      <MarketBackground />
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-6">
          <Link href="/dashboard/superadmin" className="flex items-center gap-1 text-sm text-primary font-semibold mb-3 hover:underline">
            <ChevronLeft className="h-4 w-4" /> SuperAdmin Dashboard
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-primary">Template Builder</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Business Templates & Platform Modules</h1>
              <p className="text-slate-500 text-sm mt-1">
                จัดการ Templates ธุรกิจและ Modules ของแพลตฟอร์ม
              </p>
            </div>
            {/* Save flash */}
            <AnimatePresence>
              {saved && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl text-sm font-semibold text-green-700">
                  <CheckCircle className="h-4 w-4" /> บันทึกแล้ว
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Tab + Search + Add button */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1 glass-sm p-1 rounded-xl">
            {(['templates', 'modules'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-white/40'
                }`}>
                {t === 'templates' ? `📋 Templates (${templates.length})` : `🧩 Modules (${modules.length})`}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-40">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหา..."
                className="w-full pl-9 pr-4 py-2.5 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <button onClick={tab === 'templates' ? openAddTemplate : openAddModule}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-primary/30">
            <Plus className="h-4 w-4" />
            เพิ่ม{tab === 'templates' ? 'Template' : 'Module'}
          </button>
        </motion.div>

        {/* ── TEMPLATES TAB ────────────────────────────────────────────── */}
        {tab === 'templates' && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20 bg-white/10">
                    <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Template</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide hidden md:table-cell">Default Modules</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide hidden lg:table-cell">Inventory</th>
                    <th className="text-center px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">สถานะ</th>
                    <th className="text-right px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredTemplates.map((t) => (
                    <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-white/10 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-800">{t.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{t.code} · {t.description}</div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {t.defaultModules.slice(0, 4).map((m) => (
                            <span key={m} className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{m}</span>
                          ))}
                          {t.defaultModules.length > 4 && (
                            <span className="text-xs text-slate-400">+{t.defaultModules.length - 4}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-xs font-semibold text-slate-500">{INV_LABEL[t.inventoryPolicy]}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button onClick={() => toggleTemplate(t.id)}
                          className={`flex items-center gap-1 mx-auto text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                            t.enabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                          {t.enabled
                            ? <><ToggleRight className="h-3.5 w-3.5" /> เปิด</>
                            : <><ToggleLeft className="h-3.5 w-3.5" /> ปิด</>}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditTemplate(t)}
                            className="p-1.5 rounded-lg glass-sm hover:bg-white/40 transition-colors text-slate-500 hover:text-primary">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => openDelete(t.id, t.name, 'template')}
                            className="p-1.5 rounded-lg glass-sm hover:bg-red-50 transition-colors text-slate-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── MODULES TAB ──────────────────────────────────────────────── */}
        {tab === 'modules' && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20 bg-white/10">
                    <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Module</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Category</th>
                    <th className="text-center px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Core</th>
                    <th className="text-center px-4 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">สถานะ</th>
                    <th className="text-right px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredModules.map((m) => (
                    <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-white/10 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-800">{m.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono">{m.code} · {m.description}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CAT_COLOR[m.category]}`}>
                          {m.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {m.isCore
                          ? <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Core</span>
                          : <span className="text-xs text-slate-400">Optional</span>}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button onClick={() => toggleModule(m.id)}
                          className={`flex items-center gap-1 mx-auto text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                            m.enabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                          {m.enabled
                            ? <><ToggleRight className="h-3.5 w-3.5" /> เปิด</>
                            : <><ToggleLeft className="h-3.5 w-3.5" /> ปิด</>}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModule(m)}
                            className="p-1.5 rounded-lg glass-sm hover:bg-white/40 transition-colors text-slate-500 hover:text-primary">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => openDelete(m.id, m.name, 'module')} disabled={m.isCore}
                            className="p-1.5 rounded-lg glass-sm hover:bg-red-50 transition-colors text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </section>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {/* Template Form Modal */}
        {(modal === 'addTemplate' || modal === 'editTemplate') && (
          <ModalWrapper onClose={() => setModal('none')}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {modal === 'addTemplate' ? 'เพิ่ม Business Template' : 'แก้ไข Template'}
              </h3>
              <button onClick={() => setModal('none')} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Template Code</label>
                  <select value={tForm.code ?? 'FOOD'} onChange={(e) => setTForm((p) => ({ ...p, code: e.target.value as TemplateCode }))}
                    className="w-full px-3 py-2.5 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent">
                    {TEMPLATE_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Inventory Policy</label>
                  <select value={tForm.inventoryPolicy ?? 'NONE'} onChange={(e) => setTForm((p) => ({ ...p, inventoryPolicy: e.target.value as BusinessTemplate['inventoryPolicy'] }))}
                    className="w-full px-3 py-2.5 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent">
                    <option value="NONE">NONE — ไม่นับสต็อก</option>
                    <option value="COUNT">COUNT — นับชิ้น/ล็อต</option>
                    <option value="INGREDIENT">INGREDIENT — นับวัตถุดิบ</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">ชื่อ Template <span className="text-red-500">*</span></label>
                <input value={tForm.name ?? ''} onChange={(e) => setTForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="เช่น ธุรกิจอาหารชุมชน"
                  className="w-full px-3 py-2.5 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">คำอธิบาย</label>
                <textarea value={tForm.description ?? ''} onChange={(e) => setTForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2} placeholder="ใช้สำหรับ..."
                  className="w-full px-3 py-2.5 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Default Modules</label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {MODULE_CODES.map((mc) => {
                    const active = (tForm.defaultModules ?? []).includes(mc)
                    return (
                      <button key={mc} type="button"
                        onClick={() => setTForm((p) => ({
                          ...p,
                          defaultModules: active
                            ? (p.defaultModules ?? []).filter((x) => x !== mc)
                            : [...(p.defaultModules ?? []), mc],
                        }))}
                        className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all ${
                          active ? 'bg-primary text-white border-primary' : 'glass-sm border-white/40 text-slate-600 hover:border-primary/40'
                        }`}>
                        {mc}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal('none')}
                  className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:glass-sm transition-colors">
                  ยกเลิก
                </button>
                <button onClick={saveTemplate} disabled={!tForm.name?.trim()}
                  className="flex-1 rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  <Save className="h-4 w-4" /> บันทึก
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}

        {/* Module Form Modal */}
        {(modal === 'addModule' || modal === 'editModule') && (
          <ModalWrapper onClose={() => setModal('none')}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {modal === 'addModule' ? 'เพิ่ม Platform Module' : 'แก้ไข Module'}
              </h3>
              <button onClick={() => setModal('none')} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Module Code</label>
                  <select value={mForm.code ?? 'POS'} onChange={(e) => setMForm((p) => ({ ...p, code: e.target.value as ModuleCode }))}
                    className="w-full px-3 py-2.5 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent">
                    {MODULE_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Category</label>
                  <select value={mForm.category ?? 'COMMERCE'} onChange={(e) => setMForm((p) => ({ ...p, category: e.target.value as ModuleCat }))}
                    className="w-full px-3 py-2.5 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent">
                    {MODULE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">ชื่อ Module <span className="text-red-500">*</span></label>
                <input value={mForm.name ?? ''} onChange={(e) => setMForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="เช่น ระบบจอง"
                  className="w-full px-3 py-2.5 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">คำอธิบาย</label>
                <textarea value={mForm.description ?? ''} onChange={(e) => setMForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2.5 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={mForm.isCore ?? false}
                    onChange={(e) => setMForm((p) => ({ ...p, isCore: e.target.checked }))}
                    className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-semibold text-slate-700">Core Module (บังคับทุก Market)</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal('none')}
                  className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:glass-sm transition-colors">
                  ยกเลิก
                </button>
                <button onClick={saveModule} disabled={!mForm.name?.trim()}
                  className="flex-1 rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  <Save className="h-4 w-4" /> บันทึก
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}

        {/* Delete Confirm Modal */}
        {modal === 'deleteConfirm' && deleteTarget && (
          <ModalWrapper onClose={() => setModal('none')}>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-extrabold text-slate-900 mb-2">ยืนยันการลบ</h3>
              <p className="text-sm text-slate-600 mb-6">
                ต้องการลบ <strong>{deleteTarget.name}</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
              </p>
              <div className="flex gap-3">
                <button onClick={() => setModal('none')}
                  className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:glass-sm">
                  ยกเลิก
                </button>
                <button onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-500 text-white px-4 py-2.5 text-sm font-bold hover:bg-red-600 transition-colors">
                  ลบ
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      <AppFooter />
    </main>
  )
}

function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="w-full max-w-lg glass-heavy rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        {children}
      </motion.div>
    </motion.div>
  )
}
