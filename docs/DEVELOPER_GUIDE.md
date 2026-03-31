# Developer Guide

## Purpose

Provide a concise production-focused onboarding path for contributors working in the InningsPro monorepo.

## Repository Areas

- Applications:
  - [`apps/mobile/`](../apps/mobile)
  - [`apps/report-web/`](../apps/report-web)
- Shared packages:
  - [`packages/shared-types/`](../packages/shared-types)
  - [`packages/ui-tokens/`](../packages/ui-tokens)
  - [`packages/export-schema/`](../packages/export-schema)

## Working Expectations

- Prefer shared contracts over app-local model duplication.
- Keep domain logic deterministic and testable.
- Update documentation when behavior or contracts change.

## Delivery Checklist

1. Implement change in the correct app/package boundary.
2. Add/adjust tests for domain or contract impact.
3. Run lint/type/test checks relevant to touched areas.
4. Update docs + ADR references for meaningful decisions.

## Ownership Expectations

- **Feature owner:** drives implementation and acceptance scope.
- **Review owner:** validates architecture, correctness, and maintainability.
- **Release owner:** confirms changelog, migration, and rollout notes.

## Decision Records

- Use `docs/adr/` for technical and product-impacting decisions.
- Link ADR IDs in PRs and release notes when applicable.

## Documentation Standards

- Keep docs concise, actionable, and production-oriented.
- Prefer sectioned headings with explicit owners and outcomes.
- Add links to concrete code paths for every major concept.
