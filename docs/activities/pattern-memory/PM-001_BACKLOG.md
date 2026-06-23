# PM-001 Pattern Memory Backlog

Status: Active

Purpose:
Track Pattern Memory-specific implementation packets, refinements, deferred enhancements, and observation-driven follow-ups.

This file is the source of truth for Pattern Memory activity-specific backlog items.

Cross-activity, parent workspace, architecture, analytics platform, and SIRAASH-wide items belong in:
docs/neurobridge-knowledge/BACKLOG.md

---

## Ready

## Backlog

### PM-BL-001 Peek and Submission Review Composition

Status: Backlog

Goal:
Clarify how Peek Support and Submission Review compose in the same Memory Mode trial.

Proposed Direction:

- Peek Support occurs during recall.
- Submission Review occurs after submission.
- Both may coexist.
- Peek usage downgrades independent recall evidence.
- Submission Review should be recorded but should not by itself downgrade pre-submission recall evidence.

### PM-BL-002 Analytics Evidence Directionality

Status: Backlog

Goal:
Strengthen analytics expectations so scaffolded evidence never outweighs independent evidence for the same level and result.

Proposed Rule:

```text
For identical mode, level, accuracy, and display duration:

independent evidence weight >= scaffolded evidence weight
```

### PM-BL-003 Scaffold Support Strength Ordering

Status: Backlog

Goal:
Define relative support strength for PM-001 scaffolds.

Initial Ordering To Review:

```text
Color Reminder
-> Color Count Hint
-> Cell Count Hint
-> Hint Cell
-> Peek Support
-> Extended Display Time
-> Ready Button
```

Do not finalize evidence weighting formulas in this item.

### PM-BL-004 Public Documentation Privacy Review

Status: Backlog

Goal:
Review whether PM-001 internal documents should continue naming the reference learner directly if the repository becomes public.

Current Internal Reference Learner:
Adarsh

Future-Safe Options:

- Reference Learner: Primary learner
- Reference Learner: Learner profile
- Reference Learner: Adarsh / primary learner profile

No change required unless public repository exposure is planned.

### PM-BL-005 Level ID Alias Clarification

Status: Backlog

Goal:
Clarify the relationship between short curriculum IDs and long metadata IDs.

Example:

```text
M8
```

is the human-readable curriculum level.

```text
PM-001-MEM-3X3-3C-1CLR-8S-STRUCT
```

is the metadata / analytics key format.

## Deferred

### PM-BL-006 Multi-Color Copy Mode

Status: Deferred

Goal:
Introduce Blue + Red + Green color palette support in Copy Mode after single-color foundation is stable.

Notes:
May become PM-001.1A or part of a later Copy Mode enhancement.

### PM-BL-007 Click Cycling Interaction Mode

Status: Deferred

Goal:
Introduce click cycling interaction after color palette selection is mastered.

Future Flow:

```text
Blank
-> Blue
-> Red
-> Green
-> Blank
```

Notes:
This increases interaction-state working memory and should not be part of V1 foundation.

### PM-BL-008 Pattern Rotation Assistance

Status: Deferred

Goal:
Explore future visual-spatial pattern rotation variants and related scaffolds.

### PM-BL-009 Activity Family Retrospective

Status: Deferred

Goal:
Capture lessons learned from designing PM-001 and use them to improve future NeuroBridge activity creation.

Topics To Review:

- Activity documentation sequence effectiveness
- Level design workflow
- Scaffold architecture workflow
- Skill evidence alignment process
- Analytics design workflow
- Test matrix value
- Activity backlog structure
- Common backlog vs activity backlog ownership
- Areas where architectural clarification was required
- Opportunities to improve future activity templates

Expected Outcome:

Refinements to the NeuroBridge activity-family template and implementation process.

Trigger:

Complete after PM-001 reaches stable learner usage and at least one additional activity family has been designed using the same process.

## Done

### PM-001.1 Copy Mode Foundation

Status: Done

Closure:
Implemented the first playable Pattern Memory Copy Mode foundation with C1-C4, blue-only pattern generation, target-grid toggling, immediate validation, self-correction, 10-question session flow, standard result screen reuse, minimal analytics payload, launcher registration, and unit coverage.

Commit:
a3418b3 PM-001.1 Implement Pattern Memory Copy Mode foundation

### PM-001.1A Activity Integration Requirements

Status: Done

Closure:
Verified Pattern Memory activity registration, learner activity tile exposure, direct tile-to-Copy-Mode launch, worksheet shell compliance, feedback/result-screen persistence expectations, and existing analytics flow compatibility without expanding gameplay scope.

### PM-001.01 Activity Brief and Product Requirements

Status: Done

Closure:
Pattern Memory activity brief and product requirements created.

Commit:
76f6871 PM-001.01 Add Pattern Memory activity brief and product requirements

### PM-001.02 Level Design and Ontotype Mapping

Status: Done

Closure:
Pattern Memory level design, tracks, mastery rules, and ontotype mapping created.

Commit:
88af916 PM-001.02 Add Pattern Memory level design and ontotype mapping

### PM-001.03 Scaffold Architecture

Status: Done

Closure:
Pattern Memory scaffold architecture created.

Commit:
f5ad719 PM-001.03 Add Pattern Memory scaffold architecture

### PM-001.03.1 Skill Evidence Contract Alignment

Status: Done

Closure:
Pattern Memory scaffolds aligned with NB-ARCH-004 skill evidence contract.

Commit:
a6d227d PM-001.03.1 Align Pattern Memory scaffolds with skill evidence contract

### PM-001.04 Analytics Specification

Status: Done

Closure:
Pattern Memory analytics specification created.

Commit:
37797ad PM-001.04 Add Pattern Memory analytics specification

### PM-001.04.1 Specification Refinements

Status: Done

Closure:
Pre-implementation specification refinements completed.

Commit:
bba87a9 PM-001.04.1 Refine Pattern Memory specifications before implementation

### PM-001.05 Test Matrix

Status: Done

Closure:
Pattern Memory test matrix created.

Commit:
32e3c05 PM-001.05 Add Pattern Memory test matrix
