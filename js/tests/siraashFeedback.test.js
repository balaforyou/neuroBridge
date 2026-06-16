import {
    getSiraashCelebration,
    getSiraashFeedback,
    renderSiraashCompletionFeedback,
    SIRAASH_FEEDBACK
} from '../siraashFeedback.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testRoutineFeedbackContract() {
    assert(getSiraashFeedback('success').title === 'Great work!', 'Success feedback title should be stable');
    assert(getSiraashFeedback('success').message === 'You found the answer.', 'Success feedback message should be stable');
    assert(getSiraashFeedback('mistake').title === 'You got close.', 'Mistake feedback title should be stable');
    assert(getSiraashFeedback('mistake').message === 'SIRAASH will guide you.', 'Mistake feedback message should be stable');
    console.log('Routine feedback contract test passed');
}

function testLevelUpCelebrationPlaceholder() {
    const levelUp = getSiraashCelebration('levelUp');

    assert(levelUp, 'Level-up celebration placeholder should exist');
    assert(levelUp.enabled === false, 'Level-up celebration should be disabled by default');
    assert(Array.isArray(levelUp.effects), 'Level-up effects should be listed');
    assert(levelUp.effects.includes('claps'), 'Level-up effects should reserve claps');
    assert(levelUp.effects.includes('balloons'), 'Level-up effects should reserve balloons');
    assert(levelUp.title === 'New level!', 'Level-up title should be stable');
    assert(levelUp.message === 'You are growing stronger.', 'Level-up message should be stable');
    console.log('Level-up celebration placeholder test passed');
}

function testCelebrationNotRoutineFeedback() {
    assert(getSiraashFeedback('levelUp') === null, 'Level-up should not be routine answer feedback');
    assert(SIRAASH_FEEDBACK.success.effects === undefined, 'Routine success feedback should not reserve celebration effects');
    console.log('Celebration separation test passed');
}

function testCompletionFeedbackContract() {
    const html = renderSiraashCompletionFeedback({
        learnerName: 'Adarsh',
        message: 'You matched all the pictures.',
        actionTestId: 'next-round-button'
    });

    assert(html.includes('data-testid="siraash-completion-feedback"'), 'Completion feedback should expose stable root selector');
    assert(html.includes('Great work, Adarsh!'), 'Completion feedback should personalize praise');
    assert(html.includes('You matched all the pictures.'), 'Completion feedback should include activity-specific message');
    assert(html.includes('data-testid="next-round-button"'), 'Completion feedback should expose action selector');
    console.log('Completion feedback contract test passed');
}

function runAllTests() {
    console.log('=== SIRAASH Feedback Contract Tests ===');
    testRoutineFeedbackContract();
    testLevelUpCelebrationPlaceholder();
    testCelebrationNotRoutineFeedback();
    testCompletionFeedbackContract();
    console.log('=== All SIRAASH Feedback Contract Tests Passed ===');
}

export { runAllTests };
