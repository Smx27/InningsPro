import { test } from 'node:test';
import assert from 'node:assert';

test('environment verification', () => {
  assert.strictEqual(1 + 1, 2);
});

test('Node.js version check', () => {
  const version = process.versions.node;
  assert.ok(parseInt(version.split('.')[0]) >= 20, 'Node version should be 20 or greater');
});
