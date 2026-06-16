# SIRAASH Worksheet Architecture Specification

Status: Design

Story: NB-101.4.5.1

Purpose: Define a single worksheet framework capable of hosting current and future NeuroBridge worksheet activities without requiring a new layout implementation for every learning experience.

This specification is documentation-only. It does not change learner-facing activity logic, analytics, tests, UI, or infrastructure.

## Goal

Create a reusable worksheet shell where activities supply content, hints, and metadata while the platform provides the consistent learner experience.

## Design Principles

### P1: One Shell, Many Activities

The worksheet framework should provide:

- Consistent learner experience.
- Consistent hint behavior.
- Consistent feedback behavior.
- Consistent analytics.
- Consistent responsive behavior.

Activities should supply content, not layout.

### P2: Scaffold First

The worksheet is not a form. The worksheet is a scaffold.

Every worksheet should support:

- Guidance.
- Hints.
- Recovery.
- Feedback.
- Progression.

### P3: SIRAASH Is Always Present

Regardless of activity type, this learner flow must remain consistent:

```text
Question
  |
Attempt
  |
Hint
  |
Feedback
  |
Success
```

## Worksheet Regions

Every worksheet contains five logical zones.

### Zone A: Instruction Zone

Purpose: Explain what the learner should do.

Examples:

```text
Match the pictures.
Find the pattern.
Listen and complete.
Describe the picture.
```

Requirements:

- Always visible.
- Concise language.
- Optional visual icon.

### Zone B: Activity Zone

Purpose: Primary learner workspace.

Examples:

- Matching cards.
- Pattern board.
- Narration prompts.
- Audio chain responses.
- Functional sequences.

Requirements:

- Largest area of screen.
- Activity-owned content.
- Responsive resizing.

### Zone C: SIRAASH Help Zone

Purpose: Progressive support.

Features:

```text
Hint
Clue
Nudge
Example
```

Requirements:

- Hidden until requested.
- Progressive disclosure.
- Activity-configurable.

### Zone D: Feedback Zone

Uses the SIRAASH Feedback Contract.

Success:

```text
CHECK MARK

Great work!
You found the answer.
```

Mistake:

```text
You got close.
SIRAASH will guide you.
```

Requirements:

- Shared implementation.
- Consistent wording.
- Analytics-safe.

### Zone E: Celebration Zone

Reserved for:

```text
Level Up
Milestone Complete
```

Future effects:

```text
Claps
Balloons
```

Requirements:

- Not used for routine success.
- Triggered by milestone events only.
- Compatible with the reserved `celebration.levelUp` contract in `js/siraashFeedback.js`.

## Responsive Layout

### Desktop

Target:

```text
1366 x 768 and larger
```

Layout:

```text
+-----------------------------+
| Instruction                 |
+-----------------------------+

+---------+---------+---------+
| Activity| Activity|  Help   |
|         |         |         |
+---------+---------+---------+

| Feedback                    |
+-----------------------------+
```

### Tablet

Target:

```text
1024 x 768
```

Layout:

```text
+------------------+
| Instruction      |
+------------------+

| Activity         |
+------------------+

| Help             |
+------------------+

| Feedback         |
+------------------+
```

## Worksheet Template Registry

The shell must support registration of worksheet types.

### Template 0: Matching Worksheet

Purpose:

- Similarity detection.
- Categorization.
- Visual discrimination.

Future feature:

```text
NB-WS-001
```

### Template 1: Guided Discovery Worksheet

Purpose:

- Attribute Explorer.
- Similar / Different.
- Visual reasoning.

### Template 2: Pattern Builder Worksheet

Purpose:

- Pattern recognition.
- Pattern completion.
- Matrix reasoning.

### Template 3: Narration Worksheet

Purpose:

- Description.
- Grammar.
- Story building.

### Template 4: Audio Chain Worksheet

Purpose:

- Auditory recall.
- Sequence completion.

Future feature:

```text
NB-AUD-001
```

### Template 5: Functional Life Worksheet

Purpose:

- Daily living.
- Cooking.
- School readiness.
- Sequencing.

## Shared Services

Every worksheet automatically receives these shared services.

### Feedback Service

Service:

```text
siraashFeedback
```

Responsibilities:

- Success messages.
- Error messages.
- Celebration contract.

### Hint Service

Responsibilities:

- Hint progression.
- Clue reveal.
- Nudge support.

### Analytics Service

Responsibilities:

- Attempts.
- Hint usage.
- Completion.
- Time spent.

### Viewport Service

Responsibilities:

- No overflow.
- Responsive sizing.
- Safe learner interaction area.

## Future Extensions

Not part of initial implementation:

- Speech recognition.
- Audio playback.
- Parent dashboard.
- Telemetry replay.
- Adaptive difficulty.
- AI-assisted narration support.

## Success Criteria

A new worksheet activity should be implementable by supplying:

```text
Instruction
Activity Content
Hint Configuration
Analytics Metadata
```

without creating a new page layout.

## Architectural Outcome

Future NeuroBridge activities should become:

```text
New Learning Idea
  |
Choose Worksheet Template
  |
Configure Content
  |
Deploy
```

instead of:

```text
New Learning Idea
  |
Create New Layout
  |
Create New Feedback
  |
Create New Hint System
  |
Create New Responsiveness
```

This specification establishes the worksheet shell as a reusable NeuroBridge platform capability.
