# UI System

## Purpose

Establish a production-ready UI baseline for consistency across mobile and web report surfaces.

## Foundations

- Token-driven colors, spacing, typography, and radii.
- Reusable component patterns for scorer-critical interactions.
- Accessibility defaults (contrast, touch targets, semantic labels).

## UX Priorities

- Rapid one-hand scoring workflows on mobile.
- Clear state feedback for corrections and pending actions.
- Print/report readability on web.

## Component Governance

- Shared visual primitives should map to token definitions.
- App-specific components may extend primitives but must not break token rules.
- Avoid duplicating style constants outside shared UI contracts.

## Ownership Expectations

- **Design owner:** curates token evolution and visual language.
- **UI engineering owners:** enforce component and accessibility standards.
- **App owners:** adopt shared tokens before introducing local variants.

## Decision Records

- Significant UI pattern or token changes require ADR entries with before/after rationale.

## Directory Links

- UI tokens package: [`packages/ui-tokens/`](../packages/ui-tokens)
- Mobile UI implementation: [`apps/mobile/`](../apps/mobile)
- Report web UI implementation: [`apps/report-web/`](../apps/report-web)
