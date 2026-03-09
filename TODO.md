# TODO — Community Hyper Marketplace

> **Version:** v0.4.7 | **Updated:** 2026-03-09
> Legend: `[ ]` pending · `[x]` done · `[~]` in progress

---

## 🔴 High Priority

- [ ] **CART-7** Cart backend API — `POST /orders` (multi-item order) ใน NestJS + wire frontend เมื่อ `NEXT_PUBLIC_API_BASE_URL` set
- [ ] **RT-1** Real-time Notifications — WebSocket (NestJS Gateway) หรือ Supabase Realtime → notification bell live push

---

## 🟡 Medium Priority

- [ ] **TS-1** Provider Trust Score — คำนวณจาก (review count, avg rating, cancel rate, response time) → badge ใน provider/listing
- [ ] **PL-1** Promoted Listings — admin boost: `isPromoted` field + frontend badge + sort priority ใน marketplace
- [ ] **ME-2** Supabase Storage — provider avatar / listing image / community banner upload (presign → R2/Supabase)
- [ ] **ME-3** Provider follow/wishlist — persist to backend `POST /users/follow/:providerId` (hook มีแล้ว ยังใช้ localStorage)

---

## 🟢 Low Priority

- [ ] **LO-1** CSP nonce — replace `unsafe-inline` ใน `public/_headers` สำหรับ XSS protection ที่แข็งแกร่งขึ้น
- [ ] **DL-1** Delivery Integration — เชื่อม DB delivery fields กับ Line Man / Grab API (DB fields มีแล้ว)
- [ ] **I18N-1** Multi-language i18n ครบทุก string (ปัจจุบัน EN/TH บางส่วนผ่าน `useT`)

---

## 🔵 Future / Backlog

- [ ] **MOBILE-1** Mobile app — React Native / Expo shell ใช้ shared API hooks เดิม
- [ ] **CA-ANALYTICS** Community analytics dashboard — รายได้รวมของชุมชน, top sellers per community
- [ ] **REVIEW-2** Review system backend — `POST /reviews` endpoint + aggregate to listing rating
- [ ] **CHAT-1** In-app chat — customer ↔ provider messaging (Socket.io หรือ Supabase)

---

## ✅ Completed (ล่าสุด → เก่าสุด)

- [x] **CART-1–6** Cart System — Zustand cart store (persist), CartDrawer slide-in, Navbar badge, Add to Cart on listing detail, `/cart` checkout page 3-step (v0.4.7)
- [x] **HI-1** Booking flow E2E Polish — useAuthGuard redirect param, done-step booking detail link (v0.4.6)
- [x] **Phase 9** Mock Data Expansion — 20 listings, 20 providers, 15 communities, per-id routing fixed (v0.4.5)
- [x] **ME-3** Follow Persist — `useFollowState` + `useToggleFollow` hooks, optimistic update (v0.4.4)
- [x] **ME-2** Avatar Upload — `useAvatarUpload` hook, presign, Profile page camera button wired (v0.4.4)
- [x] **HI-1** Booking Polish — `useCreateBooking` wired, `adaptBooking`, `useCancelBooking` (v0.4.3)
- [x] **ME-1** Analytics Backend Wiring — `dashboardApi` + `useAnalytics` hook (v0.4.2)
- [x] **Cookie Auth Fix** — `@fastify/cookie`, `cookieOrBearerExtractor` (v0.4.1)
- [x] **Security Hardening** — OWASP A01/A03/A04, auth guards, server-side price calc (v0.4.0)
- [x] **Build fixes** — Suspense wrappers `useSearchParams`, `join/[code]` server wrapper (v0.3.9)
- [x] **HI-5** Real Google OAuth — `useAuthHydrate`, `/auth/callback`, signin wired (v0.3.8)
- [x] **ME-6** Redis Cache Layer — listings TTL 5m, notif count TTL 30s (v0.3.7)
- [x] **ME-4/ME-5** Marketplace URL param sync, Signup polish (v0.3.6)
- [x] **HI-1** Booking Flow Polish — step indicator, dark mode cards (v0.3.5)
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
- [x] HI-1 Booking Flow E2E Polish — useAuthGuard redirect param, done-step booking detail link (v0.4.6)
- [x] Security Audit & Hardening (OWASP A01/A03/A04) — auth guards on commission/payout, open redirect fix, pagination cap, server-side booking pricing (v0.4.0) ✅
- [x] ME-1 Cookie Auth Fix — @fastify/cookie registered, useAuthHydrate env var fixed (v0.4.1) ✅
- [x] ME-1 Analytics Backend Wiring — dashboardApi + useAnalytics hook, analytics page wired to GET /dashboard/analytics (v0.4.2) ✅
