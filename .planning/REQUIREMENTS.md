# Requirements: InningsPro (Corporate/Turf Edition)

**Defined:** 2026-04-17
**Core Value:** Enable reliable, rule-strict cricket scoring that persists across poor connectivity and produces professional, portable match artifacts.

## v1 Requirements

Requirements for initial release, specifically for Corporate Turf leagues (5-over, 5-a-side).

### Match Format (Corporate/Turf)

- [ ] **FORMAT-01**: User can configure match with 5 players per team and 5 overs per innings.
- [ ] **FORMAT-02**: User can implement "Last Man Stand" (LMS) logic (last batter remains when 4th wicket falls).
- [ ] **FORMAT-03**: User can handle standard extras (Wides/No-balls) as 1 run plus an extra ball.

### Scoring Engine (MCC Rules)

- [ ] **RULE-01**: User can capture ball-by-ball events (runs, extras, wickets).
- [ ] **RULE-02**: User can manage automatic over completion and bowler rotation logic.
- [ ] **RULE-03**: User can enforce strict 2022 MCC Law enforcement (e.g., "Crossing" rules).
- [ ] **RULE-04**: User can record penalty runs (5-run penalties) for specific offenses.
- [ ] **RULE-05**: User can manage batter retirements (retired hurt, retired out).
- [ ] **RULE-06**: User can correct past scoring events with a full "Undo" to any ball (Audit).

### Local Persistence

- [ ] **STORE-01**: User can score matches offline with local SQLite storage.
- [ ] **STORE-02**: User can export match data to a portable JSON schema file (.ipro).

### Reporting & Exports (Web-Based)

- [ ] **REPO-01**: User can view a full match scorecard on the Web App after uploading a schema.
- [ ] **REPO-02**: User can generate a professional PDF summary export for the match.
- [ ] **REPO-03**: User can generate a "Match Highlight" image for social media sharing.
- [ ] **REPO-04**: User can export raw match data in a machine-readable JSON format.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Sync & Multi-Device

- **SYNC-01**: User can automatically sync matches to the cloud when online.
- **SYNC-02**: User can collaboratively score a match across multiple devices.

### Advanced Analytics

- **ANLY-01**: User can view "Innings Progression" and "Worm Graphs".
- **ANLY-02**: User can see detailed player stats over a corporate season.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Live Broadcasting | Focus on reliable capture and professional reporting for v1. |
| League Administration | Complex workflows deferred to after core scoring is stable. |
| DLS Support | 5-over corporate turf usually uses flat "run-rate" or manual intervention. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FORMAT-01 | Phase 1 | Pending |
| FORMAT-02 | Phase 1 | Pending |
| FORMAT-03 | Phase 1 | Pending |
| RULE-01   | Phase 1 | Pending |
| RULE-02   | Phase 1 | Pending |
| RULE-03   | Phase 1 | Pending |
| RULE-04   | Phase 1 | Pending |
| RULE-05   | Phase 1 | Pending |
| RULE-06   | Phase 1 | Pending |
| STORE-01  | Phase 2 | Pending |
| STORE-02  | Phase 2 | Pending |
| REPO-01   | Phase 3 | Pending |
| REPO-02   | Phase 3 | Pending |
| REPO-03   | Phase 3 | Pending |
| REPO-04   | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-17*
*Last updated: 2026-04-17 after initial definition*
