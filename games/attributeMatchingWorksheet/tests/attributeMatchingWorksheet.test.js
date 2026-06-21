import {
    ATTRIBUTE_GROUP_COLOR,
    COLOR_ATTRIBUTE_QUESTIONS,
    createAttributeMatchingCompletionSummary,
    createAttributeMatchingWorksheetGame,
    createColorAttributeQuestions
} from '../game.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createNoShuffleRandom() {
    return () => 0.99;
}

function testColorDatasetLoads() {
    assert(COLOR_ATTRIBUTE_QUESTIONS.length === 10, 'Color pack should include ten questions');
    assert(COLOR_ATTRIBUTE_QUESTIONS[0].prompt === 'Red Apple', 'First color question should be Red Apple');
    assert(COLOR_ATTRIBUTE_QUESTIONS[0].image, 'Color question should include prompt image');
    assert(COLOR_ATTRIBUTE_QUESTIONS.every(question => question.attributeType === ATTRIBUTE_GROUP_COLOR), 'Color pack should only include color questions');
    assert(COLOR_ATTRIBUTE_QUESTIONS.every(question => question.options.length === 3), 'Each color question should include three options');
    console.log('Attribute Matching color dataset load test passed');
}

function testQuestionCreationRandomizesOptions() {
    const questions = createColorAttributeQuestions({
        questionCount: 1,
        random: () => 0
    });

    assert(questions.length === 1, 'Question count should be configurable');
    assert(questions[0].id === 'color-red-apple', 'Color question should preserve id');
    assert(questions[0].correctAnswer === 'Red', 'Color question should preserve correct answer');
    assert(questions[0].options.length === 3, 'Color question should keep three answer choices');
    assert(questions[0].options.join(',') !== COLOR_ATTRIBUTE_QUESTIONS[0].options.join(','), 'Color options should support randomized order');
    console.log('Attribute Matching option randomization test passed');
}

function testQuestionRendersInState() {
    const game = createAttributeMatchingWorksheetGame({
        questionCount: 1,
        random: createNoShuffleRandom()
    });
    const state = game.getState();

    assert(state.questions.length === 1, 'Game should load requested questions');
    assert(state.currentQuestion.prompt === 'Red Apple', 'State should expose current prompt');
    assert(state.currentQuestion.options.length === 3, 'State should expose three choices');
    assert(state.currentQuestion.correctAnswer === 'Red', 'State should expose correct answer');
    console.log('Attribute Matching state render contract test passed');
}

function testCorrectAnswerAdvancesAfterFeedback() {
    const game = createAttributeMatchingWorksheetGame({
        questionCount: 2,
        random: createNoShuffleRandom(),
        learnerName: 'Adarsh'
    });

    const outcome = game.selectAnswer('Red');
    assert(outcome.result === 'correct', 'Correct answer should be accepted');
    assert(outcome.state.feedbackMessage === 'Great work, Adarsh!', 'Correct answer should show success feedback');
    assert(outcome.state.pendingAdvance === true, 'Correct answer should wait for feedback before advancing');

    const advance = game.advanceAfterFeedback();
    assert(advance.result === 'advanced', 'Advance should move to next question');
    assert(advance.state.currentQuestionIndex === 1, 'Next question index should be 1');
    assert(advance.state.correctAnswers === 1, 'Correct answer count should increment');
    console.log('Attribute Matching correct answer advance test passed');
}

function testIncorrectFeedbackProgression() {
    const game = createAttributeMatchingWorksheetGame({
        questionCount: 1,
        random: createNoShuffleRandom()
    });

    const first = game.selectAnswer('Blue');
    assert(first.result === 'incorrect', 'Incorrect answer should return incorrect');
    assert(first.state.feedbackMessage === 'Let\'s look again.', 'First incorrect attempt should show retry feedback');
    assert(first.state.visualHint === false, 'First incorrect attempt should not show visual hint');

    const second = game.selectAnswer('Blue');
    assert(second.state.feedbackMessage === 'What color do you see?', 'Second incorrect attempt should show contextual hint');

    const third = game.selectAnswer('Blue');
    assert(third.state.visualHint === true, 'Third incorrect attempt should reveal visual hint');

    const fourth = game.selectAnswer('Blue');
    assert(fourth.state.answerRevealed === true, 'Fourth incorrect attempt should reveal answer');
    assert(fourth.state.feedbackMessage === 'The answer is Red.', 'Fourth incorrect attempt should name correct answer');
    console.log('Attribute Matching incorrect feedback progression test passed');
}

function testCompletionAndAccuracyCalculation() {
    const game = createAttributeMatchingWorksheetGame({
        questionCount: 2,
        random: createNoShuffleRandom()
    });

    game.selectAnswer('Red');
    assert(game.advanceAfterFeedback().result === 'advanced', 'First correct answer should advance');
    game.selectAnswer('Blue');
    const completion = game.advanceAfterFeedback();
    const summary = game.getCompletionSummary();

    assert(completion.result === 'complete', 'Final correct answer should complete session');
    assert(completion.state.completed === true, 'Completed state should be true');
    assert(summary.questionsAnswered === 2, 'Summary should include questions answered');
    assert(summary.correctAnswers === 2, 'Summary should include correct answers');
    assert(summary.accuracyPercent === 100, 'Summary should calculate accuracy percentage');
    console.log('Attribute Matching completion summary test passed');
}

function testPartialAccuracyCalculation() {
    const summary = createAttributeMatchingCompletionSummary({
        questions: [{}, {}, {}],
        correctAnswers: 2
    });

    assert(summary.accuracyPercent === 67, 'Partial accuracy should round to nearest percent');
    console.log('Attribute Matching partial accuracy test passed');
}

function runAllTests() {
    console.log('=== Attribute Matching Worksheet Unit Tests ===');
    testColorDatasetLoads();
    testQuestionCreationRandomizesOptions();
    testQuestionRendersInState();
    testCorrectAnswerAdvancesAfterFeedback();
    testIncorrectFeedbackProgression();
    testCompletionAndAccuracyCalculation();
    testPartialAccuracyCalculation();
    console.log('=== All Attribute Matching Worksheet Unit Tests Passed ===');
}

export { runAllTests };
