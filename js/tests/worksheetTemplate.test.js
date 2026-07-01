import {
    applyWorksheetHeaderState,
    createWorksheetTemplateState,
    getWorksheetSupportPrompts,
    renderWorksheetCompletion,
    renderWorksheetResultScreen,
    renderWorksheetResultSummary,
    WORKSHEET_ACTIVITY_TYPES,
    WORKSHEET_TEMPLATE_REGIONS,
    WORKSHEET_TEMPLATE_VERSION
} from '../worksheetTemplate.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testTemplateConstants() {
    assert(WORKSHEET_TEMPLATE_VERSION === '1.0', 'Worksheet template version should be stable');
    assert(WORKSHEET_ACTIVITY_TYPES.MATCHING === 'matching', 'Matching worksheet activity type should be registered');
    assert(WORKSHEET_TEMPLATE_REGIONS.MAIN_TASK === 'worksheet-main-task', 'Main task region should be registered');
    assert(WORKSHEET_TEMPLATE_REGIONS.SUPPORT === 'worksheet-support', 'Support region should be registered');
    console.log('Worksheet template constants test passed');
}

function testTemplateStateContract() {
    const state = createWorksheetTemplateState({
        worksheetId: 'worksheet-1',
        activityId: 'activity-1',
        learnerName: 'Adarsh',
        title: 'Matching Worksheet',
        skills: ['matching'],
        roundState: {
            roundNumber: 3,
            stars: 2
        }
    });

    assert(state.worksheetId === 'worksheet-1', 'Worksheet id should be preserved');
    assert(state.learnerName === 'Adarsh', 'Learner name should be normalized and preserved');
    assert(state.learnerTitle === 'Matching Worksheet', 'Learner title should fall back to title');
    assert(state.skills.join(',') === 'matching', 'Skills should be copied');
    assert(state.roundState.roundNumber === 3, 'Round number should be preserved');
    assert(state.roundState.stars === 2, 'Stars should be preserved');
    console.log('Worksheet template state contract test passed');
}

function testSupportPrompts() {
    const prompts = getWorksheetSupportPrompts('Adarsh');

    assert(prompts.initial === 'Need a clue, Adarsh? \u{1F331}', 'Initial support prompt should include learner name');
    assert(prompts.delayed === 'Adarsh, SIRAASH can help you \u{1F331}', 'Delayed support prompt should include learner name');
    assert(prompts.futureScaffoldLevels.includes('Worked example'), 'Future scaffold levels should be documented');
    console.log('Worksheet support prompts test passed');
}

function testHeaderStateApplication() {
    const values = {};
    const fakeDocument = {
        getElementById(id) {
            return {
                set textContent(value) {
                    values[id] = value;
                }
            };
        }
    };

    applyWorksheetHeaderState({
        documentRef: fakeDocument,
        roundNumber: 4,
        stars: 3
    });

    assert(values['ui-round'] === '4', 'Round header text should update');
    assert(values['ui-stars'] === '3', 'Stars header text should update');
    console.log('Worksheet header state application test passed');
}

function testCompletionRendering() {
    const html = renderWorksheetCompletion({
        learnerName: 'Adarsh',
        message: 'You matched all the pictures.',
        actionTestId: 'next-round'
    });

    assert(html.includes('Great work, Adarsh!'), 'Completion should personalize learner praise');
    assert(html.includes('You matched all the pictures.'), 'Completion should include activity-specific message');
    assert(html.includes('data-testid="next-round"'), 'Completion should include action selector');
    console.log('Worksheet completion rendering test passed');
}

function testResultSummaryRendering() {
    const html = renderWorksheetResultSummary({
        learnerName: 'Adarsh',
        summary: {
            total: 5,
            correct: 4,
            accuracy: 80,
            timeTakenSeconds: 15,
            averageTimeSeconds: 3,
            hintsUsed: 1,
            mistakeCount: 0
        },
        testIdPrefix: 'attribute-explorer',
        completionMessage: 'You finished Attribute Explorer.',
        levelLabel: 'Attribute Explorer'
    });

    assert(html.includes('Great work, Adarsh!'), 'Result summary should personalize learner praise');
    assert(html.includes('Questions: 5'), 'Result summary should include question count');
    assert(html.includes('Correct / Total: 4 / 5'), 'Result summary should include correct total');
    assert(html.includes('Accuracy: 80%'), 'Result summary should include accuracy');
    assert(html.includes('Time Taken: 15 sec'), 'Result summary should include time taken');
    assert(html.includes('Average Time: 3 sec/question'), 'Result summary should include average time');
    assert(html.includes('Hints Used: 1'), 'Result summary should include hints used');
    assert(html.includes('Mistakes Corrected: 0'), 'Result summary should include mistakes corrected');
    assert(html.includes('data-testid="attribute-explorer-next-round-button"'), 'Result summary should include Try Again action');
    assert(html.includes('data-testid="attribute-explorer-home-button"'), 'Result summary should include Home action');
    console.log('Worksheet result summary rendering test passed');
}

function testResultScreenContractRendering() {
    const html = renderWorksheetResultScreen({
        learnerName: 'Adarsh',
        title: 'Number Bridges',
        completionMessage: 'You finished your Number Bridges.',
        metrics: [
            { label: 'Questions', value: 5 },
            { label: 'Correct / Total', value: '4 / 5' },
            { label: 'Accuracy', value: '80%' },
            { label: 'Time Taken', value: '15 sec' },
            { label: 'Average Time', value: '3 sec/question' },
            { label: 'Hints Used', value: 1 },
            { label: 'Mistakes Corrected', value: 0 }
        ],
        extension: { content: 'Addition L1' },
        review: { title: 'Review', content: 'No corrections needed.' },
        actions: [
            { label: 'Try Again', testId: 'number-bridges-try-again-button' },
            { label: 'Home', testId: 'number-bridges-home-button' }
        ]
    });

    assert(html.includes('data-testid="number-bridges-results"'), 'Result screen should expose stable result selector');
    assert(html.includes('Great work, Adarsh!'), 'Result screen should personalize learner praise');
    assert(html.includes('You finished your Number Bridges.'), 'Result screen should include completion message');
    assert(html.includes('Questions: 5'), 'Result screen should render normalized metrics');
    assert(html.includes('Correct / Total: 4 / 5'), 'Result screen should render score metric');
    assert(html.includes('data-testid="number-bridges-extension"'), 'Result screen should include extension slot');
    assert(html.includes('Addition L1'), 'Result screen should render activity extension content');
    assert(html.includes('No corrections needed.'), 'Result screen should render review slot content');
    assert(html.includes('data-testid="number-bridges-try-again-button"'), 'Result screen should include primary action');
    assert(html.includes('data-testid="number-bridges-home-button"'), 'Result screen should include Home action');
    console.log('Worksheet result screen contract rendering test passed');
}

function runAllTests() {
    console.log('=== Worksheet Template Unit Tests ===');
    testTemplateConstants();
    testTemplateStateContract();
    testSupportPrompts();
    testHeaderStateApplication();
    testCompletionRendering();
    testResultSummaryRendering();
    testResultScreenContractRendering();
    console.log('=== All Worksheet Template Tests Passed ===');
}

export { runAllTests };
