# Dev Journey — Community Hyper Marketplace

> **Developer:** PK-Research (Dr.Krich)
> **Current Version:** v0.4.0
> **Last Updated:** 2026-03-09
> **Live URL:** https://7afda826.community-hyper-marketplace.pages.dev  
> **GitHub:** https://github.com/krich-intratip/Hyperlocal-community-marketplace

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| State | Zustand (auth) |
| Data Fetching | TanStack Query (React Query v5) |
| Map | Leaflet (lazy-loaded, SSR-safe dynamic import) |
| PWA | Web App Manifest + install prompt hook |
| Monorepo | Turborepo + pnpm workspaces |
| CI/CD | GitHub Actions → Cloudflare Pages |
| Deploy | Cloudflare Pages (wrangler CLI) |
| Backend | NestJS v10 + Fastify + TypeORM + PostgreSQL + Redis |
| Auth | Google OAuth + JWT (httpOnly cookie) |

---

## Phase Timeline

### Phase 1–3 — Foundation (v0.1.0)
- โครงสร้าง Turborepo monorepo (`apps/web`, `packages/shared-types`, `packages/ui`)
- Home page, Marketplace listing + detail, communities, franchise pages
- Dashboard role switcher (customer / provider / admin / superadmin)
- Provider sub-pages: listings manage, earnings chart
- Admin: providers approval flow
- `/profile`, `/notifications` pages
- Navbar: avatar dropdown + notification bell

### Phase 4 — SEO & Branding (v0.1.1)
- `AppFooter` ครบทุก 18 หน้า — version badge, last-updated, PK-Research branding
- SEO metadata (`<head>`) ทุกหน้า
- `sitemap.xml` + `robots.txt` static generation
- `bump-version.py` script + `/commit-push` workflow

### Phase 5 — CI/CD + Data Layer (v0.1.2)
- GitHub Actions workflow → build → deploy Cloudflare Pages
- React Query hooks layer: `useListings`, `useBookings`, `useNotifications`, `useCommunities`
- Mock fetchers พร้อม swap เป็น real API

### Phase 6 — Hook Wiring + Loading States (v0.1.3)
- Wire hooks เข้าหน้า marketplace / bookings / notifications
- Loading skeleton components

### Phase 7 — Locale Date System (v0.1.4)
- `useDateFormat` hook — รองรับ BE/CE, dd/mm/yyyy
- Wire ใน provider dashboard + MOCK_ORDERS ISO date fix

### Phase 8–9 — Auth System (v0.1.5–v0.1.7)
- Zustand `auth.store` — user state, login/logout, role management
- `useAuthGuard` hook — redirect ถ้าไม่ได้ login / ไม่มีสิทธิ์
- Navbar wired กับ auth state
- Mock login ใน signin page (เลือก role แล้ว login)
- Auth guards: signup / profile / notifications / bookings

### Phase 10–12 — PWA + Map + Payment (v0.1.8–v0.2.0)
- **PWA**: Web App Manifest (`manifest.json`), install prompt hook (`usePWAInstall`)
- **Leaflet Map**: dynamic import (SSR-safe), CSS inject ใน `useEffect`, `MapView` component
- **Payment**: PromptPay QR mock flow, booking confirmation page, Booking ID generator
- **Leaflet CSS fix**: inject ผ่าน JS แทน CSS import (แก้ build error)
- Auth guards ครอบคลุม: franchise / providers/apply
- Profile form sync กับ Zustand store
- Error boundary component

### Phase 13–15 — Map Coverage + Auth Audit (v0.2.1–v0.2.3)
- Leaflet map ใน listing detail page + community detail page
- Leaflet map ใน provider profile page
- Auth guard audit ครบทุกหน้า — สแกนและ verify ไม่มีหน้าหลุด

### Phase 16–17 — Smart Redirect (v0.2.4–v0.2.6)
- **Book Now redirect**: ถ้าไม่ได้ login → `/auth/signin?redirect=/marketplace/[id]/book`
- **About page**: เพิ่ม section version info + tech stack badges
- **Signin `?redirect` param**: หลัง login redirect ไป path ที่ระบุ แทน default dashboard

### Phase 18–22 — UX Polish (v0.2.7–v0.3.2)
- Notifications: verify mark-individual-as-read (local state)
- Marketplace card: wishlist toggle ♥ (Heart icon, Set state)
- Listing detail page: wishlist button (bottom-right ของ hero image)
- AppFooter: เพิ่มใน earnings / admin/providers / provider/listings / superadmin
- Hero headline: ลดขนาดทุกหน้า (`text-4xl sm:text-5xl` → `text-2xl sm:text-3xl`) ป้องกัน overflow/overlap

### Deploy — Cloudflare Pages (v0.3.2)
- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`
- Deploy ด้วย `wrangler pages deploy ./out --project-name=community-hyper-marketplace`
- 74 static pages prerendered ✅

### Phase 23–27 — Backend Integration (v0.3.3–v0.3.7)
- Commission Module, Payout Engine, Invite System, Member Approval Flow (v0.3.3)
- Schedule Module (`@Cron`), Analytics API, React Query wiring to real NestJS endpoints (v0.3.4)
- Booking flow polish, step indicator, dark mode (v0.3.5)
- Marketplace URL param sync, signup step polish (v0.3.6)
- Redis Cache Layer — listings TTL 5m, notification count TTL 30s (v0.3.7)

### Phase 28–29 — Real Auth + Build Fixes (v0.3.8–v0.3.9)
- **HI-5 Real Google OAuth (v0.3.8)**: `useAuthHydrate` hook, `AuthHydrator`, `/auth/callback` page,
  signin button → real `${API_URL}/auth/google`
- **Build fixes (v0.3.9)**: Suspense wrappers for `useSearchParams` pages, `join/[code]` server wrapper,
  recharts formatter type fix for Cloudflare static export

### Phase 30 — Security Audit & Hardening (v0.4.0)
Full OWASP Top 10 audit — 2 critical + 5 high + 1 medium fixes:
- **CRITICAL A01**: `commission.controller` — all endpoints unauthenticated → added `JwtAuthGuard + RolesGuard`
- **CRITICAL A01**: `payout.controller` — no guards at all → per-endpoint role-based guards
- **HIGH A04**: `bookings.service` — client-supplied financial amounts → server-side calculation from DB
- **HIGH A04**: `listings.service` — unbounded pagination DoS → capped at min=1, max=100
- **HIGH A03**: `listings.controller` — `body: any` → typed body
- **HIGH A01**: `signin/callback` pages — open redirect → `sanitizeRedirect()` validates relative paths only
- **HIGH A05**: Wrong env var `NEXT_PUBLIC_API_URL` → `NEXT_PUBLIC_API_BASE_URL`

---

## Pages ทั้งหมด (74 routes)

| Route | Role | Auth Guard |
|-------|------|-----------|
| `/` | public | — |
| `/about` | public | — |
| `/guide` | public | — |
| `/marketplace` | public | ✅ |
| `/marketplace/[id]` | public | ✅ |
| `/marketplace/[id]/book` | customer | ✅ |
| `/communities` | public | ✅ |
| `/communities/[id]` | public | ✅ |
| `/providers/[id]` | public | ✅ |
| `/providers/apply` | public | ✅ |
| `/franchise` | public | — |
| `/franchise/apply` | public | — |
| `/auth/signin` | public | — |
| `/auth/signup` | public | — |
| `/profile` | customer+ | ✅ |
| `/notifications` | customer+ | ✅ |
| `/bookings` | customer+ | ✅ |
| `/bookings/[id]` | customer+ | ✅ |
| `/dashboard` | customer+ | ✅ |
| `/dashboard/provider` | provider+ | ✅ |
| `/dashboard/provider/listings` | provider+ | ✅ |
| `/dashboard/provider/earnings` | provider+ | ✅ |
| `/dashboard/admin` | admin+ | ✅ |
| `/dashboard/admin/providers` | admin+ | ✅ |
| `/dashboard/superadmin` | superadmin | ✅ |
| `/dashboard/superadmin/franchise` | superadmin | ✅ |
