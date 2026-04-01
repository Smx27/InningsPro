import assert from 'node:assert';
import { test } from 'node:test';

import { calculateChasingWinProbability } from './buildWinProbabilityData.ts';

test('calculateChasingWinProbability - returns 100 when remaining runs is 0', () => {
  const state = {
    ballsPlayed: 60,
    currentRuns: 100,
    remainingRuns: 0,
    remainingBalls: 60,
  };
  assert.strictEqual(calculateChasingWinProbability(state), 100);
});

test('calculateChasingWinProbability - returns 0 when remaining balls is 0 and runs are still needed', () => {
  const state = {
    ballsPlayed: 120,
    currentRuns: 90,
    remainingRuns: 10,
    remainingBalls: 0,
  };
  assert.strictEqual(calculateChasingWinProbability(state), 0);
});

test('calculateChasingWinProbability - returns 50 when required run rate is half of MAX_REFERENCE_RUN_RATE', () => {
  // MAX_REFERENCE_RUN_RATE is 12. RRR = 6 should give 50%.
  // 36 runs in 36 balls (6 overs) = 6.0 RRR.
  const state = {
    ballsPlayed: 84,
    currentRuns: 64,
    remainingRuns: 36,
    remainingBalls: 36,
  };
  assert.strictEqual(calculateChasingWinProbability(state), 50);
});

test('calculateChasingWinProbability - returns 0 when required run rate is equal to MAX_REFERENCE_RUN_RATE', () => {
  // RRR = 12 should give 0%.
  // 72 runs in 36 balls (6 overs) = 12.0 RRR.
  const state = {
    ballsPlayed: 84,
    currentRuns: 28,
    remainingRuns: 72,
    remainingBalls: 36,
  };
  assert.strictEqual(calculateChasingWinProbability(state), 0);
});

test('calculateChasingWinProbability - returns 0 when required run rate exceeds MAX_REFERENCE_RUN_RATE', () => {
  // RRR = 15 should give 0% due to clamping.
  // 90 runs in 36 balls (6 overs) = 15.0 RRR.
  const state = {
    ballsPlayed: 84,
    currentRuns: 10,
    remainingRuns: 90,
    remainingBalls: 36,
  };
  assert.strictEqual(calculateChasingWinProbability(state), 0);
});

test('calculateChasingWinProbability - returns correct probability for low run rate', () => {
  // RRR = 1 should give 100 - (1/12)*100 = 91.666...
  // 6 runs in 36 balls (6 overs) = 1.0 RRR.
  const state = {
    ballsPlayed: 84,
    currentRuns: 94,
    remainingRuns: 6,
    remainingBalls: 36,
  };
  const result = calculateChasingWinProbability(state);
  assert.ok(Math.abs(result - 91.66666666666667) < 0.000001);
});

test('calculateChasingWinProbability - clamps result between 0 and 100', () => {
  // Case for > 100 (e.g. negative RRR which shouldn't happen but testing clamp)
  // Actually RRR is always positive because remainingRuns is max(target-runs, 0)
  // But let's check very low RRR.
  const stateLowRRR = {
    ballsPlayed: 119,
    currentRuns: 100,
    remainingRuns: 1,
    remainingBalls: 1, // RRR = 1 / (1/6) = 6. Probability 50%.
  };
  assert.strictEqual(calculateChasingWinProbability(stateLowRRR), 50);

  const stateVeryLowRRR = {
    ballsPlayed: 60,
    currentRuns: 100,
    remainingRuns: 1,
    remainingBalls: 600, // 100 overs. RRR = 1 / 100 = 0.01. Prob = 100 - (0.01/12)*100 = 99.916...
  };
  const result = calculateChasingWinProbability(stateVeryLowRRR);
  assert.ok(result <= 100);
  assert.ok(result >= 0);
});
