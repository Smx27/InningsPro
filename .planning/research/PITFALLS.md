# Domain Pitfalls

**Domain:** Local-First Cricket Scoring & Reporting (InningsPro)
**Researched:** 2025-05-22

## Critical Pitfalls

### Pitfall 1: Off-by-One Errors in Over Completion
**What goes wrong:** Scoring the 7th ball of an over because Wide/No-Ball logic is incorrectly implemented.
**Why it happens:** Confusing "balls in over" with "legal balls in over."
**Consequences:** Match totals are incorrect; scoring engine becomes inconsistent.
**Prevention:** Explicitly track `isLegal` on every ball and use it to increment the over count.
**Detection:** Automated tests with Wide/No-Ball sequences.

### Pitfall 2: Sync Conflict Resulting in Match Data Corruption
**What goes wrong:** Two scorers on different devices edit the same match, and a "Last-Write-Wins" policy overwrites a critical wicket or correction.
**Why it happens:** Oversimplified sync strategy without a robust event log or causal ordering.
**Consequences:** Irretrievable match data; user frustration.
**Prevention:** Use an append-only event stream (Event Sourcing). If conflicts occur, keep both events in the log and allow manual resolution if needed, but prioritize the event with the higher logical timestamp.
**Detection:** Real-time reconciliation reports.

## Moderate Pitfalls

### Pitfall 1: Incorrect Bowler Debits
**What goes wrong:** Crediting "Bye" or "Leg Bye" runs as runs against the bowler's analysis.
**Why it happens:** Oversimplifying extras as "runs given away by the fielding team."
**Prevention:** Follow MCC Law 21 (No Ball) and 22 (Wide) strictly. Leg Byes and Byes are **not** credited to the bowler.

### Pitfall 2: Memory Bloat in Long Matches
**What goes wrong:** The scoring app slows down or crashes in multi-day matches.
**Why it happens:** Attempting to store the entire match state in a single React state or in-memory object.
**Prevention:** Use a persistent SQLite database (Materialized View) to read only the *current* state.

## Minor Pitfalls

### Pitfall 1: Gender-Neutral Language
**What goes wrong:** Using "Batsman" instead of "Batter" in the UI or schema.
**Prevention:** Use gender-neutral terminology in all UI tokens and data contracts as per 2022 MCC Law updates.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Local Sync** | Race conditions on concurrent updates. | Use atomic transactions in SQLite for every ball event. |
| **PDF Export** | Layout breaking with long player names. | Implement strict character limits and truncation in PDF tables. |
| **Law Engine** | Misinterpreting "Stumped on a Wide." | Special case dismissal logic for Wides (can be Stumped/Run Out but not Bowled/Caught). |

## Sources

- [Lord's - The Laws of Cricket](https://www.lords.org/mcc/the-laws-of-cricket)
- [Couchbase - Mobile Sync Best Practices](https://www.couchbase.com/blog/offline-first-mobile-sync/)
- [Next.js - PDF Generation Layout Pitfalls](https://react-pdf.org/advanced)
