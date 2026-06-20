# NB-STD-001 NeuroBridge Delivery Standard

## Purpose

This document defines the mandatory process for implementing NeuroBridge features.

The objective is to:

- Reduce implementation rework
- Prevent scope creep
- Improve Codex handover quality
- Preserve architecture decisions
- Maintain backlog discipline
- Ensure testability and reviewability

## Golden Rule

New discoveries must not expand implementation scope.

If a new requirement, enhancement, dependency, improvement, or architectural need is discovered during implementation:

Do not implement it immediately.

Create a backlog item instead.

Example:

```text
NB-SCH-001
-> Discovery
-> NB-SCH-001.1 Reusable Audio Service
Status: Backlog
```

Implementation continues only on the approved scope.

## Mandatory Delivery Flow

Every NeuroBridge feature must follow:

```text
Observation
-> Discussion
-> Backlog
-> Freeze
-> Test Matrix
-> Implementation Packet
-> Codex
-> Review
-> Done
```

No implementation should begin before Freeze and Test Matrix are approved.

## Required Artifacts

### 1. Backlog

Master source of truth:

```text
docs/backlog/NEUROBRIDGE_BACKLOG.md
```

Required fields:

- ID
- Title
- Priority
- Status
- Dependencies
- Notes

Status values:

- Ready
- In Progress
- Blocked
- Deferred
- Done

Only humans may change priorities.

Codex may update status.

### 2. Freeze Document

Format:

```text
XXX-FREEZE-001.md
```

Purpose:

Freeze functional requirements before implementation.

Required sections:

- Goals
- Features
- Progression
- Analytics
- Parent Controls
- Supported V1
- Not Supported V1
- Assumptions
- Potential Confusion Areas

Example:

```text
SCH-FREEZE-001.md
```

### 3. Test Matrix

Format:

```text
XXX-TEST-001.md
```

Purpose:

Define exactly what success means.

Required sections:

- Happy Path Tests
- Boundary Tests
- Persistence Tests
- Analytics Tests
- Regression Tests

Example:

```text
SCH-TEST-001.md
```

### 4. Implementation Packet

Format:

```text
XXX-001
```

Example:

```text
SCH-001 Core Grid Engine
```

Each packet must be independently testable.

Example decomposition:

- SCH-001 Core Grid Engine
- SCH-002 Ascending / Descending
- SCH-003 Memory Mode
- SCH-004 Auditory Mode
- SCH-005 Analytics
- SCH-006 Parent Controls

## Scope Guardrails

Every implementation packet must contain:

### In Scope

Explicitly list approved work.

Example:

- 3x3 Ascending
- Random Board Generation
- Two Board Sessions

### Out Of Scope

Explicitly list excluded work.

Example:

- Descending
- Honeycomb
- Gorbov
- Parent Controls
- Adaptive AI

Codex must not implement out-of-scope functionality.

## Assumptions Section

Every handover must include:

```text
Assumption 1:
...

Assumption 2:
...

Assumption 3:
...
```

Example:

- Browser TTS is acceptable
- Session contains two boards
- Desktop-first implementation

Assumptions can be challenged before implementation begins.

## Potential Confusion Areas

Every packet must identify likely misunderstandings.

Examples:

- Memory Mode is not Hidden Board
- Auditory Mode is not Speech Recognition
- Multiples Mode is not Grid Difficulty
- Practice Lab is not Learning Path

This section exists specifically to reduce review cycles.

## Definition Of Done

Every implementation packet must define:

Done means:

- Feature implemented
- Tests passing
- Documentation updated
- Backlog status updated
- No known critical defects

"Looks good" is not a valid completion criterion.

## Test Scope Guardrail

Codex may only test affected areas.

Example:

```text
SCH-001
```

Allowed:

- Grid Engine
- Board Rendering
- Timing Capture

Not allowed:

- Parent Workspace
- Kumon Quiz
- Worksheets

Avoid repository-wide testing for feature-level implementation.

## Review Scope Guardrail

Reviews must only inspect:

- Current packet
- Direct dependencies

Do not review unrelated repository areas.

## Architecture Freeze Rule

Once a Freeze Document is approved, Codex may not change:

- Product rules
- Progression logic
- Analytics definitions
- Learning model

without explicit approval.

Implementation must follow architecture.

Implementation does not redefine architecture.

## Technical Debt Backlog

Create a dedicated section:

```text
NB-TECH-XXX
```

Examples:

- Refactoring
- Performance improvements
- Code cleanup
- Shared services

Technical debt items must not be mixed with feature backlog items.

## Weekly Backlog Grooming

Recommended cadence:

Once per week.

Activities:

- Merge duplicates
- Archive completed items
- Reprioritize backlog
- Promote ready items
- Review deferred items

Implementation sessions must not become backlog grooming sessions.

## Codex Discovery Rule

If implementation discovers:

- New feature
- New dependency
- New enhancement
- New architecture improvement

Create:

```text
FEATURE-ID.X
```

Example:

```text
NB-SCH-001.1
```

Status:

```text
Backlog
```

Do not implement immediately.

## NeuroBridge Principle

Architecture is created during discussion.

Implementation follows architecture.

New discoveries become backlog items.

This preserves focus, velocity, and analytics integrity across the NeuroBridge platform.
