import { MarketBackground } from '@/components/market-background'
import Link from 'next/link'

const PLANS = [
  {
    tier: 'FREE', nameTH: 'ฟรี', price: 0, color: 'from-slate-400 to-slate-600',
    features: ['รายการสินค้า 5 รายการ', 'รูปภาพ 3 รูป/รายการ', 'ไม่มีสล็อตแนะนำ', 'การสนับสนุนมาตรฐาน'],
    cta: 'เริ่มฟรี', ctaHref: '/auth/signup',
  },
  {
    tier: 'BASIC', nameTH: 'พื้นฐาน', price: 299, color: 'from-blue-500 to-blue-700',
    features: ['รายการสินค้า 20 รายการ', 'รูปภาพ 8 รูป/รายการ', 'สล็อตแนะนำ 2 สล็อต', 'Analytics dashboard', 'การสนับสนุนมาตรฐาน'],
    cta: 'เลือกแผนนี้', ctaHref: '/dashboard/provider/subscription',
  },
  {
    tier: 'PRO', nameTH: 'โปร', price: 699, color: 'from-violet-500 to-purple-700', popular: true,
    features: ['รายการสินค้า 100 รายการ', 'รูปภาพ 20 รูป/รายการ', 'สล็อตแนะนำ 10 สล็อต', 'Analytics ขั้นสูง', 'Priority support'],
    cta: 'เลือกแผนนี้', ctaHref: '/dashboard/provider/subscription',
  },
  {
    tier: 'ENTERPRISE', nameTH: 'องค์กร', price: 1999, color: 'from-amber-500 to-orange-600',
    features: ['รายการสินค้าไม่จำกัด', 'รูปภาพไม่จำกัด', 'สล็อตแนะนำไม่จำกัด', 'Custom branding', 'Dedicated support', 'API access'],
    cta: 'ติดต่อเรา', ctaHref: '/contact',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen relative">
      <MarketBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">แผนการสมัครสมาชิก</h1>
          <p className="text-slate-500 text-lg">เลือกแผนที่เหมาะกับธุรกิจของคุณ</p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.tier}
              className={`relative glass-card rounded-2xl overflow-hidden ${'popular' in plan && plan.popular ? 'ring-2 ring-violet-500 shadow-xl' : ''}`}
            >
              {'popular' in plan && plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-violet-500 text-white text-center text-xs font-semibold py-1">
                  ⭐ ยอดนิยม
                </div>
              )}
              <div className={`bg-gradient-to-br ${plan.color} p-6 ${'popular' in plan && plan.popular ? 'pt-8' : ''}`}>
                <h2 className="text-white font-bold text-xl">{plan.nameTH}</h2>
                <div className="mt-2">
                  {plan.price === 0 ? (
                    <span className="text-white text-3xl font-black">ฟรี</span>
                  ) : (
                    <>
                      <span className="text-white text-3xl font-black">฿{plan.price.toLocaleString()}</span>
                      <span className="text-white/80 text-sm">/เดือน</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaHref as `/${string}`}
                  className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all
                    bg-gradient-to-r ${plan.color} text-white hover:opacity-90`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ section */}
        <div className="mt-16 glass-card rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-700 mb-6 text-center">คำถามที่พบบ่อย</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: 'สามารถยกเลิกได้เมื่อไหร่?', a: 'สามารถยกเลิกได้ทุกเมื่อ แผนจะยังใช้งานได้จนถึงวันสิ้นสุดรอบบิล' },
              { q: 'ชำระเงินด้วยวิธีใดได้บ้าง?', a: 'รองรับ PromptPay, บัตรเครดิต/เดบิต และการโอนเงินธนาคาร' },
              { q: 'อัปเกรดได้ระหว่างรอบบิลไหม?', a: 'ได้เลย ระบบจะคำนวณส่วนต่างตามวันที่เหลืออยู่' },
              { q: 'แผน Enterprise มีอะไรพิเศษ?', a: 'ได้รับ custom branding, API access และ dedicated account manager' },
            ].map(item => (
              <div key={item.q}>
                <h3 className="font-semibold text-slate-700 mb-1">{item.q}</h3>
                <p className="text-slate-500 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
