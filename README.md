# InningsPro

> **Live Cricket Scoring Platform** — Fast, reliable, offline-first score capture and match reporting for cricket teams.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.15-blue.svg)](https://pnpm.io/)

---

## 📋 Overview

**InningsPro** is a production-ready mobile and web platform for capturing ball-by-ball cricket scores with deterministic accuracy. Built with React Native and TypeScript, it provides scorers with a fast, intuitive interface for match event input while enabling team captains and coaches to generate shareable innings summaries and detailed match reports.

### Key Features

- ⚡ **Fast Local Interaction** — Works reliably under poor connectivity
- 🎯 **Deterministic Scoring** — Identical event streams always produce consistent results
- 📱 **Mobile-First Design** — Optimized for on-field score capture with Expo/React Native
- 📊 **Rich Reporting** — Generate printable/shareable match reports and innings summaries
- 🔄 **Correction & Undo** — Full auditability for score corrections and state transitions
- 🔒 **Type-Safe** — Shared TypeScript contracts across mobile, web, and backend services
- 📤 **Export Schemas** — Machine-readable score exports with comprehensive validation

---

## 🏗️ Architecture

**InningsPro** is organized as a monorepo with shared packages and isolated applications:

```
InningsPro/
├── apps/
│   ├── mobile/              # React Native + Expo scorer client
│   └── report-web/          # Web reporting and match summaries
├── packages/
│   ├── shared-types/        # Canonical domain types (cricket scoring models)
│   ├── ui-tokens/           # Design tokens and UI primitives
│   └── export-schema/       # Export format definitions and validation
├── tooling/                 # Shared dev tools and configs
└── docs/                    # Architecture & product documentation
```

### Core Principles

- **Domain Isolation** — Scoring logic is independent from presentation
- **Contract-Driven** — All packages export typed interfaces
- **Deterministic** — Scoring engine behavior is purely functional and replay-safe
- **Auditable** — All corrections and state changes are tracked

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **pnpm** 9.15+ (see [pnpm installation](https://pnpm.io/installation))
- **Expo CLI** (for mobile development)

### Installation

```bash
# Install dependencies
pnpm install

# Install Expo CLI globally (if developing mobile)
npm install -g expo-cli
```

### Development

```bash
# Start all dev servers and watch processes
pnpm dev

# Run type checking across all packages
pnpm typecheck

# Lint all code
pnpm lint

# Auto-fix lint issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check format compliance
pnpm format:check
```

### Building for Production

```bash
# Build all applications and packages
pnpm build

# Build a specific app or package
pnpm build --filter=mobile
pnpm build --filter=report-web
```

---

## 📦 Packages

### `apps/mobile`

**React Native + Expo mobile application** for live match scoring.

**Key responsibilities:**

- Capture ball-by-ball events from scorers
- Local storage and offline support
- Real-time validation using the scoring engine
- Sync team and session records

**Run:** `pnpm dev --filter=mobile`

### `apps/report-web`

**Web application** for viewing, exporting, and sharing match reports.

**Key responsibilities:**

- Render innings and match summaries
- Generate printable/shareable reports
- Validate and export score data in machine-readable formats

**Run:** `pnpm dev --filter=report-web`

### `packages/shared-types`

**Canonical TypeScript domain models** used across all applications.

**Exports:**

- Cricket domain types (Match, Innings, Delivery, Wicket, etc.)
- Scoring state contracts
- Event and correction type definitions

**Usage:** `import { Match, Innings } from '@inningspro/shared-types'`

### `packages/ui-tokens`

**Design tokens, themes, and reusable UI primitives.**

**Exports:**

- Color palettes and spacing scales
- Typography and component styles
- Consistent theming across mobile and web

**Usage:** `import { theme } from '@inningspro/ui-tokens'`

### `packages/export-schema`

**Export format specification and validation layer.**

**Key features:**

- JSON schema definitions for score exports
- Validation utilities
- Version management for exported data

---

## 🎯 Core Features & Flows

### 1. Match & Innings Creation

Initialize a new match with teams, venues, and match format details.

### 2. Live Score Capture

Enter delivery outcomes with:

- Runs (batter runs, extras, penalties)
- Wicket events (modes, attribution, legality)
- Over progression and strike rotation
- Full correction and undo support

### 3. Deterministic Scoring Engine

The scoring engine ensures:

- Consistent state transitions from identical event streams
- Compliance with cricket laws
- Deterministic computation for historical replays
- Pure functional design for testability

See [`docs/SCORING_ENGINE.md`](docs/SCORING_ENGINE.md) for detailed scoring rules.

### 4. Report Generation & Export

- View innings summaries with batting/bowling statistics
- Export scores in machine-readable formats
- Generate printable match reports
- Create shareable public links

---

## 📚 Documentation

All technical and product documentation lives in the `docs/` folder:

- **[PRD.md](docs/PRD.md)** — Product requirements, scope, and user flows
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — System design, components, and boundaries
- **[SCORING_ENGINE.md](docs/SCORING_ENGINE.md)** — Deterministic scoring rules and logic
- **[DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)** — Onboarding, working expectations, and checklists
- **[DATABASE.md](docs/DATABASE.md)** — Data models and schema design
- **[UI_SYSTEM.md](docs/UI_SYSTEM.md)** — UI patterns and component guidelines
- **[EXPORT_SCHEMA.md](docs/EXPORT_SCHEMA.md)** — Export format specifications

### Architecture Decision Records (ADRs)

Major technical decisions are documented in `docs/adr/`. Each ADR includes:

- Decision date and owner
- Alternatives considered
- Rollback plan
- Links to relevant code

---

## 🔧 Development Workflow

### File Changes

1. **Implement change** in the appropriate app or package
2. **Add/update tests** for domain or contract impact
3. **Run checks:**
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm format
   ```
4. **Update documentation** (especially for API or behavior changes)
5. **Link ADR** for significant architectural decisions

### Type Safety

All packages use **TypeScript 5.7+** with strict mode enabled:

```bash
pnpm typecheck
```

### Testing

Tests run within their respective apps/packages:

```bash
pnpm test
```

---

## 📱 Mobile Development

### iOS (macOS)

```bash
pnpm dev --filter=mobile
# Press `i` to open iOS simulator
```

### Android

```bash
pnpm dev --filter=mobile
# Press `a` to open Android emulator
```

### Debugging

Use [React Native Debugger](https://github.com/jhen0409/react-native-debugger) or Expo's built-in debugging tools:

```bash
# Press `d` in the Expo CLI to open debugger
```

---

## 🌐 Web Development

### Report Web App

```bash
pnpm dev --filter=report-web
```

Runs on `http://localhost:3000` (or next available port).

---

## 📊 Ownership & Responsibilities

- **Product Owner** — Defines acceptance criteria and release priorities
- **Architecture Owner** — Approves boundaries and major technical direction
- **Package Owners** — Maintain semantic versioning and API stability
- **App Owners** — Integrate shared packages and own delivery UX
- **QA Owner** — Validates scoring correctness and regression coverage

---

## 🤝 Contributing

1. **Read** [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for expectations
2. **Create a feature branch** from `main`
3. **Keep commits atomic** and descriptive
4. **Link relevant ADRs** in PR descriptions for significant changes
5. **Ensure all checks pass:**
   ```bash
   pnpm typecheck && pnpm lint && pnpm format:check
   ```
6. **Update documentation** when behavior or contracts change

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📞 Support & Communication

- **Issues & Bugs** — Use GitHub Issues
- **Feature Requests** — Discuss in Issues with `enhancement` label
- **Architecture Questions** — Reference relevant ADRs or create a new discussion
- **Pull Requests** — Link PRs to issues and reference ADRs where applicable

---

## 🎓 Learning Resources

- [Cricket Scoring Laws](https://www.lords.org/mcc/laws-of-cricket)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [pnpm Workspace Documentation](https://pnpm.io/workspaces)

---

**Made with ❤️ for cricket scorers, teams, and fans.**
