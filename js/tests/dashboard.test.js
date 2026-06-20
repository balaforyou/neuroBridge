import {
    createNumberBridgeOperationUpdate,
    formatNumberBridgeConfigurationSummary,
    getDashboardViewType,
    getNumberBridgeArithmeticModeOptionsForOperation,
    getNumberBridgeControlVisibility,
    getNumberBridgeLevelOptionsForOperation,
    normalizeNumberBridgeDashboardMasterRanges,
    NUMBER_BRIDGE_LEVEL_OPTIONS,
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
    assert(
        formatNumberBridgeConfigurationSummary({ operation: '+', level: 9 }).includes('Addition L9 (+9 Bridges)'),
        'Configuration summary should support Addition L9 labels'
    );
    assert(
        formatNumberBridgeConfigurationSummary({ operation: '-', level: 9 }).includes('Subtraction L9 (-9 Bridges)'),
        'Configuration summary should support Subtraction L9 labels'
    );
    assert(multiplicationMarkup.includes('Multiplication L2 (×3 Tables)'), 'Configuration summary should support multiplication labels');
    assert(divisionMarkup.includes('Division L1 (÷2 Facts)'), 'Configuration summary should support division labels');
    console.log('Number Bridges configuration summary test passed');
}

function testNumberBridgeLevelOptionsExposeL1ThroughL9() {
    assert(
        NUMBER_BRIDGE_LEVEL_OPTIONS.join(',') === '1,2,3,4,5,6,7,8,9',
        'Addition and subtraction bridge level source should expose L1 through L9'
    );
    assert(getNumberBridgeLevelOptionsForOperation('+').join(',') === '1,2,3,4,5,6,7,8,9', 'Addition level dropdown should expose L1 through L9');
    assert(getNumberBridgeLevelOptionsForOperation('-').join(',') === '1,2,3,4,5,6,7,8,9', 'Subtraction level dropdown should expose L1 through L9');
    console.log('Number Bridges level options test passed');
}

function testNumberBridgeLevelOptionsAreOperationSpecific() {
    assert(
        getNumberBridgeLevelOptionsForOperation('×').join(',') === '1,2,3,4,5,6,7,8,9',
        'Multiplication level dropdown should expose L1 through L9 levels'
    );
    assert(
        getNumberBridgeLevelOptionsForOperation('÷').join(',') === '1,2,3,4,5',
        'Division level dropdown should expose only defined L1 through L5 levels'
    );
    assert(
        formatNumberBridgeConfigurationSummary({ operation: '×', level: 9 }).includes('Multiplication L9 (×10 Tables)'),
        'Multiplication should display L9 as ×10 Tables'
    );
    assert(
        formatNumberBridgeConfigurationSummary({ operation: '÷', level: 9 }).includes('Division L5 (÷10 Facts)'),
        'Division should keep current L5 clamp behavior'
    );
    console.log('Number Bridges operation-specific level options test passed');
}

function testMultiplicationLevelLabelsMapL1ThroughL9() {
    const expectedLabels = [
        'Multiplication L1 (×2 Tables)',
        'Multiplication L2 (×3 Tables)',
        'Multiplication L3 (×4 Tables)',
        'Multiplication L4 (×5 Tables)',
        'Multiplication L5 (×6 Tables)',
        'Multiplication L6 (×7 Tables)',
        'Multiplication L7 (×8 Tables)',
        'Multiplication L8 (×9 Tables)',
        'Multiplication L9 (×10 Tables)'
    ];

    expectedLabels.forEach((label, index) => {
        const level = index + 1;
        assert(
            formatNumberBridgeConfigurationSummary({ operation: '×', level }).includes(label),
            `Multiplication L${level} should display ${label}`
        );
    });

    console.log('Number Bridges multiplication label mapping test passed');
}

function testOperationSwitchPreservesValidL9Levels() {
    const additionToMultiplication = createNumberBridgeOperationUpdate('×', 9);
    const multiplicationToAddition = createNumberBridgeOperationUpdate('+', 9);
    const multiplicationToSubtraction = createNumberBridgeOperationUpdate('-', 9);
    const multiplicationToDivision = createNumberBridgeOperationUpdate('÷', 9);

    assert(additionToMultiplication.level === 9 && additionToMultiplication.secondNumberFixedValue === 10, 'Addition L9 to Multiplication should preserve L9 as ×10 Tables');
    assert(multiplicationToAddition.level === 9 && multiplicationToAddition.secondNumberFixedValue === 9, 'Multiplication L9 to Addition should preserve Addition L9');
    assert(multiplicationToSubtraction.level === 9 && multiplicationToSubtraction.secondNumberFixedValue === 9, 'Multiplication L9 to Subtraction should preserve Subtraction L9');
    assert(multiplicationToDivision.level === 5 && multiplicationToDivision.secondNumberFixedValue === 10, 'Multiplication L9 to Division should clamp to current Division L5');
    console.log('Number Bridges operation switch test passed');
}

function testNumberBridgeMasterModeOptionsAndVisibility() {
    assert(
        getNumberBridgeArithmeticModeOptionsForOperation('+').map(option => option.value).join(',') === 'bridge,master',
        'Addition should expose Bridge and Master modes'
    );
    assert(
        getNumberBridgeArithmeticModeOptionsForOperation('-').map(option => option.value).join(',') === 'bridge,master',
        'Subtraction should expose Bridge and Master modes'
    );
    assert(
        getNumberBridgeArithmeticModeOptionsForOperation('×').map(option => option.value).join(',') === 'bridge',
        'Multiplication should expose Bridge mode only'
    );
    assert(
        getNumberBridgeArithmeticModeOptionsForOperation('÷').map(option => option.value).join(',') === 'bridge',
        'Division should expose Bridge mode only'
    );
    assert(getNumberBridgeControlVisibility({ operation: '+', arithmeticMode: 'bridge' }).showLevel === true, 'Bridge mode should show level control');
    assert(getNumberBridgeControlVisibility({ operation: '+', arithmeticMode: 'bridge' }).showRanges === false, 'Bridge mode should hide range controls');
    assert(getNumberBridgeControlVisibility({ operation: '+', arithmeticMode: 'master' }).showLevel === false, 'Master mode should hide level control');
    assert(getNumberBridgeControlVisibility({ operation: '+', arithmeticMode: 'master' }).showRanges === true, 'Master mode should show range controls');
    assert(getNumberBridgeControlVisibility({ operation: '×', arithmeticMode: 'master' }).showLevel === true, 'Unsupported Master operation should fall back to Bridge visibility');
    console.log('Number Bridges Master UI option test passed');
}

function testNumberBridgeMasterRangeValidation() {
    const clamped = normalizeNumberBridgeDashboardMasterRanges({
        aMin: 0,
        aMax: 18,
        bMin: -1,
        bMax: 99
    }, '+');
    const corrected = normalizeNumberBridgeDashboardMasterRanges({
        aMin: 8,
        aMax: 3,
        bMin: 7,
        bMax: 2
    }, '+');
    const subtractionFallback = normalizeNumberBridgeDashboardMasterRanges({
        aMin: 1,
        aMax: 1,
        bMin: 2,
        bMax: 2
    }, '-');

    assert(clamped.aMin === 1 && clamped.aMax === 9, 'Dashboard A range should clamp to 1-9');
    assert(clamped.bMin === 1 && clamped.bMax === 9, 'Dashboard B range should clamp to 1-9');
    assert(corrected.aMin === 8 && corrected.aMax === 8, 'Dashboard A range should correct min greater than max');
    assert(corrected.bMin === 7 && corrected.bMax === 7, 'Dashboard B range should correct min greater than max');
    assert(subtractionFallback.bMin === 1 && subtractionFallback.bMax === 1, 'Dashboard subtraction range should fallback safely');
    console.log('Number Bridges Master range validation test passed');
}

function testNumberBridgeMasterSummaryLabels() {
    const addition = formatNumberBridgeConfigurationSummary({
        operation: '+',
        arithmeticMode: 'master',
        aMin: 1,
        aMax: 3,
        bMin: 1,
        bMax: 3
    });
    const subtraction = formatNumberBridgeConfigurationSummary({
        operation: '-',
        arithmeticMode: 'master',
        aMin: 1,
        aMax: 5,
        bMin: 1,
        bMax: 3
    });
    const multiplication = formatNumberBridgeConfigurationSummary({
        operation: '×',
        arithmeticMode: 'master',
        level: 9
    });

    assert(addition.includes('Addition Master A1-3 B1-3'), 'Addition Master summary should show A/B ranges');
    assert(subtraction.includes('Subtraction Master A1-5 B1-3'), 'Subtraction Master summary should show A/B ranges');
    assert(multiplication.includes('Multiplication L9 (×10 Tables)'), 'Unsupported Multiplication Master should display Bridge summary');
    console.log('Number Bridges Master summary label test passed');
}

function testNumberBridgeMasterOperationSwitching() {
    const additionMasterToMultiplication = createNumberBridgeOperationUpdate('×', 9, 'master');
    const additionMasterToSubtraction = createNumberBridgeOperationUpdate('-', 9, 'master');

    assert(additionMasterToMultiplication.arithmeticMode === 'bridge', 'Switching Master to Multiplication should force Bridge mode');
    assert(additionMasterToMultiplication.level === 9, 'Switching Addition L9 to Multiplication should preserve valid L9');
    assert(additionMasterToSubtraction.arithmeticMode === 'master', 'Switching Master Addition to Subtraction should preserve Master mode');
    assert(additionMasterToSubtraction.level === 9, 'Switching Addition L9 to Subtraction should preserve valid L9');
    console.log('Number Bridges Master operation switching test passed');
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
    testNumberBridgeLevelOptionsExposeL1ThroughL9();
    testNumberBridgeLevelOptionsAreOperationSpecific();
    testMultiplicationLevelLabelsMapL1ThroughL9();
    testOperationSwitchPreservesValidL9Levels();
    testNumberBridgeMasterModeOptionsAndVisibility();
    testNumberBridgeMasterRangeValidation();
    testNumberBridgeMasterSummaryLabels();
    testNumberBridgeMasterOperationSwitching();
    testDashboardViewTypeUsesActivityMetadata();
    testMatrixReasoningKeepsPlainLevelLabel();
    testNumberBridgeHidesFullTrialTableAndLevelDash();
    testNumberBridgeNoCorrectionsMessage();
    testNumberBridgeCorrectionReview();
    testOtherActivityTrialTableUnchanged();
    console.log('=== All Dashboard Rendering Tests Passed ===');
}

export { runAllTests };
