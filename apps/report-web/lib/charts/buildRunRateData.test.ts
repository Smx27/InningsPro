import assert from 'node:assert';
import { test } from 'node:test';

import type { InningsReport } from '../../types/report.types';
import { buildRunRateData } from './buildRunRateData.ts';

test('buildRunRateData - returns empty array for empty ball events', () => {
  const innings = {
    ballEvents: [],
  } as unknown as InningsReport;

  assert.deepStrictEqual(buildRunRateData(innings), []);
});

test('buildRunRateData - returns empty array for missing ball events', () => {
  const innings = {} as unknown as InningsReport;

  assert.deepStrictEqual(buildRunRateData(innings), []);
});

test('buildRunRateData - correctly calculates run rate for a single over', () => {
  const innings = {
    ballEvents: [
      { over: 0, runs: 1, extras: 0 },
      { over: 0, runs: 4, extras: 1 },
    ],
  } as unknown as InningsReport;

  const result = buildRunRateData(innings);
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0]?.over, 1);
  assert.strictEqual(result[0]?.runRate, 6); // (1 + 4 + 1) / 1 = 6
});

test('buildRunRateData - correctly calculates run rate for multiple overs', () => {
  const innings = {
    ballEvents: [
      { over: 0, runs: 6, extras: 0 }, // Over 1: 6 runs, Total: 6, RR: 6
      { over: 1, runs: 4, extras: 0 }, // Over 2: 4 runs, Total: 10, RR: 5
    ],
  } as unknown as InningsReport;

  const result = buildRunRateData(innings);
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0]?.over, 1);
  assert.strictEqual(result[0]?.runRate, 6);
  assert.strictEqual(result[1]?.over, 2);
  assert.strictEqual(result[1]?.runRate, 5);
});

test('buildRunRateData - handles unsorted ball events', () => {
  const innings = {
    ballEvents: [
      { over: 1, runs: 4, extras: 0 },
      { over: 0, runs: 6, extras: 0 },
    ],
  } as unknown as InningsReport;

  const result = buildRunRateData(innings);
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0]?.over, 1);
  assert.strictEqual(result[0]?.runRate, 6);
  assert.strictEqual(result[1]?.over, 2);
  assert.strictEqual(result[1]?.runRate, 5);
});

test('buildRunRateData - rounds run rate to 2 decimal places', () => {
  const innings = {
    ballEvents: [
      { over: 0, runs: 1, extras: 0 }, // Over 1: 1 run, RR: 1
      { over: 1, runs: 0, extras: 0 }, // Over 2: 0 runs, Total: 1, RR: 0.5
      { over: 2, runs: 0, extras: 0 }, // Over 3: 0 runs, Total: 1, RR: 0.333...
    ],
  } as unknown as InningsReport;

  const result = buildRunRateData(innings);
  assert.strictEqual(result.length, 3);
  assert.strictEqual(result[2]?.over, 3);
  assert.strictEqual(result[2]?.runRate, 0.33);
});
