import {
    createAdditionHint,
    createKumonQuizGame,
    createKumonSessionSummary,
    DEFAULT_KUMON_CONFIG,
    generateKumonQuestions,
    normalizeKumonConfig
} from '../game.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testConfigDefaults() {
    const config = normalizeKumonConfig();

    assert(config.operation === '+', 'Operation should default to addition');
    assert(config.firstNumberMin === 1, 'First number min should default to 1');
    assert(config.firstNumberMax === 10, 'First number max should default to 10');
    assert(config.secondNumberMode === 'fixed', 'Second number mode should default to fixed');
    assert(config.secondNumberFixedValue === 1, 'Fixed second number should default to 1');
    assert(config.questionCount === 10, 'Question count should default to 10');
    assert(config.questionsPerScreen === 5, 'Questions per screen should default to 5');
    assert(config.hintsEnabled === true, 'Hints should default enabled');
    assert(config.mode === 'practice', 'Mode should default to practice');
    console.log('Kumon config defaults test passed');
}

function testQuestionsPerScreenConfig() {
    assert(normalizeKumonConfig({ questionsPerScreen: 1 }).questionsPerScreen === 1, 'Should accept 1 question per screen');
    assert(normalizeKumonConfig({ questionsPerScreen: 3 }).questionsPerScreen === 3, 'Should accept 3 questions per screen');
    assert(normalizeKumonConfig({ questionsPerScreen: 5 }).questionsPerScreen === 5, 'Should accept 5 questions per screen');
    assert(normalizeKumonConfig({ questionsPerScreen: 2 }).questionsPerScreen === 5, 'Unsupported row count should fall back to 5');
    console.log('Questions per screen config test passed');
}

function testFixedSecondNumberGeneration() {
    const questions = generateKumonQuestions({
        firstNumberMin: 1,
        firstNumberMax: 3,
        secondNumberMode: 'fixed',
        secondNumberFixedValue: 1,
        questionCount: 5
    });

    assert(questions.length === 5, 'Should generate configured question count');
    assert(questions[0].operandA === 1 && questions[0].operandB === 1, 'First fixed question should be 1 + 1');
    assert(questions[1].operandA === 2 && questions[1].operandB === 1, 'Second fixed question should be 2 + 1');
    assert(questions[2].expectedAnswer === 4, 'Expected answer should be operand sum');
    console.log('Fixed second number generation test passed');
}

function testRangeSecondNumberGeneration() {
    const questions = generateKumonQuestions({
        firstNumberMin: 1,
        firstNumberMax: 4,
        secondNumberMode: 'range',
        secondNumberMin: 2,
        secondNumberMax: 3,
        questionCount: 5
    });

    assert(questions[0].operandA === 1 && questions[0].operandB === 2, 'First range question should use lower bounds');
    assert(questions[1].operandA === 2 && questions[1].operandB === 3, 'Second range question should advance second operand');
    assert(questions[2].operandA === 3 && questions[2].operandB === 2, 'Range second operand should cycle deterministically');
    console.log('Range second number generation test passed');
}

function testCorrectAnswerAdvances() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 1 });
    const question = game.getCurrentQuestion();

    const outcome = game.validateAnswer(question.expectedAnswer, {
        reactionTimeMs: 120,
        timestamp: '2026-06-16T00:00:00.000Z',
        validationSource: 'enter'
    });
    assert(outcome.result === 'success', 'Correct answer should produce success');
    assert(outcome.trial.autoAdvanced === true, 'Correct answer should preserve auto-advanced analytics');
    assert(game.getState().lastResult === 'success', 'Correct answer should expose local success marker state');
    assert(game.getState().currentQuestionIndex === 0, 'Correct answer should wait for smooth advance');

    const advance = game.advanceAfterCorrect();
    assert(advance.result === 'advanced', 'Smooth advance should move to next question');
    assert(game.getState().currentQuestionIndex === 1, 'Question index should advance after correct answer');
    assert(game.getState().lastResult === null, 'Advance should clear per-question success state');
    console.log('Correct answer advance test passed');
}

function testBlurValidationAcceptsCorrectAnswer() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 1 });
    const question = game.getCurrentQuestion();

    const outcome = game.validateAnswer(String(question.expectedAnswer), {
        reactionTimeMs: 130,
        timestamp: '2026-06-16T00:00:00.000Z',
        validationSource: 'blur'
    });

    assert(outcome.result === 'success', 'Blur validation should accept correct answer');
    assert(game.getState().trials.length === 1, 'Blur validation should record one meaningful attempt');
    console.log('Blur validation test passed');
}

function testWrongAnswerDoesNotAdvanceAndShowsHint() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5, hintsEnabled: true });
    const question = game.getCurrentQuestion();

    const outcome = game.validateAnswer(question.expectedAnswer + 1, {
        reactionTimeMs: 150,
        timestamp: '2026-06-16T00:00:00.000Z',
        validationSource: 'blur'
    });
    const state = game.getState();

    assert(outcome.result === 'mistake', 'Wrong answer should produce mistake');
    assert(outcome.trial.autoAdvanced === false, 'Wrong answer should preserve no-auto-advance analytics');
    assert(state.currentQuestionIndex === 0, 'Wrong answer should stay on same question');
    assert(state.supportState?.hintLevel === 1, 'Wrong answer should reveal first hint when enabled');
    assert(state.correctQuestionIds[question.questionId] !== true, 'Wrong answer should not lock row');
    console.log('Wrong answer scaffold test passed');
}

function testDuplicateEnterBlurDoesNotDoubleRecordAttempt() {
    const game = createKumonQuizGame({ questionCount: 5 });
    const question = game.getCurrentQuestion();

    const enterOutcome = game.validateAnswer(question.expectedAnswer, {
        reactionTimeMs: 120,
        timestamp: '2026-06-16T00:00:00.000Z',
        validationSource: 'enter'
    });
    const blurOutcome = game.validateAnswer(String(question.expectedAnswer), {
        reactionTimeMs: 125,
        timestamp: '2026-06-16T00:00:00.100Z',
        validationSource: 'blur'
    });
    const state = game.getState();

    assert(enterOutcome.result === 'success', 'Enter should validate the correct answer');
    assert(blurOutcome.result === 'duplicate', 'Blur with unchanged answer should be ignored as duplicate');
    assert(state.trials.length === 1, 'Duplicate Enter plus blur should not double-record analytics');
    assert(state.attemptNumberByQuestion[question.questionId] === 1, 'Duplicate validation should not increment attempts');
    console.log('Duplicate validation guard test passed');
}

function testFiveRowModeLocksCorrectRowsAndKeepsAnswers() {
    const game = createKumonQuizGame({ questionCount: 10, questionsPerScreen: 5 });
    const visibleQuestions = game.getVisibleQuestions();
    const first = visibleQuestions[0];

    assert(visibleQuestions.length === 5, 'Five-row mode should expose five active rows');

    const outcome = game.validateAnswer(first.expectedAnswer, {
        questionId: first.questionId,
        reactionTimeMs: 110,
        timestamp: '2026-06-16T00:00:00.000Z',
        validationSource: 'enter'
    });
    const state = game.getState();

    assert(outcome.result === 'success', 'Correct row should validate successfully');
    assert(outcome.trial.autoAdvanced === false, 'Partial group correct row should not auto-advance analytics');
    assert(state.correctQuestionIds[first.questionId] === true, 'Correct row should lock');
    assert(state.answerValueByQuestion[first.questionId] === String(first.expectedAnswer), 'Correct row answer should remain visible in state');
    assert(state.rowResultByQuestion[first.questionId] === 'success', 'Correct row should expose local tick state');
    assert(state.successPendingAdvance === false, 'Group should not advance until all visible rows are correct');
    assert(game.advanceAfterCorrect().result === 'ignored', 'Partial group should not advance');
    console.log('Five-row row lock test passed');
}

function testFiveRowGroupAdvancesAfterAllVisibleRowsCorrect() {
    const game = createKumonQuizGame({ questionCount: 10, questionsPerScreen: 5 });
    const visibleQuestions = game.getVisibleQuestions();

    visibleQuestions.forEach((question, rowIndex) => {
        const outcome = game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 100 + rowIndex,
            timestamp: `2026-06-16T00:00:0${rowIndex}.000Z`,
            validationSource: 'enter'
        });

        assert(outcome.result === 'success', `Row ${rowIndex} should validate successfully`);
        assert(outcome.trial.rowIndex === rowIndex, `Row ${rowIndex} analytics should include row index`);
        assert(outcome.trial.pageIndex === 0, 'First group analytics should include page index 0');
        assert(outcome.trial.questionsPerScreen === 5, 'Analytics should include configured row count');
    });

    assert(game.getState().successPendingAdvance === true, 'Group should be ready to advance after all rows correct');

    const advance = game.advanceAfterCorrect();
    assert(advance.result === 'advanced', 'Completed visible group should advance');
    assert(game.getState().currentQuestionIndex === 5, 'Next group should start after five rows');
    console.log('Five-row group advance test passed');
}

function testCompletionProducesResultState() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5 });
    const visibleQuestions = game.getVisibleQuestions();

    visibleQuestions.forEach(question => {
        game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 100,
            timestamp: '2026-06-16T00:00:00.000Z'
        });
    });

    const advance = game.advanceAfterCorrect();
    const state = game.getState();

    assert(advance.result === 'complete', 'Final group should complete into result state');
    assert(state.completed === true, 'Completed flag should remain true for result page rendering');
    assert(state.completionState.correct === 5, 'Completion state should include correct count');
    assert(state.completionState.total === 5, 'Completion state should include total count');
    console.log('Completion result state test passed');
}

function testSessionSummaryStoresScoreTotalAndAccuracy() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5, hintsEnabled: true });
    const visibleQuestions = game.getVisibleQuestions();

    game.validateAnswer(visibleQuestions[0].expectedAnswer + 1, {
        questionId: visibleQuestions[0].questionId,
        reactionTimeMs: 1000,
        timestamp: '2026-06-16T00:00:00.000Z'
    });

    visibleQuestions.slice(0, 4).forEach((question, index) => {
        game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 1000 + index,
            timestamp: '2026-06-16T00:00:01.000Z'
        });
    });

    const summary = game.getResultSummary();
    const session = createKumonSessionSummary(game.getState(), summary);

    assert(session.gameId === 'kumonQuiz', 'Session summary should store Number Bridges activity id');
    assert(session.activityName === 'Kumon Quiz / Number Bridges', 'Session summary should store activity name');
    assert(session.score === 4, 'Session score should be correct count');
    assert(session.correctCount === 4, 'Session should store correct count');
    assert(session.totalQuestions === 5, 'Session should store total questions');
    assert(session.accuracy === 0.8, `Session accuracy should be ratio 0.8, got ${session.accuracy}`);
    assert(session.accuracyPercent === 80, 'Session accuracyPercent should be 80');
    assert(session.sessionLengthSeconds === summary.timeTakenSeconds, 'Session should store total time seconds');
    assert(session.averageTimePerQuestion === summary.averageTimeSeconds, 'Session should store average time per question');
    assert(session.hintUsageCount === summary.hintsUsed, 'Session should store hint usage');
    assert(session.mistakeCount === summary.mistakeCount, 'Session should store mistake count');
    console.log('Session summary analytics test passed');
}

function testWrongAttemptsDoNotReduceResolvedScore() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5, hintsEnabled: true });
    const visibleQuestions = game.getVisibleQuestions();
    const first = visibleQuestions[0];

    game.validateAnswer(8, {
        questionId: first.questionId,
        reactionTimeMs: 100,
        timestamp: '2026-06-16T00:00:00.000Z'
    });
    game.validateAnswer(5, {
        questionId: first.questionId,
        reactionTimeMs: 120,
        timestamp: '2026-06-16T00:00:01.000Z'
    });

    visibleQuestions.forEach(question => {
        game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 140,
            timestamp: '2026-06-16T00:00:02.000Z'
        });
    });

    const summary = game.getResultSummary();

    assert(summary.correct === 5, 'Resolved score should count the corrected question as correct');
    assert(summary.accuracy === 100, 'Resolved accuracy should use final question state');
    assert(summary.mistakeCount === 2, 'Mistake count should track wrong attempts separately');
    assert(summary.wrongAnswers.length === 1, 'Review should show one corrected question');
    assert(summary.wrongAnswers[0].attemptedAnswers.join(',') === '8,5', 'Review should list wrong attempts');
    assert(summary.wrongAnswers[0].correctAnswer === first.expectedAnswer, 'Review should show final correct answer');
    console.log('Wrong attempts resolved score test passed');
}

function testHintUsageDoesNotReduceResolvedScore() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5, hintsEnabled: true });
    const visibleQuestions = game.getVisibleQuestions();
    const first = visibleQuestions[0];

    game.requestHint({ questionId: first.questionId });
    visibleQuestions.forEach(question => {
        game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 140,
            timestamp: '2026-06-16T00:00:02.000Z'
        });
    });

    const summary = game.getResultSummary();

    assert(summary.correct === 5, 'Hint usage should not reduce resolved score');
    assert(summary.accuracy === 100, 'Hint usage should not reduce accuracy');
    assert(summary.hintsUsed === 1, 'Hint usage should be counted separately');
    assert(summary.mistakeCount === 0, 'Hint usage should not count as a mistake');
    console.log('Hint usage resolved score test passed');
}

function testHintDisabled() {
    const game = createKumonQuizGame({ questionCount: 5, hintsEnabled: false });
    const question = game.getCurrentQuestion();

    game.submitAnswer(question.expectedAnswer + 1, { reactionTimeMs: 150, timestamp: '2026-06-16T00:00:00.000Z' });
    const state = game.getState();

    assert(state.supportState?.hintLevel === 0, 'Hints disabled should not reveal scaffold level');
    assert(state.supportState?.scaffoldType === 'supportive-retry', 'Hints disabled should show retry support only');
    assert(game.requestHint().result === 'ignored', 'Manual hint should be ignored when disabled');
    console.log('Hint disabled test passed');
}

function testResultSummary() {
    const game = createKumonQuizGame({ questionCount: 5 });
    const first = game.getCurrentQuestion();

    game.submitAnswer(first.expectedAnswer + 1, { reactionTimeMs: 150, timestamp: '2026-06-16T00:00:00.000Z' });
    game.submitAnswer(first.expectedAnswer, { reactionTimeMs: 160, timestamp: '2026-06-16T00:00:01.000Z' });
    game.advanceAfterCorrect();

    const summary = game.getResultSummary();
    assert(summary.correct === 1, 'Summary should count correct answers');
    assert(summary.total === 5, 'Summary should include total questions');
    assert(summary.timeTakenSeconds === 0, 'Summary should include rounded time taken');
    assert(summary.averageTimeSeconds === 0.1, 'Summary should include average time per question');
    assert(summary.mistakeCount === 1, 'Summary should include mistake count');
    assert(summary.wrongAnswers.length === 1, 'Summary should include wrong answer list');
    assert(summary.wrongAnswers[0].correctAnswer === first.expectedAnswer, 'Wrong list should include correct answer');
    assert(summary.wrongAnswers[0].attemptedAnswers[0] === first.expectedAnswer + 1, 'Wrong list should include attempted answer');
    console.log('Result summary test passed');
}

function testResultSummaryHintsUsed() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5, hintsEnabled: true });
    const first = game.getCurrentQuestion();

    game.requestHint({ questionId: first.questionId });
    game.submitAnswer(first.expectedAnswer + 1, {
        questionId: first.questionId,
        reactionTimeMs: 200,
        timestamp: '2026-06-16T00:00:00.000Z'
    });

    const summary = game.getResultSummary();
    assert(summary.hintsUsed === 2, 'Summary should count manual and wrong-answer scaffold hints');
    console.log('Result summary hints used test passed');
}

function testTrialAnalyticsFields() {
    const game = createKumonQuizGame({
        questionCount: 5,
        questionsPerScreen: 1,
        learnerName: 'Adarsh',
        mode: 'assessment'
    });
    const question = game.getCurrentQuestion();

    game.requestHint();
    const outcome = game.submitAnswer(question.expectedAnswer, {
        reactionTimeMs: 200,
        timestamp: '2026-06-16T00:00:00.000Z'
    });
    const trial = outcome.trial;

    [
        'sessionId',
        'activityId',
        'learnerName',
        'questionId',
        'questionIndex',
        'operation',
        'operandA',
        'operandB',
        'expectedAnswer',
        'learnerAnswer',
        'isCorrect',
        'attemptNumber',
        'reactionTimeMs',
        'hintUsed',
        'hintLevel',
        'scaffoldType',
        'autoAdvanced',
        'configuredMode',
        'hintsEnabled',
        'questionsPerScreen',
        'pageIndex',
        'rowIndex',
        'timestamp'
    ].forEach(field => {
        assert(Object.prototype.hasOwnProperty.call(trial, field), `Trial should include ${field}`);
    });

    assert(trial.learnerName === 'Adarsh', 'Trial should capture learner name');
    assert(trial.hintUsed === true, 'Trial should capture hint usage');
    assert(trial.autoAdvanced === true, 'Correct trial should capture auto-advance intent');
    assert(trial.configuredMode === 'assessment', 'Trial should capture configured mode');
    assert(trial.questionsPerScreen === 1, 'Trial should capture questions per screen');
    assert(trial.pageIndex === 0, 'Trial should capture page index');
    assert(trial.rowIndex === 0, 'Trial should capture row index');
    console.log('Trial analytics fields test passed');
}

function testHintText() {
    const hint = createAdditionHint({ operandA: 7, operandB: 5 }, 2);

    assert(hint.text === '7 + 4 = 11. So 7 + 5 is one more.', 'Level 2 hint should scaffold one-more reasoning');
    console.log('Hint text test passed');
}

function runAllTests() {
    console.log('=== Kumon Quiz Unit Tests ===');
    testConfigDefaults();
    testQuestionsPerScreenConfig();
    testFixedSecondNumberGeneration();
    testRangeSecondNumberGeneration();
    testCorrectAnswerAdvances();
    testBlurValidationAcceptsCorrectAnswer();
    testWrongAnswerDoesNotAdvanceAndShowsHint();
    testDuplicateEnterBlurDoesNotDoubleRecordAttempt();
    testFiveRowModeLocksCorrectRowsAndKeepsAnswers();
    testFiveRowGroupAdvancesAfterAllVisibleRowsCorrect();
    testCompletionProducesResultState();
    testSessionSummaryStoresScoreTotalAndAccuracy();
    testWrongAttemptsDoNotReduceResolvedScore();
    testHintUsageDoesNotReduceResolvedScore();
    testHintDisabled();
    testResultSummary();
    testResultSummaryHintsUsed();
    testTrialAnalyticsFields();
    testHintText();
    console.log('=== All Kumon Quiz Tests Passed ===');
}

export { runAllTests };
