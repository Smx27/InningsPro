# InningsPro

## What This Is

InningsPro is a production-grade cricket scoring system designed for reliable ball-by-ball data capture and reporting. It features a mobile-first scoring application that works offline and a web application for generating professional, shareable reports from exported match schemas.

## Core Value

Enable reliable, rule-strict cricket scoring that persists across poor connectivity and produces professional, portable match artifacts.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Mobile-first score capture (existing in `apps/mobile/`)
- ✓ Shared type-safe data contracts (existing in `packages/shared-types/`)
- ✓ Export schema package (existing in `packages/export-schema/`)
- ✓ UI token system (existing in `packages/ui-tokens/`)

### Active

<!-- Current scope. Building toward these. -->

- [ ] **SYNC-01**: Local-first event queuing with last-write-wins synchronization.
- [ ] **RULE-01**: Strict enforcement of MCC Laws of Cricket in the scoring engine.
- [ ] **REPO-01**: Web-based report generation from uploaded mobile match schemas.
- [ ] **REPO-02**: Professional PDF export for match summaries and scorecards.
- [ ] **AUDIT-01**: Auditable event stream for corrections and overrides.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- **Broadcasting**: Live public broadcasting — focus on capture and reporting first.
- **Analytics**: Advanced ML-based analytics — prioritized after core reliability.
- **League Admin**: Full league administration workflows — out of scope for v1 baseline.

## Context

- **Environment**: Mobile app (Expo/React Native), Web app (Next.js).
- **Architecture**: Decoupled capture and reporting via portable schema files.
- **Connectivity**: Must handle intermittent or no connectivity during matches.
- **Rules**: Scoring engine must be deterministic and audit-compliant.

## Constraints

- **Tech Stack**: React Native (Mobile), Next.js (Web), Shared TypeScript packages.
- **Persistence**: Local-first on mobile; file-based upload for web reporting.
- **Validation**: Strict adherence to MCC laws is mandatory.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Local-First Sync | Ensures reliability in poor connectivity areas. | — Pending |
| Strict Law Enforcement | Guarantees scoring accuracy and official compliance. | — Pending |
| Schema-Based Reporting | Decouples mobile capture from web viewing for portability. | — Pending |
| Local/File-Based Persistence | Simplifies initial infrastructure and ensures data ownership. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-17 after initialization*
