# NB-WS-001 Matching Worksheets

This folder is the activity-specific source of truth for Matching Worksheet work.

Current implementation focus:

- `NB-WS-001.2 Attribute Matching Worksheet V1`

Matching Worksheets reuse the existing NeuroBridge Worksheet Shell and activity shell conventions. Global standards remain in the shared documentation stack; this folder keeps the focused Matching Worksheet specs, backlog, and test plan close to the activity family.

Local documents:

- [MATCHING_WORKSHEET_SPEC.md](MATCHING_WORKSHEET_SPEC.md)
- [ATTRIBUTE_MATCHING_V1.md](ATTRIBUTE_MATCHING_V1.md)
- [MATCHING_BACKLOG.md](MATCHING_BACKLOG.md)
- [MATCHING_TEST_PLAN.md](MATCHING_TEST_PLAN.md)
- [CHANGELOG.md](CHANGELOG.md)

## Activity Documents

| Document | Purpose |
| --- | --- |
| [MATCHING_WORKSHEET_SPEC.md](MATCHING_WORKSHEET_SPEC.md) | Activity family specification |
| [ATTRIBUTE_MATCHING_V1.md](ATTRIBUTE_MATCHING_V1.md) | Frozen implementation specification |
| [MATCHING_BACKLOG.md](MATCHING_BACKLOG.md) | Activity-specific backlog |
| [MATCHING_TEST_PLAN.md](MATCHING_TEST_PLAN.md) | Activity-specific testing |
| [CHANGELOG.md](CHANGELOG.md) | Activity history and evolution |

## Activity Documentation Principles

This folder is the primary implementation cockpit for Matching Worksheets.

Global standards remain under `docs/`.

Activity-specific requirements, backlog items, tests, implementation notes and change history should remain inside this folder.

The objective is to keep Matching Worksheet development isolated, lightweight and easy for Codex to load without traversing the full NeuroBridge documentation stack.
