# Activity Shell

Purpose: Define the shared NeuroBridge activity layout before implementing reusable UI templates.

The activity shell is a common structure for games, worksheets, social stories, and assessments. It should support learner focus, scaffolds, parent separation, and future localization.

## Common Layout Flow

```text
SIRAASH Splash
  |
  v
Daily Welcome / Welcome Back
  |
  v
Activity Header
  |
  v
Activity Content Area
  |
  v
Answer Area
  |
  v
Need Help Area
  |
  v
Feedback Area
  |
  v
Session Complete
```

## SIRAASH Splash

Entry screen for the learner experience.

Purpose:

- Establish the SIRAASH identity.
- Provide a calm transition into learning.
- Avoid overwhelming setup controls.

Future support:

- Offline-ready splash assets.
- Optional parent skip.
- Regional language greeting.

## Daily Welcome / Welcome Back

Short learner-friendly greeting before activities begin.

Examples:

- Daily welcome for first activity of the day.
- Welcome back for resumed sessions.
- Optional parent-selected message.

This area should stay brief and should not become a dashboard.

## Activity Header

Small, stable header for the current activity.

May include:

- Activity name.
- Trial or step count.
- Minimal progress indicator.
- Parent-only sandbox indicator when needed.

Should avoid:

- Large score displays during solving.
- Dense analytics.
- Distracting reward counters.

## Activity Content Area

Primary learner task area.

Examples:

- Matrix grid.
- Attribute comparison objects.
- Matching cards.
- Sequence items.
- Worksheet prompt.
- Social story panel.

The content area should be visually dominant and centered where possible.

## Answer Area

Primary response controls.

Examples:

- Same / Different buttons.
- Multiple-choice options.
- Drag or tap targets.
- Ordered item slots.
- Measurement choices.

Answer controls should be large, touch-friendly, and clearly separated from content.

## Need Help Area

Reserved area for scaffold entry and scaffold display.

The default entry point should be a clear `Need Help` or equivalent button. Help should be available without sitting inside the main answer path.

Possible scaffold display:

- Attention cue.
- Attribute cue.
- Choice reduction.
- Parent prompt.
- Model answer.

## Feedback Area

Immediate learner feedback after a response.

Feedback should be:

- Clear.
- Supportive.
- Brief.
- Visually consistent.
- Not dependent on harsh error states.

Examples:

- Green check.
- Short success message.
- Gentle retry cue.
- Small celebration animation.

## Session Complete

End-of-session state.

May include:

- Positive completion message.
- Parent summary handoff.
- Next activity suggestion.
- Return to dashboard.

Learner completion should feel calm and successful.

## Reserved Activity Types

The shell should reserve support for these activity types:

- `GRID`: Matrix, pattern grid, visual search grid.
- `SELECT`: Tap or choose one option.
- `MATCH`: Pair related items.
- `ORDER`: Sequence items or steps.
- `MEASURE`: Compare size, quantity, time, distance, or other measurable attributes.
- `WORD_PROBLEM`: Language and numeracy problem solving.
- `CONSTRUCT`: Build, assemble, draw, arrange, or create a response.
- `SOCIAL_STORY`: Guided social or daily living scenario.
- `ASSESSMENT`: Structured assessment or baseline activity.

## Template Notes

The shell should support both:

- Interactive game-like activities.
- Printable or worksheet-style activities.

The same activity model should eventually support learner UI, parent preview, printable mode, and analytics capture.
