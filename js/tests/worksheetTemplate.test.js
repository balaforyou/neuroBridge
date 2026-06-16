import {
    applyWorksheetHeaderState,
    createWorksheetTemplateState,
    getWorksheetSupportPrompts,
    renderWorksheetCompletion,
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

function runAllTests() {
    console.log('=== Worksheet Template Unit Tests ===');
    testTemplateConstants();
    testTemplateStateContract();
    testSupportPrompts();
    testHeaderStateApplication();
    testCompletionRendering();
    console.log('=== All Worksheet Template Tests Passed ===');
}

export { runAllTests };
