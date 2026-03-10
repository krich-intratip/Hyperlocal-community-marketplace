'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MarketBackground } from '@/components/market-background'
import { AppFooter } from '@/components/app-footer'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Star, ChevronLeft,
  X, CheckCircle, AlertCircle, Package,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

const CATEGORIES = [
  'FOOD', 'REPAIR', 'HOME_SERVICES', 'TUTORING', 'ELDERLY_CARE',
  'HANDMADE', 'HEALTH_WELLNESS', 'AGRICULTURE', 'FREELANCE', 'COMMUNITY_SHARING',
]
const CAT_TH: Record<string, string> = {
  FOOD: 'อาหาร', REPAIR: 'งานช่าง', HOME_SERVICES: 'งานบ้าน', TUTORING: 'สอนพิเศษ',
  ELDERLY_CARE: 'ดูแลผู้สูงอายุ', HANDMADE: 'สินค้าทำมือ', HEALTH_WELLNESS: 'สุขภาพ',
  AGRICULTURE: 'เกษตร', FREELANCE: 'ฟรีแลนซ์', COMMUNITY_SHARING: 'Community Sharing',
}

interface Listing {
  id: string; title: string; category: string; price: number; unit: string
  image: string; description: string; imageUrl: string
  views: number; bookings: number; rating: number; active: boolean
}

const INITIAL_LISTINGS: Listing[] = [
  { id: '1', title: 'ทำอาหารกล่องส่งถึงที่', category: 'FOOD', price: 80, unit: 'กล่อง', image: '🍱', description: 'อาหารกล่องสดใหม่ปรุงทุกวัน ส้มตำ ลาบ ข้าวหน้าต่างๆ ส่งถึงที่ในหมู่บ้าน', imageUrl: '', views: 234, bookings: 128, rating: 4.9, active: true },
  { id: '2', title: 'อาหารคลีนออเดอร์ล่วงหน้า', category: 'FOOD', price: 120, unit: 'กล่อง', image: '🥗', description: 'อาหารคลีนแคลอรี่ต่ำ สั่งล่วงหน้า 1 วัน เหมาะกับผู้รักสุขภาพ', imageUrl: '', views: 89, bookings: 34, rating: 4.8, active: true },
  { id: '3', title: 'ข้าวกล่องส้มตำ', category: 'FOOD', price: 65, unit: 'กล่อง', image: '🍛', description: 'ส้มตำไทย ส้มตำปู ลาบหมู น้ำตก พร้อมข้าวสวย', imageUrl: '', views: 45, bookings: 12, rating: 4.7, active: false },
]

interface FormData { title: string; category: string; price: string; unit: string; image: string; description: string; imageUrl: string }
const EMPTY_FORM: FormData = { title: '', category: 'FOOD', price: '', unit: 'กล่อง', image: '🍱', description: '', imageUrl: '' }
const EMOJI_OPTIONS = ['🍱', '🥗', '🍛', '🍖', '🔧', '🏠', '📚', '💆', '🎨', '🌿', '💻', '🤝', '👴']

export default function ProviderListingsPage() {
  useAuthGuard(['provider', 'admin', 'superadmin'])
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function openNew() {
    setEditId(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(l: Listing) {
    setEditId(l.id)
    setForm({ title: l.title, category: l.category, price: String(l.price), unit: l.unit, image: l.image, description: l.description, imageUrl: l.imageUrl })
    setShowModal(true)
  }

  function handleSave() {
    if (!form.title || !form.price) return
    if (editId) {
      setListings(prev => prev.map(l => l.id === editId
        ? { ...l, title: form.title, category: form.category, price: Number(form.price), unit: form.unit, image: form.image, description: form.description, imageUrl: form.imageUrl }
        : l
      ))
    } else {
      const newId = String(Date.now())
      setListings(prev => [...prev, {
        id: newId, title: form.title, category: form.category,
        price: Number(form.price), unit: form.unit, image: form.image,
        description: form.description, imageUrl: form.imageUrl,
        views: 0, bookings: 0, rating: 0, active: true,
      }])
    }
    setShowModal(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function toggleActive(id: string) {
    setListings(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l))
  }

  function confirmDelete(id: string) { setDeleteId(id) }
  function handleDelete() {
    if (deleteId) setListings(prev => prev.filter(l => l.id !== deleteId))
    setDeleteId(null)
  }

  const activeCount = listings.filter(l => l.active).length

  return (
    <>
      {/* ── Save toast ── */}
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-bold">
            <CheckCircle className="h-4 w-4" /> บันทึกสำเร็จ
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirm ── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-extrabold text-slate-900 mb-2">ลบ Listing นี้?</h3>
              <p className="text-sm text-slate-500 mb-5">ข้อมูลจะถูกลบถาวร ไม่สามารถกู้คืนได้</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">
                  ยกเลิก
                </button>
                <button onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-bold text-white hover:bg-red-600">
                  ลบ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Form modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-slate-900">{editId ? 'แก้ไข Listing' : 'เพิ่ม Listing ใหม่'}</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Emoji picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">ไอคอน</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map(e => (
                      <button key={e} onClick={() => setForm(f => ({ ...f, image: e }))}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                          form.image === e ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-200'
                        }`}>{e}</button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">ชื่อบริการ <span className="text-red-500">*</span></label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="เช่น ทำอาหารกล่องส่งถึงที่"
                    className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none" />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">หมวดหมู่</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-3 text-sm text-slate-800 outline-none bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_TH[c]}</option>)}
                  </select>
                </div>

                {/* Price + Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">ราคา (฿) <span className="text-red-500">*</span></label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="80"
                      className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-3 text-sm text-slate-800 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">หน่วย</label>
                    <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                      placeholder="กล่อง / ชั่วโมง / ครั้ง"
                      className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-3 text-sm text-slate-800 outline-none" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">คำอธิบายบริการ</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} placeholder="อธิบายรายละเอียดบริการ วัตถุดิบ ขั้นตอน หรือเงื่อนไขพิเศษ..."
                    className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-3 text-sm text-slate-800 outline-none resize-none" />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">URL รูปภาพ (ถ้ามี)</label>
                  <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://... (เช่น รูปจาก Google Drive, Imgur)"
                    className="w-full rounded-xl border border-slate-200 focus:border-blue-400 px-4 py-3 text-sm text-slate-800 outline-none" />
                  {form.imageUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-1">หากไม่ใส่ URL จะใช้ไอคอน Emoji แทน</p>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={!form.title || !form.price}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  <CheckCircle className="h-4 w-4" /> {editId ? 'บันทึกการแก้ไข' : 'เพิ่ม Listing'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main page ── */}
      <main className="min-h-screen overflow-x-hidden">
        <MarketBackground />
        <Navbar />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

          {/* Breadcrumb */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/dashboard/provider" className="hover:text-blue-600 flex items-center gap-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Provider Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">จัดการ Listings</span>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-500" /> จัดการ Listings
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {activeCount} รายการกำลังเปิดรับงาน · รวม {listings.length} รายการ
              </p>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={openNew}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" /> เพิ่ม Listing
            </motion.button>
          </motion.div>

          {/* Listings */}
          {listings.length === 0 ? (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="text-center py-20">
              <Package className="h-14 w-14 text-slate-200 mx-auto mb-4" />
              <p className="font-bold text-slate-500 mb-2">ยังไม่มี Listing</p>
              <p className="text-sm text-slate-400 mb-5">เพิ่ม Listing แรกเพื่อเริ่มรับงาน</p>
              <button onClick={openNew}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" /> เพิ่ม Listing แรก
              </button>
            </motion.div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {listings.map((listing, i) => (
                <motion.div key={listing.id} variants={fadeUp} custom={i}
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl border shadow-sm p-5 transition-all ${
                    listing.active ? 'border-slate-100' : 'border-slate-200 opacity-70'
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                      {listing.imageUrl
                        ? <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        : listing.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm">{listing.title}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          listing.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>{listing.active ? 'เปิดรับงาน' : 'ปิดชั่วคราว'}</span>
                      </div>
                      {listing.description && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{listing.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                        <span className="font-bold text-blue-600">฿{listing.price}/{listing.unit}</span>
                        <span>{CAT_TH[listing.category]}</span>
                        {listing.rating > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {listing.rating}
                          </span>
                        )}
                        <span>{listing.views} views</span>
                        <span>{listing.bookings} bookings</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => toggleActive(listing.id)}
                        title={listing.active ? 'ปิดชั่วคราว' : 'เปิดรับงาน'}
                        className="w-9 h-9 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-all">
                        {listing.active
                          ? <EyeOff className="h-4 w-4 text-slate-500" />
                          : <Eye className="h-4 w-4 text-slate-500" />}
                      </button>
                      <button onClick={() => openEdit(listing)}
                        className="w-9 h-9 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-all">
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </button>
                      <button onClick={() => confirmDelete(listing.id)}
                        className="w-9 h-9 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 flex items-center justify-center transition-all">
                        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {listings.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={listings.length + 2}
              className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              การเปลี่ยนแปลงจะมีผลทันทีในหน้า Marketplace
            </motion.div>
          )}
        </section>
      <AppFooter />
      </main>
    </>
  )
}
