# Phase 03 Validation: Mobile Scoring App & Persistence

## Success Criteria Verification

| Criterion | Plan | Verification Method |
|-----------|------|---------------------|
| User can score a full match on a mobile device without internet connectivity | 03-02 | Manual verification in Wave 3 checkpoint; Engine logic verification in Wave 2. |
| Match state survives app restarts and force-closes via local SQLite | 03-01, 03-02 | Integration tests in Wave 0/1; Manual verification in Wave 3. |
| User can export a completed match as a portable .ipro JSON file | 03-03 | Unit tests for ExportService; Manual verification of sharing dialog in Wave 3. |

## Requirement Traceability

| Req ID | Description | Plan | Task |
|--------|-------------|------|------|
| STORE-01 | Offline match persistence | 03-01 | Task 1, 2 |
| STORE-02 | .ipro schema export | 03-03 | Task 1, 2 |
| FORMAT-02 | Last Man Stand (LMS) logic | 03-02 | Task 3 |
| RULE-01 | Capture ball-by-ball events | 03-02 | Task 2, 3 |
| RULE-02 | Over completion and bowler rotation | 03-02 | Task 1, 3 |
| RULE-03 | Strict 2022 MCC Law enforcement | 03-02 | Task 1 |
| RULE-04 | Record penalty runs | 03-02 | Task 1 |
| RULE-05 | Manage batter retirements | 03-02 | Task 1 |
| RULE-06 | Undo functionality | 03-02 | Task 2 |

## Automated Test Coverage

| Component | Target Coverage | Tool |
|-----------|-----------------|------|
| DatabaseService | 90%+ | Vitest (SQLite Mock/Real) |
| MatchEngineService | 100% (Wrapped) | Vitest |
| ExportService | 100% | Vitest (Zod parsing) |
| useScoringStore | 80%+ | Vitest |

## Manual Verification Protocol (Wave 3 Checkpoint)

1. **Persistence Test:**
   - Score an over.
   - Kill app.
   - Reopen and verify score and ball log matches.
2. **LMS Test:**
   - Reach 4 wickets down in a 5-a-side match.
   - Verify striker stays on strike after scoring 1 run.
   - Verify UI shows only one active batter.
3. **Export Test:**
   - Trigger export.
   - Verify sharing sheet opens.
   - Inspect shared JSON content (validate against `ExportSchemaV1`).
