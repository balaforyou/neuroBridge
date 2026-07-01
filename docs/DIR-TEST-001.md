# DIR-TEST-001

## Directions V1 Test Plan

Status: Frozen

Scope source: `docs/DIR-FREEZE-001.md`

---

## 1. Purpose

This document defines the comprehensive verification plan for the Directions V1 activity family. It establishes functional, learner journey, regression, accessibility, and telemetry metrics validation before implementation begins.

---

## 2. Test Philosophy

- **Small Independent Packets**: Break down tests into isolated units (e.g. prompt rendering, target matching, scaffold state checks) to facilitate incremental debugging.
- **Regression Protection**: Enforce checklists and automation criteria to safeguard core SIRAASH shell and telemetry systems against regressions.
- **Learner-First Validation**: Prioritize tests evaluating visual clarity, predictable pacing, non-punitive feedback, and screen persistence.
- **Manual Observation Complements Automation**: Combine automated browser tests (which verify DOM states and payloads) with parent observation checklists (which verify engagement, comprehension, and frustration levels).

---

## 3. Unit Tests

| Test ID | Area / Scenario | Expected Result |
| --- | --- | --- |
| DIR-UT-001 | Direction Generation | Generates a valid target direction (Up, Down, Left, or Right) matching the session constraints. |
| DIR-UT-002 | Choice Generation | Generates four unique option cards including the correct target. |
| DIR-UT-003 | Correct Selection | Validates target selection, updates session corrects, captures response time, and advances trial progress. |
| DIR-UT-004 | Incorrect Selection | Registers the mistake, updates mistakes count, and allows retry without auto-advancing the trial. |
| DIR-UT-005 | Session Completion | Confirms that after completing all trials (8-12), accuracy, total mistakes, and average response time are computed correctly. |
| DIR-UT-006 | Telemetry Payload | Formats the final session payload with correct fields (`gameId: "schulte"` family style mapping rules, `accuracy`, `trials`). |
| DIR-UT-007 | Mastery State (Future) | Validates that mastery checks evaluate historical performance stability across multiple sessions. |

---

## 4. UI Tests

| Test ID | Element / Interaction | Expected Result |
| --- | --- | --- |
| DIR-UI-001 | Activity Launch | Frame renders inside SIRAASH shell without scrolling, navigation, or shell alignment regressions. |
| DIR-UI-002 | Arrow Rendering | Arrow asset renders with high contrast and correct visual orientation matching the target. |
| DIR-UI-003 | Prompt Synchronization | Text prompt and audio speech match the target arrow instruction exactly. |
| DIR-UI-004 | Success Feedback | Tap on correct option displays visual local success indicator and plays standard click sound. |
| DIR-UI-005 | Correction Feedback | Tap on incorrect option triggers local orange pulse without displaying red crosses, error buzzers, or error text. |
| DIR-UI-006 | Completion Summary | Renders a persistent result card listing accuracy, corrects, hints, and elapsed time. |
| DIR-UI-007 | Play Again Action | Clicking "Try Again" resets trial progress, seeds a new session, and keeps the activity frame visible. |
| DIR-UI-008 | Home Action | Clicking "Home" returns the learner to the SIRAASH landing page and reveals the landing activity grid. |

---

## 5. Learner Journey Tests

The golden path test covers the complete end-to-end user loop:
1. **Hub**: Learner logs in and sees the Directions tile on the SIRAASH landing hub.
2. **Launch**: Learner taps the tile, opening the Directions activity frame.
3. **Trials**: Learner completes all 10 trials sequentially.
4. **Completion Summary**: Result screen renders immediately after the final trial and persists.
5. **Dwell & Review**: Metrics summary remains visible in the viewport without auto-closing.
6. **Play Again**: Learner clicks "Try Again" to launch a fresh randomized session.
7. **Exit**: Learner clicks "Home" and returns to the landing page.

---

## 6. Scaffold Tests

| Test ID | Scaffold Level | Target Visual cue | expected Result |
| --- | --- | --- | --- |
| DIR-SCA-001 | Level 1 (Full Support) | Target Arrow + Text + Audio | Full visual cues rendered and prompt synchronized. |
| DIR-SCA-002 | Level 2 (Border Cues) | Target Choice Border Highlighted | Border highlight outline guides the selection. |
| DIR-SCA-003 | Level 3 (Word Only) | Direction Word + No Arrow Cue | Learner must read/listen to select without visual arrows. |
| DIR-SCA-004 | Fading Rules | Stable performance check | Supports fade to next level only after meeting target accuracy. |

---

## 7. Analytics Tests

| Test ID | Metric | Capture Criteria |
| --- | --- | --- |
| DIR-AN-001 | Accuracy | Calculated as `(Corrects / Total Trials) * 100`. |
| DIR-AN-002 | Correct Count | Increments by 1 for each trial solved on the first try. |
| DIR-AN-003 | Incorrect Count | Increments for each selection mismatch prior to correct solution. |
| DIR-AN-004 | Direction Type | Trial records store the specific direction tested (Up, Down, Left, Right). |
| DIR-AN-005 | Scaffold State | Stores active cue levels (e.g. `arrow`, `border`, `text-only`) per trial. |
| DIR-AN-006 | Trial Duration | Records time in milliseconds from trial load to correct tap. |
| DIR-AN-007 | Session Status | Marks session as completed and persists to local database. |

---

## 8. Accessibility Tests

- **Keyboard Navigation (Future Ready)**: Check that option cards can be focused and triggered using Tab and Enter/Space keys.
- **Consistent Focus**: Ensure the focus ring is highly visible and does not jump unexpectedly.
- **Large Touch Targets**: Ensure touch targets are at least 44x44px to accommodate fine motor control challenges.
- **No Flashing UI**: Keep transition speeds within safe limits to prevent visual overstimulation.
- **Colour Independence**: Use clear layout positions, texts, or icons so color coding is not the sole indicator of correct or wrong answers.

---

## 9. Regression Checklist

During Directions integration, the following platform behaviors must never regress:
- **[ ] Completion Screen Persistence**: The final result summary must remain visible until the user explicitly selects "Try Again" or "Home".
- **[ ] Prompt Synchronization**: Prompts must never display one direction while playing speech for another.
- **[ ] Duplicate Feedback Elements**: Correct taps must trigger one click feedback; wrong taps must trigger a single orange pulse.
- **[ ] Database Telemetry**: Session details must save correctly to IndexedDB and trigger no dashboard lag.
- **[ ] Shell Integration**: The parent navigation row must be correctly hidden in learner view, and activity-frame dimensions must respect viewport bounds.

---

## 10. Manual Validation Checklist

Parents or researchers should observe the learner and verify:
- **[ ] Comprehension**: Does the learner understand the Up/Down/Left/Right task boundaries without verbal intervention?
- **[ ] Pacing**: Is there any signs of frustration during transition screens or feedback pauses?
- **[ ] Visual Layout**: Can the learner easily scan the options and read the text instructions?
- **[ ] Completion Screen**: Can the learner or parent read the final score, corrects, and timing metrics clearly?
- **[ ] Voice/Audio**: Is the voice volume, quality, and instruction speed comfortable?

---

## 11. Future Playwright Coverage

Add these E2E scenarios to `siraash-smoke.spec.js` once implementation is complete:
- `Directions activity tile exists on landing hub`
- `Directions launches in shell frame with valid DOM hierarchy`
- `Directions processes correct selections and shows standard local feedback`
- `Directions displays persistent completion summary with Try Again and Home buttons`
