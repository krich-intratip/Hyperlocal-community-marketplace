# Implementation Plan - Franchise & Community Hyper Marketplace
> **Version:** v0.4.4 | **Updated:** 2026-03-09

## Phase 1: Completed (v0.3.3)
- **API: Commission System:** Implemented Ledger tracking, Rate Overrides (specific to community/provider type), and automatic revenue split (60/40) between Platform and CAs.
- **API: Payout Engine:** Implemented monthly automatic payout aggregation (cron job prepared) and state transition (PENDING -> APPROVED -> PAID).
- **API: Invite Link System:** Implemented unique URL generation, tracking logic, and public preview (`/join/:code`).
- **API: Member Approval Flow:** Implemented CA endpoints to review and approve/reject pending providers.
- **Database:** Added scalable Delivery tracking fields to Bookings Entity for tracking future third-party logistics integrations.
- **Web Frontend:** Built landing page for Invites (`/join/[code]`) with localized text, smooth animations, and clear routing based on participant type.
- **Web Frontend Dashboard:** Built CA Invite Management UI to copy links, check analytics shortcuts, and manage pending members interactively.

## Phase 2: Completed (v0.3.4)
- **Backend: Schedule Module** — Installed `@nestjs/schedule`, added `@Cron('5 0 1 * *')` to `generateMonthlyPayouts()`, enabled `ScheduleModule.forRoot()` in both `PayoutModule` and `AppModule`.
- **Backend: Analytics API** — Added `GET /dashboard/analytics?communityId&months` returning monthly time-series (orders/sales/commission), summary totals, and top 5 providers by revenue. Fixed pre-existing `BookingStatus.PENDING` bug → `PENDING_PAYMENT`.
- **Frontend: API Wiring** — Added `listingsApi` + `notificationsApi` helpers to `api.ts`, added `Listing` + `Notification` types to `types/api.ts`. Wired all 4 React Query hooks (`useListings`, `useBookings`, `useNotifications`, `useCommunities`) to real NestJS endpoints with `NEXT_PUBLIC_API_BASE_URL` env-gate fallback to mock data.
- **Frontend: Analytics Dashboard** — Built `/dashboard/superadmin/analytics` with recharts `LineChart` (sales/commission) + `BarChart` (orders), 3/6/12 month period selector, summary KPI cards, Top 5 Providers table, and CSV export. Installed `recharts` package. Added Analytics quick-link to superadmin page.
- **Frontend: Provider Follow Button** — Added Heart toggle button in `/providers/[id]` hero section with animated active/inactive state.
- **Frontend: Dark Mode** — Fixed missing `dark:text-white` on hero headings in `/guide` and `/communities` pages.

## Phase 3: Completed (v0.3.5–v0.3.8)
- **HI-1 Booking Flow Polish (v0.3.5)** — Step indicator (details→confirm→payment→done), dark mode on all booking/bookings-list/booking-detail cards, `useAuthGuard` integration, null-safe `fmtLong`, typo fix.
- **ME-4 Marketplace URL Param Sync (v0.3.6)** — Replaced `useState` filters with `useSearchParams` + `useRouter.replace`. Category, status, sort, q, radius all synced to URL; default values auto-cleaned from params.
- **ME-5 Signup Polish (v0.3.6)** — Added visual step indicator (บทบาท→ข้อมูล→เสร็จ), `redirect` param support, working Google mock button, "มีบัญชีแล้ว?" link in form step.
- **ME-6 Redis Cache Layer (v0.3.7)** — Global `CacheModule.registerAsync` with Redis (`REDIS_URL` env, graceful no-op fallback). Listings `search()` caches with key `listings:search:*` TTL 5m, invalidated on create/update/remove. `NotificationsService.getUnreadCount()` caches per-user TTL 30s, invalidated on `send()`. Added `GET /notifications/unread-count` endpoint.
- **HI-5 Real Google OAuth (v0.3.8)** — Backend already complete (GoogleStrategy, JwtStrategy, httpOnly cookie). Frontend: `useAuthHydrate` hook calls `GET /auth/me` on mount to restore session from cookie; mounted via `AuthHydrator` in `Providers`. `/auth/callback` page handles post-OAuth redirect with success/error/loading states. Signin Google button now navigates to real `${API_URL}/auth/google`; Demo button retained for development.

## Phase 4: Completed (v0.4.0)
- **Security Audit & Hardening** — Full OWASP Top 10 audit with critical/high/medium fixes:
  - **CRITICAL (A01):** `commission.controller` — added `JwtAuthGuard + RolesGuard + SUPER_ADMIN` (all endpoints were fully unauthenticated).
  - **CRITICAL (A01):** `payout.controller` — added per-endpoint auth guards; approve/mark-paid now SUPER_ADMIN only.
  - **HIGH (A04):** `bookings.service` — server-side price calculation from listing DB; removed client-supplied `totalAmount/commissionRate/revenueShareRate`.
  - **HIGH (A04):** `listings.service` — pagination capped at `min=1, max=100` (DoS prevention).
  - **HIGH (A03):** `listings.controller` — typed `update` body (replaced `body: any`).
  - **HIGH (A01):** `signin/callback` pages — `sanitizeRedirect()` prevents open redirect; fixed `NEXT_PUBLIC_API_URL` → `NEXT_PUBLIC_API_BASE_URL`.
  - **Added** `@types/express` devDep (required by passport-jwt types).
- **Build Fix** — Added missing `ListingRepo` to `BookingsModule.forFeature` for server-side price lookup.

## Phase 5: Completed (v0.4.1)
- **ME-1 Cookie Auth Fix** — Installed `@fastify/cookie@^9.4.0`; registered plugin in `main.ts` so Fastify parses inbound `Cookie` headers before JWT strategy runs. `cookieOrBearerExtractor` now reads `req.cookies.access_token` correctly. Fixed `useAuthHydrate.ts` env var: `NEXT_PUBLIC_API_URL` → `NEXT_PUBLIC_API_BASE_URL`.

## Phase 6: Completed (v0.4.2)
- **Analytics Backend Wiring** — Added `AnalyticsResponse` types to `types/api.ts`. Added `dashboardApi.getAnalytics()` to `api.ts`. Created `useAnalytics` hook with env-gate fallback to mock data. Analytics page now calls real `GET /dashboard/analytics` with `months` param; Refresh button triggers manual refetch; staleTime 5m matches backend Redis TTL.

## Phase 7: Completed (v0.4.3)
- **HI-1 Booking Flow Polish (v0.4.3)** — Real booking creation via `useCreateBooking` mutation wired to `POST /bookings`. Booking detail page async-params fixed (Next.js 15). `adaptBooking()` normalises `MockBooking` fields to detail-page shape (status map, platformFee=5%, timeline). `useCancelBooking` calls real `PATCH /bookings/:id/cancel` when `USE_REAL_API`. Case-insensitive search in `/bookings` list.

## Phase 8: Completed (v0.4.4)
- **ME-2 Avatar Upload** — `useAvatarUpload` hook: validates file type/size, presign `POST /upload/presign` → `PUT` directly to R2/Supabase, returns `publicUrl`; mock: blob URL + 800ms delay. `uploadApi.presignAvatar` added to `api.ts`. Profile page camera button wired: hidden `<input type="file">` → `handleAvatarChange` → `usersApi.updateProfile({ avatarUrl })` → `updateUser`. Avatar shown as `<img>` when `preview`/`avatarUrl` present; emoji fallback. `AuthUser.avatarUrl?: string` added to store.
- **ME-3 Follow Persist** — `followApi` (check/follow/unfollow) added to `api.ts`. `useFollowState` (React Query + `localStorage` mock at `chm:follow:{id}`) and `useToggleFollow` (mutation with optimistic invalidation) in `hooks/useFollow.ts`. `providers/[id]/page.tsx` fixed for async params and passes `id` prop. `_provider-profile.tsx` accepts `{ id }` prop, uses real follow hooks; button disabled while `isPending`.

## Phase 9: Next Priorities
- **Real-time Notifications:** WebSocket or Supabase Realtime for live notification push.
- **Trust Score Algorithm:** Build logic into provider profiles to adjust trust badges based on review frequency and cancellation history.
- **Promoted Listings:** New module allowing admins to boost listings in the marketplace frontend.
- **Delivery Integration:** Connect DB delivery fields with third-party logistics API (Flash Express, Kerry) for waybill generation.
