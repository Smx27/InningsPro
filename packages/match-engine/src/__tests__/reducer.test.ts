import { test } from 'node:test';
import assert from 'node:assert';
import { matchReducer } from '../reducer.ts';
import type { MatchEngineState } from '../types.ts';

test('matchReducer returns state for unknown actions', () => {
  const mockState = {
    id: 'match-1',
    tournamentId: 'tour-1',
    homeTeamId: 'team-a',
    awayTeamId: 'team-b',
    rules: {
      maxOversPerInnings: 20,
      ballsPerOver: 6,
      wicketsPerInnings: 10,
      wideBallAddsRun: true,
      noBallAddsRun: true,
      freeHitAfterNoBall: true,
    },
    innings: [],
    status: 'scheduled',
    startsAt: new Date().toISOString(),
  } as MatchEngineState;

  const result = matchReducer(mockState, { type: 'UNKNOWN_ACTION' as any });
  assert.strictEqual(result, mockState);
});
