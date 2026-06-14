# Architecture Notes

Purpose: Capture architecture decisions, rationale, tradeoffs, and follow-up items.

Use this file for decisions that shape NeuroBridge contracts, registries, metrics, game infrastructure, scaffold systems, parent configuration, and future extensibility.

## Architecture Decision Record

- ADR ID:
- Date:
- Decision:
- Context:
- Options Considered:
- Decision Taken:
- Rationale:
- Impact:
- Follow-up Items:



# Architecture Decision Records (ADR)

---

## ADR-001: NeuroBridge is Observation Driven

**Date:** 2026-06-14

### Decision

NeuroBridge is an observation-driven learning platform.

Learning interventions, scaffolds, adaptive strategies, and future game designs originate from observed learner behavior rather than assumptions, fixed curricula, or pre-defined therapeutic models.

### Context

During development with Adarsh, many successful interventions emerged through direct observation of learner behavior.

Examples include:

* Left-right confusion leading to color-based scaffolds and the 3-2-1 strategy.
* Pattern memory progression through adaptive difficulty.
* Visual search refinements based on observed scanning behavior.
* Hint systems evolving from actual learner bottlenecks.

These improvements were discovered through observation rather than predetermined design.

### Options Considered

1. Curriculum-driven model
2. Therapist-driven model
3. Observation-driven model

### Decision Taken

Adopt an observation-driven model.

Observations become first-class project artifacts and are treated as valuable data alongside game telemetry and analytics.

### Implementation

NeuroBridge maintains structured repositories for:

* Observations
* Scaffolds
* Ideas
* Backlog Items
* Architecture Decisions

These artifacts are stored in:

* OBSERVATIONS.md
* SCAFFOLDS.md
* IDEAS.md
* BACKLOG.md
* ARCHITECTURE_NOTES.md

### Rationale

The most effective interventions emerged from observing learner behavior, identifying bottlenecks, introducing scaffolds, and measuring outcomes.

Observation provides context that cannot be captured through scores and reaction times alone.

### Impact

This decision enables:

* Better scaffold design
* Improved adaptive learning systems
* Richer analytics interpretation
* Research traceability
* Parent and teacher collaboration
* Future AI-assisted recommendation systems

### Follow-Up Items

* Link observations to skills and domains.
* Capture scaffold effectiveness over time.
* Enable future analytics to incorporate observation data.
* Explore observation-assisted adaptive learning recommendations.

