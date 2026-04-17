# External Integrations

**Analysis Date:** 2025-05-22

## APIs & External Services

**Reporting & Dashboards:**
- Next.js API Routes (Planned) - Environment variable `NEXT_PUBLIC_API_URL` referenced in `docs/DEPLOYMENT.md`.
- TanStack Query (Ready) - Package `@tanstack/react-query` present in `apps/report-web/package.json`.

**Analytics & Crash Reporting:**
- Firebase (Planned) - `FIREBASE_PROJECT_ID` referenced in `docs/DEPLOYMENT.md` for analytics/crashlytics.
- Sentry (Planned) - `SENTRY_AUTH_TOKEN` and `@sentry/nextjs` / `sentry-expo` referenced in `docs/DEPLOYMENT.md`.

## Data Storage

**Databases:**
- SQLite (Local)
  - Connection: Local filesystem via `expo-sqlite`.
  - Client: `drizzle-orm` in `apps/mobile/src/core/database/schema.ts`.
- PostgreSQL (Remote/Planned)
  - Connection: `DATABASE_URL` referenced in `docs/DEPLOYMENT.md`.
  - Intended for web application/backend storage.

**File Storage:**
- Local filesystem only (at current implementation).
  - SDK: `expo-file-system` in mobile app.
  - Export: `xlsx` and `react-to-print` for document generation.

**Caching:**
- Zustand - Client-side state persistence/caching.
- TanStack Query - Network request caching (Web).

## Authentication & Identity

**Auth Provider:**
- Custom/JWT (Planned) - `docs/DEPLOYMENT.md` mentions "JWT tokens configured" and "API authentication required".
- Current implementation lacks an integrated auth provider SDK (like Clerk or NextAuth).

## Monitoring & Observability

**Error Tracking:**
- Sentry (Planned) - Configuration patterns for both Mobile and Web described in `docs/DEPLOYMENT.md`.

**Logs:**
- Browser console and Node.js stdout (Current).
- Sentry capturing (Planned).

## CI/CD & Deployment

**Hosting:**
- Vercel (Web) - Primary target for `apps/report-web`.
- Expo EAS (Mobile) - Primary target for building and submitting `apps/mobile` to App Stores.

**CI Pipeline:**
- GitHub Actions - Workflow template `deploy.yml` described in `docs/DEPLOYMENT.md` for building and deploying apps and publishing packages.

## Environment Configuration

**Required env vars:**
- `EXPO_TOKEN` - For Expo builds.
- `NEXT_PUBLIC_API_URL` - Backend API endpoint.
- `DATABASE_URL` - PostgreSQL connection string.
- `FIREBASE_PROJECT_ID` - Analytics identifier.

**Secrets location:**
- GitHub Secrets for CI/CD.
- Local `.env` and `.env.production` (Not committed).

## Webhooks & Callbacks

**Incoming:**
- Not detected (Project is currently client-centric).

**Outgoing:**
- Not detected (Match exports are currently file-based downloads).

---

*Integration audit: 2025-05-22*
