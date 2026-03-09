# Roadmap — Community Hyper Marketplace

> **Current Version:** v0.4.0 | **Status:** Security-hardened, ready for production deployment

---

## 🔴 High Priority

### HI-1 — Booking Flow End-to-End Polish
ทดสอบและ polish loop ครบ:
1. ผู้ใช้กด "Book Now" บน `/marketplace/[id]` โดยไม่ได้ login
2. → redirect ไป `/auth/signin?redirect=/marketplace/[id]/book`
3. → หลัง login redirect กลับ booking page
4. → กรอก date/qty → ชำระ PromptPay QR → booking confirmation

### HI-2 — Analytics Dashboard Backend Wiring
แทนที่ mock data ใน `/dashboard/superadmin/analytics` ด้วย real `GET /dashboard/analytics` endpoint

---

## 🟡 Medium Priority

### ME-1 — Cookie Auth Fix
Register `@fastify/cookie` ใน `main.ts` เพื่อให้ httpOnly cookie JWT extraction ทำงานใน Fastify ได้ (ปัจจุบัน fallback เป็น Bearer token เท่านั้น)

### ME-2 — Supabase Storage
- Provider avatar upload
- Listing image upload
- Community banner upload

### ME-3 — Provider follow/wishlist Backend
Persist follow state ไป backend (`POST /users/follow/:providerId`)

---

## 🟢 Low Priority

### LO-1 — CSP Nonce
แทนที่ `unsafe-inline` ใน `public/_headers` ด้วย nonce-based CSP เพื่อป้องกัน XSS ได้แน่นขึ้น

---

## 🔵 Future / Nice-to-have

| Feature | Notes |
|---------|-------|
| Real-time notifications | WebSocket หรือ Supabase Realtime |
| Provider Trust Score system | Algorithm คำนวณจาก rating + completed bookings |
| Promoted Listings | Admin สามารถ boost listing ขึ้นหน้าแรก |
| Delivery Integration | Flash Express / Kerry waybill generation |
| Mobile app | React Native / Expo (ใช้ API เดียวกัน) |
| Multi-language | i18n ครบ (ปัจจุบัน TH เป็น default, EN พร้อม) |

---

## ✅ Completed

| Version | Feature |
|---------|---------|
| v0.3.2 | Deploy Cloudflare Pages, 74 static pages, PWA, Leaflet, PromptPay QR |
| v0.3.3 | Commission Module, Payout Engine, Invite System, Member Approval |
| v0.3.4 | Schedule Module, Analytics API, React Query wiring, Analytics Dashboard |
| v0.3.5 | Booking Flow Polish, step indicator, dark mode cards |
| v0.3.6 | Marketplace URL param sync, Signup step polish |
| v0.3.7 | Redis Cache Layer (listings TTL 5m, notif count TTL 30s) |
| v0.3.8 | Real Google OAuth, useAuthHydrate, /auth/callback |
| v0.3.9 | Build fixes: Suspense wrappers, join/[code] server wrapper |
| v0.4.0 | Security Audit: OWASP A01/A03/A04 — auth guards, open redirect fix, server-side pricing |
