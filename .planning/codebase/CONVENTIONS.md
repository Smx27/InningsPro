# Coding Conventions

**Analysis Date:** 2024-05-15

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `apps/report-web/components/landing/Hero.tsx`)
- Services: kebab-case with `.service.ts` suffix (e.g., `apps/mobile/src/services/match-engine.service.ts`)
- Utilities/Hooks: camelCase (e.g., `apps/report-web/lib/charts/buildRunRateData.ts`, `apps/report-web/lib/store.ts`)

**Functions:**
- camelCase (e.g., `buildRunRateData`, `calculateChasingWinProbability`)

**Variables:**
- camelCase for standard variables
- UPPER_SNAKE_CASE for constants (e.g., `DEFAULT_RULES` in `apps/mobile/src/services/match-engine.service.ts`)

**Types:**
- PascalCase for interfaces and types (e.g., `MatchState`, `InningsReport` in `packages/shared-types/src/index.ts`)

## Code Style

**Formatting:**
- Prettier
- Settings: `printWidth: 100`, `singleQuote: true`, `trailingComma: "all"`, `semi: true` (from `.prettierrc`)

**Linting:**
- ESLint (custom config in `tooling/eslint/base.cjs`)
- Key rules: `@typescript-eslint` recommended rules, `import` ordering.

## Import Organization

**Order:**
Enforced by `eslint-plugin-import` in `tooling/eslint/base.cjs`:
1. Builtin (e.g., `node:assert`)
2. External (e.g., `framer-motion`, `zustand`)
3. Internal
4. Parent, Sibling, Index
5. Types

Imports are alphabetized and separated by newlines between groups.

## State Management

**Patterns:**
- `zustand` is used for global state management (e.g., `useReportStore` in `apps/report-web/lib/store.ts`).

## Error Handling

**Patterns:**
- Service methods throw explicit Errors with descriptive messages (e.g., `throw new Error('Extras are disabled for this match')` in `apps/mobile/src/services/match-engine.service.ts`).
- Zod is used for validation and error handling for schemas (e.g., `safeParseTournamentExport` in `packages/export-schema/src/v1/validators.test.ts`).

## Module Design

**Exports:**
- Named exports are preferred for utilities and types.
- Services are exported as singletons alongside the class definition (e.g., `export const matchEngineService = new MatchEngineService();`).

---

*Convention analysis: 2024-05-15*
