'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { MapPin, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/marketplace', label: 'หาบริการ' },
  { href: '/communities', label: 'ชุมชน' },
  { href: '/guide', label: 'คู่มือ' },
  { href: '/about', label: 'เกี่ยวกับ' },
]

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-b border-blue-100/60 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Community<span className="text-blue-600"> Hyper</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Link href="/auth/signin" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            เข้าสู่ระบบ
          </Link>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors">
              สมัครฟรี
            </Link>
          </motion.div>
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:hidden border-t border-slate-100 bg-white/95 px-4 py-4 space-y-3"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-blue-600 py-1">
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="text-sm text-slate-600">เข้าสู่ระบบ</Link>
            <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">สมัครฟรี</Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
