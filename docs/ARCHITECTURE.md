# Architecture

## System Overview

InningsPro is a monorepo with client applications and shared packages. The architecture prioritizes deterministic domain logic, reusable contracts, and a stable export boundary.

## High-Level Components

- **`apps/mobile`**: operational scorer client for match event input.
- **`apps/report-web`**: report rendering and printable/shareable views.
- **`packages/shared-types`**: canonical domain types used across apps.
- **`packages/ui-tokens`**: design tokens and UI primitives contract.
- **`packages/export-schema`**: export format definitions and validation.

## Design Principles

- Keep scoring domain logic isolated from presentation.
- Maintain backward-compatible serialized event formats.
- Prefer shared package contracts over app-local duplicate models.

## Cross-Cutting Concerns

- Type safety across package boundaries.
- Validation at input and export edges.
- Traceability for corrections and state transitions.

## Ownership Expectations

- **Architecture owner:** approves boundaries and major technical direction.
- **Package owners:** maintain semantic versioning and changelogs.
- **App owners:** integrate shared packages without bypassing contracts.

## Decision Records

- Architecture decisions belong in `docs/adr/`.
- Any new component boundary or storage strategy requires an ADR link.

## Directory Links

- [`apps/mobile/`](../apps/mobile)
- [`apps/report-web/`](../apps/report-web)
- [`packages/shared-types/`](../packages/shared-types)
- [`packages/ui-tokens/`](../packages/ui-tokens)
- [`packages/export-schema/`](../packages/export-schema)
