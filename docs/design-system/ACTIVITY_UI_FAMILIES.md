# NeuroBridge Activity UI Families

Status: Design

Feature: NB-UI-001

Purpose: Define the approved NeuroBridge activity UI families so new activities select a layout, feedback, spacing, and interaction structure before implementation begins.

This document is architecture-only. It does not change learner-facing functionality, gameplay, analytics, or existing activity layouts.

## Problem Statement

Current NeuroBridge activities evolved independently. This created multiple layout patterns, different feedback placement, different instruction placement, repeated UI refinement work, and activity-specific layout fixes.

Examples:

- Number Bridges uses a fluency-focused layout.
- Matching Worksheet uses a worksheet layout.
- Attribute Explorer uses a focused activity layout.
- Pattern Memory exposed worksheet layout inconsistencies.

Before introducing more activities, NeuroBridge needs a stable UI family architecture.

## Activity Selection Rule

Every new activity must declare its UI family before implementation begins.

Examples:

- Pattern Memory: Worksheet
- Directions: Activity
- Multiplication Fluency: Quiz

The selected UI family should appear in activity requirements, implementation packets, and handover notes. Activities should not create custom layouts unless explicitly approved.

## Architectural Guardrail

Activities should provide:

- Content
- Activity logic
- Activity metadata

Templates should provide:

- Layout
- Instruction placement
- Feedback placement
- Help placement
- Responsive behavior

This separation keeps learner experience consistent and prevents every activity from solving shell, spacing, feedback, and viewport behavior independently.

## Family 1: Quiz Template

### Purpose

Rapid fluency practice.

### Interaction Pattern

```text
Question
-> Answer
-> Feedback
-> Next Question
```

### Characteristics

- High repetition
- Low visual complexity
- Fast transitions
- Minimal instructions
- Automaticity focused

### Typical Layout

```text
Header
-> Question Area
-> Answer Area
-> Optional Help
```

### Current Activities

Reference implementation:

- Number Bridges / Kumon Quiz

### Future Activities

- Addition Fluency
- Subtraction Fluency
- Multiplication Fluency
- Division Fluency
- Fact Recall

## Family 2: Worksheet Template

### Purpose

Guided cognitive learning activities.

### Interaction Pattern

```text
Instruction
-> Activity Workspace
-> Help / Scaffold
-> Feedback
```

### Characteristics

- Structured workspace
- Visible instructions
- Scaffold region
- Larger activity surface
- Moderate pacing

### Typical Layout

```text
Header
-> Instruction Zone
-> Activity Zone
-> Support Zone
-> Feedback Zone
-> Completion
```

### Current Activities

Reference worksheet template:

- Matching Worksheet

Worksheet variants:

- Attribute Matching Worksheet
- Pattern Memory, as a future migration target

### Future Activities

- Pattern Builder
- Pattern Completion
- Narration Worksheet
- Audio Chain Worksheet
- Functional Life Worksheet

## Family 3: Activity Template

### Purpose

Focused cognitive exercises.

### Interaction Pattern

```text
Task
-> Response
-> Feedback
-> Next Trial
```

### Characteristics

- Single focal task
- Minimal framing
- Large interaction targets
- Low clutter

### Typical Layout

```text
Header
-> Task Area
-> Response Area
-> Help Area
-> Feedback
```

### Current Activities

Reference activity template:

- Attribute Explorer

Activity variants:

- Schulte Table

### Future Activities

- Directions
- Stroop
- Grid Vision
- Visual Search
- Same / Different
- Cognitive Switching

## Family 4: Story Template

### Purpose

Narrative and social understanding.

### Examples

- Social Stories
- Conversation Practice
- Functional Scripts

### Status

Future. No implementation work is required for NB-UI-001.

## Family 5: Assessment Template

### Purpose

Baseline and structured assessment activities.

### Characteristics

- Minimal scaffolding
- Controlled prompts
- Consistent scoring
- Repeatable measurement

### Status

Future. No implementation work is required for NB-UI-001.

## Implementation Guidance

New activities should start from an approved family and then provide only the activity-specific content, logic, and metadata required by that family. If a proposed activity does not fit an existing family, the implementation packet should document why and request an architecture decision before building a new layout.

## Out of Scope

- Refactoring existing activities
- Changing layouts
- Changing gameplay
- Changing analytics
- Creating worksheet templates
- Creating activity templates
- Creating quiz templates
