# NeuroBridge Activity Architecture

Status: Design

Story: NB-000.06

Purpose: Document the NeuroBridge Activity Family architecture that exists outside the Worksheet Family.

This specification is documentation-only. It does not change runtime code, learner-facing activity logic, analytics contracts, tests, UI, or infrastructure.

## NeuroBridge Experience Model

NeuroBridge contains two top-level experience families:

```text
NeuroBridge
|-- Worksheet Family
`-- Activity Family
```

The Worksheet Family covers scaffolded worksheet-style learning experiences. The Activity Family covers interactive learner activities that may use the SIRAASH Activity Shell but are not worksheet templates.

## Activity Family Purpose

The Activity Family provides a home for focused learning experiences that develop attention, executive function, visual scanning, working memory, reasoning, functional independence, and social understanding.

Every activity should eventually preserve the project architecture principles:

- Reuse game engine.
- Metrics first.
- Scaffold discovery.
- Adaptive difficulty.
- Parent configurable.

Every activity should eventually support:

- Metrics emission.
- Hints.
- Scaffold fading.
- Reward engine integration.

## Activity Families

## Activity Registry Source Of Truth

`js/gameRegistry.js` is the single source of truth for runtime activity metadata.

Every launchable or visible activity must have a Game Registry entry before it appears in the SIRAASH Activity Hub. The registry owns:

- Activity identity and route id.
- Launch folder.
- Activity Hub tile metadata.
- Domain and skill mapping.
- Dashboard interpretation through `dashboardViewType`.
- Enabled or coming-soon status.

`js/activityTiles.js` may define category order, category titles, category descriptions, and category styling. It must not maintain independent per-activity metadata or hardcoded activity membership lists.

New activity Definition of Done:

- Registry entry exists.
- `gameId` is listed in `GAME_IDS`.
- Domain is valid in `domainRegistry.js`.
- Skills are valid in `skillRegistry.js`.
- `dashboardViewType` is present.
- Activity tile renders from registry metadata.
- Enabled activities have a launch test.
- Coming-soon activities render disabled and do not launch.

### Executive Function & Cognitive Control

Activities:

- `NB-ACT-001` Stroop
- `NB-ACT-002` Directions

Purpose:

- Inhibition.
- Rule switching.
- Attention control.
- Response control.
- Following spoken, visual, or symbolic instructions.

### Visual Search & Scanning

Activities:

- `NB-ACT-003` Schulte Table
- `NB-ACT-004` Grid Vision

Purpose:

- Visual search.
- Spatial scanning.
- Sustained attention.
- Search strategy development.
- Eye movement and target finding practice.

### Pattern & Reasoning

Activities:

- `NB-ACT-005` Pattern Matching

Purpose:

- Pattern recognition.
- Visual comparison.
- Relational matching.
- Rule discovery.
- Early reasoning confidence.

### Working Memory

Activities:

- `NB-ACT-006` Number Memory

Purpose:

- Short-term recall.
- Sequencing.
- Auditory or visual working memory.
- Prompt-supported retrieval.
- Scaffold fading toward independent recall.

### Functional Life Simulation

Activities:

- `NB-ACT-007` Shopping Cart

Purpose:

- Practical decision-making.
- Functional sequencing.
- Category and quantity awareness.
- Daily living confidence.
- Parent-configurable life practice.

### Social & Relational

Activities:

- `NB-ACT-008` Neural Bonds

Purpose:

- Social reasoning.
- Relationship mapping.
- Perspective taking.
- Emotion and context awareness.
- Relational independence.

## Porting Priority

### Tier 1

Port first because these activities establish the Activity Family foundation and cover high-value attention, inhibition, and scanning skills.

- Stroop
- Directions
- Schulte

### Tier 2

Port after the Tier 1 shell, feedback, metrics, and viewport standards are stable.

- Grid Vision
- Pattern Matching
- Number Memory

### Tier 3

Port after shared services can support more complex functional or relational experiences.

- Shopping Cart
- Neural Bonds

## Legacy vs SIRAASH Migration Strategy

Standalone legacy activities should migrate into the shared SIRAASH platform in stages.

### Stage 1: Inventory

Capture each legacy activity's:

- Existing interaction model.
- Learning target.
- Difficulty levels.
- Hint behavior.
- Feedback behavior.
- Completion behavior.
- Existing metrics, if any.
- Viewport assumptions.

### Stage 2: Classify

Assign each activity to:

- Activity family.
- Activity ID.
- Domain.
- Skill targets.
- Cognitive targets, derived through the existing ontology where applicable.
- Porting tier.

### Stage 3: Normalize

Map each activity into shared platform expectations:

- Activity Shell regions.
- SIRAASH Feedback.
- Celebration Contract.
- Testing Standards.
- Viewport Standards.
- Metrics contract.
- Hint and scaffold behavior.

### Stage 4: Port

Move the activity into the SIRAASH platform without changing its learning intent.

Porting should prioritize:

- Preserving the known learning loop.
- Replacing one-off feedback with shared SIRAASH feedback.
- Replacing one-off layout with Activity Shell alignment.
- Adding metrics only through approved contracts.
- Keeping parent-facing configuration separate from learner-facing activity flow.

### Stage 5: Refine

After the activity is stable inside SIRAASH, future stories may refine:

- Adaptive difficulty.
- Scaffold fading.
- Parent configuration.
- Reward engine behavior.
- Analytics summaries.
- Cross-family learning path placement.

## Relationship To Worksheet Family

The Activity Family and Worksheet Family should remain distinct, but they can reinforce each other.

Activities often develop attention, response control, search strategy, memory, or reasoning foundations. Worksheets often turn those foundations into scaffolded academic, language, or functional tasks.

## Worksheet Activity Layout Standard

Worksheet-style activities that render inside the shared worksheet shell must keep the learner-facing task contained, readable, and visible within the worksheet body.

- The global activity header is the single source of truth for question, level, and stars.
- Activity bodies should not duplicate question, level, or status strips unless explicitly justified.
- The instruction panel appears first inside the activity body.
- The main task area appears below the instruction panel.
- The feedback/help area appears below the main task area.
- Activity content must fit inside the worksheet body without internal scrolling unless explicitly approved.
- Instruction and prompt areas must not overlap task content.
- Task panels must be fully visible at supported desktop and tablet viewports.
- Activity-specific content must not create hidden overflow.
- Feedback must be visible without scrolling.
- Result screens must remain persistent until learner action.
- Learners should see one active instruction and one active task area.
- Any scrollable region inside an activity must be justified by the activity freeze document.

Regression coverage should use rendered layout checks where possible. Bounding boxes, computed overflow styles, viewport visibility, and panel clipping assertions are preferred over DOM text presence alone.

Examples:

```text
Directions
  |
  v
Functional Life Worksheets
```

```text
Pattern Matching
  |
  v
Attribute Matching
```

```text
Number Memory
  |
  v
Audio Chain / Sequence Completion
```

Cross-family bridges should be documented when an activity prepares the learner for a worksheet template or when a worksheet depends on a skill strengthened by an activity.

## Shared Platform Services

Activities should eventually align with these shared services and standards.

### Activity Shell

Activities should use the SIRAASH Activity Shell model for:

- Activity Header.
- Activity Content Area.
- Answer Area.
- Need Help Area.
- Feedback Area.
- Completion Area.

Reference: `docs/design-system/ACTIVITY_SHELL.md`

### SIRAASH Feedback

Routine activity feedback should use the shared SIRAASH feedback tone and contract.

Activities should avoid one-off harsh or system-facing learner messages such as:

- `Wrong`
- `Failed`
- `Invalid`
- `Error`

### Celebration Contract

Routine correct answers should not trigger milestone celebration effects.

Celebration should remain reserved for:

- Level completion.
- Milestone completion.
- Future reward engine events.

### Testing Standards

Activity ports should follow existing testing expectations:

- Node regression coverage for logic.
- Playwright coverage for learner-facing UI changes.
- Stable selectors where needed.
- Viewport checks for required desktop and tablet targets.

### Viewport Standards

Activities should remain usable across:

- Tablet landscape.
- Tablet portrait.
- Mobile portrait.
- Laptop.

Activities should avoid:

- Unexpected horizontal scrolling.
- Overlapping controls.
- Clipped primary actions.
- Duplicate shell headers.
- Fixed-size content that breaks on smaller screens.

## Dashboard Interpretation Contract v1.0

Activity analytics storage remains unchanged during migration into SIRAASH. Detailed attempt analytics may continue to be collected for every activity.

Parent dashboard presentation is determined by activity metadata:

```js
{
  activityId: "...",
  dashboardViewType: "trialBreakdown"
}
```

Allowed values:

- `summaryWithCorrections`
- `trialBreakdown`

### summaryWithCorrections

Use for worksheet-style or functional-practice activities where parents primarily need:

- Session summary.
- Accuracy.
- Time.
- Hints.
- Corrections.
- Wrong answer review.

Detailed trial tables should not be shown by default.

Examples:

- Number Bridges.
- Shopping Cart.
- Arithmetic worksheets.
- Picture worksheets.
- Sequencing worksheets.
- Measurement worksheets.

### trialBreakdown

Use for activities where trial-by-trial timing and error patterns help interpretation.

Display:

- Session summary.
- Trial table.
- Reaction times.
- Trial outcomes.
- Stage progression.

Examples:

- Matrix Reasoning.
- Stroop.
- Direction Following.
- Schulte Table / Grid Vision.
- Pattern Memory.
- Future executive-function activities.

### Architecture Rule

The dashboard must not infer presentation from the existence of trials, timing fields, or worksheet metadata. It must read `dashboardViewType` from activity metadata and render the matching view.

Current platform assignments:

| Activity | dashboardViewType | Notes |
| --- | --- | --- |
| Number Bridges | `summaryWithCorrections` | Worksheet quiz summary with correction review. |
| Matrix Reasoning | `trialBreakdown` | Trial table remains useful for reasoning progression. |
| Attribute Explorer | `trialBreakdown` | Interim assignment until reviewed. |
| Future worksheet activities | `summaryWithCorrections` | Default for worksheet family unless an ADR says otherwise. |

Initial Activity Family interpretation guidance:

| ID | Activity | Suggested dashboardViewType |
| --- | --- | --- |
| `NB-ACT-001` | Stroop | `trialBreakdown` |
| `NB-ACT-002` | Directions | `trialBreakdown` |
| `NB-ACT-003` | Schulte Table | `trialBreakdown` |
| `NB-ACT-004` | Grid Vision | `trialBreakdown` |
| `NB-ACT-005` | Pattern Matching | `trialBreakdown` until reviewed |
| `NB-ACT-006` | Number Memory | `trialBreakdown` until reviewed |
| `NB-ACT-007` | Shopping Cart | `summaryWithCorrections` |
| `NB-ACT-008` | Neural Bonds | `summaryWithCorrections` until reviewed |

## Activity Registry Draft

| ID | Activity | Family | Porting Tier | Migration Status |
| --- | --- | --- | --- | --- |
| `NB-ACT-001` | Stroop | Executive Function & Cognitive Control | Tier 1 | Future port |
| `NB-ACT-002` | Directions | Executive Function & Cognitive Control | Tier 1 | Future port |
| `NB-ACT-003` | Schulte Table | Visual Search & Scanning | Tier 1 | Future port |
| `NB-ACT-004` | Grid Vision | Visual Search & Scanning | Tier 2 | Future port |
| `NB-ACT-005` | Pattern Matching | Pattern & Reasoning | Tier 2 | Future port |
| `NB-ACT-006` | Number Memory | Working Memory | Tier 2 | Future port |
| `NB-ACT-007` | Shopping Cart | Functional Life Simulation | Tier 3 | Future port |
| `NB-ACT-008` | Neural Bonds | Social & Relational | Tier 3 | Future port |

## Documentation Acceptance

This NB-000.06 artifact is complete when:

- The Activity Family is documented as separate from the Worksheet Family.
- Activity families, IDs, and names are captured.
- Porting priority is documented.
- Legacy-to-SIRAASH migration strategy is documented.
- Worksheet Family relationships are documented.
- Shared platform services are identified.
- Future refinement is captured without runtime implementation.

## Future Refinement Appendix

### NB-000.06.a Activity Family Progression Map

Future refinement should define how Activity Family experiences support learner progression across the following path:

```text
Attention
  |
  v
Executive Function
  |
  v
Working Memory
  |
  v
Reasoning
  |
  v
Functional Independence
```

This future map should clarify:

- Which activity families support each progression stage.
- Which activities act as entry points.
- Which activities bridge into Worksheet Family templates.
- Which metrics indicate readiness to move forward.
- Which scaffold fading patterns apply at each stage.

## Suggested Commit

```text
NB-000.06 Add activity architecture and migration roadmap
```
