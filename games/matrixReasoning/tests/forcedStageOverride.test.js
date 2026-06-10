/**
 * Unit tests for Matrix Reasoning forced stage override behavior.
 *
 * Tests run independently of UI rendering and validate:
 * - Auto uses existing adaptive behavior
 * - Forced stage selects requested stage during parent sandbox
 * - Student mode ignores forced override
 */

import { resolveForcedStageOverride } from '../stages/forcedStageOverride.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testAutoUsesExistingBehavior() {
    const rules = { forcedStageOverride: 0 };
    const stage = resolveForcedStageOverride(rules, true);
    assert(stage === 0, 'Auto mode should not force a stage in parent sandbox');

    const studentStage = resolveForcedStageOverride({ forcedStageOverride: 3 }, false);
    assert(studentStage === 0, 'Student mode should ignore forced override');

    console.log('✓ Auto Uses Existing Behavior Test passed');
}

function testForcedStageSelectsRequestedStage() {
    for (let forced = 1; forced <= 5; forced++) {
        const rules = { forcedStageOverride: forced };
        const stage = resolveForcedStageOverride(rules, true);
        assert(stage === forced, `Forced stage ${forced} should be selected in parent sandbox`);
    }

    console.log('✓ Forced Stage Selects Requested Stage Test passed');
}

function testStudentModeIgnoresForcedOverride() {
    const rules = { forcedStageOverride: 4 };
    const stage = resolveForcedStageOverride(rules, false);
    assert(stage === 0, 'Student mode must ignore forced override and remain adaptive');

    console.log('✓ Student Mode Ignores Forced Override Test passed');
}

function runAllTests() {
    console.log('=== Forced Stage Override Unit Tests ===');
    testAutoUsesExistingBehavior();
    testForcedStageSelectsRequestedStage();
    testStudentModeIgnoresForcedOverride();
    console.log('=== All Forced Stage Override Tests Passed ✓ ===');
}

export { runAllTests };