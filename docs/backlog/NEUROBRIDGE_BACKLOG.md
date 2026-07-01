# NeuroBridge Backlog

This file is the lightweight source of truth for deferred NeuroBridge work.

- Codex may update only feature IDs explicitly mentioned in a handover.
- Do not delete backlog history.
- Move items to Done only after implementation and manual acceptance.

## Ready

Items frozen enough for Codex handover.



### NB-UI-005 NeuroBridge Activity Surface Contract

Status: Done
Description: Created the canonical NeuroBridge Activity Surface Contract for learner-facing activity screens.

### NB-UI-006 Shared Activity Feedback Component

Status: Done
Description: Created a unified shared feedback component for correct and mistake selections.

### NB-UI-006.1 Migrate Directions to Shared Feedback Component

Status: Done
Description: Moved Directions to the shared activity feedback component through the shared activity shell.

### NB-UI-007 Shared Completion Surface

Status: Done
Description: Created a reusable shared completion surface for learner activities.

### NB-UI-007.1 Migrate Directions to Shared Completion Surface

Status: Done
Description: Moved Directions to the shared completion surface through the shared activity shell.

### DIR-004 Session Flow

Status: Ready
Description: Add the learner session flow that drives Directions completion with platform-owned completion UI.

### NB-UI-007.2 Migrate Schulte to Shared Completion Surface

Status: Backlog
Description: Move Schulte to the shared completion surface after Directions validates the platform pattern.

### ENGINEERING-MANIFEST-002 Platform First Principle Update

Status: Done
Description: Added the Platform First Principle to `docs/ENGINEERING_MANIFEST.md` to guide platform-vs-activity implementation decisions.

### DIR-003.2 Directions Shell Compliance Fix

Status: Ready
Description: Fix Directions layout drift and ensure visual alignment with the visual compliance standard.

### NB-UX-003.1 Migrate Directions to Choice Activity Family

Status: Ready
Description: Migrate the Directions activity to use the standard SIRAASH Choice Activity Family.

### NB-UX-004.2 Add Outcome Pipeline to Runtime Activity Families

Status: Ready
Description: Integrate the Activity Outcome Pipeline into the runtime Activity Family controller factories.

### NB-UX-005.1 Integrate Learning Session Controller into Runtime Activity Families

Status: Ready
Description: Integrate the Learning Session Controller into the runtime Activity Family controller factories.

### NB-UX-006 Celebration Engine

Status: Ready
Description: Create a reusable celebration engine for milestone moments.

### NB-WS-001.2 Attribute Matching Worksheet V1

Status: Ready
Activity docs: `docs/activities/matching-worksheets/`

## Backlog

Valid ideas that are not ready for implementation yet.

### NB-UI-003.1 Activity Shell Compliance Audit

Priority: P3
Status: Backlog
Goal: Run a visual compliance check across all implemented games to ensure they follow the newly defined hierarchy and naming guidelines.

### NB-PARENT-002 Parent Insight Dashboard

Priority: P2
Status: Backlog

Goal:
Evolve the Parent Dashboard from a recent-session summary into a parent-decision-oriented insight dashboard.

Rationale:
Current dashboard is functional but not yet insight-rich. It shows sessions, accuracy, speed, peak level, best score and recent sessions. These are useful, but future dashboard refinements should better answer:
- Is the learner improving?
- Which activities were practiced recently?
- Which activities are becoming easy or difficult?
- Are hints and corrections reducing over time?
- Which activities are being neglected?
- What should the parent offer next?

Planned Sub-items:
- NB-PARENT-002.1 Activity Mix
- NB-PARENT-002.2 Learning Trends
- NB-PARENT-002.3 Cognitive Snapshot
- NB-PARENT-002.4 Improvement Signals
- NB-PARENT-002.5 Recommended Next Activities
- NB-PARENT-002.6 Learner Streaks & Consistency

Notes:
Do not implement immediately. Revisit after more usage data is available from Number Bridges, Schulte Family, Matching Worksheets and future Directions activity.

### SCH-001.1 Square Grid Size Expansion Contract

Priority: Unassigned  
Status: Backlog  
Depends On:  
- `SCH-001`
Notes:  
`SCH-TEST-001` includes V1 representability for 4x4, 5x5, and 6x6 square boards, while `SCH-001` is intentionally limited to the 3x3 core grid engine. Promote this item when a later Schulte packet is ready to expand grid-size support without changing the SCH-001 scope.

### NB-UI-001 Activity Tile Visual Refresh

Priority: P2  
Status: Backlog  
Notes:  
- Improve professional appearance of activity tiles later.
- Consider shared tile component, icons, badges, progress indicators, hover/focus states, and mobile-friendly layout.
- Do not implement now.

### NB-UX-001 Learner Experience Constitution

Status: Done
Description: Created the canonical learner experience constitution for NeuroBridge learner-facing activities.

### NB-UX-002 Activity UI Family Framework

Status: Done
Description: Froze the canonical Activity UI Family Framework for learner-facing activities.



### NB-UX-004 Activity Success Indicator

Status: Done
Description: Created a reusable surface-scoped success indicator for learner-facing activities.



### NB-UX-007 Adaptive Timing Engine

Status: Ready
Description: Add a shared adaptive timing engine for learner-facing transitions and feedback.

### NB-UX-008 Executive Scaffold Engine

Status: Ready
Description: Define reusable executive control scaffolds for learner recovery actions.

### NB-UX-009 Learning Support Panel

Status: Ready
Description: Create a reusable shared Learning Support Panel for Question & Answer activities.

### NB-DOC-002 Design System README

Status: Done
Description: Created the canonical entry point and navigation guide for the NeuroBridge Design System.

### NB-DOC-001 Design System Consolidation

Priority: Low
Milestone: Post V1
Status: Backlog
Description: Consolidate the design-system documentation after stable cross-activity reuse patterns are confirmed.

### NB-UI-002 Completion Screen Persistence Audit

Priority: Unassigned
Status: Backlog
Notes:
- Audit existing NeuroBridge activities for completion/result screens that may need persistent in-frame summaries after the NB-ACTIVITY-STANDARD-001 completion persistence rule.
- Completion screens should remain visible until Play Again, Return Home, Continue, or an applicable parent/dashboard action.
- Do not redesign activity result screens in this audit unless promoted into specific implementation packets.

### NB-QA-001 Playwright End-to-End Test Foundation

Priority: P2
Status: Backlog
Goal:
Create a Playwright-based E2E automation foundation for NeuroBridge learner journeys.
Initial coverage:
- Login / learner landing page
- Activity tile launch
- Schulte Table golden path
- Ascending phase
- Descending phase
- Listen & Find phase
- Completion summary persistence
- Play Again action
- Return Home action
Why:
- Manual testing caught important learner-flow issues in Schulte, including mode exposure gaps, prompt synchronization mismatch, Listen & Find early completion, and completion summary disappearing.
- Playwright should automate these checks for future regression protection.
Out of scope:
- Implementing Playwright tests now
- Changing existing test runners
- Modifying app code

### SCH-004.2.1 Practice Lab Mode Selector

Priority: Unassigned  
Status: Backlog  
Depends On:  
- `SCH-004.2`
Notes:  
- Manual Ascending / Descending selection may still be useful for parent experimentation or advanced testing.
- Keep this out of the learner path.
- Do not implement Practice Lab now.

### SCH-005.1A Memory Mode Progression Review

Priority: Unassigned  
Status: Backlog  
Depends On:  
- `SCH-005`
Notes:  
- Requested during backlog audit as `SCH-005.1 Memory Mode Progression Review`.
- `SCH-005.1` is already assigned to the completed Instruction Simplification and Prompt Sync Fix packet, so this follow-up is recorded as `SCH-005.1A` to avoid duplicate IDs.
- Review how Memory Mode should fit into longer-term Learn -> Practice -> Memory -> Mastery progression before adding progression or analytics behavior.
- Do not implement now.

### SCH-006.1 Listen & Find Random Prompt Variant

Priority: Unassigned  
Status: Backlog  
Depends On:  
- `SCH-006`
Notes:  
- Random spoken target prompts are deferred until after ordered Listen & Find is implemented and validated.
- Do not implement in SCH-006 ordered mode.

### SCH-006.2 Listen & Find Exposure Rule Documentation

Priority: Unassigned  
Status: Backlog  
Depends On:  
- `SCH-006`
Notes:  
- Document when Listen & Find appears in the learner path before expanding exposure.
- Current SCH-006 preparation rule: learner path is system-controlled, session uses 2 boards, prompt order is ordered 1->9 first, random prompts are deferred, and speech recognition is out of scope.
- Do not implement behavior in this documentation item.

### NB-ARCH-001 Adaptive Progression Framework

Priority: Unassigned  
Status: Backlog  
Notes:  
- Define a shared adaptive progression framework before connecting individual activity mastery, fluency, or level-unlock rules.
- Keep separate from SCH-007 analytics implementation until architecture is explicitly approved.
- Do not implement now.

### NB-ARCH-004.3 Cognitive Domain Taxonomy Freeze

Priority: P1
Status: Backlog
Depends On:
- `NB-ARCH-004`
Notes:
- Previously recorded as `NB-ARCH-004.1`, then `NB-ARCH-004.2`, but those IDs are now assigned to Progression Engine Generalization and Schulte Skill Mapping V1.
- Freeze the shared cognitive domain, skill, and sub-skill taxonomy before runtime skill evidence mapping is implemented across activities.
- Use the activity skill mapping contract as input, but do not finalize taxonomy names during NB-ARCH-004.
- Do not implement now.

### NB-BL-004 Master Auto Progression

Status: Backlog  
Area: Number Bridges  
Reason:  
Master Mode should first be used manually so real learner data can guide progression thresholds.  
Trigger:  
Pick up after 2-4 weeks of Addition/Subtraction Master Mode analytics.

### NB-BL-005 Adaptive Difficulty Engine

Status: Future  
Area: Number Bridges / Shared Platform  
Reason:  
Adaptive difficulty is premature until multiple activities share stable analytics.  
Trigger:  
Pick up after Number Bridges, Schulte, Stroop, and other activities produce comparable analytics.

### NB-BL-006 AI-Assisted Development Handover Quality Framework

Status: Backlog  
Area: AI Project Template  
Reason:  
Number Bridges review showed that Codex can implement requested changes correctly while unintentionally affecting adjacent behavior. Future handovers need stronger scope guards, forbidden changes, regression matrices, and completion reports.  
Trigger:  
Pick up when creating the reusable AI-assisted development project template.

### NB-CORE-007 Reusable Progression Engine

Priority: P1
Status: Deferred
Depends On:
- `NB-ARCH-004.1`
Notes:
- Extract the Schulte mastery/progression framework into a platform-level progression service when multiple activity families need common trend storage, evaluation structure, and progression state.
- Activity families should keep configurable mastery rules while sharing common progression evidence and status contracts.
- Do not implement now.

## Deferred Until Learner Ready

Items intentionally postponed until Adarsh reaches the required learning stage.

### NB-BL-001 Division L1-L9 Progression

Status: Deferred  
Area: Number Bridges  
Reason:  
Adarsh has not yet reached the stage where division progression is needed. Division should be introduced only after multiplication fluency and fact-family understanding are stronger.  
Trigger:  
Pick up after stable Multiplication L1-L9 usage.

### NB-BL-002 Multiplication Master Mode

Status: Deferred  
Area: Number Bridges  
Reason:  
Addition and Subtraction Master Mode provide immediate value now. Multiplication Master should wait until Multiplication L1-L9 is stable.  
Trigger:  
Pick up after Multiplication L1-L9 accuracy and confidence are stable.

### NB-BL-003 Division Master Mode

Status: Deferred  
Area: Number Bridges  
Reason:  
Division Master depends on Division progression and should not be implemented before Division L1-L9.  
Trigger:  
Pick up after Division L1-L9 progression is introduced and stable.

## Deferred

Items explicitly parked until promoted.

### SCH-008.2 Honeycomb Layout

Status: Deferred
Note: Previously recorded as `SCH-008`, then `SCH-008.1`, but those IDs are now assigned to Level 2 Square Grid Expansion and Mastery and Progression Framework. Honeycomb remains deferred and out of scope for both packets.

### SCH-009 Multiples Mode

Status: Deferred

### SCH-010 Peripheral Mode

Status: Deferred

### SCH-011 Gorbov Schulte

Status: Deferred

### SCH-012 Adaptive Fluency Engine Integration

Status: Deferred

### SCH-013 Practice Lab

Status: Deferred

## Done

Completed feature IDs and closure notes.

### NB-UX-005 Learning Session Controller

Status: Done

Closure note: Implemented the platform-owned `learningSessionController.js` responsible for orchestrating the learner journey. It manages session state (rounds, levels, counts), progression flow, and persists the completion surface display. It features input guards to reject submissions when the session is unstarted, completed, or busy. Added comprehensive tests in `js/tests/learningSessionController.test.js` validating lifecycles, progression, and guards, with a runner script integrated into the node suite.

### NB-UX-004.1 Activity Outcome Pipeline

Status: Done

Closure note: Implemented the reusable `activityOutcomePipeline.js` orchestrating feedback presentation, success tick indicators (via the activity success indicator), delays, busy state protections, and next-step execution callbacks. It supports immediate, surface, and manual execution modes, and throws explicit errors for invalid modes. Added unit tests in `js/tests/activityOutcomePipeline.test.js` validating the mode behaviors, and a runner command to integrate into the Node test suite.

### NB-UX-003 Runtime Activity Family APIs

Status: Done

Closure note: Implemented standard reusable runtime Activity Family controllers (`baseActivityFamily`, `choiceActivityFamily`, `gridActivityFamily`, and `questionAnswerActivityFamily`). These factories establish platform-owned visual stability, centered and scaling layouts, and delegate feedback and completion flows directly through existing shell and feedback/completion APIs to avoid duplicate instances. Added a comprehensive test suite in `js/tests/activityFamilies.test.js` verifying lifecycle, rendering, feedback, and specialization constraints.

### NB-UI-004.1 Migrate Directions to Shared Activity Shell

Status: Done

Closure note: Migrated the Directions activity to use the standard SIRAASH `createActivityShell` platform component. Refactored `index.html` to eliminate all hardcoded duplicate header/navigation HTML blocks, leaving only a clean `#directions-root` container. Refactored `game.js` to instantiate the activity shell, removing custom navigation listeners, margins, and manual layout overrides. All 5 Playwright UI viewport and feedback smoke tests pass successfully.

### NB-UI-004 Shared Activity Shell Foundation

Status: Done

Closure note: Created `js/activityShell.js` exposing `createActivityShell(config)` to programmatically assemble the visual shell structure. The shell foundation owns header rendering, standard Home button navigation, visually dominant and updatable instruction prompt headers, and reserved feedback zones. Added a comprehensive test suite in `js/tests/activityShell.test.js` validating structural zones, single title display, exclusion of dashboard links, prompt updating, and optional help zone pruning.

### NB-UI-003 Activity Shell Visual Compliance Standard

Status: Done

Closure note: Defined and documented the SIRAASH learner visual hierarchy, activity name single-display rule, Home navigation standard, feedback non-obscuring area standard, collapse of empty optional help regions, and visual task area dominance rules across all NeuroBridge UI families.

### DIR-001 Core Direction Engine

Status: Done

Closure note: Implemented the reusable Directions game framework, mounted inside SIRAASH worksheet shell with four choice buttons showing arrow icons and text labels, registered Directions in gameRegistry.js/constants.js, and verified with unit and UI Playwright tests.

### DIR-002 Direction Validation

Status: Done

Closure note: Added `validateDirection` pure function, `selectDirection` method on the game instance, and `lastResult` state field. Click handlers wired to each choice button stamp `data-result`/`data-selected` on the grid for test observability. Unit tests cover correct, incorrect, all-four-directions matrix, and state recording. Playwright click smoke test confirms validation result without layout regression.

### DIR-003 Feedback Engine Integration

Status: Done

Closure note: Added `DIRECTIONS_FEEDBACK` constants, `feedbackState` field to game engine, and `getFeedbackState()` method. Click handlers now call `shell.showFeedback('success')` for correct and `shell.showFeedback('mistake')` plus a 900ms orange-pulse class swap on the tapped card for wrong selections. No harsh red or error markers used. Unit tests verify correct/wrong feedback state, null before selection, and state replacement. Playwright tests verify success banner, mistake banner class, and absence of duplicate feedback elements.

### DIR-003.1 Directions Layout and Feedback Standard Compliance

Status: Done

Closure note: Brought Directions UI and feedback into compliance with NeuroBridge activity layout and feedback standards. Removed repeated title "Directions" in the body. Set the worksheet instruction title to the active direction prompt ("Tap UP/DOWN/LEFT/RIGHT") and instructions to "Find the arrow pointing in this direction". Enabled full-width single-column grid-cols-1 main layout and disabled/hid empty hints panel to center active task area and avoid empty spaces. Increased card height to `min-h-[8rem]`, gap to `gap-6` and maximum width to `max-w-md` for larger, high-contrast, ASD-friendly touch/click targets. Verified layout, visibility, and feedback banners through updated Playwright smoke tests.

### ENGINEERING-MANIFEST-001 Engineering Manifest

Status: Done

Closure note: Created docs/ENGINEERING_MANIFEST.md to serve as the single entry-point navigation guide for all NeuroBridge engineering work, mapping philosophies, sequence orders, architectures, and repository zones.

### NB-STD-006 Codex Context Inheritance Standard

Status: Done

Closure note: Created docs/CODEX_CONTEXT_PREFIX.md to serve as the compact inherited context prefix referenced by future packets to reduce manual document inclusion overhead.

### NB-STD-005 NeuroBridge Activity Bootstrap Standard

Status: Done

Closure note: Created docs/NB-STD-005_ACTIVITY_BOOTSTRAP_STANDARD.md to define the standardized checklists, maturity levels, lifecycle gates, and planning runway standards for every new NeuroBridge activity.

### NB-STD-004 NeuroBridge Implementation Standard Stack

Status: Done

Closure note: Created docs/NB-STD-004_IMPLEMENTATION_STANDARD_STACK.md to serve as the unified, authoritative stack of mandatory platform, process, worksheet, and architectural standards for NeuroBridge packets.

### DIR-IMPLEMENTATION-PLAN-001 Directions V1 Implementation Plan

Status: Done

Closure note: Created docs/DIR-IMPLEMENTATION-PLAN-001.md defining the V1 packet roadmap, dependency matrix, deferred features list, and transition lessons adopted from Schulte Table.

### DIR-TEST-001 Directions V1 Test Plan

Status: Done

Closure note: Created docs/DIR-TEST-001.md defining the unit, UI, scaffold, analytics, accessibility, and manual observation checklists for Directions V1 verification.

### DIR-FREEZE-001 Directions Activity Freeze

Status: Done

Closure note: Created docs/DIR-FREEZE-001.md specifying the Directions activity family's spatial-direction learning model, levels, scaffolds, feedback triggers, and clinical metrics.

### GAME-CATALOG-001 Schulte Table Catalog Entry

Status: Done

Closure note: Updated GAME_CATALOG.md with the Schulte Table entry mapping its game ID, family, primary domain, skills, cognitive targets, current levels, current modes, architecture references, and status.

### NB-AE-002 Attribute Explorer Result Flow and Feedback Refinement

Status: Done

Closure note: Aligned Attribute Explorer with the NeuroBridge worksheet result pattern by adding an in-activity result screen with worksheet metrics and Try Again/Home actions, removing the duplicate success tick indicator, and increasing correct-answer dwell time to 1300ms without changing attribute generation, hint logic, dashboard analytics, parent controls, or progression rules.

### NB-ARCH-004 Activity Skill Mapping Contract

Status: Done
Depends On:
- `NB-STD-001`
- `NB-ACTIVITY-STANDARD-001`
- `NB-STD-002-CODEX_PACKET_TEMPLATE`
- `NB-STD-003-CODEX_COMPLETION_TEMPLATE`

Closure note: Created the NeuroBridge-wide activity skill mapping contract defining skill evidence by activity, mode, level, progression stage, and scaffold state without code changes, Schulte analytics retrofits, parent dashboard changes, or taxonomy finalization.

### NB-ARCH-004.1 Progression Engine Generalization

Status: Done
Depends On:
- `NB-ARCH-004`
- `SCH-008.1`

Closure note: Documented how the Schulte mastery/progression framework can later become a reusable NeuroBridge progression service, including common trend storage, evaluation structure, progression state, candidate consumers, and explicit exclusions for platform extraction, Schulte refactoring, dashboard UI, and automatic promotion.

### NB-ARCH-004.2 Schulte Skill Mapping V1

Status: Done
Depends On:
- `NB-ARCH-004`
- `SCH-FREEZE-001`

Closure note: Created the first concrete NeuroBridge activity skill mapping reference for Schulte Table Levels 1 and 2, documenting mode-specific domain, primary skill, sub-skill, evidence weight, cognitive load, future mapping notes, analytics implications, and out-of-scope boundaries without code, analytics, dashboard, progression, taxonomy-freeze, or parent UI changes.

### SCH-001 Core Grid Engine

Priority: P1  
Status: Done  
Depends On:  
- `SCH-FREEZE-001`
- `SCH-TEST-001`
- `SCH-IMPLEMENTATION-PLAN-001`

Closure note: Implemented 3x3 Schulte core grid engine with randomized board generation, number placement, cell selection guards, board completion detection, renderable grid markup, and focused unit tests.

### SCH-002 Ascending Progression

Priority: P1  
Status: Done  
Depends On:  
- `SCH-001`

Closure note: Implemented ascending 1->9 validation, two-board session structure, board progression, session completion, and focused unit tests without adding feedback, audio, memory, or analytics behavior.

### SCH-003 Feedback Engine Integration

Priority: P1  
Status: Done  
Depends On:  
- `SCH-001`
- `SCH-002`

Closure note: Added Schulte feedback event state and hooks for correct click feedback, wrong-selection orange pulse, perfect-board success, and board/session celebration exposure without adding sound assets or audio mode behavior.

### SCH-003.1 Add Schulte Tile and Launch Route

Status: Done  
Depends On:  
- `SCH-001`
- `SCH-002`
- `SCH-003`

Closure note: Added available Grid Vision tile to the post-login activity hub, wired it to the `schulte` route, added a playable Schulte iframe page for the existing 3x3 ascending session, and covered tile launch markup with focused tests.

### SCH-004 Descending Progression

Priority: P2  
Status: Done  
Depends On:  
- `SCH-002`

Closure note: Implemented descending 9->1 validation for 3x3 boards, preserved two-board session progression and completion behavior, preserved feedback hooks, and added focused descending tests.

### SCH-004.1 Descending Mode Exposure

Status: Done  
Depends On:  
- `SCH-004`

Closure note: Added manual learner-facing mode controls to the Schulte activity page so existing descending mode can be selected and played for testing, with focused browser coverage for descending launch and completion.

### SCH-004.2 Automatic Ascending-to-Descending Flow

Status: Done  
Depends On:  
- `SCH-004`

Closure note: Updated the learner-facing Schulte flow to start in Ascending, automatically transition to Descending after two ascending boards, start Descending at Find 9, and show final completion only after both ascending and descending sessions complete.

### SCH-004.3 Smooth Ascending-to-Descending Transition Message

Status: Done  
Depends On:  
- `SCH-004.2`

Closure note: Added a gentle transition panel after Ascending Board 2 with the required descending guidance, plus a Continue action before starting Descending at Find 9.

### SCH-005 Memory Mode

Priority: P2  
Status: Done  
Depends On:  
- `SCH-002`

Closure note: Implemented Memory Mode for the learner-facing Ascending -> Descending Schulte flow so selected cells no longer remain visually highlighted while internal validation, feedback hooks, transition messaging, and completion behavior remain intact.

### SCH-005.1 Instruction Simplification and Prompt Sync Fix

Status: Done  
Depends On:  
- `SCH-005`

Closure note: Removed the duplicate header Find badge and made the center learner prompt derive from the active Schulte session state so Ascending and Descending prompts stay synchronized after correct selections, wrong selections, and board transitions.

### SCH-005.2 Grid Vision / Schulte Table Terminology Alignment

Status: Done  
Depends On:  
- `SCH-005.1`

Closure note: Kept Grid Vision as the broader activity family name while aligning learner-facing activity labels, shell title, activity header, completion message, and tile subtitle to Schulte Table without changing routes, IDs, or internal architecture names.

### SCH-005.2.1 Landing Page Tile Terminology Fix

Status: Done  
Depends On:  
- `SCH-005.2`

Closure note: Synced the learner landing page Schulte tile so it renders both Grid Vision and Schulte Table, including the accessible launch label, while preserving the existing route, IDs, and internal architecture names.

### SCH-006 Listen & Find Ordered Mode

Priority: P2  
Status: Done  
Depends On:  
- `SCH-002`

Closure note: Implemented learner-path Listen & Find Ordered Mode after the existing Memory Mode ascending and descending progression, using two ordered 1->9 visual-prompt boards with the existing grid, validation, feedback, and completion flow. Reusable TTS/audio support was deferred to `SCH-006.3`.

### SCH-006.3 Reusable Listen & Find TTS Support

Priority: Unassigned
Status: Done
Depends On:
- `SCH-006`

Closure note: Added reusable browser speech synthesis support for Listen & Find prompts, wired Schulte Table to speak each ordered target during Listen & Find only, and preserved visual-only behavior when speech synthesis is unavailable.

### SCH-006.4 Listen & Find Flow Activation Fix

Status: Done  
Depends On:  
- `SCH-006`

Closure note: Fixed Listen & Find flow activation so the final completion screen is gated to a completed Listen & Find session, the active mode label is tied to the current session state, and entering Listen & Find starts a fresh Board 1 / 2 at Find 1.

### SCH-006.5 Listen & Find Board 2 Reset Fix

Status: Done
Depends On:
- `SCH-006`

Closure note: Hardened Listen & Find final-completion gating so completion requires all Listen & Find boards to be complete, and added regression coverage proving Board 2 starts fresh at Find 1 with a playable grid before final completion appears.

### SCH-007 Analytics Foundation

Priority: P2
Status: Done
Depends On:
- `SCH-002`

Closure note: Added foundational Schulte Table learner-flow analytics collection and shell persistence payloads covering activity name, session timestamp, mode, boards completed, correct and incorrect selections, accuracy percentage, duration seconds, and completion status without adding learner-facing analytics screens, parent dashboard changes, or adaptive progression.

### SCH-007.1 Completion Summary Screen

Status: Done
Depends On:
- `SCH-007`

Closure note: Added learner-facing Schulte completion summary using SCH-007 analytics data, hiding the active mode, board, prompt, and grid after final Listen & Find completion while showing accuracy, correct and incorrect selections, duration, boards completed, Play Again, and Return Home.

### SCH-007.2 Completion Summary Persistence Fix

Status: Done
Depends On:
- `SCH-007.1`

Closure note: Standardized completion-screen persistence so completion events do not auto-navigate, documented the persistence rule in `NB-ACTIVITY-STANDARD-001`, and added Schulte regression coverage proving the completion summary remains visible until Play Again or Return Home.

### SCH-008 Level 2 Square Grid Expansion

Status: Done
Depends On:
- `SCH-001`
- `SCH-002`
- `SCH-004`
- `SCH-005`
- `SCH-006`
- `SCH-007`

Closure note: Added Level 2 Schulte Table support using a 4x4 square grid with numbers 1-16 across the existing Ascending, Descending, Memory, Listen & Find, and completion summary learner flow while preserving Level 1 3x3 behavior and keeping Honeycomb, Multiples, Random Listen & Find, Peripheral, Gorbov, timer/adaptive fluency, and Parent Practice Lab out of scope.

### SCH-008.1 Mastery and Progression Framework

Status: Done
Depends On:
- `SCH-008`
- `NB-ARCH-004`

Closure note: Added a reusable Schulte mastery and progression foundation with level analytics trends, configurable mastery rules, separate mastery/fluency/progression status evaluation, analytics payload metadata, and score-log persistence support without automatic promotion, UI changes, parent controls, dashboard visualization, or additional grid/layout modes.

### NB-BL-007 Schulte Freeze Sheet and Test Matrix

Status: Done  
Closure note:  
- `SCH-FREEZE-001` created
- `SCH-TEST-001` created
- Schulte V1 architecture frozen
- Test matrix completed

### NB-BL-008A Schulte Implementation Plan

Status: Done  
Note: Requested as `NB-BL-008`, but `NB-BL-008` is already assigned to Results Page Learner Accuracy Highlight. Preserved existing backlog history and recorded this Schulte planning item as `NB-BL-008A`.  
Closure note:  
- `SCH-IMPLEMENTATION-PLAN-001` created
- `SCH-001` through `SCH-007` defined
- Dependencies documented
- Scope boundaries documented
- Deferred items identified
- Implementation sequence frozen

### NB-BL-008 Results Page Learner Accuracy Highlight

Status: Done  
Closure note: Implemented learner-facing accuracy highlight in the result header.

### NB-KQ-002D Extend Number Bridges Levels to L9

Status: Done  
Closure note: Implemented in the Number Bridges L1-L9 progression work included in commit `f0fba70`.

### NB-KQ-002D.1 Fix Subtraction L1-L9 Bridge Question Variety

Status: Done  
Closure note: Implemented in the Number Bridges L1-L9 progression work included in commit `f0fba70`.

### NB-KQ-002D.2 Fix Operation-Specific Number Bridges Level Options

Status: Done  
Closure note: Implemented in the Number Bridges L1-L9 progression work included in commit `f0fba70`.

### NB-KQ-002D.3 Fix Multiplication L1-L9 Table Mapping

Status: Done  
Closure note: Implemented in commit `f0fba70`.

### NB-KQ-AUD-001 Guided Math Reading Mode

Status: Done  
Closure note: Added optional Number Bridges read-aloud support with `audioMode`, parent-facing Read question aloud ON/OFF control, guarded browser speech synthesis, question speech de-duplication, and correct-answer fact speech across bridge/master modes and supported operations. Added focused Node coverage plus Number Bridges Playwright smoke validation.
