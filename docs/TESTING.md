# Testing

Purpose: Reference available NeuroBridge test suites and expected passing runners.

## How To Execute Tests

Tests are JavaScript module tests with lightweight runner files.

Run the full Node regression suite:

```bash
npm run test
```

`npm run test` delegates to `npm run test:node`, which discovers and runs all `*.runner.js` files under `js/` and `games/`. The repository root remains CommonJS for tooling, while `js/` and `games/` are explicit ESM module scopes for browser code and Node regression runners.

Run browser viewport smoke tests with Playwright:

```bash
npm run test:ui
```

The Playwright config starts the static app with:

```bash
npm run serve
```

Run individual suites with Node.js:

```bash
node js/tests/domainRegistry.runner.js
node js/tests/skillRegistry.runner.js
node js/tests/cognitiveOntology.runner.js
node js/tests/gameRegistry.runner.js
node js/tests/analyticsAggregator.runner.js
node js/tests/dashboard.runner.js
node js/tests/sessionResult.runner.js
node js/tests/siraashFeedback.runner.js
node js/tests/worksheetShell.runner.js
node js/tests/worksheetTemplate.runner.js
```

Game tests:

```bash
node games/attributeExplorer/tests/attributeSameDifferent.runner.js
node games/attributeExplorer/tests/attributeTrialResult.runner.js
node games/attributeExplorer/tests/attributeLayout.runner.js
node games/attributeExplorer/tests/attributeHelpNudge.runner.js
node games/attributeMatchingWorksheet/tests/attributeMatchingWorksheet.runner.js
node games/kumonQuiz/tests/kumonQuiz.runner.js
node games/matchingWorksheet/tests/matchingWorksheet.runner.js
node games/matrixReasoning/tests/stage1LinearNumbers.runner.js
node games/matrixReasoning/tests/stage2NonLinearNumbers.runner.js
node games/matrixReasoning/tests/stage3ShapePattern.runner.js
node games/matrixReasoning/tests/stage4ColourShapes.runner.js
node games/matrixReasoning/tests/stage5Matrix3x3.runner.js
node games/matrixReasoning/tests/forcedStageOverride.runner.js
node games/matrixReasoning/tests/stageInfrastructure.runner.js
```

## Registry Test Suites

Expected passing suites:

- Domain Registry
- Skill Registry
- Cognitive Ontology
- Game Registry

These verify valid ids, mapping integrity, uniqueness, lookup behavior, and the `dashboardViewType` interpretation contract for registered activities.

## Analytics Test Suites

Expected passing suites:

- Session Result
- Analytics Aggregator
- Dashboard Rendering

These verify aggregation of independent, scaffolded, and failed trials, accuracy, reaction time, hint counts, domain metrics, skill metrics, ontology-derived cognitive target metrics, and parent dashboard rendering contracts. Dashboard rendering coverage protects metadata-driven dashboard view selection, Number Bridges summary-only parent display, correction review behavior, average-time display, and continued trial-table behavior for non-worksheet activities.

## Shared UI Contract Test Suites

Expected passing suites:

- SIRAASH Feedback Contract
- Worksheet Shell Contract
- Worksheet Template Contract

These verify shared learner feedback wording, reserved level-up celebration contract, worksheet template registration, worksheet zone rendering, progressive hint reveal, feedback mounting, inactive celebration placeholder behavior, worksheet template metadata, support prompts, header state updates, and completion rendering.

## Matrix Reasoning Test Suites

Expected passing suites:

- Stage 1 Linear Numbers
- Stage 2 Non-Linear Numbers
- Stage 3 Shape Pattern
- Stage 4 Colour Shapes
- Stage 5 Matrix 3x3
- Forced Stage Override
- Stage Infrastructure

These verify generation structure, correct answers, option validity, forced stage behavior, and stage metadata/factory behavior.

## Attribute Explorer Test Suites

Expected passing suites:

- Attribute Same / Different
- Attribute Trial Result
- Attribute Layout Contract
- Attribute Help Nudge

These verify question generation, controlled non-target attributes, size difficulty metadata, options, trial result structure, scaffold metadata, reaction time, and label scaffold behavior.

## Matching Worksheet Test Suites

Expected passing suite:

- Matching Worksheet
- Attribute Matching Worksheet

These verify deterministic card pair creation, stable card ids, matching and non-matching pair checks, tap-to-select success and mistake behavior, local success and mistake card ids, matched-card selection guards, completion detection, next round reset behavior, attribute question creation, answer detection, deterministic attribute datasets, single-select flow, and hint progression data.

## Number Bridges / Kumon Quiz Test Suites

Expected passing suite:

- Kumon Quiz

These verify default parent configuration, Number Bridges session-level level metadata, Addition L1-L5 bridge labels, configurable 1/3/5 questions-per-screen modes, fixed and ranged addition question generation, auto-progression repeat/advance/cap behavior, Enter and blur answer validation, duplicate auto-validation guards, correct-answer local tick and row locking behavior, group-only auto-advance behavior, wrong-answer retry behavior, hint behavior, result summaries, wrong-answer lists, session summary metadata, and trial analytics fields. Number Bridges level is session-level metadata; trial rows should not invent per-trial level values.

## Browser Viewport Smoke Tests

Expected passing suite:

- Playwright SIRAASH smoke tests

Current browser coverage uses Chromium only and checks:

- SIRAASH Welcome / Activity Hub at 1366 x 768
- Matching Worksheet at 1366 x 768 and 1024 x 768
- Matching Worksheet shell-managed launch, local feedback, clean completion panel, and next-round flow at 1366 x 768
- Attribute Matching Worksheet at 1366 x 768 and 1024 x 768
- Attribute Matching Worksheet shell-managed launch, shared completion panel, and next-round flow at 1366 x 768
- Number Bridges / Kumon Quiz at 1366 x 768 and 1024 x 768
- Number Bridges tile launch, default five-row layout, session-level Addition L1 header/result/dashboard display, Check-free Enter validation, local correct tick, orange wrong-answer emphasis, support-panel-owned scaffold guidance, group advancement, auto-progression from Addition L1 to L2 when enabled, parent dashboard summary-only display with average time and correction status, and completion metrics/review at 1366 x 768
- Attribute Explorer at 1366 x 768 and 1024 x 768
- Attribute Explorer help nudge timing at 1366 x 768
- Matrix Reasoning at 1366 x 768 and 1024 x 768

These tests protect learner-facing layout regressions that Node tests cannot see, including clipped controls, unexpected horizontal scrollbars, desktop/tablet vertical overflow, and delayed help nudge behavior.

## Expected Baseline

For the v1.1 architecture freeze, all registry, analytics, Matrix Reasoning, and Attribute Explorer suites should pass before release.
