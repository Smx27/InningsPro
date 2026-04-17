# Testing Patterns

**Analysis Date:** 2024-05-15

## Test Framework

**Runner:**
- Native Node.js test runner (`node:test`)
- Tests are executed via standard test commands defined in package scripts.

**Assertion Library:**
- Native Node.js assert (`node:assert`)

## Test File Organization

**Location:**
- Co-located next to the implementation file (e.g., `apps/report-web/lib/charts/buildRunRateData.test.ts` next to `buildRunRateData.ts`).

**Naming:**
- `[name].test.ts`

## Test Structure

**Suite Organization:**
```typescript
import assert from 'node:assert';
import { test } from 'node:test';

import { buildRunRateData } from './buildRunRateData';

test('buildRunRateData - returns empty array for empty ball events', () => {
  // Setup & Assertion
});
```

**Patterns:**
- Tests are typically flat, using `test()` directly without wrapping `describe()` blocks.
- Descriptive test names following the pattern: `[functionName] - [expected behavior]`.

**Assertions:**
- `assert.strictEqual(actual, expected)` for primitives.
- `assert.deepStrictEqual(actual, expected)` for objects/arrays.
- `assert.ok(condition)` for booleans/comparisons.
- `assert.throws(fn, ErrorMatcher)` for testing exceptions (e.g., Zod errors in `packages/export-schema/src/v1/validators.test.ts`).

## Mocking

- Native features or simple stubs are used. Minimal complex mocking framework patterns were observed in the explored files. Test data is often constructed directly in the test (e.g., partial objects cast via `as unknown as InningsReport`).

## Fixtures and Factories

**Test Data:**
```typescript
const validTournamentPayload = {
  schemaVersion: '1.0.0',
  // ... nested payload data ...
};
```
Test data objects are generally defined as constants at the top of the test file or inside the individual test.

## Common Patterns

**Error Testing:**
```typescript
test('safeParseTournamentExport returns success: false for an invalid payload', () => {
  const invalidPayload = { ...validTournamentPayload, schemaVersion: '1.0.1' };
  const result = safeParseTournamentExport(invalidPayload);
  assert.strictEqual(result.success, false);
});
```

---

*Testing analysis: 2024-05-15*
