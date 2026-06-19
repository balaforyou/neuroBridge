import { GAME_EVENTS } from '../../js/constants.js';
import {
    applyWorksheetHeaderState,
    getWorksheetSupportPrompts,
    normalizeWorksheetLearnerName,
} from '../../js/worksheetTemplate.js';
import { playSuccessClap } from '../../js/audio.js';

export const KUMON_QUIZ_ACTIVITY_ID = 'kumonQuiz';
export const ACTIVITY_HOME_EVENT = 'SIRAASH_ACTIVITY_HOME';
export const NUMBER_BRIDGE_PAGE_TURN_MS = 320;
export const NUMBER_BRIDGE_MAX_LEVEL = 9;
export const NUMBER_BRIDGE_AUTO_PROGRESSION_THRESHOLD = 80;
export const NUMBER_BRIDGE_OPERATION_PACKS = {
    '+': {
        operation: '+',
        operationName: 'addition',
        label: 'Addition',
        skillType: 'Bridges',
        factors: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        skillLabelFor: factor => `+${factor} Bridges`
    },
    '-': {
        operation: '-',
        operationName: 'subtraction',
        label: 'Subtraction',
        skillType: 'Bridges',
        factors: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        skillLabelFor: factor => `-${factor} Bridges`
    },
    '×': {
        operation: '×',
        operationName: 'multiplication',
        label: 'Multiplication',
        skillType: 'Tables',
        factors: [2, 3, 4, 5, 6, 7, 8, 9, 10],
        skillLabelFor: factor => `×${factor} Tables`
    },
    '÷': {
        operation: '÷',
        operationName: 'division',
        label: 'Division',
        skillType: 'Facts',
        factors: [2, 3, 4, 5, 10],
        skillLabelFor: factor => `÷${factor} Facts`
    }
};

export const DEFAULT_KUMON_CONFIG = {
    operation: '+',
    level: 1,
    firstNumberMin: 1,
    firstNumberMax: 10,
    secondNumberMode: 'fixed',
    secondNumberFixedValue: 1,
    secondNumberMin: 1,
    secondNumberMax: 10,
    questionCount: 10,
    questionsPerScreen: 5,
    hintsEnabled: true,
    mode: 'practice',
    autoProgression: false,
    questionOrder: 'sequential'
};

export function getNumberBridgeLevelModel(level = DEFAULT_KUMON_CONFIG.level, operation = DEFAULT_KUMON_CONFIG.operation) {
    const operationPack = getNumberBridgeOperationPack(operation);
    const normalizedLevel = clampInteger(level, 1, operationPack.factors.length, DEFAULT_KUMON_CONFIG.level);
    const bridgeValue = operationPack.factors[normalizedLevel - 1] || operationPack.factors[0];

    return {
        operation: operationPack.operation,
        operationName: operationPack.operationName,
        level: normalizedLevel,
        bridgeValue,
        levelLabel: `${operationPack.label} L${normalizedLevel}`,
        skillLabel: operationPack.skillLabelFor(bridgeValue),
        displayLabel: `${operationPack.label} L${normalizedLevel} (${operationPack.skillLabelFor(bridgeValue)})`
    };
}

export function normalizeKumonConfig(config = {}) {
    const merged = { ...DEFAULT_KUMON_CONFIG, ...config };
    const operationPack = getNumberBridgeOperationPack(merged.operation);
    const firstNumberMin = clampInteger(merged.firstNumberMin, 1, 100, DEFAULT_KUMON_CONFIG.firstNumberMin);
    const firstNumberMax = Math.max(firstNumberMin, clampInteger(merged.firstNumberMax, 1, 100, DEFAULT_KUMON_CONFIG.firstNumberMax));
    const secondNumberMode = merged.secondNumberMode === 'range' ? 'range' : 'fixed';
    const levelSource = Object.prototype.hasOwnProperty.call(merged, 'level')
        ? merged.level
        : merged.secondNumberFixedValue;
    const levelModel = getNumberBridgeLevelModel(levelSource, operationPack.operation);
    const secondNumberFixedValue = secondNumberMode === 'fixed'
        ? levelModel.bridgeValue
        : clampInteger(merged.secondNumberFixedValue, 0, 100, DEFAULT_KUMON_CONFIG.secondNumberFixedValue);
    const secondNumberMin = clampInteger(merged.secondNumberMin, 0, 100, DEFAULT_KUMON_CONFIG.secondNumberMin);
    const secondNumberMax = Math.max(secondNumberMin, clampInteger(merged.secondNumberMax, 0, 100, DEFAULT_KUMON_CONFIG.secondNumberMax));
    const requestedCount = Number(merged.questionCount);
    const questionCount = [5, 10, 20].includes(requestedCount) ? requestedCount : DEFAULT_KUMON_CONFIG.questionCount;
    const requestedQuestionsPerScreen = Number(merged.questionsPerScreen);
    const questionsPerScreen = [1, 3, 5].includes(requestedQuestionsPerScreen)
        ? requestedQuestionsPerScreen
        : DEFAULT_KUMON_CONFIG.questionsPerScreen;

    return {
        operation: operationPack.operation,
        operationName: operationPack.operationName,
        level: levelModel.level,
        bridgeValue: levelModel.bridgeValue,
        levelLabel: levelModel.levelLabel,
        skillLabel: levelModel.skillLabel,
        levelDisplayLabel: levelModel.displayLabel,
        firstNumberMin,
        firstNumberMax,
        secondNumberMode,
        secondNumberFixedValue,
        secondNumberMin,
        secondNumberMax,
        questionCount,
        questionsPerScreen,
        hintsEnabled: merged.hintsEnabled !== false,
        mode: merged.mode === 'assessment' ? 'assessment' : 'practice',
        autoProgression: merged.autoProgression === true,
        questionOrder: merged.questionOrder === 'random' ? 'random' : 'sequential'
    };
}

export function getNumberBridgeOperationPack(operation = DEFAULT_KUMON_CONFIG.operation) {
    if (operation === 'x' || operation === 'X' || operation === '*') {
        return NUMBER_BRIDGE_OPERATION_PACKS['×'];
    }

    if (operation === '/') {
        return NUMBER_BRIDGE_OPERATION_PACKS['÷'];
    }

    return NUMBER_BRIDGE_OPERATION_PACKS[operation] || NUMBER_BRIDGE_OPERATION_PACKS['+'];
}

export function generateKumonQuestions(config = DEFAULT_KUMON_CONFIG) {
    const normalized = normalizeKumonConfig(config);
    if (normalized.questionOrder === 'sequential') {
        return assignQuestionOrderMetadata(createSequentialQuestions(normalized));
    }

    const questionPool = createQuestionPool(normalized);
    const questions = [];

    while (questions.length < normalized.questionCount) {
        const cycle = shuffleQuestions(questionPool);
        for (const question of cycle) {
            if (questions.length >= normalized.questionCount) break;
            questions.push({ ...question });
        }
    }

    return assignQuestionOrderMetadata(questions);
}

function createSequentialQuestions(config) {
    if (config.operation !== '+' || config.secondNumberMode !== 'range') {
        return takeQuestionsFromPool(createQuestionPool(config), config.questionCount);
    }

    const firstSpan = config.firstNumberMax - config.firstNumberMin + 1;
    const secondSpan = config.secondNumberMax - config.secondNumberMin + 1;

    return Array.from({ length: config.questionCount }, (_, index) => {
        const operandA = config.firstNumberMin + (index % firstSpan);
        const operandB = config.secondNumberMin + (index % secondSpan);

        return createArithmeticQuestion(config.operation, operandA, operandB);
    });
}

function takeQuestionsFromPool(questionPool, questionCount) {
    const questions = [];

    while (questions.length < questionCount) {
        for (const question of questionPool) {
            if (questions.length >= questionCount) break;
            questions.push({ ...question });
        }
    }

    return questions;
}

function assignQuestionOrderMetadata(questions) {
    return questions.map((question, index) => ({
        ...question,
        questionId: `addition-${index + 1}-${question.operandA}-${question.operandB}`,
        questionIndex: index
    }));
}

function createQuestionPool(config) {
    const pool = [];
    const factorValues = config.secondNumberMode === 'fixed'
        ? [config.bridgeValue]
        : createNumberRange(config.secondNumberMin, config.secondNumberMax);
    const operandAValues = config.operation === '-' && config.secondNumberMode === 'fixed'
        ? createNumberRange(config.bridgeValue, config.bridgeValue + 9)
        : createNumberRange(config.firstNumberMin, config.firstNumberMax);

    for (const operandA of operandAValues) {
        for (const factor of factorValues) {
            const question = createQuestionForOperation(config.operation, operandA, factor);
            if (question) {
                pool.push(question);
            }
        }
    }

    return pool.length ? pool : createFallbackQuestionPool(config);
}

function createFallbackQuestionPool(config) {
    const factor = config.bridgeValue;

    if (config.operation === '-') {
        return [createArithmeticQuestion('-', factor, factor)];
    }

    if (config.operation === '÷') {
        return [createArithmeticQuestion('÷', factor, factor)];
    }

    return [createArithmeticQuestion(config.operation, config.firstNumberMin, factor)];
}

function createQuestionForOperation(operation, baseValue, factor) {
    if (operation === '-') {
        if (baseValue < factor) return null;
        return createArithmeticQuestion(operation, baseValue, factor);
    }

    if (operation === '×') {
        return createArithmeticQuestion(operation, baseValue, factor);
    }

    if (operation === '÷') {
        if (factor === 0 || baseValue % factor !== 0) return null;
        return createArithmeticQuestion(operation, baseValue, factor);
    }

    return createArithmeticQuestion('+', baseValue, factor);
}

function createArithmeticQuestion(operation, operandA, operandB) {
    return {
        operandA,
        operandB,
        operation,
        expectedAnswer: calculateExpectedAnswer(operation, operandA, operandB)
    };
}

function calculateExpectedAnswer(operation, operandA, operandB) {
    if (operation === '-') return operandA - operandB;
    if (operation === '×') return operandA * operandB;
    if (operation === '÷') return operandA / operandB;
    return operandA + operandB;
}

function createNumberRange(min, max) {
    return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}

function shuffleQuestions(questions) {
    const shuffled = [...questions];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
}

export function createAdditionHint(question, hintLevel) {
    return createNumberBridgeHint({ ...question, operation: question.operation || '+' }, hintLevel);
}

export function createNumberBridgeHint(question, hintLevel) {
    if (question.operation === '-') {
        return {
            hintLevel: Math.min(Math.max(hintLevel, 1), 3),
            scaffoldType: 'take-away',
            text: `Start with ${question.operandA}. Take away ${question.operandB}.<br>${createCountingPath(question.operandA, -question.operandB)}`
        };
    }

    if (question.operation === '×') {
        return {
            hintLevel: Math.min(Math.max(hintLevel, 1), 3),
            scaffoldType: 'equal-groups',
            text: `Think of ${question.operandA} groups of ${question.operandB}.`
        };
    }

    if (question.operation === '÷') {
        return {
            hintLevel: Math.min(Math.max(hintLevel, 1), 3),
            scaffoldType: 'sharing',
            text: `Share ${question.operandA} into groups of ${question.operandB}. Count the groups.`
        };
    }

    const stepWord = getStepWord(question.operandB);
    const countingPath = createCountingPath(question.operandA, question.operandB);

    if (hintLevel <= 1) {
        return {
            hintLevel: 1,
            scaffoldType: 'nearby-fact',
            text: `Start with ${question.operandA}. Count ${stepWord} more.<br>${countingPath}`
        };
    }

    if (hintLevel === 2) {
        return {
            hintLevel: 2,
            scaffoldType: 'one-more',
            text: `Start with ${question.operandA}. Count ${stepWord} more.<br>${countingPath}`
        };
    }

    return {
        hintLevel: 3,
        scaffoldType: 'number-line',
        text: `Start with ${question.operandA}. Count ${stepWord} more.<br>${countingPath}`
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

    function getVisibleQuestions() {
        return getVisibleQuestionsFromState(state);
    }

    function submitAnswer(rawAnswer, options = {}) {
        if (state.completed) {
            return { result: 'ignored', state: getState() };
        }

        const question = getQuestionForSubmission(state, options);
        if (!question) {
            return { result: 'ignored', state: getState() };
        }

        const normalizedAnswer = normalizeAnswerValue(rawAnswer);
        const lastSubmittedAnswer = state.lastSubmittedAnswerByQuestion[question.questionId];

        if (lastSubmittedAnswer === normalizedAnswer) {
            return { result: 'duplicate', state: getState() };
        }

        if (state.correctQuestionIds[question.questionId]) {
            return { result: 'locked', state: getState() };
        }

        if (state.successPendingAdvance) {
            return { result: 'ignored', state: getState() };
        }

        const learnerAnswer = Number(rawAnswer);
        const isCorrect = Number.isFinite(learnerAnswer) && learnerAnswer === question.expectedAnswer;
        const hintLevelBefore = state.currentHintLevelByQuestion[question.questionId] || 0;
        const supportBefore = state.supportStateByQuestion[question.questionId] || null;
        const autoAdvanced = isCorrect && willCompleteVisibleGroup(state, question);
        const trial = createTrialRecord({
            state,
            question,
            learnerAnswer,
            isCorrect,
            reactionTimeMs: options.reactionTimeMs,
            autoAdvanced,
            hintLevel: hintLevelBefore,
            scaffoldType: supportBefore?.scaffoldType || null,
            timestamp: options.timestamp || new Date().toISOString()
        });

        state.lastSubmittedAnswerByQuestion[question.questionId] = normalizedAnswer;
        state.answerValueByQuestion[question.questionId] = normalizedAnswer;
        state.trials.push(trial);
        state.attemptNumberByQuestion[question.questionId] = (state.attemptNumberByQuestion[question.questionId] || 0) + 1;
        state.lastResult = isCorrect ? 'success' : 'mistake';
        state.rowResultByQuestion[question.questionId] = state.lastResult;
        state.activeQuestionId = question.questionId;
        state.feedbackState = {
            type: state.lastResult,
            hintUsed: hintLevelBefore > 0,
            hintLevel: hintLevelBefore
        };

        if (isCorrect) {
            state.correctQuestionIds[question.questionId] = true;
            state.correctCount += 1;
            state.stars += 1;
            state.successPendingAdvance = isVisibleGroupComplete(state);
            return { result: 'success', trial, state: getState() };
        }

        state.wrongAnswers.push({
            questionId: question.questionId,
            questionIndex: question.questionIndex,
            question: formatQuestion(question),
            learnerAnswer,
            correctAnswer: question.expectedAnswer
        });

        if (state.config.hintsEnabled) {
            const nextHintLevel = Math.min(hintLevelBefore + 1, 3);
            state.currentHintLevelByQuestion[question.questionId] = nextHintLevel;
            state.supportStateByQuestion[question.questionId] = createNumberBridgeHint(question, nextHintLevel);
            state.supportState = state.supportStateByQuestion[question.questionId];
        } else {
            state.currentHintLevelByQuestion[question.questionId] = 0;
            state.supportStateByQuestion[question.questionId] = {
                hintLevel: 0,
                scaffoldType: 'supportive-retry',
                text: 'Try again.'
            };
            state.supportState = state.supportStateByQuestion[question.questionId];
        }

        return { result: 'mistake', trial, state: getState() };
    }

    function advanceAfterCorrect() {
        if (!state.successPendingAdvance || state.completed) {
            return { result: 'ignored', state: getState() };
        }

        state.successPendingAdvance = false;
        state.supportState = null;
        state.feedbackState = null;
        state.lastResult = null;
        state.activeQuestionId = null;

        const nextQuestionIndex = state.currentQuestionIndex + state.config.questionsPerScreen;

        if (nextQuestionIndex >= state.questions.length) {
            state.completed = true;
            state.completionState = getResultSummary();
            return { result: 'complete', state: getState() };
        }

        state.currentQuestionIndex = nextQuestionIndex;
        state.questionStartedAt = Date.now();
        return { result: 'advanced', state: getState() };
    }

    function requestHint(options = {}) {
        if (state.completed || !state.config.hintsEnabled) {
            return { result: 'ignored', state: getState() };
        }

        const question = getQuestionForSubmission(state, options) ||
            state.questions.find(candidate => candidate.questionId === state.activeQuestionId) ||
            getCurrentQuestion();
        const currentHintLevel = state.currentHintLevelByQuestion[question.questionId] || 0;
        const nextHintLevel = Math.min(currentHintLevel + 1, 3);

        state.currentHintLevelByQuestion[question.questionId] = nextHintLevel;
        state.supportStateByQuestion[question.questionId] = createNumberBridgeHint(question, nextHintLevel);
        state.supportState = state.supportStateByQuestion[question.questionId];
        state.activeQuestionId = question.questionId;
        return { result: 'hint', state: getState() };
    }

    function getResultSummary() {
        const total = state.questions.length;
        const accuracy = total ? Math.round((state.correctCount / total) * 100) : 0;
        const totalReactionTimeMs = state.trials.reduce((sum, trial) => sum + Number(trial.reactionTimeMs || 0), 0);
        const averageTimeSeconds = total ? roundToOneDecimal((totalReactionTimeMs / 1000) / total) : 0;
        const timeTakenSeconds = Math.round(totalReactionTimeMs / 1000);
        const hintsUsed = Object.values(state.currentHintLevelByQuestion).reduce((sum, hintLevel) => sum + Number(hintLevel || 0), 0);
        const mistakeCount = state.wrongAnswers.length;
        const progressionAccuracy = calculateNumberBridgeProgressionAccuracy(state.correctCount, mistakeCount);
        const wrongAnswerReview = buildWrongAnswerReview(state.wrongAnswers);

        return {
            operation: state.config.operation,
            level: state.config.level,
            levelLabel: state.config.levelLabel,
            skillLabel: state.config.skillLabel,
            levelDisplayLabel: state.config.levelDisplayLabel,
            bridgeValue: state.config.bridgeValue,
            autoProgression: state.config.autoProgression,
            questionOrderMode: state.config.questionOrder,
            progressionAccuracy,
            nextLevelSuggested: getNextNumberBridgeLevel(state.config, progressionAccuracy),
            correct: state.correctCount,
            total,
            accuracy,
            timeTakenSeconds,
            averageTimeSeconds,
            hintsUsed,
            mistakeCount,
            wrongAnswers: wrongAnswerReview,
            allCorrect: mistakeCount === 0
        };
    }

    function resetRound() {
        const summary = getResultSummary();
        const nextLevel = getNextNumberBridgeLevel(state.config, summary.progressionAccuracy);
        const nextConfig = normalizeKumonConfig({
            ...state.config,
            level: nextLevel
        });
        const next = createInitialState(nextConfig, state.roundNumber + 1, state.learnerName);
        Object.assign(state, next);
        return getState();
    }

    return {
        advanceAfterCorrect,
        getCurrentQuestion,
        getResultSummary,
        getState,
        getVisibleQuestions,
        requestHint,
        resetRound,
        submitAnswer,
        validateAnswer: submitAnswer
    };
}

export function createKumonSessionSummary(state, resultSummary = null) {
    const summary = resultSummary || {
        operation: state.config.operation,
        level: state.config.level,
        levelLabel: state.config.levelLabel,
        skillLabel: state.config.skillLabel,
        levelDisplayLabel: state.config.levelDisplayLabel,
        bridgeValue: state.config.bridgeValue,
        autoProgression: state.config.autoProgression,
        correct: state.correctCount,
        total: state.questions.length,
        accuracy: state.questions.length ? Math.round((state.correctCount / state.questions.length) * 100) : 0,
        timeTakenSeconds: 0,
        averageTimeSeconds: 0,
        hintsUsed: 0,
        mistakeCount: 0
    };
    const accuracyPercent = Math.round((summary.correct / Math.max(summary.total, 1)) * 100);

    return {
        gameId: KUMON_QUIZ_ACTIVITY_ID,
        activityId: KUMON_QUIZ_ACTIVITY_ID,
        activityName: 'Kumon Quiz / Number Bridges',
        operation: state.config.operation,
        level: state.config.level,
        levelLabel: state.config.levelLabel,
        skillLabel: state.config.skillLabel,
        levelDisplayLabel: state.config.levelDisplayLabel,
        bridgeValue: state.config.bridgeValue,
        autoProgression: state.config.autoProgression,
        questionOrderMode: state.config.questionOrder,
        progressionAccuracy: summary.progressionAccuracy ?? calculateNumberBridgeProgressionAccuracy(summary.correct, summary.mistakeCount),
        nextLevelSuggested: summary.nextLevelSuggested ?? getNextNumberBridgeLevel(state.config, accuracyPercent),
        nextLevelApplied: summary.nextLevelApplied ?? null,
        score: summary.correct,
        correctCount: summary.correct,
        totalQuestions: summary.total,
        accuracy: accuracyPercent / 100,
        accuracyPercent,
        averageReactionTimeMs: average(state.trials.map(trial => trial.reactionTimeMs)),
        averageTimePerQuestion: summary.averageTimeSeconds,
        hintUsageCount: summary.hintsUsed,
        mistakeCount: summary.mistakeCount,
        highestLevelReached: state.config.level,
        sessionLengthSeconds: summary.timeTakenSeconds,
        trials: state.trials
    };
}

export function getNextNumberBridgeLevel(config = DEFAULT_KUMON_CONFIG, accuracyPercent = 0) {
    const normalized = normalizeKumonConfig(config);
    if (!normalized.autoProgression) {
        return normalized.level;
    }

    if (Number(accuracyPercent || 0) < NUMBER_BRIDGE_AUTO_PROGRESSION_THRESHOLD) {
        return normalized.level;
    }

    return Math.min(NUMBER_BRIDGE_MAX_LEVEL, normalized.level + 1);
}

export function calculateNumberBridgeProgressionAccuracy(correctCount = 0, mistakeCount = 0) {
    const correct = Number(correctCount || 0);
    const mistakes = Number(mistakeCount || 0);
    const totalSignals = correct + mistakes;

    if (!Number.isFinite(totalSignals) || totalSignals <= 0) {
        return 0;
    }

    return Math.round((correct / totalSignals) * 100);
}

export function getNumberBridgeTransitionDurationMs(prefersReducedMotion = false) {
    return prefersReducedMotion ? 0 : NUMBER_BRIDGE_PAGE_TURN_MS;
}

export function shouldPlayNumberBridgeCompletionClap(state = {}) {
    return state.completed === true && state.completionCelebrationPlayed !== true;
}

export function markNumberBridgeCompletionClapPlayed(state = {}) {
    return {
        ...state,
        completionCelebrationPlayed: true
    };
}

export function playNumberBridgeCompletionClap(playClap = playSuccessClap) {
    try {
        if (typeof playClap === 'function') {
            playClap();
            return true;
        }
    } catch (error) {
        return false;
    }

    return false;
}

export function formatQuestion(question) {
    return `${question.operandA} ${question.operation} ${question.operandB}`;
}

export function renderNumberBridgeSupportText(state, learnerName = 'Learner') {
    if (state.lastResult === 'mistake' && state.supportState?.text) {
        return `<p>&#127793; You got close, ${normalizeWorksheetLearnerName(learnerName)}.</p><p class="mt-3">${state.supportState.text}</p>`;
    }

    return state.supportState?.text || 'SIRAASH can show a clue after a try.';
}

export function renderNumberBridgeResultMarkup(summary, learnerName = 'Learner') {
    const normalizedLearnerName = normalizeWorksheetLearnerName(learnerName);
    const motivationalLine = summary.accuracy >= 80
        ? '<p data-testid="number-bridges-clap-visual" class="text-sm font-black text-emerald-800">&#128079;&#128079;&#128079; Strong work!</p>'
        : '';
    const reviewContent = summary.wrongAnswers.length
        ? `<ul data-testid="number-bridges-wrong-list" class="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">${summary.wrongAnswers.map(answer => `
                <li data-testid="number-bridges-review-item" class="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-bold">
                    <div class="text-base font-black text-slate-950">${answer.question}</div>
                    <div class="text-amber-900">Attempted: ${answer.attemptedAnswers.map(formatLearnerAnswer).join(', ')}</div>
                    <div class="text-emerald-900">Correct: ${answer.correctAnswer}</div>
                </li>
            `).join('')}</ul>`
        : '<p data-testid="number-bridges-all-correct" class="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-base font-black text-emerald-800">All answers correct!</p>';

    return `
        <section data-testid="number-bridges-results" class="grid h-full min-h-0 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-2 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-3 text-center md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.86fr)] md:grid-rows-1">
            <div data-testid="number-bridges-result-summary" class="flex min-h-0 flex-col gap-2 md:h-full">
                <div data-testid="siraash-completion-feedback" class="w-full shrink-0 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-slate-950 shadow-sm">
                    <div class="flex items-center justify-center gap-3">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-3xl font-black text-white" aria-hidden="true">&#10003;</div>
                        <div class="text-left">
                            <p data-testid="siraash-completion-title" class="text-lg font-black leading-tight sm:text-xl">Great work, ${normalizedLearnerName}! &#127793;</p>
                            <p data-testid="siraash-completion-message" class="text-sm font-bold text-emerald-900 sm:text-base">You finished your Number Bridges.</p>
                            ${motivationalLine}
                        </div>
                    </div>
                </div>

                <div data-testid="number-bridges-result-level" class="w-full shrink-0 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-900">
                    ${summary.levelDisplayLabel || `${summary.levelLabel || 'Addition L1'} (${summary.skillLabel || '+1 Bridges'})`}
                </div>

                <div data-testid="number-bridges-metrics" class="w-full shrink-0 rounded-2xl border-2 border-sky-200 bg-sky-50 p-3">
                    <div class="grid grid-cols-2 gap-2 text-left text-sm font-black text-slate-950 lg:grid-cols-3">
                        <p data-testid="number-bridges-total">Questions: ${summary.total}</p>
                        <p data-testid="number-bridges-correct-total">Correct / Total: ${summary.correct} / ${summary.total}</p>
                        <p data-testid="number-bridges-accuracy">Accuracy: ${summary.accuracy}%</p>
                        <p data-testid="number-bridges-time-taken">Time Taken: ${summary.timeTakenSeconds} sec</p>
                        <p data-testid="number-bridges-average-time">Average Time: ${summary.averageTimeSeconds} sec/question</p>
                        <p data-testid="number-bridges-hints-used">Hints Used: ${summary.hintsUsed}</p>
                        <p data-testid="number-bridges-mistakes-corrected">Mistakes Corrected: ${summary.mistakeCount}</p>
                    </div>
                </div>

                <div data-testid="number-bridges-actions" class="flex shrink-0 flex-wrap justify-center gap-3 md:mt-auto">
                    <button data-testid="number-bridges-next-round-button" type="button" class="min-h-[44px] rounded-full bg-emerald-700 px-5 py-2 text-base font-black text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-300">Try Again</button>
                    <button data-testid="number-bridges-home-button" type="button" class="min-h-[44px] rounded-full border-2 border-emerald-200 bg-white px-5 py-2 text-base font-black text-emerald-900">Home</button>
                </div>
            </div>

            <div data-testid="number-bridges-review" class="flex min-h-0 w-full flex-col rounded-2xl border-2 border-amber-100 bg-[#fffaf0] p-3 text-left">
                <h3 class="shrink-0 text-base font-black text-slate-950">Review</h3>
                ${reviewContent}
            </div>
        </section>
    `;
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
        lastSubmittedAnswerByQuestion: {},
        answerValueByQuestion: {},
        rowResultByQuestion: {},
        correctQuestionIds: {},
        currentHintLevelByQuestion: {},
        supportStateByQuestion: {},
        trials: [],
        wrongAnswers: [],
        supportState: null,
        feedbackState: null,
        completionState: null,
        activeQuestionId: null,
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
    hintLevel,
    scaffoldType,
    timestamp
}) {
    const attemptNumber = (state.attemptNumberByQuestion[question.questionId] || 0) + 1;

    return {
        sessionId: state.sessionId,
        activityId: state.activityId,
        learnerName: state.learnerName,
        questionId: question.questionId,
        questionIndex: question.questionIndex,
        operation: question.operation,
        level: state.config.level,
        levelLabel: state.config.levelLabel,
        skillLabel: state.config.skillLabel,
        bridgeValue: state.config.bridgeValue,
        operandA: question.operandA,
        operandB: question.operandB,
        expectedAnswer: question.expectedAnswer,
        learnerAnswer,
        isCorrect,
        attemptNumber,
        reactionTimeMs: Number(reactionTimeMs || 0),
        hintUsed: hintLevel > 0,
        hintLevel,
        scaffoldType,
        autoAdvanced,
        configuredMode: state.config.mode,
        hintsEnabled: state.config.hintsEnabled,
        questionsPerScreen: state.config.questionsPerScreen,
        pageIndex: getPageIndex(state),
        rowIndex: getRowIndex(state, question),
        timestamp
    };
}

function cloneState(state) {
    return {
        ...state,
        config: { ...state.config },
        questions: state.questions.map(question => ({ ...question })),
        attemptNumberByQuestion: { ...state.attemptNumberByQuestion },
        lastSubmittedAnswerByQuestion: { ...state.lastSubmittedAnswerByQuestion },
        answerValueByQuestion: { ...state.answerValueByQuestion },
        rowResultByQuestion: { ...state.rowResultByQuestion },
        correctQuestionIds: { ...state.correctQuestionIds },
        currentHintLevelByQuestion: { ...state.currentHintLevelByQuestion },
        supportStateByQuestion: Object.fromEntries(
            Object.entries(state.supportStateByQuestion).map(([questionId, supportState]) => [questionId, { ...supportState }])
        ),
        trials: state.trials.map(trial => ({ ...trial })),
        wrongAnswers: state.wrongAnswers.map(answer => ({ ...answer })),
        supportState: state.supportState ? { ...state.supportState } : null,
        feedbackState: state.feedbackState ? { ...state.feedbackState } : null,
        completionState: state.completionState
            ? {
                ...state.completionState,
                wrongAnswers: state.completionState.wrongAnswers.map(answer => ({
                    ...answer,
                    attemptedAnswers: [...answer.attemptedAnswers]
                }))
            }
            : null
    };
}

function getVisibleQuestionsFromState(state) {
    return state.questions.slice(
        state.currentQuestionIndex,
        state.currentQuestionIndex + state.config.questionsPerScreen
    );
}

function getQuestionForSubmission(state, options = {}) {
    if (options.questionId) {
        return getVisibleQuestionsFromState(state).find(question => question.questionId === options.questionId) || null;
    }

    if (Number.isInteger(options.questionIndex)) {
        return getVisibleQuestionsFromState(state).find(question => question.questionIndex === options.questionIndex) || null;
    }

    if (Number.isInteger(options.rowIndex)) {
        return getVisibleQuestionsFromState(state)[options.rowIndex] || null;
    }

    return state.questions[state.currentQuestionIndex] || null;
}

function willCompleteVisibleGroup(state, question) {
    return getVisibleQuestionsFromState(state).every(visibleQuestion => (
        visibleQuestion.questionId === question.questionId || state.correctQuestionIds[visibleQuestion.questionId]
    ));
}

function isVisibleGroupComplete(state) {
    return getVisibleQuestionsFromState(state).every(question => state.correctQuestionIds[question.questionId]);
}

function getPageIndex(state) {
    return Math.floor(state.currentQuestionIndex / state.config.questionsPerScreen);
}

function getRowIndex(state, question) {
    return Math.max(0, question.questionIndex - state.currentQuestionIndex);
}

function getStepWord(stepCount) {
    const words = {
        0: 'zero',
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
        6: 'six',
        7: 'seven',
        8: 'eight',
        9: 'nine',
        10: 'ten'
    };

    return words[stepCount] || String(stepCount);
}

function createCountingPath(start, stepCount) {
    const direction = stepCount < 0 ? -1 : 1;
    return Array.from({ length: Math.abs(stepCount) + 1 }, (_, index) => start + (index * direction)).join(' → ');
}

function buildWrongAnswerReview(wrongAnswers = []) {
    const reviewByQuestion = new Map();

    wrongAnswers.forEach(answer => {
        const key = answer.questionId || `${answer.question}-${answer.correctAnswer}`;
        const existing = reviewByQuestion.get(key);

        if (existing) {
            existing.attemptedAnswers.push(answer.learnerAnswer);
            return;
        }

        reviewByQuestion.set(key, {
            questionId: answer.questionId,
            questionIndex: answer.questionIndex,
            question: answer.question,
            correctAnswer: answer.correctAnswer,
            attemptedAnswers: [answer.learnerAnswer]
        });
    });

    return Array.from(reviewByQuestion.values()).sort((a, b) => (
        Number(a.questionIndex ?? 0) - Number(b.questionIndex ?? 0)
    ));
}

function normalizeAnswerValue(rawAnswer) {
    return String(rawAnswer ?? '').trim();
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
    let selectedQuestionId = null;
    let completionCelebrationPlayed = false;

    window.addEventListener('message', (event) => {
        if (event.data?.type !== GAME_EVENTS.INIT) return;

        learnerName = normalizeWorksheetLearnerName(event.data.learnerName);
        game = createKumonQuizGame({ ...event.data.payload, learnerName });
        completionCelebrationPlayed = false;
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
        const visibleQuestions = state.questions.slice(
            state.currentQuestionIndex,
            state.currentQuestionIndex + state.config.questionsPerScreen
        );
        const visibleEnd = Math.min(state.currentQuestionIndex + visibleQuestions.length, state.questions.length);

        applyWorksheetHeaderState({
            roundNumber: `${visibleEnd}/${state.questions.length}`,
            stars: state.stars,
            levelLabel: state.config.levelLabel
        });

        if (state.completed) {
            renderResults(state);
            return;
        }

        root.innerHTML = `
            <div class="grid h-full min-h-0 grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_17rem]" data-testid="number-bridges-layout">
                <section data-testid="number-bridges-main-task" class="flex min-h-0 flex-col justify-start rounded-2xl border-2 border-sky-200 bg-white p-2 text-center sm:p-3">
                    <div data-testid="number-bridges-row-list" class="flex flex-col gap-1.5">
                        ${visibleQuestions.map((question, rowIndex) => renderQuestionRow(question, rowIndex, state)).join('')}
                    </div>
                    <section data-testid="number-bridges-feedback" class="hidden"></section>
                </section>
                <aside data-testid="number-bridges-support-panel" class="rounded-2xl border-2 border-amber-200 bg-amber-50 p-3 text-slate-950">
                    <button data-testid="number-bridges-help-button" type="button" class="min-h-[44px] rounded-full border-2 border-emerald-200 bg-white px-3 py-2 text-sm font-black text-emerald-900 shadow-sm">${getWorksheetSupportPrompts(learnerName).initial}</button>
                    <div data-testid="number-bridges-support-text" class="mt-3 text-sm font-bold text-amber-950">${renderSupportText(state)}</div>
                    ${state.supportState?.hintLevel === 3 ? '<div data-testid="number-bridges-number-line" class="mt-2 rounded-xl border border-amber-300 bg-white p-2 text-xs font-black">0 -- 1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 7 -- 8 -- 9 -- 10 -- 11 -- 12</div>' : ''}
                </aside>
            </div>
        `;

        root.querySelectorAll('[data-question-id]').forEach((input) => {
            const questionId = input.getAttribute('data-question-id');
            input.addEventListener('focus', () => {
                selectedQuestionId = questionId;
            });
            input.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter') return;
                event.preventDefault();
                submitCurrentAnswer(questionId, input.value, 'enter');
            });
            input.addEventListener('blur', () => submitCurrentAnswer(questionId, input.value, 'blur'));
        });
        root.querySelector('[data-testid="number-bridges-help-button"]').addEventListener('click', () => {
            game.requestHint({ questionId: selectedQuestionId });
            render();
        });
        focusNextInput();
    }

    function renderQuestionRow(question, rowIndex, state) {
        const questionId = question.questionId;
        const isCorrect = state.correctQuestionIds[questionId] === true;
        const isMistake = state.rowResultByQuestion[questionId] === 'mistake';
        const answerValue = state.answerValueByQuestion[questionId] || '';
        const inputTestId = rowIndex === 0
            ? 'number-bridges-answer-input'
            : `number-bridges-answer-input-${rowIndex}`;
        const questionTestId = rowIndex === 0
            ? 'number-bridges-question'
            : `number-bridges-question-${rowIndex}`;
        const tickTestId = rowIndex === 0
            ? 'number-bridges-local-tick'
            : `number-bridges-local-tick-${rowIndex}`;
        const rowClass = isMistake
            ? 'border-amber-300 bg-amber-50'
            : 'border-sky-100 bg-sky-50';
        const inputClass = isCorrect
            ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
            : isMistake
                ? 'border-amber-400 bg-amber-50 text-slate-950 shadow-[0_0_0_4px_rgba(251,191,36,0.28)]'
                : 'border-sky-200 bg-white text-slate-950';

        return `
            <div data-testid="number-bridges-row-${rowIndex}" class="grid min-h-[60px] grid-cols-[2rem_auto_6rem_2.5rem] items-center justify-center gap-2 rounded-2xl border-2 ${rowClass} px-3 py-1.5">
                <div class="text-base font-black text-sky-900">${question.questionIndex + 1})</div>
                <label data-testid="${questionTestId}" for="answer-input-${rowIndex}" class="text-left text-3xl font-black text-[#102a43] sm:text-4xl">${formatQuestion(question)} =</label>
                <input id="answer-input-${rowIndex}" data-testid="${inputTestId}" data-question-id="${questionId}" inputmode="numeric" type="number" value="${answerValue}" ${isCorrect ? 'disabled' : ''} class="min-h-[52px] w-full rounded-2xl border-4 ${inputClass} px-3 text-center text-3xl font-black focus:border-emerald-400 focus:outline-none disabled:opacity-100" autocomplete="off">
                <div data-testid="${tickTestId}" aria-label="Correct" class="${isCorrect ? 'flex' : 'invisible flex'} h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-2xl font-black text-white">&#10003;</div>
            </div>
        `;
    }

    function renderSupportText(state) {
        return renderNumberBridgeSupportText(state, learnerName);
    }

    function submitCurrentAnswer(questionId, answer, source = 'auto') {
        if (String(answer ?? '').trim() === '') {
            return;
        }

        const stateBefore = game.getState();
        const outcome = game.submitAnswer(answer, {
            questionId,
            reactionTimeMs: getReactionTime(stateBefore),
            timestamp: new Date().toISOString(),
            validationSource: source
        });

        if (outcome.result === 'duplicate' || outcome.result === 'ignored') {
            return;
        }

        render();

        if (outcome.result === 'success') {
            selectedQuestionId = null;
            if (game.getState().successPendingAdvance) {
                if (advanceTimer) clearTimeout(advanceTimer);
                startPageTurn();
                advanceTimer = setTimeout(() => {
                    game.advanceAfterCorrect();
                    const state = game.getState();
                    if (state.completed) {
                        submitSession(state);
                    }
                    render();
                }, getNumberBridgeTransitionDurationMs(prefersReducedMotion()));
            }
        } else if (outcome.result === 'mistake') {
            selectedQuestionId = questionId;
            window.setTimeout(() => {
                root.querySelector(`[data-question-id="${questionId}"]`)?.focus();
            }, 0);
        }
    }

    function focusNextInput() {
        const selectedInput = selectedQuestionId
            ? root.querySelector(`[data-question-id="${selectedQuestionId}"]:not(:disabled)`)
            : null;
        const input = selectedInput || root.querySelector('[data-question-id]:not(:disabled)');
        input?.focus();
    }

    function renderResults(state) {
        const summary = game.getResultSummary();
        applyWorksheetHeaderState({
            roundNumber: `${summary.total}/${summary.total}`,
            stars: state.stars,
            levelLabel: state.config.levelLabel
        });

        root.innerHTML = renderNumberBridgeResultMarkup(summary, learnerName);
        playCompletionCelebrationOnce(state);

        root.querySelector('[data-testid="number-bridges-next-round-button"]').addEventListener('click', () => {
            game.resetRound();
            completionCelebrationPlayed = false;
            render();
        });
        root.querySelector('[data-testid="number-bridges-home-button"]').addEventListener('click', () => {
            window.parent?.postMessage({ type: ACTIVITY_HOME_EVENT }, '*');
        });
    }

    function submitSession(state) {
        const summary = game.getResultSummary();
        window.parent?.postMessage({
            type: GAME_EVENTS.COMPLETE,
            payload: createKumonSessionSummary(state, summary)
        }, '*');
    }

    function startPageTurn() {
        const layout = root.querySelector('[data-testid="number-bridges-layout"]');
        if (!layout || prefersReducedMotion()) return;
        layout.classList.add('number-bridges-page-turn');
    }

    function prefersReducedMotion() {
        return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    }

    function playCompletionCelebrationOnce(state) {
        const celebrationState = {
            completed: state.completed,
            completionCelebrationPlayed
        };
        if (!shouldPlayNumberBridgeCompletionClap(celebrationState)) return;

        playNumberBridgeCompletionClap();
        completionCelebrationPlayed = markNumberBridgeCompletionClapPlayed(celebrationState).completionCelebrationPlayed;
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

function roundToOneDecimal(value) {
    return Math.round(value * 10) / 10;
}

function formatLearnerAnswer(answer) {
    return Number.isNaN(answer) ? 'No answer' : String(answer);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', mountKumonQuiz);
}
