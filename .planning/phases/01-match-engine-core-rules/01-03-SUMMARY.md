# Summary: Implement Scorecard and Stats Selectors

Implemented derived state selectors to calculate scorecards and statistics from the event stream and verified the engine's configurability for specific match formats.

## Key Files Modified
- `packages/match-engine/src/selectors.ts`: Implemented pure functional selectors for innings score, batter stats, and bowler stats.
- `packages/match-engine/src/__tests__/selectors.test.ts`: Added comprehensive tests for selectors and verified 5-over/5-wicket match format.

## Key Features Implemented
- **Innings Scorecard**: `getInningsScore` calculates total runs, wickets, and overs in "X.Y" format.
- **Batter Statistics**: `getBatterStats` tracks runs, balls faced, boundaries (fours/sixes), and strike rate.
- **Bowler Statistics**: `getBowlerStats` tracks overs, maidens, runs conceded, wickets, and economy rate.
- **Configurability Verification**: Successfully verified that the match engine correctly handles a "Corporate" match format (5 overs, 5 wickets) using the `MatchRules` configuration.

## Verification Results
- `node --test packages/match-engine/src/__tests__/selectors.test.ts`: PASSED (4 tests passed).
  - `should calculate innings score correctly`: PASSED
  - `should calculate batter stats correctly`: PASSED
  - `should calculate bowler stats correctly`: PASSED
  - `should verify 5-over / 5-wicket configuration (Corporate format)`: PASSED

## Self-Check: PASSED
- [x] Selectors correctly calculate total score from event stream.
- [x] Batter and Bowler statistics match official scoring rules.
- [x] Match ends correctly for a 5-over / 5-wicket configuration.
