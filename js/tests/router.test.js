import { shouldAutoExitAfterCompletion } from '../activityCompletion.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testCompletionScreenActivitiesStayVisible() {
    assert(shouldAutoExitAfterCompletion('kumonQuiz') === false, 'Number Bridges should keep its completion screen visible');
    assert(shouldAutoExitAfterCompletion('schulte') === false, 'Schulte should keep its completion screen visible after analytics submission');
    console.log('Router completion screen activity test passed');
}

function testCompletionPolicyDoesNotAutoExitOtherActivities() {
    assert(shouldAutoExitAfterCompletion('attributeExplorer') === false, 'Attribute Explorer should not auto-exit after completion');
    assert(shouldAutoExitAfterCompletion('matrixReasoning') === false, 'Matrix Reasoning should not auto-exit after completion');
    assert(shouldAutoExitAfterCompletion('unknownActivity') === false, 'Unknown activities should default to persistent completion behavior');
    console.log('Router completion persistence policy test passed');
}

function runAllTests() {
    console.log('=== Router Unit Tests ===');
    testCompletionScreenActivitiesStayVisible();
    testCompletionPolicyDoesNotAutoExitOtherActivities();
    console.log('=== All Router Tests Passed ===');
}

export { runAllTests };
