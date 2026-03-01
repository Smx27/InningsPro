# Product Requirements Document (PRD)

## Purpose
Define the production baseline for InningsPro: capture ball-by-ball cricket scoring data reliably, sync team/session records, and generate shareable reports.

## Product Scope
- **In scope:** mobile-first score capture, scoring validation, report generation, exports, and shared type-safe data contracts.
- **Out of scope (v1):** live public broadcasting, advanced analytics ML, and league administration workflows.

## Primary Users
- Scorers entering live match events.
- Captains/coaches reviewing innings summaries.
- Admin users exporting official score artifacts.

## Core User Flows
1. Create/open match.
2. Record delivery outcome.
3. Correct or undo scoring events.
4. Finalize innings/match.
5. Export reports and machine-readable schemas.

## Non-Functional Requirements
- Fast local interaction under poor connectivity.
- Deterministic scoring outcomes from identical event streams.
- Type-safe contracts across app and shared packages.
- Auditability for corrections and overrides.

## Ownership Expectations
- **Product owner:** defines acceptance criteria and release priorities.
- **Engineering owner:** translates requirements into implementation milestones.
- **QA owner:** validates scoring correctness and regression coverage.
- **Doc owner:** keeps this PRD aligned to shipped behavior.

## Decision Records
- Record major product decisions in `docs/adr/` as ADRs.
- Link each shipped milestone/feature to its ADR entry.
- Include date, owner, alternatives considered, and rollback plan.

## Repository References
- Mobile app: [`apps/mobile/`](../apps/mobile)
- Web reporting app: [`apps/report-web/`](../apps/report-web)
- Shared types: [`packages/shared-types/`](../packages/shared-types)
- UI tokens: [`packages/ui-tokens/`](../packages/ui-tokens)
- Export schema package: [`packages/export-schema/`](../packages/export-schema)
