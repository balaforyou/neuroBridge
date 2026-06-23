/**
 * Unit tests for Attribute Explorer result flow and feedback timing.
 */

import {
    ATTRIBUTE_EXPLORER_MISTAKE_ADVANCE_DELAY_MS,
    ATTRIBUTE_EXPLORER_SUCCESS_ADVANCE_DELAY_MS,
    createAttributeExplorerResultSummary,
    renderAttributeExplorerResultMarkup
} from '../resultFlow.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testSuccessDwellTime() {
    assert(
        ATTRIBUTE_EXPLORER_SUCCESS_ADVANCE_DELAY_MS >= 1200 &&
            ATTRIBUTE_EXPLORER_SUCCESS_ADVANCE_DELAY_MS <= 1500,
        'Success feedback dwell time should be between 1200ms and 1500ms'
    );
    assert(ATTRIBUTE_EXPLORER_MISTAKE_ADVANCE_DELAY_MS === 1400, 'Mistake dwell time should remain stable');

    console.log('Attribute Explorer success dwell time test passed');
}

function testResultSummaryMetrics() {
    const summary = createAttributeExplorerResultSummary({
        startedAt: 1000,
        endedAt: 7600,
        trials: [
            { isCorrect: true, scaffold: { used: false } },
            { isCorrect: false, scaffold: { used: true } },
            { isCorrect: true, scaffold: { used: false } }
        ]
    });

    assert(summary.total === 3, 'Summary should include total questions');
    assert(summary.correct === 2, 'Summary should include correct count');
    assert(summary.accuracy === 67, 'Summary should round accuracy to percent');
    assert(summary.timeTakenSeconds === 7, 'Summary should round session time to seconds');
    assert(summary.averageTimeSeconds === 2.3, 'Summary should include average seconds per question');
    assert(summary.hintsUsed === 1, 'Summary should count scaffolded trials as hints used');
    assert(summary.mistakeCount === 0, 'Attribute Explorer should not claim corrected mistakes');

    console.log('Attribute Explorer result summary metrics test passed');
}

function testResultMarkupUsesWorksheetPattern() {
    const html = renderAttributeExplorerResultMarkup({
        total: 5,
        correct: 5,
        accuracy: 100,
        timeTakenSeconds: 12,
        averageTimeSeconds: 2.4,
        hintsUsed: 1,
        mistakeCount: 0
    }, 'Adarsh');

    assert(html.includes('Great work, Adarsh!'), 'Result markup should include learner-aware completion title');
    assert(html.includes('Questions: 5'), 'Result markup should include Questions metric');
    assert(html.includes('Correct / Total: 5 / 5'), 'Result markup should include Correct / Total metric');
    assert(html.includes('Accuracy: 100%'), 'Result markup should include Accuracy metric');
    assert(html.includes('Time Taken: 12 sec'), 'Result markup should include Time Taken metric');
    assert(html.includes('Average Time: 2.4 sec/question'), 'Result markup should include Average Time metric');
    assert(html.includes('Hints Used: 1'), 'Result markup should include Hints Used metric');
    assert(html.includes('Mistakes Corrected: 0'), 'Result markup should include Mistakes Corrected metric');
    assert(html.includes('>Try Again<'), 'Result markup should include Try Again action');
    assert(html.includes('>Home<'), 'Result markup should include Home action');

    console.log('Attribute Explorer result markup test passed');
}

function runAllTests() {
    console.log('=== Attribute Explorer Result Flow Tests ===');
    testSuccessDwellTime();
    testResultSummaryMetrics();
    testResultMarkupUsesWorksheetPattern();
    console.log('=== All Attribute Explorer Result Flow Tests Passed ===');
}

export { runAllTests };
