# Phase 1: Match Engine (Core Rules) - Pattern Map

**Mapped:** 2026-04-18
**Files analyzed:** 13
**Analogs found:** 11 / 13

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `packages/match-engine/package.json` | config | batch | `packages/shared-types/package.json` | exact |
| `packages/match-engine/tsconfig.json` | config | batch | `packages/shared-types/tsconfig.json` | exact |
| `packages/match-engine/src/index.ts` | provider | request-response | `packages/shared-types/src/index.ts` | exact |
| `packages/match-engine/src/reducer/index.ts` | service | transform | `apps/mobile/src/services/match-engine.service.ts` | partial (logic source) |
| `packages/match-engine/src/selectors/index.ts` | utility | transform | `apps/mobile/src/services/scorecard-calculator.service.ts` | exact |
| `packages/match-engine/src/rules/rotation.ts` | utility | transform | `apps/mobile/src/services/match-engine.service.ts` | logic-match |
| `packages/match-engine/src/rules/extras.ts` | utility | transform | `apps/mobile/src/services/match-engine.service.ts` | logic-match |
| `packages/match-engine/src/types/actions.ts` | model | config | `apps/mobile/src/services/match-engine.service.ts` | role-match |
| `packages/match-engine/tests/engine.test.ts` | test | batch | `packages/export-schema/src/v1/validators.test.ts` | exact |
| `packages/match-engine/tests/rotation.test.ts` | test | batch | `packages/export-schema/src/v1/validators.test.ts` | exact |
| `packages/match-engine/tests/extras.test.ts` | test | batch | `packages/export-schema/src/v1/validators.test.ts` | exact |
| `packages/match-engine/tests/config.test.ts` | test | batch | `packages/export-schema/src/v1/validators.test.ts` | exact |
| `apps/mobile/src/services/match-engine.service.ts` | service | request-response | (self) | modify |

## Pattern Assignments

### `packages/match-engine/src/reducer/index.ts` (service, transform)

**Analog:** `apps/mobile/src/services/match-engine.service.ts`

**Imports pattern** (adapted from mobile service):
```typescript
import { type Match, type BallEvent, type Innings } from '@inningspro/shared-types';
import { type ScoringAction } from '../types/actions';
```

**Core Reducer pattern** (refactored from `addBall` and `recordBall` in `match-engine.service.ts` lines 86-103, 114-177):
```typescript
// Proposed Pure Reducer Structure
export function matchReducer(state: Match, action: ScoringAction): Match {
  switch (action.type) {
    case 'RECORD_BALL':
      return recordBall(state, action.payload);
    case 'UNDO_BALL':
      return undoLastBall(state);
    default:
      return state;
  }
}

function recordBall(state: Match, payload: BallEventPayload): Match {
  // logic extracted from MatchEngineService.recordBall
  // MUST NOT MUTATE state
}
```

---

### `packages/match-engine/src/selectors/index.ts` (utility, transform)

**Analog:** `apps/mobile/src/services/scorecard-calculator.service.ts`

**Pattern for reduction over events** (lines 33-66):
```typescript
export const calculateBattingScorecard = (events: BallEvent[]): BattingScore[] => {
  const battingMap = new Map<string, BattingAccumulator>();

  for (const event of events) {
    if (!event.strikerId) continue;
    
    const current = battingMap.get(event.strikerId) ?? initialAccumulator(event.strikerId);
    // ... update stats ...
    battingMap.set(event.strikerId, current);
  }

  return Array.from(battingMap.values()).map(toBattingScore);
};
```

---

### `packages/match-engine/tests/*.test.ts` (test, batch)

**Analog:** `packages/export-schema/src/v1/validators.test.ts`

**Testing pattern** (lines 1-105):
```typescript
import assert from 'node:assert';
import { test } from 'node:test';
import { matchReducer } from '../src/reducer';

test('matchReducer - RECORD_BALL correctly increments runs', () => {
  const initialState = createMockMatch();
  const action = { type: 'RECORD_BALL', payload: { runs: 4 } };
  
  const newState = matchReducer(initialState, action);
  
  assert.strictEqual(newState.innings[0].totalRuns, 4);
});
```

---

### `packages/match-engine/package.json` (config, batch)

**Analog:** `packages/shared-types/package.json`

**Package configuration** (lines 1-32):
```json
{
  "name": "@inningspro/match-engine",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "test": "node --test tests/**/*.test.ts",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "devDependencies": {
    "@inningspro/shared-types": "workspace:*"
  }
}
```

---

## Shared Patterns

### Validation (Zod)
**Source:** `packages/export-schema/src/v1/validators.ts`
**Apply to:** `packages/match-engine/src/types/actions.ts` and `src/reducer/index.ts`
```typescript
import { z } from 'zod';
export const ScoringActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('RECORD_BALL'), payload: BallEventSchema }),
  // ...
]);
```

### Error Handling
**Source:** `01-CONTEXT.md` (Decision D-03)
**Apply to:** `packages/match-engine/src/reducer/index.ts`
```typescript
// Silent Failure Pattern
if (isMatchCompleted(state)) {
  return state; // Return original state unchanged rather than throwing
}
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `packages/match-engine/src/rules/rotation.ts` | utility | transform | Logic exists in mobile service, but no dedicated rule utility package exists yet. |

## Metadata

**Analog search scope:** `packages/`, `apps/mobile/src/services/`
**Files scanned:** 15
**Pattern extraction date:** 2026-04-18
