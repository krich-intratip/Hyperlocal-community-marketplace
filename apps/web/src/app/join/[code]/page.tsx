'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, ShoppingBag, MapPin, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface CommunityPreview {
    id: string
    name: string
    slug: string
    logoUrl?: string
    description?: string
    providerCount?: number
    isActive: boolean
}

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export default function JoinPage() {
    const { code } = useParams<{ code: string }>()
    const router = useRouter()
    const [community, setCommunity] = useState<CommunityPreview | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!code) return
        // Store the invite code in sessionStorage so signup pages can auto-fill community
        sessionStorage.setItem('inviteCode', code)

        fetch(`${API_URL}/communities/join/${code}`)
            .then(async (res) => {
                if (!res.ok) {
                    const msg = res.status === 404
                        ? 'ลิงค์เชิญไม่ถูกต้องหรือชุมชนนี้ปิดให้บริการแล้ว'
                        : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
                    throw new Error(msg)
                }
                return res.json()
            })
            .then((data) => setCommunity(data))
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false))
    }, [code])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
            </div>
        )
    }

    if (error || !community) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 text-center"
                >
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white mb-2">ลิงค์ไม่ถูกต้อง</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{error}</p>
                    <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors">
                        กลับหน้าหลัก
                    </Link>
                </motion.div>
            </div>
        )
    }

    const signupProvider = `/auth/signup?role=provider&inviteCode=${code}`
    const signupCustomer = `/auth/signup?role=customer&inviteCode=${code}`

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-16">
            <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden" animate="show"
                className="max-w-md w-full"
            >
                {/* Header badge */}
                <motion.div variants={fadeUp} className="text-center mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                        <MapPin className="h-3.5 w-3.5" />
                        คุณได้รับคำเชิญ
                    </span>
                </motion.div>

                {/* Community card */}
                <motion.div variants={fadeUp}
                    className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 mb-5"
                >
                    <div className="flex flex-col items-center text-center mb-6">
                        {community.logoUrl ? (
                            <img src={community.logoUrl} alt={community.name}
                                className="h-16 w-16 rounded-full object-cover mb-4 ring-2 ring-amber-200" />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 text-2xl">
                                🏪
                            </div>
                        )}
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                            {community.name}
                        </h1>
                        {community.description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                {community.description}
                            </p>
                        )}
                        {community.providerCount !== undefined && (
                            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <Users className="h-3.5 w-3.5" />
                                <span>ผู้ให้บริการ/ผู้ค้า {community.providerCount} ราย</span>
                            </div>
                        )}
                    </div>

                    {/* Commission info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 text-xs text-blue-700 dark:text-blue-300">
                        <p className="font-bold mb-1">ข้อมูลค่าคอมมิสชั่น</p>
                        <ul className="space-y-1 leading-relaxed">
                            <li>• แพลตฟอร์มเก็บ 5% จากยอดขาย (สำหรับผู้ให้บริการ/ผู้ค้า)</li>
                            <li>• ลูกค้าไม่ต้องจ่ายค่าคอมมิสชั่นเพิ่ม</li>
                            <li>• ค่าขนส่งหรือค่าส่งไม่นับรวมใน commission</li>
                        </ul>
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col gap-3">
                        <Link href={signupProvider}
                            className="flex items-center justify-center gap-2 w-full py-3 px-5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors text-sm"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            สมัครเป็นผู้ให้บริการ / ผู้ค้า
                        </Link>
                        <Link href={signupCustomer}
                            className="flex items-center justify-center gap-2 w-full py-3 px-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors text-sm"
                        >
                            <CheckCircle className="h-4 w-4" />
                            สมัครเป็นลูกค้า
                        </Link>
                    </div>
                </motion.div>

                {/* Info note */}
                <motion.p variants={fadeUp} className="text-center text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
                    ผู้ให้บริการ/ผู้ค้าจะถูกเพิ่มเข้าชุมชนนี้อัตโนมัติและรอการอนุมัติจากผู้จัดการตลาด<br />
                    ลูกค้าจะเข้าร่วมชุมชนได้ทันทีหลังสมัครสำเร็จ
                </motion.p>
            </motion.div>
        </div>
    )
}
