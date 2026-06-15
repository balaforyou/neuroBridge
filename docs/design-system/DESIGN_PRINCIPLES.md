# NeuroBridge Design Principles

Purpose: Define the shared design principles for NeuroBridge UI templating after the Core Architecture v1.1 freeze.

These principles apply to learner activities, parent controls, worksheets, printable materials, and future assessment screens.

## 1. Mobile First

NeuroBridge screens should work first on small and medium touch devices, then scale up to laptops and desktops.

Supported contexts:

- Mobile phones for quick parent review and simple learner activities.
- Tablets for primary learner interaction.
- Laptops and desktops for parent setup, reports, planning, and longer activities.

Layouts should avoid horizontal scrolling, keep the primary task visible, and preserve readable spacing across screen sizes.

## 2. Touch First

Learner controls should be large enough for confident touch input.

Guidelines:

- Use large answer buttons.
- Keep clear spacing between touch targets.
- Avoid tiny icons as the only action path.
- Use predictable placement for primary actions.
- Prevent accidental taps where possible.

Mouse and keyboard support should still work, but touch interaction is the baseline.

## 3. Offline First

NeuroBridge should continue to support local-first use.

Design implications:

- Activities should not depend on live network calls during solving.
- Core content should be available locally where possible.
- Feedback should feel immediate.
- Future sync or backend storage should not block learner progress.

## 4. Scaffold First

Scaffolds are part of the activity design, not an afterthought.

Every activity template should reserve space for:

- Need Help entry point.
- Scaffold cue or hint text.
- Reduced-choice or model-answer states when applicable.
- Scaffold fading over time.

Scaffolds should support independence and reduce prompt dependence.

## 5. Parent / Learner Separation

Learner screens should be calm, simple, and task-focused.

Brand identity should also follow audience separation:

- SIRAASH is the learner-facing companion identity.
- NeuroBridge is the parent, admin, analytics, and research platform identity.

Parent screens may contain:

- Configuration controls.
- Session settings.
- Progress summaries.
- Notes and observations.
- Debug or sandbox controls.

Learner screens should not expose unnecessary parent controls, analytics details, or configuration noise.

Learner screens should avoid admin-oriented terms such as Active Session, Student, User, Admin, and Configuration when a softer learner-facing phrase is available.

## 6. Multi-Language Ready

UI text should be prepared for regional language support.

Guidelines:

- Avoid hardcoded long strings inside tightly constrained buttons.
- Keep labels short and translatable.
- Reserve space for text expansion.
- Prefer clear visual cues alongside text.
- Avoid using reading labels as the default cue when the activity is testing visual discrimination.

Future languages may include Indian regional languages, so layouts should handle different script widths and line heights.

## 7. Accessibility Aware

NeuroBridge should be accessible by design, especially for learners with sensory, motor, language, or attention differences.

Guidelines:

- Maintain high contrast.
- Avoid dark-on-dark combinations.
- Avoid unnecessary motion during problem solving.
- Use clear focus and selected states.
- Do not rely on color alone when a learner must understand UI state.
- Keep feedback supportive and non-punitive.

Accessibility work should be practical and learner-centered rather than purely checklist-driven.

## 8. Activity Based, Not Game Based

NeuroBridge should describe learner tasks as activities.

Reason:

- Some tasks are games.
- Some tasks are worksheets.
- Some tasks are assessments.
- Some tasks are social stories or daily living practice.

The shared shell should support all of these without forcing every experience into a game metaphor.

## Learner-Safe UI

Learner-facing UI should:

- Reduce visual clutter.
- Keep one clear task focus.
- Use calm but visible feedback.
- Avoid distracting counters or controls during solving.
- Keep help available without placing it in the main answer path.

The learner should always know what to look at, what to answer, and where help is available.
