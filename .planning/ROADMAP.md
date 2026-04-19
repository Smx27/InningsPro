# Roadmap: InningsPro

## Overview

InningsPro is a production-grade cricket scoring system designed for reliable ball-by-ball data capture and reporting. This roadmap follows a modular approach: starting with a robust, MCC-compliant match engine, followed by a mobile capture app with local persistence, and concluding with a web-based reporting platform for professional exports.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Match Engine (Core Rules)** - Basic scoring logic and configuration
- [x] **Phase 2: Match Engine (MCC Compliance & Audit)** - Advanced rules and undo capability
- [ ] **Phase 3: Mobile Scoring App & Persistence** - Offline capture and SQLite storage
- [ ] **Phase 4: Web Reporting Portal** - Scorecard visualization from match schemas
- [ ] **Phase 5: Professional Exports** - PDF and social media artifact generation

## Phase Details

### Phase 1: Match Engine (Core Rules)
**Goal**: Implement basic scoring and match configuration logic in a shared package.
**Depends on**: Nothing
**Requirements**: FORMAT-01, FORMAT-03, RULE-01, RULE-02
**Success Criteria** (what must be TRUE):
  1. Engine correctly calculates match score from a stream of basic ball events.
  2. Engine automatically handles over completions and bowler rotation prompts.
  3. User can configure a 5-over match with standard extras (1 run + extra ball).
  4. All core scoring transitions are verified by automated tests.
**Plans**: 3 plans
- [x] 01-01-PLAN.md — Initialize engine infrastructure and core types.
- [x] 01-02-PLAN.md — Implement functional scoring reducer (balls, extras, rotation).
- [x] 01-03-PLAN.md — Implement scorecard and stats selectors.

### Phase 2: Match Engine (MCC Compliance & Audit)
**Goal**: Ensure full 2022 MCC Law compliance and match auditability.
**Depends on**: Phase 1
**Requirements**: FORMAT-02, RULE-03, RULE-04, RULE-05, RULE-06
**Success Criteria** (what must be TRUE):
  1. Engine enforces 2022 MCC "Crossing" rules after wickets and runs.
  2. Engine handles "Last Man Standing" logic where the last batter stays in.
  3. User can record 5-run penalties and various batter retirement states.
  4. User can undo any event in the match log to revert state exactly.
**Plans**: 3 plans
- [x] 02-01-PLAN.md — Implement the core infrastructure for match auditability and event replay.
- [x] 02-02-PLAN.md — Incorporate MCC 2022 Law 18.11 (Caught dismissal) and implement standalone penalty runs and batter retirements.
- [x] 02-03-PLAN.md — Implement 'Last Man Standing' (LMS) strike rotation logic and expand match hints.

### Phase 3: Mobile Scoring App & Persistence
**Goal**: Deliver a reliable offline mobile app for real-time match capture.
**Depends on**: Phase 2
**Requirements**: STORE-01, STORE-02
**Success Criteria** (what must be TRUE):
  1. User can score a full match on a mobile device without internet connectivity.
  2. Match state survives app restarts and force-closes via local SQLite.
  3. User can export a completed match as a portable `.ipro` JSON file.
**Plans**: 3 plans
- [ ] 03-01-PLAN.md — Refactor SQLite schema to support event-sourced BallEvent structure.
- [ ] 03-02-PLAN.md — Integrate @inningspro/match-engine and refactor scoring store for hydration.
- [ ] 03-03-PLAN.md — Implement .ipro export via Expo-Sharing and polish scoring UX.
**UI hint**: yes

### Phase 4: Web Reporting Portal
**Goal**: Provide a professional web-based viewer for match data.
**Depends on**: Phase 3
**Requirements**: REPO-01, REPO-04
**Success Criteria** (what must be TRUE):
  1. User can upload a `.ipro` file to the web portal and view a full scorecard.
  2. User can download the raw match data in JSON format from the web UI.
**Plans**: 3 plans
- [ ] 04-01-PLAN.md — Integrate shared packages and implement schema parsing.
- [ ] 04-02-PLAN.md — Implement stats-driven scorecard visualization.
- [ ] 04-03-PLAN.md — Implement analytical charts and JSON data export.
**UI hint**: yes

### Phase 5: Professional Exports
**Goal**: Generate high-quality PDF and social media artifacts.
**Depends on**: Phase 4
**Requirements**: REPO-02, REPO-03
**Success Criteria** (what must be TRUE):
  1. User can generate and download a professional PDF summary of the match.
  2. User can generate a "Match Highlight" graphic for social media sharing.
**Plans**: 3 plans
- [ ] 05-01-PLAN.md — Social Media Highlight Image (REPO-03)
- [ ] 05-02-PLAN.md — Professional PDF Layout (REPO-02)
- [ ] 05-03-PLAN.md — Unified Export UI (UX)
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Match Engine (Core) | 3/3 | Completed | 2026-04-17 |
| 2. Match Engine (MCC) | 3/3 | Completed | 2026-04-19 |
| 3. Mobile Scoring App | 0/3 | Not started | - |
| 4. Web Reporting | 1/5 | In Progress|  |
| 5. Prof. Exports | 0/3 | Not started | - |
