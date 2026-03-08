'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { MapPin, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ThemeLanguageToggle } from '@/components/theme-language-toggle'
import { useT } from '@/hooks/useT'

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const t = useT()

  const NAV_LINKS = [
    { href: '/marketplace', label: t.nav.marketplace },
    { href: '/communities', label: t.nav.communities },
    { href: '/franchise', label: t.nav.franchise },
    { href: '/guide', label: t.nav.guide },
    { href: '/about', label: t.nav.about },
  ]

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-b border-blue-100/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Community<span className="text-blue-600"> Hyper</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-semibold transition-colors ${
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeLanguageToggle />
          <Link href="/auth/signin" className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {t.nav.signin}
          </Link>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-base font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors">
              {t.nav.register}
            </Link>
          </motion.div>
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeLanguageToggle />
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5 text-slate-700 dark:text-slate-200" /> : <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 py-4 space-y-3"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 py-1.5">
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="text-base text-slate-600 dark:text-slate-300 py-1">{t.nav.signin}</Link>
            <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-base font-semibold text-white">{t.nav.register}</Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
