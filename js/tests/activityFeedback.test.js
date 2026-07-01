import { createActivityFeedback } from '../activityFeedback.js';

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

    appendChild(child) {
        this.children.push(child);
        return child;
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

function createContainer(documentRef = createFakeDocument()) {
    const container = documentRef.createElement('section');
    container.setAttribute('data-testid', 'feedback-frame');
    return { documentRef, container };
}

function testSuccessRendering() {
    const { documentRef, container } = createContainer();
    const feedback = createActivityFeedback({ container, document: documentRef });

    feedback.showSuccess();

    const banner = findByTestId(container, 'activity-feedback-success');
    assert(banner, 'Success banner should render');
    assert(getText(banner).includes('Great work!'), 'Success title should use existing SIRAASH styling content');
    assert(getText(banner).includes('You found the answer.'), 'Success banner should use default success message');
    assert(feedback.isVisible() === true, 'Success banner should report visible');
    console.log('Activity feedback success rendering test passed');
}

function testMistakeRendering() {
    const { documentRef, container } = createContainer();
    const feedback = createActivityFeedback({ container, document: documentRef });

    feedback.showMistake();

    const banner = findByTestId(container, 'activity-feedback-mistake');
    assert(banner, 'Mistake banner should render');
    assert(getText(banner).includes('You got close.'), 'Mistake title should use existing SIRAASH styling content');
    assert(getText(banner).includes('Try again.'), 'Mistake banner should use default mistake message');
    assert(feedback.isVisible() === true, 'Mistake banner should report visible');
    console.log('Activity feedback mistake rendering test passed');
}

function testCustomMessagesAndSingleBanner() {
    const { documentRef, container } = createContainer();
    const feedback = createActivityFeedback({ container, document: documentRef });

    feedback.showSuccess('Well done, keep going.');
    assert(getText(container).includes('Well done, keep going.'), 'Custom success message should render');

    feedback.showMistake('Not this one.');
    assert(getText(container).includes('Not this one.'), 'Custom mistake message should render');
    assert(!getText(container).includes('Well done, keep going.'), 'Only one banner should remain visible at a time');
    console.log('Activity feedback custom message test passed');
}

function testClearKeepsReservedFrame() {
    const { documentRef, container } = createContainer();
    const feedback = createActivityFeedback({ container, document: documentRef });

    feedback.showSuccess();
    const frame = findByTestId(container, 'activity-feedback');
    assert(frame, 'Reserved feedback frame should exist after rendering');

    feedback.clear();
    assert(feedback.isVisible() === false, 'clear() should hide feedback');
    assert(findByTestId(container, 'activity-feedback'), 'clear() should keep the reserved feedback frame');
    assert(getText(container).trim() === '', 'clear() should remove visible feedback content');
    console.log('Activity feedback clear lifecycle test passed');
}

function testUnsupportedLayoutPatternsAreAbsent() {
    const { documentRef, container } = createContainer();
    const feedback = createActivityFeedback({ container, document: documentRef });

    feedback.showSuccess();
    const rootText = getText(container);
    assert(!String(container.className).includes('absolute'), 'Feedback container should not use absolute positioning');
    assert(!rootText.includes('popup'), 'Feedback content should not behave like a popup');
    console.log('Activity feedback layout contract test passed');
}

function runAllTests() {
    console.log('=== Activity Feedback Contract Tests ===');
    testSuccessRendering();
    testMistakeRendering();
    testCustomMessagesAndSingleBanner();
    testClearKeepsReservedFrame();
    testUnsupportedLayoutPatternsAreAbsent();
    console.log('=== All Activity Feedback Contract Tests Passed ===');
}

export { runAllTests };
