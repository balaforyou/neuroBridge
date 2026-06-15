# Architecture Decisions

Purpose: Central architecture decision record for NeuroBridge.

This file mirrors the decision-capture intent of `docs/neurobridge-knowledge/ARCHITECTURE_NOTES.md` while keeping reviewed ADRs in one central reference.

## ADR-001: NeuroBridge Is Observation Driven

- Status: Accepted
- Date:
- Decision: NeuroBridge architecture will treat learner observations, scaffold attempts, and outcomes as first-class project knowledge.
- Context: NeuroBridge is built for neurodivergent learners, where parent, teacher, therapist, and clinician observations often explain what trial metrics alone cannot.
- Options Considered:
  - Store only game metrics and analytics.
  - Capture observations informally outside the project.
  - Add lightweight project knowledge templates alongside code and metrics.
- Decision Taken: Add a knowledge capture framework for observations, ideas, backlog items, scaffolds, and architecture notes.
- Rationale: The platform needs to preserve parent and research knowledge without forcing premature database or UI work.
- Impact: Project knowledge can be reviewed by humans and AI assistants later while runtime contracts remain stable.
- Follow-up Items:
  - Connect selected observations to future assessment summaries.
  - Consider structured storage after the documentation workflow stabilizes.

## ADR-002: Local-First, Backend-Agnostic Architecture

- Status: Draft
- Date:
- Decision: NeuroBridge should remain local-first and backend-agnostic during the current architecture and UI templating phase.
- Context: The project needs fast iteration on games, scaffolds, metrics, and parent workflows before committing to database tables or backend services.
- Options Considered:
  - Build backend persistence immediately.
  - Keep all state only in browser runtime.
  - Define stable frontend contracts first, then add persistence behind those contracts later.
- Decision Taken: Draft pending final review.
- Rationale: Stable contracts allow future backend integration without reshaping game code or analytics semantics.
- Impact: Documentation, trial results, session results, and registries become the stable integration surface for later storage.
- Follow-up Items:
  - Define persistence adapter boundaries.
  - Decide when session results should be stored beyond the current browser flow.

ADR-003

Decision:
NeuroBridge Core Architecture v1.1 Frozen

Date:
2026-06-14

Context:
Core contracts, registries, ontology, analytics, documentation,
and knowledge capture framework have been completed.

Decision:
Future work will focus on:
- UI templating
- learner experience
- new games
- adaptive learning
- analytics insights

Architecture changes require explicit justification.

Impact:
Provides a stable platform foundation for product validation.  

## ADR-005: NeuroBridge and SIRAASH Audience Separation

- Status: Accepted
- Date: 2026-06-15
- Decision: SIRAASH is the learner-facing companion identity. NeuroBridge is the parent/admin/analytics/research platform identity.
- Context: Learner screens should feel calm, familiar, and companion-led. Parent and research areas need platform, configuration, analytics, and reporting terminology.
- Options Considered:
  - Use NeuroBridge everywhere.
  - Use SIRAASH everywhere.
  - Separate identity by audience.
- Decision Taken: Use SIRAASH for learner entry, Activity Hub, activity shells, and learner feedback. Use NeuroBridge for parent controls, reports, analytics, research, and architecture documentation.
- Rationale: Audience separation reduces cognitive load for learners while preserving a clear platform identity for adults and research workflows.
- Impact: Learner-facing screens should avoid terms like Active Session, Student, User, Admin, and Configuration where possible.
- Follow-up Items:
  - Apply SIRAASH branding to future learner activity templates.
  - Preserve NeuroBridge branding in parent and analytics areas.
