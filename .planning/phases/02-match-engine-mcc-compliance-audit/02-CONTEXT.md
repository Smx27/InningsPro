# Phase 02: Match Engine (MCC Compliance & Audit) - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase expands the `@inningspro/match-engine` shared package to handle complex scoring scenarios (MCC 2022 compliance), penalty runs, batter retirements, and full match auditability (undo/redo via event replay).

The goal is to move from basic scoring to a fully auditable and rule-strict engine that can handle professional and corporate turf cricket formats.

</domain>

<decisions>
## Implementation Decisions

### Audit & Undo Mechanism
- **D-01: Event Replay for Undo:** "Undo" (RULE-06) will be implemented by replaying the entire event stream. This ensures the engine remains pure and deterministic.
- **D-02: Full Stream Replay Function:** The engine will expose a `recreateStateFromStream(events, rules)` function to support both initial state loading and full auditability.
- **D-03: Replace & Replay for Corrections:** Correcting a past event involves replacing it in the stream and replaying all subsequent events to derive the new current state.

### MCC 2022 Compliance
- **D-04: Strict 2022 Caught Rule:** The engine will strictly enforce Law 18.11 (2022 edition) where the new batter always takes strike after a "Caught" dismissal, regardless of whether the batters crossed.
- **D-05: Standalone Penalty Actions:** Penalty runs (RULE-04) will be recorded as standalone `RECORD_PENALTY` actions that insert `PenaltyBallEvent`s into the stream. They can occur between deliveries (e.g., slow over rate).

### Batter Lifecycle & Transitions
- **D-06: Retired Hurt vs. Retired Out:** The engine will distinguish between "Retired Hurt" (returnable) and "Retired Out" (final) as per RULE-05.
- **D-07: Returnable Batter Hints:** `getMatchHints` will include "Retired Hurt" batters in the suggested next-batter list when a new batter is needed.
- **D-08: Last Man Stand (LMS) Strike Rotation:** In LMS scenarios (FORMAT-02), the last batter remains on strike for all subsequent deliveries in the over (Continuous strike), ignoring standard rotation on even runs.

### Claude's Discretion
- Implementation of the event replay loop (optimization vs. simple loop).
- Internal state structure for tracking "Retired" vs "Dismissed" players (likely in a `battingCard` or derived from events).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Core vision and "Strict Law Enforcement" decision.
- `.planning/REQUIREMENTS.md` — FORMAT-02, RULE-03, RULE-04, RULE-05, RULE-06 definitions.
- `docs/SCORING_ENGINE.md` — Deterministic scoring core requirements.

### Phase 1 Context (Prerequisite)
- `.planning/phases/01-match-engine-core-rules/01-01-SUMMARY.md` — Infrastructure and core types.
- `.planning/phases/01-match-engine-core-rules/01-02-SUMMARY.md` — Basic scoring logic.
- `.planning/phases/01-match-engine-core-rules/01-03-SUMMARY.md` — Selectors and 5-over verification.

### External Standards
- [MCC Laws of Cricket (2022 Edition)](https://www.lords.org/mcc/about-the-laws-of-cricket) — Specifically Law 18.11 (Caught) and Law 41/42 (Penalties).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `isLegalBall` (from `@inningspro/shared-types`): Shared logic for counting balls in an over.
- `getInningsScore` (from `@inningspro/match-engine`): Base scorecard calculation.
- `getMatchHints` (from `@inningspro/match-engine`): Extension point for striker suggestions and LMS logic.

### Established Patterns
- **Pure Reducer:** The `matchReducer` is a pure function (fixed in Phase 1). All events must have `id` and `timestamp` passed in the payload.
- **Discriminated Union Actions:** `MatchEngineAction` should be extended with `RECORD_PENALTY` and `RETIRE_BATTER`.

### Integration Points
- `packages/match-engine/src/reducer.ts`: Core logic for MCC laws and penalties.
- `packages/match-engine/src/selectors.ts`: Enhanced stats and hint logic for LMS and retirements.

</code_context>

<specifics>
## Specific Ideas
- The engine should be able to "replay" a match from a JSON export of events to verify consistency.
- "Last Man Stand" is a key requirement for Corporate Turf (5-a-side) matches.

</specifics>

<deferred>
## Deferred Ideas
- **Multi-Innings Support:** (IN-02 from Phase 1 review) - Handling transitions between innings (e.g., T20 second innings, Test match follow-on) is deferred to Phase 3 or 4 when the Mobile App UI needs it.

</deferred>

---

*Phase: 02-match-engine-mcc-compliance-audit*
*Context gathered: 2026-04-18*
