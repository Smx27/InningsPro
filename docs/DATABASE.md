# Database

## Purpose

Define data persistence expectations for match state, event streams, and export snapshots.

## Data Model Baseline

- **Match metadata** (teams, venue, format, timestamps).
- **Innings state** (overs, wickets, striker/non-striker, bowler).
- **Delivery events** (atomic scoring actions and corrections).
- **Derived summaries** (scorecards, partnerships, fall-of-wicket).

## Persistence Strategy

- Treat delivery events as the source of truth where possible.
- Regenerate derived values from event logs to preserve determinism.
- Store explicit correction metadata for audit and replay.

## Integrity & Validation

- Enforce referential integrity between match/innings/events.
- Validate domain constraints before persist (legal delivery states, wicket combinations, etc.).
- Version persisted payloads to support migrations.

## Ownership Expectations

- **Data owner:** approves schema changes and migration plans.
- **Service/app owners:** consume data only through approved interfaces.
- **QA owner:** runs migration and replay validation checks.

## Decision Records

- Every schema migration requires an ADR with:
  - rationale,
  - forward/backward compatibility notes,
  - rollback/recovery strategy.

## Related Directories

- Shared contracts: [`packages/shared-types/`](../packages/shared-types)
- Export constraints: [`packages/export-schema/`](../packages/export-schema)
- Mobile persistence consumers: [`apps/mobile/`](../apps/mobile)
- Report consumers: [`apps/report-web/`](../apps/report-web)
