import Link from 'next/link'
import { MarketBackground } from '@/components/market-background'

const TRAINING_MODULES = [
  {
    icon: '🛒',
    title: 'สำรวจตลาด',
    description: 'ดูรายการสินค้าและบริการในชุมชนต่างๆ',
    href: '/marketplace',
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '🏘️',
    title: 'ชุมชนทั้งหมด',
    description: 'รู้จักกับ 25 ชุมชนทั่วประเทศในระบบ',
    href: '/communities',
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-100',
  },
  {
    icon: '📅',
    title: 'การจองบริการ',
    description: 'ฝึกจองบริการและดูสถานะการจอง',
    href: '/bookings',
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100',
  },
  {
    icon: '⭐',
    title: 'รีวิวและประเมิน',
    description: 'ฝึกเขียนรีวิวหลังใช้บริการ',
    href: '/marketplace',
    color: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100',
  },
  {
    icon: '🛍️',
    title: 'ตะกร้าสินค้า',
    description: 'ฝึกการเพิ่มสินค้าและชำระเงิน (Mock)',
    href: '/cart',
    color: 'bg-rose-50 border-rose-200',
    iconBg: 'bg-rose-100',
  },
  {
    icon: '📊',
    title: 'แดชบอร์ด',
    description: 'ดูภาพรวมและรายงานในระบบ',
    href: '/dashboard',
    color: 'bg-indigo-50 border-indigo-200',
    iconBg: 'bg-indigo-100',
  },
]

export default function TrainingPage() {
  return (
    <main className="relative min-h-screen">
      <MarketBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full border border-amber-300 mb-6">
            <span>🎓</span>
            <span>ระบบฝึกอบรม</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ยินดีต้อนรับสู่โหมดฝึกอบรม
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ระบบนี้ใช้ข้อมูล Mock ทั้งหมด เพื่อให้คุณสามารถฝึกใช้งาน Community Hyperlocal
            Marketplace ได้อย่างปลอดภัย โดยไม่กระทบข้อมูลจริง
          </p>
        </div>

        {/* Info card */}
        <div className="glass-card rounded-2xl p-6 mb-10 border border-amber-200 bg-amber-50/80">
          <h2 className="text-lg font-bold text-amber-900 mb-3">ข้อมูลที่ใช้ในการฝึกอบรม</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'ชุมชน', value: '25' },
              { label: 'ผู้ให้บริการ', value: '25' },
              { label: 'รายการบริการ', value: '100+' },
              { label: 'สมาชิกตัวอย่าง', value: '5' },
            ].map((item) => (
              <div key={item.label} className="bg-white/60 rounded-xl p-3">
                <div className="text-2xl font-bold text-amber-700">{item.value}</div>
                <div className="text-sm text-amber-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Training modules grid */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">เริ่มต้นฝึกอบรม</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {TRAINING_MODULES.map((mod) => (
            <Link
              key={mod.title}
              href={mod.href}
              className={`glass-card rounded-2xl p-5 border hover:shadow-lg transition-all hover:-translate-y-0.5 ${mod.color}`}
            >
              <div className={`w-12 h-12 ${mod.iconBg} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                {mod.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{mod.title}</h3>
              <p className="text-sm text-gray-600">{mod.description}</p>
            </Link>
          ))}
        </div>

        {/* Note */}
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">หมายเหตุ:</span>{' '}
            เมื่อพร้อมสำหรับการใช้งานจริง Super Admin จะเปลี่ยนระบบเป็นโหมดใช้งาน
            โดยข้อมูลจะเชื่อมต่อกับฐานข้อมูล Supabase จริงทั้งหมด
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="text-sm text-primary hover:underline font-medium"
            >
              กลับหน้าหลัก
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/guide"
              className="text-sm text-primary hover:underline font-medium"
            >
              คู่มือการใช้งาน
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
