# NeuroBridge Backlog

This file is the lightweight source of truth for deferred NeuroBridge work.

- Codex may update only feature IDs explicitly mentioned in a handover.
- Do not delete backlog history.
- Move items to Done only after implementation and manual acceptance.

## Ready

Items frozen enough for Codex handover.

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

## Done

Completed feature IDs and closure notes.

### NB-BL-007 Schulte Freeze Sheet and Test Matrix

Status: Done  
Closure note: Added `SCH-FREEZE-001.md` architecture freeze and `SCH-TEST-001.md` V1 test matrix for Schulte Family implementation handovers.

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
