# Phase 02: Match Engine (MCC Compliance & Audit) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 02-match-engine-mcc-compliance-audit
**Areas discussed:** Audit/Undo (Replay vs Stack), MCC Law Strictness, Batter States (Retire/LMS)

---

## Audit/Undo (Replay vs Stack)

| Option | Description | Selected |
|--------|-------------|----------|
| Event Replay (Logic) | Replay the entire event stream (deterministic). Cleaner for audit logs and memory. Recommended for event-sourced systems. | ✓ |
| State Snapshot Stack (Data) | Store a stack of previous MatchEngineState objects. Faster for deep undos, consumes more memory. | |

**User's choice:** Event Replay (Logic)
**Notes:** Replaying the event stream was preferred for its determinism and alignment with event-sourcing principles.

---

## Corrections

| Option | Description | Selected |
|--------|-------------|----------|
| Replace & Replay (Audit) | Replace the event in the stream and replay all subsequent events. (Standard for event-sourced). Recommended. | ✓ |
| Correction Events (History) | Add a 'Correction' event to the end of the stream (maintains full history). More complex selectors. | |

**User's choice:** Replace & Replay (Audit)
**Notes:** This approach keeps the current state calculation straightforward by maintaining a "canonical" event stream.

---

## MCC 2022 Law 18.11 (Caught)

| Option | Description | Selected |
|--------|-------------|----------|
| Always New Batter (Strict) | The new batter always comes to the striker's end, regardless of crossing (as per 2022 laws). Recommended. | ✓ |
| Crossing Configurable (Flex) | Let the user choose if crossing happens on 'Caught' wickets (for older or non-standard formats). | |

**User's choice:** Always New Batter (Strict)
**Notes:** Strict adherence to the 2022 laws was chosen to ensure the engine remains officially compliant.

---

## Penalty Runs (RULE-04)

| Option | Description | Selected |
|--------|-------------|----------|
| Standalone Penalty (Action) | Record as a standalone action (e.g., slow over rate, dissent) that inserts a 'PenaltyBallEvent' into the stream. Recommended. | ✓ |
| Attached Penalty (Event) | Attach penalties ONLY to existing delivery/extra/wicket events. Simpler for the UI to represent. | |

**User's choice:** Standalone Penalty (Action)
**Notes:** Standalone actions provide the flexibility to record penalties between deliveries or for off-field incidents.

---

## Batter Retirement (RULE-05)

| Option | Description | Selected |
|--------|-------------|----------|
| Hurt (Returnable) vs Out (Final) | Track 'Retired Hurt' as a returnable state. 'Retired Out' is a final out state. Recommended. | ✓ |
| Simple Retired Out (v1) | Treat all retirements as 'Retired Out' initially for simplicity (v1 MVP). Revisit later. | |

**User's choice:** Hurt (Returnable) vs Out (Final)
**Notes:** The engine will manage a list of available batters to support "Retired Hurt" returns.

---

## Last Man Stand (LMS) Logic (FORMAT-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Striker Stays (Continuous) | The last batter always stays on strike (even on even runs) and the 'non-striker' becomes an 'anchor'. Recommended. | ✓ |
| Phantom Runner (Logic) | The last batter always stays on strike, but rotation still happens as 'phantom' runners. More complex. | |

**User's choice:** Striker Stays (Continuous)
**Notes:** Chosen for its alignment with common corporate turf and indoor cricket rules.

---

## Match Audit/Replay Loop (RULE-06)

| Option | Description | Selected |
|--------|-------------|----------|
| Full Stream Replay (Audit) | Expose a 'recreateStateFromStream' function that takes an event list and rules. (Highly deterministic). Recommended. | ✓ |
| Undo-Only-Last (v1) (UI) | Only allow 'Undo' back to the previous ball (v1 MVP). simpler to implement but less flexible. | |

**User's choice:** Full Stream Replay (Audit)
**Notes:** Essential for long-term auditability and replaying match history.

---

## Returnable Batters (RULE-05) (Audit)

| Option | Description | Selected |
|--------|-------------|----------|
| Returnable Suggestion (Hint) [MCC] | Include 'Retired Hurt' batters in the 'available next batters' hint list. Recommended. (Matches MCC Law). | ✓ |
| New Batters Only (Manual) | Only suggest new (undismissed) batters. Retired batters must be manually selected by the user. | |

**User's choice:** Returnable Suggestion (Hint) [MCC]
**Notes:** The `getMatchHints` selector will be expanded to support return suggestions.

---

## Claude's Discretion

- Internal state structure for tracking "Retired" players vs "Dismissed" players.
- Performance optimization for the replay loop (if needed for long streams).

## Deferred Ideas

- **Multi-Innings Support:** Transitioning between innings (e.g., Test match follow-on) is deferred to Phase 3 or 4.
