# SIRAASH Worksheet Activity Template v1.0

Status: Foundation standard for worksheet-like learner activities.

Purpose: Define the reusable structure for SIRAASH worksheet activities without introducing a heavy framework.

Applies to current and future worksheet-like activities:

- Matching worksheets.
- Attribute matching worksheets.
- Kumon-style quiz.
- Fill in the blanks.
- Word problems.
- Shopping cart math.
- Number Bridges.
- Neural Bond.
- Picture description.
- Sequencing.
- Measurement activities.

Out of scope for v1.0:

- New activity implementations such as Kumon Quiz, Shopping Cart, Number Bridges, or Neural Bond.
- AI worksheet generation.
- Adaptive difficulty.
- Backend changes.
- Analytics or session contract changes.

## Core Layout

Worksheet activities use the SIRAASH Activity Shell with two learner regions:

```text
Main Task Region     Support Region
I try here.          SIRAASH helps me here.
```

Desktop and tablet landscape:

- Main task on the left.
- SIRAASH support panel on the right.

Mobile:

- Main task first.
- Support panel below.

## Required Regions

### A. Worksheet Header

Uses Activity Shell v1.0.

Required:

- Home.
- SIRAASH identity.
- Activity label.
- Worksheet activity title.
- Round, question, or stars when applicable.

Rules:

- Do not show duplicate outer activity rows.
- Do not show learner-facing `Back to Dashboard`.
- Do not show `Activity: <name>` outside the activity shell.

### B. Main Task Region

Contains:

- Prompt.
- Question content.
- Answer input or choices.
- Submit, Check, Next, or equivalent action.

Rules:

- Primary answer visibility has priority.
- Primary answer actions must remain visible in tested viewports.
- The support panel must not push answer controls out of view.

### C. SIRAASH Support Region

Contains:

- Need Help / clue entry.
- Clues.
- Visual aids.
- Worked examples.
- Step prompts.

Standard copy:

```text
Need a clue, {learnerName}? 🌱
{learnerName}, SIRAASH can help you 🌱
```

Future scaffold levels:

- Clue.
- Visual aid.
- Worked example.
- Step prompt.

### D. Feedback Region

Uses the shared SIRAASH feedback standard.

Rules:

- One success event should produce one success marker.
- Routine correct answers should not leave overlapping global success cards.
- Mistake feedback should remain supportive and non-harsh.
- Feedback must not overlap answer controls.

### E. Completion Region

Uses the shared completion feedback helper.

Round-based worksheets should include:

- Big tick.
- `Great work, {learnerName}! 🌱`
- Activity-specific completion message.
- Next Round button.

Rules:

- Do not show a generic success card and a completion panel together.
- Do not leave hidden grids or cards visually overlapping completion.
- Completion is shown only after round completion.

## Template Contract

Worksheet activities may provide this metadata shape:

```js
{
  worksheetId,
  activityId,
  learnerName,
  title,
  learnerTitle,
  activityType,
  domain,
  skills,
  roundState,
  questionState,
  supportState,
  feedbackState,
  completionState
}
```

Field notes:

- `worksheetId`: Template or worksheet instance id.
- `activityId`: Runtime activity id.
- `learnerName`: Session/profile learner name, falling back to `Learner`.
- `title`: Parent or system-facing title.
- `learnerTitle`: Learner-facing title.
- `activityType`: Worksheet family such as matching, quiz, word problem, sequencing, or measurement.
- `domain`: NeuroBridge learning domain.
- `skills`: Skills supported by the activity.
- `roundState`: Round, question, stars, or progress context.
- `questionState`: Current prompt/task state.
- `supportState`: Hint/scaffold state.
- `feedbackState`: Current feedback state.
- `completionState`: Round or worksheet completion state.

## Helper Module

Current lightweight helper:

```text
js/worksheetTemplate.js
```

Responsibilities:

- Worksheet template constants.
- Template metadata normalization.
- Learner-name normalization.
- Header round/star state updates.
- Standard support prompt text.
- Shared worksheet completion rendering through `renderSiraashCompletionFeedback`.

This helper is intentionally small. It is not a new framework.

## Current Alignments

- `games/matchingWorksheet/`
- `games/attributeMatchingWorksheet/`

Both use:

- SIRAASH activity header.
- Main task region.
- Support panel via `createWorksheetShell`.
- Shared feedback.
- Shared completion helper for round completion.

## Responsive Rules

- No horizontal scrolling.
- Natural flow is preferred over fixed heights.
- Primary answer controls remain visible.
- Support panel stays visible but secondary to the answer task.
- Desktop/tablet landscape may use side-by-side main/support regions.
- Mobile stacks main task before support.

## Future Notes

Future activities should adopt this template before adding custom layout. Exceptions should be documented in the design-system backlog or ADRs.
