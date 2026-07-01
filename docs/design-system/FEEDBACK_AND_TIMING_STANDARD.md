# Shared Feedback and Completion Timing Standard

Status: Design

Feature: NB-FB-001

Purpose: Define the shared NeuroBridge standard for correct feedback, incorrect feedback, hint feedback, success visibility, question transition timing, and completion screen behavior across all activity UI families.

This document is architecture-only. It does not change learner-facing behavior, migrate activities, or alter runtime implementation.

## Purpose

Feedback should feel predictable.

The learner should learn this rhythm:

```text
Attempt
-> Feedback
-> Understand
-> Continue
```

The learner should not experience this rhythm:

```text
Attempt
-> Screen changes immediately
```

The learner must have enough time to perceive success and correction.

## Feedback Categories

### FB-001: Routine Interaction Feedback

Purpose: Acknowledge a learner interaction.

Examples:

- Tile selected
- Cell filled
- Card chosen

Characteristics:

- Immediate
- Subtle
- Non-blocking

Examples:

- Highlight
- Border change
- Fill animation

Rules:

- No success message is required.
- No delay is required.
- Must not distract from solving.

### FB-002: Incorrect Feedback

Purpose: Guide correction without punishment.

Examples:

- You got close.
- Try again.
- Let's look again together.

Rules:

- Calm.
- Non-judgmental.
- Brief.
- Learner may continue correcting.

Avoid learner-facing copy:

- Wrong
- Failed
- Invalid
- Error
- Incorrect

### FB-003: Correct Feedback

Purpose: Confirm successful completion.

Examples:

- Great work!
- Nice work.
- You found the answer.

Rules:

- Must include visible success confirmation.
- Should support a success icon or check mark.
- Should remain visible long enough to be perceived.

### FB-004: Help Feedback

Purpose: Acknowledge scaffold usage.

Examples:

- SIRAASH has a clue for you.
- Look carefully.
- Try the blue square.

Rules:

- Calm.
- Activity-specific.
- Never punitive.

### FB-005: Milestone Feedback

Purpose: Celebrate meaningful progression.

Examples:

- Level Complete
- New Level Reached
- Milestone Achieved

Rules:

- Separate from routine success.
- Uses the Celebration Zone.
- Not triggered for every correct answer.

## Feedback Placement Standard

### Global Feedback Zone

Activities should use the shared Feedback Zone.

Purpose: Display success messages, correction messages, and help messages in a predictable location.

Rules:

- **Feedback Placement Rule**: Feedback must not cover or obscure active task content. Feedback should appear in a reserved feedback area below or near the task area. Only one feedback indication should appear per learner action.
- Reserve space to avoid layout jumping.

### Local Feedback

Activities may also provide local feedback.

Examples:

- Pattern Memory: Orange pulse on incorrect tile or green success pulse on correct completion.
- Matching: Highlight matching pair.
- Directions: Highlight selected direction.

Rules:

- Local feedback supplements global feedback.
- Local feedback must not replace global feedback.

## Success Visibility Standard

Routine success must remain visible long enough to be perceived.

### Quiz Family

Reference: Number Bridges

Duration: 700-900ms

Reason: Supports fluency.

### Worksheet Family

Reference: Pattern Memory

Duration: 1200-1500ms

Reason: Supports observation and understanding.

### Activity Family

Reference: Attribute Explorer

Duration: 1000-1300ms

Reason: Supports trial-based reasoning.

### Milestone Events

Duration: Learner-controlled dismissal or explicit continue action.

Examples:

- Level Up
- Stage Complete
- Major Achievement

## Question Transition Standard

Routine flow:

```text
Correct Answer
-> Success Feedback
-> Dwell Time
-> Next Question
```

Rules:

- Never skip visible success.
- Never transition instantly.
- Dwell timing should follow the UI family standard.

## Completion Screen Standard

Applies to all activity families.

Required display:

- Great work, `{learnerName}`!
- Questions
- Correct / Total
- Accuracy
- Time Taken
- Average Time
- Hints Used
- Mistakes Corrected

Required actions:

- Try Again
- Home

Rules:

- Completion screen persists.
- Never auto-dismiss.
- Never auto-navigate.
- Learner controls exit.
- Reuse the shared result screen.
- Activities should not create custom result pages without approval.

## Feedback Language Standard

Approved learner-facing phrases:

- Nice work.
- Great work!
- Great effort.
- Let's look again together.
- You got close.
- SIRAASH has a clue for you.

Avoid learner-facing phrases:

- Wrong
- Failed
- Invalid
- Error
- Try harder
- Not good

## Family Timing Summary

| Family | Success Dwell |
| --- | --- |
| Quiz | 700-900ms |
| Activity | 1000-1300ms |
| Worksheet | 1200-1500ms |
| Milestone Events | Learner controlled |

## Architectural Guardrails

### AG-FB-001

Activities should not invent custom success timings.

### AG-FB-002

Activities should not invent custom completion screens.

### AG-FB-003

Activities should reuse shared feedback patterns.

### AG-FB-004

Local feedback may supplement global feedback.

### AG-FB-005

Milestone celebrations are separate from routine success.

### AG-FB-006

Feedback should support ASD-friendly calm interaction.

## Future Extensions

Reserved for future:

- Audio feedback standards
- Reduced-motion mode
- Animation standards
- Celebration framework
- Parent-configurable feedback preferences

## Relationship To Other Standards

- `docs/design-system/ACTIVITY_UI_FAMILIES.md` defines the UI families that use these timing ranges.
- `docs/design-system/WORKSHEET_ACTIVITY_TEMPLATE.md` defines worksheet feedback and completion placement.
- `docs/design-system/ACTIVITY_ARCHITECTURE.md` defines activity and worksheet layout guardrails.
- `docs/design-system/COMPONENT_STANDARDS.md` defines component-level feedback banner expectations.

## Out of Scope

- Learner-facing changes
- Activity migrations
- Runtime implementation changes
- Gameplay changes
- Analytics changes
