# TODO — Community Hyper Marketplace

> **Version:** v0.3.4 | **Updated:** 2026-03-09  
> Legend: `[ ]` pending · `[x]` done · `[~]` in progress

---

## 🔴 High Priority

- [ ] **HI-1** Booking flow end-to-end test & polish (signin → redirect → book → QR payment → confirmation)
- [ ] **HI-5** Real auth — Google OAuth ผ่าน NestJS Passport.js + JWT (แทน mock Zustand auth)

---

## � Medium Priority

- [ ] **ME-4** Marketplace — sync filter/search state กับ URL params (`?category=FOOD&status=available`)
- [ ] **ME-5** `/auth/signup` — polish flow ให้สมบูรณ์เหมือน signin
- [ ] **ME-6** Redis cache layer — notification count (TTL 30s), listing list (TTL 5m)

---

## 🟢 Low Priority

- [ ] **LO-1** Supabase Storage — provider avatar / listing image / community banner upload
- [ ] **LO-2** Analytics: wire `/dashboard/analytics` GET to real NestJS backend when API is ready
- [ ] **LO-3** Provider follow/wishlist — persist to backend (POST /users/follow/:providerId)

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
- [x] Frontend: Franchise approve/reject/suspend/resume ครบ interactive (ME-3) — confirmed already implemented
- [x] Version Bump เป็น v0.3.4 ✅
