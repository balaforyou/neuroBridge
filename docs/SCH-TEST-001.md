# SCH-TEST-001

## Schulte Family V1 Test Matrix

Status: Frozen

Scope source: `SCH-FREEZE-001`

## Happy Path Tests

| ID | Scenario | Expected Result |
| --- | --- | --- |
| SCH-HP-001 | Start first Learning Path Schulte session | Learner receives a 3x3 Ascending board. |
| SCH-HP-002 | Complete 3x3 Ascending in order with zero misses | Board completes, accuracy is 100%, completion time is captured, and success sound is triggered. |
| SCH-HP-003 | Complete a Level 1 or Level 2 session | Session contains exactly two visual boards. |
| SCH-HP-004 | Complete a Level 3+ session | Session contains Board 1 Visual, Board 2 Visual, and Board 3 Listen & Find. |
| SCH-HP-005 | Progression reaches required readiness after ascending and descending mastery and fluency | Next grid size unlocks only after both variants satisfy mastery and fluency. |

## Mode Tests

| ID | Scenario | Expected Result |
| --- | --- | --- |
| SCH-MODE-001 | Ascending mode target sequence | Targets progress from lowest to highest number. |
| SCH-MODE-002 | Descending mode target sequence | Targets progress from highest to lowest number. |
| SCH-MODE-003 | Memory Mode correct selection | Selected cells do not visually change state after selection. |
| SCH-MODE-004 | Memory Mode completion | Learner can complete by internally tracking prior selections. |
| SCH-MODE-005 | Listen & Find board target delivery | Browser audio or TTS speaks the target, such as "Find 7". |
| SCH-MODE-006 | Listen & Find response | Learner selects the spoken target manually; speech recognition is not used. |

## Board Generation Tests

| ID | Scenario | Expected Result |
| --- | --- | --- |
| SCH-BRD-001 | Generate a 3x3 board | Board contains each number 1 through 9 exactly once. |
| SCH-BRD-002 | Generate repeated sessions | Layouts are randomized and do not intentionally repeat. |
| SCH-BRD-003 | Generate supported square grids | 3x3, 4x4, 5x5, and 6x6 square board models are representable by the engine. |
| SCH-BRD-004 | V1 layout rendering | V1 uses square grid layout only. |

## Feedback Tests

| ID | Scenario | Expected Result |
| --- | --- | --- |
| SCH-FBK-001 | Correct selection | Click sound plays. |
| SCH-FBK-002 | Correct selection during Learn or Practice stage | Cell colour may change to support learning. |
| SCH-FBK-003 | Incorrect selection | Gentle orange pulse appears. |
| SCH-FBK-004 | Incorrect selection | No red error, cross mark, or error buzzer appears. |
| SCH-FBK-005 | Perfect board with zero errors | Success sound plays. |
| SCH-FBK-006 | Level advancement | Celebration sound plays. |

## Analytics Tests

| ID | Scenario | Expected Result |
| --- | --- | --- |
| SCH-AN-001 | Complete any board | Accuracy, completion time, misses, mode, grid size, session, mastery state, and fluency state are captured. |
| SCH-AN-002 | Make an incorrect selection and finish | Misses increment and accuracy reflects the miss. |
| SCH-AN-003 | Complete a Practice Lab session | Practice Lab result does not influence mastery, progression, fluency, or official analytics. |
| SCH-AN-004 | Complete a Learning Path session | Learning Path result can contribute to official mastery and fluency observations. |

## Mastery And Fluency Tests

| ID | Scenario | Expected Result |
| --- | --- | --- |
| SCH-MAS-001 | Single perfect session | Mastery is not granted from one session alone. |
| SCH-MAS-002 | Sustained 99% accuracy with stable completion times across sessions | Mastery criteria can be satisfied. |
| SCH-MAS-003 | Natural mastery times cluster around a baseline | Fluency target uses observed baseline rather than an immediate timer. |
| SCH-MAS-004 | Timer before mastery baseline exists | Timer is not introduced as pressure before natural mastery performance is observed. |

## Parent Experience Tests

| ID | Scenario | Expected Result |
| --- | --- | --- |
| SCH-PAR-001 | Parent views Learning Path controls | Parent cannot manually modify progression difficulty. |
| SCH-PAR-002 | Parent experiments with difficulty | Experimentation belongs in Practice Lab. |
| SCH-PAR-003 | Parent uses Practice Lab | Practice Lab remains separate from Learning Path progression. |

## Out Of Scope Guards

| ID | Scenario | Expected Result |
| --- | --- | --- |
| SCH-OOS-001 | Honeycomb layout requested in V1 | Not supported in V1. |
| SCH-OOS-002 | Multiples mode requested in V1 | Not supported in V1. |
| SCH-OOS-003 | Peripheral mode requested in V1 | Not supported in V1. |
| SCH-OOS-004 | Gorbov mode requested in V1 | Not supported in V1. |
| SCH-OOS-005 | Adaptive AI requested in V1 | Not supported in V1. |
| SCH-OOS-006 | Voice recognition requested in V1 | Not supported in V1. |
| SCH-OOS-007 | Custom themes or multiplayer requested in V1 | Not supported in V1. |
