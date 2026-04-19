---
phase: "02-match-engine-mcc-compliance-audit"
plan: "03"
status: complete
date: 2026-04-19
---

# Summary: Implement Last Man Stands and Enhanced Hints

Implemented specialized strike rotation logic for "Last Man Stands" (LMS) format and enhanced match hints to support returnable batters.

## Key Files Modified/Created
- `packages/shared-types/src/index.ts`: Added `lastManStands` to `MatchRules`.
- `packages/match-engine/src/selectors.ts`:
    - Updated `getMatchHints` to handle LMS strike rotation (last batter stays on strike).
    - Updated `getMatchHints` to automatically transition the non-striker to striker when the 4th wicket falls in LMS mode.
    - Updated `getMatchHints` to signal available "Retired Hurt" batters in the message when a new batter is needed.
- `packages/match-engine/src/__tests__/lms-logic.test.ts`: Added tests for LMS rotation and retirement suggestions.

## Key Decisions
- **LMS Strike Continuity**: In LMS mode, once 4 wickets are down, the remaining batter stays as the suggested striker regardless of runs scored or over completion, as per common Corporate Turf rules (D-08).
- **Retired Hurt Visibility**: Enhanced the `getMatchHints` message to proactively list players who can return, aiding the scorer in the UI phase.

## Verification Results
- `npm test -- packages/match-engine/src/__tests__/lms-logic.test.ts`: PASSED
- Full test suite in `packages/match-engine`: PASSED (32 tests total)

## Self-Check: PASSED
