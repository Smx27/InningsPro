<!-- GSD:project-start source:PROJECT.md -->
## Project

**InningsPro**

InningsPro is a production-grade cricket scoring system designed for reliable ball-by-ball data capture and reporting. It features a mobile-first scoring application that works offline and a web application for generating professional, shareable reports from exported match schemas.

**Core Value:** Enable reliable, rule-strict cricket scoring that persists across poor connectivity and produces professional, portable match artifacts.

### Constraints

- **Tech Stack**: React Native (Mobile), Next.js (Web), Shared TypeScript packages.
- **Persistence**: Local-first on mobile; file-based upload for web reporting.
- **Validation**: Strict adherence to MCC laws is mandatory.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.x - Monorepo-wide (apps, packages, tooling)
- JavaScript (config files like `metro.config.js`, `.eslintrc.cjs`)
- SQL (via Drizzle ORM in `apps/mobile/src/core/database/schema.ts`)
## Runtime
- Node.js 18+ (specified in `docs/DEPLOYMENT.md`)
- Expo SDK 52 (Mobile)
- Next.js 14.x (Web)
- pnpm 9.15.4
- Lockfile: `pnpm-lock.yaml` (present)
- Monorepo: pnpm workspaces
## Frameworks
- Next.js 14.2.25 (`apps/report-web`) - Web application (dashboard/reports)
- Expo 52.0.28 (`apps/mobile`) - Mobile application (scoring client)
- React 18.3.1 - Frontend framework (Web/Mobile)
- Node.js Built-in Test Runner (`node:test`) - Used for unit tests in `apps/report-web` and `packages/export-schema`.
- Node.js `node:assert` - Assertion library for tests.
- Turborepo 2.4.4 - Monorepo orchestration/build caching.
- Tailwind CSS 3.4.17 - Styling (Web and Mobile via NativeWind).
- PostCSS/Autoprefixer - Web build pipeline.
- Babel - Mobile build pipeline (`babel.config.js`).
## Key Dependencies
- `drizzle-orm` 0.38.4 (`apps/mobile`) - SQLite ORM.
- `zustand` 5.0.3 (Web/Mobile) - State management.
- `zod` 3.24.2 (Web/Packages) - Schema validation.
- `@tanstack/react-query` 5.66.11 (`apps/report-web`) - Async data fetching (planned/ready).
- `expo-router` 4.0.17 (`apps/mobile`) - Mobile navigation.
- `framer-motion` 12.36.0 (`apps/report-web`) - Web animations.
- `lucide-react` 0.576.0 (`apps/report-web`) - Icon set.
- `recharts` 3.7.0 (`apps/report-web`) - Data visualization.
- `xlsx` 0.18.5 (`apps/report-web`) - Excel export.
- `react-to-print` 3.3.0 (`apps/report-web`) - PDF generation via print.
## Configuration
- Configured via `.env` files (referenced in `docs/DEPLOYMENT.md`).
- Key variables include `NEXT_PUBLIC_API_URL`, `DATABASE_URL`, `FIREBASE_PROJECT_ID`.
- `turbo.json` - Root build/task configuration.
- `tsconfig.base.json` - Shared TypeScript configuration.
- `tooling/tsconfig/package.json` - Tooling specific TS configuration.
- `metro.config.js` - Expo build configuration.
- `next.config.mjs` - Next.js build configuration.
## Platform Requirements
- Node.js 18+
- pnpm 9.15+
- Expo CLI/EAS CLI
- GitHub CLI (optional)
- Vercel / AWS / GCP (Web)
- iOS / Android App Stores (Mobile via EAS)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Components: PascalCase (e.g., `apps/report-web/components/landing/Hero.tsx`)
- Services: kebab-case with `.service.ts` suffix (e.g., `apps/mobile/src/services/match-engine.service.ts`)
- Utilities/Hooks: camelCase (e.g., `apps/report-web/lib/charts/buildRunRateData.ts`, `apps/report-web/lib/store.ts`)
- camelCase (e.g., `buildRunRateData`, `calculateChasingWinProbability`)
- camelCase for standard variables
- UPPER_SNAKE_CASE for constants (e.g., `DEFAULT_RULES` in `apps/mobile/src/services/match-engine.service.ts`)
- PascalCase for interfaces and types (e.g., `MatchState`, `InningsReport` in `packages/shared-types/src/index.ts`)
## Code Style
- Prettier
- Settings: `printWidth: 100`, `singleQuote: true`, `trailingComma: "all"`, `semi: true` (from `.prettierrc`)
- ESLint (custom config in `tooling/eslint/base.cjs`)
- Key rules: `@typescript-eslint` recommended rules, `import` ordering.
## Import Organization
## State Management
- `zustand` is used for global state management (e.g., `useReportStore` in `apps/report-web/lib/store.ts`).
## Error Handling
- Service methods throw explicit Errors with descriptive messages (e.g., `throw new Error('Extras are disabled for this match')` in `apps/mobile/src/services/match-engine.service.ts`).
- Zod is used for validation and error handling for schemas (e.g., `safeParseTournamentExport` in `packages/export-schema/src/v1/validators.test.ts`).
## Module Design
- Named exports are preferred for utilities and types.
- Services are exported as singletons alongside the class definition (e.g., `export const matchEngineService = new MatchEngineService();`).
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- **Domain-Driven Architecture**: Canonical types are shared across all apps via `packages/shared-types`.
- **Offline-First Persistence**: The mobile application uses a local SQLite database (via Drizzle ORM) as the primary source of truth for match scoring.
- **Unidirectional Data Flow**: React UI triggers store actions (Zustand) or service methods, which in turn update the persistent state and notify the UI.
## Layers
- Purpose: Present data and handle user interactions.
- Location: `apps/mobile/src/app`, `apps/mobile/src/features`, `apps/report-web/app`.
- Contains: React components, screen layouts, feature-specific state/hooks.
- Depends on: State Layer, Service Layer, Core Layer (Theme), Shared/Contract Layer.
- Used by: End users.
- Purpose: Reactive state management for the application.
- Location: `apps/mobile/src/store`, `apps/mobile/src/features/*/store`.
- Contains: Zustand stores, reactive state snapshots.
- Depends on: Service Layer, Shared/Contract Layer.
- Used by: UI / Feature Layer.
- Purpose: Orchestrate business logic, coordinate database access, and calculate derived state.
- Location: `apps/mobile/src/services`, `apps/report-web/lib`.
- Contains: Singletons like `DatabaseService`, `MatchEngineService`, `ExportService`.
- Depends on: Core Layer (Database), Shared/Contract Layer.
- Used by: State Layer, UI / Feature Layer.
- Purpose: Low-level infrastructure and persistent storage.
- Location: `apps/mobile/src/core/database`.
- Contains: Drizzle schema, migrations, database initialization.
- Depends on: Shared/Contract Layer.
- Used by: Service Layer.
- Purpose: Unified definitions across the monorepo to ensure compatibility.
- Location: `packages/`.
- Contains: `shared-types`, `ui-tokens`, `export-schema`.
- Depends on: None.
- Used by: All layers in all applications.
## Data Flow
- Global application state (current match, session) is handled by Zustand in `apps/mobile/src/store/useAppStore.ts`.
- Feature-scoped state (e.g., scoring-specific UI state) is handled by localized Zustand stores in `apps/mobile/src/features/scoring/store/useScoringStore.ts`.
## Key Abstractions
- Purpose: High-level wrapper for Drizzle ORM operations with built-in caching and error handling.
- Examples: `apps/mobile/src/services/db.service.ts`.
- Pattern: Repository / Singleton.
- Purpose: Deterministic state engine for cricket scoring logic.
- Examples: `apps/mobile/src/services/match-engine.service.ts`.
- Pattern: Business Logic Orchestrator.
- Purpose: Cross-app domain contracts.
- Examples: `packages/shared-types/src/index.ts`.
- Pattern: Contract-First Development.
## Entry Points
- Location: `apps/mobile/src/app/_layout.tsx`
- Triggers: Application launch by Expo.
- Responsibilities: Error boundary setup, theme provider, database migration check, and navigation layout.
- Location: `apps/report-web/app/layout.tsx`
- Triggers: Web request.
- Responsibilities: Global styles, layout structure, and provider setup.
## Error Handling
- **Typed Errors**: `DatabaseError` in `apps/mobile/src/services/db.service.ts` wraps Drizzle/SQLite errors with contextual metadata.
- **Service Logging**: `logError` in `apps/mobile/src/services/logger.ts` serializes error objects for consistent logging.
- **UI Safety**: `ErrorBoundary` in `apps/mobile/src/components/ErrorBoundary.tsx` prevents app-wide crashes from rendering errors.
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
