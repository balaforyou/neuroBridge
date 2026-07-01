# NeuroBridge Design System

## Purpose

The Design System defines the learner experience, platform UI standards, shared component contracts, and implementation guidance used across all NeuroBridge activities.

It is the authoritative reference for learner-facing UI.

Implementation packets should reference this README rather than individual documents whenever possible.

## Reading Order

### Level 1 - Philosophy

Read first.

- `NB-UX-001_LEARNER_EXPERIENCE_CONSTITUTION.md`
- `../ENGINEERING_MANIFEST.md`

Purpose:
Defines why NeuroBridge behaves the way it does.

### Level 2 - Architecture

Read when creating or modifying activities.

- `ACTIVITY_SURFACE_CONTRACT.md`
- `ACTIVITY_UI_FAMILIES.md`
- `ACTIVITY_ARCHITECTURE.md`
- `WORKSHEET_ARCHITECTURE.md`

Purpose:
Defines platform structure and activity families.

### Level 3 - Shared Components

Read before implementing reusable UI.

- `SHARED_ACTIVITY_COMPONENTS.md`
- `COMPONENT_STANDARDS.md`
- `ACTIVITY_SHELL.md`

Purpose:
Defines reusable runtime components.

### Level 4 - Visual Design

Read for UI implementation.

- `DESIGN_PRINCIPLES.md`
- `LAYOUT_STANDARDS.md`
- `VISUAL_TOKENS.md`
- `FEEDBACK_AND_TIMING_STANDARD.md`

Purpose:
Defines appearance, interaction, motion, timing, and visual consistency.

### Level 5 - Reference Material

Supporting documents.

- `GOLDEN_REFERENCE_SCREENS.md`
- `WORKSHEET_TEMPLATE.md`
- `WORKSHEET_ACTIVITY_TEMPLATE.md`
- `UI_BACKLOG.md`

Purpose:
Examples, templates, and future improvements.

## Design System Layers

```text
Learner Experience Constitution
↓
Activity Contracts
↓
Activity Families
↓
Shared Components
↓
Visual Standards
↓
Reference Material
```

## Design Principles

The Design System inherits the core principles established by `NB-UX-001`:

- Learning object dominates.
- Recognition over reading.
- Progressive disclosure.
- Calm workspace.
- Activity-owned scaffolds.
- Adaptive feedback.
- Activity families.
- Learner-first information.

This README summarizes those principles. The Constitution remains the authoritative source.

## Authoritative vs Evolving Documents

Authoritative documents:

- `NB-UX-001_LEARNER_EXPERIENCE_CONSTITUTION.md`
- `ACTIVITY_SURFACE_CONTRACT.md`
- `ACTIVITY_SHELL.md`
- `SHARED_ACTIVITY_COMPONENTS.md`
- `FEEDBACK_AND_TIMING_STANDARD.md`

Frequently evolving documents:

- `GOLDEN_REFERENCE_SCREENS.md`
- `WORKSHEET_TEMPLATE.md`
- `WORKSHEET_ACTIVITY_TEMPLATE.md`
- `UI_BACKLOG.md`
- `ACTIVITY_UI_FAMILIES.md`

## Future Evolution

The Design System is expected to stabilize after multiple activities have been implemented.

Future consolidation will occur only after patterns have proven reusable across several activity families.

Avoid introducing new documents unless a concept is shared across at least three activities.

## Contributor Rule

Every implementation should follow this sequence:

1. Read `README.md`
2. Read the relevant Activity Family
3. Read the relevant Shared Component contracts
4. Implement
5. Validate against the Learner Experience Constitution

