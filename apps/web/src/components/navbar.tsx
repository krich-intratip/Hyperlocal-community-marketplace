'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Menu, X, Bell, User, Package, LayoutDashboard, LogOut, ChevronDown, ShoppingCart, Search, Loader2, Heart, MessageSquare } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { ThemeLanguageToggle } from '@/components/theme-language-toggle'
import { useT } from '@/hooks/useT'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'
import { useWishlistStore } from '@/store/wishlist.store'
import { CartDrawer } from '@/components/cart-drawer'
import { NotificationBell } from '@/components/notification-bell'
import { useSearch } from '@/hooks/useSearch'
import { useUnreadMessageCount } from '@/hooks/useMessages'

// ── Search Bar component ──────────────────────────────────────────────────────
function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const { results, loading } = useSearch(query)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActiveIdx(-1)
    setOpen(query.trim().length > 0)
  }, [query, results])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)) }
    if (e.key === 'Escape')    { setOpen(false); setQuery('') }
    if (e.key === 'Enter') {
      if (activeIdx >= 0 && results[activeIdx]) {
        router.push(`/marketplace/${results[activeIdx].id}` as any)
        setQuery(''); setOpen(false)
      } else if (query.trim()) {
        router.push(`/marketplace?q=${encodeURIComponent(query.trim())}` as any)
        setQuery(''); setOpen(false)
      }
    }
  }

  function handleSelect(id: string) {
    router.push(`/marketplace/${id}` as any)
    setQuery(''); setOpen(false)
  }

  const CAT_EMOJI: Record<string, string> = {
    FOOD:'🍱', REPAIR:'🔧', HOME_SERVICES:'🏠', TUTORING:'📚',
    HEALTH_WELLNESS:'💊', AGRICULTURE:'🌾', FREELANCE:'💻',
    ELDERLY_CARE:'🧓', HANDMADE:'🎨', COMMUNITY_SHARING:'🤝',
  }

  return (
    <div ref={wrapRef} className="relative w-64 lg:w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 animate-spin" />}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="ค้นหาสินค้า บริการ ร้านค้า..."
          className="w-full pl-9 pr-4 py-2 glass border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-slate-400"
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 glass-heavy rounded-2xl shadow-xl overflow-hidden z-50 border border-white/30">
            {results.length === 0 && !loading && (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">ไม่พบผลลัพธ์</div>
            )}
            {results.map((r, i) => (
              <button key={r.id} onClick={() => handleSelect(r.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === activeIdx ? 'bg-primary/10' : 'hover:bg-white/30'
                } ${i > 0 ? 'border-t border-white/20' : ''}`}>
                <span className="text-xl flex-shrink-0 w-8 text-center">{r.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{r.title}</p>
                  <p className="text-xs text-slate-500">{r.provider} · {CAT_EMOJI[r.category] ?? ''}</p>
                </div>
                <span className="text-xs font-bold text-slate-600 flex-shrink-0">฿{r.price}</span>
              </button>
            ))}
            {query.trim() && (
              <button onClick={() => { router.push(`/marketplace?q=${encodeURIComponent(query.trim())}` as any); setQuery(''); setOpen(false) }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-semibold border-t border-white/20 hover:bg-white/20 transition-colors">
                <Search className="h-4 w-4" />
                ค้นหา &ldquo;{query}&rdquo; ทั้งหมด
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

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
  const wishlistCount = useWishlistStore((s) => s.count())
  const { data: unreadMessages = 0 } = useUnreadMessageCount()
  const t = useT()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const NAV_LINKS = [
    { href: '/marketplace', label: t.nav.marketplace },
    { href: '/stores',      label: 'ร้านค้า' },
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
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href as any}
              className={`text-sm font-semibold transition-colors ${
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-primary'
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop search bar */}
        <div className="hidden lg:block">
          <SearchBar />
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeLanguageToggle />

          {isLoggedIn ? (
            <>
              {/* Wishlist button */}
              <Link href="/saved" className="relative p-2 rounded-xl hover:bg-white/25 dark:hover:bg-white/10 transition-colors"
                title="รายการที่บันทึกไว้">
                <Heart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart button */}
              <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-xl hover:bg-white/25 dark:hover:bg-white/10 transition-colors">
                <ShoppingCart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center">{totalItems > 9 ? '9+' : totalItems}</span>
                )}
              </button>

              {/* Messages button */}
              <Link href="/messages" className="relative p-2 rounded-xl hover:bg-white/25 dark:hover:bg-white/10 transition-colors"
                title="ข้อความ">
                <MessageSquare className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </Link>

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
              <Link href="/saved" className="relative p-2 rounded-lg hover:bg-white/25 dark:hover:bg-white/10 transition-colors">
                <Heart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">{wishlistCount > 9 ? '9+' : wishlistCount}</span>
                )}
              </Link>
              <Link href="/messages" className="relative p-2 rounded-lg hover:bg-white/25 dark:hover:bg-white/10 transition-colors">
                <MessageSquare className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[9px] font-extrabold flex items-center justify-center">{unreadMessages > 9 ? '9+' : unreadMessages}</span>
                )}
              </Link>
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
                <Link href="/saved"      onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 py-1">
                  <Heart className="h-3.5 w-3.5 text-rose-400" /> รายการที่บันทึกไว้
                  {wishlistCount > 0 && <span className="ml-auto text-xs font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">{wishlistCount}</span>}
                </Link>
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
