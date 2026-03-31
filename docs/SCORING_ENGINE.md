# Scoring Engine

## Objective

Specify the deterministic scoring rules engine that turns delivery events into innings and match state.

## Responsibilities

- Accept validated delivery/correction inputs.
- Apply cricket scoring rules consistently.
- Emit updated canonical state and audit metadata.

## Input/Output Contract

- **Input:** typed match context + new event.
- **Output:** new state snapshot + emitted domain events/errors.
- Engine behavior must be deterministic for identical input streams.

## Rule Domains

- Runs (bat, extras, penalties).
- Wickets (mode, attribution, ball legality).
- Over progression and legal-delivery counting.
- Strike rotation and batter transitions.
- Undo/amend correction handling.

## Reliability Requirements

- Pure/side-effect-minimized scoring core.
- Replay-safe logic for historical recomputation.
- Exhaustive edge-case test coverage for law combinations.

## Ownership Expectations

- **Domain owner:** signs off on scoring law interpretation.
- **Engine owner:** maintains deterministic implementation and tests.
- **Integrator owners:** do not fork scoring behavior in apps.

## Decision Records

- Any scoring law interpretation or contract change requires ADR documentation and examples.

## Code References

- Shared domain types: [`packages/shared-types/`](../packages/shared-types)
- Mobile scoring UX integration: [`apps/mobile/`](../apps/mobile)
- Report consumption: [`apps/report-web/`](../apps/report-web)
