# Technology Stack

**Analysis Date:** 2025-05-22

## Languages

**Primary:**
- TypeScript 5.x - Monorepo-wide (apps, packages, tooling)

**Secondary:**
- JavaScript (config files like `metro.config.js`, `.eslintrc.cjs`)
- SQL (via Drizzle ORM in `apps/mobile/src/core/database/schema.ts`)

## Runtime

**Environment:**
- Node.js 18+ (specified in `docs/DEPLOYMENT.md`)
- Expo SDK 52 (Mobile)
- Next.js 14.x (Web)

**Package Manager:**
- pnpm 9.15.4
- Lockfile: `pnpm-lock.yaml` (present)
- Monorepo: pnpm workspaces

## Frameworks

**Core:**
- Next.js 14.2.25 (`apps/report-web`) - Web application (dashboard/reports)
- Expo 52.0.28 (`apps/mobile`) - Mobile application (scoring client)
- React 18.3.1 - Frontend framework (Web/Mobile)

**Testing:**
- Node.js Built-in Test Runner (`node:test`) - Used for unit tests in `apps/report-web` and `packages/export-schema`.
- Node.js `node:assert` - Assertion library for tests.

**Build/Dev:**
- Turborepo 2.4.4 - Monorepo orchestration/build caching.
- Tailwind CSS 3.4.17 - Styling (Web and Mobile via NativeWind).
- PostCSS/Autoprefixer - Web build pipeline.
- Babel - Mobile build pipeline (`babel.config.js`).

## Key Dependencies

**Critical:**
- `drizzle-orm` 0.38.4 (`apps/mobile`) - SQLite ORM.
- `zustand` 5.0.3 (Web/Mobile) - State management.
- `zod` 3.24.2 (Web/Packages) - Schema validation.
- `@tanstack/react-query` 5.66.11 (`apps/report-web`) - Async data fetching (planned/ready).

**Infrastructure/UI:**
- `expo-router` 4.0.17 (`apps/mobile`) - Mobile navigation.
- `framer-motion` 12.36.0 (`apps/report-web`) - Web animations.
- `lucide-react` 0.576.0 (`apps/report-web`) - Icon set.
- `recharts` 3.7.0 (`apps/report-web`) - Data visualization.
- `xlsx` 0.18.5 (`apps/report-web`) - Excel export.
- `react-to-print` 3.3.0 (`apps/report-web`) - PDF generation via print.

## Configuration

**Environment:**
- Configured via `.env` files (referenced in `docs/DEPLOYMENT.md`).
- Key variables include `NEXT_PUBLIC_API_URL`, `DATABASE_URL`, `FIREBASE_PROJECT_ID`.

**Build:**
- `turbo.json` - Root build/task configuration.
- `tsconfig.base.json` - Shared TypeScript configuration.
- `tooling/tsconfig/package.json` - Tooling specific TS configuration.
- `metro.config.js` - Expo build configuration.
- `next.config.mjs` - Next.js build configuration.

## Platform Requirements

**Development:**
- Node.js 18+
- pnpm 9.15+
- Expo CLI/EAS CLI
- GitHub CLI (optional)

**Production:**
- Vercel / AWS / GCP (Web)
- iOS / Android App Stores (Mobile via EAS)

---

*Stack analysis: 2025-05-22*
