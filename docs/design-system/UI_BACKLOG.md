# UI Backlog

Purpose: Capture design-system and UI templating work for NeuroBridge after the Core Architecture v1.1 freeze.

## Foundation

- Story ID: NB-100.1
- Title: SIRAASH splash screen
- Priority: High
- Status: In Progress
- Notes: First learner-facing design-system experience.

- Story ID: NB-100.1
- Title: Daily welcome message
- Priority: High
- Status: In Progress
- Notes: First login of the day learner greeting.

- Story ID: NB-100.1
- Title: Welcome back message
- Priority: High
- Status: In Progress
- Notes: Returning learner greeting.

## Activity Shell

- Story ID:
- Title: Shared activity shell template
- Priority: High
- Status: Backlog
- Notes: Common layout for game, worksheet, story, and assessment activities.

- Story ID:
- Title: Mobile/tablet responsive layout
- Priority: High
- Status: Backlog
- Notes: Mobile-first, tablet-primary, no hover dependency.

- Story ID:
- Title: Activity header component
- Priority: Medium
- Status: Backlog
- Notes: Quiet learner header with minimal progress context.

- Story ID:
- Title: Answer area component
- Priority: High
- Status: Backlog
- Notes: Large, touch-friendly answer controls.

## Activity Tiles

- Story ID: NB-101.1
- Title: Activity Tile Framework Implementation
- Priority: High
- Status: Ready
- Notes: Implement the frozen Activity Tile Contract, Learner Naming Standard, Tile Status values, and Tile Layout Standard in the SIRAASH Activity Hub.

## Help And Scaffolds

- Story ID:
- Title: Need Help area
- Priority: High
- Status: Backlog
- Notes: Shared help entry and scaffold display area.

- Story ID:
- Title: Need Help button
- Priority: High
- Status: Backlog
- Notes: Learner-safe scaffold entry point.

- Story ID:
- Title: Scaffold display area
- Priority: High
- Status: Backlog
- Notes: Attention cue, attribute cue, choice reduction, and model answer support.

- Story ID:
- Title: Scaffold fading UI states
- Priority: Medium
- Status: Backlog
- Notes: Support progression from explicit help to subtle cues.

## Activity Templates

- Story ID: NB-UI-002
- Title: Golden Reference Screens
- Priority: P1
- Status: Done
- Notes: Defined visual Golden Reference Screen expectations for Quiz, Worksheet, and Activity UI families, including region hierarchy, visual priorities, validation checklist, and usage rule. See `docs/design-system/GOLDEN_REFERENCE_SCREENS.md`.

- Story ID: NB-COMP-001
- Title: Shared Activity Components Standard
- Priority: P1
- Status: Done
- Notes: Defined the shared activity component catalog, platform/activity ownership model, responsive expectations, visual consistency rules, and future component candidates. See `docs/design-system/SHARED_ACTIVITY_COMPONENTS.md`.

- Story ID: NB-FB-001
- Title: Shared Feedback and Completion Timing Standard
- Priority: P1
- Status: Done
- Notes: Defined shared NeuroBridge feedback categories, family-specific success dwell timing, question transition behavior, completion persistence, approved learner-facing language, and feedback guardrails. See `docs/design-system/FEEDBACK_AND_TIMING_STANDARD.md`.

- Story ID: NB-UI-001
- Title: Activity UI Family Classification
- Priority: P1
- Status: Done
- Notes: Defined the approved NeuroBridge activity UI families for Quiz, Worksheet, Activity, Story, and Assessment templates. New activities must declare a UI family before implementation begins. See `docs/design-system/ACTIVITY_UI_FAMILIES.md`.

## Platform UI Backlog

- Story ID: NB-UI-003
- Title: Activity Hub Tile Audit
- Status: Backlog
- Goal: Review all learner activity tiles against the Activity Tile Framework.
- Scope: Activity title consistency; activity description consistency; icon usage; card sizing; card spacing; visual hierarchy; launch affordance consistency.
- Current Activities: Number Bridges; Matching Worksheet; Attribute Matching; Attribute Explorer; Schulte Table; Pattern Memory.
- Outcome: Unified learner activity hub experience.

- Story ID: NB-UI-004
- Title: Learner Recent Activity Experience
- Status: Backlog
- Goal: Refine the learner-facing recent activity area.
- Scope: Recent activity card layout; last played activity; accuracy summary; friendly progress indicators; Continue activity action; Try Again action.
- Rules: Learner-focused; avoid parent analytics overload; positive reinforcement.
- Outcome: A meaningful learner home experience.

- Story ID: NB-UI-005
- Title: Parent Workspace UI Standard
- Status: Backlog
- Goal: Standardize parent-facing workspace screens.
- Scope: Dashboard; Practice Lab; Administration; Activity Settings; Analytics Summary.
- Rules: Parent workflow focused; consistent navigation; consistent card structure.
- Outcome: Reusable parent workspace architecture.

- Story ID: NB-UI-006
- Title: Parent Controls Pattern
- Status: Backlog
- Goal: Define reusable parent-control patterns across activities.
- Examples: Question Count; Difficulty; Number Range; Hint Toggle; Scaffold Toggle; Auto Progression; Practice Mode; Official Mode.
- Rules: Consistent control placement; consistent labels; consistent save behavior.
- Outcome: Activities reuse the same parent-control model.

- Story ID: NB-UI-007
- Title: Dashboard Metrics Card Standard
- Status: Backlog
- Goal: Standardize dashboard analytics cards.
- Scope: Accuracy Card; Time Card; Hint Usage Card; Correction Card; Skill Evidence Card; Cognitive Snapshot Card.
- Rules: Consistent sizing; consistent terminology; shared visual language.
- Outcome: Unified dashboard analytics presentation.

- Story ID: NB-UI-008
- Title: Responsive Layout Review
- Status: Backlog
- Goal: Validate all activity families against desktop and tablet layouts.
- Scope: Quiz Family; Worksheet Family; Activity Family.
- Review: Overlap; clipping; overflow; touch targets; region hierarchy.
- Outcome: Consistent multi-device experience.

- Story ID: NB-UI-009
- Title: Accessibility and Neurodiversity Review
- Status: Backlog
- Goal: Review UI patterns against NeuroBridge learner principles.
- Scope: Visual clutter; cognitive load; feedback visibility; transition timing; touch target sizing; ASD-friendly interaction patterns.
- Outcome: Formal NeuroBridge accessibility review.

## Legacy Activity Template Backlog

- Story ID:
- Title: GRID activity template
- Priority: High
- Status: Backlog
- Notes: Matrix, pattern grid, and visual search grid.

- Story ID:
- Title: SELECT activity template
- Priority: High
- Status: Backlog
- Notes: Tap or choose one option.

- Story ID:
- Title: MATCH activity template
- Priority: Medium
- Status: Backlog
- Notes: Pair related items.

- Story ID:
- Title: ORDER activity template
- Priority: Medium
- Status: Backlog
- Notes: Sequence items or steps.

- Story ID:
- Title: MEASURE activity template
- Priority: Medium
- Status: Backlog
- Notes: Compare size, quantity, distance, or other measurable attributes.

- Story ID:
- Title: WORD_PROBLEM activity template
- Priority: Medium
- Status: Backlog
- Notes: Language and numeracy problem solving.

- Story ID:
- Title: CONSTRUCT activity template
- Priority: Medium
- Status: Backlog
- Notes: Build, assemble, draw, arrange, or create a response.

- Story ID:
- Title: SOCIAL_STORY activity template
- Priority: Medium
- Status: Backlog
- Notes: Guided social or daily living scenario.

- Story ID:
- Title: ASSESSMENT activity template
- Priority: High
- Status: Backlog
- Notes: Baseline or structured assessment activity.

## Worksheets And Print

- Story ID: NB-WS-003
- Title: Worksheet Activity Template V1
- Priority: P1
- Status: Done
- Notes: Defined the canonical Worksheet Activity Template V1 with global header, instruction, workspace, support, feedback, and completion regions plus layout guardrails for worksheet-family activities. See `docs/design-system/WORKSHEET_ACTIVITY_TEMPLATE.md`.

- Story ID: NB-101.4.5.1
- Title: Worksheet Architecture Specification
- Priority: High
- Status: Design
- Notes: Defines the reusable worksheet shell, worksheet zones, template registry, shared services, responsive behavior, and future celebration zone. See `docs/design-system/WORKSHEET_ARCHITECTURE.md`.

- Story ID: NB-101.4.5.2
- Title: Worksheet Shell Implementation
- Priority: High
- Status: Done
- Notes: Implemented `createWorksheetShell(config)` with instruction, activity, help, feedback, and celebration placeholder zones in `js/worksheetShell.js`.

- Story ID: NB-STD-004
- Title: Shared Worksheet Result Component Standard
- Priority: P1
- Status: Done
- Notes: Defined Shared Worksheet Result Component v1.0, clarified activity/template ownership, documented required result regions, and added `renderWorksheetResultScreen(model)` as the lightweight runtime helper. Number Bridges is the current reference.

- Story ID: NB-PM-RESULT-001
- Title: Migrate Pattern Memory to shared worksheet result component
- Priority: P1
- Status: Backlog
- Notes: Replace the custom Pattern Memory completion/result screen with Shared Worksheet Result Component v1.0 without gameplay or analytics changes.

- Story ID: NB-AM-RESULT-001
- Title: Migrate Attribute Matching to shared worksheet result component
- Priority: P1
- Status: Backlog
- Notes: Move activity-specific completion layout/header content into the shared worksheet result component contract without gameplay or analytics changes.

- Story ID: NB-AE-RESULT-001
- Title: Migrate Attribute Explorer to shared worksheet result component if still not aligned
- Priority: P2
- Status: Backlog
- Notes: Review Attribute Explorer result screen alignment and migrate only if it still diverges from Shared Worksheet Result Component v1.0.

- Story ID: NB-WS-001.1
- Title: Matching Worksheet V1
- Priority: P1
- Status: Done
- Notes: Implemented the first worksheet activity with exact picture matching, tap-to-select pairs, shared worksheet shell zones, progressive hints, shared SIRAASH feedback, inactive celebration placeholder, and browser viewport smoke coverage.

- Story ID: NB-WS-001.2
- Title: Attribute Matching Worksheet
- Priority: P1
- Status: Done
- Notes: Implemented single-select attribute matching with deterministic color, shape, and size prompts using the worksheet shell, shared SIRAASH feedback, progressive hints, inactive celebration placeholder, Node regression tests, and browser viewport smoke coverage.

- Story ID: NB-WS-002
- Title: Worksheet Activity Layout Guardrails
- Priority: P1
- Status: Done
- Notes: Added worksheet activity layout guardrails to `docs/design-system/ACTIVITY_ARCHITECTURE.md` and reinforced Pattern Memory Copy Mode regression coverage with bounding-box checks for internal scroll, clipping, panel headings, feedback visibility, and horizontal overflow.

- Story ID: NB-110
- Title: Printable worksheet support
- Priority: Medium
- Status: Backlog
- Notes: Matching, fill-in-the-blanks, measurement, ordering, and worksheet mode.

- Story ID:
- Title: Printable mode
- Priority: Medium
- Status: Backlog
- Notes: Print-friendly rendering for selected activities.

## Localization

- Story ID:
- Title: Regional language readiness
- Priority: Medium
- Status: Backlog
- Notes: Support Tamil, Hindi, and other regional languages later.

- Story ID:
- Title: Text expansion checks
- Priority: Medium
- Status: Backlog
- Notes: Ensure translated labels do not overflow controls.

## Parent Experience

- Story ID:
- Title: Parent controls separation
- Priority: High
- Status: Backlog
- Notes: Keep learner UI calm while parent controls remain available separately.

- Story ID:
- Title: Parent controls
- Priority: Medium
- Status: Backlog
- Notes: Configuration, preview, scaffold settings, and session context.

- Story ID:
- Title: Parent preview of learner activity
- Priority: Medium
- Status: Backlog
- Notes: Let parent inspect activities before assigning or testing.

## Accessibility And Touch

- Story ID:
- Title: Accessibility and touch standards
- Priority: High
- Status: Backlog
- Notes: Minimum 44px touch targets, preferred 56px+, contrast, focus states.

- Story ID:
- Title: Focus and selected states
- Priority: High
- Status: Backlog
- Notes: Clear selected, disabled, and keyboard focus states.

- Story ID:
- Title: Reduced visual noise mode
- Priority: Medium
- Status: Backlog
- Notes: Calm learner view with minimal distractors.

## Motion And Audio

- Story ID: NB-100.9
- Title: Motion/animation standards
- Priority: Medium
- Status: Backlog
- Notes: Standardize glow, blink, fly-to-cart, transitions, and reduced-motion options.

- Story ID: NB-100.10
- Title: Optional audio environment
- Priority: Medium
- Status: Backlog
- Notes: Parent-controlled rhythmic or calm background audio.
