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

function testOtherActivitiesAutoExitAfterCompletion() {
    assert(shouldAutoExitAfterCompletion('attributeExplorer') === true, 'Attribute Explorer should keep existing auto-exit behavior');
    assert(shouldAutoExitAfterCompletion('matrixReasoning') === true, 'Matrix Reasoning should keep existing auto-exit behavior');
    console.log('Router completion auto-exit regression test passed');
}

function runAllTests() {
    console.log('=== Router Unit Tests ===');
    testCompletionScreenActivitiesStayVisible();
    testOtherActivitiesAutoExitAfterCompletion();
    console.log('=== All Router Tests Passed ===');
}

export { runAllTests };
