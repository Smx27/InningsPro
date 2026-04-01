---
name: '🏏 Scoring Bug Report'
about: 'Report an incorrect scoring calculation or cricket law violation'
title: '[SCORING BUG] '
labels: ['bug', 'scoring', 'triage']
assignees: []
---

## Scoring Issue Description

<!-- Provide a clear description of the scoring error -->

<!-- Example: Extra runs not counted when wide delivery becomes a no-ball -->

---

## Cricket Context

### Match Details

- **Format:** [T20, ODI, Test, etc.]
- **Batting Team:** [Team name]
- **Bowling Team:** [Team name]
- **Current Innings:** [Innings 1/2]

### Specific Delivery

- **Over Number:** [e.g., 5]
- **Ball Number:** [e.g., 3]
- **Batter:** [Player name]
- **Bowler:** [Player name]
- **Fielder (if applicable):** [Player name]

---

## Delivery Details

### What Happened

<!-- Describe the delivery outcome in detail -->

- **Delivery Type:** [Normal, Wide, No-ball, Full toss, Bouncer, etc.]
- **Runs Scored:** [By batter, extras, penalties, etc.]
- **Additional Events:** [Wicket, catch, overthrow, etc.]

---

## Expected vs Actual Score

### Expected Outcome

<!-- What should have happened according to cricket laws? -->

- **Expected Runs:** [Number]
- **Expected Outcome:** [Runs credited to X, extras, wicket, etc.]
- **Law Reference:** [e.g., Law 2.1, Law 21.2, Law 25.1]

### Actual Outcome

<!-- What actually happened in the app? -->

- **Actual Runs:** [Number]
- **Actual Result:** [What the app calculated]
- **Discrepancy:** [How much was wrong and why]

---

## Cricket Laws & References

<!-- Reference the specific cricket law(s) violated -->

### Applicable Law(s)

- **Law:** [e.g., Law 22.1 (The leg-bye)]
- **Clause:** [Specific clause, if applicable]
- **Description:** [What the law says]

### Source

<!-- Where can we verify this rule? -->

- [ ] MCC Laws of Cricket
- [ ] Tournament regulations
- [ ] Historical precedent
- [ ] Other: ...

---

## Reproduction Steps

1. Create new match with [format]
2. Enter delivery [description]
3. Observe score [incorrect value]

---

## Match State Before Issue

<!-- Screenshot or description of match state before the error -->

```
Innings 1:
- Runs: X/Y
- Wickets: A
- Overs: B.C
- Current batter: [Name]
- Striker/non-striker positions: [Description]
```

---

## Match State After Issue

<!-- Screenshot or description showing the incorrect state -->

```
Innings 1:
- Runs: X/Y (should be Z/Y)
- Wickets: A
- Overs: B.C
- Current batter: [Name]
- Striker/non-striker positions: [Description]
```

---

## Affected Score Fields

<!-- Which score components are incorrect? -->

- [ ] Batting team runs
- [ ] Bowling team runs
- [ ] Extras (wides, no-balls, byes, leg-byes)
- [ ] Boundaries
- [ ] Wicket count
- [ ] Over progression
- [ ] Strike rotation
- [ ] Player statistics
- [ ] Other: **\*\***\_\_\_**\*\***

---

## Screenshots & Evidence

<!-- Include evidence of the error -->

<!-- Screenshots showing incorrect scores, videos of reproduction -->

---

## Historical Match Data

<!-- If you have exported match data, include it -->

<!-- This helps with regression testing -->

```json
[Include exported match JSON if available]
```

---

## Potential Root Cause

<!-- Your analysis of what might be wrong -->

<!-- Reference scoring engine code if known -->

- Suspected component: ...
- Possible issue: ...
- Affected logic: ...

---

## Related Scoring Issues

<!-- Link to related scoring bugs or discussions -->

- Duplicate of: #123
- Related to: #456

---

## Cricket Law Difficulty

<!-- How complex is this rule? -->

- [ ] 🟢 Simple rule (clear in law)
- [ ] 🟡 Moderate (requires interpretation)
- [ ] 🔴 Complex (multiple conditions, edge cases)

---

## Reproducibility

- [ ] 🟢 Consistently reproducible
- [ ] 🟡 Reproducible with specific conditions
- [ ] 🔴 Rare or intermittent

---

## Environment

- **App:** Mobile / Web
- **App Version:** [If applicable]
- **Device/Browser:** [e.g., iPhone 14 Pro, Chrome 120]
- **Date Issue Discovered:** [YYYY-MM-DD]

---

## Priority

<!-- How critical is this scoring bug? -->

- [ ] 🔴 Critical — Major scores affected, game results wrong
- [ ] 🟠 High — Specific situations fail, impacts match integrity
- [ ] 🟡 Medium — Edge case, rarely occurs
- [ ] 🟢 Low — Minor impact on specific scenarios

---

## Additional Context

<!-- Any other relevant information -->

<!-- Links to law references, scoring resources, discussions -->

---

## Checklist

- [ ] I've verified this against the cricket laws
- [ ] I've reproduced the issue consistently
- [ ] I've provided the specific law reference(s)
- [ ] I've searched for duplicate issues
- [ ] I've included match state details
- [ ] I understand the importance of scoring accuracy

---

**Thank you for helping us maintain scoring integrity! 🏏**
