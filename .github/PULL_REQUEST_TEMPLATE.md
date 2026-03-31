## Description

<!-- Provide a clear and concise description of your changes -->

<!-- Example: -->
<!-- Implements deterministic ball-by-ball scoring validation for delivery events -->

---

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] 🚀 Feature (new functionality)
- [ ] 🐛 Bug fix (resolves an issue)
- [ ] 📚 Documentation (docs, comments, or guides)
- [ ] 🎨 Styling (formatting, layout, design tokens)
- [ ] ♻️ Refactoring (code restructuring without behavior change)
- [ ] ⚡ Performance (optimization)
- [ ] ✅ Test (test additions/modifications)
- [ ] 🔧 Chore (dependencies, build, CI/CD)

---

## Related Issue(s)

<!-- Link to related issues using #number or full URL -->
<!-- Example: Closes #42, Fixes #99 -->

Closes #

---

## Related ADR(s)

<!-- Link to any relevant Architecture Decision Records -->
<!-- Example: Refs ADR-005 (Scoring engine determinism approach) -->

Refs ADR-

---

## Motivation & Context

<!-- Why is this change needed? What problem does it solve? -->
<!-- Include relevant links to documentation, designs, or discussions -->

---

## Changes Made

<!-- List the key changes in this PR -->
<!-- Use bullet points for clarity -->

- [ ] Change 1
- [ ] Change 2
- [ ] Change 3

---

## Areas Affected

<!-- Which packages/apps does this impact? -->
<!-- Mark the relevant areas -->

- [ ] `apps/mobile` — Mobile app
- [ ] `apps/report-web` — Web reporting
- [ ] `packages/shared-types` — Domain types
- [ ] `packages/ui-tokens` — Design tokens
- [ ] `packages/export-schema` — Export schemas
- [ ] `docs/` — Documentation
- [ ] `tooling/` — Dev tools
- [ ] Other: ******\_\_\_******

---

## Testing

<!-- Describe how you tested these changes -->

### Test Coverage

- [ ] Added new tests
- [ ] Updated existing tests
- [ ] All tests pass locally
- [ ] Test coverage maintained or improved

### Test Scenarios

<!-- List specific test cases or scenarios covered -->

- Scenario 1: ...
- Scenario 2: ...

### Manual Testing

<!-- For UI changes or complex features, describe manual testing -->

- [ ] Tested on mobile (iOS/Android)
- [ ] Tested on web
- [ ] Tested on different screen sizes
- [ ] Tested offline functionality (if applicable)

---

## Breaking Changes

<!-- Any breaking changes to public APIs or data formats? -->

- [ ] No breaking changes
- [ ] Yes, see details below

### Migration Guide

<!-- If there are breaking changes, provide migration instructions -->

---

## Documentation Updates

<!-- Did you update relevant documentation? -->

- [ ] Updated README.md
- [ ] Updated DEVELOPER_GUIDE.md
- [ ] Created/updated ADR in `docs/adr/`
- [ ] Updated inline code comments
- [ ] Updated API documentation
- [ ] No documentation needed

### Documentation Changes

<!-- List files updated -->

---

## Code Quality

<!-- Ensure your code meets quality standards -->

- [ ] Follows TypeScript strict mode (no `any`)
- [ ] Follows project ESLint rules
- [ ] Prettier formatting applied
- [ ] No console.log or debug code
- [ ] No commented-out code
- [ ] Meaningful variable/function names

### Quality Checks

<!-- Run these before opening PR -->

```bash
pnpm typecheck   # Type checking
pnpm lint        # Linting
pnpm format:check # Formatting
pnpm test        # Tests
```

---

## Scoring Engine Notes

<!-- For changes to scoring logic, include these -->

- [ ] Not applicable
- [ ] Scoring logic change

### Cricket Law References

<!-- If scoring rules changed, reference MCC Laws -->

- Law reference(s): ...
- Edge cases covered: ...
- Determinism verified: [ ]

---

## Performance Impact

<!-- Any performance implications? -->

- [ ] No performance impact
- [ ] Performance improvement: ...
- [ ] Performance regression: ...

### Metrics

<!-- Include before/after metrics if applicable -->

---

## Dependencies

<!-- Any new dependencies or versions updated? -->

- [ ] No dependency changes
- [ ] Dependencies added: ...
- [ ] Dependencies removed: ...
- [ ] Versions updated: ...

---

## Screenshots/Videos

<!-- For UI changes, include screenshots or videos -->

<!-- Desktop/Mobile screenshots, before/after comparisons -->

---

## Checklist

<!-- Final checklist before submitting -->

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing locally
- [ ] No new warnings generated
- [ ] Commit messages follow Conventional Commits
- [ ] Branch rebased on latest main
- [ ] PR title is descriptive

---

## Reviewer Guidance

<!-- Any specific areas you want reviewers to focus on? -->

- Focus area 1: ...
- Focus area 2: ...
- Questions for reviewers: ...

---

## Additional Context

<!-- Anything else reviewers should know? -->

<!-- Links to related discussions, specs, or external resources -->

---

## Merge Strategy

<!-- How should this PR be merged? -->

- [ ] Squash and merge (preferred)
- [ ] Create a merge commit
- [ ] Rebase and merge

---

**Thank you for contributing to InningsPro! 🏏**
