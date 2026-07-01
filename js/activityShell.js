import { renderSiraashFeedback } from './siraashFeedback.js';

/**
 * Creates a standard SIRAASH Activity Shell.
 *
 * @param {Object} config - Configuration object
 * @param {string} config.activityId - Unique activity identifier
 * @param {string} config.activityTitle - Single learner-facing title for the header
 * @param {string} config.prompt - Visually dominant instruction prompt (e.g. 'Tap UP')
 * @param {string} [config.instruction] - Sub-instruction details
 * @param {function} config.taskRenderer - Function returning the main task content HTMLElement
 * @param {Object} [config.help] - Optional help configuration
 * @param {boolean} config.help.enabled - Whether hints are enabled
 * @param {string[]} config.help.hints - List of hints
 * @param {Document} [config.document] - Document context override (primarily for tests)
 * @returns {HTMLElement} The constructed activity shell DOM element
 */
export function createActivityShell(config = {}) {
    const ownerDocument = config.document || document;

    if (!config.activityTitle || typeof config.activityTitle !== 'string') {
        throw new Error('activityTitle is required');
    }
    if (!config.prompt || typeof config.prompt !== 'string') {
        throw new Error('prompt is required');
    }
    if (typeof config.taskRenderer !== 'function') {
        throw new Error('taskRenderer must be a function');
    }

    const shell = ownerDocument.createElement('div');
    shell.className = 'flex h-full w-full flex-col gap-2 p-2 sm:gap-3 sm:p-3 bg-[#edf8f3] text-slate-950 select-none';
    shell.setAttribute('data-testid', 'activity-shell');

    // 1. Create Header
    const header = ownerDocument.createElement('header');
    header.className = 'shrink-0 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-[#fff7df] via-[#e2f6ee] to-[#dff1fb] px-3 py-2 shadow-sm sm:px-5 sm:py-3';
    header.setAttribute('data-testid', 'activity-header');

    const flexContainer = ownerDocument.createElement('div');
    flexContainer.className = 'flex items-center justify-between gap-3';

    const leftContainer = ownerDocument.createElement('div');
    leftContainer.className = 'min-w-0 flex items-center gap-2 sm:gap-3';

    // Standard Home control
    const homeBtn = ownerDocument.createElement('button');
    homeBtn.type = 'button';
    homeBtn.id = 'home-button';
    homeBtn.className = 'min-h-[44px] shrink-0 rounded-full border-2 border-emerald-200 bg-white/80 px-3 py-2 text-sm font-black text-emerald-900 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-300/70 sm:text-base';
    homeBtn.innerHTML = '<span aria-hidden="true">&#127968;</span> <span class="hidden sm:inline">Home</span>';
    homeBtn.addEventListener('click', () => {
        window.parent?.postMessage({ type: 'SIRAASH_ACTIVITY_HOME' }, '*');
    });

    // SIRAASH identity
    const siraashLabel = ownerDocument.createElement('div');
    siraashLabel.setAttribute('aria-label', 'SIRAASH');
    siraashLabel.className = 'shrink-0 rounded-full border-2 border-emerald-300 bg-emerald-100/90 px-3 py-1.5 text-lg font-black tracking-[0.12em] text-emerald-900 shadow-sm sm:text-2xl';
    siraashLabel.textContent = 'SIRAASH';

    // Title Container
    const titleWrapper = ownerDocument.createElement('div');
    titleWrapper.className = 'min-w-0';

    const typeLabel = ownerDocument.createElement('div');
    typeLabel.className = 'text-xs font-black uppercase tracking-[0.12em] text-emerald-800 sm:text-sm';
    typeLabel.textContent = 'Activity';

    const titleEl = ownerDocument.createElement('h1');
    titleEl.className = 'truncate text-lg font-black text-slate-950 sm:text-2xl';
    titleEl.textContent = config.activityTitle;
    titleEl.setAttribute('data-testid', 'activity-title');

    titleWrapper.append(typeLabel, titleEl);
    leftContainer.append(homeBtn, siraashLabel, titleWrapper);
    flexContainer.append(leftContainer);
    header.append(flexContainer);

    // 2. Create Outer Section for the content box
    const mainBox = ownerDocument.createElement('section');
    mainBox.className = 'min-h-0 flex-1 rounded-3xl border-4 border-cyan-200 bg-[#fffaf0] p-3 shadow-xl flex flex-col gap-3 h-full';

    // A. Prompt Area (visually dominant)
    const promptZone = ownerDocument.createElement('header');
    promptZone.className = 'rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-slate-950 shrink-0';
    promptZone.setAttribute('data-testid', 'worksheet-instruction');

    const promptH2 = ownerDocument.createElement('h2');
    promptH2.className = 'text-lg sm:text-xl font-black leading-tight';
    promptH2.textContent = config.prompt;
    promptH2.setAttribute('data-testid', 'prompt-header');

    const instructionP = ownerDocument.createElement('p');
    instructionP.className = 'mt-1 text-sm sm:text-base font-bold leading-snug text-slate-700';
    instructionP.textContent = config.instruction || 'Find the matching item.';

    promptZone.append(promptH2, instructionP);

    // B. Task Area
    const activityZone = ownerDocument.createElement('section');
    activityZone.className = 'worksheet-shell__activity min-h-[16rem] rounded-2xl border-2 border-sky-200 bg-white p-4 flex-1 min-h-0 flex flex-col justify-center items-center';
    activityZone.setAttribute('data-testid', 'worksheet-activity');
    const taskEl = config.taskRenderer();
    if (taskEl) {
        activityZone.append(taskEl);
    }

    // C. Help Zone
    const helpZone = ownerDocument.createElement('aside');
    helpZone.className = 'worksheet-shell__help rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-slate-950';
    helpZone.setAttribute('data-testid', 'worksheet-help');

    const hints = config.help?.enabled === false
        ? []
        : (config.help?.hints || []).filter(h => typeof h === 'string' && h.trim().length > 0);

    if (!hints.length) {
        helpZone.setAttribute('aria-disabled', 'true');
        helpZone.setAttribute('hidden', '');
    } else {
        let nextHintIndex = 0;
        const hintBtn = ownerDocument.createElement('button');
        hintBtn.type = 'button';
        hintBtn.className = 'worksheet-shell__hint-button min-h-[44px] rounded-full border-2 border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-900 shadow-sm';
        hintBtn.setAttribute('data-testid', 'worksheet-hint-button');
        hintBtn.textContent = 'Need a clue?';

        const hintText = ownerDocument.createElement('p');
        hintText.className = 'worksheet-shell__hint-text mt-3 min-h-[1.5rem] text-sm font-bold text-amber-900';
        hintText.setAttribute('aria-live', 'polite');

        hintBtn.addEventListener('click', () => {
            hintText.textContent = hints[nextHintIndex];
            if (nextHintIndex < hints.length - 1) {
                nextHintIndex += 1;
            }
        });
        helpZone.append(hintBtn, hintText);
    }

    // D. Feedback Zone
    const feedbackZone = ownerDocument.createElement('section');
    feedbackZone.className = 'worksheet-shell__feedback min-h-[4rem] shrink-0';
    feedbackZone.setAttribute('data-testid', 'worksheet-feedback');

    // E. Grid Layout Controller
    const mainGrid = ownerDocument.createElement('main');
    if (hints.length > 0) {
        mainGrid.className = 'worksheet-shell__main grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]';
        mainGrid.append(activityZone, helpZone);
    } else {
        mainGrid.className = 'worksheet-shell__main grid min-h-0 flex-1 grid-cols-1 gap-3';
        mainGrid.append(activityZone);
    }

    mainBox.append(promptZone, mainGrid, feedbackZone);
    shell.append(header, mainBox);

    // API Bindings
    shell.updatePrompt = (newPromptText) => {
        promptH2.textContent = newPromptText;
    };

    shell.showFeedback = (type) => {
        feedbackZone.innerHTML = renderSiraashFeedback(type);
    };

    shell.clearFeedback = () => {
        feedbackZone.innerHTML = '';
    };

    return shell;
}
