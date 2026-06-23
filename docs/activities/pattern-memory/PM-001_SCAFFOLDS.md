# PM-001 Pattern Memory Scaffold Architecture

## 1. Scaffold Philosophy

### Purpose

Scaffolds exist to:

- Reduce frustration
- Increase success
- Reveal learner strengths
- Support skill acquisition
- Gradually fade as mastery increases

Scaffolds are temporary supports.

They should be progressively removed as learner confidence and performance improve.

### NeuroBridge Principle

Pattern Memory separates:

```text
Level Difficulty
```

from

```text
Scaffold Support
```

A learner's level determines the challenge.

Scaffolds determine the amount of support provided while attempting that challenge.

The adaptive engine may add or remove scaffolds without changing the learner's level.

## 2. Cognitive Flow Model

Pattern Memory follows:

```text
Observe
-> Encode
-> Retain
-> Recall
-> Reproduce
```

Each scaffold should support one or more stages of this flow.

## 3. Encoding Scaffolds

Supports:

- Visual Encoding
- Observation Accuracy

### SC-ENC-001 Ready Button

Flow:

```text
Pattern Visible
-> Ready Button
-> Pattern Disappears
-> Reproduce
```

Purpose:

- Reduce pressure
- Support encoding
- Increase confidence

### SC-ENC-002 Extended Display Time

Extended Display Time adds support above the current level duration.

Examples:

- 10s standard duration may become 15s with Extended Display.
- 8s standard duration may become 13s with Extended Display.
- 6s standard duration may become 11s with Extended Display.

Standard level duration remains unchanged.

Do not treat 15s and 12s as standard level durations.

Scaffolded display duration must be recorded as scaffold state.

Purpose:

Support slower visual encoding.

### SC-ENC-003 Pattern Review Countdown

Display:

```text
3
2
1
```

before pattern disappearance.

Purpose:

Prepare learner for recall.

## 4. Recall Scaffolds

Supports:

- Visual Retention
- Recall Accuracy

### SC-REC-001 Peek Support

Allow one temporary pattern reveal.

Example:

```text
Show Pattern
2 seconds
```

Maximum:

1 peek per question.

### SC-REC-002 Hint Cell

Reveal one correct cell position.

Purpose:

Reduce recall burden.

### SC-REC-003 Color Reminder

Display colors used.

Example:

```text
Blue
Red
```

without revealing locations.

Purpose:

Support Color Recall.

## 5. Reproduction Scaffolds

Supports:

- Pattern Reconstruction

### SC-REP-001 Cell Count Hint

Display:

```text
4 colored cells
```

Purpose:

Support reconstruction without revealing positions.

### SC-REP-002 Color Count Hint

Display:

```text
2 Blue
1 Red
```

Purpose:

Support working memory.

### SC-REP-003 Grid Highlight

Highlight learner-selected cells.

Purpose:

Reduce accidental omissions.

## 6. Complexity Scaffolds

Supports:

- Overall Task Difficulty

### SC-CMP-001 Structured Patterns

Prefer:

- Rows
- Columns
- Corners
- Simple shapes

Used for beginner levels.

### SC-CMP-002 Semi-Random Patterns

Mix:

- 50% Structured
- 50% Random

### SC-CMP-003 Random Patterns

No placement restrictions.

Used for advanced levels.

## 7. Color Scaffolds

Supports:

- Color Recall

### SC-COL-001 Single Color

Blue only.

### SC-COL-002 Two Colors

Blue + Red.

### SC-COL-003 Three Colors

Blue + Red + Green.

## 8. Error Scaffolds

Supports:

- Self-Correction
- Error Awareness

### SC-ERR-001 Immediate Feedback

Copy Mode only.

Incorrect selections are identified immediately.

Learner can correct before continuing.

### SC-ERR-002 Submission Review

Memory Mode only.

After submission display:

- Correct Cells
- Missing Cells
- Extra Cells

### SC-ERR-003 Mistake Replay

Display:

```text
Your Answer
vs
Correct Answer
```

Purpose:

Support learning through comparison.

## 9. Adaptive Scaffold Rules

### Automatic Enable

Enable support when:

- Accuracy < 60%
- Two consecutive sessions

Suggested supports:

- Ready Button
- Extended Display Time
- Peek Support
- Structured Patterns

without changing level.

### Fallback Floor Rule

C1 and M1 have no lower fallback level.

If learner performance is below fallback threshold at C1 or M1, the system should add or maintain scaffold support instead of reducing level.

Suggested supports:

- Structured Patterns
- Ready Button where applicable
- Extended Display Time in Memory Mode
- Parent-guided retry through Practice Lab where applicable

The learner should never be forced into repeated unsupported failure at the lowest level.

### Automatic Removal

Remove support when:

- Accuracy > 90%
- Three consecutive sessions

Recommended removal order:

```text
Peek Support
-> Hint Cell
-> Ready Button
-> Extended Display Time
```

without changing level.

### Independent Progression Counters

Level progression counters and scaffold progression counters are independent.

Level promotion:

- Accuracy >= 85%
- Two consecutive sessions

Scaffold removal:

- Accuracy > 90%
- Three consecutive sessions

These counters should be tracked independently.

A level promotion event should not automatically remove scaffolds.

A scaffold removal event should not automatically promote level.

Level progression and scaffold progression are independent systems.

## 10. Parent Controls

### Auto Scaffolds

```text
ON / OFF
```

System manages scaffolds automatically.

### Manual Override

Parent may manually enable:

- Ready Button
- Peek Support
- Extended Display Time
- Structured Patterns
- Hint Cell
- Color Reminder

for testing or learner support.

## 11. Scaffold Assignment Model

### Philosophy

```text
Level defines the challenge.

Scaffold defines the support condition.

Adaptive engine decides whether to keep,
add, or remove support.
```

Example:

```text
M8
```

may be attempted by two learners.

Learner A:

```text
M8
No scaffolds
```

Learner B:

```text
M8
Ready Button
Peek Support
Color Reminder
```

Both learners remain at M8.

Only support differs.

### Copy Track Scaffold Mapping

| Level Range | Default Scaffold | Optional Scaffold | Removed When |
| ----------- | ---------------- | ----------------- | ------------ |
| C1-C6 | Immediate Feedback | Structured Patterns | Accuracy > 90% for 3 sessions |
| C7-C13 | Immediate Feedback + Color Palette | Structured Patterns, Color Count Hint | Accuracy > 90% for 3 sessions |
| C14-C16 | Immediate Feedback | Manual Override Only | Elite Levels |

### Copy Track Notes

Focus:

- Visual Encoding
- Spatial Mapping
- Pattern Reproduction

Memory scaffolds should not be applied to Copy Mode.

### Memory Track Scaffold Mapping

| Level Range | Default Scaffold | Optional Scaffold | Removed When |
| ----------- | ---------------- | ----------------- | ------------ |
| M1-M2 | Ready Button | Extended Display Time, Peek Support | Accuracy > 90% for 3 sessions |
| M3-M6 | Ready Button + 10s Display | Peek Support, Cell Count Hint | Accuracy > 90% for 3 sessions |
| M7-M9 | Ready Button + 8s/6s Display | Color Reminder, Peek Support | Accuracy > 90% for 3 sessions |
| M10-M13 | Timed Display | Peek Support, Cell Count Hint | Accuracy > 90% for 3 sessions |
| M14-M16 | No Ready Button | None by Default | Elite Levels |

## 12. Implementation Requirement

The implementation must treat:

```text
Level
```

and

```text
Scaffold State
```

as separate concepts.

A learner may remain at the same level while scaffold support changes dynamically.

Scaffold changes must not automatically trigger:

- Level Promotion
- Level Fallback

Level progression and scaffold progression are independent systems.

## Skill Evidence Contract Alignment

PM-001 scaffold metadata must align with:

NB-ARCH-004 Activity Skill Mapping Contract.

Pattern Memory should publish skill evidence using the NeuroBridge experience-slice model.

Skill evidence must be interpreted from:

```text
activity
+
mode
+
level
+
progressionStage
+
scaffoldState
```

Scaffolded and independent performance must not be treated as equivalent evidence.

The same learner performance may produce different evidence depending on the scaffold state under which it was achieved.

### Required Metadata Support

Future PM-001 metadata should support:

- activityId
- activityFamily
- activityName
- mode
- level
- progressionStage
- primaryDomain
- primarySkill
- subSkills
- evidenceWeight
- scaffoldState
- analyticsTags

### Pattern Memory Mapping Guidance

Example:

```text
PM-001
Memory Mode
M8
Practice
Ready Button Enabled
```

should produce different evidence than:

```text
PM-001
Memory Mode
M8
Practice
No Scaffolds
```

even if learner accuracy is identical.

### Analytics Guidance

Future analytics consumers should use scaffold state as part of the evidence context.

Examples:

- Parent Dashboard
- Cognitive Snapshot
- Learning Signals
- Adaptive Progression
- SIRAASH Recommendations

Scaffold state should not be discarded when interpreting learner performance.

## 13. Scaffold Metadata

Each scaffold should support metadata.

Fields:

- Scaffold ID
- Scaffold Category
- Supported Skills
- Difficulty Impact
- Auto Enable Eligible
- Auto Removal Eligible

Example:

```text
SC-ENC-001

Category:
Encoding

Supports:
Visual Encoding

Impact:
Low
```

## 14. Future Expansion

Future scaffolds may include:

- Pattern Rotation Assistance
- Shape Memory Support
- Progressive Hint Chains
- AI-Driven Scaffold Recommendations
- SIRAASH Scaffold Selection

Do not define future scaffold implementations in this document.

## Acceptance Checks

- PM-001_SCAFFOLDS.md created.
- Scaffold philosophy documented.
- Scaffold families documented.
- Adaptive scaffold rules documented.
- Parent controls documented.
- Scaffold assignment model documented.
- Level-to-scaffold mappings documented.
- Implementation requirements documented.
- Scaffold metadata documented.
- Skill Evidence Contract Alignment documented.
- Experience-slice model documented.
- Scaffold state documented as part of evidence context.
- No application code changes.

## Out of Scope

Do not:

- Modify NB-ARCH-004
- Implement scaffolds
- Create UI
- Implement analytics changes
- Create analytics screens
- Create parent dashboard screens
- Implement metadata changes
- Create backlog items

Documentation only.
