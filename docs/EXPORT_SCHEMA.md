# Export Schema

## Purpose
Define stable machine-readable export contracts for score data exchange and downstream integrations.

## Scope
- Match/innings/player summary payloads.
- Event-level export for audit and replay.
- Versioned schema validation and compatibility guidance.

## Contract Principles
- Backward compatibility for non-breaking additions.
- Explicit version bumps for breaking structure changes.
- Deterministic mapping from canonical scoring state.

## Validation & Release
- Validate exports against schema in CI.
- Publish schema changes with changelog notes and migration guidance.
- Keep sample fixtures for each supported version.

## Ownership Expectations
- **Schema owner:** approves versioning and compatibility policy.
- **Consumer owners:** pin and validate against declared versions.
- **Release owner:** ensures migration notes are shipped.

## Decision Records
- Breaking changes or deprecations must be documented via ADR with timeline and consumer impact.

## Related Directories
- Schema source: [`packages/export-schema/`](../packages/export-schema)
- Shared model dependencies: [`packages/shared-types/`](../packages/shared-types)
- Producer apps: [`apps/mobile/`](../apps/mobile), [`apps/report-web/`](../apps/report-web)
