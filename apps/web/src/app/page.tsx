import Link from 'next/link'
import { MapPin, Star, Shield, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Community Hyper Marketplace</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              สมัครสมาชิกฟรี
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          เปิดทดสอบระบบ — สมัครและใช้งานฟรี
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6">
          ตลาดบริการชุมชน
          <span className="text-primary"> ใกล้บ้านคุณ</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
          เชื่อมต่อผู้ให้บริการในชุมชนกับผู้อยู่อาศัย — ช่าง, แม่บ้าน, ติวเตอร์, อาหาร
          และอีกมากมาย ผ่านแพลตฟอร์มที่น่าเชื่อถือ
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/communities"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          >
            ค้นหาชุมชนของคุณ
          </Link>
          <Link
            href="/auth/signin?role=provider"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium hover:bg-accent transition-colors"
          >
            เป็นผู้ให้บริการ
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-white shadow-sm border">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Hyperlocal</h3>
            <p className="text-muted-foreground text-sm">
              ค้นหาบริการภายในชุมชนของคุณ — ใกล้บ้าน เดินทางสะดวก
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white shadow-sm border">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">น่าเชื่อถือ</h3>
            <p className="text-muted-foreground text-sm">
              ผู้ให้บริการผ่านการยืนยันตัวตน มีระบบรีวิวและคะแนนความน่าเชื่อถือ
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white shadow-sm border">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">ชุมชนแข็งแกร่ง</h3>
            <p className="text-muted-foreground text-sm">
              สร้างเศรษฐกิจชุมชน เชื่อมต่อผู้คน กระจายรายได้ในท้องถิ่น
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">หมวดบริการยอดนิยม</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/marketplace?category=${cat.slug}`}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white border hover:border-primary hover:shadow-md transition-all group"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          © 2026 Community Hyper Marketplace — Local Economy Operating System
        </div>
      </footer>
    </main>
  )
}

const CATEGORIES = [
  { slug: 'FOOD', name: 'อาหาร', icon: '🍱' },
  { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧' },
  { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠' },
  { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚' },
  { slug: 'ELDERLY_CARE', name: 'ดูแลผู้สูงอายุ', icon: '👴' },
  { slug: 'HANDMADE', name: 'สินค้าทำมือ', icon: '🎨' },
  { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ', icon: '💆' },
  { slug: 'AGRICULTURE', name: 'เกษตรชุมชน', icon: '🌿' },
  { slug: 'FREELANCE', name: 'ฟรีแลนซ์', icon: '💻' },
  { slug: 'COMMUNITY_SHARING', name: 'Community Sharing', icon: '🤝' },
]
