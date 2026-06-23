# PM-001 Pattern Memory Analytics and Parent Signals

## 1. Analytics Philosophy

Pattern Memory analytics should measure more than score.

The activity should capture:

- What the learner attempted
- What mode was used
- What level was attempted
- What scaffold state was active
- What cognitive skill evidence was produced
- Whether performance was independent or scaffolded

Core principle:

```text
Do not measure only score.
Measure the type and quality of memory evidence produced.
```

## 2. Standard Session Metrics

Track standard NeuroBridge worksheet metrics:

- Questions
- Correct / Total
- Accuracy
- Time Taken
- Average Time
- Hints Used
- Mistakes Corrected

These should align with the standard NeuroBridge result screen.

## 3. Pattern Memory Metrics

Track PM-specific metrics:

- Current Copy Level
- Current Memory Level
- Highest Copy Level Reached
- Highest Memory Level Reached
- Max Grid Recalled
- Max Cells Recalled
- Max Colors Recalled
- Shortest Successful Display Time
- Best Independent Recall
- Best Scaffolded Recall

## 4. Scaffold Metrics

Track scaffold state separately from level progression.

Scaffold metrics should include:

- Ready Button Used
- Peek Support Used
- Extended Display Time Used
- Cell Count Hint Used
- Color Count Hint Used
- Color Reminder Used
- Structured Pattern Used
- Semi-Random Pattern Used
- Random Pattern Used
- Immediate Feedback Used
- Submission Review Used
- Mistake Replay Used

Scaffolded success and independent success must not be treated as equivalent evidence.

## 5. Experience-Slice Evidence Model

PM-001 analytics must align with:

NB-ARCH-004 Activity Skill Mapping Contract.

Skill evidence should be interpreted from:

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

Required metadata fields:

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

## 6. Cognitive Skill Evidence

Pattern Memory should publish evidence for:

### Primary Domain

Memory

### Primary Ontotype

Visual Working Memory

### Sub-Skills

- Visual Encoding
- Spatial Memory
- Visual Retention
- Pattern Reconstruction
- Color Recall

## 7. Evidence Weight Guidance

Evidence strength should vary based on scaffold state.

Example:

```text
M8 with Ready Button + Peek Support
```

should produce weaker independent-memory evidence than:

```text
M8 with No Scaffolds
```

Suggested evidence weights:

- Low: heavily scaffolded success
- Medium: partially scaffolded success
- High: independent success
- Very High: independent success at advanced level or reduced display duration

Do not hard-code final weighting formulas in this document.

Final formulas belong to future analytics implementation packets.

## 8. Parent Dashboard Signals

Parent-facing analytics should remain simple.

Suggested Pattern Memory dashboard summary:

```text
Pattern Memory

Copy Track: C11
Accuracy: 94%

Memory Track: M7
Accuracy: 81%

Best Recall:
3x3, 4 cells, 2 colors, 8 sec

Current Support:
Ready Button enabled
Peek used occasionally
```

## 9. Cognitive Snapshot Signals

Cognitive Snapshot may summarize:

```text
Strong:
Visual Encoding

Improving:
Spatial Memory

Emerging:
Visual Retention

Needs Support:
Color Recall
```

Signals should be generated from multiple sessions, not one attempt.

## 10. Learning Signals

Possible learning signals:

- Visual encoding is strong.
- Spatial recall is improving.
- Visual retention is improving.
- Color recall needs support.
- Pattern reconstruction is stable.
- Ready Button dependency is reducing.
- Peek Support is still frequently needed.
- Independent recall improved at the same level.
- Learner is ready for reduced display duration.
- Learner may benefit from structured patterns.

## 11. Adaptive Progression Inputs

Analytics should support adaptive decisions:

### Level Progression

- Promote Level
- Maintain Level
- Fallback Level

### Scaffold Progression

- Add Scaffold
- Maintain Scaffold
- Remove Scaffold

Important:

```text
Level progression and scaffold progression are independent systems.
```

A learner may remain at the same level while scaffold state changes.

## 12. Mastery Metrics

PM-001 should support these mastery markers:

- Copy Track Mastery
- Memory Track Mastery
- Independent Recall Mastery
- Multi-Color Recall Mastery
- Reduced Display Duration Mastery
- Elite Pattern Memory Mastery

## 13. SIRAASH Future Use

Future SIRAASH integrations may use PM analytics to:

- Recommend the next Pattern Memory level
- Suggest scaffold removal
- Suggest scaffold reintroduction
- Identify memory-related skill gaps
- Generate parent-friendly explanations
- Recommend related activities such as Schulte, Directions, or Pattern Reasoning

## 14. Out of Scope

Do not:

- Implement analytics code
- Change result screen UI
- Modify dashboard UI
- Add storage schema changes
- Add runtime metadata payloads
- Create SIRAASH behavior
- Create backlog entries

Documentation only.

## Acceptance Checks

- PM-001_ANALYTICS.md created.
- Standard session metrics documented.
- Pattern Memory-specific metrics documented.
- Scaffold metrics documented.
- Experience-slice evidence model documented.
- Skill evidence fields documented.
- Parent Dashboard signals documented.
- Cognitive Snapshot signals documented.
- Adaptive progression inputs documented.
- SIRAASH future use documented.
- No application code changes.
