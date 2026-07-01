import {
    createWorksheetShell,
    validateWorksheetConfig,
    WORKSHEET_TEMPLATE_TYPES
} from '../worksheetShell.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createFakeDocument() {
    return {
        createElement(tagName) {
            return new FakeElement(tagName);
        }
    };
}

class FakeElement {
    constructor(tagName) {
        this.tagName = tagName.toUpperCase();
        this.attributes = {};
        this.children = [];
        this.eventListeners = {};
        this.className = '';
        this.innerHTML = '';
        this.textContent = '';
        this.type = '';
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value);
    }

    getAttribute(name) {
        return this.attributes[name] ?? null;
    }

    removeAttribute(name) {
        delete this.attributes[name];
    }

    append(...children) {
        children.flat().forEach(child => {
            if (child) {
                this.children.push(child);
            }
        });
    }

    appendChild(child) {
        this.append(child);
        return child;
    }

    addEventListener(type, listener) {
        this.eventListeners[type] = this.eventListeners[type] || [];
        this.eventListeners[type].push(listener);
    }

    click() {
        (this.eventListeners.click || []).forEach(listener => listener());
    }
}

function findByTestId(root, testId) {
    if (root.getAttribute?.('data-testid') === testId) {
        return root;
    }

    for (const child of root.children || []) {
        const match = findByTestId(child, testId);
        if (match) return match;
    }

    return null;
}

function getText(root) {
    return [
        root.textContent || '',
        ...(root.children || []).map(getText)
    ].join(' ');
}

function createValidConfig(documentRef = createFakeDocument()) {
    return {
        document: documentRef,
        templateType: WORKSHEET_TEMPLATE_TYPES.MATCHING,
        title: 'Match the same items',
        instruction: 'Look carefully and match the same pictures.',
        activity: {
            render: () => {
                const content = documentRef.createElement('div');
                content.setAttribute('data-testid', 'custom-activity-content');
                content.textContent = 'Activity content';
                return content;
            }
        },
        help: {
            enabled: true,
            hints: [
                'Look carefully.',
                'Find the same picture.'
            ]
        },
        feedback: {
            enabled: true
        },
        celebration: {
            enabled: false
        },
        analytics: {
            activityId: 'matching-demo',
            domain: 'Executive Function & Cognitive Shifting',
            skill: 'Visual Discrimination'
        }
    };
}

function testTemplateTypesExist() {
    const expectedTypes = [
        'matching',
        'guided-discovery',
        'pattern-builder',
        'narration',
        'audio-chain',
        'functional-life'
    ];

    expectedTypes.forEach(type => {
        assert(Object.values(WORKSHEET_TEMPLATE_TYPES).includes(type), `Template type ${type} should exist`);
    });
    console.log('Worksheet template type registry test passed');
}

function testConfigValidation() {
    const valid = validateWorksheetConfig(createValidConfig());
    assert(valid.isValid === true, 'Valid worksheet config should pass validation');

    const invalid = validateWorksheetConfig({});
    assert(invalid.isValid === false, 'Empty worksheet config should fail validation');
    assert(invalid.errors.length >= 4, 'Invalid worksheet config should report missing contract fields');
    console.log('Worksheet config validation test passed');
}

function testShellRendersFiveZones() {
    const shell = createWorksheetShell(createValidConfig());

    assert(findByTestId(shell, 'worksheet-shell'), 'Worksheet shell should render');
    assert(findByTestId(shell, 'worksheet-instruction'), 'Instruction zone should render');
    assert(findByTestId(shell, 'worksheet-activity'), 'Activity zone should render');
    assert(findByTestId(shell, 'worksheet-help'), 'Help zone should render');
    assert(findByTestId(shell, 'worksheet-feedback'), 'Feedback zone should render');
    assert(findByTestId(shell, 'worksheet-celebration'), 'Celebration zone should render');
    console.log('Worksheet shell zone render test passed');
}

function testInstructionAndActivityContentRender() {
    const shell = createWorksheetShell(createValidConfig());

    assert(getText(findByTestId(shell, 'worksheet-instruction')).includes('Match the same items'), 'Instruction title should render');
    assert(getText(findByTestId(shell, 'worksheet-instruction')).includes('Look carefully and match the same pictures.'), 'Instruction text should render');
    assert(findByTestId(shell, 'custom-activity-content'), 'Activity zone should accept custom content');
    console.log('Worksheet instruction and activity content test passed');
}

function testHelpRevealsHintsProgressively() {
    const shell = createWorksheetShell(createValidConfig());
    const helpZone = findByTestId(shell, 'worksheet-help');
    const button = findByTestId(shell, 'worksheet-hint-button');

    assert(button, 'Hint button should render when hints are configured');
    assert(!getText(helpZone).includes('Look carefully.'), 'Hint should not be shown before request');

    button.click();
    assert(getText(helpZone).includes('Look carefully.'), 'First hint should reveal on first click');

    button.click();
    assert(getText(helpZone).includes('Find the same picture.'), 'Second hint should reveal on second click');
    console.log('Worksheet progressive hint reveal test passed');
}

function testFeedbackMountUsesSiraashContract() {
    const shell = createWorksheetShell(createValidConfig());
    const feedbackZone = findByTestId(shell, 'worksheet-feedback');

    shell.showFeedback('success');
    assert(feedbackZone.innerHTML.includes('Great work!'), 'Feedback zone should mount SIRAASH success feedback');
    assert(feedbackZone.innerHTML.includes('You found the answer.'), 'Feedback zone should mount SIRAASH success message');

    shell.clearFeedback();
    assert(feedbackZone.innerHTML === '', 'Feedback zone should clear mounted feedback');
    console.log('Worksheet feedback mount test passed');
}

function testCelebrationInactiveByDefault() {
    const shell = createWorksheetShell(createValidConfig());
    const celebrationZone = findByTestId(shell, 'worksheet-celebration');

    assert(celebrationZone.getAttribute('data-enabled') === 'false', 'Celebration should be disabled by default');
    assert(celebrationZone.getAttribute('aria-hidden') === 'true', 'Inactive celebration should be hidden from learners');
    assert(getText(celebrationZone).trim() === '', 'Inactive celebration should not show level-up copy');
    console.log('Worksheet celebration placeholder test passed');
}

function testCompletionModeHidesLearningRegions() {
    const shell = createWorksheetShell(createValidConfig());
    const instructionZone = findByTestId(shell, 'worksheet-instruction');
    const helpZone = findByTestId(shell, 'worksheet-help');
    const feedbackZone = findByTestId(shell, 'worksheet-feedback');
    const activityZone = findByTestId(shell, 'worksheet-activity');

    shell.setCompletionMode(true);
    assert(shell.getAttribute('data-visual-state') === 'completion', 'Shell should expose completion visual state');
    assert(instructionZone.getAttribute('hidden') === '', 'Completion mode should hide instruction zone');
    assert(helpZone.getAttribute('hidden') === '', 'Completion mode should hide help zone');
    assert(feedbackZone.getAttribute('hidden') === '', 'Completion mode should hide feedback zone');
    assert(activityZone.getAttribute('hidden') === null, 'Completion mode should keep activity zone visible for result component');

    shell.setCompletionMode(false);
    assert(shell.getAttribute('data-visual-state') === 'learning', 'Shell should return to learning visual state');
    assert(instructionZone.getAttribute('hidden') === null, 'Learning mode should restore instruction zone');
    assert(helpZone.getAttribute('hidden') === null, 'Learning mode should restore configured help zone');
    assert(feedbackZone.getAttribute('hidden') === null, 'Learning mode should restore feedback zone');
    console.log('Worksheet completion mode lifecycle test passed');
}

function runAllTests() {
    console.log('=== Worksheet Shell Contract Tests ===');
    testTemplateTypesExist();
    testConfigValidation();
    testShellRendersFiveZones();
    testInstructionAndActivityContentRender();
    testHelpRevealsHintsProgressively();
    testFeedbackMountUsesSiraashContract();
    testCelebrationInactiveByDefault();
    testCompletionModeHidesLearningRegions();
    console.log('=== All Worksheet Shell Contract Tests Passed ===');
}

export { runAllTests };
