# Implementation Plan - Franchise & Community Hyper Marketplace
> **Version:** v0.5.1 | **Updated:** 2026-03-10

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

## Phase 9: Completed (v0.4.5)
- **Mock Data Expansion & Page Routing Bug Fix** — Resolved critical UX issue where all community and provider pages showed identical hardcoded data.
  - **Root cause fixed:** `_community-page.tsx` had hardcoded `MOCK_COMMUNITY = { id: '1', ... }` and `page.tsx` didn't pass `id` prop. `_provider-profile.tsx` used hardcoded `MOCK_PROVIDER` despite receiving `{ id }` prop.
  - **`lib/mock-listings.ts`** — Expanded from 12 → 20 listings covering Chiang Mai (13–15,19), Phuket (16–17), Khon Kaen (18), Nonthaburi (20).
  - **`lib/mock-providers.ts`** (new) — 20 provider detail records with `MOCK_PROVIDER_MAP` + `getProviderById()`. Full profiles: bio, listings[], reviews[], badges, availability schedule.
  - **`lib/mock-communities-data.ts`** (new) — 15 community detail records with `COMMUNITY_DETAIL_MAP` + `getCommunityDetail()`. Covers all regions: Bangkok (1,2,4,11), Nonthaburi (3), Pathum Thani (5), Chiang Mai (6,7), Chiang Rai (12), Phuket (8), Songkhla (10), Koh Samui (15), Khon Kaen (9), Nakhon Ratchasima (13), Rayong (14).
  - **`hooks/useCommunities.ts`** — Expanded `MOCK_COMMUNITIES` from 6 → 15 entries with full geographic coverage.
  - **`hooks/useBookings.ts`** — Expanded from 8 → 15 bookings covering new listing IDs 13–20 (Chiang Mai, Phuket, Khon Kaen, Nonthaburi).
  - **`communities/[id]/page.tsx`** — Made async, passes `id` to client, `generateStaticParams` expanded to IDs 1–15.
  - **`communities/[id]/_community-page.tsx`** — Accepts `{ id }` prop, uses `getCommunityDetail(id)` for all dynamic data. Not-found fallback added.
  - **`providers/[id]/_provider-profile.tsx`** — Uses `getProviderById(id)` for all data. `COMMUNITY_COORDS` map for per-region MapView centering. Not-found fallback added.
  - **`providers/[id]/page.tsx`** — `generateStaticParams` expanded to IDs 1–20.
  - **`marketplace/[id]/page.tsx`** + **`book/page.tsx`** — `generateStaticParams` expanded to IDs 1–20.
  - **`bookings/[id]/page.tsx`** — `generateStaticParams` expanded to 15 booking IDs.
  - **DL-1 Delivery Integration:** On hold — infrastructure already in DB. Will integrate with Line Man or Grab when ready for production rollout.

## Phase 10: Completed (v0.4.6–v0.4.7)
- **HI-1 Booking E2E Polish (v0.4.6):** `useAuthGuard` now passes `?redirect=<current-path>` to signin so users return to the page they were trying to access. Booking "done" step now has a direct link to `/bookings/:id` for immediate detail view.
- **Cart System (v0.4.7):** Full multi-item cart with Zustand persistence (`chm-cart` localStorage):
  - `cart.store.ts` — `addItem` (auto-merge by `listingId__menuName` key), `updateQty`, `removeItem`, `clearCart`, `clearProvider`, `itemsByProvider()`, `totalItems()`, `totalPrice()`.
  - `CartDrawer` — slide-in panel from right, items grouped by provider, qty ±, delete, subtotal + 5% platform fee, "สรุปคำสั่งซื้อ" → `/cart`.
  - **Navbar** — 🛒 icon with live badge (desktop + mobile) showing total item count.
  - **Listing detail** — "เพิ่มในตะกร้า" button (amber, with ✅ feedback) alongside existing "Book Now". Respects selected menu + qty.
  - **`/cart` page** — 3-step checkout: (1) review items grouped by provider + per-item note + per-provider delivery address, (2) PromptPay QR / cash payment selector, (3) done screen with order IDs + links to `/bookings`.

## Phase 11: Completed (v0.4.8)
- **Franchise Pricing Page** — Added `PRICING_PLANS` array with 3 tiers: Trial (฿500/3mo), Package 1 (฿10,000/1yr, 50% off ฿20,000), Package 2 (฿17,000/2yr, 58% off ฿40,000). Full pricing section with plan cards, feature lists, and footnote explaining the promotion.
- **Provider Listings: Image + Description** — Added `imageUrl` and `description` fields to `Listing` interface and `FormData`. Form modal now has a description textarea and imageUrl input with live preview. Listing cards show image (or emoji fallback) and description.
- **Super Admin Dashboard: Drillable Communities** — Updated `TOP_COMMUNITIES` IDs to match actual route params (numeric strings). Community rows wrapped in `<Link href="/communities/{id}">` with hover effects and ChevronRight indicator. Stats updated: 15 total, 12 active communities.
- **Community Admin Dashboard: Provider Overview** — Added prominent `ภาพรวม Provider` section above the 2-column grid. Shows top 5 approved providers per community with name, category, bookings, revenue, rating, and status. Each row links to `/providers/{id}`. "ดูทั้งหมด →" button links to `/dashboard/admin/providers`. "Provider Approval" panel header also gets a "ทั้งหมด →" link. Added `Link` from next/link and `Star` icon.

## Phase 12: Roadmap (Next Sessions)

### 🔴 High — CART-7: Cart Backend API
- **Backend:** Create `POST /orders` endpoint in NestJS accepting `{ items: [{listingId, menuName, qty, note}][], deliveryAddress, paymentMethod }`. Auto-calculate total server-side. Create `Order` entity with `OrderItem[]` relation.
- **Frontend:** Wire `handlePlaceOrder` in `/cart` page to real API when `NEXT_PUBLIC_API_BASE_URL` is set (env-gate pattern already used throughout).
- **Dependency:** Needs `Order` → `Booking` relationship clarification (1 cart order = multiple bookings, or new Order entity?).

### 🔴 High — RT-1: Real-time Notifications
- **Backend:** NestJS `@WebSocketGateway` with Socket.io. Events: `notification.new`, `booking.status_changed`, `order.confirmed`. Emit on service mutations.
- **Frontend:** `useNotifications` hook subscribes to socket. Notification bell badge updates live. Toast on new event.
- **Alternative:** Supabase Realtime (simpler, no extra infra) — subscribe to `notifications` table INSERT.

### 🟡 Medium — TS-1: Provider Trust Score
- **Algorithm:** `score = (avgRating × 40) + (completionRate × 30) + (responseScore × 20) + (tenureBonus × 10)` (0–100).
- **Backend:** `GET /providers/:id/trust-score` — computed from bookings/reviews data.
- **Frontend:** Display as colored badge (🔵 Trusted / 🟡 Good / 🔴 New) in listing card, provider profile, booking form.

### 🟡 Medium — PL-1: Promoted Listings
- **Backend:** Add `isPromoted: boolean`, `promotedUntil: Date`, `promotedBy: string` to `Listing` entity. Admin endpoint `PATCH /listings/:id/promote`.
- **Frontend:** `🔥 แนะนำ` badge on listing card. Promoted listings sorted first in marketplace. Super-admin dashboard promote button.

### 🟢 Low — LO-1: CSP Nonce
- Replace `unsafe-inline` in `public/_headers` with per-request nonce via Next.js middleware.
- Add `Content-Security-Policy` header with `script-src 'nonce-{nonce}'`.

### 🟢 Low — DL-1: Delivery Integration
- DB fields (`deliveryProvider`, `trackingNumber`, `estimatedDelivery`) already in `Booking` entity.
- Integrate Line Man Wongnai API or Grab Express API for waybill creation on booking confirmation.

### 🔵 Future
- **MOBILE-1:** React Native / Expo — shared `@chm/api` package, auth hooks, cart store.
- **REVIEW-2:** `POST /reviews` backend endpoint + aggregate to `Listing.rating` field.
- **CHAT-1:** In-app messaging (Socket.io rooms per booking, or Supabase Realtime channel).

## Phase 13: Completed (v0.5.0)
- **Nationwide Community Expansion** — Extended mock data coverage from 15 → 25 communities across all Thai provinces.
  - **`lib/mock-communities-data.ts`** — Added 10 new community records (IDs 16–25): อุดรธานี🛍️, อุบลราชธานี🏛️, พัทยา🎡, สุราษฎร์ธานี🍊, ลำปาง🏺, นครสวรรค์🐉, สมุทรปราการ🏭, นครศรีธรรมราช🕌, กาญจนบุรี🛶, บึงกาฬ🌲.
  - **`hooks/useCommunities.ts`** — Expanded `MOCK_COMMUNITIES` to 25 entries with full lat/lng coordinates for map rendering.
  - **`lib/mock-providers.ts`** — Upgraded `communityId: string` → `communityIds: string[]` for multi-community provider support across all 25 provider records. Added 5 new providers (21–25) for new regions.
  - **`lib/mock-listings.ts`** — Added 5 new listings (21–25): ก๋วยเตี๋ยวนครสวรรค์, ซ่อมแซมพัทยา, ล่องแก่งกาญจน์, ดุเรียนสุราษฎร์, เซรามิคลำปาง.
  - **`hooks/useBookings.ts`** — Added 3 new bookings (B240090, B240075, B240060) for new listing areas.
  - **`communities/[id]/page.tsx`** — Updated `COMMUNITY_NAMES` map + `generateStaticParams` to IDs 1–25.
  - **`providers/[id]/_provider-profile.tsx`** — Added `COMMUNITY_COORDS` for IDs 16–25; updated `provider.communityId` → `provider.communityIds[0]` for backward compatibility.
  - **All `generateStaticParams`** — Updated `marketplace/[id]`, `providers/[id]`, `marketplace/[id]/book`, `bookings/[id]` to cover IDs 1–25 and new booking IDs.

## Phase 14: Completed (v0.5.1)
- **Provider Command Center** — Full self-serve analytics and insight platform for providers across all 10 business categories.
  - **`lib/mock-provider-analytics.ts`** (new) — Revenue trend (12mo), bookings by day-of-week, rating trend (6mo), booking status pie, mock reviews with sentiment labeling.
  - **`lib/category-insights.ts`** (new) — 10-category insight engine: `CATEGORY_INSIGHTS` record mapping FOOD/REPAIR/HOME_SERVICES/TUTORING/ELDERLY_CARE/HANDMADE/HEALTH_WELLNESS/AGRICULTURE/FREELANCE/COMMUNITY_SHARING to category-specific KPIs, AI narrative text, and prioritized recommendations. `getCategoryInsight(category)` helper function.
  - **`/dashboard/provider/analytics/`** (new) — Full recharts analytics page: AreaChart (revenue trend), BarChart (bookings by weekday), LineChart (rating trend), PieChart (booking status). Period selector (7d/30d/1y). CSV export button. Quick stat cards.
  - **`/dashboard/provider/insights/`** (new) — AI Insight Engine: Performance Score ring badge (0–100), category selector dropdown, AI narrative analysis paragraph, 4 category-specific KPI cards with trend indicators, recommendations panel (high/medium/low priority).
  - **`/dashboard/provider/reviews/`** (new) — Review Management Centre: overall rating + response rate, 5-star rating distribution bars, sentiment breakdown (positive/neutral/negative), filter tabs (ทั้งหมด/5ดาว/ลบ/ยังไม่ตอบ), review cards with sentiment badge + reply UI.
  - **`dashboard/provider/page.tsx`** (enhanced) — Added "Command Center" navigation grid (3 cards: Analytics, Insights, Reviews) with mini 7-day sparklines (CSS bars). Performance Score badge added to header. Nav links to all 3 new pages.
