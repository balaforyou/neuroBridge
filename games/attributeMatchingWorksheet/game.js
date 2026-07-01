import {
    createWorksheetShell,
    WORKSHEET_TEMPLATE_TYPES
} from '../../js/worksheetShell.js';
import {
    applyWorksheetHeaderState,
    normalizeWorksheetLearnerName,
    renderWorksheetResultScreen
} from '../../js/worksheetTemplate.js';
import { GAME_EVENTS } from '../../js/constants.js';

export const ATTRIBUTE_MATCHING_ACTIVITY_ID = 'attribute-matching-worksheet-v1';
export const ATTRIBUTE_MATCHING_GAME_ID = 'attributeMatchingWorksheet';
export const ATTRIBUTE_MATCHING_ACTIVITY_TITLE = 'Attribute Matching V1';
export const ATTRIBUTE_MATCHING_FAMILY_TITLE = 'Matching Worksheets';
export const ATTRIBUTE_GROUP_COLOR = 'color';
export const DEFAULT_ATTRIBUTE_MATCHING_QUESTION_COUNT = 10;

const ACTIVITY_HOME_EVENT = 'SIRAASH_ACTIVITY_HOME';
const CORRECT_ADVANCE_DELAY_MS = 550;

export const COLOR_ATTRIBUTE_QUESTIONS = [
    createColorQuestion('color-red-apple', 'Red Apple', '\u{1F34E}', 'Red', ['Red', 'Blue', 'Green']),
    createColorQuestion('color-blue-ball', 'Blue Ball', '\u{1F535}', 'Blue', ['Blue', 'Red', 'Yellow']),
    createColorQuestion('color-green-leaf', 'Green Leaf', '\u{1F343}', 'Green', ['Green', 'Purple', 'Orange']),
    createColorQuestion('color-yellow-banana', 'Yellow Banana', '\u{1F34C}', 'Yellow', ['Yellow', 'Black', 'Pink']),
    createColorQuestion('color-orange-carrot', 'Orange Carrot', '\u{1F955}', 'Orange', ['Orange', 'White', 'Brown']),
    createColorQuestion('color-purple-grapes', 'Purple Grapes', '\u{1F347}', 'Purple', ['Purple', 'Green', 'Red']),
    createColorQuestion('color-brown-coconut', 'Brown Coconut', '\u{1F965}', 'Brown', ['Brown', 'Blue', 'Yellow']),
    createColorQuestion('color-black-circle', 'Black Circle', '\u{26AB}', 'Black', ['Black', 'Pink', 'Green']),
    createColorQuestion('color-white-circle', 'White Circle', '\u{26AA}', 'White', ['White', 'Orange', 'Black']),
    createColorQuestion('color-pink-flower', 'Pink Flower', '\u{1F338}', 'Pink', ['Pink', 'Brown', 'Blue'])
];

export function createColorAttributeQuestions(config = {}) {
    const random = typeof config.random === 'function' ? config.random : Math.random;
    const questionCount = normalizeQuestionCount(config.questionCount, COLOR_ATTRIBUTE_QUESTIONS.length);

    return COLOR_ATTRIBUTE_QUESTIONS
        .slice(0, questionCount)
        .map(question => ({
            ...question,
            options: shuffleArray(question.options, random)
        }));
}

export function createAttributeMatchingWorksheetGame(config = {}) {
    const questions = Array.isArray(config.questions) && config.questions.length
        ? config.questions.map(cloneQuestion)
        : createColorAttributeQuestions(config);
    const state = {
        questions,
        currentQuestionIndex: 0,
        attemptsForCurrentQuestion: 0,
        incorrectAttempts: 0,
        correctAnswers: 0,
        completed: false,
        pendingAdvance: false,
        feedbackMessage: '',
        feedbackType: null,
        visualHint: false,
        answerRevealed: false,
        startedAtMs: normalizeTimestampMs(config.startedAtMs, Date.now()),
        learnerName: normalizeWorksheetLearnerName(config.learnerName || 'Adarsh')
    };

    function getState() {
        return cloneState(state);
    }

    function getCurrentQuestion() {
        return cloneQuestion(state.questions[state.currentQuestionIndex]);
    }

    function selectAnswer(answer) {
        if (state.completed) {
            return { result: 'ignored', state: getState() };
        }

        if (state.pendingAdvance) {
            return { result: 'ignored', reason: 'pending-advance', state: getState() };
        }

        const question = state.questions[state.currentQuestionIndex];
        if (!question || !question.options.includes(answer)) {
            return { result: 'ignored', reason: 'unknown-answer', state: getState() };
        }

        state.attemptsForCurrentQuestion += 1;

        if (answer === question.correctAnswer) {
            state.correctAnswers += 1;
            state.pendingAdvance = true;
            state.feedbackType = 'success';
            state.feedbackMessage = `Great work, ${state.learnerName}!`;
            state.visualHint = false;
            state.answerRevealed = false;
            return { result: 'correct', state: getState() };
        }

        state.incorrectAttempts += 1;
        state.feedbackType = 'retry';

        if (state.attemptsForCurrentQuestion === 1) {
            state.feedbackMessage = 'Let\'s look again.';
        } else if (state.attemptsForCurrentQuestion === 2) {
            state.feedbackMessage = 'What color do you see?';
        } else if (state.attemptsForCurrentQuestion === 3) {
            state.visualHint = true;
            state.feedbackMessage = 'Look at the color around the picture.';
        } else {
            state.answerRevealed = true;
            state.feedbackMessage = `The answer is ${question.correctAnswer}.`;
        }

        return { result: 'incorrect', state: getState() };
    }

    function advanceAfterFeedback() {
        if (!state.pendingAdvance) {
            return { result: 'ignored', state: getState() };
        }

        state.pendingAdvance = false;
        state.feedbackMessage = '';
        state.feedbackType = null;
        state.visualHint = false;
        state.answerRevealed = false;
        state.attemptsForCurrentQuestion = 0;

        if (state.currentQuestionIndex >= state.questions.length - 1) {
            state.completed = true;
            return { result: 'complete', state: getState() };
        }

        state.currentQuestionIndex += 1;
        return { result: 'advanced', state: getState() };
    }

    function getCompletionSummary() {
        return createAttributeMatchingCompletionSummary(getState());
    }

    return {
        advanceAfterFeedback,
        getCompletionSummary,
        getCurrentQuestion,
        getState,
        selectAnswer
    };
}

export function createAttributeMatchingCompletionSummary(state = {}) {
    const totalQuestions = Array.isArray(state.questions)
        ? state.questions.length
        : DEFAULT_ATTRIBUTE_MATCHING_QUESTION_COUNT;
    const correctAnswers = Number(state.correctAnswers || 0);
    const accuracyPercent = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return {
        questionsAnswered: totalQuestions,
        correctAnswers,
        accuracyPercent
    };
}

export function createAttributeMatchingResultSummary(state = {}, options = {}) {
    const completion = createAttributeMatchingCompletionSummary(state);
    const startedAtMs = normalizeTimestampMs(state.startedAtMs, Date.now());
    const endedAtMs = normalizeTimestampMs(options.endedAtMs ?? Date.now(), startedAtMs);
    const timeTakenSeconds = Math.max(1, Math.round((endedAtMs - startedAtMs) / 1000));
    const averageTimeSeconds = completion.questionsAnswered
        ? Math.round((timeTakenSeconds / completion.questionsAnswered) * 10) / 10
        : 0;

    return {
        total: completion.questionsAnswered,
        correct: completion.correctAnswers,
        accuracy: completion.accuracyPercent,
        timeTakenSeconds,
        averageTimeSeconds,
        hintsUsed: Number(state.incorrectAttempts || 0),
        mistakeCount: Number(state.incorrectAttempts || 0)
    };
}

export function renderAttributeMatchingResultMarkup(summary, learnerName = 'Learner') {
    return renderWorksheetResultScreen({
        learnerName,
        testIdPrefix: 'attribute-matching',
        completionMessage: 'You found the matching attributes.',
        headerSummary: {
            accuracy: `${summary.accuracy}% Accuracy`,
            score: `${summary.correct} / ${summary.total} Correct`
        },
        metrics: [
            { id: 'total', label: 'Questions', value: summary.total },
            { id: 'correct-total', label: 'Correct / Total', value: `${summary.correct} / ${summary.total}` },
            { id: 'accuracy', label: 'Accuracy', value: `${summary.accuracy}%` },
            { id: 'time-taken', label: 'Time Taken', value: `${summary.timeTakenSeconds} sec` },
            { id: 'average-time', label: 'Average Time', value: `${summary.averageTimeSeconds} sec/question` },
            { id: 'hints-used', label: 'Hints Used', value: summary.hintsUsed },
            { id: 'mistakes-corrected', label: 'Mistakes Corrected', value: summary.mistakeCount }
        ],
        activitySummary: {
            testId: 'attribute-matching-result-level',
            content: 'Color / Attribute Matching V1'
        },
        review: {
            title: 'Review',
            content: '<p data-testid="attribute-matching-all-correct" class="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-base font-black text-emerald-800">No corrections needed.</p>'
        },
        actions: [
            { label: 'Try Again', testId: 'attribute-matching-next-round-button' },
            { label: 'Home', testId: 'attribute-matching-home-button' }
        ]
    });
}

export function createAttributeMatchingSessionSummary(state = {}, options = {}) {
    const summary = createAttributeMatchingCompletionSummary(state);
    const startedAtMs = normalizeTimestampMs(state.startedAtMs, Date.now());
    const endedAtMs = normalizeTimestampMs(options.endedAtMs ?? Date.now(), startedAtMs);
    const durationSeconds = Math.max(1, Math.round((endedAtMs - startedAtMs) / 1000));
    const averageReactionTimeMs = summary.questionsAnswered
        ? Math.round((durationSeconds * 1000) / summary.questionsAnswered)
        : 0;

    return {
        gameId: ATTRIBUTE_MATCHING_GAME_ID,
        activityId: ATTRIBUTE_MATCHING_ACTIVITY_ID,
        activityName: ATTRIBUTE_MATCHING_FAMILY_TITLE,
        mode: ATTRIBUTE_GROUP_COLOR,
        level: 1,
        levelLabel: 'Color',
        skillLabel: ATTRIBUTE_MATCHING_ACTIVITY_TITLE,
        levelDisplayLabel: `Color / ${ATTRIBUTE_MATCHING_ACTIVITY_TITLE}`,
        score: summary.correctAnswers,
        correctCount: summary.correctAnswers,
        totalQuestions: summary.questionsAnswered,
        accuracy: summary.accuracyPercent / 100,
        accuracyPercent: summary.accuracyPercent,
        averageReactionTimeMs,
        averageTimePerQuestion: Math.round((durationSeconds / Math.max(summary.questionsAnswered, 1)) * 10) / 10,
        hintUsageCount: Number(state.incorrectAttempts || 0),
        mistakeCount: Number(state.incorrectAttempts || 0),
        highestLevelReached: 1,
        sessionLengthSeconds: durationSeconds,
        durationSeconds,
        sessionTimestamp: new Date(startedAtMs).toISOString(),
        completionStatus: 'completed',
        completed: state.completed === true,
        trials: Array.isArray(state.questions)
            ? state.questions.map((question, index) => ({
                stage: 1,
                questionId: question.id,
                questionIndex: index,
                prompt: question.prompt,
                correctAnswer: question.correctAnswer,
                isCorrect: true,
                correct: true,
                attributeType: question.attributeType
            }))
            : []
    };
}

function mountAttributeMatchingWorksheet() {
    const root = document.getElementById('attribute-matching-root');
    if (!root) return;

    const pageState = {
        learnerName: 'Adarsh',
        advanceTimer: null,
        completionSubmitted: false
    };
    let game = createAttributeMatchingWorksheetGame({
        learnerName: pageState.learnerName
    });
    let shell = null;
    let activityContent = null;
    let questionContent = null;
    let completionPanel = null;

    window.addEventListener('message', (event) => {
        if (event.data?.type !== 'INITIALIZE_GAME_RULES') return;

        clearPendingAdvanceTimer();
        pageState.learnerName = normalizeWorksheetLearnerName(event.data.learnerName || 'Adarsh');
        pageState.completionSubmitted = false;
        game = createAttributeMatchingWorksheetGame({
            learnerName: pageState.learnerName
        });
        updateHeader();
        renderQuestion();
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
        activityContent.className = 'flex h-full min-h-0 flex-col justify-center px-1 py-1 sm:px-2';

        questionContent = document.createElement('div');
        questionContent.setAttribute('data-testid', 'attribute-matching-question');
        questionContent.className = 'flex h-full min-h-0 flex-col justify-center';

        completionPanel = document.createElement('div');
        completionPanel.setAttribute('data-testid', 'attribute-matching-completion');
        completionPanel.className = 'hidden text-center text-slate-950';

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

        if (state.completed) {
            return;
        }

        const stage = document.createElement('div');
        stage.setAttribute('data-testid', 'attribute-matching-stage');
        stage.className = 'mx-auto flex w-full max-w-[920px] flex-col gap-3 sm:gap-4';

        const promptPanel = document.createElement('div');
        promptPanel.setAttribute('data-testid', 'attribute-matching-prompt-card');
        const visualHintClass = state.visualHint
            ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200'
            : 'border-emerald-200 bg-emerald-50';
        promptPanel.className = `w-full rounded-2xl border-4 ${visualHintClass} px-4 py-4 text-center shadow-sm sm:px-6`;
        promptPanel.innerHTML = `
            <div data-testid="attribute-matching-prompt-image" class="text-6xl sm:text-7xl" aria-hidden="true">${question.image}</div>
            <div data-testid="attribute-matching-prompt-label" class="mt-2 text-2xl font-black text-slate-950">${question.prompt}</div>
            <div data-testid="attribute-matching-progress" class="mt-2 text-sm font-black text-emerald-800">Question ${state.currentQuestionIndex + 1} of ${state.questions.length}</div>
        `;

        const choices = document.createElement('div');
        choices.setAttribute('data-testid', 'attribute-matching-choices');
        choices.className = 'grid w-full grid-cols-1 gap-3 sm:grid-cols-3';
        question.options.forEach(option => {
            const isCorrectReveal = state.answerRevealed && option === question.correctAnswer;
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.testid = `attribute-choice-${toTestId(option)}`;
            button.dataset.answer = option;
            button.disabled = state.pendingAdvance;
            button.className = `min-h-[88px] rounded-2xl border-4 ${isCorrectReveal ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-200' : 'border-sky-200 bg-white'} px-4 py-3 text-2xl font-black text-slate-950 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-emerald-300`;
            button.textContent = option;
            button.addEventListener('click', () => handleAnswer(option));
            choices.appendChild(button);
        });

        const feedback = document.createElement('div');
        feedback.setAttribute('data-testid', 'attribute-matching-feedback');
        feedback.className = getFeedbackClass(state.feedbackType);
        feedback.textContent = state.feedbackMessage;

        stage.append(promptPanel, choices, feedback);
        questionContent.append(stage);
    }

    function renderCompletion() {
        if (!completionPanel) return;

        const state = game.getState();
        if (!state.completed) {
            completionPanel.className = 'hidden text-center text-slate-950';
            completionPanel.innerHTML = '';
            return;
        }

        completionPanel.className = 'flex h-full min-h-0 flex-col text-center text-slate-950';
        completionPanel.innerHTML = renderAttributeMatchingResultMarkup(
            createAttributeMatchingResultSummary(state),
            pageState.learnerName
        );

        completionPanel.querySelector('[data-testid="attribute-matching-next-round-button"]')?.addEventListener('click', restartSession);
        completionPanel.querySelector('[data-testid="attribute-matching-home-button"]')?.addEventListener('click', () => {
            window.parent?.postMessage({ type: ACTIVITY_HOME_EVENT }, '*');
        });
    }

    function restartSession() {
        clearPendingAdvanceTimer();
        pageState.completionSubmitted = false;
        game = createAttributeMatchingWorksheetGame({
            learnerName: pageState.learnerName
        });
        updateHeader();
        renderQuestion();
        renderCompletion();
    }

    function handleAnswer(answer) {
        const outcome = game.selectAnswer(answer);
        renderQuestion();

        if (outcome.result === 'correct') {
            clearPendingAdvanceTimer();
            pageState.advanceTimer = setTimeout(() => {
                const advance = game.advanceAfterFeedback();
                pageState.advanceTimer = null;
                updateHeader();
                renderQuestion();
                renderCompletion();
                if (advance.result === 'complete') {
                    submitCompletionIfNeeded();
                }
            }, CORRECT_ADVANCE_DELAY_MS);
        }
    }

    function submitCompletionIfNeeded() {
        if (pageState.completionSubmitted) return;

        pageState.completionSubmitted = true;
        try {
            window.parent?.postMessage({
                type: GAME_EVENTS.COMPLETE,
                payload: createAttributeMatchingSessionSummary(game.getState())
            }, '*');
        } catch {
            // Completion persistence should never block the learner completion screen.
        }
    }

    function clearPendingAdvanceTimer() {
        if (!pageState.advanceTimer) return;

        clearTimeout(pageState.advanceTimer);
        pageState.advanceTimer = null;
    }

    function updateHeader() {
        const state = game.getState();
        applyWorksheetHeaderState({
            roundNumber: Math.min(state.currentQuestionIndex + 1, state.questions.length),
            stars: state.correctAnswers
        });
    }

    shell = createWorksheetShell({
        templateType: WORKSHEET_TEMPLATE_TYPES.MATCHING,
        title: ATTRIBUTE_MATCHING_ACTIVITY_TITLE,
        instruction: 'Look at the picture. Choose its color.',
        activity: {
            render: renderActivity
        },
        help: {
            enabled: false
        },
        feedback: {
            enabled: false
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

    shell.classList.add('attribute-matching-shell', 'h-full');
    root.innerHTML = '';
    root.appendChild(shell);
    updateHeader();
}

function createColorQuestion(id, prompt, image, correctAnswer, options) {
    return {
        id,
        prompt,
        image,
        attributeType: ATTRIBUTE_GROUP_COLOR,
        options,
        correctAnswer
    };
}

function cloneQuestion(question) {
    return {
        ...question,
        options: question.options.slice()
    };
}

function cloneState(state) {
    return {
        ...state,
        questions: state.questions.map(cloneQuestion),
        currentQuestion: cloneQuestion(state.questions[state.currentQuestionIndex])
    };
}

function shuffleArray(items, random) {
    const shuffled = items.slice();

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
}

function normalizeQuestionCount(questionCount, max) {
    const count = Number(questionCount || max);
    if (!Number.isFinite(count) || count <= 0) {
        return max;
    }

    return Math.min(max, Math.round(count));
}

function normalizeTimestampMs(value, fallback) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) {
        return number;
    }

    return fallback;
}

function getFeedbackClass(feedbackType) {
    const base = 'min-h-[36px] rounded-xl px-4 py-2 text-center text-lg font-black';
    if (feedbackType === 'success') {
        return `${base} bg-emerald-50 text-emerald-900`;
    }

    if (feedbackType === 'retry') {
        return `${base} bg-amber-50 text-amber-900`;
    }

    return `${base} text-slate-700`;
}

function toTestId(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', mountAttributeMatchingWorksheet);
}
