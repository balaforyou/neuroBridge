# CODEX_CONTEXT_PREFIX

## Purpose

The `CODEX_CONTEXT_PREFIX.md` provides the default inherited implementation context for the NeuroBridge platform, reducing manual reference overhead for future implementation packets.

---

## Inheritance Rule

Unless explicitly overridden, all implementation packets inherit the following standards:

### Platform
- **NB-ACTIVITY-STANDARD-001**
- **ACTIVITY_ARCHITECTURE.md**
- **ACTIVITY_SHELL.md**
- **COMPONENT_STANDARDS.md**
- **LAYOUT_STANDARDS.md**
- **FEEDBACK_AND_TIMING_STANDARD.md**
- **VISUAL_TOKENS.md**
- **SHARED_ACTIVITY_COMPONENTS.md**

### Worksheet
- **WORKSHEET_ARCHITECTURE.md**
- **WORKSHEET_TEMPLATE.md**
- **WORKSHEET_ACTIVITY_TEMPLATE.md**

### Process
- **NB-STD-001**
- **NB-STD-002**
- **NB-STD-003**
- **NB-STD-004**
- **NB-STD-005**
- **DELIVERY_STANDARDS.md**
- **DEFINITION_OF_DONE.md**
- **RELEASE_CHECKLIST.md**
- **TESTING.md**

### Architecture
- **NB-ARCH-004**
- *Future NB-ARCH documents inherit automatically.*

---

## Typical Packet

Future packets should normally contain only:

```text
Follow:
- CODEX_CONTEXT_PREFIX.md
- Activity Freeze
- Activity Test Plan
- Activity Implementation Plan
```

---

## Override Rule

Feature packets may override inherited standards only when explicitly documented inside their active package instructions.
