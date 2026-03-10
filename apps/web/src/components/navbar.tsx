'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Menu, X, Bell, User, Package, LayoutDashboard, LogOut, ChevronDown, ShoppingCart } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { ThemeLanguageToggle } from '@/components/theme-language-toggle'
import { useT } from '@/hooks/useT'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'
import { CartDrawer } from '@/components/cart-drawer'
import { NotificationBell } from '@/components/notification-bell'

const ROLE_LABEL: Record<string, string> = {
  customer: 'ลูกค้า',
  provider: 'ผู้ให้บริการ',
  admin: 'ผู้จัดการตลาด',
  superadmin: 'Super Admin',
}

function UserMenu({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuthStore()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-52 glass-heavy rounded-2xl overflow-hidden z-50"
    >
      <div className="px-4 py-3 border-b border-white/30 dark:border-white/10">
        <p className="font-bold text-sm text-slate-900 dark:text-white">{user?.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{ROLE_LABEL[user?.role ?? 'customer']} · {user?.verified ? 'ยืนยันแล้ว' : 'รอยืนยัน'}</p>
      </div>
      <div className="py-1">
        {[
          { href: '/profile',       icon: User,            label: 'โปรไฟล์ของฉัน' },
          { href: '/bookings',      icon: Package,         label: 'การจองของฉัน' },
          { href: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
          { href: '/notifications', icon: Bell,            label: 'การแจ้งเตือน' },
        ].map(item => (
          <Link key={item.href} href={item.href as any} onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-white/10 transition-colors">
            <item.icon className="h-4 w-4 text-slate-400" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="py-1 border-t border-slate-100 dark:border-slate-700">
        <button onClick={() => { logout(); onClose() }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <LogOut className="h-4 w-4" /> ออกจากระบบ
        </button>
      </div>
    </motion.div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { user, isLoggedIn, logout } = useAuthStore()
  const totalItems = useCartStore((s) => s.totalItems())
  const t = useT()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const NAV_LINKS = [
    { href: '/marketplace', label: t.nav.marketplace },
    { href: '/communities', label: t.nav.communities },
    { href: '/franchise', label: t.nav.franchise },
    { href: '/guide', label: t.nav.guide },
    { href: '/about', label: t.nav.about },
  ]

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-nav sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200/50">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Community<span className="text-gradient-primary"> Hyper</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href as any}
              className={`text-base font-semibold transition-colors ${
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-primary'
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeLanguageToggle />

          {isLoggedIn ? (
            <>
              {/* Cart button */}
              <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-xl hover:bg-white/25 dark:hover:bg-white/10 transition-colors">
                <ShoppingCart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center">{totalItems > 9 ? '9+' : totalItems}</span>
                )}
              </button>

              {/* Notification bell — dynamic badge + dropdown */}
              <NotificationBell />

              {/* Avatar dropdown */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-white/25 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/15 dark:bg-primary/20 flex items-center justify-center text-lg">
                    {user?.avatar ?? '👤'}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 max-w-[80px] truncate">
                    {user?.name ?? ''}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && <UserMenu onClose={() => setUserMenuOpen(false)} />}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                {t.nav.signin}
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/auth/signup" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-base font-semibold text-white shadow-md shadow-indigo-200/50 hover:bg-primary/90 transition-colors">
                  {t.nav.register}
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeLanguageToggle />
          {isLoggedIn && (
            <>
              <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-lg hover:bg-white/25 dark:hover:bg-white/10 transition-colors">
                <ShoppingCart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-primary text-white text-[9px] font-extrabold flex items-center justify-center">{totalItems > 9 ? '9+' : totalItems}</span>
                )}
              </button>
              <NotificationBell />
            </>
          )}
          <button className="p-2 rounded-lg hover:bg-white/25 dark:hover:bg-white/10 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5 text-slate-700 dark:text-slate-200" /> : <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-white/30 dark:border-white/10 glass-heavy px-4 py-4 space-y-3"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href as any} onClick={() => setMenuOpen(false)}
              className="block text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-primary py-1.5">
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/30 dark:border-white/10 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200 py-1.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-lg">{user?.avatar ?? '👤'}</div>
                  {user?.name}
                </Link>
                <Link href="/bookings"   onClick={() => setMenuOpen(false)} className="text-sm text-slate-600 dark:text-slate-300 py-1">การจองของฉัน</Link>
                <Link href="/dashboard"  onClick={() => setMenuOpen(false)} className="text-sm text-slate-600 dark:text-slate-300 py-1">Dashboard</Link>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="text-left text-sm text-red-500 py-1">ออกจากระบบ</button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="text-base text-slate-600 dark:text-slate-300 py-1">{t.nav.signin}</Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-base font-semibold text-white">{t.nav.register}</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </motion.nav>
  )
}
