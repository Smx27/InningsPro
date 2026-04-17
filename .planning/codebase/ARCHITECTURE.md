# Architecture

**Analysis Date:** 2025-02-14

## Pattern Overview

**Overall:** Monorepo with Layered Client Applications.

**Key Characteristics:**
- **Domain-Driven Architecture**: Canonical types are shared across all apps via `packages/shared-types`.
- **Offline-First Persistence**: The mobile application uses a local SQLite database (via Drizzle ORM) as the primary source of truth for match scoring.
- **Unidirectional Data Flow**: React UI triggers store actions (Zustand) or service methods, which in turn update the persistent state and notify the UI.

## Layers

**UI / Feature Layer:**
- Purpose: Present data and handle user interactions.
- Location: `apps/mobile/src/app`, `apps/mobile/src/features`, `apps/report-web/app`.
- Contains: React components, screen layouts, feature-specific state/hooks.
- Depends on: State Layer, Service Layer, Core Layer (Theme), Shared/Contract Layer.
- Used by: End users.

**State / Store Layer:**
- Purpose: Reactive state management for the application.
- Location: `apps/mobile/src/store`, `apps/mobile/src/features/*/store`.
- Contains: Zustand stores, reactive state snapshots.
- Depends on: Service Layer, Shared/Contract Layer.
- Used by: UI / Feature Layer.

**Service / Logic Layer:**
- Purpose: Orchestrate business logic, coordinate database access, and calculate derived state.
- Location: `apps/mobile/src/services`, `apps/report-web/lib`.
- Contains: Singletons like `DatabaseService`, `MatchEngineService`, `ExportService`.
- Depends on: Core Layer (Database), Shared/Contract Layer.
- Used by: State Layer, UI / Feature Layer.

**Core / Persistence Layer:**
- Purpose: Low-level infrastructure and persistent storage.
- Location: `apps/mobile/src/core/database`.
- Contains: Drizzle schema, migrations, database initialization.
- Depends on: Shared/Contract Layer.
- Used by: Service Layer.

**Shared / Contract Layer:**
- Purpose: Unified definitions across the monorepo to ensure compatibility.
- Location: `packages/`.
- Contains: `shared-types`, `ui-tokens`, `export-schema`.
- Depends on: None.
- Used by: All layers in all applications.

## Data Flow

**Match Scoring Flow:**

1. **User Action**: Scorer taps "4 runs" in `apps/mobile/src/app/scoring/[matchId].tsx`.
2. **Action Dispatch**: The tap calls `matchEngineService.recordBall()` in `apps/mobile/src/services/match-engine.service.ts`.
3. **Logic Processing**: `MatchEngineService` calculates next batter strike, legal ball status, and over transitions.
4. **Persistence**: `DatabaseService` (in `apps/mobile/src/services/db.service.ts`) inserts a new `BallEvent` into the SQLite database.
5. **State Update**: The service returns a new `MatchState` snapshot, which is pushed to the Zustand store (`apps/mobile/src/store/useAppStore.ts`).
6. **UI Rerender**: React components observing the store rerender with updated runs, wickets, and overs.

**State Management:**
- Global application state (current match, session) is handled by Zustand in `apps/mobile/src/store/useAppStore.ts`.
- Feature-scoped state (e.g., scoring-specific UI state) is handled by localized Zustand stores in `apps/mobile/src/features/scoring/store/useScoringStore.ts`.

## Key Abstractions

**DatabaseService:**
- Purpose: High-level wrapper for Drizzle ORM operations with built-in caching and error handling.
- Examples: `apps/mobile/src/services/db.service.ts`.
- Pattern: Repository / Singleton.

**MatchEngineService:**
- Purpose: Deterministic state engine for cricket scoring logic.
- Examples: `apps/mobile/src/services/match-engine.service.ts`.
- Pattern: Business Logic Orchestrator.

**Shared Types:**
- Purpose: Cross-app domain contracts.
- Examples: `packages/shared-types/src/index.ts`.
- Pattern: Contract-First Development.

## Entry Points

**Mobile App Root:**
- Location: `apps/mobile/src/app/_layout.tsx`
- Triggers: Application launch by Expo.
- Responsibilities: Error boundary setup, theme provider, database migration check, and navigation layout.

**Web App Root:**
- Location: `apps/report-web/app/layout.tsx`
- Triggers: Web request.
- Responsibilities: Global styles, layout structure, and provider setup.

## Error Handling

**Strategy:** Centralized logging with typed error classes and React Error Boundaries for UI recovery.

**Patterns:**
- **Typed Errors**: `DatabaseError` in `apps/mobile/src/services/db.service.ts` wraps Drizzle/SQLite errors with contextual metadata.
- **Service Logging**: `logError` in `apps/mobile/src/services/logger.ts` serializes error objects for consistent logging.
- **UI Safety**: `ErrorBoundary` in `apps/mobile/src/components/ErrorBoundary.tsx` prevents app-wide crashes from rendering errors.

## Cross-Cutting Concerns

**Logging:** Encapsulated in `apps/mobile/src/services/logger.ts`, supporting info, error, and match event tracking.
**Validation:** Domain objects are validated at the boundaries using Zod (see `packages/export-schema/src/v1/validators.ts`).
**Theme:** Design tokens (colors, spacing) are defined in `packages/ui-tokens` and applied via NativeWind (Mobile) and Tailwind (Web).

---

*Architecture analysis: 2025-02-14*
