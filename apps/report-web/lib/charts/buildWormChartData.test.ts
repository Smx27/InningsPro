import assert from 'node:assert';
import { test } from 'node:test';

import type { MatchReport } from '../../types/report.types.ts';
import { buildWormChartData } from './buildWormChartData.ts';

test('buildWormChartData - returns empty array if innings are missing', () => {
  const report = {
    innings: [],
  } as unknown as MatchReport;

  assert.deepStrictEqual(buildWormChartData(report), []);
});

test('buildWormChartData - returns empty array if only one inning is present', () => {
  const report = {
    innings: [{ ballEvents: [] }],
  } as unknown as MatchReport;

  assert.deepStrictEqual(buildWormChartData(report), []);
});

test('buildWormChartData - correctly aggregates runs for both teams', () => {
  const report = {
    innings: [
      {
        ballEvents: [
          { over: 0, runs: 1, extras: 0 },
          { over: 0, runs: 4, extras: 1 },
          { over: 1, runs: 6, extras: 0 },
        ],
      },
      {
        ballEvents: [
          { over: 0, runs: 0, extras: 1 },
          { over: 1, runs: 2, extras: 0 },
        ],
      },
    ],
  } as unknown as MatchReport;

  const result = buildWormChartData(report);

  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result[0], { over: 1, teamA: 6, teamB: 1 });
  assert.deepStrictEqual(result[1], { over: 2, teamA: 12, teamB: 3 });
});

test('buildWormChartData - carries forward scores when one team has more overs', () => {
  const report = {
    innings: [
      {
        ballEvents: [
          { over: 0, runs: 5, extras: 0 },
          { over: 1, runs: 5, extras: 0 },
          { over: 2, runs: 5, extras: 0 },
        ],
      },
      {
        ballEvents: [
          { over: 0, runs: 2, extras: 0 },
        ],
      },
    ],
  } as unknown as MatchReport;

  const result = buildWormChartData(report);

  assert.strictEqual(result.length, 3);
  assert.deepStrictEqual(result[0], { over: 1, teamA: 5, teamB: 2 });
  assert.deepStrictEqual(result[1], { over: 2, teamA: 10, teamB: 2 });
  assert.deepStrictEqual(result[2], { over: 3, teamA: 15, teamB: 2 });
});

test('buildWormChartData - handles sparse over data', () => {
  const report = {
    innings: [
      {
        ballEvents: [
          { over: 0, runs: 5, extras: 0 },
          { over: 2, runs: 5, extras: 0 },
        ],
      },
      {
        ballEvents: [
          { over: 1, runs: 3, extras: 0 },
        ],
      },
    ],
  } as unknown as MatchReport;

  const result = buildWormChartData(report);

  assert.strictEqual(result.length, 3);
  assert.deepStrictEqual(result[0], { over: 1, teamA: 5, teamB: 0 });
  assert.deepStrictEqual(result[1], { over: 2, teamA: 5, teamB: 3 });
  assert.deepStrictEqual(result[2], { over: 3, teamA: 10, teamB: 3 });
});

test('buildWormChartData - handles unsorted ball events', () => {
  const report = {
    innings: [
      {
        ballEvents: [
          { over: 1, runs: 6, extras: 0 },
          { over: 0, runs: 4, extras: 0 },
        ],
      },
      {
        ballEvents: [
          { over: 0, runs: 2, extras: 0 },
        ],
      },
    ],
  } as unknown as MatchReport;

  const result = buildWormChartData(report);

  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result[0], { over: 1, teamA: 4, teamB: 2 });
  assert.deepStrictEqual(result[1], { over: 2, teamA: 10, teamB: 2 });
});

test('buildWormChartData - handles empty ball events', () => {
  const report = {
    innings: [
      { ballEvents: [] },
      { ballEvents: [] },
    ],
  } as unknown as MatchReport;

  assert.deepStrictEqual(buildWormChartData(report), []);
});
