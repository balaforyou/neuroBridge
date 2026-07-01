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
    const total = Number(summary.total || 0);
    const correct = Number(summary.correct || 0);
    const accuracy = Number(summary.accuracy || 0);
    const timeTakenSeconds = Number(summary.timeTakenSeconds || 0);
    const averageTimeSeconds = Number(summary.averageTimeSeconds || 0);
    const hintsUsed = Number(summary.hintsUsed || 0);
    const mistakeCount = Number(summary.mistakeCount || 0);

    return renderWorksheetResultScreen({
        learnerName,
        testIdPrefix,
        completionMessage,
        headerSummary: {
            accuracy: `${accuracy}% Accuracy`,
            score: `${correct} / ${total} Correct`,
            extra: motivationalLine
        },
        metrics: [
            { id: 'total', label: 'Questions', value: total },
            { id: 'correct-total', label: 'Correct / Total', value: `${correct} / ${total}` },
            { id: 'accuracy', label: 'Accuracy', value: `${accuracy}%` },
            { id: 'time-taken', label: 'Time Taken', value: `${timeTakenSeconds} sec` },
            { id: 'average-time', label: 'Average Time', value: `${averageTimeSeconds} sec/question` },
            { id: 'hints-used', label: 'Hints Used', value: hintsUsed },
            { id: 'mistakes-corrected', label: 'Mistakes Corrected', value: mistakeCount }
        ],
        activitySummary: levelLabel
            ? {
                testId: `${testIdPrefix}-result-level`,
                content: levelLabel
            }
            : null,
        review: reviewContent
            ? {
                title: reviewTitle,
                content: reviewContent
            }
            : null,
        actions: [
            { label: nextActionLabel, testId: `${testIdPrefix}-next-round-button` },
            { label: homeActionLabel, testId: `${testIdPrefix}-home-button` }
        ]
    });
}

function normalizeWorksheetMetric(metric) {
    if (typeof metric === 'string') {
        return { label: metric, value: '' };
    }

    return {
        id: metric?.id || '',
        label: String(metric?.label || ''),
        value: metric?.value ?? ''
    };
}

function renderWorksheetResultMetric(metric, testIdPrefix, index) {
    const normalized = normalizeWorksheetMetric(metric);
    if (!normalized.label) return '';

    const valueText = normalized.value === '' ? '' : ` ${normalized.value}`;
    const testId = normalized.id ? `${testIdPrefix}-${normalized.id}` : `${testIdPrefix}-metric-${index}`;
    return `<p data-testid="${testId}">${normalized.label}:${valueText}</p>`;
}

function renderWorksheetResultAction(action, testIdPrefix, index) {
    if (typeof action === 'string') {
        return {
            label: action,
            testId: `${testIdPrefix}-action-${index}`
        };
    }

    return {
        label: String(action?.label || ''),
        testId: action?.testId || `${testIdPrefix}-action-${index}`,
        type: action?.type || 'button'
    };
}

export function renderWorksheetResultScreen({
    learnerName = 'Learner',
    title = '',
    testIdPrefix = '',
    completionMessage = 'You finished your activity.',
    headerSummary = null,
    metrics = [],
    activitySummary = null,
    extension = null,
    review = null,
    actions = []
} = {}) {
    const normalizedLearnerName = normalizeWorksheetLearnerName(learnerName);
    const normalizedTestIdPrefix = testIdPrefix || (title
        ? String(title).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'worksheet'
        : 'worksheet');
    const normalizedMetrics = Array.isArray(metrics) ? metrics : [];
    const normalizedActions = Array.isArray(actions) && actions.length
        ? actions
        : [
            { label: 'Try Again', testId: `${normalizedTestIdPrefix}-try-again-button` },
            { label: 'Home', testId: `${normalizedTestIdPrefix}-home-button` }
        ];
    const summarySlot = activitySummary || extension;
    const extensionMarkup = summarySlot
        ? `
                <div data-testid="${typeof summarySlot === 'object' && summarySlot?.testId ? summarySlot.testId : `${normalizedTestIdPrefix}-extension`}" class="w-full shrink-0 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-900">
                    ${typeof summarySlot === 'string' ? summarySlot : summarySlot.content || ''}
                </div>
        `
        : '';
    const reviewContent = review
        ? (typeof review === 'string' ? review : review.content || 'No corrections needed.')
        : 'No corrections needed.';
    const reviewTitle = typeof review === 'object' && review?.title ? review.title : 'Review';

    return `
        <section data-testid="${normalizedTestIdPrefix}-results" class="grid h-full min-h-0 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-2 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-3 text-center md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.86fr)] md:grid-rows-1">
            <div data-testid="${normalizedTestIdPrefix}-result-summary" class="flex min-h-0 flex-col gap-2 md:h-full">
                <div data-testid="siraash-completion-feedback" class="w-full shrink-0 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-slate-950 shadow-sm">
                    <div class="flex items-center justify-center gap-3">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-3xl font-black text-white" aria-hidden="true">&#10003;</div>
                        <div class="text-left">
                            <p data-testid="siraash-completion-title" class="text-lg font-black leading-tight sm:text-xl">Great work, ${normalizedLearnerName}! &#127793;</p>
                            ${headerSummary?.accuracy ? `<p data-testid="${normalizedTestIdPrefix}-result-header-accuracy" class="mt-1 text-2xl font-black leading-tight text-emerald-900 sm:text-3xl">${headerSummary.accuracy}</p>` : ''}
                            ${headerSummary?.score ? `<p data-testid="${normalizedTestIdPrefix}-result-header-score" class="text-sm font-black text-slate-900 sm:text-base">${headerSummary.score}</p>` : ''}
                            <p data-testid="siraash-completion-message" class="text-sm font-bold text-emerald-900 sm:text-base">${completionMessage}</p>
                            ${headerSummary?.extra || ''}
                        </div>
                    </div>
                </div>

                <div data-testid="${normalizedTestIdPrefix}-metrics" class="w-full shrink-0 rounded-2xl border-2 border-sky-200 bg-sky-50 p-3">
                    <div class="grid grid-cols-2 gap-2 text-left text-sm font-black text-slate-950 lg:grid-cols-3">
                        ${normalizedMetrics.map((metric, index) => renderWorksheetResultMetric(metric, normalizedTestIdPrefix, index)).join('')}
                    </div>
                </div>

                ${extensionMarkup}

                <div data-testid="${normalizedTestIdPrefix}-actions" class="flex shrink-0 flex-wrap justify-center gap-3 md:mt-auto">
                    ${normalizedActions.map((action, index) => {
                        const normalizedAction = renderWorksheetResultAction(action, normalizedTestIdPrefix, index);
                        const secondary = normalizedAction.label.toLowerCase() === 'home';
                        const className = secondary
                            ? 'min-h-[44px] rounded-full border-2 border-emerald-200 bg-white px-5 py-2 text-base font-black text-emerald-900'
                            : 'min-h-[44px] rounded-full bg-emerald-700 px-5 py-2 text-base font-black text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-300';
                        return `<button data-testid="${normalizedAction.testId}" type="${normalizedAction.type || 'button'}" class="${className}">${normalizedAction.label}</button>`;
                    }).join('')}
                </div>
            </div>
            <div data-testid="${normalizedTestIdPrefix}-review" class="flex min-h-0 w-full flex-col rounded-2xl border-2 border-amber-100 bg-[#fffaf0] p-3 text-left">
                <h3 class="shrink-0 text-base font-black text-slate-950">${reviewTitle}</h3>
                ${reviewContent}
            </div>
        </section>
    `;
}
