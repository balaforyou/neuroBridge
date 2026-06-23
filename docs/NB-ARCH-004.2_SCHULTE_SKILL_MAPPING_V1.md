# NB-ARCH-004.2 Schulte Skill Mapping V1

Status: Done

## 1. Purpose

This document is the first concrete NeuroBridge skill mapping reference for the Activity Skill Mapping Contract.

Activity score alone is insufficient because the same Schulte score can reflect different cognitive evidence depending on mode, level, and progression stage. A 3x3 Ascending board primarily shows visual search and selective attention. A Descending board adds cognitive flexibility and reverse sequencing. Memory Mode increases internal tracking demand. Listen & Find adds auditory and cross-modal processing.

NeuroBridge therefore maps activity experiences to cognitive domain, skill, and sub-skill evidence rather than treating Schulte Table as one static skill.

## 2. Mapping Principles

Skills are not fixed properties of activities.

Skills are evidence produced by a learner experience.

Evidence depends on:

- Activity
- Mode
- Level
- Progression Stage

For Schulte Table, the activity family remains stable while the evidence changes across Ascending, Descending, Memory Mode, Listen & Find, and grid level.

## 3. Domain Definitions

Initial domains:

- Attention
- Executive Function
- Working Memory
- Auditory Processing

These domains are provisional. They are intended to support early analytics interpretation and may evolve when the cognitive domain taxonomy is formally frozen.

## 4. Level 1 (3x3) Skill Mapping

Level 1 uses a 3x3 square grid with numbers 1-9.

### Ascending

Domain:

- Attention

Primary Skill:

- Visual Search

Sub Skills:

- Visual Scanning
- Number Recognition
- Selective Attention

Evidence Weight:

- High

### Descending

Domain:

- Executive Function

Primary Skill:

- Cognitive Flexibility

Sub Skills:

- Reverse Sequencing
- Visual Search
- Working Memory

Evidence Weight:

- Medium

### Memory Mode

Domain:

- Working Memory

Primary Skill:

- Sequential Tracking

Sub Skills:

- Working Memory
- Mental Tracking
- Error Monitoring

Evidence Weight:

- High

### Listen & Find

Domain:

- Auditory Processing

Primary Skill:

- Cross-Modal Integration

Sub Skills:

- Auditory Attention
- Visual Search
- Working Memory

Evidence Weight:

- High

## 5. Level 2 (4x4) Skill Mapping

Level 2 uses a 4x4 square grid with numbers 1-16.

Skills remain largely the same while cognitive load increases.

### Ascending

Primary:

- Visual Search

Additional:

- Sustained Attention

### Descending

Primary:

- Cognitive Flexibility

Additional:

- Working Memory
- Visual Search

### Memory

Primary:

- Sequential Tracking

Additional:

- Mental Updating

### Listen & Find

Primary:

- Cross-Modal Integration

Additional:

- Auditory Attention
- Working Memory

## 6. Cognitive Load Notes

Level 2 increases:

- Search Space
- Attention Demand
- Memory Demand

This increase does not fundamentally change the targeted skills. It strengthens the evidence by increasing the number of cells, target values, and opportunities for tracking errors.

## 7. Future Mapping Notes

Future additions may expand the Schulte evidence model.

Level 3 (5x5):

- Sustained Attention
- Processing Speed
- Visual Persistence

Random Listen & Find:

- Task Switching
- Cognitive Flexibility
- Response Inhibition

Multiples:

- Pattern Recognition
- Mental Arithmetic

Peripheral:

- Peripheral Awareness
- Visual Attention Control

## 8. Analytics Implications

Future analytics should aggregate:

- Domain evidence
- Skill evidence
- Sub-skill evidence

Analytics should not rely on activity score alone.

Recommended aggregation dimensions:

- Activity family
- Mode
- Level
- Progression stage
- Scaffold state
- Evidence weight

This allows parent, learning-signal, and future recommendation surfaces to distinguish visual-search success from auditory-processing success, memory tracking, or cognitive flexibility.

## 9. Relationship to NB-ARCH-004

This document is the first reference implementation of `NB-ARCH-004 Activity Skill Mapping Contract`.

It applies the contract principle that skill evidence comes from:

```text
activity + mode + level + scaffold/progression stage
```

It does not freeze the final cognitive taxonomy. It provides a concrete Schulte V1 mapping that future analytics and architecture packets can refine.

## Out of Scope

Out of scope:

- Code changes
- Analytics implementation changes
- Dashboard changes
- Progression rule changes
- Taxonomy freeze
- Parent UI changes
