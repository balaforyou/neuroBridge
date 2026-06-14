# Visual Tokens

Purpose: Define reusable visual roles for future NeuroBridge activities and templates.

This document intentionally avoids exact color values. Tokens describe semantic roles first, so implementation can later choose accessible values and themes without changing component meaning.

## Typography Roles

### Learner Title

Used for the main learner-facing screen title or welcome message.

Should be:

- Large.
- Clear.
- Friendly.
- Short enough for translation.

### Learner Subtitle

Used for short supporting text below a learner title.

Should be:

- Easy to scan.
- Lower visual weight than Learner Title.
- Calm and supportive.

### Activity Title

Used for the current activity prompt or task focus.

Examples:

- Look at color.
- Same or different?
- Put these in order.

Should be highly visible without crowding the activity content.

### Body Text

Used for general learner-readable text and simple instructions.

Should remain readable on phone, tablet, and laptop screens.

### Hint Text

Used for scaffold prompts, cues, and help messages.

Should be:

- Supportive.
- Brief.
- Distinct from normal body text.
- Visible without taking over the activity.

### Parent Text

Used for parent-facing configuration, summaries, notes, and settings.

Can be denser than learner text, but should remain readable and accessible.

## Color Roles

### Primary

Main NeuroBridge action or identity color role.

Used for:

- Primary buttons.
- Active states.
- Key learner actions.

### Secondary

Supportive action color role.

Used for:

- Secondary buttons.
- Less prominent controls.
- Optional actions.

### Success

Positive feedback color role.

Used for:

- Correct answer feedback.
- Completion confirmation.
- Positive status indicators.

### Warning

Careful attention color role.

Used for:

- Retry prompts.
- Non-blocking alerts.
- Parent-visible warnings.

### Hint

Scaffold and help color role.

Used for:

- Need Help area.
- Hint text.
- Attention cues.

### Parent

Parent-facing control or status color role.

Used for:

- Parent mode controls.
- Sandbox indicators.
- Configuration surfaces.

### Disabled

Unavailable or inactive state color role.

Used for:

- Disabled buttons.
- Locked choices.
- Inactive controls.

Disabled states must remain readable and should not look like errors.

## Spacing Tokens

### XS

Very small spacing for tight internal gaps.

### S

Small spacing for compact groups.

### M

Default spacing between related UI elements.

### L

Large spacing between major regions.

### XL

Extra-large spacing for screen-level separation or calm learner layouts.

## Radius Tokens

### Small

Used for compact controls and small repeated elements.

### Medium

Used for standard cards, buttons, answer tiles, and activity containers.

### Large

Used sparingly for large learner-friendly panels or modal surfaces.

## Shadow Roles

### Card

Subtle separation for content cards and answer tiles.

### Elevated Card

Stronger separation for active or selected cards.

### Modal

Clear top-layer separation for dialogs, overlays, and parent confirmation surfaces.
