# Shared Activity Components Standard

Status: Design

Feature: NB-COMP-001

Purpose: Define the reusable UI components used across NeuroBridge activity families.

This standard sits below:

- `NB-UI-001` Activity UI Family Classification
- `NB-WS-003` Worksheet Activity Template V1
- `NB-FB-001` Shared Feedback and Completion Timing Standard

and above activity implementation.

This document is architecture-only. It does not change learner-facing behavior, migrate activities, or add implementation work.

## Purpose

Activities should provide:

- Activity logic
- Activity content
- Activity metadata

Activities should not create custom versions of:

- Instruction cards
- Feedback banners
- Help panels
- Progress pills
- Result cards
- Activity containers

Those should come from shared components.

## Shared Component Catalog

### COMP-001: Activity Header

Purpose: Provide stable activity context.

Owned by: Platform

Contents:

- Activity name
- Question or round
- Level
- Progress
- Home action

Rules:

- Single source of truth.
- Activity body must not duplicate these values.
- Must remain visually compact.

Used by:

- Quiz Template
- Worksheet Template
- Activity Template

### COMP-002: Progress Pill

Purpose: Display compact learner progress.

Examples:

- Question 3
- Level C2
- 3 / 10

Rules:

- Compact.
- Secondary to activity content.
- Must not dominate screen space.

### COMP-003: Instruction Card

Purpose: Provide the primary learner instruction.

Examples:

- Copy the blue pattern.
- Match the same pictures.
- Find the different item.

Rules:

- One primary instruction.
- Short.
- Calm.
- Appears before activity content.
- Supports an icon if needed.

Placement: Instruction Zone

### COMP-004: Activity Workspace Card

Purpose: Contain the activity-owned workspace.

Examples:

- Pattern grids
- Matching cards
- Visual comparison objects
- Direction controls

Rules:

- Largest visual region.
- Activity-owned content only.
- No duplicated headers.
- No duplicated progress indicators.
- No clipping.
- No internal scrolling by default.

### COMP-005: Support Panel

Purpose: Provide scaffold access.

Examples:

- Need Help?
- Hints
- Clues
- Visual cues

Rules:

- Consistent placement.
- Calm appearance.
- Secondary to solving.
- Hidden or collapsed until needed unless activity requires visible support.

Placement: Support Zone

### COMP-006: Feedback Banner

Purpose: Provide shared learner feedback.

Supported types:

- Success
- Correction
- Help
- Milestone

Rules:

- Must follow `NB-FB-001`.
- Must use shared feedback placement where the selected UI family provides one.
- Must stay visible long enough for the learner to perceive the feedback.

Examples:

- Great work!
- You got close.
- Let's look again together.
- SIRAASH has a clue for you.

Placement: Feedback Zone

### COMP-007: Local Feedback Marker

Purpose: Attach feedback directly to learner interaction targets.

Examples:

- Pattern Memory: Orange pulse on incorrect tile; green pulse on successful completion.
- Matching: Highlight matched pair.
- Directions: Highlight selected direction.

Rules:

- Supplements the feedback banner.
- Does not replace the feedback banner.
- Must remain calm and non-punitive.

### COMP-008: Result Summary Card

Purpose: Provide standard completion screen content.

Contents:

- Great work, `{learnerName}`!
- Questions
- Correct / Total
- Accuracy
- Time Taken
- Average Time
- Hints Used
- Mistakes Corrected

Actions:

- Try Again
- Home

Rules:

- Shared component.
- No activity-specific result cards by default.
- Must follow `NB-FB-001` completion standard.

### COMP-009: Celebration Card

Purpose: Display milestone events.

Examples:

- Level Up
- New Stage Reached
- Milestone Complete

Rules:

- Not used for routine success.
- Separate from feedback banner.
- Uses Celebration Zone.

### COMP-010: Activity Tile

Purpose: Represent activities in the Activity Hub.

Source: Activity Tile Framework

Rules:

- Reuse the existing tile standard.
- Do not redefine tile architecture.

## Component Ownership Model

Platform owns:

- Header
- Progress Pill
- Instruction Card
- Support Panel
- Feedback Banner
- Result Summary Card
- Celebration Card

Activities own:

- Workspace content
- Activity logic
- Activity metadata
- Activity-specific local feedback

## Responsive Expectations

All shared components must support:

- Mobile portrait
- Tablet portrait
- Tablet landscape
- Laptop

Rules:

- No clipping.
- No overlap.
- No horizontal scrolling.
- Large touch targets.
- Consistent spacing.

## Visual Consistency Rules

Shared components should use:

- Visual tokens
- Shared spacing
- Shared radius
- Shared typography roles

Do not create activity-specific styling without approval.

Activities may have:

- Identity color
- Activity icon
- Activity artwork

while retaining shared structure.

## Future Component Candidates

Reserved:

- Audio Prompt Card
- Narration Prompt Card
- Parent Observation Card
- Recommendation Card
- Adaptive Hint Panel

No implementation is required for NB-COMP-001.

## Relationship To Other Standards

- `docs/design-system/ACTIVITY_UI_FAMILIES.md` defines which UI family an activity belongs to.
- `docs/design-system/WORKSHEET_ACTIVITY_TEMPLATE.md` defines worksheet region order and guardrails.
- `docs/design-system/FEEDBACK_AND_TIMING_STANDARD.md` defines feedback timing, language, and completion behavior.
- `docs/design-system/COMPONENT_STANDARDS.md` defines lower-level component expectations.
- `docs/design-system/VISUAL_TOKENS.md` defines shared visual roles.

## Out of Scope

- Learner-facing changes
- Activity migrations
- Gameplay changes
- Runtime component implementation
- Refactoring existing activity layouts
