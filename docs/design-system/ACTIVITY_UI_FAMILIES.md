# NeuroBridge Activity UI Family Framework

## Purpose

NeuroBridge does not use a single learner layout.

Instead, activities belong to UI families that share:

- Workspace
- Interaction model
- Scaffolding philosophy
- Feedback behavior
- Completion behavior

This minimizes UI variation while allowing different cognitive activities to remain natural.

The Activity UI Family Framework bridges the gap between:

Learner Experience Constitution

↓

Shared Runtime Components

↓

Individual Activities

Future activities should first select an Activity Family before implementation begins.

## Relationship to Constitution

Every family inherits:

- `NB-UX-001 Learner Experience Constitution`
- `Activity Surface Contract`
- `Activity Shell`
- Shared Components

Families specialize these principles rather than replacing them.

## Family Template

Every Activity Family contains the following sections:

- Family Purpose
- Typical Cognitive Skills
- Learner Flow
- Workspace Layout
- Scaffold Philosophy
- Feedback Model
- Completion Behaviour
- Progression Behaviour
- Typical Activities
- Shared Components

## Family 1: Choice Activities

### Family Purpose

Choice Activities support learner tasks where the primary action is selecting among visible options.

### Typical Cognitive Skills

- Recognition
- Attention
- Visual discrimination
- Comparison
- Executive Control

### Learner Flow

```text
Prompt
↓
Activity Surface
↓
Feedback
↓
Next Round
↓
Completion
```

### Workspace Layout

The learner workspace should be centered, constrained to a comfortable maximum width, and built around a dominant learning object. Choice surfaces should use clear whitespace and may include optional support regions only when needed by the activity.

### Scaffold Philosophy

Scaffolds live inside the activity itself through the choices, embedded cues, or local support behavior. Generic platform hints should not be used.

### Feedback Model

Choice Activities normally use:

- Immediate
- Surface Tick
- Adaptive

### Completion Behaviour

Completion is typically short, clear, and learner-controlled. Celebration should remain restrained unless a larger milestone is reached. Adaptive progression may occur after completion where appropriate.

### Progression Behaviour

Progression usually evolves by increasing discrimination difficulty, reducing support, increasing distractor similarity, or tightening timing expectations.

### Typical Activities

- Directions
- Matching
- Attribute Explorer
- Same / Different

### Shared Components

- ActivityShell
- ActivityFeedback
- CompletionSurface
- AdaptiveTiming
- SurfaceTick

## Family 2: Grid Activities

### Family Purpose

Grid Activities support learner tasks where the primary action is searching, scanning, remembering, or operating inside a visual field.

### Typical Cognitive Skills

- Visual Search
- Attention
- Working Memory
- Scanning
- Executive Control
- Reasoning

### Learner Flow

```text
Prompt
↓
Grid Surface
↓
Feedback
↓
Next Round
↓
Completion
```

### Workspace Layout

The learner workspace should center the grid, preserve intrinsic sizing, maintain a stable maximum width, and protect whitespace around the grid so scanning remains calm. Optional regions should stay secondary to the grid.

### Scaffold Philosophy

Scaffolds usually live inside the grid through highlights, progressive reveal, embedded cues, or executive overlays. Generic platform hints should not be used.

### Feedback Model

Grid Activities normally use:

- Surface Tick
- Adaptive

### Completion Behaviour

Completion should preserve the stable frame, support milestone-based celebration, and allow adaptive progression based on grid performance patterns.

### Progression Behaviour

Progression usually evolves through grid size, search complexity, memory demand, stimulus density, rule complexity, or fading overlays.

### Typical Activities

- Schulte
- Pattern Memory
- Grid Vision
- Matrix Reasoning

### Shared Components

- ActivityShell
- ActivityFeedback
- SurfaceTick
- ExecutiveOverlay
- CompletionSurface
- AdaptiveTiming

## Family 3: Question & Answer Activities

### Family Purpose

Question & Answer Activities support learner tasks where the primary action is reasoning from a prompt and producing an answer.

### Typical Cognitive Skills

- Reasoning
- Numeracy
- Language
- Recall
- Sequencing

### Learner Flow

```text
Question
↓
Answer
↓
Learning Support Panel
↓
Feedback
↓
Completion
```

### Workspace Layout

The learner workspace should keep the question visually clear, keep the answer region dominant, and place the Learning Support Panel in a stable secondary position. Maximum width and whitespace should preserve readability and focus.

### Scaffold Philosophy

Scaffolds usually live in the Learning Support Panel and through embedded support such as audio, number line, worked examples, ten frame, or vocabulary aids. Generic platform hints should not be used.

### Feedback Model

Question & Answer Activities normally use:

- Immediate
- Adaptive

### Completion Behaviour

Completion usually ends in a summary screen with calm metrics, optional celebration, and adaptive progression behavior.

### Progression Behaviour

Progression usually evolves through question complexity, abstraction level, scaffold fading, multi-step reasoning, and fluency expectations.

### Typical Activities

- Number Bridges
- Kumon Quiz
- Future Reading Comprehension

### Shared Components

- ActivityShell
- ActivityFeedback
- LearningSupportPanel
- CompletionSurface
- AdaptiveTiming

## Future Families

### Story Activities

Status: Future

### Sequencing Activities

Status: Future

### Construction Activities

Status: Future

### Social Interaction Activities

Status: Future

### Planning Activities

Status: Future

## Family Selection Guide

| If the learner primarily... | Use this family |
| --- | --- |
| selects among visible options | Choice Family |
| searches a visual space | Grid Family |
| answers a question through reasoning | Question & Answer Family |

## Platform APIs by Family

| Family | Shared platform APIs |
| --- | --- |
| Choice | `ActivityShell`, `ActivityFeedback`, `CompletionSurface`, `AdaptiveTiming`, `SurfaceTick` |
| Grid | `ActivityShell`, `ActivityFeedback`, `SurfaceTick`, `ExecutiveOverlay`, `CompletionSurface`, `AdaptiveTiming` |
| Question & Answer | `ActivityShell`, `ActivityFeedback`, `LearningSupportPanel`, `CompletionSurface`, `AdaptiveTiming` |

## Future Runtime Framework

Future runtime implementation will introduce:

- `js/activityFamilies/ChoiceActivityFamily.js`
- `js/activityFamilies/GridActivityFamily.js`
- `js/activityFamilies/QuestionAnswerActivityFamily.js`

These components will orchestrate layout and behavior while activities remain focused on cognitive learning logic.
