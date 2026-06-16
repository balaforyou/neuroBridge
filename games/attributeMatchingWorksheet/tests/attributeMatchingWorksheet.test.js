import {
    ATTRIBUTE_MATCHING_QUESTIONS,
    createAttributeMatchingWorksheetGame,
    createAttributeQuestion,
    getAttributeHints,
    isCorrectAttributeChoice
} from '../game.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testQuestionCreation() {
    const question = createAttributeQuestion(0);

    assert(question.id === 'red-001', 'First deterministic question should be red-001');
    assert(question.source.label === 'Apple', 'Question should include source item');
    assert(question.attribute === 'red', 'Question should include target attribute');
    assert(question.prompt === 'Find another red item.', 'Question should include attribute prompt');
    assert(question.choices.length === 3, 'Question should include three choices');
    console.log('Attribute question creation test passed');
}

function testCorrectAnswerDetection() {
    const question = createAttributeQuestion(0);

    assert(isCorrectAttributeChoice(question, 'strawberry') === true, 'Correct choice should be detected');
    assert(isCorrectAttributeChoice(question, 'ball') === false, 'Incorrect choice should be false');
    assert(isCorrectAttributeChoice(question, 'missing') === false, 'Missing choice should be false');
    console.log('Attribute answer detection test passed');
}

function testDeterministicDataset() {
    assert(ATTRIBUTE_MATCHING_QUESTIONS.length === 3, 'V1 should include three deterministic questions');
    assert(ATTRIBUTE_MATCHING_QUESTIONS[0].choices.map(choice => choice.id).join(',') === 'strawberry,ball,sun', 'Color choices should keep stable order');
    assert(ATTRIBUTE_MATCHING_QUESTIONS[1].choices.map(choice => choice.id).join(',') === 'sun,book,pencil', 'Shape choices should keep stable order');
    assert(ATTRIBUTE_MATCHING_QUESTIONS[2].choices.map(choice => choice.id).join(',') === 'bus,ant,grapes', 'Size choices should keep stable order');
    console.log('Deterministic dataset test passed');
}

function testSingleSelectGameFlow() {
    const game = createAttributeMatchingWorksheetGame();

    assert(game.selectChoice('ball').result === 'mistake', 'Incorrect single-select should produce mistake');
    assert(game.selectChoice('strawberry').result === 'success', 'Correct single-select should produce success');

    const state = game.getState();
    assert(state.selectedChoiceId === 'strawberry', 'Selected choice should be tracked');
    assert(state.completed === true, 'Correct choice should complete the current round');
    assert(state.attempts === 2, 'Each valid tap should count as one attempt');
    assert(game.selectChoice('ball').result === 'ignored', 'Completed round should ignore further choices');
    console.log('Single-select game flow test passed');
}

function testNextRoundProgression() {
    const game = createAttributeMatchingWorksheetGame();

    game.selectChoice('strawberry');
    const nextState = game.nextRound();

    assert(nextState.roundNumber === 2, 'Next round should increment round number');
    assert(nextState.currentQuestion.id === 'round-001', 'Next round should advance to next deterministic question');
    assert(nextState.selectedChoiceId === null, 'Next round should clear selected choice');
    assert(nextState.completed === false, 'Next round should clear completion');
    assert(nextState.attempts === 0, 'Next round should reset attempts');
    console.log('Next round progression test passed');
}

function testHintProgressionData() {
    const hints = getAttributeHints(createAttributeQuestion(0));

    assert(hints.length === 3, 'Question should provide three progressive hints');
    assert(hints[0] === 'Look carefully.', 'First hint should be general');
    assert(hints[1] === 'Think about the color.', 'Second hint should focus the attribute domain');
    assert(hints[2] === 'Find another red item.', 'Third hint should restate the target attribute');
    console.log('Hint progression data test passed');
}

function runAllTests() {
    console.log('=== Attribute Matching Worksheet Unit Tests ===');
    testQuestionCreation();
    testCorrectAnswerDetection();
    testDeterministicDataset();
    testSingleSelectGameFlow();
    testNextRoundProgression();
    testHintProgressionData();
    console.log('=== All Attribute Matching Worksheet Unit Tests Passed ===');
}

export { runAllTests };
