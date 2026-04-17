import assert from 'node:assert';
import { test } from 'node:test';

import { matchReducer } from '../reducer.ts';

import type { MatchEngineState } from '../types.ts';

const MOCK_STATE: MatchEngineState = {
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
  startsAt: new Date().toISOString(),
};

test('matchReducer returns state for unknown actions', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = matchReducer(MOCK_STATE, { type: 'UNKNOWN_ACTION' } as any);
  assert.deepStrictEqual(result, { ...MOCK_STATE, lastRejectionReason: undefined });
});

test('RECORD_DELIVERY adds a DeliveryBallEvent and increments ball count', () => {
  const action = {
    type: 'RECORD_DELIVERY' as const,
    payload: {
      id: 'e1',
      timestamp: new Date().toISOString(),
      runsOffBat: 1 as const,
      isBoundary: false,
      batterId: 'player-1',
      nonStrikerId: 'player-2',
      bowlerId: 'player-b1',
    },
  };

  const result = matchReducer(MOCK_STATE, action);
  const innings = result.innings[0]!;
  assert.ok(innings);
  assert.strictEqual(innings.events.length, 1);
  const event = innings.events[0]!;
  assert.ok(event);
  assert.strictEqual(event!.kind, 'delivery');
  assert.strictEqual(event!.overNumber, 0);
  assert.strictEqual(event!.ballInOver, 1);
  if (event!.kind === 'delivery') {
    assert.strictEqual(event!.runsOffBat, 1);
  }
});

test('RECORD_DELIVERY increments ballInOver within an over', () => {
  let state = MOCK_STATE;
  for (let i = 0; i < 3; i++) {
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: {
        id: `e-${i}`,
        timestamp: new Date().toISOString(),
        runsOffBat: 0,
        isBoundary: false,
        batterId: 'p1',
        nonStrikerId: 'p2',
        bowlerId: 'b1',
      },
    });
  }

  const innings = state.innings[0]!;
  assert.ok(innings);
  assert.strictEqual(innings.events.length, 3);
  const lastEvent = innings.events[2]!;
  assert.ok(lastEvent);
  assert.strictEqual(lastEvent.overNumber, 0);
  assert.strictEqual(lastEvent.ballInOver, 3);
});

test('RECORD_EXTRA (wide) adds 1 run and does not increment legal ball count', () => {
  const action = {
    type: 'RECORD_EXTRA' as const,
    payload: {
      id: 'e-w',
      timestamp: new Date().toISOString(),
      type: 'wide' as const,
      runs: 0,
      batterId: 'p1',
      nonStrikerId: 'p2',
      bowlerId: 'b1',
    },
  };

  const result = matchReducer(MOCK_STATE, action);
  const innings = result.innings[0]!;
  assert.ok(innings);
  assert.strictEqual(innings.events.length, 1);
  const event = innings.events[0]!;
  assert.ok(event);
  if (event!.kind === 'extra') {
    assert.strictEqual(event!.extraType, 'wide');
    assert.strictEqual(event!.runs, 1);
    assert.strictEqual(event!.rebowled, true);
  }
  assert.strictEqual(event!.overNumber, 0);
  assert.strictEqual(event!.ballInOver, 1);

  // Next ball should still be in over 0
  const nextResult = matchReducer(result, {
    type: 'RECORD_DELIVERY',
    payload: {
      id: 'e-d',
      timestamp: new Date().toISOString(),
      runsOffBat: 0,
      isBoundary: false,
      batterId: 'p1',
      nonStrikerId: 'p2',
      bowlerId: 'b1',
    },
  });
  const nextInnings = nextResult.innings[0];
  assert.ok(nextInnings);
  const nextEvent = nextInnings.events[1]!;
  assert.ok(nextEvent);
  assert.strictEqual(nextEvent!.overNumber, 0);
  assert.strictEqual(nextEvent!.ballInOver, 2);
});

test('RECORD_EXTRA (no-ball) adds 1 run + runs and does not increment legal ball count', () => {
  const action = {
    type: 'RECORD_EXTRA' as const,
    payload: {
      id: 'e-nb',
      timestamp: new Date().toISOString(),
      type: 'no-ball' as const,
      runs: 2,
      batterId: 'p1',
      nonStrikerId: 'p2',
      bowlerId: 'b1',
    },
  };

  const result = matchReducer(MOCK_STATE, action);
  const innings = result.innings[0]!;
  assert.ok(innings);
  const event = innings.events[0]!;
  assert.ok(event);
  if (event!.kind === 'extra') {
    assert.strictEqual(event!.extraType, 'no-ball');
    assert.strictEqual(event!.runs, 3); // 2 + 1 penalty
    assert.strictEqual(event!.rebowled, true);
  }
});

test('RECORD_WICKET adds a WicketBallEvent and increments wicket count', () => {
  const action = {
    type: 'RECORD_WICKET' as const,
    payload: {
      id: 'e-wk',
      timestamp: new Date().toISOString(),
      type: 'bowled' as const,
      playerOutId: 'p1',
      batterId: 'p1',
      nonStrikerId: 'p2',
      bowlerId: 'b1',
    },
  };

  const result = matchReducer(MOCK_STATE, action);
  const innings = result.innings[0]!;
  assert.ok(innings);
  const event = innings.events[0]!;
  assert.ok(event);
  assert.strictEqual(event!.kind, 'wicket');
  if (event!.kind === 'wicket') {
    assert.strictEqual(event!.wicketType, 'bowled');
    assert.strictEqual(event!.playerOutId, 'p1');
    assert.strictEqual(event!.creditedToBowler, true);
  }
});

test('matchReducer rejects same bowler for consecutive overs', () => {
  let state = MOCK_STATE;
  // Bowl 6 balls with bowler b1
  for (let i = 0; i < 6; i++) {
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: {
        id: `e-o1-${i}`,
        timestamp: new Date().toISOString(),
        runsOffBat: 0,
        isBoundary: false,
        batterId: 'p1',
        nonStrikerId: 'p2',
        bowlerId: 'b1',
      },
    });
  }

  // Try to bowl 7th ball (new over) with same bowler b1
  const result = matchReducer(state, {
    type: 'RECORD_DELIVERY',
    payload: {
      id: 'e-o2-1',
      timestamp: new Date().toISOString(),
      runsOffBat: 0,
      isBoundary: false,
      batterId: 'p1',
      nonStrikerId: 'p2',
      bowlerId: 'b1',
    },
  });

  // Should return state with rejection reason
  assert.strictEqual(result.lastRejectionReason, 'The same bowler cannot bowl consecutive overs.');
  const innings = result.innings[0]!;
  assert.ok(innings);
  assert.strictEqual(innings.events.length, 6);
});

test('RECORD_EXTRA (bye) adds runs and counts as a legal ball', () => {
  const action = {
    type: 'RECORD_EXTRA' as const,
    payload: {
      id: 'e-bye',
      timestamp: new Date().toISOString(),
      type: 'bye' as const,
      runs: 1,
      batterId: 'p1',
      nonStrikerId: 'p2',
      bowlerId: 'b1',
    },
  };

  const result = matchReducer(MOCK_STATE, action);
  const innings = result.innings[0]!;
  assert.ok(innings);
  const event = innings.events[0]!;
  assert.ok(event);
  if (event!.kind === 'extra') {
    assert.strictEqual(event!.extraType, 'bye');
    assert.strictEqual(event!.runs, 1);
    assert.strictEqual(event!.rebowled, false);
  }
  assert.strictEqual(event!.overNumber, 0);
  assert.strictEqual(event!.ballInOver, 1);
});

test('matchReducer completes match when all wickets are lost', () => {
  let state = {
    ...MOCK_STATE,
    rules: { ...MOCK_STATE.rules, wicketsPerInnings: 2 },
  };

  // Record 2 wickets
  for (let i = 0; i < 2; i++) {
    state = matchReducer(state, {
      type: 'RECORD_WICKET',
      payload: {
        id: `e-w-${i}`,
        timestamp: new Date().toISOString(),
        type: 'bowled',
        playerOutId: `p${i + 1}`,
        batterId: 'p1',
        nonStrikerId: 'p2',
        bowlerId: 'b1',
      },
    });
  }

  assert.strictEqual(state.status, 'completed');
});

test('matchReducer completes match when max overs are reached', () => {
  let state = {
    ...MOCK_STATE,
    rules: { ...MOCK_STATE.rules, maxOversPerInnings: 1, ballsPerOver: 2 },
  };

  // Record 2 legal balls
  for (let i = 0; i < 2; i++) {
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: {
        id: `e-o-${i}`,
        timestamp: new Date().toISOString(),
        runsOffBat: 0,
        isBoundary: false,
        batterId: 'p1',
        nonStrikerId: 'p2',
        bowlerId: 'b1',
      },
    });
  }

  assert.strictEqual(state.status, 'completed');
});
