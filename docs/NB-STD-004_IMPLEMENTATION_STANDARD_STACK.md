# NB-STD-004

## NeuroBridge Implementation Standard Stack

Status: Active

---

## 1. Purpose

The NeuroBridge Implementation Standard Stack provides a single source of truth for the mandatory standards, architectures, and guidelines inherited by every game and feature implementation packet. 

By defining this central standard stack, future implementation packets do not need to list every framework document individually, reducing packet complexity and ensuring consistent compliance across the codebase.

---

## 2. Philosophy

- **Convention Over Repetition**: A packet inherits the entire stack by default.
- **Inherited Unless Overridden**: Standards are assumed to be fully active unless a packet explicitly overrides a specific rule with an approved freeze variance.
- **Minimal Packet Footprint**: Feature packets should specify only their unique mechanics, assets, and validation requirements, relying on this stack for process and platform consistency.

---

## 3. Mandatory Platform Standards

Every implementation must strictly comply with the following platform interface and design guidelines:

- **NB-ACTIVITY-STANDARD-001**: Defines activity UI zones, lifecycle checkpoints, and non-punitive feedback.
- **ACTIVITY_ARCHITECTURE.md**: Specifies iframe execution boundaries, app state models, parent-learner message channels, and database seeds.
- **ACTIVITY_SHELL.md**: Details how activities integrate visually and programmatically within the SIRAASH viewport container.
- **COMPONENT_STANDARDS.md**: Controls reusable styles, color tokens, visual contrast, focus rings, and touch sizes.
- **LAYOUT_STANDARDS.md**: Governs viewport margins, scrolling constraints, and element flow boundaries.
- **FEEDBACK_AND_TIMING_STANDARD.md**: Mandates precise dwell, sound, and animation timing for correct and incorrect answers.
- **VISUAL_TOKENS.md**: Authoritative design system palette, font sizes, grid layouts, and padding rules.
- **SHARED_ACTIVITY_COMPONENTS.md**: Specifies utility functions for generating standard buttons, headings, and lists.

---

## 4. Mandatory Process Standards

Every packet lifecycle must conform to the project's delivery flow:

- **NB-STD-001**: NeuroBridge Delivery Standard (process controls, check-pointing, handoff rules).
- **NB-STD-002**: Codex Packet Template (formatting requirements for feature packets).
- **NB-STD-003**: Codex Completion Template (closure notes and documentation standards).
- **DELIVERY_STANDARDS.md**: Canonical workflow defining roles, priority gates, and status values.
- **DEFINITION_OF_DONE.md**: Criteria check-off lists (tests, audits, and validations) required to mark any task Complete.
- **RELEASE_CHECKLIST.md**: Steps required before merging or deploying software increments.
- **TESTING.md**: Standard testing practices, directory mappings, test runners, and regression guards.
- **ACCEPTANCE_CRITERIA_TEMPLATE.md**: Standard structure for documenting verified test cases.

---

## 5. Mandatory Worksheet Standards

Activities executing under the worksheet metaphor must inherit standard worksheet layouts and builders:

- **WORKSHEET_ARCHITECTURE.md**: Renders the outer shell, matching layout structures, and feedback card slots.
- **WORKSHEET_TEMPLATE.md**: Authoritative string builder and DOM factory for result summary screens.
- **WORKSHEET_ACTIVITY_TEMPLATE.md**: Guidelines for creating standardized worksheets with consistent grids and choice elements.

---

## 6. Mandatory Architecture Standards

Every implementation must align with active platform-wide architectural contracts:

- **NB-ARCH-004**: Activity Skill Mapping Contract (maps activity IDs, levels, modes, and scaffolds directly to cognitive targets in the registry).
- *Future architecture contracts* (e.g. centralized progression services, shared state stores) are automatically inherited upon freeze approval.

---

## 7. Packet Rule

To keep documentation clean and prevent references duplication, future feature implementation packets should normally reference only:

- **CODEX_CONTEXT_PREFIX.md** (if available, for local session settings).
- **Activity Freeze Document** (e.g. `docs/DIR-FREEZE-001.md`).
- **Activity Test Plan** (e.g. `docs/DIR-TEST-001.md`).
- **Activity Implementation Plan** (e.g. `docs/DIR-IMPLEMENTATION-PLAN-001.md`).

All other standard documents are inherited automatically via **NB-STD-004**.

---

## 8. Out Of Scope

- Redefining, editing, or overriding any of the referenced standards in this document. Any change to inherited standards must occur directly within the target standard files themselves.
