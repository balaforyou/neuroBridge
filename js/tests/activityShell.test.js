import { createActivityShell } from '../activityShell.js';

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

    querySelector(selector) {
        if (selector.startsWith('.')) {
            const className = selector.slice(1);
            return findByClassName(this, className);
        }
        return null;
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

function findById(root, id) {
    if (root.id === id) {
        return root;
    }
    for (const child of root.children || []) {
        const match = findById(child, id);
        if (match) return match;
    }
    return null;
}

function countNodesWithText(root, text) {
    let count = 0;
    if (root.textContent === text) {
        count++;
    }
    for (const child of root.children || []) {
        count += countNodesWithText(child, text);
    }
    return count;
}

function hasTextDeep(root, text) {
    if (root.textContent && root.textContent.includes(text)) {
        return true;
    }
    for (const child of root.children || []) {
        if (hasTextDeep(child, text)) return true;
    }
    return false;
}

function createValidConfig(doc = createFakeDocument()) {
    return {
        activityId: 'test-activity',
        activityTitle: 'Directions',
        prompt: 'Tap UP',
        instruction: 'Find the matching direction arrow.',
        taskRenderer: () => {
            const el = doc.createElement('div');
            el.setAttribute('data-testid', 'test-task-content');
            el.textContent = 'choices content';
            return el;
        },
        document: doc
    };
}

function testConfigValidation() {
    // Missing title
    try {
        createActivityShell({
            activityId: 'test',
            prompt: 'Tap UP',
            taskRenderer: () => {},
            document: createFakeDocument()
        });
        assert(false, 'Should throw if activityTitle is missing');
    } catch (e) {
        assert(e.message.includes('activityTitle'), 'Expected activityTitle validation error');
    }

    // Missing prompt
    try {
        createActivityShell({
            activityId: 'test',
            activityTitle: 'Directions',
            taskRenderer: () => {},
            document: createFakeDocument()
        });
        assert(false, 'Should throw if prompt is missing');
    } catch (e) {
        assert(e.message.includes('prompt'), 'Expected prompt validation error');
    }

    // Missing taskRenderer
    try {
        createActivityShell({
            activityId: 'test',
            activityTitle: 'Directions',
            prompt: 'Tap UP',
            document: createFakeDocument()
        });
        assert(false, 'Should throw if taskRenderer is missing');
    } catch (e) {
        assert(e.message.includes('taskRenderer'), 'Expected taskRenderer validation error');
    }

    console.log('Config validation test passed');
}

function testStructuralZones() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const shell = createActivityShell(config);

    assert(shell.getAttribute('data-testid') === 'activity-shell', 'Should have activity-shell testid');
    
    const header = findByTestId(shell, 'activity-header');
    assert(header !== null, 'Header must exist');

    const instruction = findByTestId(shell, 'worksheet-instruction');
    assert(instruction !== null, 'Instruction zone must exist');

    const activity = findByTestId(shell, 'worksheet-activity');
    assert(activity !== null, 'Activity task zone must exist');

    const feedback = findByTestId(shell, 'worksheet-feedback');
    assert(feedback !== null, 'Feedback zone must exist');

    console.log('Structural zones test passed');
}

function testSingleTitleDisplay() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const shell = createActivityShell(config);

    // Title should appear exactly once in the header, and not be repeated in the instruction/prompt panel
    const titleHeaderCount = countNodesWithText(shell, 'Directions');
    assert(titleHeaderCount === 1, `Title 'Directions' must appear exactly once, found ${titleHeaderCount}`);

    // Verify it is in the header title element
    const titleEl = findByTestId(shell, 'activity-title');
    assert(titleEl !== null && titleEl.textContent === 'Directions', 'Title element must hold the correct title');

    // Instruction zone should not contain 'Directions'
    const instructionZone = findByTestId(shell, 'worksheet-instruction');
    assert(!hasTextDeep(instructionZone, 'Directions'), 'Instruction zone must not repeat the activity title');

    console.log('Single title display test passed');
}

function testNoExternalDashboardLink() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const shell = createActivityShell(config);

    // Assert that no "Back to Dashboard" or outer dashboard text is found
    assert(!hasTextDeep(shell, 'Back to Dashboard'), 'Should not contain Back to Dashboard link');
    assert(!hasTextDeep(shell, 'Dashboard'), 'Should not contain Dashboard label');

    // Standard Home button must exist
    const homeBtn = findById(shell, 'home-button');
    assert(homeBtn !== null, 'Standard Home button must be rendered');

    console.log('No external dashboard link test passed');
}

function testPromptUpdating() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    const shell = createActivityShell(config);

    const promptHeader = findByTestId(shell, 'prompt-header');
    assert(promptHeader.textContent === 'Tap UP', 'Should initialize prompt text');

    shell.updatePrompt('Tap DOWN');
    assert(promptHeader.textContent === 'Tap DOWN', 'updatePrompt should change prompt text');

    console.log('Prompt updating test passed');
}

function testHelpCollapseWhenDisabled() {
    const doc = createFakeDocument();
    const config = createValidConfig(doc);
    config.help = { enabled: false, hints: ['Test hint'] };

    const shell = createActivityShell(config);
    const helpZone = findByTestId(shell, 'worksheet-help');

    assert(helpZone === null, 'Help zone should be pruned from the DOM when disabled');

    // Grid layout class should collapse
    const mainGrid = findByClassName(shell, 'worksheet-shell__main');
    assert(mainGrid !== null, 'Main grid must exist');
    assert(!mainGrid.className.includes('lg:grid-cols-[minmax(0,1fr)_18rem]'), 'Grid track should collapse to 1 column');

    console.log('Help collapse test passed');
}

export function runAllTests() {
    console.log('=== Shared Activity Shell Foundation Unit Tests ===');
    testConfigValidation();
    testStructuralZones();
    testSingleTitleDisplay();
    testNoExternalDashboardLink();
    testPromptUpdating();
    testHelpCollapseWhenDisabled();
    console.log('=== All Shared Activity Shell Foundation Unit Tests Passed ===');
}
