import { createActivitySuccessIndicator } from '../activitySuccessIndicator.js';

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
    container.setAttribute('data-testid', 'activity-surface');
    container.className = 'relative min-h-[12rem]';
    return { documentRef, container };
}

async function testRendersIntoSuppliedContainer() {
    const { documentRef, container } = createContainer();
    const indicator = createActivitySuccessIndicator({ container, document: documentRef });

    indicator.show();

    assert(findByTestId(container, 'activity-success-indicator'), 'Indicator should render into supplied container');
    assert(indicator.isVisible() === true, 'Indicator should report visible after show');
    indicator.clear();
    console.log('Activity success indicator container render test passed');
}

async function testDefaultMessageAndCustomMessage() {
    const { documentRef, container } = createContainer();
    const indicator = createActivitySuccessIndicator({ container, document: documentRef, durationMs: 50 });

    indicator.show();
    assert(getText(container).includes('Great work!'), 'Default success message should render');

    indicator.show({ message: 'Round complete.' });
    assert(getText(container).includes('Round complete.'), 'Custom message should render');
    assert(!getText(container).includes('Great work!'), 'Custom message should replace prior content');
    indicator.clear();
    console.log('Activity success indicator message test passed');
}

async function testClearAndVisibility() {
    const { documentRef, container } = createContainer();
    const indicator = createActivitySuccessIndicator({ container, document: documentRef });

    indicator.show();
    assert(indicator.isVisible() === true, 'Indicator should be visible after show');
    indicator.clear();
    assert(indicator.isVisible() === false, 'Indicator should report hidden after clear');
    assert(getText(container).trim() === '', 'clear() should remove visible indicator content');
    console.log('Activity success indicator clear lifecycle test passed');
}

async function testAutoClearAndNoDuplicateIndicators() {
    const { documentRef, container } = createContainer();
    const indicator = createActivitySuccessIndicator({ container, document: documentRef, durationMs: 10 });

    indicator.show();
    indicator.show({ message: 'Again', durationMs: 10 });

    const roots = countByTestId(container, 'activity-success-indicator');
    assert(roots === 1, 'Multiple show() calls should not duplicate the indicator');

    await wait(25);
    assert(indicator.isVisible() === false, 'Indicator should auto-clear after duration');
    console.log('Activity success indicator auto-clear test passed');
}

async function testReservedVariantsAndNoFullPageOverlay() {
    const { documentRef, container } = createContainer();
    const indicator = createActivitySuccessIndicator({ container, document: documentRef });

    indicator.show({ variant: 'round-complete' });
    indicator.show({ variant: 'level-complete', message: 'Level complete.' });

    const root = findByTestId(container, 'activity-success-indicator');
    assert(root, 'Reserved variants should still render');
    assert(!String(root.className).includes('fixed'), 'Indicator should not require full-page overlay');
    assert(!String(root.className).includes('w-screen'), 'Indicator should stay scoped to activity surface');
    indicator.clear();
    console.log('Activity success indicator reserved variant test passed');
}

async function runAllTests() {
    console.log('=== Activity Success Indicator Contract Tests ===');
    await testRendersIntoSuppliedContainer();
    await testDefaultMessageAndCustomMessage();
    await testClearAndVisibility();
    await testAutoClearAndNoDuplicateIndicators();
    await testReservedVariantsAndNoFullPageOverlay();
    console.log('=== All Activity Success Indicator Contract Tests Passed ===');
}

function countByTestId(root, testId) {
    let total = root.getAttribute?.('data-testid') === testId ? 1 : 0;
    for (const child of root.children || []) {
        total += countByTestId(child, testId);
    }
    return total;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { runAllTests };
