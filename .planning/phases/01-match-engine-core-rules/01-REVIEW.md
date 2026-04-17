---
phase: 01-match-engine-core-rules
reviewed: 2026-04-18T10:00:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - packages/match-engine/src/reducer.ts
  - packages/match-engine/src/selectors.ts
  - packages/match-engine/src/types.ts
  - packages/match-engine/src/index.ts
findings:
  critical: 1
  warning: 4
  info: 3
  total: 8
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-04-18
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

The match engine core rules implementation provides a solid foundation for cricket scoring using an event-sourced approach. The reducer correctly handles basic deliveries, extras, and wickets while maintaining immutability. However, there are several logic issues related to side effects in the reducer, missing support for complex scoring scenarios (runs on wickets, batter runs on no-balls), and match state transitions.

## Critical Issues

### CR-01: Impure Reducer (Side Effects)

**File:** `packages/match-engine/src/reducer.ts:35, 74, 110`
**Issue:** The `matchReducer` uses `Date.now()` and `new Date().toISOString()` to generate event IDs and timestamps. Reducers must be pure functions to ensure determinism and predictability. Using side effects inside a reducer makes it impossible to reliably replay actions or synchronize state across different clients.
**Fix:** Move ID and timestamp generation to the action creator or pass them as part of the action payload.

```typescript
// In types.ts
| {
    type: 'RECORD_DELIVERY';
    payload: {
      id: Id; // Added
      timestamp: ISODateTime; // Added
      runsOffBat: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      // ...
    };
  }

// In reducer.ts
const newEvent: DeliveryBallEvent = {
  id: action.payload.id,
  timestamp: action.payload.timestamp,
  // ...
};
```

## Warnings

### WR-01: Hardcoded Extra Runs Penalty

**File:** `packages/match-engine/src/reducer.ts:63`
**Issue:** `const totalRuns = (rebowled ? runs + 1 : runs)` assumes a wide or no-ball always adds exactly 1 run penalty. While standard in most formats, this should respect the `MatchRules` (e.g., `wideBallAddsRun`). In some junior or indoor formats, penalties might differ.
**Fix:** Reference `state.rules` to determine the penalty value.

### WR-02: Missing Runs on Wickets

**File:** `packages/match-engine/src/reducer.ts:114`
**Issue:** `RECORD_WICKET` hardcodes `runsCompleted: 0`. In cricket, batters can complete runs on a wicket-taking ball (e.g., a run-out on the second or third run). The current implementation loses these runs.
**Fix:** Add `runsCompleted` to the `RECORD_WICKET` action payload.

### WR-03: Batter Runs on No-Balls Not Tracked

**File:** `packages/match-engine/src/selectors.ts:68`
**Issue:** If a batter hits a no-ball for runs, those runs are currently recorded in the `ExtraBallEvent` but `getBatterStats` does not credit them to the batter. The `ExtraBallEvent` structure doesn't distinguish between the penalty run and runs off the bat.
**Fix:** Update `RECORD_EXTRA` to accept `runsOffBat` for no-balls and update `getBatterStats` to include these runs.

### WR-04: Silent Action Rejection (Bowler Rotation)

**File:** `packages/match-engine/src/reducer.ts:30, 68, 104`
**Issue:** The reducer silently returns the previous state if the same bowler tries to bowl consecutive overs. This "fail-silent" behavior can lead to a poor user experience where the UI appears unresponsive or out of sync with user intent.
**Fix:** Either throw an error (if the UI is expected to prevent this) or include a `reason` in the state for the rejection so the UI can display a warning.

## Info

### IN-01: Duplicated Logic (`isLegalBall`)

**File:** `packages/match-engine/src/reducer.ts:133` and `packages/match-engine/src/selectors.ts:6`
**Issue:** The `isLegalBall` function is duplicated in both files. 
**Fix:** Move `isLegalBall` to a shared utility file or export it from `types.ts`.

### IN-02: Match vs. Innings Completion

**File:** `packages/match-engine/src/reducer.ts:168`
**Issue:** `checkMatchCompletion` sets the whole match status to `completed` as soon as the first innings ends. This prevents the engine from supporting multi-innings matches (the vast majority of cricket).
**Fix:** Introduce an `inningsStatus` and a mechanism to transition between innings.

### IN-03: Fragile ID Generation

**File:** `packages/match-engine/src/reducer.ts:35`
**Issue:** Even if moved out of the reducer, `event_${Date.now()}_${count}` is not a robust ID for distributed environments.
**Fix:** Use a UUID or a more robust unique ID generator.

---

_Reviewed: 2026-04-18T10:00:00Z_
_Reviewer: gsd-code-reviewer_
_Depth: standard_
