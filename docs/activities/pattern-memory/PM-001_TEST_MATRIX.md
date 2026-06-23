# PM-001 Pattern Memory Test Matrix

## 1. Purpose

Define the expected test coverage for Pattern Memory implementation packets.

The test matrix should guide future implementation of:

- Copy Mode
- Memory Mode
- Scaffolds
- Adaptive progression
- Analytics evidence
- Completion behavior

## 2. Testing Philosophy

Pattern Memory tests should verify:

- Learner flow is calm and predictable.
- Level progression and scaffold progression remain separate.
- Difficulty remains stable within a session.
- Adaptive decisions occur between sessions.
- Scaffolded and independent success are distinguishable.
- Analytics preserve the experience-slice model.
- Existing NeuroBridge shell behavior remains unchanged.

## 3. Functional Test Matrix

### Copy Mode

| Test ID | Scenario | Expected Result |
| ------- | -------- | --------------- |
| PM-TC-COPY-001 | Start C1, 2x2, 1 color, 1 filled cell | Pattern visible; blank grid available; learner can copy tile |
| PM-TC-COPY-002 | Correct tile selected | Immediate positive feedback; answer accepted |
| PM-TC-COPY-003 | Incorrect tile selected | Immediate gentle correction; learner can correct |
| PM-TC-COPY-004 | C7+ two-color pattern | Color palette appears; selected color applies to tapped cell |
| PM-TC-COPY-005 | C14-C16 elite copy level | Pattern visible; immediate feedback; no default extra hints |
| PM-TC-COPY-006 | Complete 10 questions | Standard result screen appears and persists |

### Memory Mode

| Test ID | Scenario | Expected Result |
| ------- | -------- | --------------- |
| PM-TC-MEM-001 | Start M1 with Ready Button | Pattern remains visible until learner selects Ready |
| PM-TC-MEM-002 | Select Ready | Pattern disappears; blank grid appears |
| PM-TC-MEM-003 | Reconstruct correct pattern | Submission accepted as correct |
| PM-TC-MEM-004 | Reconstruct incorrect pattern | Result shows incorrect after submission, not during reconstruction |
| PM-TC-MEM-005 | M3-M6 10s display | Ready Button + 10s display behavior works |
| PM-TC-MEM-006 | M7-M9 reduced display | Ready Button + reduced display duration works |
| PM-TC-MEM-007 | M10-M13 timed display | Timed display works without extra hints by default |
| PM-TC-MEM-008 | M14-M16 elite memory | No Ready Button; automatic timed display; no default optional scaffold |
| PM-TC-MEM-009 | Complete 10 questions | Standard result screen appears and persists |

## 4. Boundary Test Matrix

| Test ID | Scenario | Expected Result |
| ------- | -------- | --------------- |
| PM-TC-BND-001 | Minimum grid 2x2, 1 filled cell | Renders correctly |
| PM-TC-BND-002 | 2x2 max filled cells = 2 | Renders correctly |
| PM-TC-BND-003 | 3x3 max filled cells = 4 | Renders correctly |
| PM-TC-BND-004 | 4x4 max filled cells = 8 | Renders correctly |
| PM-TC-BND-005 | Three-color pattern | Blue, Red, Green all render and can be selected |
| PM-TC-BND-006 | Shortest display duration 2s | Pattern hides correctly after 2s |
| PM-TC-BND-007 | Pattern generator creates adjacent cells | Accepted |
| PM-TC-BND-008 | Pattern generator creates full row/column | Accepted |
| PM-TC-BND-009 | Pattern generator creates symmetric/corner layout | Accepted |

## 5. Scaffold Test Matrix

| Test ID | Scenario | Expected Result |
| ------- | -------- | --------------- |
| PM-TC-SCF-001 | Ready Button enabled | Learner controls when pattern disappears |
| PM-TC-SCF-002 | Ready Button removed | Pattern hides automatically |
| PM-TC-SCF-003 | Extended Display Time | Pattern remains visible for configured duration |
| PM-TC-SCF-004 | Peek Support used | Pattern briefly reappears once |
| PM-TC-SCF-005 | Peek Support exhausted | Learner cannot peek again on same question |
| PM-TC-SCF-006 | Cell Count Hint | Total colored cells shown without positions |
| PM-TC-SCF-007 | Color Reminder | Used colors shown without positions |
| PM-TC-SCF-008 | Immediate Feedback in Copy Mode | Gentle correction appears immediately |
| PM-TC-SCF-009 | Submission Review in Memory Mode | Correct, missing, and extra cells shown after submission |
| PM-TC-SCF-010 | Mistake Replay | Learner answer and correct answer can be compared |
| PM-TC-SCF-011 | Ready Button in Copy Mode | Ready Button is not shown in Copy Mode |
| PM-TC-SCF-012 | Peek Support in Copy Mode | Peek Support is not available in Copy Mode |
| PM-TC-SCF-013 | Memory-only scaffold assigned to Copy Track | Memory-only scaffold is rejected or ignored for Copy Mode |

## 6. Adaptive Progression Test Matrix

| Test ID | Scenario | Expected Result |
| ------- | -------- | --------------- |
| PM-TC-ADP-001 | Accuracy >= 85% for two sessions | Level becomes eligible for promotion |
| PM-TC-ADP-002 | Accuracy 60%-84% | Level maintained |
| PM-TC-ADP-003 | Accuracy < 60% | Fallback to previously mastered level may occur |
| PM-TC-ADP-004 | Accuracy < 60% for two sessions | Scaffold support may be added without level change |
| PM-TC-ADP-005 | Accuracy > 90% for three sessions | Scaffold support may be removed |
| PM-TC-ADP-006 | Scaffold removed | Level remains unchanged |
| PM-TC-ADP-007 | Level promoted | Scaffold state does not automatically reset unless specified |
| PM-TC-ADP-008 | Session in progress | Difficulty does not change mid-session |
| PM-TC-ADP-009 | Accuracy < 60% at C1 or M1 | Scaffold support is added or maintained instead of reducing level |

## 7. Analytics Test Matrix

| Test ID | Scenario | Expected Result |
| ------- | -------- | --------------- |
| PM-TC-ANL-001 | Copy trial completed | Trial captures activity, mode, level, scaffold state |
| PM-TC-ANL-002 | Memory trial completed | Trial captures display duration and reconstruction result |
| PM-TC-ANL-003 | Scaffold used | Scaffold state is included in evidence context |
| PM-TC-ANL-004 | Independent success | Evidence weight can be distinguished from scaffolded success |
| PM-TC-ANL-005 | Session completed | Standard session metrics captured |
| PM-TC-ANL-006 | Parent summary generated later | Copy and Memory tracks remain separate |
| PM-TC-ANL-007 | Experience slice emitted | Includes activity + mode + level + progressionStage + scaffoldState |
| PM-TC-ANL-008 | Best recall calculated later | Best independent and scaffolded recall are distinguishable |

## 8. UI / UX Test Matrix

| Test ID | Scenario | Expected Result |
| ------- | -------- | --------------- |
| PM-TC-UX-001 | Activity loads | One clear learner instruction visible |
| PM-TC-UX-002 | Color palette visible | Palette is touch-friendly and clearly selected |
| PM-TC-UX-003 | Grid renders | No clipped cells or overlap |
| PM-TC-UX-004 | Feedback appears | Feedback is visible and calm |
| PM-TC-UX-005 | Desktop viewport | Layout works without horizontal scroll |
| PM-TC-UX-006 | Tablet viewport | Layout works without horizontal scroll |
| PM-TC-UX-007 | Completion screen | Great work message, accuracy, score, and actions visible |
| PM-TC-UX-008 | Completion screen | Does not auto-disappear or auto-navigate |

## 9. Accessibility / Touch Test Matrix

| Test ID | Scenario | Expected Result |
| ------- | -------- | --------------- |
| PM-TC-A11Y-001 | Grid cells are interactive | Each cell has clear accessible name |
| PM-TC-A11Y-002 | Color palette controls | Controls have accessible labels |
| PM-TC-A11Y-003 | Feedback state | Feedback does not rely on color only |
| PM-TC-A11Y-004 | Keyboard/focus state | Focus remains visible |
| PM-TC-A11Y-005 | Touch interaction | Grid and palette controls are large enough for touch |

## 10. Regression Guard Matrix

| Test ID | Scenario | Expected Result |
| ------- | -------- | --------------- |
| PM-TC-REG-001 | Existing Number Bridges activity | Behavior unchanged |
| PM-TC-REG-002 | Existing Schulte activity | Behavior unchanged |
| PM-TC-REG-003 | Existing Attribute Explorer activity | Behavior unchanged |
| PM-TC-REG-004 | Shared result screen | Existing consumers remain compatible |
| PM-TC-REG-005 | Activity shell | Existing shell behavior remains stable |
| PM-TC-REG-006 | Parent dashboard placeholders | Existing dashboard behavior unchanged |

## 11. Implementation Packet Coverage

Future implementation packets should reference this matrix.

Suggested packet mapping:

| Packet | Required Test Areas |
| ------ | ------------------- |
| PM-001.1 Copy Mode | Functional, Boundary, UI, Accessibility, Regression |
| PM-001.2 Memory Mode | Functional, Boundary, Scaffold, UI, Accessibility, Regression |
| PM-001.3 Adaptive Scaffolds | Scaffold, Adaptive, Analytics |
| PM-001.4 Analytics | Analytics, Regression |
| PM-001.5 Parent Controls | UI, Accessibility, Analytics, Regression |

## 12. Out of Scope

Do not:

- Implement tests now.
- Implement gameplay now.
- Modify UI.
- Modify analytics payloads.
- Modify shared shell behavior.
- Modify existing activities.
- Create backlog items.

Documentation only.

## Acceptance Checks

- PM-001_TEST_MATRIX.md created.
- Copy Mode test matrix documented.
- Memory Mode test matrix documented.
- Boundary tests documented.
- Scaffold tests documented.
- Adaptive progression tests documented.
- Analytics tests documented.
- UI / UX tests documented.
- Accessibility tests documented.
- Regression guards documented.
- Implementation packet coverage documented.
- No application code changes.
