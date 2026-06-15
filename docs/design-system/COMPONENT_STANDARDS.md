# Component Standards

Purpose: Define reusable UI component expectations for future NeuroBridge activity templates.

Each component should support mobile-first, touch-first, scaffold-first, and accessibility-aware design.

## Activity Header

Purpose: Provide stable context for the current activity.

Placement: Top of the activity shell.

Behavior:

- Shows SIRAASH learner identity, Home navigation, activity name, and minimal progress context.
- May show sandbox or parent mode indicator.
- Should remain visually quiet during learner solving.
- Should not be duplicated by an extra learner navigation row.

Accessibility Notes:

- Use readable text.
- Do not rely on color alone for mode indicators.
- Keep navigation controls large enough for touch.

## Progress Indicator

Purpose: Show where the learner is in the current activity or session.

Placement: Header or progress area.

Behavior:

- Shows simple progress such as `1 / 10` or a minimal progress bar.
- Should not compete with the activity content.

Accessibility Notes:

- Provide text equivalent for visual progress.
- Avoid fast animation.

## Primary Button

Purpose: Trigger the main action.

Placement: Answer area, modal actions, or session actions.

Behavior:

- Large touch target.
- Clear selected, pressed, disabled, and loading states.
- Used sparingly so the main action is obvious.

Accessibility Notes:

- Minimum 44px x 44px.
- Preferred 56px or larger.
- Must support keyboard focus and touch.

## Secondary Button

Purpose: Trigger a non-primary action.

Placement: Near related controls, parent areas, or lower-priority actions.

Behavior:

- Less visually dominant than Primary Button.
- Should not be confused with answer choices.

Accessibility Notes:

- Maintain contrast.
- Keep target size touch-friendly.

## Need Help Button

Purpose: Give the learner or parent access to scaffold support.

Placement: Need Help area or quiet header position.

Behavior:

- Opens or displays the next appropriate scaffold.
- Should not sit between instruction and answer controls.
- May become disabled after use in a trial.
- Uses learner-friendly wording such as `Need Help?`.

Accessibility Notes:

- Label should be clear and translatable.
- Must not require hover.
- Should remain easy to find without distracting from the task.

## Answer Tile

Purpose: Represent a selectable learner answer.

Placement: Answer area.

Behavior:

- Large, clear, and evenly spaced.
- Shows selected state.
- Shows disabled state after answer submission.
- May contain text, image, icon, object, or mixed content.

Accessibility Notes:

- Use high contrast.
- Do not rely only on color for selected state.
- Keep text readable and avoid clipping in translated labels.

## Activity Tile Framework v1.0

Purpose: Provide a reusable learner-facing representation of an activity in the SIRAASH Activity Hub and future learning paths.

Principles:

- Child-friendly.
- Skill-focused.
- Touch-friendly.
- Consistent across all activities.
- Assessment-ready.
- Recommendation-ready.

An Activity Tile communicates:

- What is this?
- Why should I do it?
- Can I start?

### Activity Tile Contract

Required fields:

- `activityId`
- `parentName`
- `learnerName`
- `icon`
- `description`
- `status`
- `domain`
- `skills`

Definitions:

- `activityId`: Internal system identifier.
- `parentName`: Parent, therapist, analytics, and research-facing activity name.
- `learnerName`: Child-facing SIRAASH activity name.
- `icon`: Primary visual identifier.
- `description`: Short learner-friendly explanation.
- `status`: Current activity availability.
- `domain`: Associated NeuroBridge domain.
- `skills`: Associated NeuroBridge skills.

Example:

```json
{
  "activityId": "matrix-reasoning",
  "parentName": "Matrix Reasoning",
  "learnerName": "Pattern Detective",
  "icon": "🧩",
  "description": "Find patterns and solve visual puzzles.",
  "status": "available",
  "domain": "cognitive-tuning",
  "skills": [
    "pattern-recognition",
    "rule-discovery",
    "visual-reasoning"
  ]
}
```

### Learner Naming Standard

Principle: Children learn skills before terminology.

Design principle:

- Children learn skills.
- Adults learn terminology.

Implication:

- SIRAASH surfaces learner-friendly activity identities.
- NeuroBridge surfaces technical activity identities.

Parent-facing names are used in:

- Dashboards.
- Analytics.
- Reports.
- Configuration.
- Research.

Learner-facing names are used in:

- Activity Hub.
- Activity Tiles.
- SIRAASH experiences.

Naming examples:

| Parent-facing name | Learner-facing name |
| --- | --- |
| Matrix Reasoning | 🧩 Pattern Detective |
| Attribute Explorer | 👀 Look Closely |
| Schulte Table | 🎯 Grid Vision |
| Number Bonds | 🔢 Number Bridges |
| Matching Activity | 🔗 Match & Find |
| Sequencing Activity | 🪜 Story Steps |
| Social Stories | 🤝 Social Detective |
| Picture Description | 📸 Tell Me More |
| Fill in the Blanks | ✍️ Word Builder |
| Measurement Activity | 📏 Measure & Compare |

### Tile Status Values

Supported now:

- `available`
- `coming-soon`

Reserved for future:

- `recommended`
- `assigned`
- `locked`

Future status values should not be implemented until the Activity Hub supports the corresponding behavior.

### Tile Layout Standard

Conceptual layout:

```text
┌─────────────────────────────┐
│            Icon             │
│                             │
│ Learner Name                │
│                             │
│ Description                 │
│                             │
│ Start Activity              │
└─────────────────────────────┘
```

Guidelines:

- Touch-friendly.
- Tablet-first.
- Responsive.
- Consistent height.
- Minimal text.
- No technical terminology.
- Clear `Start Activity` action for available activities.
- Clear disabled state for coming-soon activities.

## Card

Purpose: Hold activity content, visual objects, options, or summary information.

Placement: Content area, answer area, or parent summaries.

Behavior:

- Provides clear grouping.
- Should not create nested visual clutter.
- Learner cards should preserve stable dimensions during interaction.

Accessibility Notes:

- Maintain readable contrast.
- Avoid excessive shadow or decoration.

## Modal

Purpose: Present focused overlays such as parent confirmation, settings, or session completion.

Placement: Centered overlay above the current screen.

Behavior:

- Should trap focus while open.
- Should include a clear close or confirm path.
- Should not interrupt learner solving unless necessary.

Accessibility Notes:

- Needs keyboard and touch support.
- Requires clear title and action labels.
- Avoid tiny close targets.

## Feedback Banner

Purpose: Provide immediate result or status feedback.

Placement: Feedback area, or near the activity content after response.

Behavior:

- Shows success, retry, or completion feedback.
- Should be brief and supportive.
- May include a small animation or sound cue when appropriate.

Accessibility Notes:

- Do not rely on sound alone.
- Keep motion small and avoid repeated flashing.
- Use text or icon support alongside color.
