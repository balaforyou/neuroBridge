import {
    createWorksheetShell,
    WORKSHEET_TEMPLATE_TYPES
} from '../../js/worksheetShell.js';
import {
    applyWorksheetHeaderState,
    normalizeWorksheetLearnerName,
    renderWorksheetCompletion
} from '../../js/worksheetTemplate.js';

export const MATCHING_WORKSHEET_ACTIVITY_ID = 'matching-worksheet-v1';
const ACTIVITY_HOME_EVENT = 'SIRAASH_ACTIVITY_HOME';

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
    const initialCards = (config.cards || createMatchingPairs(config.items)).map(card => ({ ...card }));
    const state = {
        cards: initialCards.map(card => ({ ...card })),
        selectedCardId: null,
        attempts: 0,
        completed: false,
        lastResult: null,
        lastMatchedCardIds: [],
        lastMistakeCardIds: [],
        roundNumber: 1
    };

    function getCard(cardId) {
        return state.cards.find(card => card.cardId === cardId) || null;
    }

    function getState() {
        return {
            ...state,
            cards: state.cards.map(card => ({ ...card })),
            lastMatchedCardIds: state.lastMatchedCardIds.slice(),
            lastMistakeCardIds: state.lastMistakeCardIds.slice()
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
            state.lastMatchedCardIds = [];
            state.lastMistakeCardIds = [];
            return { result: 'selected', state: getState() };
        }

        const firstCard = getCard(state.selectedCardId);
        if (!firstCard || firstCard.cardId === card.cardId) {
            state.selectedCardId = card.cardId;
            state.lastResult = 'selected';
            state.lastMatchedCardIds = [];
            state.lastMistakeCardIds = [];
            return { result: 'selected', state: getState() };
        }

        state.attempts += 1;
        state.selectedCardId = null;

        if (isMatchingPair(firstCard, card)) {
            firstCard.matched = true;
            card.matched = true;
            state.completed = isComplete();
            state.lastResult = state.completed ? 'complete' : 'success';
            state.lastMatchedCardIds = [firstCard.cardId, card.cardId];
            state.lastMistakeCardIds = [];
            return { result: state.lastResult, state: getState() };
        }

        state.lastResult = 'mistake';
        state.lastMatchedCardIds = [];
        state.lastMistakeCardIds = [firstCard.cardId, card.cardId];
        return { result: 'mistake', state: getState() };
    }

    function resetRound() {
        state.cards = initialCards.map(card => ({ ...card, matched: false }));
        state.selectedCardId = null;
        state.attempts = 0;
        state.completed = false;
        state.lastResult = null;
        state.lastMatchedCardIds = [];
        state.lastMistakeCardIds = [];
        state.roundNumber += 1;
        return getState();
    }

    return {
        getState,
        isComplete,
        resetRound,
        selectCard
    };
}

function mountMatchingWorksheet() {
    const root = document.getElementById('matching-worksheet-root');
    if (!root) return;

    const game = createMatchingWorksheetGame();
    const pageState = {
        learnerName: 'Learner',
        stars: 0
    };
    let shell = null;
    let activityGrid = null;
    let completionPanel = null;
    let transientMistakeCardIds = [];
    let mistakeClearTimer = null;

    window.addEventListener('message', (event) => {
        if (event.data?.type !== 'INITIALIZE_GAME_RULES') return;

        pageState.learnerName = normalizeWorksheetLearnerName(event.data.learnerName);
        updateHeader();
        renderCompletion();
    });

    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.parent?.postMessage({ type: ACTIVITY_HOME_EVENT }, '*');
        });
    }

    function renderActivity() {
        const activityContent = document.createElement('div');
        activityContent.setAttribute('data-testid', 'matching-worksheet');
        activityContent.className = 'flex h-full min-h-0 flex-col justify-center gap-3';

        activityGrid = document.createElement('div');
        activityGrid.setAttribute('data-testid', 'matching-card-grid');
        activityGrid.className = 'grid min-h-0 grid-cols-2 sm:grid-cols-3 gap-3 content-center';

        completionPanel = document.createElement('div');
        completionPanel.setAttribute('data-testid', 'matching-completion');
        completionPanel.className = 'hidden rounded-2xl border-4 border-emerald-300 bg-emerald-50 px-4 py-3 text-center text-slate-950';

        activityContent.append(activityGrid, completionPanel);
        renderCards();
        renderCompletion();
        return activityContent;
    }

    function renderCards() {
        if (!activityGrid) return;

        const state = game.getState();
        activityGrid.classList.toggle('hidden', state.completed);
        activityGrid.innerHTML = '';

        state.cards.forEach(card => {
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.cardId = card.cardId;
            button.dataset.testid = `matching-card-${card.cardId}`;
            button.disabled = card.matched;

            const isSelected = state.selectedCardId === card.cardId;
            const isMistake = transientMistakeCardIds.includes(card.cardId);
            const selectedClass = isSelected
                ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-200'
                : 'border-sky-200 bg-white';
            const matchedClass = card.matched
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 opacity-85'
                : selectedClass;
            const mistakeClass = isMistake
                ? 'matching-card-nudge border-orange-500 bg-orange-50 text-orange-950 ring-4 ring-orange-200'
                : matchedClass;

            button.className = `matching-card relative min-h-[104px] rounded-2xl border-4 ${mistakeClass} p-3 text-center shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-300`;
            button.innerHTML = `
                <span class="block text-4xl sm:text-5xl" aria-hidden="true">${card.symbol}</span>
                <span class="mt-2 block text-base sm:text-lg font-black">${card.label}</span>
                ${card.matched ? `<span data-testid="matching-card-${card.cardId}-check" class="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-base font-black text-white" aria-label="${card.label} matched">&#10003;</span>` : ''}
                ${isMistake ? `<span data-testid="matching-card-${card.cardId}-cross" class="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-base font-black text-white" aria-label="${card.label} needs another try">&#10005;</span>` : ''}
            `;

            button.addEventListener('click', () => handleCardSelection(card.cardId));
            activityGrid.appendChild(button);
        });
    }

    function renderCompletion() {
        if (!completionPanel) return;

        const state = game.getState();
        if (!state.completed) {
            completionPanel.className = 'hidden rounded-2xl border-4 border-emerald-300 bg-emerald-50 px-4 py-3 text-center text-slate-950';
            completionPanel.innerHTML = '';
            return;
        }

        completionPanel.className = 'rounded-2xl text-center text-slate-950';
        completionPanel.innerHTML = renderWorksheetCompletion({
            learnerName: pageState.learnerName,
            message: 'You matched all the pictures.',
            actionTestId: 'matching-next-round-button'
        });
        completionPanel.querySelector('[data-testid="matching-next-round-button"]').addEventListener('click', handleNextRound);
    }

    function handleCardSelection(cardId) {
        if (mistakeClearTimer) {
            clearTimeout(mistakeClearTimer);
            mistakeClearTimer = null;
        }

        const { result, state } = game.selectCard(cardId);
        transientMistakeCardIds = result === 'mistake' ? state.lastMistakeCardIds : [];
        renderCards();
        renderCompletion();

        if (result === 'complete') {
            pageState.stars += 1;
            updateHeader();
            shell.clearFeedback();
            return;
        }

        if (result === 'success') {
            shell.clearFeedback();
            return;
        }

        if (result === 'mistake') {
            shell.showFeedback('mistake');
            mistakeClearTimer = setTimeout(() => {
                transientMistakeCardIds = [];
                renderCards();
            }, 900);
        }
    }

    function handleNextRound() {
        if (mistakeClearTimer) {
            clearTimeout(mistakeClearTimer);
            mistakeClearTimer = null;
        }

        transientMistakeCardIds = [];
        game.resetRound();
        shell.clearFeedback();
        updateHeader();
        renderCards();
        renderCompletion();
    }

    function updateHeader() {
        applyWorksheetHeaderState({
            roundNumber: game.getState().roundNumber,
            stars: pageState.stars
        });
    }

    shell = createWorksheetShell({
        templateType: WORKSHEET_TEMPLATE_TYPES.MATCHING,
        title: 'Match the pictures',
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
    updateHeader();
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', mountMatchingWorksheet);
}
