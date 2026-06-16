/**
 * Unit tests for Attribute Explorer delayed help nudge behavior.
 */

import {
    HELP_NUDGE_DELAY_MS,
    createHelpNudgeController,
    getDelayedHelpPrompt,
    getInitialHelpPrompt
} from '../helpNudge.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createFakeTimerHarness() {
    let pendingTimer = null;
    let timerId = 0;

    return {
        setTimeoutFn(callback, delayMs) {
            timerId++;
            pendingTimer = {
                id: timerId,
                callback,
                delayMs
            };
            return timerId;
        },
        clearTimeoutFn(id) {
            if (pendingTimer?.id === id) {
                pendingTimer = null;
            }
        },
        flushTimer() {
            const timer = pendingTimer;
            pendingTimer = null;
            timer?.callback();
        },
        getPendingTimer() {
            return pendingTimer;
        }
    };
}

function testInitialPrompt() {
    assert(getInitialHelpPrompt('Adarsh') === 'Need a clue, Adarsh? 🌱', 'Initial prompt must be compact and non-nudging');
    assert(getDelayedHelpPrompt('Adarsh') === 'Adarsh, SIRAASH can help you 🌱', 'Delayed prompt must use SIRAASH nudge text');

    console.log('Initial and delayed prompt text test passed');
}

function testNudgeIsNotActiveImmediately() {
    const timer = createFakeTimerHarness();
    const controller = createHelpNudgeController({
        setTimeoutFn: timer.setTimeoutFn,
        clearTimeoutFn: timer.clearTimeoutFn,
        onActivate: () => {}
    });

    controller.start(() => true);

    assert(controller.getState().hasPendingTimer === true, 'Nudge timer should be pending after start');
    assert(controller.getState().isActive === false, 'Nudge must not be active immediately');
    assert(timer.getPendingTimer().delayMs === HELP_NUDGE_DELAY_MS, 'Nudge should use configured delay');

    console.log('Nudge inactive immediately test passed');
}

function testNudgeActivatesAfterTimerCallback() {
    const timer = createFakeTimerHarness();
    let activationCount = 0;
    const controller = createHelpNudgeController({
        setTimeoutFn: timer.setTimeoutFn,
        clearTimeoutFn: timer.clearTimeoutFn,
        onActivate: () => {
            activationCount++;
        }
    });

    controller.start(() => true);
    timer.flushTimer();

    assert(activationCount === 1, 'Nudge should activate after timer callback');
    assert(controller.getState().isActive === true, 'Nudge state should be active after callback');
    assert(controller.getState().hasPendingTimer === false, 'Timer should not remain pending after activation');

    console.log('Nudge activates after timer callback test passed');
}

function testNudgeDoesNotActivateWhenBlocked() {
    const timer = createFakeTimerHarness();
    let activationCount = 0;
    const controller = createHelpNudgeController({
        setTimeoutFn: timer.setTimeoutFn,
        clearTimeoutFn: timer.clearTimeoutFn,
        onActivate: () => {
            activationCount++;
        }
    });

    controller.start(() => false);
    timer.flushTimer();

    assert(activationCount === 0, 'Nudge should not activate when answer/help already happened');
    assert(controller.getState().isActive === false, 'Nudge state should remain inactive when blocked');

    console.log('Nudge blocked activation test passed');
}

function testNudgeStopsOnAnswerOrHelp() {
    const timer = createFakeTimerHarness();
    let activationCount = 0;
    const controller = createHelpNudgeController({
        setTimeoutFn: timer.setTimeoutFn,
        clearTimeoutFn: timer.clearTimeoutFn,
        onActivate: () => {
            activationCount++;
        }
    });

    controller.start(() => true);
    controller.stop();
    timer.flushTimer();

    assert(activationCount === 0, 'Stopped nudge should not activate');
    assert(controller.getState().isActive === false, 'Stopped nudge should be inactive');
    assert(controller.getState().hasPendingTimer === false, 'Stopped nudge should clear pending timer');

    console.log('Nudge stops on answer or help test passed');
}

function testNudgeResetsOnNextTrial() {
    const timer = createFakeTimerHarness();
    let activationCount = 0;
    const controller = createHelpNudgeController({
        setTimeoutFn: timer.setTimeoutFn,
        clearTimeoutFn: timer.clearTimeoutFn,
        onActivate: () => {
            activationCount++;
        }
    });

    controller.start(() => true);
    timer.flushTimer();
    assert(controller.getState().isActive === true, 'First trial nudge should activate');

    controller.start(() => true);
    assert(controller.getState().isActive === false, 'Starting next trial should reset active nudge');
    assert(controller.getState().hasPendingTimer === true, 'Next trial should schedule a fresh nudge timer');

    console.log('Nudge resets on next trial test passed');
}

function runAllTests() {
    console.log('=== Attribute Explorer Help Nudge Unit Tests ===');
    testInitialPrompt();
    testNudgeIsNotActiveImmediately();
    testNudgeActivatesAfterTimerCallback();
    testNudgeDoesNotActivateWhenBlocked();
    testNudgeStopsOnAnswerOrHelp();
    testNudgeResetsOnNextTrial();
    console.log('=== All Attribute Explorer Help Nudge Tests Passed ===');
}

export { runAllTests };
