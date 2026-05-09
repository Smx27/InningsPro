import assert from 'node:assert';
import { test } from 'node:test';

import type { MatchReport } from '../../types/report.types';
import { buildWormChartData } from './buildWormChartData.ts';

test('buildWormChartData - returns empty array for less than two innings', () => {
  const report = {
    innings: [],
  } as unknown as MatchReport;

  assert.deepStrictEqual(buildWormChartData(report), []);

  const singleInningsReport = {
    innings: [{ ballEvents: [] }],
  } as unknown as MatchReport;

  assert.deepStrictEqual(buildWormChartData(singleInningsReport), []);
});

test('buildWormChartData - correctly calculates cumulative runs for both teams', () => {
  const report = {
    innings: [
      {
        ballEvents: [
          { over: 0, runs: 1, extras: 1 }, // Over 1: 2 runs
          { over: 1, runs: 4, extras: 0 }, // Over 2: 4 runs, Total: 6
        ],
      },
      {
        ballEvents: [
          { over: 0, runs: 0, extras: 1 }, // Over 1: 1 run
          { over: 1, runs: 6, extras: 0 }, // Over 2: 6 runs, Total: 7
        ],
      },
    ],
  } as unknown as MatchReport;

  const result = buildWormChartData(report);
  assert.strictEqual(result.length, 2);

  assert.strictEqual(result[0]?.over, 1);
  assert.strictEqual(result[0]?.teamA, 2);
  assert.strictEqual(result[0]?.teamB, 1);

  assert.strictEqual(result[1]?.over, 2);
  assert.strictEqual(result[1]?.teamA, 6);
  assert.strictEqual(result[1]?.teamB, 7);
});

test('buildWormChartData - handles unequal number of overs (Team A longer)', () => {
  const report = {
    innings: [
      {
        ballEvents: [
          { over: 0, runs: 5, extras: 0 }, // Over 1: 5
          { over: 1, runs: 5, extras: 0 }, // Over 2: 10
        ],
      },
      {
        ballEvents: [
          { over: 0, runs: 3, extras: 0 }, // Over 1: 3
        ],
      },
    ],
  } as unknown as MatchReport;

  const result = buildWormChartData(report);
  assert.strictEqual(result.length, 2);

  assert.strictEqual(result[0]?.over, 1);
  assert.strictEqual(result[0]?.teamA, 5);
  assert.strictEqual(result[0]?.teamB, 3);

  assert.strictEqual(result[1]?.over, 2);
  assert.strictEqual(result[1]?.teamA, 10);
  assert.strictEqual(result[1]?.teamB, 3); // Team B stays at last known score
});

test('buildWormChartData - handles unequal number of overs (Team B longer)', () => {
  const report = {
    innings: [
      {
        ballEvents: [
          { over: 0, runs: 5, extras: 0 }, // Over 1: 5
        ],
      },
      {
        ballEvents: [
          { over: 0, runs: 3, extras: 0 }, // Over 1: 3
          { over: 1, runs: 3, extras: 0 }, // Over 2: 6
        ],
      },
    ],
  } as unknown as MatchReport;

  const result = buildWormChartData(report);
  assert.strictEqual(result.length, 2);

  assert.strictEqual(result[0]?.over, 1);
  assert.strictEqual(result[0]?.teamA, 5);
  assert.strictEqual(result[0]?.teamB, 3);

  assert.strictEqual(result[1]?.over, 2);
  assert.strictEqual(result[1]?.teamA, 5); // Team A stays at last known score
  assert.strictEqual(result[1]?.teamB, 6);
});

test('buildWormChartData - handles unsorted ball events', () => {
  const report = {
    innings: [
      {
        ballEvents: [
          { over: 1, runs: 4, extras: 0 },
          { over: 0, runs: 6, extras: 0 },
        ],
      },
      {
        ballEvents: [
          { over: 1, runs: 2, extras: 0 },
          { over: 0, runs: 3, extras: 0 },
        ],
      },
    ],
  } as unknown as MatchReport;

  const result = buildWormChartData(report);
  assert.strictEqual(result.length, 2);

  assert.strictEqual(result[0]?.over, 1);
  assert.strictEqual(result[0]?.teamA, 6);
  assert.strictEqual(result[0]?.teamB, 3);

  assert.strictEqual(result[1]?.over, 2);
  assert.strictEqual(result[1]?.teamA, 10);
  assert.strictEqual(result[1]?.teamB, 5);
});
