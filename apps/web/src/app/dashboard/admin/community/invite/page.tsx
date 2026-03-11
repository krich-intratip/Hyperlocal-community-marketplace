'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Copy, Check, Share2, Users, Clock, ChevronRight,
    Loader2, QrCode,
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chm.app'

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

interface PendingMember {
    id: string
    userId: string
    email?: string
    fullName?: string
    joinedAt: string
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
    invitedByCode?: string
}

interface InviteInfo {
    inviteCode: string
    inviteLink: string
    communityName: string
}

export default function CommunityInvitePage() {
    const [info, setInfo] = useState<InviteInfo | null>(null)
    const [pending, setPending] = useState<PendingMember[]>([])
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [processingId, setProcessingId] = useState<string | null>(null)

    useEffect(() => {
        // Fetch invite code for the logged-in CA's community
        Promise.all([
            fetch(`${API_URL}/communities/my/invite-code`, { credentials: 'include' }).then(r => r.json()),
            fetch(`${API_URL}/communities/my/pending-members`, { credentials: 'include' }).then(r => r.json()),
        ])
            .then(([inviteData, pendingData]) => {
                const code = inviteData.inviteCode ?? ''
                setInfo({
                    inviteCode: code,
                    inviteLink: `${BASE_URL}/join/${code}`,
                    communityName: inviteData.communityName ?? 'ชุมชนของคุณ',
                })
                setPending(Array.isArray(pendingData) ? pendingData : [])
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const handleCopy = async () => {
        if (!info) return
        await navigator.clipboard.writeText(info.inviteLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    const handleShare = () => {
        if (!info) return
        if (navigator.share) {
            navigator.share({
                title: `เข้าร่วม ${info.communityName}`,
                text: `สมัครเข้าร่วมตลาดชุมชน ${info.communityName} ได้เลย!`,
                url: info.inviteLink,
            }).catch(() => { /* user dismissed */ })
        } else handleCopy()
    }

    const handleApprove = async (memberId: string) => {
        setProcessingId(memberId)
        try {
            await fetch(`${API_URL}/communities/my/members/${memberId}/approve`, {
                method: 'PATCH',
                credentials: 'include',
            })
            setPending(prev => prev.filter(m => m.id !== memberId))
        } catch { /* handle error */ }
        finally { setProcessingId(null) }
    }

    const handleReject = async (memberId: string) => {
        setProcessingId(memberId)
        try {
            await fetch(`${API_URL}/communities/my/members/${memberId}/reject`, {
                method: 'PATCH',
                credentials: 'include',
            })
            setPending(prev => prev.filter(m => m.id !== memberId))
        } catch { /* handle error */ }
        finally { setProcessingId(null) }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
            </div>
        )
    }

    return (
        <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden" animate="show"
            className="max-w-2xl mx-auto px-4 py-8 space-y-6"
        >
            {/* Header */}
            <motion.div variants={fadeUp}>
                <h1 className="text-xl font-extrabold text-slate-900">
                    ลิงค์เชิญสมาชิก
                </h1>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    แชร์ลิงค์นี้ให้ผู้ให้บริการ/ผู้ค้า และลูกค้า เพื่อเข้าร่วม{info?.communityName}
                </p>
            </motion.div>

            {/* Invite link card */}
            {info && (
                <motion.div variants={fadeUp}
                    className="glass-card rounded-2xl shadow-sm p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <QrCode className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <span className="text-sm font-bold text-slate-700">Invite Link ของคุณ</span>
                        <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            ไม่หมดอายุ
                        </span>
                    </div>

                    {/* Link display */}
                    <div className="glass-sm rounded-xl p-3 mb-4 flex items-center gap-2 overflow-hidden">
                        <span className="text-xs text-slate-600 truncate flex-1 select-all">
                            {info.inviteLink}
                        </span>
                    </div>

                    {/* Invite Code badge */}
                    <div className="mb-5 flex items-center gap-2">
                        <span className="text-xs text-slate-500">รหัสชุมชน:</span>
                        <code className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-mono font-bold tracking-wide">
                            {info.inviteCode}
                        </code>
                    </div>

                    {/* CTA buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleCopy}
                            id="btn-copy-invite-link"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงค์'}
                        </button>
                        <button
                            onClick={handleShare}
                            id="btn-share-invite"
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl glass-sm hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
                        >
                            <Share2 className="h-4 w-4" />
                            แชร์
                        </button>
                    </div>

                    {/* Info note */}
                    <div className="mt-4 text-xs text-slate-400 space-y-1 leading-relaxed">
                        <p>• <strong className="text-slate-500">ผู้ให้บริการ/ผู้ค้า</strong> ที่สมัครผ่านลิงค์นี้ จะอยู่ในสถานะ "รอการอนุมัติ" จนกว่าคุณจะอนุมัติ</p>
                        <p>• <strong className="text-slate-500">ลูกค้า</strong> ที่สมัครผ่านลิงค์นี้ จะเข้าร่วมชุมชนได้ทันที</p>
                    </div>
                </motion.div>
            )}

            {/* Pending members */}
            <motion.div variants={fadeUp}>
                <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-slate-500" />
                    <h2 className="text-sm font-bold text-slate-700">
                        รอการอนุมัติ ({pending.length})
                    </h2>
                </div>

                {pending.length === 0 ? (
                    <div className="glass-card rounded-2xl p-6 text-center">
                        <p className="text-sm text-slate-400">ไม่มีผู้ให้บริการ/ผู้ค้ารอการอนุมัติในขณะนี้</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pending.map((member) => (
                            <motion.div key={member.id} layout
                                className="glass-card rounded-2xl p-4 flex items-center gap-4"
                            >
                                <div className="h-10 w-10 rounded-full glass-sm flex items-center justify-center text-slate-500 font-bold text-sm flex-shrink-0">
                                    {(member.fullName ?? member.email ?? '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {member.fullName ?? 'ไม่ระบุชื่อ'}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">{member.email}</p>
                                    <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                                        <Clock className="h-3 w-3" />
                                        <span>สมัคร {new Date(member.joinedAt).toLocaleDateString('th-TH')}</span>
                                        {member.invitedByCode && (
                                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-medium">
                                                ผ่านลิงค์เชิญ
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        id={`btn-approve-${member.id}`}
                                        onClick={() => handleApprove(member.id)}
                                        disabled={processingId === member.id}
                                        className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                                    >
                                        {processingId === member.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <>
                                                <Check className="h-3 w-3" />
                                                อนุมัติ
                                            </>
                                        )}
                                    </button>
                                    <button
                                        id={`btn-reject-${member.id}`}
                                        onClick={() => handleReject(member.id)}
                                        disabled={processingId === member.id}
                                        className="px-3 py-1.5 rounded-lg glass-sm hover:bg-red-50 hover:text-red-600 disabled:opacity-50 text-slate-600 text-xs font-semibold transition-colors"
                                    >
                                        ปฏิเสธ
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Quick links */}
            <motion.div variants={fadeUp}
                className="rounded-2xl border border-white/20 shadow-sm overflow-hidden"
            >
                {[
                    { label: 'ดูสถิติตลาดชุมชน', href: '/dashboard/admin/analytics' },
                    { label: 'ประวัติการรับ Revenue Share', href: '/dashboard/admin/payout-history' },
                ].map((link) => (
                    <a key={link.href} href={link.href}
                        className="flex items-center gap-3 px-5 py-3.5 glass-sm hover:bg-white/30 border-b border-white/20 last:border-0 transition-colors"
                    >
                        <span className="text-sm text-slate-700 flex-1">{link.label}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                    </a>
                ))}
            </motion.div>
        </motion.div>
    )
}
