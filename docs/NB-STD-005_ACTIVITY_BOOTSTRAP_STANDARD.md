# NB-STD-005

## NeuroBridge Activity Bootstrap Standard

Status: Active

Inherits from: `docs/NB-STD-004_IMPLEMENTATION_STANDARD_STACK.md`

---

## 1. Purpose

The NeuroBridge Activity Bootstrap Standard defines the mandatory sequence of architectural validations and planning checklists that every new activity family must complete before coding begins.

By enforcing a standardized planning runway, the platform prevents design drift, ensures test coverage alignment, and maintains strict clinical telemetry compatibility across activities.

---

## 2. Activity Lifecycle

Every new activity progresses through a defined lifecycle gate sequence:

```text
  Idea
   ↓
  Freeze (docs/XXX-FREEZE-001.md)
   ↓
  Test Plan (docs/XXX-TEST-001.md)
   ↓
  Implementation Plan (docs/XXX-IMPLEMENTATION-PLAN-001.md)
   ↓
  Implementation (Core grid engines, validation layers, session models)
   ↓
  Analytics (Telemetry aggregates, IndexedDB queries)
   ↓
  Mastery (Historical consistency checks, eligibility flags)
   ↓
  Skill Mapping (Mapping domains, primary skills, and targets)
   ↓
  Catalog Entry (docs/GAME_CATALOG.md)
   ↓
  Production Ready (Passes E2E validation)
```

---

## 3. Mandatory Documents

Before any code commits are staged for a new activity, the following canonical documentation artifacts must be created and frozen:

1. **Activity Freeze** (e.g. `docs/DIR-FREEZE-001.md`): Defines vision, levels, modes, UI elements, and boundary exclusions.
2. **Test Plan** (e.g. `docs/DIR-TEST-001.md`): Defines Unit, UI, Scaffold, Analytics, Accessibility, and manual validation checklists.
3. **Implementation Plan** (e.g. `docs/DIR-IMPLEMENTATION-PLAN-001.md`): Establishes the packet-by-packet coding roadmap and dependency matrix.

---

## 4. Mandatory Verification

Before beginning code implementation, developers must verify and check off compliance with the standard stack components:
- **[ ] Activity Standard**: UI zones, header structures, and instructions placement.
- **[ ] Layout Standard**: Viewport bounds alignment, overflow prevention, and mobile layout.
- **[ ] Component Standard**: Minimum touch sizes (44x44px), visual tokens, and high contrast colors.
- **[ ] Feedback Standard**: Gentle orange pulses for wrong selections, standard click and celebration sounds, and correct-answer dwell ranges.
- **[ ] Worksheet Result Standard**: Structured persistent result components matching SIRAASH summary layouts.
- **[ ] Analytics Contract**: Schema matching domain, skill, and cognitive target registries.

---

## 5. Mandatory Deliverables

Before the first implementation packet is executed, the following milestones must be achieved:
- **[ ] Freeze complete**: Architecture freeze is written, peer-reviewed, and committed.
- **[ ] Test Plan complete**: Test matrix and E2E scenarios are written and committed.
- **[ ] Implementation Plan complete**: Packet roadmap and done criteria are committed.
- **[ ] Backlog IDs reserved**: Feature task IDs are registered in the backlog.
- **[ ] Game Catalog planned**: Entry format for the new activity is defined.

---

## 6. Activity Maturity Model

| Stage | Name | Description |
| --- | --- | --- |
| Stage 0 | Idea | Activity concept defined. |
| Stage 1 | Freeze | Architecture freeze document committed. |
| Stage 2 | Test Plan | Verification plan and test matrix committed. |
| Stage 3 | Implementation Plan | Packet roadmap and done criteria committed. |
| Stage 4 | Core Engine | Core grid or board renders (no validation or session state). |
| Stage 5 | Learner Complete | Selection validation and progress loop functional. |
| Stage 6 | Analytics | Trial telemetry and database session saving active. |
| Stage 7 | Mastery | Historical performance checks and eligibility active. |
| Stage 8 | Skill Mapping | Domain and skill registry mappings verified. |
| Stage 9 | Catalog Complete | Activity details entered in `docs/GAME_CATALOG.md`. |
| Stage 10 | Production Ready | Playwright E2E smoke tests and Node regression tests pass. |

---

## 7. Lessons Learned

The **Schulte Table** and **Directions** families serve as reference implementations for this bootstrap flow. 
- Early coding before freeze documents leads to duplicate feedback loops and layout styling shifts.
- Committing the freeze, test plan, and implementation plans sequentially ensures a clear blueprint, reducing code churn and scope creep during implementation phases.

---

## 8. Out Of Scope

- Defining activity-specific mechanics, themes, sound assets, or custom gameplay instructions. Those belong in the activity's specific freeze documents.
