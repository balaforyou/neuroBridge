import {
    COPY_LEVELS,
    PATTERN_MEMORY_QUESTION_COUNT,
    PATTERN_MEMORY_SUCCESS_ADVANCE_DELAY_MS,
    createPatternMemoryCopyGame,
    createPatternMemoryQuestions,
    createPatternMemoryResultSummary,
    createPatternMemorySessionSummary
} from '../game.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createDeterministicRandom() {
    const values = [0.1, 0.7, 0.3, 0.9, 0.2, 0.8];
    let index = 0;
    return () => {
        const value = values[index % values.length];
        index += 1;
        return value;
    };
}

function completeCurrentQuestion(game) {
    const question = game.getCurrentQuestion();
    for (const cellIndex of question.filledCells) {
        game.toggleCell(cellIndex);
    }
    return question;
}

function testCopyLevelsAreConfigured() {
    assert(COPY_LEVELS.length === 4, 'Copy Mode foundation should include C1-C4 only');
    assert(COPY_LEVELS[0].id === 'C1' && COPY_LEVELS[0].gridSize === 2 && COPY_LEVELS[0].filledCells === 1, 'C1 should be 2x2 with one filled cell');
    assert(COPY_LEVELS[1].id === 'C2' && COPY_LEVELS[1].gridSize === 2 && COPY_LEVELS[1].filledCells === 2, 'C2 should be 2x2 with two filled cells');
    assert(COPY_LEVELS[2].id === 'C3' && COPY_LEVELS[2].gridSize === 3 && COPY_LEVELS[2].filledCells === 1, 'C3 should be 3x3 with one filled cell');
    assert(COPY_LEVELS[3].id === 'C4' && COPY_LEVELS[3].gridSize === 3 && COPY_LEVELS[3].filledCells === 2, 'C4 should be 3x3 with two filled cells');
    console.log('Pattern Memory copy levels configuration test passed');
}

function testQuestionGenerationUsesBlueOnlyAndBoundaries() {
    const questions = createPatternMemoryQuestions({
        random: createDeterministicRandom()
    });

    assert(questions.length === PATTERN_MEMORY_QUESTION_COUNT, 'Session should generate ten questions');
    assert(questions.every(question => question.mode === 'copy'), 'Questions should be Copy Mode only');
    assert(questions.every(question => question.colors.length === 1 && question.colors[0] === 'blue'), 'Questions should use blue only');
    assert(questions.some(question => question.levelId === 'C1'), 'Questions should include C1');
    assert(questions.some(question => question.levelId === 'C4'), 'Questions should include C4');
    questions.forEach(question => {
        const maxCellIndex = question.gridSize * question.gridSize - 1;
        assert(question.filledCells.length === question.filledCellCount, `${question.levelId} should use configured filled cells`);
        assert(new Set(question.filledCells).size === question.filledCells.length, `${question.levelId} should not duplicate filled cells`);
        assert(question.filledCells.every(index => index >= 0 && index <= maxCellIndex), `${question.levelId} cells should fit grid`);
    });
    console.log('Pattern Memory question generation boundary test passed');
}

function testCorrectCopyAdvancesAfterFeedback() {
    const game = createPatternMemoryCopyGame({
        questionCount: 2,
        random: createDeterministicRandom(),
        learnerName: 'Adarsh'
    });

    const question = completeCurrentQuestion(game);
    const state = game.getState();

    assert(state.pendingAdvance === true, 'Correct pattern should wait before advancing');
    assert(state.feedbackType === 'success', 'Correct pattern should show success feedback');
    assert(state.feedbackMessage === 'Great work!', 'Correct pattern should use visible success message');
    assert(state.correctAnswers === 1, 'Correct pattern should increment correct answers');
    assert(state.selectedCells.length === question.filledCells.length, 'Selected cells should match copied pattern');

    const advance = game.advanceAfterFeedback();
    assert(advance.result === 'advanced', 'Advance should move to next question');
    assert(advance.state.currentQuestionIndex === 1, 'Current question should advance');
    assert(advance.state.selectedCells.length === 0, 'Target grid should reset after advance');
    console.log('Pattern Memory correct copy advance test passed');
}

function testSuccessDwellTiming() {
    assert(PATTERN_MEMORY_SUCCESS_ADVANCE_DELAY_MS >= 1200, 'Success dwell should be at least 1200ms');
    assert(PATTERN_MEMORY_SUCCESS_ADVANCE_DELAY_MS <= 1500, 'Success dwell should stay within the requested upper range');
    console.log('Pattern Memory success dwell timing test passed');
}

function testIncorrectCellAllowsSelfCorrection() {
    const game = createPatternMemoryCopyGame({
        questions: [{
            id: 'manual-c1',
            mode: 'copy',
            levelId: 'C1',
            gridSize: 2,
            colors: ['blue'],
            filledCells: [0],
            filledCellCount: 1
        }]
    });

    const incorrect = game.toggleCell(1);
    assert(incorrect.result === 'incorrect', 'Incorrect selected cell should show correction feedback');
    assert(incorrect.state.feedbackType === 'retry', 'Incorrect selected cell should use retry feedback');
    assert(incorrect.state.feedbackMessage === 'Try that spot again.', 'Incorrect selected cell should use gentle correction copy');
    assert(incorrect.state.completed === false, 'Incorrect selected cell should not complete question');
    assert(incorrect.state.mistakeCount === 1, 'Incorrect selected cell should count as mistake corrected');
    assert(incorrect.state.selectedCells.includes(1) === false, 'Incorrect selected cell should not remain selected');
    assert(incorrect.state.retryCellIndex === 1, 'Incorrect selected cell should expose transient retry marker');

    const cleared = game.clearRetryFeedbackMarker();
    assert(cleared.state.retryCellIndex === null, 'Retry marker should clear after pulse');
    assert(cleared.state.selectedCells.includes(1) === false, 'Clearing retry marker should keep incorrect cell unselected');

    const correct = game.toggleCell(0);
    assert(correct.result === 'correct', 'Learner should be able to self-correct to success');
    assert(correct.state.correctAnswers === 1, 'Self-corrected answer should count correct');
    console.log('Pattern Memory self-correction test passed');
}

function testCompletionAndResultSummary() {
    const game = createPatternMemoryCopyGame({
        questionCount: 2,
        random: createDeterministicRandom(),
        startedAtMs: Date.parse('2026-06-21T10:00:00.000Z')
    });

    completeCurrentQuestion(game);
    game.advanceAfterFeedback();
    completeCurrentQuestion(game);
    const completion = game.advanceAfterFeedback();

    assert(completion.result === 'complete', 'Final question should complete session');
    assert(completion.state.completed === true, 'Completion state should be true');

    const summary = createPatternMemoryResultSummary(game.getState(), {
        endedAtMs: Date.parse('2026-06-21T10:00:05.000Z')
    });
    assert(summary.total === 2, 'Result summary should include total questions');
    assert(summary.correct === 2, 'Result summary should include correct answers');
    assert(summary.accuracy === 100, 'Result summary should calculate accuracy');
    assert(summary.timeTakenSeconds === 5, 'Result summary should include time taken');
    assert(summary.averageTimeSeconds === 2.5, 'Result summary should include average time');
    assert(summary.hintsUsed === 0, 'Copy Mode foundation should not use hints');
    console.log('Pattern Memory completion result summary test passed');
}

function testSessionSummaryPayload() {
    const game = createPatternMemoryCopyGame({
        questionCount: 1,
        random: createDeterministicRandom(),
        startedAtMs: Date.parse('2026-06-21T10:00:00.000Z')
    });

    completeCurrentQuestion(game);
    game.advanceAfterFeedback();

    const payload = createPatternMemorySessionSummary(game.getState(), {
        endedAtMs: Date.parse('2026-06-21T10:00:04.000Z')
    });

    assert(payload.gameId === 'patternMemory', 'Payload should use Pattern Memory game id');
    assert(payload.activityId === 'pm-001-copy-mode', 'Payload should use PM-001 Copy Mode activity id');
    assert(payload.mode === 'copy', 'Payload should identify Copy Mode');
    assert(payload.correctCount === 1, 'Payload should include correct count');
    assert(payload.totalQuestions === 1, 'Payload should include total questions');
    assert(payload.accuracyPercent === 100, 'Payload should include accuracy percent');
    assert(payload.trials.length === 1, 'Payload should include trial evidence');
    assert(payload.trials[0].activity === 'pm-001-copy-mode', 'Trial should include activity');
    assert(payload.trials[0].mode === 'copy', 'Trial should include mode');
    assert(payload.trials[0].level === 'C1', 'Trial should include level');
    assert(payload.trials[0].correct === true, 'Trial should include correct result');
    console.log('Pattern Memory session summary payload test passed');
}

function testInvalidAndPendingInteractionsIgnored() {
    const game = createPatternMemoryCopyGame({
        questionCount: 1,
        random: createDeterministicRandom()
    });

    const invalid = game.toggleCell(99);
    assert(invalid.result === 'ignored', 'Out-of-grid cell should be ignored');
    assert(invalid.reason === 'unknown-cell', 'Out-of-grid cell should report unknown cell');

    completeCurrentQuestion(game);
    const pending = game.toggleCell(0);
    assert(pending.result === 'ignored', 'Interaction should be ignored during success dwell');
    assert(pending.reason === 'pending-advance', 'Pending interaction should report pending advance');
    console.log('Pattern Memory invalid and pending interaction test passed');
}

function runAllTests() {
    console.log('=== Pattern Memory Unit Tests ===');
    testCopyLevelsAreConfigured();
    testQuestionGenerationUsesBlueOnlyAndBoundaries();
    testCorrectCopyAdvancesAfterFeedback();
    testSuccessDwellTiming();
    testIncorrectCellAllowsSelfCorrection();
    testCompletionAndResultSummary();
    testSessionSummaryPayload();
    testInvalidAndPendingInteractionsIgnored();
    console.log('=== All Pattern Memory Unit Tests Passed ===');
}

export { runAllTests };
