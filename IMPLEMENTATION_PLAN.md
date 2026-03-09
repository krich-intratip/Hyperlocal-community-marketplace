# Implementation Plan - Franchise & Community Hyper Marketplace
> **Version:** v0.3.4 | **Updated:** 2026-03-09  

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

## Phase 3: Next Priorities
- **Real Auth:** Google OAuth via NestJS Passport.js + JWT, replacing mock Zustand auth store.
- **Booking Flow Polish:** End-to-end test signin → redirect → book → QR payment → confirmation.
- **URL Sync:** Marketplace filter/search state synced to URL params (`?category=FOOD&status=available`).
- **Backend Wiring for Analytics:** When backend is ready, wire `/dashboard/superadmin/analytics` to call real `GET /dashboard/analytics` endpoint instead of mock data.

## Phase 4: Future Proofing (Logistics & Advanced Interfaces)
- **Delivery Integration:** Connect the newly added DB delivery fields (shippingCost, trackingNumber, status) with an external third-party logistics API (e.g., Flash Express, Kerry) to create standard waybills inside the app.
- **Trust Score Algorithm:** Build logic into the provider profiles to adjust UI trust badges according to review frequencies and cancelation history.
- **Promoted Listings:** Introduce a new module allowing admins to boost specific listings for the marketplace frontend.
- **Real-time Notifications:** WebSocket or Supabase Realtime for live notification push.
