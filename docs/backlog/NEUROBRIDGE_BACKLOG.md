# NeuroBridge Backlog

This file is the lightweight source of truth for deferred NeuroBridge work.

- Codex may update only feature IDs explicitly mentioned in a handover.
- Do not delete backlog history.
- Move items to Done only after implementation and manual acceptance.

## Ready

Items frozen enough for Codex handover.

### SCH-001 Core Grid Engine

Priority: P1  
Status: Ready  
Depends On:  
- `SCH-FREEZE-001`
- `SCH-TEST-001`
- `SCH-IMPLEMENTATION-PLAN-001`

### SCH-002 Ascending Progression

Priority: P1  
Status: Ready  
Depends On:  
- `SCH-001`

### SCH-003 Feedback Engine Integration

Priority: P1  
Status: Ready  
Depends On:  
- `SCH-001`
- `SCH-002`

### SCH-004 Descending Progression

Priority: P2  
Status: Ready  
Depends On:  
- `SCH-002`

### SCH-005 Memory Mode

Priority: P2  
Status: Ready  
Depends On:  
- `SCH-002`

### SCH-006 Listen & Find

Priority: P2  
Status: Ready  
Depends On:  
- `SCH-002`

### SCH-007 Analytics Foundation

Priority: P2  
Status: Ready  
Depends On:  
- `SCH-002`

## Backlog

Valid ideas that are not ready for implementation yet.

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
