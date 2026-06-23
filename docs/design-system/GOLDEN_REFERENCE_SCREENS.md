# Golden Reference Screens

Status: Design

Feature: NB-UI-002

Purpose: Define visual reference standards for NeuroBridge UI families.

This document is documentation-only. It does not add screenshots, change learner-facing behavior, migrate activities, or implement UI changes.

## Purpose

Architecture standards describe:

- Structure
- Components
- Feedback
- Timing

Golden Reference Screens describe:

- Visual arrangement
- Relative sizing
- Region hierarchy
- Screen rhythm

Future activities should be compared against a Golden Reference before implementation is considered complete.

## Golden Reference Philosophy

Golden References are:

- Visual contracts
- Layout contracts
- Region contracts

Golden References are not:

- Pixel-perfect designs
- Theme specifications
- Color specifications

Implementations may vary slightly while preserving structure.

## Family 1: Quiz Template

### Reference Activity

Number Bridges / Kumon Quiz

### Purpose

Rapid fluency practice.

### Golden Layout

```text
Header
-> Question Area
-> Answer Area
-> Optional Help
-> Feedback
```

### Visual Priorities

Priority 1: Question

Priority 2: Answer Input

Priority 3: Feedback

Priority 4: Help

### Rules

- No large instruction card.
- Minimal visual noise.
- Fast solving flow.
- Question remains dominant.
- Help remains secondary.

## Family 2: Worksheet Template

### Reference Activity

Matching Worksheet

### Purpose

Guided cognitive learning.

### Golden Layout

```text
Header
-> Instruction Card
-> Workspace Card
-> Support Panel
-> Feedback Banner
-> Completion
```

### Visual Priorities

Priority 1: Workspace

Priority 2: Instruction

Priority 3: Support

Priority 4: Feedback

### Rules

- Workspace is largest region.
- No duplicated question strip.
- No duplicated level strip.
- No overlap between regions.
- No internal scrolling by default.
- Feedback visible without scrolling.

## Family 3: Activity Template

### Reference Activity

Attribute Explorer

### Purpose

Focused cognitive exercise.

### Golden Layout

```text
Header
-> Task Area
-> Response Area
-> Support Area
-> Feedback
```

### Visual Priorities

Priority 1: Task

Priority 2: Response

Priority 3: Support

Priority 4: Feedback

### Rules

- Single focal task.
- Minimal framing.
- Large touch targets.
- Low clutter.
- Fast comprehension.

## Golden Region Hierarchy

### Worksheet Family

Largest region: Workspace

Second: Instruction

Third: Support

Fourth: Feedback

### Activity Family

Largest region: Task

Second: Response

Third: Support

Fourth: Feedback

### Quiz Family

Largest region: Question

Second: Answer

Third: Feedback

Fourth: Help

## Layout Validation Checklist

Before approving a new activity, review it against the matching Golden Reference.

### General

- No clipping.
- No overlap.
- No hidden controls.
- No horizontal scrolling.
- Touch targets remain accessible.

### Worksheet Family

- Instruction above workspace.
- Workspace above support.
- Support above feedback.
- Feedback visible without scrolling.
- Workspace visually dominant.

### Activity Family

- Task visually dominant.
- Response controls immediately visible.
- Support available but secondary.
- Feedback visible.

### Quiz Family

- Question visually dominant.
- Answer area immediately visible.
- Help secondary.
- Feedback brief and unobtrusive.

## Usage Rule

Every new activity implementation should declare its UI Family and should be visually reviewed against the corresponding Golden Reference Screen before being considered complete.

Examples:

- Pattern Memory: Family `Worksheet`; review against Worksheet Golden Reference.
- Directions: Family `Activity`; review against Activity Golden Reference.
- Multiplication Fluency: Family `Quiz`; review against Quiz Golden Reference.

## Future Enhancements

Reserved:

- Annotated screenshots
- Actual screenshot examples
- Design review checklists
- Responsive reference screenshots
- Accessibility review overlays

Do not add screenshots in NB-UI-002. Establish structure first.

## Relationship To Other Standards

- `docs/design-system/ACTIVITY_UI_FAMILIES.md` defines the UI families.
- `docs/design-system/WORKSHEET_ACTIVITY_TEMPLATE.md` defines the Worksheet Template regions.
- `docs/design-system/FEEDBACK_AND_TIMING_STANDARD.md` defines feedback rhythm and timing.
- `docs/design-system/SHARED_ACTIVITY_COMPONENTS.md` defines the shared component catalog.
- `docs/design-system/LAYOUT_STANDARDS.md` defines common responsive layout expectations.

## Out of Scope

- Learner-facing changes
- Activity migrations
- Gameplay changes
- Screenshot capture
- Pixel-perfect design specification
