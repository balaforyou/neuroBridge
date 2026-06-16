import {
    createWorksheetShell,
    WORKSHEET_TEMPLATE_TYPES
} from '../../js/worksheetShell.js';

export const ATTRIBUTE_MATCHING_ACTIVITY_ID = 'attribute-matching-worksheet-v1';

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
        lastResult: null
    };

    function getState() {
        return {
            ...state,
            currentQuestion: cloneQuestion(state.currentQuestion)
        };
    }

    function selectChoice(choiceId) {
        const exists = state.currentQuestion.choices.some(choice => choice.id === choiceId);
        if (!exists) {
            return { result: 'ignored', state: getState() };
        }

        state.selectedChoiceId = choiceId;
        state.attempts += 1;
        state.lastResult = isCorrectAttributeChoice(state.currentQuestion, choiceId)
            ? 'success'
            : 'mistake';

        return {
            result: state.lastResult,
            state: getState()
        };
    }

    return {
        getState,
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
    let shell = null;
    let activityContent = null;

    function renderActivity() {
        activityContent = document.createElement('div');
        activityContent.setAttribute('data-testid', 'attribute-matching-worksheet');
        activityContent.className = 'flex h-full min-h-0 flex-col justify-center gap-3';
        renderQuestion();
        return activityContent;
    }

    function renderQuestion() {
        if (!activityContent) return;

        const state = game.getState();
        const question = state.currentQuestion;
        activityContent.innerHTML = '';

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

        activityContent.append(sourcePanel, choices);
    }

    function handleChoice(choiceId) {
        const { result } = game.selectChoice(choiceId);
        renderQuestion();

        if (result === 'success') {
            shell.showFeedback('success');
            return;
        }

        if (result === 'mistake') {
            shell.showFeedback('mistake');
        }
    }

    const initialQuestion = game.getState().currentQuestion;
    shell = createWorksheetShell({
        templateType: WORKSHEET_TEMPLATE_TYPES.MATCHING,
        title: 'Attribute Matching',
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
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', mountAttributeMatchingWorksheet);
}
