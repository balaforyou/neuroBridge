# SIRAASH Worksheet Architecture Specification

Status: Design

Story: NB-101.4.5.1

Purpose: Define a single worksheet framework capable of hosting current and future NeuroBridge worksheet activities without requiring a new layout implementation for every learning experience.

This specification is documentation-only. It does not change learner-facing activity logic, analytics, tests, UI, or infrastructure.

Implementation foundation:

- `js/worksheetShell.js`
- `js/tests/worksheetShell.test.js`

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

Feature ID:

```text
NB-WS-001
```

Purpose:

- Visual discrimination.
- Similarity detection.
- Categorization.
- Attention to detail.
- Early reasoning confidence.
- Scanning skills.

Matching is the foundational entry point for later reasoning activities:

```text
Matching
  |
Sorting
  |
Pattern Recognition
  |
Pattern Completion
  |
Rule Discovery
  |
Generalization
```

Domain: Executive Function & Cognitive Shifting

Priority: P1

Status: Backlog

V1 implementation:

- Story: NB-WS-001.1
- Location: `games/matchingWorksheet/`
- Scope: Exact image/card matching for apple, ball, and cat pairs.
- Interaction: Tap one card, then tap its matching card. Drag and drop remains a future option.
- Shared services: Uses `createWorksheetShell`, progressive hints, shared SIRAASH feedback, and the inactive level-up celebration placeholder. Routine correct answers do not trigger celebration effects.

User story:

```text
As a learner, I want to match pictures, objects, attributes, and functions so that I can develop visual discrimination, categorization, and early reasoning skills.
```

Scaffold levels:

- Level 1: Exact Matching. Recognize identical items, such as apple to apple, car to car, or cat to cat.
- Level 2: Picture to Picture. Match the same object from a set of choices to build visual scanning and selection.
- Level 3: Picture to Word. Match an image to a written label, such as a picture of an apple to "Apple", to build image-symbol association.
- Level 4: Attribute Matching. Find another red object, round object, or big object to build attribute awareness. Bridge to Attribute Explorer.
- Level 5: Functional Matching. Match related functions, such as toothbrush to teeth, shoe to foot, or plate to food. Bridge to Functional Life Worksheets.

Worksheet layout:

- Instruction Zone: Short learner instruction, such as `Match the same items.`
- Activity Zone: Matching workspace supporting drag and drop, tap to connect, or tap pair selection. Implementation may choose the interaction mode.
- Help Zone: Progressive assistance such as `Look carefully.`, `Find the same picture.`, or `Try the red object.`
- Feedback Zone: Uses the shared SIRAASH feedback contract.
- Celebration Zone: Uses the existing level-up placeholder contract only for milestone advancement.

Acceptance criteria:

- Supports image-to-image matching.
- Supports image-to-word matching.
- Supports attribute matching.
- Supports functional matching.
- Integrates hints.
- Integrates shared feedback.
- Integrates milestone celebration contract.
- Integrates analytics.
- Uses the responsive worksheet shell.

Future activities expected to use this template:

- Same / Different Foundations.
- Object Matching.
- Category Matching.
- Color Matching.
- Shape Matching.
- Community Helpers.
- Household Objects.
- Food Categorization.
- Emotion Matching.

NeuroBridge note:

This template is expected to become the earliest-entry worksheet type for many learners and should be treated as a foundational scaffold rather than a simple game mechanic.

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
- Language retrieval.
- Verbal confidence.
- Self-continuation.

Future feature:

```text
NB-AUD-001
```

Architecture story:

```text
NB-AUD-001.1
NB-AUD-001.2
```

Generalization:

Audio Chain remains the first implementation, but the broader internal abstraction should be:

```text
Sequence Completion Engine
```

The engine supports the same retrieval scaffolding model across auditory, verbal, narrative, conversational, classroom, and functional sequences.

Design principle:

SIRAASH does not test memory. SIRAASH scaffolds retrieval.

Target progression:

```text
Recognize
  |
Recall
  |
Continue
  |
Generate
```

Core learning loop:

```text
Audio Cue
  |
Pause
  |
Learner Continues
  |
Feedback
  |
Reduced Cue
  |
Independent Recall
```

NeuroBridge hypothesis:

Rhythmic and predictable auditory sequences provide a lower-friction route into language retrieval for many learners. Once a sequence becomes stable, recognition can progress into recall, continuation, and generation.

Origin:

- Observation: `OBS-AUD-20260615-001`
- Signal: `#selfContinuation`
- Related future epic: `NB-AI-WS-001`

Levels:

- Level 1: Listen and Sing Along. Audio plays completely and the learner participates for familiarity.
- Level 2: Final Word Completion. Learner completes a single missing final word.
- Level 3: Final Phrase Completion. Learner completes a missing phrase.
- Level 4: Random Cue Continuation. Audio starts from the middle of a familiar sequence and the learner continues.
- Level 5: Visual Cue Continuation. No audio is provided; a visual symbol or title activates recall.
- Level 6: Functional Generalization. Learner bridges memorized language into understood language through simple meaning questions or functional use.

Supported content types:

- Songs, including devotional songs, nursery rhymes, and action songs.
- Counting sequences.
- Days of the week.
- Months.
- Story chains.
- Conversation chains.
- Functional scripts such as requests, help phrases, and social responses.
- Classroom routines.
- Reading fluency and narration chains.

Proposed content model:

```js
{
  id: "ekadantaya",
  type: "song",
  title: "Ekadantaya Vakratundaya",
  segments: [
    {
      id: "segment-1",
      audioStartMs: 0,
      audioEndMs: 5000,
      expectedContinuation: "..."
    }
  ]
}
```

Hint strategy:

- Hint 1: Listen again.
- Hint 2: Think about the next word.
- Hint 3: Provide a first-word or first-sound cue, such as `The next word starts with "Ga..."`.

Feedback:

Audio Chain activities must use `siraashFeedback` for routine feedback:

- Success: `Great work!` and `You found the answer.`
- Mistake: `You got close.` and `SIRAASH will guide you.`

Future response modes:

- Parent confirmed: Correct, Partial, Incorrect.
- Option selection: Multiple choice.
- Speech recognition: Future only, not part of MVP.

Future telemetry:

- `retrievalLatencyMs`: Time from cue completion until learner response begins.
- `promptLevel`: Prompt support used.
- `completionAccuracy`: Correct, Partial, or Incorrect.
- `continuationLength`: Words recalled after cue.
- `cueLengthMs`: Amount of support provided.

Implementation guardrails:

- Architecture only at this stage.
- No audio services.
- No speech recognition.
- No activity code changes.

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
- SIRAASH Worksheet Intelligence (`NB-AI-WS-001`): future parent workflow for uploading school worksheet images and generating scaffolded Bridge Worksheets through existing worksheet templates. This should focus on scaffold generation and learner independence, not answer generation or custom page layouts.
- Observation-Aware Worksheet Intelligence (`NB-AI-WS-001.1`): future refinement where worksheet generation uses learner context from observations, prompt dependency, skill mastery, `#selfContinuation`, recent successes, and recent struggles before selecting the scaffolded worksheet form.

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
