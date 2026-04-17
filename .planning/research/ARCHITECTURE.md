# Architecture Patterns

**Domain:** Local-First Cricket Scoring & Reporting (InningsPro)
**Researched:** 2025-05-22

## Recommended Architecture

The system uses an **Event-Sourced Local-First** architecture. This ensures high reliability during match capture (mobile) while enabling professional, decoupled reporting (web).

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Match Engine** | Pure business logic for MCC Laws. | Event Log, UI. |
| **Event Log** | Immutable append-only store for balls/wickets. | SQLite, Sync Engine. |
| **Projection Engine** | Reduces events into a "Materialized Scorecard." | Local Database, UI. |
| **Sync Engine** | Replicates local events to the cloud via LWW. | Web Server, SQLite. |
| **Report Web** | Web app to view/export match schemas. | Match Schema Files, PDF Engine. |

### Data Flow

1.  **User Action**: Scorer taps "4 runs".
2.  **Event Generation**: `MatchEngine.recordBall({ runs: 4 })` creates an immutable event object.
3.  **Local Commit**: Event is saved to `match_events` table in SQLite.
4.  **Local Reduction**: `ProjectionEngine` updates `current_scorecard` table in the same transaction.
5.  **UI Update**: React Native UI updates instantly from the `current_scorecard`.
6.  **Background Sync**: `SyncEngine` pushes the new `match_event` row to the server when online.
7.  **Web Export**: Match data is exported as a `.json` schema (via `packages/export-schema`).
8.  **PDF Generation**: Next.js app reads the `.json` schema and renders it into a PDF match report.

## Patterns to Follow

### Pattern 1: Event Sourcing for Audits
**What:** Store every ball as a discrete event rather than just updating a running total.
**When:** All scoring actions.
**Example:**
```typescript
interface BallEvent {
  type: 'BALL';
  id: string; // UUID
  matchId: string;
  batterId: string;
  bowlerId: string;
  runs: number;
  isWide: boolean;
  isNoBall: boolean;
  timestamp: number;
}
```

### Pattern 2: Materialized Views (Projections)
**What:** Maintain a separate table for the "Current Score" to allow for fast, simple UI queries.
**When:** Performance-critical UI reads.
**Why:** Re-calculating the entire score from thousands of events on every render is too slow.

## Anti-Patterns to Avoid

### Anti-Pattern 1: "Mutable Global State"
**What:** Directly updating a global "score" object in memory without a persistent event log.
**Why bad:** Causes data loss on app crashes; impossible to audit or correct specific ball errors.
**Instead:** Always append to the event log first; update the view second.

### Anti-Pattern 2: "Tight Sync Coupling"
**What:** Requiring a successful server response before updating the mobile UI.
**Why bad:** Makes the app unusable in the field with poor connectivity (the primary use case).
**Instead:** Use an asynchronous background sync worker.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Database** | Single SQLite file. | Sharded per match; Cloud sync. | Horizontally scaled Postgres for web; Local SQLite for mobile. |
| **PDF Export** | Client-side generation. | Server-side rendering (Next.js). | Dedicated Lambda/Serverless worker for PDF generation. |
| **Audit Logs** | Local-only. | Full cloud archival for league audits. | Indexed event streams for big data analytics. |

## Sources

- [Event Sourcing Pattern (Martin Fowler)](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Local-First Architecture Patterns](https://localfirstweb.com/)
- [PowerSync Data Architecture](https://docs.powersync.com/)
