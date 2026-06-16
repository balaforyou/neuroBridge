export const SIRAASH_FEEDBACK = {
    success: {
        icon: '&#10003;',
        title: 'Great work!',
        message: 'You found the answer.'
    },
    mistake: {
        icon: '',
        title: 'You got close.',
        message: 'SIRAASH will guide you.'
    },
    celebration: {
        levelUp: {
            enabled: false,
            effects: ['claps', 'balloons'],
            title: 'New level!',
            message: 'You are growing stronger.'
        }
    }
};

export function getSiraashFeedback(type) {
    return SIRAASH_FEEDBACK[type] || null;
}

export function getSiraashCelebration(type) {
    return SIRAASH_FEEDBACK.celebration?.[type] || null;
}

export function renderSiraashFeedback(type) {
    const feedback = getSiraashFeedback(type);
    if (!feedback) return '';

    const toneClass = type === 'success'
        ? 'siraash-feedback--success border-emerald-300 bg-emerald-50 text-emerald-950'
        : 'siraash-feedback--mistake border-amber-300 bg-amber-50 text-amber-950';

    const icon = feedback.icon
        ? `<div class="siraash-feedback__icon text-5xl sm:text-6xl leading-none font-black text-emerald-600" aria-hidden="true">${feedback.icon}</div>`
        : '';

    return `
        <div
            data-testid="siraash-feedback"
            class="siraash-feedback ${toneClass} mx-auto flex max-w-sm flex-col items-center justify-center rounded-2xl border-2 px-4 py-2 text-center shadow-sm">
            ${icon}
            <div class="siraash-feedback__title text-lg sm:text-xl font-black leading-tight">${feedback.title}</div>
            <div class="siraash-feedback__message mt-1 text-sm sm:text-base font-bold leading-snug">${feedback.message}</div>
        </div>
    `;
}

export function renderSiraashCompletionFeedback({
    learnerName = 'Learner',
    message,
    actionTestId,
    actionLabel = 'Next Round'
} = {}) {
    const normalizedName = normalizeLearnerName(learnerName);
    const completionMessage = message || 'You found the answer.';
    const action = actionTestId
        ? `<button type="button" data-testid="${actionTestId}" class="mt-4 min-h-[44px] rounded-full bg-emerald-700 px-5 py-2 text-base font-black text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-300">${actionLabel}</button>`
        : '';

    return `
        <div data-testid="siraash-completion-feedback" class="siraash-completion-feedback mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border-4 border-emerald-300 bg-emerald-50 px-5 py-5 text-center text-slate-950 shadow-sm">
            <div class="siraash-completion-feedback__icon flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-4xl font-black text-white" aria-hidden="true">&#10003;</div>
            <p data-testid="siraash-completion-title" class="mt-3 text-xl sm:text-2xl font-black">Great work, ${normalizedName}! &#127793;</p>
            <p data-testid="siraash-completion-message" class="mt-1 text-base sm:text-lg font-bold text-emerald-900">${completionMessage}</p>
            ${action}
        </div>
    `;
}

function normalizeLearnerName(learnerName) {
    const normalized = String(learnerName || '').trim();
    return normalized || 'Learner';
}
