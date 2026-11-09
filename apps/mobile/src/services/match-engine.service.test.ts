import { describe, it, expect, vi } from 'vitest';

vi.mock('./db.service', () => ({
  databaseService: {},
}));

import { MatchEngineService } from './match-engine.service';

/**
 * Unit tests for MatchEngineService pure logic.
 * These tests focus on initialState() and addBall() which do not have external dependencies.
 */

describe('MatchEngineService', () => {
  const service = new MatchEngineService();

  it('initialState() - returns correct default state', () => {
    const state = service.initialState();

    expect(state.matchId).toBe('');
    expect(state.inningsNumber).toBe(1);
    expect(state.totalRuns).toBe(0);
    expect(state.totalWickets).toBe(0);
    expect(state.overs).toBe(0);
    expect(state.legalBalls).toBe(0);
    expect(state.runRate).toBe(0);
    expect(state.currentStriker).toBeNull();
    expect(state.currentNonStriker).toBeNull();
    expect(state.last6Balls).toEqual([]);
    expect(state.runs).toBe(0);
    expect(state.wickets).toBe(0);
    expect(state.balls).toBe(0);
  });

  it('addBall() - correctly updates state for a regular ball with runs', () => {
    const initialState = service.initialState();
    const state = service.addBall(initialState, 4);

    expect(state.runs).toBe(4);
    expect(state.totalRuns).toBe(4);
    expect(state.balls).toBe(1);
    expect(state.legalBalls).toBe(1);
    expect(state.wickets).toBe(0);
    expect(state.totalWickets).toBe(0);
    expect(state.overs).toBe(0.1);
    expect(state.runRate).toBe(24);
  });

  it('addBall() - correctly updates state for a wicket', () => {
    const initialState = service.initialState();
    const state = service.addBall(initialState, 0, true);

    expect(state.runs).toBe(0);
    expect(state.balls).toBe(1);
    expect(state.wickets).toBe(1);
    expect(state.totalWickets).toBe(1);
    expect(state.overs).toBe(0.1);
    expect(state.runRate).toBe(0);
  });

  it('addBall() - correctly calculates overs and run rate after multiple balls', () => {
    let state = service.initialState();

    // Add 6 balls (1 over), total 6 runs
    for (let i = 0; i < 6; i++) {
      state = service.addBall(state, 1);
    }

    expect(state.balls).toBe(6);
    expect(state.legalBalls).toBe(6);
    expect(state.overs).toBe(1.0);
    expect(state.runRate).toBe(6.0);
    expect(state.runs).toBe(6);

    // Add 1 more ball
    state = service.addBall(state, 3);
    expect(state.balls).toBe(7);
    expect(state.overs).toBe(1.1);
    expect(state.runs).toBe(9);
    expect(state.runRate).toBe(7.71);
  });
});
