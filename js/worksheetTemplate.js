import { renderSiraashCompletionFeedback } from './siraashFeedback.js';

export const WORKSHEET_TEMPLATE_VERSION = '1.0';

export const WORKSHEET_ACTIVITY_TYPES = {
    MATCHING: 'matching',
    QUIZ: 'quiz',
    FILL_IN_BLANKS: 'fill-in-blanks',
    WORD_PROBLEM: 'word-problem',
    SHOPPING_CART: 'shopping-cart',
    NUMBER_BRIDGES: 'number-bridges',
    PICTURE_DESCRIPTION: 'picture-description',
    SEQUENCING: 'sequencing',
    MEASUREMENT: 'measurement'
};

export const WORKSHEET_TEMPLATE_REGIONS = {
    HEADER: 'worksheet-header',
    MAIN_TASK: 'worksheet-main-task',
    SUPPORT: 'worksheet-support',
    FEEDBACK: 'worksheet-feedback',
    COMPLETION: 'worksheet-completion'
};

export function normalizeWorksheetLearnerName(learnerName) {
    const normalized = String(learnerName || '').trim();
    return normalized || 'Learner';
}

export function createWorksheetTemplateState(config = {}) {
    return {
        worksheetId: config.worksheetId || '',
        activityId: config.activityId || '',
        learnerName: normalizeWorksheetLearnerName(config.learnerName),
        title: config.title || '',
        learnerTitle: config.learnerTitle || config.title || '',
        activityType: config.activityType || WORKSHEET_ACTIVITY_TYPES.MATCHING,
        domain: config.domain || '',
        skills: Array.isArray(config.skills) ? config.skills.slice() : [],
        roundState: {
            roundNumber: config.roundState?.roundNumber || 1,
            stars: config.roundState?.stars || 0
        },
        questionState: config.questionState || null,
        supportState: config.supportState || null,
        feedbackState: config.feedbackState || null,
        completionState: config.completionState || null
    };
}

export function getWorksheetSupportPrompts(learnerName = 'Learner') {
    const normalizedName = normalizeWorksheetLearnerName(learnerName);

    return {
        initial: `Need a clue, ${normalizedName}? \u{1F331}`,
        delayed: `${normalizedName}, SIRAASH can help you \u{1F331}`,
        futureScaffoldLevels: ['Clue', 'Visual aid', 'Worked example', 'Step prompt']
    };
}

export function applyWorksheetHeaderState({
    documentRef = globalThis.document,
    roundNumber = 1,
    stars = 0,
    levelLabel = null
} = {}) {
    const roundEl = documentRef?.getElementById?.('ui-round');
    if (roundEl) {
        roundEl.textContent = String(roundNumber);
    }

    const questionEl = documentRef?.getElementById?.('ui-question');
    if (questionEl) {
        questionEl.textContent = String(roundNumber);
    }

    const starsEl = documentRef?.getElementById?.('ui-stars');
    if (starsEl) {
        starsEl.textContent = String(stars);
    }

    const levelEl = documentRef?.getElementById?.('ui-level');
    if (levelEl && levelLabel) {
        levelEl.textContent = String(levelLabel);
    }
}

export function renderWorksheetCompletion({
    learnerName = 'Learner',
    message,
    actionTestId,
    actionLabel = 'Next Round'
} = {}) {
    return renderSiraashCompletionFeedback({
        learnerName,
        message,
        actionTestId,
        actionLabel
    });
}

export function renderWorksheetResultSummary({
    learnerName = 'Learner',
    summary = {},
    testIdPrefix = 'worksheet',
    completionMessage = 'You finished your activity.',
    levelLabel = '',
    motivationalLine = '',
    reviewContent = '',
    reviewTitle = 'Review',
    nextActionLabel = 'Try Again',
    homeActionLabel = 'Home'
} = {}) {
    const normalizedLearnerName = normalizeWorksheetLearnerName(learnerName);
    const total = Number(summary.total || 0);
    const correct = Number(summary.correct || 0);
    const accuracy = Number(summary.accuracy || 0);
    const timeTakenSeconds = Number(summary.timeTakenSeconds || 0);
    const averageTimeSeconds = Number(summary.averageTimeSeconds || 0);
    const hintsUsed = Number(summary.hintsUsed || 0);
    const mistakeCount = Number(summary.mistakeCount || 0);
    const levelMarkup = levelLabel
        ? `
                <div data-testid="${testIdPrefix}-result-level" class="w-full shrink-0 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-900">
                    ${levelLabel}
                </div>
        `
        : '';
    const reviewMarkup = reviewContent
        ? `
            <div data-testid="${testIdPrefix}-review" class="flex min-h-0 w-full flex-col rounded-2xl border-2 border-amber-100 bg-[#fffaf0] p-3 text-left">
                <h3 class="shrink-0 text-base font-black text-slate-950">${reviewTitle}</h3>
                ${reviewContent}
            </div>
        `
        : '';
    const layoutClass = reviewContent
        ? 'grid h-full min-h-0 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-2 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-3 text-center md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.86fr)] md:grid-rows-1'
        : 'flex h-full min-h-0 flex-col justify-center overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-3 text-center';

    return `
        <section data-testid="${testIdPrefix}-results" class="${layoutClass}">
            <div data-testid="${testIdPrefix}-result-summary" class="flex min-h-0 flex-col gap-2 md:h-full">
                <div data-testid="siraash-completion-feedback" class="w-full shrink-0 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-slate-950 shadow-sm">
                    <div class="flex items-center justify-center gap-3">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-3xl font-black text-white" aria-hidden="true">&#10003;</div>
                        <div class="text-left">
                            <p data-testid="siraash-completion-title" class="text-lg font-black leading-tight sm:text-xl">Great work, ${normalizedLearnerName}! &#127793;</p>
                            <p data-testid="${testIdPrefix}-result-header-accuracy" class="mt-1 text-2xl font-black leading-tight text-emerald-900 sm:text-3xl">${accuracy}% Accuracy</p>
                            <p data-testid="${testIdPrefix}-result-header-score" class="text-sm font-black text-slate-900 sm:text-base">${correct} / ${total} Correct</p>
                            <p data-testid="siraash-completion-message" class="text-sm font-bold text-emerald-900 sm:text-base">${completionMessage}</p>
                            ${motivationalLine}
                        </div>
                    </div>
                </div>

                ${levelMarkup}

                <div data-testid="${testIdPrefix}-metrics" class="w-full shrink-0 rounded-2xl border-2 border-sky-200 bg-sky-50 p-3">
                    <div class="grid grid-cols-2 gap-2 text-left text-sm font-black text-slate-950 lg:grid-cols-3">
                        <p data-testid="${testIdPrefix}-total">Questions: ${total}</p>
                        <p data-testid="${testIdPrefix}-correct-total">Correct / Total: ${correct} / ${total}</p>
                        <p data-testid="${testIdPrefix}-accuracy">Accuracy: ${accuracy}%</p>
                        <p data-testid="${testIdPrefix}-time-taken">Time Taken: ${timeTakenSeconds} sec</p>
                        <p data-testid="${testIdPrefix}-average-time">Average Time: ${averageTimeSeconds} sec/question</p>
                        <p data-testid="${testIdPrefix}-hints-used">Hints Used: ${hintsUsed}</p>
                        <p data-testid="${testIdPrefix}-mistakes-corrected">Mistakes Corrected: ${mistakeCount}</p>
                    </div>
                </div>

                <div data-testid="${testIdPrefix}-actions" class="flex shrink-0 flex-wrap justify-center gap-3 md:mt-auto">
                    <button data-testid="${testIdPrefix}-next-round-button" type="button" class="min-h-[44px] rounded-full bg-emerald-700 px-5 py-2 text-base font-black text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-300">${nextActionLabel}</button>
                    <button data-testid="${testIdPrefix}-home-button" type="button" class="min-h-[44px] rounded-full border-2 border-emerald-200 bg-white px-5 py-2 text-base font-black text-emerald-900">${homeActionLabel}</button>
                </div>
            </div>
            ${reviewMarkup}
        </section>
    `;
}
