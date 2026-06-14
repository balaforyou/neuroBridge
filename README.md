# NeuroBridge

## Overview

NeuroBridge is a scaffold-driven learning platform for neurodivergent learners. It is designed to help parents, teachers, therapists, and researchers observe how a learner responds to tasks, scaffolds, and feedback over time.

The project is currently local-first and browser-based. Games emit trial-level and session-level metrics, while registries describe the domains, skills, cognitive targets, and games that make analytics possible.

## Current Games

- Matrix Reasoning: pattern and rule-based reasoning across numeric and visual stages.
- Attribute Explorer: Same / Different comparison across color, shape, and size.

## Architecture

NeuroBridge Core Architecture v1.1 is frozen.

Current architecture components:

- Trial Result Contract
- Session Result Contract
- Domain Registry
- Skill Registry
- Cognitive Ontology Registry
- Game Registry
- Analytics Aggregator
- Knowledge Capture Framework

Architecture ownership:

- Game Registry owns game metadata, primary domain, and skills.
- Skill Registry owns valid skills and their domain mapping.
- Cognitive Ontology owns skill-to-cognitive-target mapping.
- Analytics Aggregator derives game, domain, skill, and cognitive target metrics from session results.

## Running Locally

Open `index.html` in a browser from the project root.

The current app is static and does not require a backend for local development. If a local web server is preferred, serve the project root and open the generated localhost URL.

## Running Tests

Tests are plain JavaScript module tests under `js/tests/`, `games/matrixReasoning/tests/`, and `games/attributeExplorer/tests/`.

Example runner commands when Node.js is available:

```bash
node js/tests/domainRegistry.runner.js
node js/tests/skillRegistry.runner.js
node js/tests/cognitiveOntology.runner.js
node js/tests/gameRegistry.runner.js
node js/tests/analyticsAggregator.runner.js
node js/tests/sessionResult.runner.js
node games/attributeExplorer/tests/attributeSameDifferent.runner.js
node games/attributeExplorer/tests/attributeTrialResult.runner.js
node games/matrixReasoning/tests/stageInfrastructure.runner.js
```

Matrix Reasoning also has individual stage runners for stages 1 through 5.

## Project Structure

- `index.html`: main dashboard entry point.
- `css/`: shared styles.
- `js/`: shared platform code, registries, metrics, analytics, and dashboard logic.
- `games/matrixReasoning/`: Matrix Reasoning game, stage generators, and tests.
- `games/attributeExplorer/`: Attribute Explorer game, question generator, and tests.
- `docs/`: architecture, testing, release, game catalog, and project knowledge docs.
- `docs/neurobridge-knowledge/`: observation, idea, backlog, scaffold, and architecture note capture templates.

## Roadmap

Current focus after v1.1 architecture freeze:

- UI templating for consistent game screens.
- Scaffold UI patterns shared across future games.
- Parent-friendly configuration flows.
- Additional games: Pattern Explorer, Who What Where, Sequencing.
- Future analytics dashboards and adaptive recommendations.

## Architecture Freeze Status

Status: v1.1 frozen.

Runtime behavior, UI behavior, and analytics contracts should remain stable unless a future architecture story explicitly reopens them.
