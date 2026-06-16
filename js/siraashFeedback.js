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
    }
};

export function getSiraashFeedback(type) {
    return SIRAASH_FEEDBACK[type] || null;
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
