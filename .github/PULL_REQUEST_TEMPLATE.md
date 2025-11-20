## Summary
- [ ] Describe what this PR accomplishes and why it's needed.

## Linus Questions (must be answered for every PR)
1. 这是个真问题还是臆想？
2. 有更简单的方案吗？
3. 这会破坏已有的 userspace 吗？

## Five-layer Notes
- Data structure:
- Special cases eliminated:
- Complexity reduced:
- Risk points addressed:
- Practicality check:

## TDD Steps
1. Red (failing test) – describe the test that failed.
2. Green (implementation) – confirm the simplest change to pass the test.
3. Refactor – describe what was cleaned up and what helper(s) got coverage.

## Testing
- Tests run: `npm test -- --runInBand` (or equivalent)
- Fixtures updated: [yes/no]
- Manual/UI verification: describe.

## Docs/Specs
- Architecture doc updated: [ ] `docs/architecture-overview.md`
- Linus principles referenced: [ ] `docs/linus-principles.md`
- UI spec updated: [ ] `docs/spec-kit/ui-specifications.md`

## Checklist
- [ ] PR description includes Linus+TDD reasoning.
- [ ] Tests reproduce Linus concerns (special cases, fallback, compatibility).
- [ ] README/contributing references updated if needed.
