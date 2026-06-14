# NeuroBridge Architecture

Purpose: Reference the frozen NeuroBridge Core Architecture v1.1.

## Architecture Flow

```text
Learner
  |
  v
Game
  |
  v
Trial Result
  |
  v
Session Result
  |
  v
Analytics Aggregator
  |
  v
Domain Metrics
  |
  v
Skill Metrics
  |
  v
Cognitive Target Metrics
```

## Trial Result Contract

Trial results capture one learner response to one task prompt.

Core fields include:

- `gameId`
- `learnerId`
- `sessionId`
- `trialId`
- `timestamp`
- `taskType`
- `stage`
- `difficultyLevel`
- `prompt`
- `correctAnswer`
- `selectedAnswer`
- `isCorrect`
- `resultStatus`
- `attempts`
- `reactionTimeMs`
- `scaffold`
- `attributes`
- `metadata`

Scaffold levels:

- `0`: Independent, no scaffold
- `1`: Attention cue
- `2`: Attribute highlight
- `3`: Choice reduction
- `4`: Model answer

## Session Result Contract

Session results aggregate trial results for one game session.

Core fields include:

- `sessionId`
- `learnerId`
- `gameId`
- `domain`
- `startedAt`
- `endedAt`
- `totalTrials`
- `independentCount`
- `scaffoldedCount`
- `failedCount`
- `accuracy`
- `averageReactionTimeMs`
- `hintUsageCount`
- `highestDifficultyReached`
- `trialResults`

## Domain Registry

The Domain Registry defines broad, stable learning domains such as:

- attention
- memory
- sequencing
- visual-search
- reasoning
- concept-formation
- numeracy
- language
- daily-living

Domains are intentionally broad so future games can be added without reshaping the analytics model.

## Skill Registry

The Skill Registry defines valid skills and maps each skill to a domain.

Examples:

- `pattern-recognition` -> reasoning
- `rule-discovery` -> reasoning
- `same-different` -> concept-formation
- `attribute-comparison` -> concept-formation
- `visual-attention` -> attention

Game metadata must reference only registered skills.

## Cognitive Ontology

The Cognitive Ontology maps skills to underlying cognitive targets.

Examples:

- `pattern-recognition` -> `visual-inhibition`, `axis-scanning`
- `rule-discovery` -> `relational-mapping`, `working-memory-updating`
- `same-different` -> `feature-discrimination`
- `attribute-comparison` -> `comparative-analysis`

Cognitive targets are derived through this ontology, not injected into trial results.

## Game Registry

The Game Registry owns game metadata:

- game id
- name
- domain
- description
- skills
- max stage
- max difficulty
- scaffold support
- difficulty support
- version

Game Registry does not own direct cognitive target mappings. Those are derived from game skills through the Cognitive Ontology.

## Analytics Aggregator

The Analytics Aggregator consumes session results and produces:

- game metrics
- domain metrics
- skill metrics
- cognitive target metrics

Cognitive target metrics are derived by:

```text
Session Result gameId
  -> Game Registry
  -> game.skills
  -> Cognitive Ontology
  -> cognitiveTargets
```

## Knowledge Capture Framework

The knowledge framework lives in `docs/neurobridge-knowledge/` and captures project learning that does not belong in runtime code.

Files:

- `OBSERVATIONS.md`: parent, teacher, therapist, doctor, and other observations.
- `IDEAS.md`: ideas captured without disturbing sprint focus.
- `BACKLOG.md`: future work before formal Jira entry.
- `SCAFFOLDS.md`: reusable scaffold patterns.
- `ARCHITECTURE_NOTES.md`: architecture decisions and rationale.
