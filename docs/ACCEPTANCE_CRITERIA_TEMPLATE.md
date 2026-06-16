# Acceptance Criteria Template

Use this template when drafting NeuroBridge / SIRAASH stories.

## Functional Acceptance

- The requested behavior is implemented.
- Existing behavior in related activities remains unchanged.
- Edge cases relevant to the story are handled.

## UI / UX Acceptance

- Learner-facing text is clear and SIRAASH-consistent.
- Primary actions are visible and easy to use.
- Layout works at expected desktop and tablet viewports.
- No duplicate headers, overlapping elements, clipped controls, or unexpected horizontal scrolling.

## Accessibility / Touch Acceptance

- Interactive controls are touch-friendly.
- Buttons and controls have clear labels or accessible names.
- Focus states remain visible.
- Feedback is visible without relying only on color.

## Data / Analytics Acceptance

- Existing analytics contracts are preserved.
- New telemetry is added only when explicitly in scope.
- Trial, session, and scaffold data remain compatible with existing consumers.

## Regression Acceptance

- Node regression suite passes.
- Existing activity behavior remains covered.
- New logic has focused tests where appropriate.

## Playwright Acceptance

Required when learner-facing UI is touched:

- Relevant page or activity loads.
- Primary controls are visible.
- Required viewports pass.
- No horizontal overflow.
- Completion, feedback, navigation, or shell states are verified when changed.

## Documentation Acceptance

- Testing docs are updated if tests or coverage change.
- Backlog, architecture, ADR, or observation docs are updated when relevant.
- Any follow-up item is documented with a story ID or clear note.
