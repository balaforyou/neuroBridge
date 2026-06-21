# NB-ACTIVITY-STANDARD-001

## Reusable NeuroBridge Activity Architecture Standard

Status: Standard

Scope: All NeuroBridge activity families, including Schulte, Stroop, Directions, Neural Bonds, Shopping Cart, Audio Chain, Number Bridges, and future activity families.

Governed By:

- `docs/DELIVERY_STANDARDS.md`
- Activity-specific freeze documents
- Activity-specific test matrices
- Activity-specific implementation plans

## 1. Purpose

This document defines the common architecture expected across NeuroBridge activity families.

The standard exists so every activity can inherit a consistent delivery, shell, feedback, analytics, progression, backlog, parent-workspace, and completion model while still preserving the learning goals unique to that activity family.

Activities may extend this standard when justified by a freeze document, but they should not weaken or remove the shared contracts without an explicit architecture decision or approved backlog item.

## 2. Activity Lifecycle

Every NeuroBridge activity family should move through the following lifecycle:

```text
Discovery
-> Freeze
-> Test Matrix
-> Implementation Plan
-> Implementation Packets
-> Manual Review
-> Observation Review
-> Done
```

### Discovery

Capture the observed learner need, parent need, therapeutic rationale, or architecture opportunity.

Discovery should produce backlog items, not immediate implementation.

### Freeze

Create an activity-family freeze document before implementation begins.

The freeze document should define:

- Goals
- Supported modes
- Progression rules
- Analytics expectations
- Parent controls
- Supported V1 behavior
- Not-supported behavior
- Assumptions
- Potential confusion areas

### Test Matrix

Create a test matrix that defines what success means before implementation starts.

The matrix should include:

- Happy path tests
- Mode or variant tests
- Boundary tests
- Feedback tests
- Analytics tests
- Regression and out-of-scope guards

### Implementation Plan

Break the activity family into independently testable packets.

Each packet must include:

- Scope
- Out-of-scope items
- Dependencies
- Done means
- Required tests

### Implementation Packets

Implementation packets should be small enough to review independently.

New discoveries during implementation must become backlog items instead of expanding the current packet.

### Manual Review

Manual review checks that the implemented packet matches the approved scope and learner-facing behavior.

Manual review should not use implementation time to redesign the packet.

### Observation Review

After learner use, review observed behavior and expectations.

Observation review may create polish items, progression refinements, or architecture follow-ups.

### Done

An item is Done when:

- The approved scope is implemented.
- Tests pass.
- Documentation or backlog status is updated.
- Closure notes exist.
- No known critical defects remain.

## 3. Activity Shell Standard

Every activity should fit the shared NeuroBridge activity shell model unless its freeze document explicitly justifies a different interaction surface.

### Activity Tile

The tile introduces the activity before launch.

Expected tile fields:

- `activityId`
- `parentName`
- `learnerName`
- Optional subtitle or family label when terminology requires both
- Icon or visual identity
- Short learner-facing description
- Status
- Domain
- Skills

Rules:

- Preserve stable internal IDs and routes.
- Use learner-facing names on learner surfaces.
- Keep technical or clinical terminology for parent, analytics, and documentation surfaces.
- Tile text should be short and scannable.
- Accessible labels should match visible learner-facing terminology.

### Launch Flow

Launch flow should:

- Use the existing activity route and shell conventions.
- Pass learner identity and configuration through approved initialization messages.
- Avoid adding parent controls to the learner path.
- Keep Practice Lab launch paths separate from system-controlled learner progression.

### Activity Screen

The activity screen should contain:

- Activity name or family context
- Current mode, level, board, step, or progress context
- One active learner instruction
- Primary interaction area
- Feedback area or feedback state
- Help or scaffold affordance when in scope

Rules:

- The learner should not see competing instructions.
- Header context should not duplicate the active task prompt.
- Primary task content should remain visually stable during interaction.
- Learner-facing text should be calm, brief, and specific.

### Completion Screen

The completion screen should confirm the learner's work and summarize the result.

Recommended elements are defined in Section 9.

## 4. Feedback Engine Standard

Activities should reuse the shared feedback model wherever possible.

Common feedback events:

- Click
- Orange Pulse
- Success
- Celebration

### Click

Use for routine correct interaction feedback.

Click feedback should be light and immediate.

### Orange Pulse

Use for gentle incorrect or wrong-order feedback.

Orange Pulse should not become harsh error feedback. Avoid red error states, cross marks, buzzer tones, or wording such as "Wrong" unless a freeze document explicitly approves it.

### Success

Use for perfect or meaningful local success, such as a zero-error board or completed trial.

Success should not be overused for every routine click.

### Celebration

Reserve celebration for milestones:

- Board completion
- Level completion
- Session completion
- Reward-engine events

Activities may add specialized feedback events, but they should map back to these shared categories when possible.

## 5. Analytics Contract

Every activity should preserve a common analytics core.

Standard metrics:

- Accuracy
- Time
- Misses
- Attempts
- Level
- Mode

Activities may extend analytics with activity-specific fields such as board size, scaffold level, prompt type, reaction time, strategy marker, or completion path.

Activities should not remove standard metrics without explicit justification in the freeze document or an approved architecture decision.

Analytics rules:

- Learner path analytics and Practice Lab analytics must remain distinguishable.
- Parent dashboard presentation should be driven by activity metadata, not inferred from raw trial shape.
- Presentation changes must not silently alter analytics calculation.
- Accuracy rounding and score display should remain consistent within each activity family.

## 6. Progression Contract

NeuroBridge activity progression uses the following standard stages:

```text
Learn
-> Practice
-> Memory
-> Mastery
-> Fluency
```

### Learn

The learner receives clear prompts, high support, and low cognitive load.

### Practice

The learner repeats the task with stable rules and fading support.

### Memory

The learner relies more on internal tracking or recall.

Memory mode is not the same as hidden-board behavior unless the freeze document explicitly defines it that way.

### Mastery

Mastery requires sustained accuracy and stable performance across sessions.

A single successful session should not automatically grant mastery.

### Fluency

Fluency is introduced after natural mastery performance is observed.

Timed or speed-oriented constraints should reinforce competence rather than create early pressure.

Activities may adapt, skip, or rename stages only when justified by their freeze document.

## 7. Backlog Contract

The backlog is the source of truth for implementation status and deferred work.

Allowed status values:

- Ready
- Backlog
- Deferred
- Done
- In Progress
- Blocked

### Ready

Ready items have enough freeze, test, scope, dependency, and acceptance detail for implementation.

Ready does not mean the item must be implemented immediately.

### Backlog

Backlog items are valid ideas or discoveries that are not yet ready for implementation.

Backlog items should include notes explaining why they exist and when they should be promoted.

### Deferred

Deferred items are intentionally parked.

Deferred items should not be implemented until explicitly promoted.

### Done

Done items must include closure notes.

Closure notes should state what changed and what scope remained untouched when relevant.

### `.X` Findings

When implementation discovers a new requirement, dependency, enhancement, or architecture question:

- Do not implement it in the current packet.
- Create a follow-up backlog item using the current feature ID plus a suffix.
- If the obvious suffix ID is already used, choose the nearest non-conflicting suffix and leave a note.

Example:

```text
SCH-005.1A Memory Mode Progression Review
```

### Scope Discoveries

Scope discoveries should be documented as backlog notes or new items.

They should not expand active implementation unless the user explicitly changes the packet scope.

## 8. Parent Workspace Contract

Parent workspace features should stay separate from the learner path unless explicitly approved.

Common parent areas:

- Dashboard
- Practice Lab
- Administration

### Dashboard

Dashboard surfaces help parents interpret learner performance.

Dashboards may show:

- Accuracy
- Score
- Completion time
- Attempts
- Misses
- Hints or scaffold usage
- Trial breakdowns where clinically useful
- Correction review for worksheet-like activities

### Practice Lab

Practice Lab is for parent experimentation, targeted trials, and skill exploration.

Practice Lab must not silently affect:

- Mastery
- Progression
- Fluency
- Official learner-path analytics

### Administration

Administration includes configuration, setup, and parent-controlled preferences.

Administration controls should not leak into learner-facing flows unless the activity freeze document approves it.

## 9. Completion Contract

Completion screens should help the learner understand success without creating overload.

Recommended learner completion elements:

- Great Work message
- Accuracy
- Score
- Progress indication

Example structure:

```text
Great work!

100% Accuracy

20 / 20 Correct
```

Completion rules:

- Completion screens must persist until the learner or parent explicitly chooses an action.
- Completion screens must not auto-disappear, auto-reset, or auto-navigate after analytics submission or timing delays.
- Valid completion actions include Play Again, Return Home, Continue, or a parent/dashboard action where applicable.
- Accuracy should be prominent when accuracy is part of the learner's expectation.
- Score should remain visible when the activity has correct/total scoring.
- Progress indication should be simple, such as level, board, round, or session completion.
- Completion copy should use the learner-facing activity name.
- Parent-only interpretation should remain outside the learner completion surface.

Activities may use a lighter completion surface when scoring does not apply, but they should still provide clear closure.

## 10. Design Principles

This standard captures lessons learned from Number Bridges and Schulte.

### One Active Instruction

The learner should see one active instruction at a time.

Headers may provide context, but they should not compete with the current task prompt.

### Minimize Cognitive Load

Learner screens should reduce unnecessary decisions, duplicated labels, and unclear mode controls.

Controls should appear only when they support the current learner path.

### Observation-Driven Refinement

Real learner observation can reveal expectation gaps that static specs miss.

Examples:

- Promoting learner-facing accuracy in Number Bridges results.
- Simplifying Schulte prompts after observing target-search behavior.
- Aligning Grid Vision and Schulte Table terminology after launch review.

### System-Controlled Learner Progression

The learner path should be system-controlled when progression integrity matters.

Manual selectors and experimentation belong in Practice Lab or parent surfaces unless explicitly approved for the learner path.

### Parent-Controlled Practice Options

Parents should have safe ways to explore modes, levels, and variants without changing official learner progression.

Practice options should be transparent and separated from official analytics.

### Stable Internal Architecture

Learner-facing naming can evolve without renaming internal routes, folders, IDs, or analytics keys.

Terminology alignment should update visible labels and tests while preserving technical stability.

### Metrics First, But Calm For Learners

Activities should emit useful metrics, but learner screens should show only the information that helps motivation and clarity.

Parent and analytics surfaces can carry the deeper interpretation.

### Scope Discipline

Architecture is created during discussion.

Implementation follows architecture.

New discoveries become backlog items.
