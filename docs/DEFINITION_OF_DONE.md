# Definition Of Done

A NeuroBridge / SIRAASH story is done only when all applicable items are true.

## Required

- Story scope is completed.
- No unrelated changes are included.
- Existing behavior and contracts are preserved.
- Node regression suite passes with `npm.cmd run test`.
- Repo status has been checked.
- Commit message is provided when committing.

## Required For UI Changes

- Playwright suite passes with `npm.cmd run test:ui`.
- Required desktop and tablet viewports are verified.
- Primary learner controls are visible.
- No unexpected horizontal scrollbar is present.
- Shell, feedback, and completion states are clean and non-overlapping.

## Required For Documentation Or Product Direction Changes

- Relevant docs are updated.
- Backlog, ADR, architecture, or observation files are updated when applicable.
- Future work is captured without changing runtime behavior unless implementation is in scope.

## Final Report

The final report should state:

- What changed.
- Files created or modified.
- Test commands and results.
- Commit hash and message.
- Known follow-up notes, if any.
