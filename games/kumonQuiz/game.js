import { GAME_EVENTS } from '../../js/constants.js';
import {
    applyWorksheetHeaderState,
    getWorksheetSupportPrompts,
    normalizeWorksheetLearnerName,
    renderWorksheetCompletion,
    WORKSHEET_ACTIVITY_TYPES
} from '../../js/worksheetTemplate.js';
import { renderSiraashFeedback } from '../../js/siraashFeedback.js';

export const KUMON_QUIZ_ACTIVITY_ID = 'kumonQuiz';
export const ACTIVITY_HOME_EVENT = 'SIRAASH_ACTIVITY_HOME';

export const DEFAULT_KUMON_CONFIG = {
    operation: '+',
    firstNumberMin: 1,
    firstNumberMax: 10,
    secondNumberMode: 'fixed',
    secondNumberFixedValue: 1,
    secondNumberMin: 1,
    secondNumberMax: 10,
    questionCount: 10,
    hintsEnabled: true,
    mode: 'practice'
};

export function normalizeKumonConfig(config = {}) {
    const merged = { ...DEFAULT_KUMON_CONFIG, ...config };
    const firstNumberMin = clampInteger(merged.firstNumberMin, 1, 100, DEFAULT_KUMON_CONFIG.firstNumberMin);
    const firstNumberMax = Math.max(firstNumberMin, clampInteger(merged.firstNumberMax, 1, 100, DEFAULT_KUMON_CONFIG.firstNumberMax));
    const secondNumberMode = merged.secondNumberMode === 'range' ? 'range' : 'fixed';
    const secondNumberFixedValue = clampInteger(merged.secondNumberFixedValue, 0, 100, DEFAULT_KUMON_CONFIG.secondNumberFixedValue);
    const secondNumberMin = clampInteger(merged.secondNumberMin, 0, 100, DEFAULT_KUMON_CONFIG.secondNumberMin);
    const secondNumberMax = Math.max(secondNumberMin, clampInteger(merged.secondNumberMax, 0, 100, DEFAULT_KUMON_CONFIG.secondNumberMax));
    const requestedCount = Number(merged.questionCount);
    const questionCount = [5, 10, 20].includes(requestedCount) ? requestedCount : DEFAULT_KUMON_CONFIG.questionCount;

    return {
        operation: '+',
        firstNumberMin,
        firstNumberMax,
        secondNumberMode,
        secondNumberFixedValue,
        secondNumberMin,
        secondNumberMax,
        questionCount,
        hintsEnabled: merged.hintsEnabled !== false,
        mode: merged.mode === 'assessment' ? 'assessment' : 'practice'
    };
}

export function generateKumonQuestions(config = DEFAULT_KUMON_CONFIG) {
    const normalized = normalizeKumonConfig(config);
    const firstSpan = normalized.firstNumberMax - normalized.firstNumberMin + 1;
    const secondSpan = normalized.secondNumberMax - normalized.secondNumberMin + 1;

    return Array.from({ length: normalized.questionCount }, (_, index) => {
        const operandA = normalized.firstNumberMin + (index % firstSpan);
        const operandB = normalized.secondNumberMode === 'fixed'
            ? normalized.secondNumberFixedValue
            : normalized.secondNumberMin + (index % secondSpan);

        return {
            questionId: `addition-${index + 1}-${operandA}-${operandB}`,
            questionIndex: index,
            operandA,
            operandB,
            operation: '+',
            expectedAnswer: operandA + operandB
        };
    });
}

export function createAdditionHint(question, hintLevel) {
    const previousAddend = Math.max(0, question.operandB - 1);
    const previousSum = question.operandA + previousAddend;

    if (hintLevel <= 1) {
        return {
            hintLevel: 1,
            scaffoldType: 'nearby-fact',
            text: `Think about ${question.operandA} + ${previousAddend}.`
        };
    }

    if (hintLevel === 2) {
        return {
            hintLevel: 2,
            scaffoldType: 'one-more',
            text: `${question.operandA} + ${previousAddend} = ${previousSum}. So ${question.operandA} + ${question.operandB} is one more.`
        };
    }

    return {
        hintLevel: 3,
        scaffoldType: 'number-line',
        text: `${question.operandA} ... count ${question.operandB} steps forward.`
    };
}

export function createKumonQuizGame(config = {}) {
    const quizConfig = normalizeKumonConfig(config);
    const state = createInitialState(quizConfig, 1, normalizeWorksheetLearnerName(config.learnerName));

    function getState() {
        return cloneState(state);
    }

    function getCurrentQuestion() {
        return state.questions[state.currentQuestionIndex] || null;
    }

    function submitAnswer(rawAnswer, options = {}) {
        if (state.completed) {
            return { result: 'ignored', state: getState() };
        }

        const question = getCurrentQuestion();
        const learnerAnswer = Number(rawAnswer);
        const isCorrect = Number.isFinite(learnerAnswer) && learnerAnswer === question.expectedAnswer;
        const hintUsed = state.currentHintLevel > 0;
        const trial = createTrialRecord({
            state,
            question,
            learnerAnswer,
            isCorrect,
            reactionTimeMs: options.reactionTimeMs,
            autoAdvanced: isCorrect,
            timestamp: options.timestamp || new Date().toISOString()
        });

        state.trials.push(trial);
        state.attemptNumberByQuestion[question.questionId] = (state.attemptNumberByQuestion[question.questionId] || 0) + 1;
        state.lastResult = isCorrect ? 'success' : 'mistake';
        state.feedbackState = {
            type: state.lastResult,
            hintUsed,
            hintLevel: state.currentHintLevel
        };

        if (isCorrect) {
            state.correctCount += 1;
            state.stars += 1;
            state.successPendingAdvance = true;
            return { result: 'success', trial, state: getState() };
        }

        state.wrongAnswers.push({
            question: formatQuestion(question),
            learnerAnswer,
            correctAnswer: question.expectedAnswer
        });

        if (state.config.hintsEnabled) {
            state.currentHintLevel = Math.min(state.currentHintLevel + 1, 3);
            state.supportState = createAdditionHint(question, state.currentHintLevel);
        } else {
            state.supportState = {
                hintLevel: 0,
                scaffoldType: 'supportive-retry',
                text: 'Try the same number bridge again.'
            };
        }

        return { result: 'mistake', trial, state: getState() };
    }

    function advanceAfterCorrect() {
        if (!state.successPendingAdvance || state.completed) {
            return { result: 'ignored', state: getState() };
        }

        state.successPendingAdvance = false;
        state.currentHintLevel = 0;
        state.supportState = null;

        if (state.currentQuestionIndex >= state.questions.length - 1) {
            state.completed = true;
            state.completionState = getResultSummary();
            return { result: 'complete', state: getState() };
        }

        state.currentQuestionIndex += 1;
        state.questionStartedAt = Date.now();
        return { result: 'advanced', state: getState() };
    }

    function requestHint() {
        if (state.completed || !state.config.hintsEnabled) {
            return { result: 'ignored', state: getState() };
        }

        const question = getCurrentQuestion();
        state.currentHintLevel = Math.min(state.currentHintLevel + 1, 3);
        state.supportState = createAdditionHint(question, state.currentHintLevel);
        return { result: 'hint', state: getState() };
    }

    function getResultSummary() {
        const total = state.questions.length;
        const accuracy = total ? Math.round((state.correctCount / total) * 100) : 0;

        return {
            correct: state.correctCount,
            total,
            accuracy,
            wrongAnswers: state.wrongAnswers.map(answer => ({ ...answer })),
            allCorrect: state.wrongAnswers.length === 0
        };
    }

    function resetRound() {
        const next = createInitialState(state.config, state.roundNumber + 1, state.learnerName);
        Object.assign(state, next);
        return getState();
    }

    return {
        advanceAfterCorrect,
        getCurrentQuestion,
        getResultSummary,
        getState,
        requestHint,
        resetRound,
        submitAnswer
    };
}

export function formatQuestion(question) {
    return `${question.operandA} ${question.operation} ${question.operandB}`;
}

function createInitialState(config, roundNumber = 1, learnerName = 'Learner') {
    const questions = generateKumonQuestions(config);

    return {
        sessionId: `kumon-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        activityId: KUMON_QUIZ_ACTIVITY_ID,
        learnerName,
        config,
        questions,
        currentQuestionIndex: 0,
        questionStartedAt: Date.now(),
        attemptNumberByQuestion: {},
        trials: [],
        wrongAnswers: [],
        supportState: null,
        feedbackState: null,
        completionState: null,
        currentHintLevel: 0,
        correctCount: 0,
        stars: 0,
        completed: false,
        successPendingAdvance: false,
        lastResult: null,
        roundNumber
    };
}

function createTrialRecord({
    state,
    question,
    learnerAnswer,
    isCorrect,
    reactionTimeMs,
    autoAdvanced,
    timestamp
}) {
    const hintUsed = state.currentHintLevel > 0;
    const hintLevel = state.currentHintLevel;
    const attemptNumber = (state.attemptNumberByQuestion[question.questionId] || 0) + 1;

    return {
        sessionId: state.sessionId,
        activityId: state.activityId,
        learnerName: state.learnerName,
        questionId: question.questionId,
        questionIndex: question.questionIndex,
        operation: question.operation,
        operandA: question.operandA,
        operandB: question.operandB,
        expectedAnswer: question.expectedAnswer,
        learnerAnswer,
        isCorrect,
        attemptNumber,
        reactionTimeMs: Number(reactionTimeMs || 0),
        hintUsed,
        hintLevel,
        scaffoldType: state.supportState?.scaffoldType || null,
        autoAdvanced,
        configuredMode: state.config.mode,
        hintsEnabled: state.config.hintsEnabled,
        timestamp
    };
}

function cloneState(state) {
    return {
        ...state,
        config: { ...state.config },
        questions: state.questions.map(question => ({ ...question })),
        attemptNumberByQuestion: { ...state.attemptNumberByQuestion },
        trials: state.trials.map(trial => ({ ...trial })),
        wrongAnswers: state.wrongAnswers.map(answer => ({ ...answer })),
        supportState: state.supportState ? { ...state.supportState } : null,
        feedbackState: state.feedbackState ? { ...state.feedbackState } : null,
        completionState: state.completionState
            ? {
                ...state.completionState,
                wrongAnswers: state.completionState.wrongAnswers.map(answer => ({ ...answer }))
            }
            : null
    };
}

function clampInteger(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, Math.round(number)));
}

function mountKumonQuiz() {
    const root = document.getElementById('kumon-quiz-root');
    if (!root) return;

    let game = createKumonQuizGame();
    let learnerName = 'Learner';
    let advanceTimer = null;

    window.addEventListener('message', (event) => {
        if (event.data?.type !== GAME_EVENTS.INIT) return;

        learnerName = normalizeWorksheetLearnerName(event.data.learnerName);
        game = createKumonQuizGame({ ...event.data.payload, learnerName });
        render();
    });

    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.parent?.postMessage({ type: ACTIVITY_HOME_EVENT }, '*');
        });
    }

    function render() {
        const state = game.getState();
        applyWorksheetHeaderState({
            roundNumber: `${Math.min(state.currentQuestionIndex + 1, state.questions.length)}/${state.questions.length}`,
            stars: state.stars
        });

        if (state.completed) {
            renderResults(state);
            return;
        }

        const question = state.questions[state.currentQuestionIndex];
        root.innerHTML = `
            <div class="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]" data-testid="number-bridges-layout">
                <section data-testid="number-bridges-main-task" class="flex min-h-0 flex-col justify-center rounded-2xl border-2 border-sky-200 bg-white p-4 text-center">
                    <p class="text-sm font-black uppercase tracking-[0.14em] text-sky-800">Number Bridge</p>
                    <div data-testid="number-bridges-question" class="my-4 text-5xl sm:text-6xl font-black text-slate-950">${formatQuestion(question)} = ?</div>
                    <label class="sr-only" for="answer-input">Answer</label>
                    <input id="answer-input" data-testid="number-bridges-answer-input" inputmode="numeric" type="number" class="mx-auto min-h-[56px] w-full max-w-xs rounded-2xl border-4 border-sky-200 bg-sky-50 px-4 text-center text-3xl font-black focus:border-emerald-400 focus:outline-none" autocomplete="off">
                    <button data-testid="number-bridges-check-button" type="button" class="mx-auto mt-3 min-h-[48px] rounded-full bg-emerald-700 px-6 py-2 text-lg font-black text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-300">Check</button>
                    <div data-testid="number-bridges-success-tick" class="${state.lastResult === 'success' ? 'number-bridge-success mt-4' : 'hidden'}">
                        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-4xl font-black text-white">&#10003;</div>
                        <p class="mt-2 text-lg font-black">Great work, ${learnerName}! &#127793;</p>
                    </div>
                    <section data-testid="number-bridges-feedback" class="mt-3 min-h-[4rem]">${state.lastResult === 'mistake' ? renderSiraashFeedback('mistake') : ''}</section>
                </section>
                <aside data-testid="number-bridges-support-panel" class="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-slate-950">
                    <button data-testid="number-bridges-help-button" type="button" class="min-h-[44px] rounded-full border-2 border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-900 shadow-sm">${getWorksheetSupportPrompts(learnerName).initial}</button>
                    <div data-testid="number-bridges-support-text" class="mt-4 text-sm font-bold text-amber-950">${state.supportState?.text || 'SIRAASH can show a clue after a try.'}</div>
                    ${state.supportState?.hintLevel === 3 ? '<div data-testid="number-bridges-number-line" class="mt-3 rounded-xl border border-amber-300 bg-white p-2 text-xs font-black">0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 -- 10 -- 11 -- 12</div>' : ''}
                </aside>
            </div>
        `;

        const input = root.querySelector('[data-testid="number-bridges-answer-input"]');
        const submit = () => submitCurrentAnswer(input.value);
        root.querySelector('[data-testid="number-bridges-check-button"]').addEventListener('click', submit);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') submit();
        });
        root.querySelector('[data-testid="number-bridges-help-button"]').addEventListener('click', () => {
            game.requestHint();
            render();
        });
        input.focus();
    }

    function submitCurrentAnswer(answer) {
        const stateBefore = game.getState();
        const outcome = game.submitAnswer(answer, {
            reactionTimeMs: getReactionTime(stateBefore),
            timestamp: new Date().toISOString()
        });

        render();

        if (outcome.result === 'success') {
            if (advanceTimer) clearTimeout(advanceTimer);
            advanceTimer = setTimeout(() => {
                game.advanceAfterCorrect();
                const state = game.getState();
                if (state.completed) {
                    submitSession(state);
                }
                render();
            }, 800);
        }
    }

    function renderResults(state) {
        const summary = game.getResultSummary();
        applyWorksheetHeaderState({
            roundNumber: `${summary.total}/${summary.total}`,
            stars: state.stars
        });

        const wrongList = summary.wrongAnswers.length
            ? `<ul data-testid="number-bridges-wrong-list" class="mt-3 space-y-2 text-left">${summary.wrongAnswers.map(answer => `
                <li class="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-bold">
                    <div>${answer.question} = ${answer.correctAnswer}</div>
                    <div class="text-amber-900">Your answer: ${Number.isNaN(answer.learnerAnswer) ? 'No answer' : answer.learnerAnswer}</div>
                </li>
            `).join('')}</ul>`
            : '<p data-testid="number-bridges-all-correct" class="mt-3 text-base font-black text-emerald-800">All answers correct!</p>';

        root.innerHTML = `
            <section data-testid="number-bridges-results" class="flex h-full min-h-0 flex-col items-center justify-center overflow-y-auto rounded-2xl border-2 border-emerald-200 bg-white p-4 text-center">
                ${renderWorksheetCompletion({
                    learnerName,
                    message: 'You finished your number bridges.',
                    actionTestId: 'number-bridges-next-round-button'
                })}
                <div class="mt-4 w-full max-w-md rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
                    <p data-testid="number-bridges-score" class="text-xl font-black">Score: ${summary.correct} / ${summary.total}</p>
                    <p data-testid="number-bridges-accuracy" class="mt-1 text-lg font-bold text-sky-900">Accuracy: ${summary.accuracy}%</p>
                    ${wrongList}
                    <button data-testid="number-bridges-home-button" type="button" class="mt-4 min-h-[44px] rounded-full border-2 border-emerald-200 bg-white px-5 py-2 text-base font-black text-emerald-900">Home</button>
                </div>
            </section>
        `;

        root.querySelector('[data-testid="number-bridges-next-round-button"]').addEventListener('click', () => {
            game.resetRound();
            render();
        });
        root.querySelector('[data-testid="number-bridges-home-button"]').addEventListener('click', () => {
            window.parent?.postMessage({ type: ACTIVITY_HOME_EVENT }, '*');
        });
    }

    function submitSession(state) {
        window.parent?.postMessage({
            type: GAME_EVENTS.COMPLETE,
            payload: {
                gameId: KUMON_QUIZ_ACTIVITY_ID,
                score: state.correctCount,
                accuracy: game.getResultSummary().accuracy,
                averageReactionTimeMs: average(state.trials.map(trial => trial.reactionTimeMs)),
                highestLevelReached: 1,
                sessionLengthSeconds: 0,
                trials: state.trials
            }
        }, '*');
    }

    render();
}

function getReactionTime(state) {
    return Math.max(0, Date.now() - state.questionStartedAt);
}

function average(values) {
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', mountKumonQuiz);
}
