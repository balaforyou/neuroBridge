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
    stars = 0
} = {}) {
    const roundEl = documentRef?.getElementById?.('ui-round');
    if (roundEl) {
        roundEl.textContent = String(roundNumber);
    }

    const starsEl = documentRef?.getElementById?.('ui-stars');
    if (starsEl) {
        starsEl.textContent = String(stars);
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
