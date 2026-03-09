# TODO — Community Hyper Marketplace

> **Version:** v0.3.2 | **Updated:** 2026-03-09  
> Legend: `[ ]` pending · `[x]` done · `[~]` in progress

---

## 🔴 High Priority

- [ ] **HI-1** Booking flow end-to-end test & polish (signin → redirect → book → QR payment → confirmation)
- [ ] **HI-2** Backend: เชื่อม NestJS API แทน mock fetchers ใน useListings / useBookings / useNotifications / useCommunities

---

## 🟡 Medium Priority

- [ ] **ME-1** `providers/[id]` — เพิ่มปุ่ม wishlist/follow button ใน hero section
- [ ] **ME-2** Dark mode — เพิ่ม `dark:` class ให้ครบใน `/franchise`, `/guide`, `/communities` hero text
- [ ] **ME-3** `dashboard/superadmin/franchise` — approve/reject franchise request ให้ interactive (local state + toast)
- [ ] **ME-4** Real auth — Google OAuth ผ่าน NestJS Passport.js + JWT

---

## 🟢 Low Priority

- [ ] **LO-1** Marketplace — sync filter/search state กับ URL params (`?category=FOOD&status=available`)
- [ ] **LO-2** `/auth/signup` — polish flow ให้สมบูรณ์เหมือน signin
- [ ] **LO-3** Redis cache layer — notification count (TTL 30s), listing list (TTL 5m)
- [ ] **LO-4** Supabase Storage — provider avatar / listing image / community banner upload

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
