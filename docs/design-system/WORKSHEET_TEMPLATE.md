# SIRAASH Worksheet Activity Template v1.0

Status: Frozen.

Purpose: Define the reusable structure for SIRAASH worksheet activities without introducing a heavy framework.

Freeze story: `NB-102.1`

Freeze decision: Worksheet Activity Template v1.0 is stable for first-generation worksheet activities. Future worksheet-style activities should follow this template before introducing custom layout or interaction patterns.

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

## Mandatory Regions

### A. Worksheet Activity Header

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
- Home, SIRAASH identity, activity label, and worksheet title must live inside the activity shell.
- Activity names displayed in the SIRAASH Activity Shell should not be repeated inside worksheet bodies unless the title serves a separate instructional purpose.

Remove repeated activity names from worksheet bodies:

- `NUMBER BRIDGE`
- `MATCHING WORKSHEET`
- `ATTRIBUTE MATCHING`

Keep instructional worksheet prompts:

- `LOOK AT COLOR`
- `LOOK AT SHAPE`
- `LOOK AT SIZE`

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
- Main task equals learner attempt.

### C. SIRAASH Support Region

Contains:

- Need Help / clue entry.
- Clues.
- Visual aids.
- Worked examples.
- Step prompts.

Purpose:

- Support panel equals SIRAASH scaffold.
- Help should support the attempt without visually competing with answer actions.

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
- Routine correct answers use a local tick only.
- Page or group completion may use a calm page transition before the next group appears.
- Activity completion may use learner-aware praise, an activity-specific message, and a one-time gentle celebration.
- Routine correct answers should not leave overlapping global success cards.
- Routine correct answers should not play sound.
- Mistake feedback should remain supportive and non-harsh.
- Mistake wording should avoid `wrong`, `failed`, and other harsh labels.
- Mistake feedback should guide the learner toward correction.
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
- Repeatable worksheets include Next Round.

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

## Dashboard Interpretation Contract v1.0

Worksheet-style activities should declare:

```js
{
  activityId: "...",
  dashboardViewType: "summaryWithCorrections"
}
```

Purpose:

- Parent dashboards should show a readable session summary first.
- Detailed attempt analytics should still be stored.
- Trial-level tables should not be shown by default for worksheet quiz experiences.

The `summaryWithCorrections` view should show:

- Session level or worksheet context where available.
- Score.
- Accuracy.
- Average time or duration.
- Hints.
- Corrections.
- Wrong answer review when mistakes exist.
- `No corrections needed.` when the session is all correct.

Worksheet examples that should default to `summaryWithCorrections`:

- Number Bridges.
- Shopping Cart.
- Arithmetic worksheets.
- Picture worksheets.
- Sequencing worksheets.
- Measurement worksheets.

Dashboard rendering must use `dashboardViewType`, not the shape of stored trial analytics. Worksheet activities may keep detailed trial records internally without exposing a full trial table to parents by default.

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

## Reference Implementations

- `games/matchingWorksheet/`
- `games/attributeMatchingWorksheet/`

Both use:

- SIRAASH activity header.
- Main task region.
- Support panel via `createWorksheetShell`.
- Shared feedback.
- Shared completion helper for round completion.
- No legacy parent `Back to Dashboard` row.
- No outer `Activity: <name>` row.

Review findings:

- Matching Worksheet aligns with Activity Shell v1.0, uses local pair ticks for routine success, and uses the shared completion helper only after the round is complete.
- Attribute Matching Worksheet aligns with Activity Shell v1.0, uses the main/support worksheet structure, and uses the shared completion helper after the correct attribute choice completes the round.
- Both reference activities preserve existing analytics/session contracts.

## Responsive Rules

Tablet and desktop:

- Main task and support panel may sit side-by-side.
- No horizontal scrollbar.
- Primary answer actions must remain visible.
- Support panel must not push the main task out of view.

Mobile:

- Main task first.
- Support panel below.
- Natural vertical scroll is allowed.
- Primary answer actions should appear before support where possible.

General:

- Natural flow is preferred over fixed heights.
- Support panel stays visible but secondary to the answer task.

## Frozen Feedback Rules

Success:

- One tick only.
- Learner-aware praise.
- Activity-specific message.

Mistake:

- No `wrong` label.
- Use supportive language.
- SIRAASH guides the learner toward correction.

Completion:

- One clean completion state.
- Personalized praise.
- Activity-specific completion text.
- Next Round for repeatable worksheets.

## Known Future Activities

- Kumon Quiz.
- Shopping Cart.
- Number Bridges.
- Neural Bond.
- Picture Description.
- Sequencing.
- Measurement.

## Future Notes

Future activities should adopt this template before adding custom layout. Exceptions should be documented in the design-system backlog or ADRs.
