import { createActivityCompletionSurface } from '../activityCompletionSurface.js';

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
        this.className = '';
        this.innerHTML = '';
        this.textContent = '';
        this.type = '';
        this.eventListeners = {};
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value);
    }

    getAttribute(name) {
        return this.attributes[name] ?? null;
    }

    appendChild(child) {
        this.children.push(child);
        return child;
    }

    append(...children) {
        children.flat().forEach(child => child && this.children.push(child));
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
    if (root.getAttribute?.('data-testid') === testId) return root;
    for (const child of root.children || []) {
        const match = findByTestId(child, testId);
        if (match) return match;
    }
    return null;
}

function getText(root) {
    return [root.textContent || '', ...(root.children || []).map(getText)].join(' ');
}

function createContainer(documentRef = createFakeDocument()) {
    const container = documentRef.createElement('section');
    container.setAttribute('data-testid', 'completion-frame');
    return { documentRef, container };
}

function testSummaryRendering() {
    const { documentRef, container } = createContainer();
    const surface = createActivityCompletionSurface({ container, document: documentRef, title: 'Directions' });

    surface.showSummary({
        message: 'Great work!',
        accuracyPercent: 100,
        correct: 4,
        incorrect: 0,
        durationSeconds: 18,
        completedItemsLabel: '4 directions'
    });

    assert(surface.isVisible() === true, 'Completion surface should become visible');
    assert(getText(container).includes('Great work!'), 'Summary message should render');
    assert(getText(container).includes('Accuracy: 100%'), 'Accuracy should render');
    assert(getText(container).includes('Correct: 4'), 'Correct count should render');
    assert(getText(container).includes('Incorrect: 0'), 'Incorrect count should render');
    assert(getText(container).includes('Duration: 18 sec'), 'Duration should render');
    assert(getText(container).includes('Completed: 4 directions'), 'Completed label should render');
    console.log('Completion summary rendering test passed');
}

function testDefaultMessageAndExtraMetrics() {
    const { documentRef, container } = createContainer();
    const surface = createActivityCompletionSurface({ container, document: documentRef, title: 'Directions' });

    surface.showSummary({
        accuracyPercent: 75,
        correct: 3,
        incorrect: 1,
        durationSeconds: 30,
        completedItemsLabel: '3 of 4',
        extraMetrics: {
            'Retry Count': 1,
            'Focus Time': '30 sec'
        }
    });

    assert(getText(container).includes('Great work!'), 'Default completion message should work');
    assert(getText(container).includes('Retry Count: 1'), 'Extra metric should render');
    assert(getText(container).includes('Focus Time: 30 sec'), 'Second extra metric should render');
    console.log('Completion default message and extra metric test passed');
}

function testActionsAndVisibilityLifecycle() {
    const { documentRef, container } = createContainer();
    let playAgainCount = 0;
    let homeCount = 0;

    const surface = createActivityCompletionSurface({
        container,
        document: documentRef,
        actions: [
            { label: 'Play Again', testId: 'play-again', onClick: () => { playAgainCount += 1; } },
            { label: 'Home', testId: 'go-home', onClick: () => { homeCount += 1; } }
        ]
    });

    surface.showSummary({ message: 'Done', completedItemsLabel: '1 item' });

    const playAgain = findByTestId(container, 'play-again');
    const home = findByTestId(container, 'go-home');
    assert(playAgain, 'Play Again action should render');
    assert(home, 'Home action should render');
    playAgain.click();
    home.click();
    assert(playAgainCount === 1, 'Play Again callback should fire');
    assert(homeCount === 1, 'Home callback should fire');

    surface.hide();
    assert(surface.isVisible() === false, 'hide() should clear visibility');
    assert(getText(container).trim() === '', 'hide() should clear content');
    console.log('Completion action wiring and hide lifecycle test passed');
}

function testUpdateActionsPreservesVisibility() {
    const { documentRef, container } = createContainer();
    const surface = createActivityCompletionSurface({ container, document: documentRef });

    surface.showSummary({ message: 'Done' });
    surface.updateActions([{ label: 'Play Again', testId: 'updated-play-again' }]);

    assert(surface.isVisible() === true, 'Updating actions should not hide completion');
    assert(findByTestId(container, 'updated-play-again'), 'Updated action should render');
    console.log('Completion action update test passed');
}

function testContainerStability() {
    const { documentRef, container } = createContainer();
    const surface = createActivityCompletionSurface({ container, document: documentRef });

    surface.showSummary({ message: 'Done' });
    const frame = findByTestId(container, 'siraash-completion-surface');
    assert(frame, 'Completion frame should exist');
    assert(!String(frame.className).includes('absolute'), 'Completion surface should not use absolute positioning');
    assert(surface.isVisible() === true, 'Completion should remain visible until hidden');
    console.log('Completion container stability test passed');
}

function runAllTests() {
    console.log('=== Activity Completion Surface Contract Tests ===');
    testSummaryRendering();
    testDefaultMessageAndExtraMetrics();
    testActionsAndVisibilityLifecycle();
    testUpdateActionsPreservesVisibility();
    testContainerStability();
    console.log('=== All Activity Completion Surface Contract Tests Passed ===');
}

export { runAllTests };
