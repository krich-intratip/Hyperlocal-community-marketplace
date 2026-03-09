# TODO — Community Hyper Marketplace

> **Version:** v0.4.1 | **Updated:** 2026-03-09
> Legend: `[ ]` pending · `[x]` done · `[~]` in progress

---

## 🔴 High Priority

- [ ] **HI-1** Booking flow end-to-end test & polish (signin → redirect → book → QR payment → confirmation)

---

## 🟡 Medium Priority

- [ ] **ME-1** Analytics dashboard — wire `GET /dashboard/analytics` (replace mock data in `/dashboard/superadmin/analytics`)
- [ ] **ME-2** Supabase Storage — provider avatar / listing image / community banner upload
- [ ] **ME-3** Provider follow/wishlist — persist to backend (`POST /users/follow/:providerId`)

---

## 🟢 Low Priority

- [ ] **LO-1** CSP nonce — replace `unsafe-inline` in `public/_headers` for stronger XSS protection

---

## 🔵 Future

- [ ] Real-time notifications (WebSocket หรือ Supabase Realtime)
- [ ] Provider Trust Score algorithm
- [ ] Community analytics dashboard (รายได้รวม)
- [ ] Promoted Listings (admin boost)
- [ ] Mobile app (React Native / Expo)
- [ ] Multi-language i18n ครบทุก string

---

## ✅ Completed

- [x] Turborepo monorepo setup (apps/web + packages)
- [x] 26+ pages: home, marketplace, communities, franchise, dashboard, profile, notifications, bookings
- [x] Navbar: avatar dropdown + notification bell + dark mode toggle
- [x] AppFooter ครบทุกหน้า — version badge, branding
- [x] SEO metadata, sitemap.xml, robots.txt
- [x] GitHub Actions CI/CD → Cloudflare Pages
- [x] React Query hooks layer (mock fetchers, ready to swap)
- [x] Loading skeleton components
- [x] Locale-aware date system (BE/CE, useDateFormat hook)
- [x] Zustand auth.store — login/logout/role
- [x] useAuthGuard hook — ครอบคลุมทุกหน้า protected
- [x] PWA manifest + usePWAInstall hook
- [x] Leaflet map (lazy-load, SSR-safe, CSS dynamic inject)
- [x] PromptPay QR payment mock + booking confirmation flow
- [x] Smart Book Now redirect (login-aware → signin?redirect=...)
- [x] Signin `?redirect` param support
- [x] About page: version info + tech stack section
- [x] Marketplace card: wishlist toggle ♥
- [x] Listing detail: wishlist button
- [x] Hero headline font size ลดทุกหน้า (ป้องกัน overflow)
- [x] Deploy to Cloudflare Pages v0.3.2 ✅
- [x] Backend: Commission Module (Ledger, Override) & Payout System (Franchise)
- [x] Backend: Invite Link System (/join/:code) & Pending Member Approval
- [x] Frontend: Invite Landing Page (/join/[code]) & CA Invite Management Dashboard
- [x] Database: สคีมา Delivery fields ใน Booking Entity เพื่อรองรับระบบขนส่ง
- [x] Version Bump เป็น v0.3.3 ✅
- [x] Backend: เปิดใช้งาน `@nestjs/schedule` + `@Cron('5 0 1 * *')` ใน PayoutService (HI-3)
- [x] Backend: เพิ่ม `GET /dashboard/analytics` — monthly time-series, top providers, commission totals (HI-4)
- [x] Frontend: เชื่อม React Query hooks (useListings / useBookings / useNotifications / useCommunities) กับ NestJS API + env-gate fallback (HI-2)
- [x] Frontend: Analytics Dashboard `/dashboard/superadmin/analytics` — recharts LineChart/BarChart + CSV export
- [x] Frontend: Provider `/providers/[id]` — wishlist/follow toggle button (ME-1)
- [x] Frontend: Dark mode hero text fixes ใน `/guide`, `/communities` (ME-2)
- [x] Frontend: Franchise approve/reject/suspend/resume ครบ interactive (ME-3)
- [x] Version Bump เป็น v0.3.4 ✅
- [x] HI-1 Booking Flow Polish — step indicator, dark mode cards, useAuthGuard (v0.3.5)
- [x] ME-4 Marketplace URL Param Sync — useSearchParams + useRouter.replace (v0.3.6)
- [x] ME-5 Signup Polish — step indicator, redirect param, Google mock button (v0.3.6)
- [x] ME-6 Redis Cache Layer — listings TTL 5m, notif count TTL 30s, global CacheModule (v0.3.7)
- [x] HI-5 Real Google OAuth — useAuthHydrate, /auth/callback, signin wired (v0.3.8)
- [x] Build fixes — Suspense wrappers for useSearchParams, join/[code] server wrapper (v0.3.9)
- [x] Security Audit & Hardening (OWASP A01/A03/A04) — auth guards on commission/payout, open redirect fix, pagination cap, server-side booking pricing (v0.4.0) ✅
- [x] ME-1 Cookie Auth Fix — @fastify/cookie registered, useAuthHydrate env var fixed (v0.4.1) ✅
