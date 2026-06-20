# NeuroBridge Backlog

This file is the lightweight source of truth for deferred NeuroBridge work.

- Codex may update only feature IDs explicitly mentioned in a handover.
- Do not delete backlog history.
- Move items to Done only after implementation and manual acceptance.

## Ready

Items frozen enough for Codex handover.

### SCH-006 Listen & Find Ordered Mode

Priority: P2  
Status: Ready  
Depends On:  
- `SCH-002`
Notes:  
- Implement ordered Listen & Find first.
- Exposure rules must be documented before implementation.
- Learner Path: system-controlled.
- Board count: 2 boards.
- Prompt order: ordered 1->9 first.
- Random prompts deferred.
- No speech recognition.

### SCH-007 Analytics Foundation

Priority: P2  
Status: Ready  
Depends On:  
- `SCH-002`

## Backlog

Valid ideas that are not ready for implementation yet.

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

### SCH-008 Honeycomb Layout

Status: Deferred

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
