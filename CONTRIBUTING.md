# Contributing to InningsPro

First off, thank you for considering a contribution to InningsPro! We're excited to have you as part of our community. This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing & Quality](#testing--quality)
- [Documentation](#documentation)
- [Architecture Decisions](#architecture-decisions)
- [Release & Versioning](#release--versioning)
- [Questions or Need Help?](#questions-or-need-help)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **pnpm** 9.15+ ([Installation guide](https://pnpm.io/installation))
- **Git** 2.0+
- **Expo CLI** (for mobile development): `npm install -g expo-cli`

### Repository Structure

```
InningsPro/
├── apps/                    # Applications
│   ├── mobile/             # React Native + Expo scorer app
│   └── report-web/         # Web reporting dashboard
├── packages/               # Shared packages
│   ├── shared-types/       # Domain types & contracts
│   ├── ui-tokens/          # Design tokens & primitives
│   └── export-schema/      # Export validation schemas
├── tooling/                # Dev tools & configurations
├── docs/                   # Documentation & ADRs
└── .github/                # GitHub templates & workflows
```

### Fork & Clone

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/InningsPro.git
cd InningsPro

# Add upstream remote for syncing
git remote add upstream https://github.com/Smx27/InningsPro.git

# Verify remotes
git remote -v
```

---

## Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Verify Setup

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format check
pnpm format:check
```

### 3. Start Development

```bash
# All dev servers
pnpm dev

# Specific app/package
pnpm dev --filter=mobile
pnpm dev --filter=report-web
```

---

## Making Changes

### 1. Sync with Upstream

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Create Feature Branch

Use descriptive branch names following this pattern:

```
{type}/{description}

Examples:
  feature/ball-by-ball-scoring
  fix/wicket-calculation-edge-case
  docs/scoring-engine-guide
  refactor/state-management
  chore/update-dependencies
```

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

#### Golden Rules

✅ **Do:**

- Keep changes **atomic and focused** on one concern
- Update **tests and documentation** with your code
- Use **shared package contracts** instead of duplicating domain logic
- Keep **scoring logic deterministic** (pure functions, no side effects)
- Reference **relevant ADRs** in commit messages for architectural changes
- Write **clear, descriptive commit messages**

❌ **Don't:**

- Mix refactoring with feature changes
- Bypass type checking or linting
- Duplicate domain logic across apps
- Add side effects to scoring engine functions
- Commit debug code, console logs, or commented code
- Modify unrelated files or dependencies

#### Where to Make Changes

| Change Type                   | Location                  | Reference                                   |
| ----------------------------- | ------------------------- | ------------------------------------------- |
| Cricket domain logic          | `packages/shared-types/`  | [SCORING_ENGINE.md](docs/SCORING_ENGINE.md) |
| Scoring engine implementation | `packages/shared-types/`  | [SCORING_ENGINE.md](docs/SCORING_ENGINE.md) |
| Mobile UI/UX                  | `apps/mobile/`            | [UI_SYSTEM.md](docs/UI_SYSTEM.md)           |
| Web reporting                 | `apps/report-web/`        | [UI_SYSTEM.md](docs/UI_SYSTEM.md)           |
| Export formats                | `packages/export-schema/` | [EXPORT_SCHEMA.md](docs/EXPORT_SCHEMA.md)   |
| Database models               | See docs                  | [DATABASE.md](docs/DATABASE.md)             |
| Design tokens                 | `packages/ui-tokens/`     | [UI_SYSTEM.md](docs/UI_SYSTEM.md)           |

---

## Commit Guidelines

We follow the **Conventional Commits** specification for clear, semantic commit messages.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```bash
# Feature
git commit -m "feat(mobile): add ball-by-ball event logger

- Capture each delivery outcome with timestamps
- Support manual corrections with undo/redo
- Emit domain events for score updates"

# Bug fix
git commit -m "fix(scoring-engine): correct wide delivery detection

- Widen criteria to match Law 22.1
- Add regression test for boundary cases"

# Documentation
git commit -m "docs(adr): document scoring engine determinism approach

- Explain pure function design for replay-safety
- Link implementation in scoring-engine.ts"

# Refactor
git commit -m "refactor(shared-types): simplify delivery type union

- Remove redundant DeliveryOutcome variants
- Update consumers in mobile and web apps"
```

### Type Reference

- **feat** — New feature
- **fix** — Bug fix
- **docs** — Documentation changes
- **style** — Code style (formatting, missing semicolons, etc.)
- **refactor** — Code refactoring without behavior change
- **perf** — Performance improvements
- **test** — Test additions or updates
- **chore** — Dependencies, build, CI/CD

### Scope Reference

- **mobile** — Mobile app changes
- **report-web** — Web app changes
- **shared-types** — Domain types package
- **ui-tokens** — Design tokens package
- **export-schema** — Export schema package
- **scoring-engine** — Scoring logic
- **adr** — Architecture decision records

### Footer

Reference issues and ADRs:

```
Closes #123
Refs ADR-005
Breaking change: DeliveryType enum has been restructured
```

---

## Pull Request Process

### 1. Before Opening a PR

- ✅ Run full checks locally:
  ```bash
  pnpm typecheck && pnpm lint && pnpm format:check && pnpm test
  ```
- ✅ Rebase on latest `main`
- ✅ Update documentation
- ✅ Verify commit messages follow conventions

### 2. Open a PR

Use the [PR template](.github/PULL_REQUEST_TEMPLATE.md) (automatically loaded).

**At minimum include:**

- Clear description of the change
- Motivation and context
- Related issues/ADRs
- Testing approach
- Breaking changes (if any)

### 3. Example PR Description

```markdown
## Description

Implements deterministic ball-by-ball scoring for Test/ODI formats.

## Motivation

Enables scorers to enter deliveries with automatic validation against cricket laws.

## Changes

- Add Delivery type to shared-types
- Implement scoring engine with pure functions
- Add validation tests for law compliance

## Related Issues

Closes #42
Refs ADR-003 (Scoring engine architecture)

## Testing

- Added 150+ test cases for scoring rules
- Verified against MCC Laws of Cricket
- Tested replay-safety with historical matches

## Breaking Changes

None for v1.0
```

### 4. Review Process

- At least **one approval required** from codeowners
- Address review comments or discuss concerns
- Squash commits before merge (maintainers can do this)
- Ensure **all CI checks pass**

### 5. Merge

Once approved and all checks pass:

- Maintainers merge with a squashed commit
- Branch is automatically deleted
- Change is added to release notes

---

## Testing & Quality

### Run Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage

# Specific package
pnpm test --filter=shared-types
```

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
# Check
pnpm lint

# Auto-fix
pnpm lint:fix
```

### Formatting

```bash
# Check
pnpm format:check

# Auto-format
pnpm format
```

### Quality Expectations

For **all changes:**

- ✅ Types must be strict (no `any`)
- ✅ New code must have tests
- ✅ Tests must pass locally
- ✅ Linting must pass
- ✅ No console.log or debug code

For **domain logic:**

- ✅ Scoring logic must be pure (no side effects)
- ✅ Must handle all cricket law edge cases
- ✅ Must be deterministic (identical input → identical output)
- ✅ Must include law reference in comments

For **UI changes:**

- ✅ Must follow design system (ui-tokens)
- ✅ Must work on mobile and web (as applicable)
- ✅ Must include accessibility considerations
- ✅ Must have visual regression tests

---

## Documentation

### What to Document

Always update documentation when:

- Adding/changing public APIs
- Modifying domain logic or scoring rules
- Introducing new patterns or architecture
- Changing configuration or setup steps

### Where to Document

| Type                   | Location                                     |
| ---------------------- | -------------------------------------------- |
| API changes            | JSDoc comments + `docs/` reference guide     |
| Domain logic           | `docs/SCORING_ENGINE.md` with law references |
| Architecture decisions | `docs/adr/ADR-NNN.md`                        |
| User features          | `docs/` + README.md                          |
| Setup/dev workflow     | `docs/DEVELOPER_GUIDE.md`                    |
| Database schema        | `docs/DATABASE.md`                           |

### ADR (Architecture Decision Record)

For any significant architectural decision, create an ADR:

```markdown
# ADR-NNN: Decision Title

**Date:** 2026-03-03
**Status:** Accepted
**Owner:** @your-username

## Context

Why this decision was needed...

## Decision

What we decided...

## Rationale

Why this is the best option...

## Alternatives Considered

1. ...
2. ...

## Consequences

Positive:

- ...

Negative:

- ...

## Links

- Related ADRs: ADR-XXX
- Implementation: `apps/mobile/scoring.ts`
```

Save as `docs/adr/ADR-NNN.md` and reference in PRs/commits.

---

## Architecture Decisions

### When to Create an ADR

- Major new features or components
- New package or app architecture
- Significant refactoring
- Technology/library choices
- Backward compatibility decisions
- Performance optimizations

### ADR Process

1. **Create draft** ADR in `docs/adr/`
2. **Link in PR** or discussion
3. **Get consensus** from architecture owner + relevant owners
4. **Merge PR** with finalized ADR
5. **Reference in commits** touching that code

### Current ADRs

Check `docs/adr/` for existing decisions. Reference relevant ADRs in your PRs.

---

## Release & Versioning

### Version Scheme

We follow **Semantic Versioning** (MAJOR.MINOR.PATCH):

- **MAJOR** — Breaking API changes
- **MINOR** — New features (backward compatible)
- **PATCH** — Bug fixes

### Release Process

1. Maintainer creates release PR with version bump
2. Updates CHANGELOG.md and version numbers
3. PR merged with squashed commits
4. Tag created: `v1.2.3`
5. Release notes published with ADR/feature links

### Changelog Format

```markdown
## [1.2.3] - 2026-03-03

### Added

- New feature with ADR reference

### Fixed

- Bug fix with test coverage

### Changed

- API change or refactoring

### Deprecated

- Feature marked for removal

### Removed

- Breaking change with migration guide
```

---

## Questions or Need Help?

### Documentation

- Read [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) first
- Check [ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
- Review [SCORING_ENGINE.md](docs/SCORING_ENGINE.md) for domain logic

### Get Answers

- 💬 **GitHub Discussions** — Ask questions and discuss ideas
- 🐛 **GitHub Issues** — Report bugs with minimal reproducible examples
- 📧 **Pull Requests** — Request feedback during development

### Connect With Maintainers

- Link issues/ADRs in PR descriptions for context
- Be respectful and open to feedback
- Provide test cases and reproduction steps for bugs

---

## Thank You! 🙏

Your contributions make InningsPro better for cricket scorers everywhere. We appreciate your effort, time, and passion!

**Happy coding!** 🏏
