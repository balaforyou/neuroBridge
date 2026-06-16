import {
    createWorksheetShell,
    WORKSHEET_TEMPLATE_TYPES
} from '../../js/worksheetShell.js';

export const MATCHING_WORKSHEET_ACTIVITY_ID = 'matching-worksheet-v1';

export const DEFAULT_MATCHING_ITEMS = [
    { id: 'apple', label: 'Apple', symbol: '\u{1F34E}' },
    { id: 'ball', label: 'Ball', symbol: '\u26BD' },
    { id: 'cat', label: 'Cat', symbol: '\u{1F431}' }
];

export function createMatchingPairs(items = DEFAULT_MATCHING_ITEMS) {
    return ['a', 'b'].flatMap(copyId => items.map(item => ({
        cardId: `${item.id}-${copyId}`,
        pairId: item.id,
        label: item.label,
        symbol: item.symbol,
        matched: false
    })));
}

export function isMatchingPair(firstCard, secondCard) {
    return Boolean(
        firstCard &&
        secondCard &&
        firstCard.cardId !== secondCard.cardId &&
        firstCard.pairId === secondCard.pairId
    );
}

export function createMatchingWorksheetGame(config = {}) {
    const state = {
        cards: (config.cards || createMatchingPairs(config.items)).map(card => ({ ...card })),
        selectedCardId: null,
        attempts: 0,
        completed: false,
        lastResult: null
    };

    function getCard(cardId) {
        return state.cards.find(card => card.cardId === cardId) || null;
    }

    function getState() {
        return {
            ...state,
            cards: state.cards.map(card => ({ ...card }))
        };
    }

    function isComplete() {
        return state.cards.every(card => card.matched);
    }

    function selectCard(cardId) {
        const card = getCard(cardId);
        if (!card || card.matched || state.completed) {
            return { result: 'ignored', state: getState() };
        }

        if (!state.selectedCardId) {
            state.selectedCardId = card.cardId;
            state.lastResult = 'selected';
            return { result: 'selected', state: getState() };
        }

        const firstCard = getCard(state.selectedCardId);
        if (!firstCard || firstCard.cardId === card.cardId) {
            state.selectedCardId = card.cardId;
            state.lastResult = 'selected';
            return { result: 'selected', state: getState() };
        }

        state.attempts += 1;
        state.selectedCardId = null;

        if (isMatchingPair(firstCard, card)) {
            firstCard.matched = true;
            card.matched = true;
            state.completed = isComplete();
            state.lastResult = state.completed ? 'complete' : 'success';
            return { result: state.lastResult, state: getState() };
        }

        state.lastResult = 'mistake';
        return { result: 'mistake', state: getState() };
    }

    return {
        getState,
        isComplete,
        selectCard
    };
}

function mountMatchingWorksheet() {
    const root = document.getElementById('matching-worksheet-root');
    if (!root) return;

    const game = createMatchingWorksheetGame();
    let shell = null;
    let activityGrid = null;

    function renderActivity() {
        activityGrid = document.createElement('div');
        activityGrid.setAttribute('data-testid', 'matching-worksheet');
        activityGrid.className = 'grid h-full min-h-0 grid-cols-2 sm:grid-cols-3 gap-3 content-center';
        renderCards();
        return activityGrid;
    }

    function renderCards() {
        if (!activityGrid) return;

        const state = game.getState();
        activityGrid.innerHTML = '';

        state.cards.forEach(card => {
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.cardId = card.cardId;
            button.dataset.testid = `matching-card-${card.cardId}`;
            button.disabled = card.matched;

            const isSelected = state.selectedCardId === card.cardId;
            const selectedClass = isSelected
                ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-200'
                : 'border-sky-200 bg-white';
            const matchedClass = card.matched
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 opacity-85'
                : selectedClass;

            button.className = `matching-card min-h-[104px] rounded-2xl border-4 ${matchedClass} p-3 text-center shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-300`;
            button.innerHTML = `
                <span class="block text-4xl sm:text-5xl" aria-hidden="true">${card.symbol}</span>
                <span class="mt-2 block text-base sm:text-lg font-black">${card.label}</span>
            `;

            button.addEventListener('click', () => handleCardSelection(card.cardId));
            activityGrid.appendChild(button);
        });
    }

    function handleCardSelection(cardId) {
        const { result } = game.selectCard(cardId);
        renderCards();

        if (result === 'success' || result === 'complete') {
            shell.showFeedback('success');
            return;
        }

        if (result === 'mistake') {
            shell.showFeedback('mistake');
        }
    }

    shell = createWorksheetShell({
        templateType: WORKSHEET_TEMPLATE_TYPES.MATCHING,
        title: 'Matching Worksheet',
        instruction: 'Match the same pictures.',
        activity: {
            render: renderActivity
        },
        help: {
            enabled: true,
            hints: [
                'Look carefully.',
                'Find the same picture.',
                'Tap one card, then tap its match.'
            ]
        },
        feedback: {
            enabled: true
        },
        celebration: {
            enabled: false
        },
        analytics: {
            activityId: MATCHING_WORKSHEET_ACTIVITY_ID,
            domain: 'Executive Function & Cognitive Shifting',
            skill: 'Visual Discrimination'
        }
    });

    shell.classList.add('h-full');
    root.innerHTML = '';
    root.appendChild(shell);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', mountMatchingWorksheet);
}
