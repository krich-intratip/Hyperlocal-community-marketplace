import Link from 'next/link'
import { MapPin, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto">
          <MapPin className="h-10 w-10 text-blue-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-slate-200 dark:text-slate-700">404</h1>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">ไม่พบหน้านี้</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือไม่มีอยู่
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-300 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก
          </Link>
          <Link href="/communities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            ดูชุมชน
          </Link>
        </div>
      </div>
    </div>
  )
}
