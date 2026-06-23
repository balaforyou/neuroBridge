import {
    createWorksheetShell,
    WORKSHEET_TEMPLATE_TYPES
} from '../../js/worksheetShell.js';
import {
    applyWorksheetHeaderState,
    normalizeWorksheetLearnerName,
    renderWorksheetResultSummary
} from '../../js/worksheetTemplate.js';
import { GAME_EVENTS } from '../../js/constants.js';

export const PATTERN_MEMORY_GAME_ID = 'patternMemory';
export const PATTERN_MEMORY_ACTIVITY_ID = 'pm-001-copy-mode';
export const PATTERN_MEMORY_ACTIVITY_NAME = 'Pattern Memory';
export const PATTERN_MEMORY_MODE_COPY = 'copy';
export const PATTERN_MEMORY_QUESTION_COUNT = 10;
export const PATTERN_MEMORY_SUCCESS_ADVANCE_DELAY_MS = 1300;

const ACTIVITY_HOME_EVENT = 'SIRAASH_ACTIVITY_HOME';
const BLUE = 'blue';

export const COPY_LEVELS = [
    { id: 'C1', gridSize: 2, colorCount: 1, filledCells: 1 },
    { id: 'C2', gridSize: 2, colorCount: 1, filledCells: 2 },
    { id: 'C3', gridSize: 3, colorCount: 1, filledCells: 1 },
    { id: 'C4', gridSize: 3, colorCount: 1, filledCells: 2 }
];

export function createPatternMemoryQuestions(config = {}) {
    const random = typeof config.random === 'function' ? config.random : Math.random;
    const questionCount = normalizeQuestionCount(config.questionCount, PATTERN_MEMORY_QUESTION_COUNT);
    const levels = Array.isArray(config.levels) && config.levels.length ? config.levels : COPY_LEVELS;

    return Array.from({ length: questionCount }, (_, index) => {
        const level = levels[index % levels.length];
        return createPatternQuestion(level, index, random);
    });
}

export function createPatternMemoryCopyGame(config = {}) {
    const questions = Array.isArray(config.questions) && config.questions.length
        ? config.questions.map(cloneQuestion)
        : createPatternMemoryQuestions(config);
    const state = {
        questions,
        currentQuestionIndex: 0,
        selectedCells: [],
        correctAnswers: 0,
        mistakeCount: 0,
        completed: false,
        pendingAdvance: false,
        feedbackType: null,
        feedbackMessage: '',
        startedAtMs: normalizeTimestampMs(config.startedAtMs, Date.now()),
        learnerName: normalizeWorksheetLearnerName(config.learnerName || 'Adarsh'),
        trials: []
    };

    function getState() {
        return cloneState(state);
    }

    function getCurrentQuestion() {
        return cloneQuestion(state.questions[state.currentQuestionIndex]);
    }

    function toggleCell(cellIndex) {
        if (state.completed) {
            return { result: 'ignored', state: getState() };
        }

        if (state.pendingAdvance) {
            return { result: 'ignored', reason: 'pending-advance', state: getState() };
        }

        const question = state.questions[state.currentQuestionIndex];
        if (!question || !Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex >= question.gridSize * question.gridSize) {
            return { result: 'ignored', reason: 'unknown-cell', state: getState() };
        }

        if (state.selectedCells.includes(cellIndex)) {
            state.selectedCells = state.selectedCells.filter(index => index !== cellIndex);
        } else {
            state.selectedCells = [...state.selectedCells, cellIndex].sort((a, b) => a - b);
        }

        const hasIncorrectCells = state.selectedCells.some(index => !question.filledCells.includes(index));
        if (hasIncorrectCells) {
            state.mistakeCount += 1;
            state.feedbackType = 'retry';
            state.feedbackMessage = 'Try that spot again.';
            return { result: 'incorrect', state: getState() };
        }

        if (isSameCellSet(state.selectedCells, question.filledCells)) {
            state.correctAnswers += 1;
            state.pendingAdvance = true;
            state.feedbackType = 'success';
            state.feedbackMessage = 'Great work!';
            state.trials.push(createTrialRecord(question, true));
            return { result: 'correct', state: getState() };
        }

        state.feedbackType = null;
        state.feedbackMessage = '';
        return { result: 'incomplete', state: getState() };
    }

    function advanceAfterFeedback() {
        if (!state.pendingAdvance) {
            return { result: 'ignored', state: getState() };
        }

        state.pendingAdvance = false;
        state.feedbackType = null;
        state.feedbackMessage = '';
        state.selectedCells = [];

        if (state.currentQuestionIndex >= state.questions.length - 1) {
            state.completed = true;
            return { result: 'complete', state: getState() };
        }

        state.currentQuestionIndex += 1;
        return { result: 'advanced', state: getState() };
    }

    function getResultSummary(options = {}) {
        return createPatternMemoryResultSummary(getState(), options);
    }

    return {
        advanceAfterFeedback,
        getCurrentQuestion,
        getResultSummary,
        getState,
        toggleCell
    };
}

export function createPatternMemoryResultSummary(state = {}, options = {}) {
    const total = Array.isArray(state.questions) ? state.questions.length : PATTERN_MEMORY_QUESTION_COUNT;
    const correct = Number(state.correctAnswers || 0);
    const startedAtMs = normalizeTimestampMs(state.startedAtMs, Date.now());
    const endedAtMs = normalizeTimestampMs(options.endedAtMs ?? Date.now(), startedAtMs);
    const timeTakenSeconds = Math.max(1, Math.round((endedAtMs - startedAtMs) / 1000));
    const averageTimeSeconds = total ? Math.round((timeTakenSeconds / total) * 10) / 10 : 0;

    return {
        total,
        correct,
        accuracy: total ? Math.round((correct / total) * 100) : 0,
        timeTakenSeconds,
        averageTimeSeconds,
        hintsUsed: 0,
        mistakeCount: Number(state.mistakeCount || 0)
    };
}

export function createPatternMemorySessionSummary(state = {}, options = {}) {
    const resultSummary = createPatternMemoryResultSummary(state, options);
    const startedAtMs = normalizeTimestampMs(state.startedAtMs, Date.now());
    const questions = Array.isArray(state.questions) ? state.questions : [];
    const highestLevel = questions.reduce((highest, question) => {
        const levelNumber = Number(String(question.levelId || '').replace(/^C/, ''));
        return Number.isFinite(levelNumber) ? Math.max(highest, levelNumber) : highest;
    }, 1);

    return {
        gameId: PATTERN_MEMORY_GAME_ID,
        activityId: PATTERN_MEMORY_ACTIVITY_ID,
        activityName: PATTERN_MEMORY_ACTIVITY_NAME,
        mode: PATTERN_MEMORY_MODE_COPY,
        level: highestLevel,
        levelLabel: `C1-C${highestLevel}`,
        skillLabel: 'Pattern Reproduction',
        levelDisplayLabel: `Copy Mode / C1-C${highestLevel}`,
        score: resultSummary.correct,
        correctCount: resultSummary.correct,
        totalQuestions: resultSummary.total,
        accuracy: resultSummary.accuracy / 100,
        accuracyPercent: resultSummary.accuracy,
        averageReactionTimeMs: Math.round(resultSummary.averageTimeSeconds * 1000),
        averageTimePerQuestion: resultSummary.averageTimeSeconds,
        hintUsageCount: 0,
        mistakeCount: resultSummary.mistakeCount,
        highestLevelReached: highestLevel,
        sessionLengthSeconds: resultSummary.timeTakenSeconds,
        durationSeconds: resultSummary.timeTakenSeconds,
        sessionTimestamp: new Date(startedAtMs).toISOString(),
        completionStatus: 'completed',
        completed: state.completed === true,
        trials: Array.isArray(state.trials) ? state.trials.map(trial => ({ ...trial })) : []
    };
}

function mountPatternMemory() {
    const root = document.getElementById('pattern-memory-root');
    if (!root) return;

    const pageState = {
        learnerName: 'Adarsh',
        advanceTimer: null,
        completionSubmitted: false
    };
    let game = createPatternMemoryCopyGame({
        learnerName: pageState.learnerName
    });
    let shell = null;
    let activityContent = null;
    let questionContent = null;
    let completionPanel = null;

    window.addEventListener('message', (event) => {
        if (event.data?.type !== GAME_EVENTS.INIT) return;

        clearPendingAdvanceTimer();
        pageState.learnerName = normalizeWorksheetLearnerName(event.data.learnerName || 'Adarsh');
        pageState.completionSubmitted = false;
        game = createPatternMemoryCopyGame({
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
        activityContent.setAttribute('data-testid', 'pattern-memory-copy-mode');
        activityContent.className = 'flex min-h-0 flex-col px-1 py-2 sm:px-2';

        questionContent = document.createElement('div');
        questionContent.setAttribute('data-testid', 'pattern-memory-question');
        questionContent.className = 'flex min-h-0 flex-col';

        completionPanel = document.createElement('div');
        completionPanel.setAttribute('data-testid', 'pattern-memory-completion');
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
        stage.setAttribute('data-testid', 'pattern-memory-stage');
        stage.className = 'mx-auto flex w-full max-w-[900px] flex-col gap-3';

        const boardLayout = document.createElement('div');
        boardLayout.className = 'grid w-full grid-cols-1 items-start justify-items-center gap-3 md:grid-cols-2';
        boardLayout.setAttribute('data-testid', 'pattern-memory-grid-workspace');
        boardLayout.append(
            renderBoardPanel('Reference Pattern', question, question.filledCells, false),
            renderBoardPanel('Your Pattern', question, state.selectedCells, true)
        );

        const feedback = document.createElement('div');
        feedback.setAttribute('data-testid', 'pattern-memory-feedback');
        feedback.setAttribute('aria-live', 'polite');
        feedback.className = getFeedbackClass(state.feedbackType);
        if (state.feedbackType === 'success') {
            const check = document.createElement('span');
            check.setAttribute('data-testid', 'pattern-memory-success-check');
            check.className = 'mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xl font-black text-white';
            check.textContent = '\u2713';
            feedback.append(check, document.createTextNode(state.feedbackMessage));
        } else {
            feedback.textContent = state.feedbackMessage || 'Tap on the grid to fill or clear a cell.';
        }

        stage.append(boardLayout, feedback);
        questionContent.append(stage);
    }

    function renderBoardPanel(title, question, selectedCells, interactive) {
        const panel = document.createElement('section');
        panel.className = 'flex w-full max-w-[350px] flex-col justify-start rounded-2xl border-4 border-emerald-200 bg-white p-2.5 shadow-sm';
        panel.setAttribute('data-testid', interactive ? 'pattern-memory-target-panel' : 'pattern-memory-reference-panel');

        const heading = document.createElement('h3');
        heading.className = 'mb-2 text-center text-lg font-black text-slate-950';
        heading.textContent = title;

        const grid = document.createElement('div');
        grid.className = 'pattern-memory-grid mx-auto w-full max-w-[240px]';
        grid.style.gridTemplateColumns = `repeat(${question.gridSize}, minmax(0, 1fr))`;
        grid.setAttribute('data-testid', interactive ? 'pattern-memory-target-grid' : 'pattern-memory-reference-grid');
        grid.setAttribute('aria-label', title);

        const selectedSet = new Set(selectedCells);
        const totalCells = question.gridSize * question.gridSize;
        for (let index = 0; index < totalCells; index += 1) {
            const isBlue = selectedSet.has(index);
            const cell = document.createElement(interactive ? 'button' : 'div');
            cell.className = getCellClass(isBlue, interactive);
            cell.setAttribute('data-testid', `${interactive ? 'pattern-memory-target-cell' : 'pattern-memory-reference-cell'}-${index}`);
            cell.setAttribute('aria-label', `${title} row ${Math.floor(index / question.gridSize) + 1} column ${(index % question.gridSize) + 1}${isBlue ? ', blue' : ', empty'}`);

            if (interactive) {
                cell.type = 'button';
                cell.disabled = game.getState().pendingAdvance;
                cell.setAttribute('aria-pressed', String(isBlue));
                cell.addEventListener('click', () => handleCellToggle(index));
            } else {
                cell.setAttribute('role', 'img');
            }

            const marker = document.createElement('span');
            marker.className = isBlue ? 'text-sm font-black text-white' : 'sr-only';
            marker.textContent = isBlue ? 'Blue' : 'Empty';
            cell.appendChild(marker);
            grid.appendChild(cell);
        }

        panel.append(heading, grid);
        return panel;
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
        completionPanel.innerHTML = renderPatternMemoryResultMarkup(
            game.getResultSummary(),
            pageState.learnerName
        );

        const tryAgainButton = completionPanel.querySelector('[data-testid="pattern-memory-next-round-button"]');
        if (tryAgainButton) {
            tryAgainButton.addEventListener('click', restartSession);
        }

        const resultHomeButton = completionPanel.querySelector('[data-testid="pattern-memory-home-button"]');
        if (resultHomeButton) {
            resultHomeButton.addEventListener('click', () => {
                window.parent?.postMessage({ type: ACTIVITY_HOME_EVENT }, '*');
            });
        }
    }

    function handleCellToggle(cellIndex) {
        const outcome = game.toggleCell(cellIndex);
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
            }, PATTERN_MEMORY_SUCCESS_ADVANCE_DELAY_MS);
        }
    }

    function restartSession() {
        clearPendingAdvanceTimer();
        pageState.completionSubmitted = false;
        game = createPatternMemoryCopyGame({
            learnerName: pageState.learnerName
        });
        updateHeader();
        renderQuestion();
        renderCompletion();
    }

    function submitCompletionIfNeeded() {
        if (pageState.completionSubmitted) return;

        pageState.completionSubmitted = true;
        try {
            window.parent?.postMessage({
                type: GAME_EVENTS.COMPLETE,
                payload: createPatternMemorySessionSummary(game.getState())
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
        const currentQuestion = state.currentQuestion || state.questions[state.questions.length - 1];
        applyWorksheetHeaderState({
            roundNumber: Math.min(state.currentQuestionIndex + 1, state.questions.length),
            stars: state.correctAnswers,
            levelLabel: currentQuestion?.levelId || 'C1'
        });
    }

    shell = createWorksheetShell({
        templateType: WORKSHEET_TEMPLATE_TYPES.PATTERN_BUILDER,
        title: PATTERN_MEMORY_ACTIVITY_NAME,
        instruction: 'Copy the blue pattern into your grid.',
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
            activityId: PATTERN_MEMORY_ACTIVITY_ID,
            domain: 'Memory',
            skill: 'Pattern Reproduction'
        }
    });

    shell.classList.add('pattern-memory-shell', 'h-full');
    root.innerHTML = '';
    root.appendChild(shell);
    updateHeader();
}

export function renderPatternMemoryResultMarkup(summary, learnerName = 'Learner') {
    return renderWorksheetResultSummary({
        learnerName,
        summary,
        testIdPrefix: 'pattern-memory',
        completionMessage: 'You copied the patterns.',
        levelLabel: 'Copy Mode C1-C4',
        nextActionLabel: 'Try Again',
        homeActionLabel: 'Home'
    });
}

function createPatternQuestion(level, index, random) {
    return {
        id: `pm-copy-${index + 1}-${level.id}`,
        mode: PATTERN_MEMORY_MODE_COPY,
        levelId: level.id,
        gridSize: level.gridSize,
        colors: [BLUE],
        filledCells: chooseFilledCells(level.gridSize * level.gridSize, level.filledCells, random),
        filledCellCount: level.filledCells
    };
}

function chooseFilledCells(cellCount, filledCellCount, random) {
    const cells = Array.from({ length: cellCount }, (_, index) => index);

    for (let index = cells.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [cells[index], cells[swapIndex]] = [cells[swapIndex], cells[index]];
    }

    return cells.slice(0, filledCellCount).sort((a, b) => a - b);
}

function createTrialRecord(question, isCorrect) {
    return {
        activity: PATTERN_MEMORY_ACTIVITY_ID,
        mode: PATTERN_MEMORY_MODE_COPY,
        level: question.levelId,
        correct: isCorrect,
        isCorrect,
        accuracy: isCorrect ? 1 : 0,
        gridSize: question.gridSize,
        filledCells: question.filledCells.length,
        colors: question.colors.slice()
    };
}

function cloneQuestion(question) {
    return {
        ...question,
        colors: question.colors.slice(),
        filledCells: question.filledCells.slice()
    };
}

function cloneState(state) {
    return {
        ...state,
        questions: state.questions.map(cloneQuestion),
        currentQuestion: cloneQuestion(state.questions[state.currentQuestionIndex]),
        selectedCells: state.selectedCells.slice(),
        trials: state.trials.map(trial => ({ ...trial, colors: trial.colors.slice() }))
    };
}

function isSameCellSet(firstCells, secondCells) {
    if (firstCells.length !== secondCells.length) return false;

    const first = firstCells.slice().sort((a, b) => a - b);
    const second = secondCells.slice().sort((a, b) => a - b);
    return first.every((cell, index) => cell === second[index]);
}

function normalizeQuestionCount(questionCount, fallback) {
    const count = Number(questionCount || fallback);
    if (!Number.isFinite(count) || count <= 0) {
        return fallback;
    }

    return Math.round(count);
}

function normalizeTimestampMs(value, fallback) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) {
        return number;
    }

    return fallback;
}

function getCellClass(isBlue, interactive) {
    const base = 'pattern-memory-cell flex items-center justify-center rounded-2xl border-4 text-center shadow-sm transition';
    const stateClass = isBlue
        ? 'pattern-memory-cell--blue border-blue-700 ring-2 ring-blue-200'
        : 'border-sky-200 bg-white';
    const interactionClass = interactive
        ? 'focus:outline-none focus:ring-4 focus:ring-emerald-300 active:scale-[0.98]'
        : '';

    return `${base} ${stateClass} ${interactionClass}`;
}

function getFeedbackClass(feedbackType) {
    const base = 'flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2 text-center text-lg font-black';
    if (feedbackType === 'success') {
        return `${base} border-emerald-300 bg-emerald-50 text-emerald-900`;
    }

    if (feedbackType === 'retry') {
        return `${base} border-amber-300 bg-amber-50 text-amber-900`;
    }

    return `${base} border-transparent text-slate-700`;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', mountPatternMemory);
}
