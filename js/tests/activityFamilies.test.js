import { createBaseActivityFamily } from '../activityFamilies/baseActivityFamily.js';
import { createChoiceActivityFamily } from '../activityFamilies/choiceActivityFamily.js';
import { createGridActivityFamily } from '../activityFamilies/gridActivityFamily.js';
import { createQuestionAnswerActivityFamily } from '../activityFamilies/questionAnswerActivityFamily.js';

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
        this.id = '';
        
        this.classList = {
            add: (cls) => {
                const classes = this.className ? this.className.split(' ') : [];
                if (!classes.includes(cls)) {
                    classes.push(cls);
                    this.className = classes.join(' ');
                }
            },
            contains: (cls) => {
                const classes = this.className ? this.className.split(' ') : [];
                return classes.includes(cls);
            }
        };
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value);
    }

    getAttribute(name) {
        if (name === 'id') return this.id || null;
        return this.attributes[name] ?? null;
    }

    removeAttribute(name) {
        delete this.attributes[name];
    }

    append(...children) {
        children.flat().forEach(child => {
            if (child) {
                this.children.push(child);
                child.parentNode = this;
            }
        });
    }

    appendChild(child) {
        this.append(child);
        return child;
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.parentNode = null;
        }
        return child;
    }

    addEventListener(type, listener) {
        this.eventListeners[type] = this.eventListeners[type] || [];
        this.eventListeners[type].push(listener);
    }

    querySelector(selector) {
        if (selector.startsWith('.')) {
            const className = selector.slice(1);
            return findByClassName(this, className);
        }
        return null;
    }

    get firstElementChild() {
        return this.children[0] || null;
    }
}

function findByClassName(root, className) {
    if (root.className && root.className.split(' ').includes(className)) {
        return root;
    }
    for (const child of root.children || []) {
        const match = findByClassName(child, className);
        if (match) return match;
    }
    return null;
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

function createValidConfig(doc = createFakeDocument()) {
    let taskRendererCalled = false;
    return {
        activityId: 'test-act',
        activityTitle: 'Test Activity',
        prompt: 'Initial Prompt',
        taskRenderer: () => {
            taskRendererCalled = true;
            const el = doc.createElement('div');
            el.setAttribute('data-testid', 'task-content');
            el.textContent = 'task';
            return el;
        },
        document: doc,
        getTaskRendererCalled: () => taskRendererCalled
    };
}

function testBaseFamilyMountAndTaskRender() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const container = doc.createElement('div');
    config.container = container;

    const family = createBaseActivityFamily(config);
    assert(config.getTaskRendererCalled() === true, 'taskRenderer must be executed during shell construction');

    family.mount();
    assert(container.children.length === 1, 'Container should hold exactly the mounted shell');
    assert(container.children[0] === family.shell, 'Mounted element must be the shell');
    
    console.log('Base family mount and task render test passed');
}

function testPromptUpdating() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const family = createBaseActivityFamily(config);

    const promptHeader = findByTestId(family.shell, 'prompt-header');
    assert(promptHeader.textContent === 'Initial Prompt', 'Should initialize prompt text');

    family.updatePrompt('New Prompt Text');
    assert(promptHeader.textContent === 'New Prompt Text', 'updatePrompt should propagate down');

    console.log('Base family prompt updating test passed');
}

function testFeedbackDelegation() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const family = createBaseActivityFamily(config);

    // Call showSuccess
    family.showSuccess('Good job');
    const feedbackZone = findByTestId(family.shell, 'siraash-feedback');
    assert(feedbackZone !== null, 'Feedback zone element should exist');
    assert(feedbackZone.getAttribute('data-feedback-tone') === 'success', 'Feedback tone should be success');

    // Call showMistake
    family.showMistake('Try again');
    assert(feedbackZone.getAttribute('data-feedback-tone') === 'mistake', 'Feedback tone should update to mistake');

    // Call clearFeedback
    family.clearFeedback();
    assert(feedbackZone.textContent === '', 'Feedback content should be cleared');

    console.log('Base family feedback delegation test passed');
}

function testCompletionSummaryDelegation() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const family = createBaseActivityFamily(config);

    const summary = {
        accuracyPercent: 90,
        correct: 9,
        incorrect: 1,
        durationSeconds: 45
    };

    family.showCompletion(summary);
    const completionZone = findByTestId(family.shell, 'siraash-completion-surface');
    assert(completionZone !== null, 'Completion surface should be rendered');

    console.log('Base family completion summary delegation test passed');
}

function testChoiceFamilySpecialization() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const container = doc.createElement('div');
    config.container = container;

    const family = createChoiceActivityFamily(config);
    assert(family.familyType === 'choice', 'Choice family type must be "choice"');

    family.mount();
    
    // Grid layout class should collapse (hints disabled)
    const mainGrid = findByClassName(family.shell, 'worksheet-shell__main');
    assert(mainGrid !== null, 'Main grid must exist');
    assert(!mainGrid.className.includes('lg:grid-cols-[minmax(0,1fr)_18rem]'), 'Grid track must collapse');

    // Help zone must not render
    const helpZone = findByTestId(family.shell, 'worksheet-help');
    assert(helpZone === null, 'Choice family must not render generic hint panels');

    console.log('Choice family specialization test passed');
}

function testGridFamilySpecialization() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const container = doc.createElement('div');
    config.container = container;

    const family = createGridActivityFamily(config);
    assert(family.familyType === 'grid', 'Grid family type must be "grid"');

    family.mount();

    // Help zone must not render
    const helpZone = findByTestId(family.shell, 'worksheet-help');
    assert(helpZone === null, 'Grid family must not render generic hint panels');

    console.log('Grid family specialization test passed');
}

function testQuestionAnswerFamilySpecialization() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const container = doc.createElement('div');
    config.container = container;

    const family = createQuestionAnswerActivityFamily(config);
    assert(family.familyType === 'question-answer', 'QA family type must be "question-answer"');

    family.mount();

    // Does not render help/support panel unless explicitly configured
    const helpZone = findByTestId(family.shell, 'worksheet-help');
    assert(helpZone === null, 'QA family should not render support/help zone when unconfigured');

    console.log('QA family specialization test passed');
}

function testResetAndDestroyLifecycle() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const container = doc.createElement('div');
    config.container = container;

    const family = createBaseActivityFamily(config);
    family.mount();

    family.reset(); // Should not throw
    family.destroy(); // Should safely remove from parent container
    
    assert(container.children.length === 0, 'Container should be empty after destroy');

    console.log('Reset and destroy lifecycle test passed');
}

export function runAllTests() {
    console.log('=== Activity Families Unit Tests ===');
    testBaseFamilyMountAndTaskRender();
    testPromptUpdating();
    testFeedbackDelegation();
    testCompletionSummaryDelegation();
    testChoiceFamilySpecialization();
    testGridFamilySpecialization();
    testQuestionAnswerFamilySpecialization();
    testResetAndDestroyLifecycle();
    console.log('=== All Activity Families Unit Tests Passed ===');
}
