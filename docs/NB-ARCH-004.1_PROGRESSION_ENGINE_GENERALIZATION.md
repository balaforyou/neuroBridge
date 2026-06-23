# NB-ARCH-004.1 Progression Engine Generalization

Status: Done

## 1. Purpose

This document captures how the Schulte mastery and progression foundation from `SCH-008.1` can later become a reusable NeuroBridge progression service.

The goal is to preserve the architecture learning without extracting platform code prematurely.

## 2. Background

`SCH-008.1` introduced a Schulte-specific mastery and progression framework after Level 2 square grid support.

The framework separates:

- Activity completion.
- Mastery status.
- Fluency status.
- Progression eligibility.
- Actual level unlock state.

This separation matches the Schulte freeze rule that progression should be driven by demonstrated mastery and fluency, not by a single completed session.

## 3. Problem Statement

Without a shared progression concept, each activity may implement its own isolated mastery logic.

That creates several risks:

- Completion may be mistaken for mastery.
- Mastery and fluency may be collapsed into one state.
- Progression eligibility may silently become automatic promotion.
- Parent and analytics surfaces may receive inconsistent status shapes.
- Future recommendations may have to infer readiness from raw scores instead of structured progression evidence.

NeuroBridge needs a common progression structure while still allowing each activity family to define its own mastery rules.

## 4. Current Schulte Implementation

The current Schulte implementation remains activity-local.

`SCH-008.1` introduced reusable concepts:

- `sessionCount`
- `accuracyTrend`
- `completionTimeTrend`
- `errorTrend`
- `lastCompletedSessionTimestamp`
- `modeEvidence`
- `levelStatus`
- `masteryStatus`
- `fluencyStatus`
- `progressionEligibility`
- `automaticPromotion: false`

Schulte also defines these status groups:

- Level Status: Learn, Practice, Memory, Mastery Candidate, Mastered, Fluency Candidate, Fluent.
- Progression Status: Locked, Eligible, Unlocked.

The model is intentionally conservative. It records evidence and status, but it does not automatically promote the learner.

## 5. Generalization Opportunity

The Schulte model is a strong candidate for platform generalization because the same progression questions will recur across activities:

- How many relevant sessions has the learner completed?
- Is accuracy improving, stable, or declining?
- Are completion times becoming stable?
- Are errors reducing over time?
- Which modes, levels, or progression stages produced the evidence?
- Is the learner a mastery candidate?
- Is the learner fluent enough to become eligible for the next level?
- Has a next level actually been unlocked?

This should eventually become a NeuroBridge-level capability, not remain Schulte-only.

## 6. Proposed Platform Contract

Activities define their own mastery rules, but the platform provides common trend storage, evaluation structure, and progression state.

Suggested platform responsibilities:

- Store session-level progression evidence by activity, mode, level, progression stage, and scaffold state.
- Aggregate trend inputs consistently.
- Provide a common status shape for mastery, fluency, and progression eligibility.
- Preserve `automaticPromotion: false` unless a future packet explicitly enables automatic promotion.
- Keep progression evaluation separate from parent dashboard visualization.
- Keep activity-specific thresholds configurable.

Suggested common fields:

- `activityId`
- `activityFamily`
- `level`
- `mode`
- `progressionStage`
- `sessionCount`
- `accuracyTrend`
- `completionTimeTrend`
- `errorTrend`
- `lastCompletedSessionTimestamp`
- `modeEvidence`
- `skillEvidence`
- `levelStatus`
- `masteryStatus`
- `fluencyStatus`
- `progressionStatus`
- `progressionEligibility`
- `automaticPromotion`
- `rules`

## 7. Candidate Consumers

Potential future consumers:

- Schulte
- Stroop
- Directions
- Number Bridges
- Neural Bonds
- Pattern Memory

Platform consumers:

- Parent Dashboard
- Cognitive Snapshot
- Learning Signals
- Adaptive Progression
- SIRAASH future recommendations

## 8. Relationship to Activity Skill Mapping

`NB-ARCH-004` defines skill evidence as:

```text
activity + mode + level + scaffold/progression stage
```

A platform progression engine should consume that same evidence shape.

Progression decisions should not be based only on activity score. They should use skill evidence and context:

- Which mode produced the result?
- Which level was used?
- Was the session scaffolded?
- Was the learner in Learn, Practice, Memory, Mastery, or Fluency stage?
- Did the evidence come from repeated sessions or a single completion?

This keeps future recommendations from overgeneralizing from a single activity or score.

## 9. Out of Scope

This document does not implement platform extraction.

Out of scope:

- Refactoring Schulte now.
- Creating a shared runtime progression service now.
- Adding parent dashboard UI.
- Adding automatic promotion.
- Changing Schulte learner flow.
- Adding parent controls.
- Changing analytics schema migration.
- Finalizing global mastery thresholds.
- Implementing recommendations.

## 10. Follow-up Backlog Items

Required follow-up:

- `NB-CORE-007 Reusable Progression Engine`

Purpose:

- Extract the Schulte progression framework into a platform-level service when at least two activity families need the same capability.
- Keep activity-specific mastery rules configurable.
- Preserve separation between mastery, fluency, progression eligibility, and automatic promotion.

Status:

- Deferred

Priority:

- P1
