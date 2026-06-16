import {
    createWorksheetShell,
    WORKSHEET_TEMPLATE_TYPES
} from '../../js/worksheetShell.js';
import {
    applyWorksheetHeaderState,
    normalizeWorksheetLearnerName,
    renderWorksheetCompletion
} from '../../js/worksheetTemplate.js';

export const ATTRIBUTE_MATCHING_ACTIVITY_ID = 'attribute-matching-worksheet-v1';
const ACTIVITY_HOME_EVENT = 'SIRAASH_ACTIVITY_HOME';

export const ATTRIBUTE_MATCHING_QUESTIONS = [
    {
        id: 'red-001',
        source: {
            id: 'apple',
            label: 'Apple',
            symbol: '\u{1F34E}'
        },
        attribute: 'red',
        prompt: 'Find another red item.',
        hints: [
            'Look carefully.',
            'Think about the color.',
            'Find another red item.'
        ],
        choices: [
            {
                id: 'strawberry',
                label: 'Strawberry',
                symbol: '\u{1F353}',
                correct: true
            },
            {
                id: 'ball',
                label: 'Ball',
                symbol: '\u26BD',
                correct: false
            },
            {
                id: 'sun',
                label: 'Sun',
                symbol: '\u{1F31E}',
                correct: false
            }
        ]
    },
    {
        id: 'round-001',
        source: {
            id: 'ball',
            label: 'Ball',
            symbol: '\u26BD'
        },
        attribute: 'round',
        prompt: 'Find another round item.',
        hints: [
            'Look carefully.',
            'Think about the shape.',
            'Find another round item.'
        ],
        choices: [
            {
                id: 'sun',
                label: 'Sun',
                symbol: '\u{1F31E}',
                correct: true
            },
            {
                id: 'book',
                label: 'Book',
                symbol: '\u{1F4DA}',
                correct: false
            },
            {
                id: 'pencil',
                label: 'Pencil',
                symbol: '\u270F\uFE0F',
                correct: false
            }
        ]
    },
    {
        id: 'big-001',
        source: {
            id: 'elephant',
            label: 'Elephant',
            symbol: '\u{1F418}'
        },
        attribute: 'big',
        prompt: 'Find another big thing.',
        hints: [
            'Look carefully.',
            'Think about the size.',
            'Find another big thing.'
        ],
        choices: [
            {
                id: 'bus',
                label: 'Bus',
                symbol: '\u{1F68C}',
                correct: true
            },
            {
                id: 'ant',
                label: 'Ant',
                symbol: '\u{1F41C}',
                correct: false
            },
            {
                id: 'grapes',
                label: 'Grapes',
                symbol: '\u{1F347}',
                correct: false
            }
        ]
    }
];

export function createAttributeQuestion(index = 0, questions = ATTRIBUTE_MATCHING_QUESTIONS) {
    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('createAttributeQuestion requires at least one question');
    }

    const question = questions[index % questions.length];
    return cloneQuestion(question);
}

export function isCorrectAttributeChoice(question, choiceId) {
    return Boolean(question?.choices?.find(choice => choice.id === choiceId)?.correct);
}

export function getAttributeHints(question) {
    return (question?.hints || []).slice();
}

export function createAttributeMatchingWorksheetGame(config = {}) {
    const questions = config.questions || ATTRIBUTE_MATCHING_QUESTIONS;
    const state = {
        questionIndex: config.questionIndex || 0,
        currentQuestion: createAttributeQuestion(config.questionIndex || 0, questions),
        selectedChoiceId: null,
        attempts: 0,
        completed: false,
        lastResult: null,
        roundNumber: 1
    };

    function getState() {
        return {
            ...state,
            currentQuestion: cloneQuestion(state.currentQuestion)
        };
    }

    function selectChoice(choiceId) {
        if (state.completed) {
            return { result: 'ignored', state: getState() };
        }

        const exists = state.currentQuestion.choices.some(choice => choice.id === choiceId);
        if (!exists) {
            return { result: 'ignored', state: getState() };
        }

        state.selectedChoiceId = choiceId;
        state.attempts += 1;
        state.lastResult = isCorrectAttributeChoice(state.currentQuestion, choiceId)
            ? 'success'
            : 'mistake';
        state.completed = state.lastResult === 'success';

        return {
            result: state.lastResult,
            state: getState()
        };
    }

    function nextRound() {
        state.questionIndex = (state.questionIndex + 1) % questions.length;
        state.currentQuestion = createAttributeQuestion(state.questionIndex, questions);
        state.selectedChoiceId = null;
        state.attempts = 0;
        state.completed = false;
        state.lastResult = null;
        state.roundNumber += 1;
        return getState();
    }

    return {
        getState,
        nextRound,
        selectChoice
    };
}

function cloneQuestion(question) {
    return {
        ...question,
        source: { ...question.source },
        hints: (question.hints || []).slice(),
        choices: question.choices.map(choice => ({ ...choice }))
    };
}

function mountAttributeMatchingWorksheet() {
    const root = document.getElementById('attribute-matching-root');
    if (!root) return;

    const game = createAttributeMatchingWorksheetGame();
    const pageState = {
        learnerName: 'Learner',
        stars: 0
    };
    let shell = null;
    let activityContent = null;
    let questionContent = null;
    let completionPanel = null;

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
        activityContent = document.createElement('div');
        activityContent.setAttribute('data-testid', 'attribute-matching-worksheet');
        activityContent.className = 'flex h-full min-h-0 flex-col justify-center gap-3';
        questionContent = document.createElement('div');
        questionContent.setAttribute('data-testid', 'attribute-matching-question');
        questionContent.className = 'flex h-full min-h-0 flex-col justify-center gap-3';
        completionPanel = document.createElement('div');
        completionPanel.setAttribute('data-testid', 'attribute-matching-completion');
        completionPanel.className = 'hidden rounded-2xl text-center text-slate-950';
        activityContent.append(questionContent, completionPanel);
        renderQuestion();
        renderCompletion();
        return activityContent;
    }

    function renderQuestion() {
        if (!questionContent) return;

        const state = game.getState();
        const question = state.currentQuestion;
        questionContent.classList.toggle('hidden', state.completed);
        questionContent.innerHTML = '';

        const sourcePanel = document.createElement('div');
        sourcePanel.className = 'grid grid-cols-1 gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center';
        sourcePanel.innerHTML = `
            <div class="rounded-2xl border-4 border-emerald-200 bg-emerald-50 p-3 text-center">
                <span class="block text-5xl sm:text-6xl" aria-hidden="true">${question.source.symbol}</span>
                <span class="mt-1 block text-base font-black">${question.source.label}</span>
            </div>
            <p data-testid="attribute-prompt" class="rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-3 text-xl sm:text-2xl font-black leading-tight text-slate-950">
                ${question.prompt}
            </p>
        `;

        const choices = document.createElement('div');
        choices.className = 'grid grid-cols-3 gap-3';
        question.choices.forEach(choice => {
            const isSelected = state.selectedChoiceId === choice.id;
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.testid = `attribute-choice-${choice.id}`;
            button.className = `attribute-choice min-h-[112px] rounded-2xl border-4 ${isSelected ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-200' : 'border-sky-200 bg-white'} p-2 text-center shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-300`;
            button.innerHTML = `
                <span class="block text-4xl sm:text-5xl" aria-hidden="true">${choice.symbol}</span>
                <span class="mt-2 block text-sm sm:text-base font-black">${choice.label}</span>
            `;
            button.addEventListener('click', () => handleChoice(choice.id));
            choices.appendChild(button);
        });

        questionContent.append(sourcePanel, choices);
    }

    function renderCompletion() {
        if (!completionPanel) return;

        const state = game.getState();
        if (!state.completed) {
            completionPanel.className = 'hidden rounded-2xl text-center text-slate-950';
            completionPanel.innerHTML = '';
            return;
        }

        completionPanel.className = 'rounded-2xl text-center text-slate-950';
        completionPanel.innerHTML = renderWorksheetCompletion({
            learnerName: pageState.learnerName,
            message: 'You found the matching attribute.',
            actionTestId: 'attribute-matching-next-round-button'
        });
        completionPanel.querySelector('[data-testid="attribute-matching-next-round-button"]').addEventListener('click', handleNextRound);
    }

    function handleChoice(choiceId) {
        const { result } = game.selectChoice(choiceId);
        renderQuestion();
        renderCompletion();

        if (result === 'success') {
            pageState.stars += 1;
            updateHeader();
            shell.clearFeedback();
            return;
        }

        if (result === 'mistake') {
            shell.showFeedback('mistake');
        }
    }

    function handleNextRound() {
        game.nextRound();
        shell.clearFeedback();
        updateHeader();
        renderQuestion();
        renderCompletion();
    }

    function updateHeader() {
        applyWorksheetHeaderState({
            roundNumber: game.getState().roundNumber,
            stars: pageState.stars
        });
    }

    const initialQuestion = game.getState().currentQuestion;
    shell = createWorksheetShell({
        templateType: WORKSHEET_TEMPLATE_TYPES.MATCHING,
        title: 'Find the same attribute',
        instruction: 'Find another item with the same attribute.',
        activity: {
            render: renderActivity
        },
        help: {
            enabled: true,
            hints: getAttributeHints(initialQuestion)
        },
        feedback: {
            enabled: true
        },
        celebration: {
            enabled: false
        },
        analytics: {
            activityId: ATTRIBUTE_MATCHING_ACTIVITY_ID,
            domain: 'Executive Function & Cognitive Shifting',
            skill: 'Attribute Matching'
        }
    });

    shell.classList.add('h-full');
    root.innerHTML = '';
    root.appendChild(shell);
    updateHeader();
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', mountAttributeMatchingWorksheet);
}
