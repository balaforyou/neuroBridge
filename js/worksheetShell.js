import {
    getSiraashCelebration,
    renderSiraashFeedback
} from './siraashFeedback.js';

export const WORKSHEET_TEMPLATE_TYPES = {
    MATCHING: 'matching',
    GUIDED_DISCOVERY: 'guided-discovery',
    PATTERN_BUILDER: 'pattern-builder',
    NARRATION: 'narration',
    AUDIO_CHAIN: 'audio-chain',
    FUNCTIONAL_LIFE: 'functional-life'
};

export function validateWorksheetConfig(config = {}) {
    const errors = [];
    const templateTypes = Object.values(WORKSHEET_TEMPLATE_TYPES);

    if (!templateTypes.includes(config.templateType)) {
        errors.push('templateType must be a registered worksheet template type');
    }

    if (!isNonEmptyString(config.title)) {
        errors.push('title is required');
    }

    if (!isNonEmptyString(config.instruction)) {
        errors.push('instruction is required');
    }

    if (typeof config.activity?.render !== 'function') {
        errors.push('activity.render must be a function');
    }

    if (config.help?.hints && !Array.isArray(config.help.hints)) {
        errors.push('help.hints must be an array when provided');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function createWorksheetZone(name, testId, tagName = 'section', ownerDocument = getOwnerDocument()) {
    const zone = ownerDocument.createElement(tagName);
    zone.className = `worksheet-shell__${name}`;
    zone.setAttribute('data-testid', testId);
    return zone;
}

export function createWorksheetShell(config = {}) {
    const validation = validateWorksheetConfig(config);
    if (!validation.isValid) {
        throw new Error(`Invalid worksheet config: ${validation.errors.join('; ')}`);
    }

    const ownerDocument = config.document || getOwnerDocument();
    const shell = createWorksheetZone('root', 'worksheet-shell', 'section', ownerDocument);
    shell.className = 'worksheet-shell flex min-h-0 w-full flex-col gap-3 rounded-3xl border-4 border-emerald-200 bg-[#fffaf0] p-3 shadow-xl';
    shell.setAttribute('data-template-type', config.templateType);

    const instructionZone = createInstructionZone(config, ownerDocument);
    const activityZone = createActivityZone(config, ownerDocument);
    const helpZone = createHelpZone(config, ownerDocument);
    const feedbackZone = createFeedbackZone(ownerDocument);
    const celebrationZone = createCelebrationZone(config, ownerDocument);

    const mainZone = ownerDocument.createElement('main');
    mainZone.className = 'worksheet-shell__main grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]';
    mainZone.append(activityZone, helpZone);

    shell.append(instructionZone, mainZone, feedbackZone, celebrationZone);

    shell.showFeedback = (type) => {
        feedbackZone.innerHTML = renderSiraashFeedback(type);
    };
    shell.clearFeedback = () => {
        feedbackZone.innerHTML = '';
    };
    shell.setCompletionMode = (isComplete) => {
        const complete = Boolean(isComplete);
        shell.setAttribute('data-visual-state', complete ? 'completion' : 'learning');
        setHidden(instructionZone, complete);
        setHidden(feedbackZone, complete);
        setHidden(celebrationZone, complete || celebrationZone.getAttribute('data-enabled') !== 'true');

        const helpHasContent = helpZone.getAttribute('aria-disabled') !== 'true';
        setHidden(helpZone, complete || !helpHasContent);
        mainZone.className = complete
            ? 'worksheet-shell__main grid min-h-0 flex-1 grid-cols-1 gap-3'
            : 'worksheet-shell__main grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]';
    };
    shell.setCompletionMode(false);

    return shell;
}

function setHidden(element, isHidden) {
    if (isHidden) {
        element.setAttribute('hidden', '');
        return;
    }

    element.removeAttribute?.('hidden');
}

function createInstructionZone(config, ownerDocument) {
    const zone = createWorksheetZone('instruction', 'worksheet-instruction', 'header', ownerDocument);
    zone.className = 'worksheet-shell__instruction rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-slate-950';

    const title = ownerDocument.createElement('h2');
    title.className = 'text-lg sm:text-xl font-black leading-tight';
    title.textContent = config.title;

    const instruction = ownerDocument.createElement('p');
    instruction.className = 'mt-1 text-sm sm:text-base font-bold leading-snug text-slate-700';
    instruction.textContent = config.instruction;

    zone.append(title, instruction);
    return zone;
}

function createActivityZone(config, ownerDocument) {
    const zone = createWorksheetZone('activity', 'worksheet-activity', 'section', ownerDocument);
    zone.className = 'worksheet-shell__activity min-h-[16rem] rounded-2xl border-2 border-sky-200 bg-white p-4';

    const activityContent = config.activity.render();
    if (activityContent) {
        zone.append(activityContent);
    }

    return zone;
}

function createHelpZone(config, ownerDocument) {
    const zone = createWorksheetZone('help', 'worksheet-help', 'aside', ownerDocument);
    zone.className = 'worksheet-shell__help rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-slate-950';

    const hints = config.help?.enabled === false
        ? []
        : (config.help?.hints || []).filter(isNonEmptyString);

    if (!hints.length) {
        zone.setAttribute('aria-disabled', 'true');
        zone.setAttribute('hidden', '');
        return zone;
    }

    let nextHintIndex = 0;
    const button = ownerDocument.createElement('button');
    button.type = 'button';
    button.className = 'worksheet-shell__hint-button min-h-[44px] rounded-full border-2 border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-900 shadow-sm';
    button.setAttribute('data-testid', 'worksheet-hint-button');
    button.textContent = 'Need a clue?';

    const hintText = ownerDocument.createElement('p');
    hintText.className = 'worksheet-shell__hint-text mt-3 min-h-[1.5rem] text-sm font-bold text-amber-900';
    hintText.setAttribute('aria-live', 'polite');

    button.addEventListener('click', () => {
        hintText.textContent = hints[nextHintIndex];
        if (nextHintIndex < hints.length - 1) {
            nextHintIndex += 1;
        }
    });

    zone.append(button, hintText);
    return zone;
}

function createFeedbackZone(ownerDocument) {
    const zone = createWorksheetZone('feedback', 'worksheet-feedback', 'section', ownerDocument);
    zone.className = 'worksheet-shell__feedback min-h-[4rem]';
    return zone;
}

function createCelebrationZone(config, ownerDocument) {
    const zone = createWorksheetZone('celebration', 'worksheet-celebration', 'section', ownerDocument);
    zone.className = 'worksheet-shell__celebration min-h-0';

    const levelUp = getSiraashCelebration('levelUp');
    const isEnabled = Boolean(config.celebration?.enabled && levelUp?.enabled);
    zone.setAttribute('data-enabled', String(isEnabled));

    if (!isEnabled) {
        zone.setAttribute('aria-hidden', 'true');
        return zone;
    }

    const title = ownerDocument.createElement('h3');
    title.textContent = levelUp.title;
    const message = ownerDocument.createElement('p');
    message.textContent = levelUp.message;
    zone.append(title, message);
    return zone;
}

function getOwnerDocument() {
    if (globalThis.document?.createElement) {
        return globalThis.document;
    }

    throw new Error('createWorksheetShell requires a DOM document');
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
