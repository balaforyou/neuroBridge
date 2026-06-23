# PM-001 Pattern Memory Level Design

## 1. Level Design Philosophy

Pattern Memory progression should increase difficulty gradually.

Only one major difficulty dimension should change at a time whenever possible.

Difficulty dimensions:

- Grid Size
- Filled Cell Count
- Color Count
- Display Duration
- Pattern Complexity

The objective is to maintain learner confidence while steadily expanding visual working memory capacity.

## 2. Copy Track

### Purpose

Develop:

- Visual Encoding
- Spatial Mapping
- Pattern Reproduction

Pattern remains visible throughout the activity.

No memory recall required.

### Copy Level Group A

| Level | Grid | Colors | Filled Cells |
| ----- | ---- | ------ | ------------ |
| C1 | 2x2 | 1 | 1 |
| C2 | 2x2 | 1 | 2 |

Milestone:

Pattern Explorer

### Copy Level Group B

| Level | Grid | Colors | Filled Cells |
| ----- | ---- | ------ | ------------ |
| C3 | 3x3 | 1 | 1 |
| C4 | 3x3 | 1 | 2 |
| C5 | 3x3 | 1 | 3 |
| C6 | 3x3 | 1 | 4 |

Milestone:

Pattern Builder

### Copy Level Group C

| Level | Grid | Colors | Filled Cells |
| ----- | ---- | ------ | ------------ |
| C7 | 3x3 | 2 | 2 |
| C8 | 3x3 | 2 | 3 |
| C9 | 3x3 | 2 | 4 |

### Copy Level Group D

| Level | Grid | Colors | Filled Cells |
| ----- | ---- | ------ | ------------ |
| C10 | 4x4 | 1 | 2 |
| C11 | 4x4 | 1 | 4 |
| C12 | 4x4 | 1 | 6 |
| C13 | 4x4 | 1 | 8 |

### Copy Elite

| Level | Grid | Colors | Filled Cells |
| ----- | ---- | ------ | ------------ |
| C14 | 4x4 | 2 | 6 |
| C15 | 4x4 | 2 | 8 |
| C16 | 4x4 | 3 | 8 |

Milestone:

Pattern Champion

## 3. Memory Track

### Purpose

Develop:

- Visual Retention
- Visual Working Memory
- Recall Accuracy
- Pattern Reconstruction

### Memory Level Group A

Display Duration:

10 seconds

Ready Button Enabled

| Level | Grid | Colors | Filled Cells |
| ----- | ---- | ------ | ------------ |
| M1 | 2x2 | 1 | 1 |
| M2 | 2x2 | 1 | 2 |

Milestone:

Memory Explorer

### Memory Level Group B

Display Duration:

10 seconds

Ready Button Enabled

| Level | Grid | Colors | Filled Cells |
| ----- | ---- | ------ | ------------ |
| M3 | 3x3 | 1 | 1 |
| M4 | 3x3 | 1 | 2 |
| M5 | 3x3 | 1 | 3 |
| M6 | 3x3 | 1 | 4 |

Milestone:

Memory Builder

### Memory Level Group C

Display Duration Progression

- 10 seconds
- 8 seconds
- 6 seconds

Ready Button remains enabled.

Purpose:

Increase visual retention demands without introducing additional colors or larger grids.

### Memory Level Group D

| Level | Grid | Colors | Filled Cells |
| ----- | ---- | ------ | ------------ |
| M7 | 3x3 | 2 | 2 |
| M8 | 3x3 | 2 | 3 |
| M9 | 3x3 | 2 | 4 |

### Memory Level Group E

| Level | Grid | Colors | Filled Cells |
| ----- | ---- | ------ | ------------ |
| M10 | 4x4 | 1 | 2 |
| M11 | 4x4 | 1 | 4 |
| M12 | 4x4 | 1 | 6 |
| M13 | 4x4 | 1 | 8 |

Milestone:

Pattern Master

### Memory Elite

Ready Button removed.

Automatic display durations.

| Level | Grid | Colors | Filled Cells | Display Duration |
| ----- | ---- | ------ | ------------ | ---------------- |
| M14 | 4x4 | 2 | 6 | 4 sec |
| M15 | 4x4 | 2 | 8 | 3 sec |
| M16 | 4x4 | 3 | 8 | 2 sec |

Milestone:

Pattern Champion

## 4. Memory Scaffold Progression

### Early Memory Levels

Use:

```text
Pattern Visible
-> Ready Button
-> Pattern Disappears
-> Reproduce
```

Purpose:

Allow learner-controlled encoding time.

### Intermediate Memory Levels

Use:

```text
Pattern Visible
-> Ready Button
-> Timed Display
-> Pattern Disappears
-> Reproduce
```

Display duration gradually decreases.

### Elite Memory Levels

Use:

```text
Pattern Appears
-> Timed Display
-> Pattern Disappears
-> Reproduce
```

Ready button removed.

System controls encoding time.

Ready Button is considered a scaffold and may be removed as mastery increases.

## 5. Promotion Rules

Promote when:

- Accuracy >= 85%
- Two consecutive sessions

Session size:

10 questions

Level progression counters and scaffold progression counters are independent.

Level promotion uses:

- Accuracy >= 85%
- Two consecutive sessions

Scaffold removal uses:

- Accuracy > 90%
- Three consecutive sessions

These counters should be tracked independently.

A level promotion event should not automatically remove scaffolds.

A scaffold removal event should not automatically promote level.

Level progression and scaffold progression are independent systems.

## 6. Maintain Rules

Maintain current level when:

- Accuracy 60%-84%

## 7. Fallback Rules

Fallback when:

- Accuracy < 60%

System may automatically return to the previously mastered level.

The learner should never be forced to repeatedly struggle at an unsuitable difficulty.

Difficulty remains stable within a session.

Difficulty evaluation occurs between sessions only.

### Fallback Floor Rule

C1 and M1 have no lower fallback level.

If learner performance is below fallback threshold at C1 or M1, the system should add or maintain scaffold support instead of reducing level.

Suggested supports:

- Structured Patterns
- Ready Button where applicable
- Extended Display Time in Memory Mode
- Parent-guided retry through Practice Lab where applicable

The learner should never be forced into repeated unsupported failure at the lowest level.

## 8. Skill Metadata Mapping

Each level should support metadata.

### Domain

Memory

### Primary Ontotype

Visual Working Memory

### Skills

- Visual Encoding
- Spatial Mapping
- Visual Retention
- Pattern Reconstruction
- Color Recall

## 9. Level ID Convention

Format:

PM-001-{TRACK}-{GRID}-{CELLS}-{COLORS}-{DURATION}-{COMPLEXITY}

Example:

PM-001-MEM-3X3-3C-1CLR-8S-STRUCT

## 10. Ontotype Mapping

Each level should support future metadata tagging.

### Cognitive Domain

Memory

### Primary Ontotype

Visual Working Memory

### Sub-Ontotypes

- Visual Encoding
- Spatial Memory
- Visual Retention
- Pattern Reconstruction
- Color Recall

### Metadata Requirements

Each level should support:

- Domain
- Ontotype
- Sub-Ontotype
- Skill
- Difficulty

This metadata will be consumed by:

- Dashboard Analytics
- Cross-Activity Reporting
- SIRAASH Learner Model
- Adaptive Progression Engine

Do not assign ontotype weightings in this document.

Weighting definitions belong to future analytics specifications.

## 11. Future Expansion

Future versions may introduce:

- Larger grids
- Additional colors
- Pattern rotation
- Shape-based memory
- Click-cycling interaction mode
- Challenge Track

Do not define future levels in this document.

## Out of Scope

Do not:

- Implement gameplay
- Create UI
- Create badges beyond documentation references
- Create analytics screens
- Create backlog entries

Documentation only.
