import assert from 'node:assert';
import { describe, it } from 'node:test';

import { matchReducer } from '../reducer.ts';
import { getInningsScore, getBatterStats, getBowlerStats } from '../selectors.ts';

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

describe('Match Engine Selectors', () => {
  it('should calculate innings score correctly', () => {
    let state = initialState;
    
    // 1.1: 4 runs
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e1', timestamp: new Date().toISOString(), runsOffBat: 4, isBoundary: true, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });
    
    // 1.2: Wide (1 run)
    state = matchReducer(state, {
      type: 'RECORD_EXTRA',
      payload: { id: 'e2', timestamp: new Date().toISOString(), type: 'wide', runs: 0, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });
    
    // 1.2: 1 run
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e3', timestamp: new Date().toISOString(), runsOffBat: 1, isBoundary: false, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });
    
    // 1.3: Wicket
    state = matchReducer(state, {
      type: 'RECORD_WICKET',
      payload: { id: 'e4', timestamp: new Date().toISOString(), type: 'bowled', playerOutId: 'b1', batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });

    const innings = state.innings[0]!;
    const score = getInningsScore(innings, state.rules);

    assert.strictEqual(score.totalRuns, 6); // 4 + 1 (wide) + 1 + 0 (wicket)
    assert.strictEqual(score.totalWickets, 1);
    assert.strictEqual(score.oversBowled, '0.3');
  });

  it('should calculate batter stats correctly', () => {
    let state = initialState;
    
    // b1 faces 3 balls, scores 10 runs (4, 6, out)
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e1', timestamp: new Date().toISOString(), runsOffBat: 4, isBoundary: true, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e2', timestamp: new Date().toISOString(), runsOffBat: 6, isBoundary: true, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });
    state = matchReducer(state, {
      type: 'RECORD_WICKET',
      payload: { id: 'e3', timestamp: new Date().toISOString(), type: 'caught', playerOutId: 'b1', batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });

    const stats = getBatterStats(state.innings[0]!, 'b1');
    assert.strictEqual(stats.runs, 10);
    assert.strictEqual(stats.balls, 3);
    assert.strictEqual(stats.fours, 1);
    assert.strictEqual(stats.sixes, 1);
    assert.strictEqual(stats.strikeRate, 333.33);
  });

  it('should calculate bowler stats correctly', () => {
    let state = initialState;
    
    // bw1 bowls 1 over, concedes 10 runs (4, 0, 1wd, 1nb, 4), 1 wicket
    // Over 0:
    // 0.1: 4
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e1', timestamp: new Date().toISOString(), runsOffBat: 4, isBoundary: true, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });
    // 0.2: 0
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e2', timestamp: new Date().toISOString(), runsOffBat: 0, isBoundary: false, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });
    // 0.2 (wide): 1 run (bowler gets +1)
    state = matchReducer(state, {
      type: 'RECORD_EXTRA',
      payload: { id: 'e3', timestamp: new Date().toISOString(), type: 'wide', runs: 0, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });
    // 0.2 (no-ball): 1 run (bowler gets +1)
    state = matchReducer(state, {
      type: 'RECORD_EXTRA',
      payload: { id: 'e4', timestamp: new Date().toISOString(), type: 'no-ball', runs: 0, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });
    // 0.3: 4
    state = matchReducer(state, {
      type: 'RECORD_DELIVERY',
      payload: { id: 'e5', timestamp: new Date().toISOString(), runsOffBat: 4, isBoundary: true, batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });
    // 0.4: Wicket
    state = matchReducer(state, {
      type: 'RECORD_WICKET',
      payload: { id: 'e6', timestamp: new Date().toISOString(), type: 'bowled', playerOutId: 'b1', batterId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw1' }
    });

    const stats = getBowlerStats(state.innings[0]!, 'bw1', state.rules);
    assert.strictEqual(stats.runs, 10);
    assert.strictEqual(stats.wickets, 1);
    assert.strictEqual(stats.overs, '0.4');
  });

  it('should verify 5-over / 5-wicket configuration (Corporate format)', () => {
    const corporateRules: MatchRules = {
      maxOversPerInnings: 5,
      ballsPerOver: 6,
      wicketsPerInnings: 5,
      wideBallAddsRun: true,
      noBallAddsRun: true,
      freeHitAfterNoBall: true,
    };

    let state: MatchEngineState = {
      ...initialState,
      rules: corporateRules,
    };

    // Simulate 5 wickets
    for (let i = 0; i < 5; i++) {
      state = matchReducer(state, {
        type: 'RECORD_WICKET',
        payload: { 
          id: `ew-${i}`,
          timestamp: new Date().toISOString(),
          type: 'bowled', 
          playerOutId: `p${i}`, 
          batterId: `p${i}`, 
          nonStrikerId: 'p99', 
          bowlerId: i % 2 === 0 ? 'bw1' : 'bw2' 
        }
      });
    }

    assert.strictEqual(state.status, 'completed');
    const score = getInningsScore(state.innings[0]!, state.rules);
    assert.strictEqual(score.totalWickets, 5);

    // Reset and simulate 5 overs (30 balls)
    state = { ...initialState, rules: corporateRules };
    for (let o = 0; o < 5; o++) {
        const bowlerId = o % 2 === 0 ? 'bw1' : 'bw2';
        for (let b = 0; b < 6; b++) {
            state = matchReducer(state, {
                type: 'RECORD_DELIVERY',
                payload: { 
                  id: `ed-${o}-${b}`,
                  timestamp: new Date().toISOString(),
                  runsOffBat: 1, 
                  isBoundary: false, 
                  batterId: 'b1', 
                  nonStrikerId: 'b2', 
                  bowlerId 
                }
            });
        }
    }

    assert.strictEqual(state.status, 'completed');
    const scoreFinal = getInningsScore(state.innings[0]!, state.rules);
    assert.strictEqual(scoreFinal.oversBowled, '5.0');
    assert.strictEqual(scoreFinal.totalRuns, 30);
  });
});
