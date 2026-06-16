# Delivery Standards

Purpose: Set consistent expectations for NeuroBridge / SIRAASH story delivery.

## Story Scope Rules

- Complete the requested story only.
- Keep changes inside the smallest reasonable set of files.
- Treat explicit out-of-scope items as blocked for the story.
- Ask for clarification only when repo context cannot answer a risky ambiguity.

## No Unrelated Changes

- Do not refactor unrelated code.
- Do not reformat files broadly.
- Do not change existing learner flows, analytics, or contracts unless the story requires it.
- Do not revert user or prior work unless explicitly requested.

## Preserve Contracts

- Preserve trial, session, analytics, router, and feedback contracts.
- Prefer additive selectors, states, and tests over contract-breaking changes.
- Keep existing public exports stable unless a migration is part of the story.

## UI Change Requirements

- Follow SIRAASH Activity Shell and design-system standards.
- Keep learner UI calm, readable, touch-friendly, and viewport-safe.
- Avoid duplicate shell headers, overlapping feedback, clipped controls, and unexpected scrollbars.
- Add stable `data-testid` selectors when needed for UI regression tests.

## Test Expectations

- Run `npm.cmd run test` for implementation stories.
- Run `npm.cmd run test:ui` when learner-facing UI or layout changes.
- Add focused Node tests for logic changes.
- Add or update Playwright tests for viewport, shell, navigation, and visible feedback changes.

## Documentation Expectations

- Update `docs/TESTING.md` when suites or coverage change.
- Update backlog, architecture, ADR, or observation docs when the story changes product direction or learning assumptions.
- Keep documentation concise and linked to story IDs where possible.

## Output Format

Final delivery should include:

- Files created.
- Files modified.
- Test commands used.
- Test results.
- Commit hash and message when committed.
- Follow-up notes or known gaps, if any.
