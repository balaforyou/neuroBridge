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

function testSessionApiExposureAndNoConfigBehavior() {
    const doc = createFakeDocument();
    const family = createBaseActivityFamily(createValidConfig(doc));

    assert(typeof family.configureSession === 'function', 'Base family must expose configureSession');
    assert(typeof family.startSession === 'function', 'Base family must expose startSession');
    assert(typeof family.submitSessionResult === 'function', 'Base family must expose submitSessionResult');
    assert(typeof family.restartSession === 'function', 'Base family must expose restartSession');
    assert(typeof family.resetSession === 'function', 'Base family must expose resetSession');
    assert(typeof family.getSessionState === 'function', 'Base family must expose getSessionState');
    assert(typeof family.destroySession === 'function', 'Base family must expose destroySession');
    assert(family.getSessionState() === null, 'getSessionState should return null before configuration');

    family.startSession();
    family.submitSessionResult({ correct: true, durationMs: 5 });
    family.restartSession();
    family.resetSession();
    family.destroySession();

    assert(family.getSessionState() === null, 'No-session APIs should remain safe no-ops');
    console.log('Session API exposure and no-config behavior test passed');
}

function testConfigureSessionAndProgression() {
    const doc = createFakeDocument();
    const family = createBaseActivityFamily(createValidConfig(doc));
    let renderedRound = null;
    let startedRound = null;
    let completedRounds = 0;
    let sessionCompleted = false;

    family.configureSession({
        totalRounds: 2,
        onRenderRound: (round) => { renderedRound = round; },
        onRoundStart: (round) => { startedRound = round; },
        onRoundComplete: () => { completedRounds += 1; },
        onSessionComplete: () => { sessionCompleted = true; }
    });

    const initialState = family.getSessionState();
    assert(initialState !== null, 'configureSession should create a session controller');
    assert(initialState.started === false, 'Configured session should not auto-start');

    family.startSession();
    let state = family.getSessionState();
    assert(state.started === true, 'startSession should start the session');
    assert(state.round === 1, 'startSession should begin at round 1');
    assert(startedRound === 1, 'onRoundStart should fire for the first round');
    assert(renderedRound === 1, 'onRenderRound should fire for the first round');

    family.submitSessionResult({ correct: true, durationMs: 5 });

    setTimeout(() => {
        state = family.getSessionState();
        assert(state.round === 2, 'Correct result should advance to the next round');
        assert(state.correct === 1, 'Correct count should increment');
        assert(completedRounds === 1, 'onRoundComplete should fire for the completed round');

        family.submitSessionResult({ correct: true, durationMs: 5 });

        setTimeout(() => {
            state = family.getSessionState();
            assert(state.completed === true, 'Final correct result should complete the session');
            assert(state.correct === 2, 'Final correct result should update counts');
            assert(sessionCompleted === true, 'onSessionComplete should fire at completion');
            const completionSurface = findByTestId(family.shell, 'siraash-completion-surface');
            assert(completionSurface !== null, 'Session completion should use the shared completion surface');
            console.log('Configure session and progression test passed');
        }, 20);
    }, 20);
}

function testRestartResetAndDestroySessionLifecycle() {
    const doc = createFakeDocument();
    const family = createBaseActivityFamily(createValidConfig(doc));

    family.configureSession({
        totalRounds: 2,
        onRenderRound: () => {}
    });
    family.startSession();
    family.submitSessionResult({ correct: true, durationMs: 5 });

    setTimeout(() => {
        family.restartSession();
        let state = family.getSessionState();
        assert(state.round === 1, 'restartSession should return the session to round 1');
        assert(state.correct === 0, 'restartSession should reset correct counts');

        family.resetSession();
        state = family.getSessionState();
        assert(state.started === false, 'resetSession should clear started state');
        assert(state.round === 0, 'resetSession should clear active round state');

        family.destroySession();
        assert(family.getSessionState() === null, 'destroySession should fully tear down the session');
        console.log('Restart/reset/destroy session lifecycle test passed');
    }, 20);
}

function testResetAndDestroyAlsoManageConfiguredSession() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const container = doc.createElement('div');
    config.container = container;
    const family = createBaseActivityFamily(config);
    family.mount();

    family.configureSession({
        totalRounds: 1,
        onRenderRound: () => {}
    });
    family.startSession();

    family.reset();
    const stateAfterReset = family.getSessionState();
    assert(stateAfterReset !== null, 'reset should not destroy configured session');
    assert(stateAfterReset.started === false, 'reset should reset configured session state');

    family.destroy();
    assert(family.getSessionState() === null, 'destroy should destroy configured session');
    assert(container.children.length === 0, 'destroy should still unmount the shell');
    console.log('Reset and destroy configured session management test passed');
}

function testSpecializedFamiliesExposeSessionApis() {
    const doc = createFakeDocument();
    const families = [
        createChoiceActivityFamily(createValidConfig(doc)),
        createGridActivityFamily(createValidConfig(doc)),
        createQuestionAnswerActivityFamily(createValidConfig(doc))
    ];

    families.forEach(family => {
        assert(typeof family.configureSession === 'function', `${family.familyType} family must expose configureSession`);
        assert(typeof family.startSession === 'function', `${family.familyType} family must expose startSession`);
        assert(typeof family.submitSessionResult === 'function', `${family.familyType} family must expose submitSessionResult`);
        assert(typeof family.restartSession === 'function', `${family.familyType} family must expose restartSession`);
        assert(typeof family.resetSession === 'function', `${family.familyType} family must expose resetSession`);
        assert(typeof family.getSessionState === 'function', `${family.familyType} family must expose getSessionState`);
        assert(typeof family.destroySession === 'function', `${family.familyType} family must expose destroySession`);
    });

    console.log('Specialized family session API exposure test passed');
}

function testOutcomePipelineIntegration() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const family = createBaseActivityFamily(config);

    assert(typeof family.handleSuccess === 'function', 'Base family must expose handleSuccess');
    assert(typeof family.handleMistake === 'function', 'Base family must expose handleMistake');
    assert(typeof family.clearOutcome === 'function', 'Base family must expose clearOutcome');
    assert(typeof family.isOutcomeBusy === 'function', 'Base family must expose isOutcomeBusy');

    let completed = false;
    family.handleSuccess({
        message: 'Success Message',
        mode: 'immediate',
        durationMs: 5,
        onComplete: () => {
            completed = true;
        }
    });

    assert(family.isOutcomeBusy() === true, 'isOutcomeBusy should be true during active flow');

    setTimeout(() => {
        assert(completed === true, 'onComplete callback must be triggered after duration');
        assert(family.isOutcomeBusy() === false, 'isOutcomeBusy should reset after completion');
        console.log('Outcome pipeline integration test passed');
    }, 20);
}

function testFamilyDefaultModes() {
    const doc = createFakeDocument();

    // Choice family success default: surface
    const choice = createChoiceActivityFamily(createValidConfig(doc));
    let choiceCompleted = false;
    choice.handleSuccess({
        message: 'choice success',
        durationMs: 5,
        onComplete: () => { choiceCompleted = true; }
    });
    // Check that success indicator is shown (denoting surface mode)
    const choiceIndicator = findByTestId(choice.shell, 'activity-success-indicator');
    assert(choiceIndicator !== null, 'Choice family success default should trigger indicator overlay');

    // Grid family success default: surface
    const grid = createGridActivityFamily(createValidConfig(doc));
    let gridCompleted = false;
    grid.handleSuccess({
        message: 'grid success',
        durationMs: 5,
        onComplete: () => { gridCompleted = true; }
    });
    const gridIndicator = findByTestId(grid.shell, 'activity-success-indicator');
    assert(gridIndicator !== null, 'Grid family success default should trigger indicator overlay');

    // QA family success default: immediate
    const qa = createQuestionAnswerActivityFamily(createValidConfig(doc));
    let qaCompleted = false;
    qa.handleSuccess({
        message: 'qa success',
        durationMs: 5,
        onComplete: () => { qaCompleted = true; }
    });
    const qaIndicator = findByTestId(qa.shell, 'activity-success-indicator');
    assert(qaIndicator === null, 'QA family success default should not trigger success indicator (immediate mode)');

    setTimeout(() => {
        assert(choiceCompleted && gridCompleted && qaCompleted, 'All family outcomes must complete successfully');
        console.log('Family default modes test passed');
    }, 20);
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
    testSessionApiExposureAndNoConfigBehavior();
    testConfigureSessionAndProgression();
    testRestartResetAndDestroySessionLifecycle();
    testResetAndDestroyAlsoManageConfiguredSession();
    testSpecializedFamiliesExposeSessionApis();
    testOutcomePipelineIntegration();
    testFamilyDefaultModes();
    console.log('=== All Activity Families Unit Tests Passed ===');
}
