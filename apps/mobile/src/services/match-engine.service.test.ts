import assert from 'node:assert';
import { test, describe } from 'node:test';

import { MatchEngineService } from './match-engine.service';

/**
 * Unit tests for MatchEngineService pure logic.
 * These tests focus on initialState() and addBall() which do not have external dependencies.
 */

describe('MatchEngineService', () => {
  const service = new MatchEngineService();

  test('initialState() - returns correct default state', () => {
    const state = service.initialState();

    assert.strictEqual(state.matchId, '');
    assert.strictEqual(state.inningsNumber, 1);
    assert.strictEqual(state.totalRuns, 0);
    assert.strictEqual(state.totalWickets, 0);
    assert.strictEqual(state.overs, 0);
    assert.strictEqual(state.legalBalls, 0);
    assert.strictEqual(state.runRate, 0);
    assert.strictEqual(state.currentStriker, null);
    assert.strictEqual(state.currentNonStriker, null);
    assert.deepStrictEqual(state.last6Balls, []);
    assert.strictEqual(state.runs, 0);
    assert.strictEqual(state.wickets, 0);
    assert.strictEqual(state.balls, 0);
  });

  test('addBall() - correctly updates state for a regular ball with runs', () => {
    const initialState = service.initialState();
    const state = service.addBall(initialState, 4);

    assert.strictEqual(state.runs, 4);
    assert.strictEqual(state.totalRuns, 4);
    assert.strictEqual(state.balls, 1);
    assert.strictEqual(state.legalBalls, 1);
    assert.strictEqual(state.wickets, 0);
    assert.strictEqual(state.totalWickets, 0);
    assert.strictEqual(state.overs, 0.1);
    assert.strictEqual(state.runRate, 24); // 4 runs / (1/6) overs = 24
  });

  test('addBall() - correctly updates state for a wicket', () => {
    const initialState = service.initialState();
    const state = service.addBall(initialState, 0, true);

    assert.strictEqual(state.runs, 0);
    assert.strictEqual(state.balls, 1);
    assert.strictEqual(state.wickets, 1);
    assert.strictEqual(state.totalWickets, 1);
    assert.strictEqual(state.overs, 0.1);
    assert.strictEqual(state.runRate, 0);
  });

  test('addBall() - correctly calculates overs and run rate after multiple balls', () => {
    let state = service.initialState();

    // Add 6 balls (1 over), total 6 runs
    for (let i = 0; i < 6; i++) {
      state = service.addBall(state, 1);
    }

    assert.strictEqual(state.balls, 6);
    assert.strictEqual(state.legalBalls, 6);
    assert.strictEqual(state.overs, 1.0);
    assert.strictEqual(state.runRate, 6.0);
    assert.strictEqual(state.runs, 6);

    // Add 1 more ball
    state = service.addBall(state, 3);
    assert.strictEqual(state.balls, 7);
    assert.strictEqual(state.overs, 1.1);
    assert.strictEqual(state.runs, 9);
    // Run rate: 9 runs / (7/6) overs = 9 / 1.1666... = 7.714... -> toFixed(2) -> 7.71
    assert.strictEqual(state.runRate, 7.71);
  });
});
