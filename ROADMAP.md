# Roadmap — Community Hyper Marketplace

> **Current Version:** v0.3.2 | **Status:** Frontend-complete (mock data), ready for backend integration

---

## 🔴 High Priority

### HI-1 — Booking Flow End-to-End Polish
ทดสอบและ polish loop ครบ:
1. ผู้ใช้กด "Book Now" บน `/marketplace/[id]` โดยไม่ได้ login
2. → redirect ไป `/auth/signin?redirect=/marketplace/[id]/book`
3. → หลัง login redirect กลับ booking page
4. → กรอก date/qty → ชำระ PromptPay QR → booking confirmation

### HI-2 — Backend Integration (NestJS + Supabase)
แทนที่ mock fetchers ใน React Query hooks ด้วย real API:
- `useListings` → `GET /listings`
- `useBookings` → `GET /bookings`
- `useNotifications` → `GET /notifications`
- `useCommunities` → `GET /communities`
- `useMarkAllRead` → `PATCH /notifications/read-all`

---

## 🟡 Medium Priority

### ME-1 — providers/[id] Wishlist/Follow Button
เพิ่มปุ่ม "ติดตาม Provider" ใน `/providers/[id]` hero section (คล้ายกับที่ทำใน listing detail)

### ME-2 — Dark Mode Coverage
เพิ่ม `dark:` class ให้ครบใน hero text ของ:
- `/franchise` — `text-slate-900` → เพิ่ม `dark:text-white`
- `/guide` — hero h1 ขาด dark variant
- `/communities` — hero h1 ขาด dark variant

### ME-3 — Superadmin Franchise Approve/Reject Interactive
ปัจจุบัน `/dashboard/superadmin/franchise` แสดง UI แต่ปุ่ม approve/reject ยังไม่ทำงาน
→ เพิ่ม local state toggle + toast notification เหมือน admin/providers

### ME-4 — Real Auth (Google OAuth)
- NestJS: Passport.js + Google Strategy
- Frontend: แทนที่ mock login ด้วย `signIn('google')` redirect flow
- JWT refresh token handling

---

## 🟢 Low Priority

### LO-1 — Marketplace URL Params Sync
Sync filter/search state กับ URL query params:
- `?category=FOOD` → pre-select category
- `?status=available` → pre-filter status
- รองรับ share link และ browser back/forward

### LO-2 — Signup Page Polish
ปัจจุบัน `/auth/signup` มี flow แต่ยังไม่สมบูรณ์เหมือน signin
→ polish role selection UI, เพิ่ม validation feedback

### LO-3 — Redis Cache Layer
- Cache notification count ด้วย Redis TTL 30s
- Cache listing list ด้วย Redis TTL 5m
- Invalidate เมื่อมี write operation

### LO-4 — Supabase Storage
- Provider avatar upload
- Listing image upload
- Community banner upload

---

## 🔵 Future / Nice-to-have

| Feature | Notes |
|---------|-------|
| Real-time notifications | WebSocket หรือ Supabase Realtime |
| Provider Trust Score system | Algorithm คำนวณจาก rating + completed bookings |
| Community analytics dashboard | Chart รายได้รวมของ community |
| Promoted Listings | Admin สามารถ boost listing ขึ้นหน้าแรก |
| Mobile app | React Native / Expo (ใช้ API เดียวกัน) |
| Multi-language | i18n ครบ (ปัจจุบัน TH เป็น default, EN พร้อม) |
