# Roadmap: InningsPro

## Overview

InningsPro is a production-grade cricket scoring system designed for reliable ball-by-ball data capture and reporting. This roadmap follows a modular approach: starting with a robust, MCC-compliant match engine, followed by a mobile capture app with local persistence, and concluding with a web-based reporting platform for professional exports.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Match Engine (Core Rules)** - Basic scoring logic and configuration
- [ ] **Phase 2: Match Engine (MCC Compliance & Audit)** - Advanced rules and undo capability
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
**Plans**: TBD

### Phase 2: Match Engine (MCC Compliance & Audit)
**Goal**: Ensure full 2022 MCC Law compliance and match auditability.
**Depends on**: Phase 1
**Requirements**: FORMAT-02, RULE-03, RULE-04, RULE-05, RULE-06
**Success Criteria** (what must be TRUE):
  1. Engine enforces 2022 MCC "Crossing" rules after wickets and runs.
  2. Engine handles "Last Man Standing" logic where the last batter stays in.
  3. User can record 5-run penalties and various batter retirement states.
  4. User can undo any event in the match log to revert state exactly.
**Plans**: TBD

### Phase 3: Mobile Scoring App & Persistence
**Goal**: Deliver a reliable offline mobile app for real-time match capture.
**Depends on**: Phase 2
**Requirements**: STORE-01, STORE-02
**Success Criteria** (what must be TRUE):
  1. User can score a full match on a mobile device without internet connectivity.
  2. Match state survives app restarts and force-closes via local SQLite.
  3. User can export a completed match as a portable `.ipro` JSON file.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Web Reporting Portal
**Goal**: Provide a professional web-based viewer for match data.
**Depends on**: Phase 3
**Requirements**: REPO-01, REPO-04
**Success Criteria** (what must be TRUE):
  1. User can upload a `.ipro` file to the web portal and view a full scorecard.
  2. User can download the raw match data in JSON format from the web UI.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Professional Exports
**Goal**: Generate high-quality PDF and social media artifacts.
**Depends on**: Phase 4
**Requirements**: REPO-02, REPO-03
**Success Criteria** (what must be TRUE):
  1. User can generate and download a professional PDF summary of the match.
  2. User can generate a "Match Highlight" graphic for social media sharing.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Match Engine (Core) | 0/TBD | Not started | - |
| 2. Match Engine (MCC) | 0/TBD | Not started | - |
| 3. Mobile Scoring App | 0/TBD | Not started | - |
| 4. Web Reporting | 0/TBD | Not started | - |
| 5. Prof. Exports | 0/TBD | Not started | - |
