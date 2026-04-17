# Codebase Structure

**Analysis Date:** 2025-02-14

## Directory Layout

```
InningsPro/
├── apps/
│   ├── mobile/             # React Native (Expo) Scoring App
│   │   ├── src/
│   │   │   ├── app/        # Expo Router screens and layouts
│   │   │   ├── components/ # Shared UI components
│   │   │   ├── core/       # Database, providers, theme
│   │   │   ├── features/   # Feature-specific logic and UI
│   │   │   ├── hooks/      # Shared hooks
│   │   │   ├── models/     # Local models
│   │   │   ├── services/   # Business logic, API/DB services
│   │   │   ├── store/      # Global Zustand state
│   │   │   ├── types/      # Local TypeScript types
│   │   │   └── utils/      # Utility functions
│   └── report-web/         # Next.js Reporting App
│       ├── app/            # App Router pages and layouts
│       ├── components/     # UI components
│       ├── lib/            # Shared logic and state
│       └── styles/         # Global styles and Tailwind config
├── packages/
│   ├── export-schema/      # JSON export validation and versioning
│   ├── shared-types/       # Canonical domain TypeScript interfaces
│   └── ui-tokens/          # Shared design system constants
├── tooling/
│   ├── eslint/             # Shared ESLint configurations
│   └── tsconfig/           # Shared TypeScript configurations
└── docs/                   # Project documentation (ADRs, PRD, etc.)
```

## Directory Purposes

**`apps/mobile/src/app`:**
- Purpose: File-based routing for the mobile app using Expo Router.
- Contains: Screen components and dynamic route files.
- Key files: `_layout.tsx`, `index.tsx`, `scoring/[matchId].tsx`.

**`apps/mobile/src/services`:**
- Purpose: Core application business logic and data access orchestration.
- Contains: Service singletons that interact with the database and handle scoring logic.
- Key files: `match-engine.service.ts`, `db.service.ts`.

**`packages/shared-types`:**
- Purpose: Centralized repository of TypeScript types for the entire domain.
- Contains: Interfaces for `Match`, `Team`, `Player`, `BallEvent`, etc.
- Key files: `src/index.ts`.

**`tooling/`:**
- Purpose: Shared development configurations to maintain consistency across the monorepo.
- Contains: ESLint and TypeScript base configs.

## Key File Locations

**Entry Points:**
- `apps/mobile/src/app/_layout.tsx`: Mobile app root layout and providers.
- `apps/report-web/app/layout.tsx`: Web app root layout and providers.

**Configuration:**
- `pnpm-workspace.yaml`: Monorepo workspace definition.
- `turbo.json`: Turborepo build/test pipeline configuration.
- `tsconfig.base.json`: Shared TypeScript base rules.

**Core Logic:**
- `apps/mobile/src/services/match-engine.service.ts`: Deterministic scoring rules implementation.
- `apps/mobile/src/services/db.service.ts`: Main database interaction layer.

**Testing:**
- `packages/export-schema/src/v1/validators.test.ts`: Sample unit test location.

## Naming Conventions

**Files:**
- **Components**: PascalCase (e.g., `ErrorBoundary.tsx`, `SettingsItem.tsx`).
- **Services/Logic**: kebab-case (e.g., `match-engine.service.ts`, `db.service.ts`).
- **Hooks**: camelCase starting with `use` (e.g., `useMatchContextStore.ts`).

**Directories:**
- **Feature Modules**: kebab-case (e.g., `features/match`, `features/scoring`).

## Where to Add New Code

**New Feature:**
- Primary logic: `apps/mobile/src/features/[feature]/`
- Feature-specific store: `apps/mobile/src/features/[feature]/store/`
- Navigation screen: `apps/mobile/src/app/[feature]/`

**New Domain Model:**
- Implementation: `packages/shared-types/src/index.ts`
- Database Schema: `apps/mobile/src/core/database/schema.ts`

**Utilities:**
- Shared helpers: `apps/mobile/src/utils/`

## Special Directories

**`.planning/codebase/`:**
- Purpose: Contains codebase maps and documentation for GSD agents.
- Generated: Yes (by GSD Codebase Mapper).
- Committed: Yes.

**`apps/mobile/src/core/database/drizzle/`:**
- Purpose: Auto-generated SQL migrations from Drizzle ORM.
- Generated: Yes.
- Committed: Yes.

---

*Structure analysis: 2025-02-14*
