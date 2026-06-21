# AI Implementation Handover Standard

## Philosophy

Implementation handovers should be:

- Small
- Explicit
- Testable
- Focused on outcomes

Avoid long narrative descriptions when concise acceptance criteria can communicate the same requirement.

The handover should provide enough information for implementation without requiring excessive repository exploration.

---

## Standard Packet Structure

Every implementation packet should use the following structure.

### Feature

Unique feature identifier.

Example:

NB-WS-001.2.3

---

### Goal

One clear sentence describing the desired outcome.

Example:

Center and visually balance the Attribute Matching learner task.

---

### Read

Optional.

Only include documents required for implementation.

Prefer activity-local documents whenever possible.

Example:

docs/activities/matching-worksheets/

---

### In Scope

Explicit list of allowed changes.

Example:

- Center question card
- Center answer row
- Add constrained stage wrapper
- Update changelog

---

### Out of Scope

Explicit list of prohibited changes.

Example:

- Shared shell redesign
- Dataset changes
- Scoring changes
- Future feature work

---

### Acceptance

User-visible success criteria.

Example:

- Question card centered
- Answer row aligned with card
- Mobile layout remains responsive

Acceptance criteria should be observable rather than implementation-specific whenever possible.

---

### Tests

Specify only the tests expected for the change.

Examples:

UI polish:

- Update launch test only if useful

Logic changes:

- Add unit tests for new behavior

Avoid creating unnecessary tests for presentation-only changes.

---

### Validation

List required validation commands.

Example:

```bash
npm test
git diff --check
```

Additional activity-specific runners may be included.

---

### Documentation

Specify required documentation updates.

Examples:

- CHANGELOG update
- Backlog update
- Activity documentation update

Do not require documentation changes when none are needed.

---

### Commit

Provide the required commit message.

Example:

NB-WS-001 Polish attribute matching layout alignment

---

## Source of Truth Targets

For UI-related packets, include a single source-of-truth visual target whenever possible.

Example:

Center content within worksheet activity panel.
Target max-width approximately 920px.

This reduces exploratory implementation effort.

---

## Scope Discipline

Prefer:

- Small packets
- Single responsibility
- Observable outcomes

Avoid:

- Multi-feature packets
- Architecture redesign mixed with feature work
- Future backlog work bundled into current implementation

---

## Preferred Packet Template

```md
Feature:

Goal:

Read:

In Scope:

Out of Scope:

Acceptance:

Tests:

Validation:

Documentation:

Commit:
```

Future implementation packets should default to this format unless a larger architectural proposal requires additional context.
