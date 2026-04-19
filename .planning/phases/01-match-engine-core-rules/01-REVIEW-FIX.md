---
phase: 01-match-engine-core-rules
fixed_at: 2026-04-18T14:30:00Z
review_path: .planning/phases/01-match-engine-core-rules/01-REVIEW.md
iteration: 1
findings_in_scope: 11
fixed: 3
skipped: 8
status: partial
---

# Phase 01: Code Review Fix Report

**Fixed at:** 2026-04-18T14:30:00Z
**Source review:** .planning/phases/01-match-engine-core-rules/01-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 11 (8 from REVIEW.md + 3 from VERIFICATION.md)
- Fixed: 3
- Skipped: 8 (7 already fixed in prior commits, 1 deferred)

## Fixed Issues (from VERIFICATION.md Gaps)

### GAP-01: Striker rotation logic (odd runs and over completion)

**Files modified:** `packages/match-engine/src/selectors.ts`
**Commit:** 71652a8
**Applied fix:** Implemented logic to calculate striker and non-striker rotation based on odd runs and over completion within the `getMatchHints` selector.

### GAP-02: Selector `getMatchHints` for suggestions

**Files modified:** `packages/match-engine/src/selectors.ts`
**Commit:** 71652a8
**Applied fix:** Added `getMatchHints` selector that provides `suggestedStrikerId`, `suggestedNonStrikerId`, and `suggestedBowlerId` for the next ball.

### GAP-03: Prompts/Hints for transitions

**Files modified:** `packages/match-engine/src/selectors.ts`
**Commit:** 71652a8
**Applied fix:** Included a descriptive `message` in the `getMatchHints` output to provide prompts for transitions (over completion, wicket fallen).

## Skipped Issues (from REVIEW.md)

### CR-01: Impure Reducer (Side Effects)

**File:** `packages/match-engine/src/reducer.ts:35`
**Reason:** Already fixed in commit `f0712de`. Current reducer uses `action.payload.id` and `action.payload.timestamp`.
**Original issue:** The `matchReducer` uses `Date.now()` and `new Date().toISOString()` to generate event IDs and timestamps.

### WR-01: Hardcoded Extra Runs Penalty

**File:** `packages/match-engine/src/reducer.ts:63`
**Reason:** Already fixed in commit `f0712de`. Current reducer references `state.rules` for penalty calculation.
**Original issue:** `const totalRuns = (rebowled ? runs + 1 : runs)` assumes exactly 1 run penalty for extras.

### WR-02: Missing Runs on Wickets

**File:** `packages/match-engine/src/reducer.ts:114`
**Reason:** Already fixed in commit `f0712de`. Current reducer supports `runsCompleted` in `RECORD_WICKET`.
**Original issue:** `RECORD_WICKET` hardcodes `runsCompleted: 0`.

### WR-03: Batter Runs on No-Balls Not Tracked

**File:** `packages/match-engine/src/selectors.ts:68`
**Reason:** Already fixed in commit `f0712de`. `getBatterStats` correctly includes `runsOffBat` from `extra` events.
**Original issue:** Batter hits on no-balls were not credited to the batter in statistics.

### WR-04: Silent Action Rejection (Bowler Rotation)

**File:** `packages/match-engine/src/reducer.ts:30`
**Reason:** Already fixed in commit `f0712de`. `lastRejectionReason` added to state.
**Original issue:** The reducer silently returns the previous state if the same bowler tries to bowl consecutive overs.

### IN-01: Duplicated Logic (`isLegalBall`)

**File:** `packages/match-engine/src/reducer.ts:133`
**Reason:** Already fixed in commit `f0712de`. `isLegalBall` is imported from `@inningspro/shared-types`.
**Original issue:** The `isLegalBall` function was duplicated in multiple files.

### IN-02: Match vs. Innings Completion

**File:** `packages/match-engine/src/reducer.ts:168`
**Reason:** Deferred to Phase 2. Phase 2 roadmap includes "Innings transition logic" and multi-innings support.
**Original issue:** Match status set to `completed` after the first innings.

### IN-03: Fragile ID Generation

**File:** `packages/match-engine/src/reducer.ts:35`
**Reason:** Already addressed by moving ID generation to action creators (Commit `f0712de`).
**Original issue:** Event IDs generated using `Date.now()` are not robust.

---

_Fixed: 2026-04-18T14:30:00Z_
_Fixer: the agent (gsd-code-fixer)_
_Iteration: 1_
