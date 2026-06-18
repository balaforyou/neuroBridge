import {
    formatNumberBridgeConfigurationSummary,
    getDashboardViewType,
    renderNumberBridgeCorrectionReview,
    renderParentSessionDetails,
    renderParentSessionRow
} from '../dashboard.js';
import { DASHBOARD_VIEW_TYPES } from '../gameRegistry.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createNumberBridgeLog(overrides = {}) {
    return {
        gameId: 'kumonQuiz',
        activityName: 'Kumon Quiz / Number Bridges',
        timestamp: Date.parse('2026-06-18T10:00:00.000Z'),
        level: 1,
        levelLabel: 'Addition L1',
        skillLabel: '+1 Bridges',
        bridgeValue: 1,
        correctCount: 10,
        totalQuestions: 10,
        accuracyPercent: 100,
        sessionLengthSeconds: 33,
        averageTimePerQuestion: 3.7,
        questionOrderMode: 'sequential',
        hintUsageCount: 0,
        mistakeCount: 0,
        trials: [],
        ...overrides
    };
}

function testNumberBridgeSummaryUsesSessionLevelAndAverageTime() {
    const markup = renderParentSessionRow(createNumberBridgeLog());

    assert(markup.includes('Kumon Quiz / Number Bridges'), 'Summary should include activity name');
    assert(markup.includes('Addition L1 (+1 Bridges)'), 'Summary should show session-level Number Bridges label');
    assert(markup.includes('Score:</span> 10 / 10'), 'Summary should show score');
    assert(markup.includes('Accuracy:</span> 100%'), 'Summary should show accuracy');
    assert(markup.includes('Average Time:</span> 3.7 sec/question'), 'Summary should show average time');
    assert(markup.includes('Question Order:</span> Sequential'), 'Summary should show question order mode');
    console.log('Number Bridges dashboard summary test passed');
}

function testNumberBridgeConfigurationSummary() {
    const defaultMarkup = formatNumberBridgeConfigurationSummary({});
    const customMarkup = formatNumberBridgeConfigurationSummary({
        level: 3,
        questionCount: 20,
        questionsPerScreen: 1,
        hintsEnabled: false,
        questionOrder: 'random'
    });
    const subtractionMarkup = formatNumberBridgeConfigurationSummary({ operation: '-', level: 3 });
    const multiplicationMarkup = formatNumberBridgeConfigurationSummary({ operation: '×', level: 2 });
    const divisionMarkup = formatNumberBridgeConfigurationSummary({ operation: '÷', level: 1 });

    assert(
        defaultMarkup === 'Addition L1 (+1 Bridges) | 10 Questions | 5 Per Screen | Hints On | Question Order: Sequential',
        'Default Number Bridges configuration summary should match parent-facing defaults'
    );
    assert(
        customMarkup === 'Addition L3 (+3 Bridges) | 20 Questions | 1 Per Screen | Hints Off | Question Order: Random',
        'Custom Number Bridges configuration summary should reflect saved settings'
    );
    assert(subtractionMarkup.includes('Subtraction L3 (-3 Bridges)'), 'Configuration summary should support subtraction labels');
    assert(multiplicationMarkup.includes('Multiplication L2 (×3 Tables)'), 'Configuration summary should support multiplication labels');
    assert(divisionMarkup.includes('Division L1 (÷2 Facts)'), 'Configuration summary should support division labels');
    console.log('Number Bridges configuration summary test passed');
}

function testDashboardViewTypeUsesActivityMetadata() {
    assert(
        getDashboardViewType({ gameId: 'kumonQuiz' }) === DASHBOARD_VIEW_TYPES.SUMMARY_WITH_CORRECTIONS,
        'Number Bridges should use summaryWithCorrections from activity metadata'
    );
    assert(
        getDashboardViewType({ gameId: 'matrixReasoning' }) === DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        'Matrix Reasoning should use trialBreakdown from activity metadata'
    );
    assert(
        getDashboardViewType({ gameId: 'missingActivity' }) === DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        'Unknown legacy logs should fall back to trialBreakdown'
    );

    console.log('Dashboard view type metadata test passed');
}

function testMatrixReasoningKeepsPlainLevelLabel() {
    const markup = renderParentSessionRow({
        gameId: 'matrixReasoning',
        timestamp: Date.parse('2026-06-18T10:00:00.000Z'),
        highestLevelReached: 3,
        score: 1,
        accuracyPercent: 100,
        sessionLengthSeconds: 10,
        trials: []
    });

    assert(markup.includes('Level 3'), 'Trial-breakdown activities should keep generic level labels');
    assert(markup.includes('<table'), 'Trial-breakdown activities should keep detailed trial tables');
    console.log('Matrix Reasoning dashboard metadata test passed');
}

function testNumberBridgeHidesFullTrialTableAndLevelDash() {
    const markup = renderParentSessionRow(createNumberBridgeLog({
        trials: [{
            operandA: 1,
            operandB: 1,
            operation: '+',
            learnerAnswer: 2,
            expectedAnswer: 2,
            isCorrect: true,
            reactionTimeMs: 500
        }]
    }));

    assert(!markup.includes('<table'), 'Number Bridges should not render full trial table by default');
    assert(!markup.includes('Level --'), 'Number Bridges should not render Level --');
    assert(!markup.includes('Level:</span> --'), 'Number Bridges should not render blank session level');
    console.log('Number Bridges dashboard trial table cleanup test passed');
}

function testNumberBridgeNoCorrectionsMessage() {
    const markup = renderNumberBridgeCorrectionReview(createNumberBridgeLog());

    assert(markup.includes('No corrections needed.'), 'All-correct Number Bridges should show no-corrections message');
    assert(!markup.includes('Review Corrections'), 'All-correct Number Bridges should not show correction heading');
    console.log('Number Bridges no corrections dashboard test passed');
}

function testNumberBridgeCorrectionReview() {
    const markup = renderNumberBridgeCorrectionReview(createNumberBridgeLog({
        mistakeCount: 1,
        trials: [{
            operandA: 3,
            operandB: 1,
            operation: '+',
            learnerAnswer: 5,
            expectedAnswer: 4,
            isCorrect: false,
            reactionTimeMs: 500
        }]
    }));

    assert(markup.includes('Review Corrections'), 'Corrections should show review heading');
    assert(markup.includes('3 + 1'), 'Correction review should show question');
    assert(markup.includes('Attempted: 5'), 'Correction review should show attempted answer');
    assert(markup.includes('Correct: 4'), 'Correction review should show correct answer');
    console.log('Number Bridges correction review dashboard test passed');
}

function testOtherActivityTrialTableUnchanged() {
    const markup = renderParentSessionDetails({
        gameId: 'matrixReasoning',
        trials: [{
            stage: 2,
            isCorrect: true,
            reactionTimeMs: 800
        }]
    });

    assert(markup.includes('<table'), 'Other activities should keep trial table');
    assert(markup.includes('<th class="p-2 text-left">Level</th>'), 'Other activities should keep Level column');
    assert(markup.includes('<td class="p-2">2</td>'), 'Other activities should keep trial level/stage value');
    console.log('Other activity dashboard trial table test passed');
}

function runAllTests() {
    console.log('=== Dashboard Rendering Unit Tests ===');
    testNumberBridgeSummaryUsesSessionLevelAndAverageTime();
    testNumberBridgeConfigurationSummary();
    testDashboardViewTypeUsesActivityMetadata();
    testMatrixReasoningKeepsPlainLevelLabel();
    testNumberBridgeHidesFullTrialTableAndLevelDash();
    testNumberBridgeNoCorrectionsMessage();
    testNumberBridgeCorrectionReview();
    testOtherActivityTrialTableUnchanged();
    console.log('=== All Dashboard Rendering Tests Passed ===');
}

export { runAllTests };
