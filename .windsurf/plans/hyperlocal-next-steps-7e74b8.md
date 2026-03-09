# Hyperlocal Community Marketplace — Next Steps Plan

สรุปสถานะปัจจุบัน (v0.3.3) และลำดับการดำเนินการต่อไปสำหรับโปรเจค Hyperlocal Community Marketplace

---

## สถานะปัจจุบัน

| ด้าน | สถานะ |
|------|--------|
| **Version** | v0.3.3 |
| **Frontend** | ✅ 74 pages, mock data, deployed Cloudflare Pages |
| **Backend (NestJS)** | ✅ Commission, Payout, Invite Link, Member Approval modules สร้างแล้ว |
| **Database (TypeORM)** | ✅ Delivery fields ใน Booking entity |
| **Auth** | ⚠️ Mock login (Zustand) — Google OAuth ยังไม่ได้ทำ |
| **Frontend↔Backend** | ❌ ยังใช้ mock fetchers ทั้งหมด (React Query hooks ยังไม่ได้ต่อ API จริง) |

---

## แผนการดำเนินการ (เรียงลำดับ)

### 🔴 Phase A — Enable & Connect Backend (สำคัญที่สุด)

**A1: Enable NestJS Schedule (Cron Job)**
- รัน `pnpm add @nestjs/schedule` ใน `apps/api`
- Uncomment cron job ใน `PayoutService` + import `ScheduleModule` ใน `PayoutModule`

**A2: Wire Frontend → Backend APIs (HI-2)**
แทนที่ mock fetchers ใน React Query hooks:
- `useListings` → `GET /listings`
- `useBookings` → `GET /bookings`
- `useNotifications` → `GET /notifications`
- `useCommunities` → `GET /communities`
- `useMarkAllRead` → `PATCH /notifications/read-all`

**A3: Analytics Dashboard (HI-4)**
- Backend: สร้าง `GET /dashboard/analytics` endpoint รวม sales, orders, commission totals, top providers
- Frontend: แสดง charts (recharts) + Export CSV ใน dashboard

---

### 🟡 Phase B — Frontend Polish

**B1: Booking Flow E2E Test (HI-1)**
- ทดสอบ loop ครบ: Book Now → signin?redirect → login → book → QR payment → confirmation
- Fix จุดที่ยังหลุด

**B2: Superadmin Franchise Interactive (ME-3)**
- เพิ่ม local state toggle + toast สำหรับ approve/reject ใน `/dashboard/superadmin/franchise`

**B3: Provider Detail Wishlist Button (ME-1)**
- เพิ่มปุ่ม wishlist/follow ใน `/providers/[id]` hero section

**B4: Dark Mode Coverage (ME-2)**
- เพิ่ม `dark:text-white` ใน hero text ของ `/franchise`, `/guide`, `/communities`

---

### 🟢 Phase C — UX Enhancement

**C1: Marketplace URL Params Sync (LO-1)**
- Sync `?category=` และ `?status=` กับ filter state

**C2: Signup Page Polish (LO-2)**
- Polish role selection UI + validation feedback

**C3: Supabase Storage (LO-4)**
- Provider avatar / listing image / community banner upload

---

## ลำดับแนะนำ (Short-term Focus)

```
A1 (Cron) → A2 (Wire APIs) → A3 (Analytics) → B1 (Booking E2E) → B2 (Franchise Interactive)
```

---

## คำถามก่อนเริ่ม

1. **เริ่มจากจุดไหนก่อน?** — แนะนำ A1+A2 (เชื่อม backend) หรือต้องการเริ่มที่ B1 (Booking E2E polish)?
2. **Backend environment** — มี Supabase DB + `.env` พร้อมรันจริงหรือยัง? หรือยังทดสอบ local?
3. **Deploy backend** — NestJS API deploy ที่ไหน (Render / Railway / VPS) หรือยังรันแค่ local?
