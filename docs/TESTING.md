# Testing

Purpose: Reference available NeuroBridge test suites and expected passing runners.

## How To Execute Tests

Tests are JavaScript module tests with lightweight runner files.

Run individual suites with Node.js:

```bash
node js/tests/domainRegistry.runner.js
node js/tests/skillRegistry.runner.js
node js/tests/cognitiveOntology.runner.js
node js/tests/gameRegistry.runner.js
node js/tests/analyticsAggregator.runner.js
node js/tests/sessionResult.runner.js
```

Game tests:

```bash
node games/attributeExplorer/tests/attributeSameDifferent.runner.js
node games/attributeExplorer/tests/attributeTrialResult.runner.js
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

These verify valid ids, mapping integrity, uniqueness, and lookup behavior.

## Analytics Test Suites

Expected passing suites:

- Session Result
- Analytics Aggregator

These verify aggregation of independent, scaffolded, and failed trials, accuracy, reaction time, hint counts, domain metrics, skill metrics, and ontology-derived cognitive target metrics.

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

These verify question generation, controlled non-target attributes, size difficulty metadata, options, trial result structure, scaffold metadata, reaction time, and label scaffold behavior.

## Expected Baseline

For the v1.1 architecture freeze, all registry, analytics, Matrix Reasoning, and Attribute Explorer suites should pass before release.
