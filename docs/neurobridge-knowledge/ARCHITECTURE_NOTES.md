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

### ADR-006: Learner-Friendly Activity Naming

- ADR ID: ADR-006
- Date: 2026-06-15
- Decision: SIRAASH activity tiles use learner-friendly names, while NeuroBridge parent, analytics, configuration, and research surfaces use technical activity names.
- Context: Learners benefit from skill-focused, memorable activity identities. Adults need precise activity names for configuration, reporting, analytics, and research discussion.
- Options Considered: Use technical names everywhere, use playful names everywhere, separate naming by audience.
- Decision Taken: Separate learner-facing names from parent-facing names through the Activity Tile Contract.
- Rationale: Children learn skills before terminology. Adults learn terminology. SIRAASH should invite the learner into a clear activity, while NeuroBridge should preserve precise activity metadata.
- Impact: Future Activity Hub and Activity Tile work should provide both `parentName` and `learnerName`.
- Follow-up Items: Implement Activity Tile Framework v1.0 in NB-101.1 and align game registry metadata later if needed.

### ADR-007: SIRAASH Is Learner-Aware

- ADR ID: ADR-007
- Date: 2026-06-15
- Decision: SIRAASH may personalize learner-facing messages using the learner's name.
- Context: Learner-facing screens now include welcome, Activity Hub, activity shell, help, feedback, and completion messages. These moments can support connection when they acknowledge the learner directly.
- Options Considered: Generic SIRAASH messages only, hardcoded learner names, dynamic learner-name personalization.
- Decision Taken: Support dynamic learner-name insertion in SIRAASH learner-facing messages.
- Rationale: Personal acknowledgement supports engagement, belonging, and micro-praise. For learners like Adarsh, direct name-based praise can improve emotional connection and willingness to continue.
- Impact: Learner-facing welcome, Activity Hub, help, feedback, and completion messages should support dynamic learner-name insertion.
- Constraint: Do not hardcode a specific learner name. Always use the session/profile learner name with a safe `Learner` fallback.
- Follow-up Items: Extend learner-aware messaging to future activity templates and completion screens.
