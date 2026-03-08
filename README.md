# Community Hyper Marketplace

A **Hyperlocal Community Marketplace Platform** — digital infrastructure for community economies, connecting trusted local service providers with residents inside residential communities.

## Vision

**Local Economy Operating System** — enabling communities to run trusted digital marketplaces and service networks.

## Monorepo Structure

```
community-hyper-marketplace/
├── apps/
│   ├── web/          # Next.js frontend (TypeScript + Tailwind + shadcn/ui)
│   └── api/          # NestJS backend (TypeScript + REST API)
├── packages/
│   ├── shared-types/ # Shared TypeScript types & interfaces
│   ├── ui/           # Shared UI components (shadcn/ui base)
│   └── config/       # Shared ESLint, TypeScript, Tailwind configs
├── supabase/         # Supabase local dev (migrations, seed)
├── infrastructure/   # Docker, Nginx configs
├── docs/             # Technical documentation
└── scripts/          # Dev utility scripts
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | NestJS + TypeScript + REST API |
| Database | Supabase (PostgreSQL + PostGIS) |
| Cache | Redis |
| Auth | Google OAuth (MVP) |
| Storage | Cloudflare R2 |
| Infra | Docker + Turborepo monorepo |

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker Desktop
- Supabase CLI

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Start local infrastructure (PostgreSQL + Redis via Docker)
docker-compose up -d

# Start Supabase local
pnpm supabase:start

# Run database migrations
pnpm supabase:migrate

# Start all apps
pnpm dev
```

### Apps

- **Web**: http://localhost:3000
- **API**: http://localhost:4000
- **Supabase Studio**: http://localhost:54323

## Marketplace Verticals (MVP: 4 of 10)

1. อาหาร (Local Food)
2. งานช่าง (Repair & Technician)
3. งานบ้าน (Home Services)
4. สอนพิเศษ (Tutors)

## User Roles

- **Super Admin** — Platform-level control
- **Community Admin** — Per-community franchise operator (revenue share)
- **Service Provider** — Creates listings, delivers services
- **Customer** — Searches and books services

## MVP Sprint Plan

| Sprint | Focus |
|---|---|
| Sprint 1 | Foundation + Google OAuth + Community system |
| Sprint 2 | Provider onboarding + Listings + Marketplace browse |
| Sprint 3 | Booking flow + Dashboards + Notifications |
| Sprint 4 | Reviews + Trust score + Landing pages + QA |
