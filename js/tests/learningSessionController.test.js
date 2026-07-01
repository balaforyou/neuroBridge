import { createLearningSessionController } from '../learningSessionController.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createMocks() {
    let successOptions = null;
    let mistakeOptions = null;
    let pipelineCleared = false;
    let pipelineBusy = false;
    let successCalled = false;
    let mistakeCalled = false;

    const outcomePipeline = {
        handleSuccess(options) {
            successCalled = true;
            successOptions = options;
            if (options && typeof options.onComplete === 'function') {
                // Instantly call onComplete callback for testing
                options.onComplete();
            }
        },
        handleMistake(options) {
            mistakeCalled = true;
            mistakeOptions = options;
            if (options && typeof options.onComplete === 'function') {
                options.onComplete();
            }
        },
        clear() {
            pipelineCleared = true;
            successOptions = null;
            mistakeOptions = null;
            pipelineBusy = false;
            successCalled = false;
            mistakeCalled = false;
        },
        isBusy() {
            return pipelineBusy;
        },
        setBusy(b) {
            pipelineBusy = b;
        },
        getSuccessOptions: () => successOptions,
        getMistakeOptions: () => mistakeOptions,
        isCleared: () => pipelineCleared,
        wasSuccessCalled: () => successCalled,
        wasMistakeCalled: () => mistakeCalled
    };

    let summaryShown = null;
    let surfaceHidden = false;

    const completionSurface = {
        showSummary(summary) {
            summaryShown = summary;
        },
        hide() {
            surfaceHidden = true;
        },
        getSummary: () => summaryShown,
        isSecondaryHidden: () => surfaceHidden
    };

    return { outcomePipeline, completionSurface };
}

function testInitialization() {
    const { outcomePipeline } = createMocks();
    const controller = createLearningSessionController({
        totalRounds: 3,
        currentLevel: 2,
        outcomePipeline
    });

    const state = controller.getState();
    assert(state.round === 0, 'Round should initialize to 0 before start');
    assert(state.totalRounds === 3, 'totalRounds should map config');
    assert(state.level === 2, 'level should map config');
    assert(state.correct === 0, 'correct should initialize to 0');
    assert(state.incorrect === 0, 'incorrect should initialize to 0');
    assert(state.started === false, 'started should initialize to false');
    assert(state.completed === false, 'completed should initialize to false');
    console.log('testInitialization passed');
}

function testStartFlow() {
    const { outcomePipeline } = createMocks();
    let roundStarted = null;
    let roundRendered = null;

    const controller = createLearningSessionController({
        totalRounds: 3,
        outcomePipeline,
        onRoundStart: (r) => { roundStarted = r; },
        onRenderRound: (r) => { roundRendered = r; }
    });

    controller.start();
    const state = controller.getState();
    assert(state.started === true, 'started must be true after start');
    assert(state.round === 1, 'round must be 1 after start');
    assert(roundStarted === 1, 'onRoundStart callback should receive round 1');
    assert(roundRendered === 1, 'onRenderRound callback should receive round 1');
    console.log('testStartFlow passed');
}

function testSubmitResultCorrectAndProgression() {
    const { outcomePipeline } = createMocks();
    let roundCompleted = null;
    let nextRoundStarted = null;

    const controller = createLearningSessionController({
        totalRounds: 3,
        outcomePipeline,
        onRoundComplete: (r) => { roundCompleted = r; },
        onRoundStart: (r) => { nextRoundStarted = r; }
    });

    controller.start();
    controller.submitResult({ correct: true });

    const state = controller.getState();
    assert(state.correct === 1, 'correct count should increment');
    assert(roundCompleted === 1, 'onRoundComplete callback should be called for round 1');
    assert(state.round === 2, 'round should advance to 2');
    assert(nextRoundStarted === 2, 'onRoundStart should fire for round 2');
    console.log('testSubmitResultCorrectAndProgression passed');
}

function testSubmitResultIncorrectDelegation() {
    const { outcomePipeline } = createMocks();
    const controller = createLearningSessionController({
        totalRounds: 3,
        outcomePipeline
    });

    controller.start();
    controller.submitResult({ correct: false });

    const state = controller.getState();
    assert(state.incorrect === 1, 'incorrect count should increment');
    assert(state.round === 1, 'round should not advance on mistake');
    assert(outcomePipeline.wasMistakeCalled() === true, 'outcomePipeline.handleMistake should be called');
    console.log('testSubmitResultIncorrectDelegation passed');
}

function testSessionCompletionFlow() {
    const { outcomePipeline, completionSurface } = createMocks();
    let sessionCompleted = false;

    const controller = createLearningSessionController({
        totalRounds: 2,
        outcomePipeline,
        completionSurface,
        onSessionComplete: () => { sessionCompleted = true; }
    });

    controller.start();
    controller.submitResult({ correct: true }); // Round 1 done
    controller.submitResult({ correct: true }); // Round 2 done (session completed)

    const state = controller.getState();
    assert(state.completed === true, 'completed state must be true');
    assert(sessionCompleted === true, 'onSessionComplete callback must fire');
    assert(completionSurface.getSummary().accuracyPercent === 100, 'Accuracy should be 100%');
    console.log('testSessionCompletionFlow passed');
}

function testValidationGuards() {
    const { outcomePipeline } = createMocks();
    const controller = createLearningSessionController({
        totalRounds: 2,
        outcomePipeline
    });

    // Guard 1: Not started
    controller.submitResult({ correct: true });
    assert(controller.getState().correct === 0, 'Should ignore submissions when not started');

    // Guard 2: Pipeline busy
    controller.start();
    outcomePipeline.setBusy(true);
    controller.submitResult({ correct: true });
    assert(controller.getState().correct === 0, 'Should ignore submissions when pipeline is busy');

    // Guard 3: Already completed
    outcomePipeline.setBusy(false);
    controller.submitResult({ correct: true }); // Round 1
    controller.submitResult({ correct: true }); // Round 2 (session completed)
    assert(controller.getState().completed === true, 'Session should be completed');

    controller.submitResult({ correct: true }); // Additional submission after completion
    assert(controller.getState().correct === 2, 'Should ignore submissions after session completes');
    console.log('testValidationGuards passed');
}

function testRestartResetAndDestroy() {
    const { outcomePipeline, completionSurface } = createMocks();
    const controller = createLearningSessionController({
        totalRounds: 2,
        outcomePipeline,
        completionSurface
    });

    controller.start();
    controller.submitResult({ correct: true });

    // Test restart
    controller.restart();
    let state = controller.getState();
    assert(state.round === 1, 'Restart should return round to 1');
    assert(state.correct === 0, 'Restart should reset correct counter');

    // Test reset
    controller.reset();
    state = controller.getState();
    assert(state.started === false, 'Reset should mark started as false');
    assert(state.round === 0, 'Reset should reset round back to 0');
    assert(outcomePipeline.isCleared() === true, 'Reset should clear outcome pipeline');

    // Test destroy
    controller.start();
    controller.destroy();
    assert(controller.getState().started === false, 'Destroy should reset the state');
    console.log('testRestartResetAndDestroy passed');
}

export function runAllTests() {
    console.log('=== Learning Session Controller Unit Tests ===');
    testInitialization();
    testStartFlow();
    testSubmitResultCorrectAndProgression();
    testSubmitResultIncorrectDelegation();
    testSessionCompletionFlow();
    testValidationGuards();
    testRestartResetAndDestroy();
    console.log('=== All Learning Session Controller Unit Tests Passed ===');
}
