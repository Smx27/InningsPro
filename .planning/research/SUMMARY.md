# Project Research Summary

**Project:** InningsPro
**Domain:** Local-First Cricket Scoring & Reporting
**Researched:** 2025-05-22
**Confidence:** HIGH

## Executive Summary

InningsPro is a specialized cricket scoring and reporting application designed for high reliability in field conditions and strict adherence to MCC Laws. Experts build such systems using local-first, event-sourced architectures to ensure data integrity and auditability. The core value lies in moving from a simple "calculator" to a robust "umpire's assistant" that generates professional-grade match reports through a decoupled web-based reporting system.

The recommended approach centers on a React Native (Expo) mobile app for real-time capture, utilizing a high-performance SQLite engine (`nitro-sqlite`) and an append-only event stream. This ensures every action is recorded and can be synced to a Next.js web platform for professional PDF generation. The "Match Engine" must be a pure, logic-heavy package that strictly implements the 2022 MCC Laws to prevent invalid states like incorrect over completions or illegal bowler debits.

Key risks include data corruption from oversimplified sync strategies and logic errors in complex cricket rules (e.g., Wide/No-ball interactions). These are mitigated by adopting an event-sourcing pattern—ensuring all state changes are immutable and auditable—and implementing a rigorous "Law Engine" with high test coverage against the official MCC ruleset.

## Key Findings

### Recommended Stack

The stack prioritizes mobile performance, offline reliability, and professional reporting. React Native with Nitro-SQLite provides the necessary speed for high-frequency ball-by-ball entry, while Next.js handles the heavy lifting of PDF generation and web-based viewing.

**Core technologies:**
- **React Native (Expo):** Mobile-first capture — Cross-platform, fast iteration, high-quality UI for scoring.
- **react-native-nitro-sqlite:** Local Persistence — Extremely fast JSI-based SQLite for high-frequency ball-by-ball entry.
- **Next.js:** Web-based reporting — Server-side rendering for SEO (future) and robust PDF generation.
- **@react-pdf/renderer:** PDF Generation — Create professional match reports from JSON schemas.

### Expected Features

The feature set is divided into core reliability (capture) and professional artifacts (reporting), with a clear boundary to avoid scope creep in social or administrative areas.

**Must have (table stakes):**
- **Ball-by-Ball Entry** — Core function capturing runs, wickets, and extras.
- **Strike Rotation** — Automatic handling of batter ends based on runs and overs.
- **Local Persistence** — Critical reliability in the field with zero internet.

**Should have (competitive):**
- **Local-First Event Sync** — 100% reliability in remote grounds with offline-first synchronization.
- **Strict MCC Law Engine** — Automated Follow-on, Penalty Runs, and complex dismissal logic.
- **Professional PDF Reports** — High-quality "Box Style" summaries and linear scorebooks.

**Defer (v2+):**
- **Live Public Broadcasting** — High infrastructure cost/latency complexity.
- **Advanced ML Analytics** — Premature optimization; focus on accuracy first.

### Architecture Approach

The system uses an **Event-Sourced Local-First** architecture. This ensures high reliability during match capture (mobile) while enabling professional, decoupled reporting (web) via a type-safe match schema.

**Major components:**
1. **Match Engine** — Pure business logic for MCC Laws (shared package).
2. **Event Log** — Immutable append-only store for balls/wickets in SQLite.
3. **Sync Engine** — Background replication of local events to the cloud via LWW.
4. **Report Web** — Web application for viewing and exporting match schemas to PDF.

### Critical Pitfalls

1. **Off-by-One Errors in Over Completion** — Scoring the 7th ball due to incorrect Wide/No-Ball logic. Avoid by explicitly tracking `isLegal` on every ball.
2. **Sync Conflict Data Corruption** — Overwriting critical match data. Avoid by using an append-only event stream (Event Sourcing).
3. **Incorrect Bowler Debits** — Crediting Byes/Leg Byes to bowlers. Avoid by strictly following MCC Law 21/22.
4. **Memory Bloat in Long Matches** — Slowdowns in multi-day matches. Avoid by using Materialized Views in SQLite instead of large in-memory objects.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Law Engine
**Rationale:** The core logic (MCC Laws) and data schema are the hardest to get right and are dependencies for everything else.
**Delivers:** Shared type-safe contracts, Export Schema package, and a pure Logic Match Engine.
**Addresses:** Must-have features like Ball-by-Ball Entry and Strike Rotation.
**Avoids:** Off-by-one errors and incorrect bowler debits.

### Phase 2: Mobile Capture & Local Persistence
**Rationale:** Users need a reliable way to capture data in the field before reporting or syncing matters.
**Delivers:** React Native mobile app with Nitro-SQLite integration.
**Uses:** React Native (Expo), Nitro-SQLite, Zustand.
**Implements:** Event Log and Projection Engine components.

### Phase 3: Web Reporting & PDF Generation
**Rationale:** Professional reporting is the key differentiator and follows the data capture phase.
**Delivers:** Next.js web application and professional PDF export engine.
**Uses:** Next.js, @react-pdf/renderer.
**Implements:** Report Web component.

### Phase 4: Sync & Multi-Device Support
**Rationale:** Sync adds complexity (conflicts, networking) and should be built on top of a stable local-first foundation.
**Delivers:** Real-time background sync and cloud-backed match archival.
**Uses:** PowerSync / CR-SQLite patterns.
**Implements:** Sync Engine.

### Phase Ordering Rationale

- **Logic First:** Building the `match-engine` first ensures the most complex domain logic is tested and stable before UI or Sync is added.
- **Local-First Dependency:** Capture (Phase 2) must precede Sync (Phase 4) to establish the event log structure.
- **Artifact Value:** Web reporting (Phase 3) is prioritized over Sync because it provides immediate "Reporting" value even if data is moved manually via JSON export.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Law Engine):** Complex integration of edge-case dismissal logic and penalty run implementation (MCC Laws 41/42).
- **Phase 4 (Sync):** Niche domain; PowerSync/CR-SQLite integration details with React Native need specific validation.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Mobile UI):** Well-documented, established patterns for Expo + SQLite.
- **Phase 3 (Web PDF):** Standard Next.js and @react-pdf/renderer implementation.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Modern, performant tools chosen specifically for mobile-capture/web-report split. |
| Features | HIGH | Based on official MCC Laws and standard cricket scoring expectations. |
| Architecture | HIGH | Event-sourcing is the industry standard for auditable local-first systems. |
| Pitfalls | HIGH | Identifies common domain-specific scoring errors verified by MCC Laws. |

**Overall confidence: HIGH**

### Gaps to Address

- **Sync Library Choice:** Final decision between PowerSync and CR-SQLite needed during Phase 4 planning.
- **PDF Layout Complexity:** Professional "Box Style" scorecards can be complex to render; layout verification needed in Phase 3.

## Sources

### Primary (HIGH confidence)
- [Lord's - The Laws of Cricket](https://www.lords.org/mcc/the-laws-of-cricket) — Official ruleset.
- [Local-First Web Development (Ink & Switch)](https://www.inkandswitch.com/local-first/) — Architectural foundations.
- [React Native Nitro-SQLite](https://github.com/mrousavy/react-native-nitro-sqlite) — Performance benchmarks and usage.

### Secondary (MEDIUM confidence)
- [Professional Cricket Scorecard Standards (BCCI/ICC Patterns)](https://www.bcci.tv/stats) — Visual layout inspiration.
- [Couchbase - Mobile Sync Best Practices](https://www.couchbase.com/blog/offline-first-mobile-sync/) — Conflict resolution patterns.

### Tertiary (LOW confidence)
- [@react-pdf/renderer GitHub Issues](https://github.com/diegomura/react-pdf) — Layout bug validation.

---
*Research completed: 2025-05-22*
*Ready for roadmap: yes*
