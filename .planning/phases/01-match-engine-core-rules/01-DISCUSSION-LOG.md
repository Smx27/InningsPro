# Phase 1: Match Engine (Core Rules) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-17
**Phase:** 01-match-engine-core-rules
**Areas discussed:** Engine State Pattern, Corporate/Turf Presets, Event vs. Summary, Error Handling Strategy

---

## Engine State Pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Pure Functional Reducer | (state, event) => newState. Highly testable, handles Undo easily. | ✓ |
| Stateful Class/Service | Class with internal state. Familiar but harder to share across apps. | |
| Independent Utils | Independent utility functions that work on the match data directly. | |

**User's choice:** Pure Functional Reducer
**Notes:** Portability between mobile and web is a key driver for this choice.

---

## Corporate/Turf Presets

| Option | Description | Selected |
|--------|-------------|----------|
| Strictly Rule-Driven | Engine takes rules as input, UI handles presets for the user. (Flexible) | |
| Preset Factory | Engine includes a factory for common formats like '5-5' or 'T20'. (Convenient) | |
| Dynamic Only | Every match defines its own rules, no presets in the engine. (Customizable) | ✓ |

**User's choice:** Dynamic Only
**Notes:** Every match explicitly defines its own rules (max overs, players, etc.).

---

## Event vs. Summary

| Option | Description | Selected |
|--------|-------------|----------|
| Event Stream with Derived Summary | State = list of events. Summary is computed on demand. (Best for Undo) | ✓ |
| Summary with Event Log | State = current scorecard. Log is just for history. (Fast for UI) | |
| Parallel States | Both. Fast for both but requires synchronization. (Hybrid) | |

**User's choice:** Event Stream with Derived Summary
**Notes:** Canonical state is a list of events, making Undo trivial.

---

## Error Handling Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Strict Validation (Result Type) | Return success(newState) or failure(reason). UI must handle results. (Safe) | |
| Silent Failure | Return the original state unchanged if invalid. (No-op) | ✓ |
| Exception-Based (Try/Catch) | Throw an Error on invalid transitions. (Explicit) | |

**User's choice:** Silent Failure
**Notes:** If an event is invalid, the engine returns the original state unchanged.

---

## Claude's Discretion

- **Summary Implementation**: Claude can decide how to efficiently derive/cache the scorecard summary from the event stream.

