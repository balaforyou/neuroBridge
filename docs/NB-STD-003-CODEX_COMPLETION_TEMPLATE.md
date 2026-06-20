# NB-STD-003 CODEX_COMPLETION_TEMPLATE

## Standard Codex Completion Report Template

Status: Standard

Depends On:

- `NB-STD-001`
- `NB-ACTIVITY-STANDARD-001`
- `NB-STD-002-CODEX_PACKET_TEMPLATE`

## 1. Purpose

This document defines the standard completion report format used after implementing any NeuroBridge packet.

The template is intended to:

- Make reviews faster.
- Reduce repeated completion-report wording.
- Preserve a clear audit trail.
- Confirm scope discipline.
- Capture test, backlog, worktree, and commit status consistently.

Use this template after implementation packets for Schulte, Stroop, Directions, Neural Bonds, Shopping Cart, Audio Chain, Number Bridges, and future NeuroBridge activity families.

## 2. Completion Report Structure

Use this top section for every completion report:

```text
Packet:
<FEATURE_ID> <FEATURE_TITLE>

Commit:
<hash> <commit message>
```

If no commit was created, state:

```text
Commit:
Not created. <Reason>
```

## 3. Files Changed

List modified, added, and deleted files.

Recommended format:

```text
Files changed:
- Modified: <path>
- Added: <path>
- Deleted: <path>
```

If there are no changes in a category, omit that category.

For docs-only packets, explicitly state that no implementation code changed.

## 4. Implemented

Provide a concise summary of delivered functionality.

Recommended format:

```text
Implemented:
- <Behavior or document delivered>
- <Important preservation note, such as route or analytics unchanged>
- <Learner-facing or parent-facing surface updated, if applicable>
```

Keep this section short and tied to the approved packet scope.

## 5. Tests

Use a standard reporting format:

```text
Tests:
- Unit tests: <command and result>
- Regression tests: <command and result>
- Manual tests: <notes or Not applicable>
```

Rules:

- Include exact commands when tests were run.
- If tests were not run, explain why.
- If manual review is applicable, state what was checked.
- Do not claim broad coverage unless it was actually run.

## 6. Backlog

Report backlog work explicitly:

```text
Backlog:
- Status updated: <Yes/No and item>
- .X items created: <None or list>
- Closure notes added: <Yes/No and item>
```

If the packet was docs-only and did not require backlog updates, state that clearly.

## 7. New Findings

Use one of these formats.

No new findings:

```text
New findings:
None
```

New backlog findings:

```text
New findings:
<FEATURE_ID.X> <Title>
<Short description and reason it was not implemented now.>
```

Rules:

- Do not implement newly discovered items unless the active packet explicitly changed scope.
- Record discovery IDs exactly as added to the backlog.
- If an expected `.X` ID was already used, note the alternate ID and why it was chosen.

## 8. Scope Verification

Confirm scope boundaries:

```text
Scope verification:
- No out-of-scope implementation.
- Scope boundaries respected.
- Preserved: <routes, IDs, analytics, schema, parent behavior, or other relevant constraints>
```

If any scope exception occurred, describe it clearly and state whether the user approved it.

## 9. Worktree Status

Expected format:

```text
Worktree status:
Worktree is clean.
```

If the worktree is not clean:

```text
Worktree status:
Uncommitted changes remain:
- <path> - <reason or owner if known>
```

Never hide unrelated worktree changes. If they were left untouched, say so.

## 10. Example Completion Report

```text
Packet:
SCH-006 Listen & Find Ordered Mode

Commit:
abc1234 SCH-006 Add Listen & Find ordered mode

Files changed:
- Modified: games/schulte/game.js
- Modified: games/schulte/tests/schulteCore.test.js
- Modified: games/schulte/tests/schulteLaunch.test.js
- Modified: docs/backlog/NEUROBRIDGE_BACKLOG.md

Implemented:
- Added ordered Listen & Find support for Schulte Table using the approved browser speech path.
- Preserved two-board learner flow and manual target selection.
- Kept random prompts, speech recognition, analytics schema changes, parent controls, and Practice Lab out of scope.

Tests:
- Unit tests: `node games\schulte\tests\schulteCore.runner.js` passed
- Regression tests: `node games\schulte\tests\schulteLaunch.runner.js` passed
- Manual tests: Verified ordered prompts start at 1 and advance through learner selection.

Backlog:
- Status updated: SCH-006 marked Done.
- .X items created: None.
- Closure notes added: SCH-006 closure note added.

New findings:
None

Scope verification:
- No out-of-scope implementation.
- Scope boundaries respected.
- Preserved existing route, IDs, internal architecture names, and no speech recognition.

Worktree status:
Worktree is clean.
```

## Design Goals

This template should support:

- Consistent reporting.
- Faster reviews.
- Reduced token usage.
- Easy audit trail.
- Clear confirmation that scope, tests, backlog, and worktree expectations were handled.

Completion reports may be shorter for docs-only changes, but they should still identify the packet, commit, changed files, tests or test rationale, backlog status, scope verification, and worktree status.
