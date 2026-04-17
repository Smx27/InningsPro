# Codebase Concerns

**Analysis Date:** 2025-03-03

## Tech Debt

**Database Service Complexity:**
- Issue: `DatabaseService` is becoming a "God Object" handling all CRUD operations for the entire mobile application.
- Files: `apps/mobile/src/services/db.service.ts`
- Impact: Difficult to maintain, test, and reason about as the schema grows. High risk of side effects during modifications.
- Fix approach: Split into domain-specific services (e.g., `MatchRepository`, `TournamentRepository`, `PlayerRepository`).

**Manual Cache Management:**
- Issue: `DatabaseService` implements manual in-memory caching for matches and innings without a robust invalidation strategy.
- Files: `apps/mobile/src/services/db.service.ts`
- Impact: Potential for stale data if updates happen outside the specific service methods that clear the cache.
- Fix approach: Use a dedicated caching library or move to a more reactive data fetching pattern (e.g., TanStack Query for SQLite if available/feasible).

**Match State Replay:**
- Issue: `getCurrentMatchState` re-queries and re-calculates state from scratch by fetching all ball events.
- Files: `apps/mobile/src/services/match-engine.service.ts`
- Impact: Performance will degrade as the number of balls in a match increases.
- Fix approach: Implement incremental state updates or persist a summary state periodically.

## Security Considerations

**Cleartext Traffic:**
- Risk: `android:usesCleartextTraffic="true"` is enabled.
- Files: `apps/mobile/android/app/src/debug/AndroidManifest.xml`
- Current mitigation: Limited to debug manifest.
- Recommendations: Ensure production manifest strictly forbids cleartext traffic and use certificate pinning if sensitive data is transmitted.

**Report Data Privacy:**
- Risk: `report-web` consumes JSON files directly. If these contain PII (Player names, etc.) and are shared via public URLs, there is no access control.
- Files: `apps/report-web/components/report/ReportPageClient.tsx`
- Current mitigation: None.
- Recommendations: Implement signed URLs or authentication for accessing specific match reports.

## Performance Bottlenecks

**Frequent DB Transactions:**
- Problem: Every ball recorded triggers multiple database operations and a full state recalculation.
- Files: `apps/mobile/src/services/match-engine.service.ts`, `apps/mobile/src/features/scoring/store/useScoringStore.ts`
- Cause: Synchronous updates to the database for every user action.
- Improvement path: Batch database writes or use a "write-behind" cache for high-frequency scoring events.

## Fragile Areas

**Undo Logic:**
- Files: `apps/mobile/src/services/db.service.ts` (`undoLastBall`), `apps/mobile/src/services/match-engine.service.ts`
- Why fragile: Relies on manual filtering of cached events and precise ordering of deletion. If the database and cache get out of sync, the match state becomes corrupted.
- Safe modification: Wrap the entire undo operation in a single database transaction and perform a full cache purge for the affected match.

## Test Coverage Gaps

**Core Match Logic:**
- What's not tested: The scoring engine, run rate calculations, and wicket handling.
- Files: `apps/mobile/src/services/match-engine.service.ts`, `apps/mobile/src/features/scoring/store/useScoringStore.ts`
- Risk: Critical scoring bugs could be introduced during refactoring, leading to incorrect match results.
- Priority: High

**Database Operations:**
- What's not tested: SQLite migrations, CRUD operations, and transaction integrity.
- Files: `apps/mobile/src/services/db.service.ts`
- Risk: Data loss or corruption on schema updates.
- Priority: High

**Web Report Rendering:**
- What's not tested: Most UI components in the report-web app.
- Files: `apps/report-web/components/report/*`
- Risk: Regressions in data visualization (charts, stats) when updating dependencies.
- Priority: Medium

---

*Concerns audit: 2025-03-03*
