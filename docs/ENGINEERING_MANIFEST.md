# NeuroBridge Engineering Manifest

## Purpose

The NeuroBridge Engineering Manifest is the canonical starting point and navigation guide for all developer and AI implementation agent engineering work.

All implementations must follow the established standards listed here rather than introducing new process documents.

---

## Engineering Philosophy

Our engineering decisions are guided by seven core principles:
- **Observation-driven design**: Build from real interaction needs and observed learning data.
- **Learner-first development**: Prioritize clarity, calm pacing, and visual layout stability over complexity.
- **Small iterative implementation packets**: Execute changes in small, reviewable slices with independent tests.
- **Architecture before implementation**: Lock designs in freeze documents before writing game engine code.
- **Reusable platform components**: Leverage shared layouts, feedback rules, result summaries, and analytics drivers.
- **Evidence-based progression**: Validate mastery across sessions rather than promoting based on single completions.
- **Consistency over reinvention**: Standardize platform patterns rather than introducing ad-hoc visual styles.

---

## Reading Order

For any new task or feature implementation, read documents in this specific sequence:

1. **`CODEX_CONTEXT_PREFIX.md`**: Inherited default context settings.
2. **`NB-STD-004_IMPLEMENTATION_STANDARD_STACK.md`**: Mandatory platform, process, worksheet, and architectural standards.
3. **`NB-STD-005_ACTIVITY_BOOTSTRAP_STANDARD.md`**: Mandatory bootstrap checklists, maturity stages, and planning rules.
4. **Activity Freeze Document** (e.g. `SCH-FREEZE-001`, `DIR-FREEZE-001`): Mechanics, features, and level parameters.
5. **Activity Test Plan**: Unit, UI, scaffold, and accessibility verification criteria.
6. **Activity Implementation Plan**: Packet-by-packet dependency and roadmap sequence.
7. **Implementation Packet**: Current coding target instructions.

---

## Activity Lifecycle

Every new cognitive activity progresses through the standard lifecycle gates:

```text
  Idea
   ↓
  Game Catalog Entry
   ↓
  Activity Freeze
   ↓
  Test Plan
   ↓
  Implementation Plan
   ↓
  Implementation Packets
   ↓
  Analytics
   ↓
  Mastery Framework
   ↓
  Skill Mapping
   ↓
  Production Ready
```

---

## Standard Repository Structure

- **`docs/design-system/`**: Reusable UI, layout, worksheet template, design tokens, and feedback standards.
- **`docs/process/`**: Delivery standards, acceptance criteria, templates, definition of done, and release checklists.
- **`docs/`**: Authorized architecture contracts, activity freezes, implementation plans, manifests, and catalogs.
- **`docs/backlog/`**: Central implementation backlog.
- **`games/`**: Activity-specific codebases (HTML, JS, and test runners).
- **`js/`**: Central platform services, IndexedDB drivers, routers, and metrics engines.

---

## Activity Development Checklist

Before writing any game implementation code, ensure these steps are completed:
- **[ ] Game Catalog Entry**: Registered in `docs/GAME_CATALOG.md`.
- **[ ] Activity Freeze**: Freeze document committed.
- **[ ] Test Plan**: Verification test plan committed.
- **[ ] Implementation Plan**: Packet roadmap and done criteria committed.
- **[ ] Backlog IDs reserved**: Feature task IDs staged in the backlog.
- **[ ] Skill Mapping planned**: Domain, skill, and cognitive targets mapped in registry tests.

---

## Implementation Packet Rule

Normal implementation packets must reference only:
- **`CODEX_CONTEXT_PREFIX.md`**
- **Activity Freeze Document**
- **Activity Test Plan**
- **Activity Implementation Plan**

Avoid repeating standard stack definitions that are inherited automatically.

---

## Governance

NeuroBridge Engineering Governance V1 is considered stable.

The following documents form our engineering governance foundation:
- **`NB-STD-001`**
- **`NB-STD-002`**
- **`NB-STD-003`**
- **`NB-STD-004`**
- **`NB-STD-005`**
- **`CODEX_CONTEXT_PREFIX.md`**

Future improvements should refine existing standards rather than creating new governance documents.

---

## Future Evolution

New documentation should only be introduced when a genuinely new architectural concern emerges. 

Otherwise:
- Update existing standards.
- Preserve consistency.
- Keep implementation packets concise.
