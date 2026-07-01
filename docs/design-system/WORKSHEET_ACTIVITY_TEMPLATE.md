# Worksheet Activity Template V1

Status: Design

Feature: NB-WS-003

Purpose: Define the canonical Worksheet Activity Template for NeuroBridge Worksheet Family activities.

This document is architecture-only. It does not change learner-facing activity behavior, migrate existing activities, change gameplay, or alter analytics.

## Relationship To UI Families

Worksheet Activity Template V1 is the standard implementation model for the Worksheet Template family defined in `docs/design-system/ACTIVITY_UI_FAMILIES.md`.

Worksheet activities share this interaction model:

```text
Instruction
-> Workspace
-> Scaffold Support
-> Feedback
-> Completion
```

Activities should provide content. Templates should provide layout.

## Template Regions

### Region 1: Global Activity Header

Owner: Platform

Contains:

- Activity name
- Question or round information
- Level, when applicable
- Stars or progress

Rules:

- The global activity header is the single source of truth for question, level, stars, and progress state.
- Activity bodies must not duplicate question or level indicators.
- Activity bodies must not create their own progress strip.

Examples:

- Pattern Memory: `Question 3`, `Level C2`
- Matching Worksheet: `Round 1`

### Region 2: Instruction Zone

Purpose: Explain what the learner should do.

Examples:

- Match the same pictures.
- Copy the blue pattern into your grid.
- Choose the correct color.

Rules:

- Always visible.
- Concise.
- One primary instruction.
- Appears above the workspace.

### Region 3: Workspace Zone

Purpose: Primary learner interaction area.

Owner: Activity

Examples:

- Pattern grids
- Matching cards
- Answer choices
- Picture prompts

Rules:

- Largest screen region.
- Centered.
- No overlap with instruction zone.
- No overlap with support zone.
- No clipping.
- No internal scrolling by default.

### Region 4: Support Zone

Purpose: Scaffolds and learner help.

Examples:

- Need Help
- Hints
- Visual cues
- Progressive support

Rules:

- Hidden until needed unless an activity requires visible support.
- Activity-configurable.
- Shared placement across worksheet activities.

### Region 5: Feedback Zone

Purpose: Shared learner feedback.

Success feedback:

```text
Great work!
```

Correction feedback:

```text
You got close.
Try again.
```

Rules:

- Shared placement.
- Shared feedback wording.
- Supports local activity-level feedback.
- Must remain visible without scrolling.

Example:

Pattern Memory may use a local orange pulse for a wrong tile while the feedback zone still shows the shared correction message.

### Region 6: Completion Zone

Purpose: Result screen transition.

Rules:

- Uses Shared Worksheet Result Component v1.0 from `docs/design-system/WORKSHEET_TEMPLATE.md`.
- Does not use activity-specific result pages.
- Result screen remains visible until learner action.
- Activities provide result data; the worksheet template provides result layout, metrics placement, review placement, actions, spacing, and responsive behavior.
- Do not show duplicate completion cards, a generic success card plus a result page, or an auto-dismissed result page.

Required result regions:

- Completion card.
- Metrics summary.
- Optional activity extension slot.
- Optional review slot.
- Actions.

Current reference:

- Number Bridges.

Migration targets:

- Pattern Memory.
- Attribute Matching.
- Attribute Explorer, if still not aligned.

## Layout Guardrails

### LG-001: No Duplicated Question Strips

Worksheet activity bodies must not add internal strips for question or round state when that state is already present in the global activity header.

### LG-002: No Duplicated Level Strips

Worksheet activity bodies must not add internal level or mode strips when the platform header already displays the current level.

### LG-003: No Internal Activity Scrolling Without Approval

Activity content should fit inside the worksheet body without internal scrolling. Any internal scroll region must be explicitly approved and documented in the activity freeze or architecture packet.

### LG-004: No Clipped Content

Instruction text, task panels, controls, support content, and feedback must remain fully visible at supported desktop and tablet viewports.

### LG-005: Instruction Zone Always Above Workspace

The learner should read one instruction before interacting with the task. Workspace content must not overlap or visually compete with the instruction zone.

### LG-006: Feedback Zone Visible Without Scrolling

Success, correction, and helper feedback must be visible without requiring the learner to scroll inside the activity.

### LG-007: Workspace Remains The Largest Visual Region

The primary task area should receive the largest visual allocation inside the worksheet body.

### LG-008: Support Zone Placement Is Consistent

Help, hints, and scaffold support should appear in a consistent template-provided placement across worksheet activities.

### LG-009: Activities Provide Content, Not Layout

Worksheet activities should supply prompts, task controls, choices, state, metadata, and learner-specific content. The template should provide the region order, spacing, feedback placement, help placement, and responsive behavior.

## Current Worksheet Family Classification

Reference template:

- Matching Worksheet

Worksheet variants:

- Attribute Matching Worksheet
- Pattern Memory

Future members:

- Pattern Builder
- Pattern Completion
- Narration Worksheet
- Audio Chain Worksheet
- Functional Life Worksheet

## Migration Strategy

Do not migrate activities as part of NB-WS-003.

Future packets:

- PM-001.1E Pattern Memory Worksheet Migration
- NB-PM-RESULT-001 Migrate Pattern Memory to shared worksheet result component
- NB-AM-RESULT-001 Migrate Attribute Matching to shared worksheet result component
- NB-AE-RESULT-001 Migrate Attribute Explorer to shared worksheet result component if still not aligned

Future worksheet activities should implement Worksheet Activity Template V1 from the beginning.

## Validation Expectations

Worksheet activity implementation tests should verify:

- Global header state remains the single source of truth.
- Activity bodies do not duplicate question or level strips.
- Instruction zone appears above the workspace.
- Workspace and task panels are visible and unclipped.
- Support and feedback placement remain visible.
- No internal scrolling appears unless explicitly approved.
- Shared result screen persists until learner action.

Rendered layout checks should use bounding boxes, computed overflow styles, and viewport visibility where possible.

## Out of Scope

- Learner-facing changes
- Activity migrations
- Pattern Memory refactor
- Gameplay changes
- Analytics changes
- New runtime template implementation
