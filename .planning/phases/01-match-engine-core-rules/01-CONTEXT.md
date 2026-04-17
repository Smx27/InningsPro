# Phase 1: Match Engine (Core Rules) - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Implementing the basic cricket scoring engine in a shared package. This includes match configuration (overs, players), recording standard ball events (runs, simple extras), and handling basic transitions (over completions, innings end).

</domain>

<decisions>
## Implementation Decisions

### Engine State & Logic
- **D-01: Pure Functional Reducer Pattern.** The engine will follow the pattern `(state, event) => newState`. This ensures portability between the mobile capture app and the web reporting portal.
- **D-02: Event Stream Source of Truth.** The canonical state is a list of events. Summaries like scorecards and batter stats are derived from this stream on demand.
- **D-03: Silent Failure Error Handling.** If an invalid event is attempted (e.g., scoring after a match is complete), the engine returns the original state unchanged rather than throwing an error.

### Configuration & Rules
- **D-04: Dynamic Rule Injection.** The engine does not include hardcoded presets for "Corporate" or "T20" formats. Rules (max overs, players per team) must be explicitly provided when initializing a match state.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Context
- `.planning/PROJECT.md` — Overall project vision and cricket scoring context.
- `.planning/REQUIREMENTS.md` — Specifically FORMAT-01, FORMAT-03, RULE-01, and RULE-02 for this phase.

### Domain Models
- `packages/shared-types/src/index.ts` — Existing definitions for `MatchRules`, `BallEvent`, and `MatchStatus`.
- `packages/export-schema/src/v1/schemas.ts` — Structural requirements for the portable match schema.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `packages/shared-types`: Provides the core interfaces for matches, innings, and ball events.
- `packages/export-schema`: Contains validation logic for match data.

### Integration Points
- `apps/mobile/src/services/match-engine.service.ts`: This existing service should likely be refactored to use the new shared engine logic or act as its wrapper on mobile.

</code_context>

<specifics>
## Specific Ideas

- **Undo Capability**: By using a functional reducer and an event log, the "Undo" feature (Phase 2) becomes as simple as popping the last event and re-calculating the state.

</specifics>

<deferred>
## Deferred Ideas

- **MCC 2022 Compliance**: "Crossing" rules and penalty runs are deferred to Phase 2.
- **Persistence**: SQLite storage and file exports are deferred to Phase 3.

</deferred>

---

*Phase: 01-match-engine-core-rules*
*Context gathered: 2026-04-17*
