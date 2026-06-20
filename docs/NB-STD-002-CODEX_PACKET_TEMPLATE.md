# NB-STD-002 CODEX_PACKET_TEMPLATE

## Standard Codex Implementation Handover Template

Status: Standard

Depends On:

- `NB-STD-001`
- `NB-ACTIVITY-STANDARD-001`

## 1. Purpose

This document defines the standard packet handover format used for NeuroBridge implementation packets.

The template is intended to:

- Reduce repeated handover instructions.
- Encourage consistent implementation scope.
- Preserve freeze and test-matrix discipline.
- Reduce token usage across future activity families.
- Make implementation, testing, backlog, and commit expectations explicit.

Use this template for Schulte, Stroop, Directions, Neural Bonds, Shopping Cart, Audio Chain, Number Bridges, and future NeuroBridge activity packets.

## 2. Packet Structure

Use this top section for every implementation packet:

```text
Feature:
<FEATURE_ID> <FEATURE_TITLE>

Follow:
- NB-STD-001
- NB-ACTIVITY-STANDARD-001
- <ACTIVITY-FREEZE-ID>
- <ACTIVITY-TEST-MATRIX-ID>
- <ACTIVITY-IMPLEMENTATION-PLAN-ID>

Goal:
<Short statement of what this packet must accomplish.>
```

Required packet references:

- Delivery standard
- Activity architecture standard
- Activity freeze
- Activity test matrix
- Activity implementation plan

Do not begin implementation if the required freeze, test matrix, or implementation plan does not exist unless the packet explicitly asks to create those artifacts.

## 3. Scope Definition

Every packet must define scope clearly.

```text
In Scope:
- <Approved behavior>
- <Approved UI surface>
- <Approved tests>
- <Approved documentation or backlog updates>

Out Of Scope:
- <Explicitly excluded behavior>
- <Deferred modes or variants>
- <Analytics or schema changes if not approved>
- <Parent controls if not approved>
- <Unrelated activities>
```

Scope rules:

- Implement only the approved packet.
- Do not implement adjacent backlog items.
- Do not redesign UI unless redesign is explicitly in scope.
- Do not change analytics, database schema, routes, or internal IDs unless explicitly in scope.
- If a new requirement is discovered, create a backlog item instead of implementing it.

## 4. Testing Requirements

Each packet should specify the tests required for its risk level.

```text
Testing Requirements:
Required:
- Unit tests
- Regression tests
- Manual review notes if applicable
```

Testing rules:

- Add or update focused tests for changed behavior.
- Cover learner-facing UI changes with UI or render tests when available.
- Preserve existing behavior with regression coverage for direct dependencies.
- Do not broaden test scope unnecessarily for small packets.
- If tests cannot be run, report why in the completion report.

## 5. Backlog Requirements

Every implementation packet must maintain backlog discipline.

Rules:

- Update backlog status for the implemented item.
- Create `.X` items for discoveries.
- Do not implement discovered items during the current packet.
- Add closure notes when appropriate.
- Preserve backlog history.
- Do not delete unrelated backlog items.
- Do not change priorities unless the packet explicitly says to do so.

Recommended Done entry:

```text
### <FEATURE_ID> <FEATURE_TITLE>

Priority: <existing priority, if any>
Status: Done
Depends On:
- <dependency>

Closure note: <One or two sentences describing what was implemented and what remained out of scope when useful.>
```

Recommended discovery entry:

```text
### <FEATURE_ID>.X <DISCOVERY_TITLE>

Priority: Unassigned
Status: Backlog
Depends On:
- <FEATURE_ID>
Notes:
- <Why this exists.>
- <When it should be promoted.>
- Do not implement now.
```

## 6. Delivery Requirements

Each packet should require:

- Implementation
- Tests
- Backlog update
- Completion report

Completion report should include:

- Files changed
- Behavior implemented
- Tests added or updated
- Backlog updates completed
- Test command result
- New `.X` items created, if any
- Any unrelated worktree changes left untouched
- Commit hash, when committed

## 7. Worktree Requirements

Worktree rules:

- Keep the worktree clean at completion.
- Do not modify unrelated files.
- Do not revert user changes.
- Do not perform broad refactors unless explicitly in scope.
- Preserve existing routes, IDs, database schema, analytics keys, and architecture names unless explicitly instructed.
- If unrelated changes already exist, leave them untouched and report them.

## 8. Git Commit Requirements

If the packet includes a commit message, commit the scoped changes with that exact message.

Commit message examples:

- `SCH-006 Add Listen & Find ordered mode`
- `STR-001 Add Stroop core engine`
- `NBOND-001 Add Neural Bonds foundation`

Commit rules:

- Stage only files related to the packet.
- Confirm tests before committing when tests are required.
- Confirm `git status --short` after committing.
- Report the final commit hash.

## 9. Example Packet

```text
Feature:
SCH-006 Listen & Find Ordered Mode

Follow:
- NB-STD-001
- NB-ACTIVITY-STANDARD-001
- SCH-FREEZE-001
- SCH-TEST-001
- SCH-IMPLEMENTATION-PLAN-001

Goal:
Introduce ordered Listen & Find mode for the learner-facing Schulte Table flow.

In Scope:
- Browser TTS or existing speech mechanism for target prompts.
- Ordered spoken prompts from 1->9.
- Two-board session structure.
- Manual learner selection of the spoken target.
- Focused tests for prompt delivery, ordered target progression, and completion.
- Backlog update.

Out Of Scope:
- Random prompt order.
- Speech recognition.
- Analytics schema changes.
- Parent controls.
- Practice Lab.
- Honeycomb layout.
- Multiples mode.
- Peripheral mode.
- Gorbov.

Testing Requirements:
Required:
- Unit tests for ordered Listen & Find state.
- UI or launch test for learner-facing prompt behavior if available.
- Regression tests for existing ascending, descending, memory, and completion flow.

Backlog Requirements:
- Move or mark SCH-006 as Done after implementation.
- Create SCH-006.X backlog items for any new discoveries.
- Do not implement discovered items.
- Add closure note.

Delivery Requirements:
- Implementation
- Tests
- Backlog update
- Completion report

Worktree Requirements:
- Keep worktree clean.
- Do not modify unrelated files.
- Preserve existing route, IDs, and internal architecture names.

Git Commit Message:
SCH-006 Add Listen & Find ordered mode
```

## Design Goals

This template should:

- Reduce handover verbosity.
- Encourage consistency.
- Minimize repeated instructions.
- Preserve scope discipline.
- Make delivery expectations explicit without redefining activity-specific architecture.

Activity-specific packets may add stricter requirements, but they should not weaken the standards defined here, `NB-STD-001`, or `NB-ACTIVITY-STANDARD-001`.
