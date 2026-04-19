---
phase: "02-match-engine-mcc-compliance-audit"
plan: "02"
status: complete
date: 2026-04-19
---

# Summary: Implement MCC 2022 Laws, Penalties, and Retirements

Updated the match engine to comply with MCC 2022 Law 18.11 and added support for standalone 5-run penalties and batter retirements.

## Key Files Modified/Created
- `packages/shared-types/src/index.ts`: Added `RetirementBallEvent` to the `BallEvent` union.
- `packages/match-engine/src/types.ts`: Added `RECORD_PENALTY` and `RETIRE_BATTER` actions.
- `packages/match-engine/src/reducer.ts`:
    - Implemented `RECORD_PENALTY` (adds 5 runs).
    - Implemented `RETIRE_BATTER` (handles `hurt` as non-wicket and `out` as wicket).
    - Updated `recreateStateFromStream` to support new event types.
- `packages/match-engine/src/selectors.ts`:
    - Updated `getInningsScore` to include penalty runs.
    - Updated `getMatchHints` to enforce MCC 2022 Law 18.11 (no strike rotation on Caught dismissal).
    - Updated `getMatchHints` to handle batter retirements (prompts for new batter).
- `packages/match-engine/src/__tests__/mcc-laws.test.ts`: Added tests for new rules and actions.

## Key Decisions
- **MCC 2022 Law 18.11**: Implemented by adding a `preventRotationByRuns` flag in `getMatchHints` specifically for 'caught' wickets.
- **Retirement hurt as a BallEvent**: Added `RetirementBallEvent` to ensure retirements are preserved through the event stream for full auditability and replay.

## Verification Results
- `npm test -- packages/match-engine/src/__tests__/mcc-laws.test.ts`: PASSED
- Full test suite in `packages/match-engine`: PASSED (28 tests total)

## Self-Check: PASSED
