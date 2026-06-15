# Architecture Notes

Purpose: Capture architecture decisions, rationale, tradeoffs, and follow-up items.

Use this file for decisions that shape NeuroBridge contracts, registries, metrics, game infrastructure, scaffold systems, parent configuration, and future extensibility.

## Architecture Decision Record Template

- ADR ID:
- Date:
- Decision:
- Context:
- Options Considered:
- Decision Taken:
- Rationale:
- Impact:
- Follow-up Items:

## Architecture Decision Records

### ADR-001: NeuroBridge Is Observation Driven

- ADR ID: ADR-001
- Date: 2026-06-14
- Decision: NeuroBridge is observation driven.
- Context: Learning interventions originate from observed learner behavior.
- Options Considered: Curriculum-first, therapist-model-first, observation-first.
- Decision Taken: Treat observations as first-class project knowledge.
- Rationale: Observations reveal bottlenecks and scaffold needs that metrics alone cannot explain.
- Impact: Knowledge capture files now sit beside telemetry and analytics.
- Follow-up Items: Link selected observations to future assessment summaries.

### ADR-002: Local-First, Backend-Agnostic Architecture

- ADR ID: ADR-002
- Date: 2026-06-14
- Decision: NeuroBridge remains local-first and backend-agnostic.
- Context: Core activities should work locally before persistence infrastructure is finalized.
- Options Considered: Backend-first, local-only, local-first with future adapters.
- Decision Taken: Keep backend pluggable and preserve local activity execution.
- Rationale: Stable frontend contracts allow later storage without reshaping games.
- Impact: Trial/session contracts become the future persistence surface.
- Follow-up Items: Define backend adapter boundaries later.

### ADR-003: NeuroBridge Core Architecture v1.1 Frozen

- ADR ID: ADR-003
- Date: 2026-06-14
- Decision: Core Architecture v1.1 is frozen.
- Context: Core contracts, registries, ontology, analytics, documentation, and knowledge capture are complete.
- Options Considered: Continue architecture changes, freeze and move to UI templating.
- Decision Taken: Freeze core architecture and move to learner-facing design system work.
- Rationale: A stable foundation is needed before broad UI templating and new activities.
- Impact: Future architecture changes require explicit justification.
- Follow-up Items: Keep documentation updated as UI templates mature.

### ADR-004: Mobile-First and Touch-First

- ADR ID: ADR-004
- Date: 2026-06-14
- Decision: NeuroBridge design should be mobile-first and touch-first.
- Context: Primary expected use is tablet/mobile, especially for learner activities.
- Options Considered: Desktop-first, tablet-only, mobile-first responsive.
- Decision Taken: Target tablet/mobile with large touch targets and responsive layouts.
- Rationale: Learner activities need direct, low-friction touch interaction.
- Impact: Design-system docs now prioritize touch, responsiveness, and no hover dependency.
- Follow-up Items: Add automated visual checks once UI templates are implemented.

### ADR-005: NeuroBridge and SIRAASH Audience Separation

- ADR ID: ADR-005
- Date: 2026-06-15
- Decision: SIRAASH is the learner-facing companion identity. NeuroBridge is the parent, admin, analytics, and research platform identity.
- Context: Learner screens need a calm, familiar companion presence, while parent and research areas need platform-level terminology.
- Options Considered: Single NeuroBridge brand everywhere, single SIRAASH brand everywhere, audience-specific brand separation.
- Decision Taken: Use SIRAASH for learner entry, activity hub, activity shell, and companion language. Use NeuroBridge for parent, configuration, analytics, reports, and research contexts.
- Rationale: Brand separation reduces learner-facing admin language and helps SIRAASH become a familiar learning companion.
- Impact: Learner screens should avoid NeuroBridge, Active Session, Student, Admin, and Configuration terminology where possible.
- Follow-up Items: Apply SIRAASH learner branding to future activity templates and Matrix migration.
