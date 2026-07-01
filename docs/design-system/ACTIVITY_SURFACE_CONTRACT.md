# NeuroBridge Activity Surface Contract

## Purpose

This document defines the canonical structure and behavior of all learner-facing activity screens. It exists to keep activity layouts stable and to prevent UI drift, overlapping feedback, repeated titles, empty panels, and layout jumping across NeuroBridge activities.

## Design Principles

- Learner-first visual hierarchy.
- Visual stability.
- One focal task at a time.
- No overlapping UI regions.
- Consistency across all activities.
- Platform owns layout; activities own learning content.

## Five Platform-Owned Regions

### Region 1: Header

- Owns Home navigation.
- Owns SIRAASH branding.
- Owns activity title.
- Activities must not render their own header or navigation.

### Region 2: Prompt Frame

- Owns prompt background, typography, padding, and layout.
- Activity supplies only prompt text.
- Prompt is the single source of truth for the active task.

### Region 3: Activity Surface

- Only region where activity-specific task UI may render.
- Centers task content.
- Constrains maximum width.
- Preserves intrinsic sizing.
- Supports responsive scaling.
- Prevents oversized empty workspaces.

### Region 4: Feedback Frame

- Dedicated reserved area below the activity surface.
- Feedback must not overlay or obscure task content.
- Reserved height prevents layout jumping.
- Only one feedback indication per learner action.

### Region 5: Completion Surface

- Replaces active prompt, task, and feedback frames.
- Header remains visible for context.
- Completion remains visible until learner action.

## Feedback Visibility Rule

The learner must be able to see the selected answer and the feedback message simultaneously.

## Transition States

Normal learning flow:

```text
Prompt
→ Activity Surface
→ Feedback Frame
→ Next Prompt
```

Completion flow:

```text
Header
→ Completion Surface
```

## Activity Responsibilities

Activities may provide:

- Prompt text.
- Task renderer or content.
- Task state.
- Local micro-animations.

Activities must not provide:

- Header.
- Navigation.
- Feedback placement.
- Completion layout.
- Outer page layout.
- Empty hint or helper panels.

## Ownership Matrix

| Region | Ownership |
| --- | --- |
| Header | Platform |
| Prompt Frame | Platform + activity prompt text |
| Activity Surface | Platform frame + activity content |
| Feedback Frame | Platform + feedback event |
| Completion Surface | Platform + activity metrics/result data |

## Review Checklist

- No overlapping regions.
- Header visible once.
- Activity name not repeated in body.
- Prompt visible and dominant.
- Activity surface centered.
- Feedback reserved below task.
- Selected answer and feedback visible together.
- No empty optional regions.
- Completion replaces active task state.
- No layout jump between states.

## Canonical Learner Screen Layout

```text
Header
Prompt Frame
Activity Surface
Feedback Frame
Completion Surface
```

