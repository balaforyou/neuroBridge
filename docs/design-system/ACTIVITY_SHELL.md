# SIRAASH Activity Shell v1.0

Status: Frozen for first-generation learner activities.

Purpose: Define the shared learner activity layout before applying the shell to Matrix Reasoning and future NeuroBridge activities.

Reference implementation:

- `games/attributeExplorer/index.html`
- `games/attributeExplorer/game.js`

Activity Shell v1.0 is documentation-only. It standardizes the current SIRAASH learner shell without changing game logic, analytics contracts, scaffold behavior, or activity behavior.

## Canonical Learner Flow

```text
SIRAASH learner entry
  |
  v
Activity Hub
  |
  v
Activity Shell
  |
  v
Activity Content
  |
  v
Need Help / Feedback
  |
  v
Home / Completion
```

## Reference Review: Attribute Explorer

Attribute Explorer is the v1.0 reference implementation for the SIRAASH Activity Shell.

Findings:

- SIRAASH branding is visible in the activity header and uses the same muted multi-color learner identity as the welcome screen.
- The activity title appears as secondary context under the SIRAASH identity.
- Home navigation is placed inside the activity header, which removes the need for a dedicated back-navigation row.
- Trial and stars are compact progress pills that do not dominate the learner task.
- The content area is centered and receives the largest available region.
- Same and Different controls are large, equal, touch-friendly, and below the object cards.
- Need Help is available in a consistent region and does not sit between the task and answer controls.
- Feedback has reserved space, reducing layout jumping after a response.
- The shell avoids duplicate learner-facing activity labels and unnecessary outer rows.
- The current layout is strongest on tablet landscape and remains usable on mobile with stacked, touch-first regions.

## Required Shell Regions

### A. Activity Header

Purpose: Provide stable learner context without consuming excessive vertical space.

Required elements:

- SIRAASH learner identity or inherited SIRAASH context.
- Home navigation.
- Activity title.
- Progress summary.

Rules:

- SIRAASH is the companion identity.
- Activity name is context, not the primary brand.
- Home should return to the Activity Hub.
- Avoid separate navigation rows when Home can live inside the shell header.
- Keep progress compact and readable.

### B. Activity Content Area

Purpose: Hold the main learner task.

Examples:

- Visual comparison objects.
- Matrix grids.
- Matching cards.
- Ordering sequences.
- Measurement displays.
- Worksheet prompts.
- Social story panels.

Rules:

- This region should receive the maximum available space.
- The main task should be visually dominant.
- Navigation, labels, counters, and duplicate headers should not crowd this area.
- Avoid fixed-size content that breaks on phones.

### C. Answer Area

Purpose: Hold learner response controls.

Rules:

- Controls should be large, touch-friendly, and clearly separated from content.
- Minimum touch target: 44px x 44px.
- Preferred touch target: 56px or larger.
- Equal-sized answer controls are preferred when choices have equal weight.
- Avoid overlap between answers and content cards.
- No essential action may depend on hover.

### D. Need Help Area

Purpose: Provide scaffold access and scaffold display.

Rules:

- Use learner-friendly wording: `Need Help?`.
- The action may trigger an activity-specific scaffold.
- Help should be easy to find without sitting in the primary answer path.
- Scaffold text should be short, calm, and activity-specific.

Approved examples:

- `Need Help?`
- `SIRAASH has a clue for you 🌱`

### E. Feedback Area

Purpose: Give immediate learner feedback after a response.

Rules:

- Reserve space to avoid layout jumping.
- Use encouraging, non-judgmental language.
- Keep text brief.
- Support color with text or icon when possible.
- Do not rely on sound alone.

Approved examples:

- `Nice work 😊`
- `Let's look again together 🌱`
- `Great effort 🌱`

Avoid learner-facing language:

- `Wrong`
- `Failed`
- `Invalid`
- `Error`

### F. Completion Area

Purpose: Provide a future reserved end-of-activity state.

Rules:

- Should support SIRAASH companion tone.
- Should avoid achievements, streaks, or leaderboards unless a future story explicitly adds them.
- May include a parent handoff or Home return path.

Example tone:

- `Great work today 🌱`

## Activity Shell Contract

Every future activity should be able to provide these shell-facing fields or regions:

- `activityId`
- `activityName`
- `activityType`
- `domain`
- `skills`
- `progressState`
- `contentRegion`
- `answerRegion`
- `helpRegion`
- `feedbackRegion`
- `completionRegion`

This contract is a design and documentation standard only for v1.0. It does not require a shared code component yet.

## Branding Standard

See ADR-005: NeuroBridge and SIRAASH Audience Separation.

Learner-facing identity:

- SIRAASH

Parent, admin, analytics, and research identity:

- NeuroBridge

Rules:

- Learner screens should not show NeuroBridge branding unless explicitly entering parent, admin, analytics, or research mode.
- Activity screens should feel like SIRAASH-guided activities.
- The activity name provides context; SIRAASH provides companion identity.
- Avoid adult or system language in learner mode when a softer phrase is available.

Avoid learner-facing terms:

- `Dashboard`
- `Session`
- `Student`
- `User`
- `Admin`
- `Configuration`

## Navigation Standard

Preferred learner navigation:

- `Home` with a house icon where supported.

Deprecated learner wording:

- `Back to Dashboard`

Rules:

- Home should return to the Activity Hub.
- Home should be placed inside the activity shell header when possible.
- Avoid extra navigation rows that consume learning space.
- Parent-only or sandbox controls may remain in parent/admin surfaces.

## Companion Language Standard

Approved learner-facing phrases:

- `Need Help?`
- `SIRAASH has a clue for you 🌱`
- `Nice work 😊`
- `Let's look again together 🌱`
- `Great effort 🌱`

Learner-name token support:

- SIRAASH messages may include the learner name when it improves warmth or micro-praise.
- Use the session/profile learner name.
- Fall back to `Learner` when no name is available.
- Never hardcode a specific learner name.

Examples:

- `Nice work, {learnerName} 😊`
- `SIRAASH has a clue for you, {learnerName} 🌱`

Tone:

- Calm.
- Brief.
- Encouraging.
- Non-judgmental.
- Predictable.

Avoid:

- Harsh failure labels.
- Dense instructions.
- Adult-facing system terms.
- Excessive celebration during problem solving.

## Responsive Guidance

Primary target:

- Tablet landscape.

Also supported:

- Mobile portrait.
- Tablet portrait.
- Laptop.

Rules:

- Activity content should get maximum available space.
- Avoid duplicate headers.
- Avoid fixed-size content that breaks on mobile.
- Preserve large touch targets.
- Do not require hover.
- Keep answer controls reachable.
- Keep Need Help visible but outside the primary answer path.

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

## Future Notes

Activity Shell v1.0 deliberately avoids a generic engine or shared framework component.

Future work may add:

- Reusable shell helper functions or components.
- Activity tiles and learning paths using Activity Tile Framework v1.0 from `COMPONENT_STANDARDS.md`.
- Printable worksheet variants.
- Regional language variants.
- Parent preview mode.
- Completion templates.
