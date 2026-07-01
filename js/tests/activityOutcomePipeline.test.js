import { createActivityOutcomePipeline } from '../activityOutcomePipeline.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createMocks() {
    let successMessage = null;
    let mistakeMessage = null;
    let feedbackCleared = false;
    
    const feedback = {
        showSuccess(msg) {
            successMessage = msg;
        },
        showMistake(msg) {
            mistakeMessage = msg;
        },
        clear() {
            feedbackCleared = true;
            successMessage = null;
            mistakeMessage = null;
        },
        getSuccessMessage: () => successMessage,
        getMistakeMessage: () => mistakeMessage,
        isCleared: () => feedbackCleared,
        resetMock: () => {
            successMessage = null;
            mistakeMessage = null;
            feedbackCleared = false;
        }
    };

    let indicatorOptions = null;
    let indicatorCleared = false;
    let indicatorVisible = false;

    const successIndicator = {
        show(options) {
            indicatorOptions = options;
            indicatorVisible = true;
        },
        clear() {
            indicatorCleared = true;
            indicatorOptions = null;
            indicatorVisible = false;
        },
        isVisible() {
            return indicatorVisible;
        },
        getOptions: () => indicatorOptions,
        isCleared: () => indicatorCleared,
        resetMock: () => {
            indicatorOptions = null;
            indicatorCleared = false;
            indicatorVisible = false;
        }
    };

    return { feedback, successIndicator };
}

function testHandleSuccessFlow() {
    const { feedback, successIndicator } = createMocks();
    const pipeline = createActivityOutcomePipeline({ feedback, successIndicator });

    let completed = false;
    pipeline.handleSuccess({
        message: 'Correct Answer!',
        mode: 'surface',
        durationMs: 5,
        onComplete: () => {
            completed = true;
        }
    });

    assert(feedback.getSuccessMessage() === 'Correct Answer!', 'Feedback showSuccess should be called');
    assert(successIndicator.getOptions()?.message === 'Correct Answer!', 'Success indicator should be shown');
    assert(pipeline.isBusy() === true, 'Pipeline must be busy during active timer');

    setTimeout(() => {
        assert(completed === true, 'onComplete callback must be executed');
        assert(pipeline.isBusy() === false, 'Pipeline must be free after completion');
        console.log('testHandleSuccessFlow passed');
    }, 30);
}

function testHandleMistakeFlow() {
    const { feedback, successIndicator } = createMocks();
    const pipeline = createActivityOutcomePipeline({ feedback, successIndicator });

    let completed = false;
    pipeline.handleMistake({
        message: 'Wrong Choice',
        mode: 'immediate',
        durationMs: 5,
        onComplete: () => {
            completed = true;
        }
    });

    assert(feedback.getMistakeMessage() === 'Wrong Choice', 'Feedback showMistake should be called');
    assert(successIndicator.getOptions() === null, 'Mistake must not trigger success indicator');
    assert(pipeline.isBusy() === true, 'Pipeline must be busy');

    setTimeout(() => {
        assert(completed === true, 'onComplete should fire');
        assert(pipeline.isBusy() === false, 'Pipeline should reset busy state');
        console.log('testHandleMistakeFlow passed');
    }, 30);
}

function testManualMode() {
    const { feedback, successIndicator } = createMocks();
    const pipeline = createActivityOutcomePipeline({ feedback, successIndicator });

    let completed = false;
    pipeline.handleSuccess({
        message: 'Manual success',
        mode: 'manual',
        onComplete: () => {
            completed = true;
        }
    });

    assert(feedback.getSuccessMessage() === 'Manual success', 'Feedback should render');
    assert(pipeline.isBusy() === false, 'Busy must transition to false immediately in manual mode');
    
    setTimeout(() => {
        assert(completed === false, 'onComplete must not be called in manual mode');
        console.log('testManualMode passed');
    }, 30);
}

function testUnsupportedModeThrows() {
    const { feedback } = createMocks();
    const pipeline = createActivityOutcomePipeline({ feedback });

    let threw = false;
    try {
        pipeline.handleSuccess({ mode: 'invalid-mode' });
    } catch (e) {
        threw = true;
        assert(e.message.includes('Unsupported outcome pipeline mode'), 'Should throw clear mode error');
    }
    assert(threw, 'Invalid mode must throw an error');
    console.log('testUnsupportedModeThrows passed');
}

function testClearLifecycle() {
    const { feedback, successIndicator } = createMocks();
    const pipeline = createActivityOutcomePipeline({ feedback, successIndicator });

    pipeline.handleSuccess({
        message: 'Test clear',
        mode: 'surface',
        durationMs: 50
    });

    pipeline.clear();
    assert(pipeline.isBusy() === false, 'isBusy must be false after clear');
    assert(feedback.isCleared() === true, 'Feedback clear should be triggered');
    assert(successIndicator.isCleared() === true, 'Success indicator clear should be triggered');
    console.log('testClearLifecycle passed');
}

function testBusyGuardPreventsDuplicates() {
    const { feedback } = createMocks();
    const pipeline = createActivityOutcomePipeline({ feedback });

    pipeline.handleSuccess({
        message: 'First call',
        durationMs: 20
    });

    assert(feedback.getSuccessMessage() === 'First call', 'First call should render');
    feedback.resetMock();

    pipeline.handleSuccess({
        message: 'Second call ignored',
        durationMs: 20
    });

    assert(feedback.getSuccessMessage() === null, 'Second call must be ignored while pipeline is busy');
    console.log('testBusyGuardPreventsDuplicates passed');
}

function testPipelineWithoutFeedbackOrIndicator() {
    const pipeline = createActivityOutcomePipeline();

    let completed = false;
    // Should run safely without throwing errors due to missing instances
    pipeline.handleSuccess({
        message: 'Safe test',
        durationMs: 5,
        onComplete: () => {
            completed = true;
        }
    });

    setTimeout(() => {
        assert(completed === true, 'onComplete should fire safely');
        console.log('testPipelineWithoutFeedbackOrIndicator passed');
    }, 30);
}

export function runAllTests() {
    console.log('=== Activity Outcome Pipeline Unit Tests ===');
    testHandleSuccessFlow();
    testHandleMistakeFlow();
    testManualMode();
    testUnsupportedModeThrows();
    testClearLifecycle();
    testBusyGuardPreventsDuplicates();
    testPipelineWithoutFeedbackOrIndicator();
    console.log('=== All Activity Outcome Pipeline Unit Tests Passed ===');
}
