import assert from 'node:assert';
import { describe, it } from 'node:test';

import { matchReducer } from '../reducer.ts';
import { getMatchHints } from '../selectors.ts';

import type { MatchEngineState } from '../types.ts';
import type { MatchRules } from '@inningspro/shared-types';

const defaultRules: MatchRules = {
  maxOversPerInnings: 20,
  ballsPerOver: 6,
  wicketsPerInnings: 10,
  wideBallAddsRun: true,
  noBallAddsRun: true,
  freeHitAfterNoBall: true,
};

const initialState: MatchEngineState = {
  id: 'match-1',
  tournamentId: 'tourney-1',
  homeTeamId: 'team-a',
  awayTeamId: 'team-b',
  startsAt: new Date().toISOString(),
  rules: defaultRules,
  innings: [
    {
      id: 'innings-1',
      matchId: 'match-1',
      battingTeamId: 'team-a',
      bowlingTeamId: 'team-b',
      sequence: 1,
      startsAt: new Date().toISOString(),
      declared: false,
      events: [],
    },
  ],
  status: 'live',
};

describe('Match Engine Hints', () => {
  it('should suggest opening players when no events recorded', () => {
    const hints = getMatchHints(initialState);
    assert.notStrictEqual(hints, null);
    assert.strictEqual(hints?.suggestedStrikerId, null);
    assert.strictEqual(hints?.suggestedNonStrikerId, null);
    assert.strictEqual(hints?.suggestedBowlerId, null);
    assert.match(hints?.message || '', /Match started/);
  });

  it('should not rotate on even runs', () => {
    let state = initialState;
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e1', timestamp: new Date().toISOString(), runsOffBat: 0, isBoundary: false, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });

    const hints = getMatchHints(state);
    assert.strictEqual(hints?.suggestedStrikerId, 'b1');
    assert.strictEqual(hints?.suggestedNonStrikerId, 'b2');
    assert.strictEqual(hints?.suggestedBowlerId, 'bw1');

    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e2', timestamp: new Date().toISOString(), runsOffBat: 2, isBoundary: false, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });

    const hints2 = getMatchHints(state);
    assert.strictEqual(hints2?.suggestedStrikerId, 'b1');
    assert.strictEqual(hints2?.suggestedNonStrikerId, 'b2');
  });

  it('should rotate on odd runs', () => {
    let state = initialState;
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e1', timestamp: new Date().toISOString(), runsOffBat: 1, isBoundary: false, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });

    const hints = getMatchHints(state);
    assert.strictEqual(hints?.suggestedStrikerId, 'b2');
    assert.strictEqual(hints?.suggestedNonStrikerId, 'b1');

    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e2', timestamp: new Date().toISOString(), runsOffBat: 3, isBoundary: false, batterId: 'b2', nonStrikerId: 'b1', bowlerId: 'bw1' }
    });

    const hints2 = getMatchHints(state);
    assert.strictEqual(hints2?.suggestedStrikerId, 'b1');
    assert.strictEqual(hints2?.suggestedNonStrikerId, 'b2');
  });

  it('should rotate on over completion', () => {
    let state = initialState;
    // Bowl 6 balls (all 0 runs)
    for (let i = 1; i <= 6; i++) {
      state = matchReducer(state, {
        type: 'RECORD_DELIVERY',
        payload: { id: `e${i}`, timestamp: new Date().toISOString(), runsOffBat: 0, isBoundary: false, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
      });
    }

    const hints = getMatchHints(state);
    assert.strictEqual(hints?.overJustCompleted, true);
    assert.strictEqual(hints?.suggestedStrikerId, 'b2'); // Swapped due to over completion
    assert.strictEqual(hints?.suggestedNonStrikerId, 'b1');
    assert.strictEqual(hints?.suggestedBowlerId, null); // New bowler needed
  });

  it('should handle odd runs on last ball of over (double rotation)', () => {
    let state = initialState;
    // Bowl 5 balls (0 runs)
    for (let i = 1; i <= 5; i++) {
      state = matchReducer(state, {
        type: 'RECORD_DELIVERY',
        payload: { id: `e${i}`, timestamp: new Date().toISOString(), runsOffBat: 0, isBoundary: false, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
      });
    }
    // 6th ball: 1 run
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e6', timestamp: new Date().toISOString(), runsOffBat: 1, isBoundary: false, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });

    const hints = getMatchHints(state);
    assert.strictEqual(hints?.overJustCompleted, true);
    // 1 run swaps them: b2 is striker.
    // Over completion swaps them again: b1 is striker.
    assert.strictEqual(hints?.suggestedStrikerId, 'b1');
    assert.strictEqual(hints?.suggestedNonStrikerId, 'b2');
  });

  it('should prompt for new batter on wicket', () => {
    let state = initialState;
    state = matchReducer(state, {
      type: 'RECORD_WICKET',
      payload: { id: 'e1', timestamp: new Date().toISOString(), type: 'bowled', playerOutId: 'b1', batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });

    const hints = getMatchHints(state);
    assert.strictEqual(hints?.suggestedStrikerId, null);
    assert.strictEqual(hints?.suggestedNonStrikerId, 'b2');
    assert.match(hints?.message || '', /Batter out/);
  });

  it('should rotate correctly on extras with runs', () => {
    let state = initialState;
    // Wide + 1 run taken = 2 runs total. 1 penalty, 1 run taken. Rotation!
    state = matchReducer(state, {
      type: 'RECORD_EXTRA',
      payload: { id: 'e1', timestamp: new Date().toISOString(), type: 'wide', runs: 1, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });

    const hints = getMatchHints(state);
    assert.strictEqual(hints?.suggestedStrikerId, 'b2');
    assert.strictEqual(hints?.suggestedNonStrikerId, 'b1');

    // No-ball + 4 runs off bat = 5 runs total. 1 penalty, 4 runs taken. No rotation!
    state = matchReducer(state, {
      type: 'RECORD_EXTRA',
      payload: { id: 'e2', timestamp: new Date().toISOString(), type: 'no-ball', runs: 4, runsOffBat: 4, batterId: 'b2', nonStrikerId: 'b1', bowlerId: 'bw1' }
    });

    const hints2 = getMatchHints(state);
    assert.strictEqual(hints2?.suggestedStrikerId, 'b2'); // Still b2
  });
});
