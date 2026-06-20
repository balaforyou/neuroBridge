export const SCHULTE_ACTIVITY_ID = 'schulte-v1';
export const SCHULTE_CORE_GRID_SIZE = 3;
export const SCHULTE_CORE_CELL_COUNT = SCHULTE_CORE_GRID_SIZE * SCHULTE_CORE_GRID_SIZE;
export const SCHULTE_ASCENDING_MODE = 'ascending';
export const SCHULTE_DESCENDING_MODE = 'descending';
export const SCHULTE_LISTEN_FIND_MODE = 'listen-find';
export const SCHULTE_MEMORY_MODE = 'memory';
export const SCHULTE_ASCENDING_BOARD_COUNT = 2;
export const SCHULTE_FEEDBACK = {
    CLICK: 'click',
    ORANGE_PULSE: 'orange-pulse',
    SUCCESS: 'success',
    CELEBRATION: 'celebration'
};

export function createSchulteNumberSet(gridSize = SCHULTE_CORE_GRID_SIZE) {
    const normalizedGridSize = normalizeSchulteGridSize(gridSize);
    return Array.from({ length: normalizedGridSize * normalizedGridSize }, (_, index) => index + 1);
}

export function createSchulteBoard(config = {}) {
    const gridSize = normalizeSchulteGridSize(config.gridSize);
    const random = typeof config.random === 'function' ? config.random : Math.random;
    const numbers = shuffleNumbers(createSchulteNumberSet(gridSize), random);

    return {
        gridSize,
        cellCount: numbers.length,
        cells: numbers.map((value, index) => ({
            cellId: `schulte-cell-${index + 1}`,
            value,
            row: Math.floor(index / gridSize),
            column: index % gridSize,
            selected: false
        }))
    };
}

export function createSchulteCoreGridEngine(config = {}) {
    const state = {
        board: cloneBoard(config.board || createSchulteBoard(config)),
        selectedCount: 0,
        completed: false,
        lastSelection: null,
        lastResult: null
    };

    function getState() {
        return cloneState(state);
    }

    function getCell(cellId) {
        return state.board.cells.find(cell => cell.cellId === cellId) || null;
    }

    function selectCell(cellId) {
        if (state.completed) {
            state.lastResult = 'ignored';
            state.lastSelection = null;
            return { result: 'ignored', reason: 'complete', state: getState() };
        }

        const cell = getCell(cellId);
        if (!cell) {
            state.lastResult = 'invalid';
            state.lastSelection = null;
            return { result: 'invalid', reason: 'unknown-cell', state: getState() };
        }

        if (cell.selected) {
            state.lastResult = 'ignored';
            state.lastSelection = cloneCell(cell);
            return { result: 'ignored', reason: 'already-selected', cell: cloneCell(cell), state: getState() };
        }

        cell.selected = true;
        state.selectedCount += 1;
        state.completed = state.selectedCount === state.board.cellCount;
        state.lastResult = state.completed ? 'complete' : 'selected';
        state.lastSelection = cloneCell(cell);

        return {
            result: state.lastResult,
            cell: cloneCell(cell),
            state: getState()
        };
    }

    function isComplete() {
        return state.completed;
    }

    return {
        getState,
        isComplete,
        selectCell
    };
}

export function createSchulteAscendingSession(config = {}) {
    return createSchulteOrderedSession({
        ...config,
        mode: SCHULTE_ASCENDING_MODE
    });
}

export function createSchulteDescendingSession(config = {}) {
    return createSchulteOrderedSession({
        ...config,
        mode: SCHULTE_DESCENDING_MODE
    });
}

export function createSchulteListenFindSession(config = {}) {
    return createSchulteOrderedSession({
        ...config,
        mode: SCHULTE_LISTEN_FIND_MODE
    });
}

function createSchulteOrderedSession(config = {}) {
    const mode = normalizeSchulteMode(config.mode);
    const memoryMode = config.memoryMode === true;
    const boards = createOrderedSessionBoards(config);
    const emitFeedback = createFeedbackEmitter(config);
    let currentBoardEngine = createSchulteCoreGridEngine({ board: boards[0] });
    const state = {
        mode,
        memoryMode,
        boardCount: SCHULTE_ASCENDING_BOARD_COUNT,
        currentBoardIndex: 0,
        completedBoards: 0,
        expectedNumber: getInitialExpectedNumber(mode),
        currentBoardMistakes: 0,
        completed: false,
        lastResult: null,
        lastSelection: null,
        feedbackState: null,
        feedbackEvents: []
    };

    function getState() {
        const currentBoardState = currentBoardEngine.getState();

        return {
            ...state,
            boardNumber: state.currentBoardIndex + 1,
            currentBoard: currentBoardState.board,
            boards: boards.map(cloneBoard),
            lastSelection: state.lastSelection ? cloneCell(state.lastSelection) : null,
            feedbackState: cloneFeedbackState(state.feedbackState),
            feedbackEvents: state.feedbackEvents.map(cloneFeedbackState)
        };
    }

    function getCurrentCell(cellId) {
        return currentBoardEngine.getState().board.cells.find(cell => cell.cellId === cellId) || null;
    }

    function selectCell(cellId) {
        if (state.completed) {
            state.lastResult = 'ignored';
            state.lastSelection = null;
            state.feedbackState = null;
            return { result: 'ignored', reason: 'session-complete', state: getState() };
        }

        const cell = getCurrentCell(cellId);
        if (!cell) {
            state.lastResult = 'invalid';
            state.lastSelection = null;
            state.feedbackState = null;
            return { result: 'invalid', reason: 'unknown-cell', state: getState() };
        }

        if (cell.selected) {
            state.lastResult = 'ignored';
            state.lastSelection = cloneCell(cell);
            state.feedbackState = null;
            return { result: 'ignored', reason: 'already-selected', cell: cloneCell(cell), state: getState() };
        }

        if (cell.value !== state.expectedNumber) {
            state.lastResult = 'incorrect';
            state.lastSelection = cloneCell(cell);
            state.currentBoardMistakes += 1;
            recordFeedback({
                type: SCHULTE_FEEDBACK.ORANGE_PULSE,
                cellId: cell.cellId,
                value: cell.value,
                expectedNumber: state.expectedNumber
            });
            return {
                result: 'incorrect',
                reason: getOrderReason(mode),
                expectedNumber: state.expectedNumber,
                cell: cloneCell(cell),
                state: getState()
            };
        }

        const selection = currentBoardEngine.selectCell(cellId);
        boards[state.currentBoardIndex] = selection.state.board;
        state.lastSelection = cloneCell(selection.cell);
        recordFeedback({
            type: SCHULTE_FEEDBACK.CLICK,
            cellId: selection.cell.cellId,
            value: selection.cell.value
        });

        if (selection.result !== 'complete') {
            state.expectedNumber = getNextExpectedNumber(mode, state.expectedNumber);
            state.lastResult = 'selected';
            return { result: 'selected', cell: cloneCell(selection.cell), state: getState() };
        }

        state.completedBoards += 1;
        const boardWasPerfect = state.currentBoardMistakes === 0;

        if (state.completedBoards === SCHULTE_ASCENDING_BOARD_COUNT) {
            state.completed = true;
            state.lastResult = 'session-complete';
            if (boardWasPerfect) {
                recordFeedback({
                    type: SCHULTE_FEEDBACK.SUCCESS,
                    boardNumber: state.currentBoardIndex + 1
                });
            }
            recordFeedback({
                type: SCHULTE_FEEDBACK.CELEBRATION,
                scope: 'session',
                boardNumber: state.currentBoardIndex + 1
            });
            return { result: 'session-complete', cell: cloneCell(selection.cell), state: getState() };
        }

        if (boardWasPerfect) {
            recordFeedback({
                type: SCHULTE_FEEDBACK.SUCCESS,
                boardNumber: state.currentBoardIndex + 1
            });
        }
        recordFeedback({
            type: SCHULTE_FEEDBACK.CELEBRATION,
            scope: 'board',
            boardNumber: state.currentBoardIndex + 1
        });
        state.currentBoardIndex += 1;
        state.expectedNumber = getInitialExpectedNumber(mode);
        state.currentBoardMistakes = 0;
        currentBoardEngine = createSchulteCoreGridEngine({ board: boards[state.currentBoardIndex] });
        state.lastResult = 'board-complete';

        return { result: 'board-complete', cell: cloneCell(selection.cell), state: getState() };
    }

    function isComplete() {
        return state.completed;
    }

    return {
        getState,
        isComplete,
        selectCell
    };

    function recordFeedback(event) {
        state.feedbackState = { ...event };
        state.feedbackEvents.push({ ...event });
        emitFeedback(event);
    }
}

export function renderSchulteGridMarkup(stateOrBoard) {
    const board = stateOrBoard?.board || stateOrBoard;
    const gridSize = normalizeSchulteGridSize(board?.gridSize);
    const cells = Array.isArray(board?.cells) ? board.cells : [];

    return `
        <div data-testid="schulte-grid" class="grid gap-2" style="grid-template-columns: repeat(${gridSize}, minmax(0, 1fr));">
            ${cells.map(cell => `
                <button
                    type="button"
                    data-testid="${cell.cellId}"
                    data-schulte-cell-id="${cell.cellId}"
                    data-schulte-number="${cell.value}"
                    aria-label="Schulte number ${cell.value}"
                    class="min-h-[72px] rounded-xl border-2 border-sky-200 bg-white text-3xl font-black text-slate-950"
                >${cell.value}</button>
            `).join('')}
        </div>
    `;
}

function mountSchulteActivity() {
    const root = document.getElementById('schulte-root');
    if (!root) return;

    const pageState = {
        learnerName: 'Learner',
        mode: SCHULTE_ASCENDING_MODE,
        memoryMode: true,
        awaitingTransitionStart: false,
        transitionTargetMode: null,
        transientPulseCellId: null
    };
    let session = createVisibleSchulteSession(pageState.mode, pageState.memoryMode, handleFeedback);
    const homeButton = document.getElementById('home-button');

    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.parent?.postMessage({ type: 'SIRAASH_ACTIVITY_HOME' }, '*');
        });
    }

    window.addEventListener('message', (event) => {
        if (event.data?.type !== 'INITIALIZE_GAME_RULES') return;
        pageState.learnerName = normalizeLearnerName(event.data.learnerName);
        render();
    });

    render();

    function handleFeedback(event) {
        if (event.type === SCHULTE_FEEDBACK.ORANGE_PULSE) {
            pageState.transientPulseCellId = event.cellId;
        }
    }

    function render() {
        const state = session.getState();
        const showTransition = pageState.awaitingTransitionStart;
        root.innerHTML = `
            <section data-testid="schulte-activity" class="flex h-full min-h-0 flex-col gap-3">
                <div class="flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-cyan-200 bg-white px-4 py-3 shadow-sm">
                    <div>
                        <p class="text-xs font-black uppercase tracking-[0.14em] text-cyan-700">Grid Vision</p>
                        <h2 class="text-xl font-black text-slate-950">Schulte Table</h2>
                    </div>
                    <div class="flex gap-2 text-sm font-black text-slate-800">
                        <span data-testid="schulte-mode-label" class="rounded-full border border-cyan-200 bg-white px-3 py-1.5">Mode: ${getModeLabel(pageState.mode)}</span>
                        <span data-testid="schulte-board-counter" class="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5">Board ${state.boardNumber} / ${state.boardCount}</span>
                    </div>
                </div>

                ${renderActivePrompt(state, showTransition)}

                ${showTransition ? renderModeTransition() : `
                    <div data-testid="schulte-grid" class="grid flex-1 min-h-0 gap-2" style="grid-template-columns: repeat(${state.currentBoard.gridSize}, minmax(0, 1fr));">
                        ${state.currentBoard.cells.map(cell => renderCell(cell, state.completed, state.memoryMode)).join('')}
                    </div>
                `}

                ${state.completed && !showTransition ? `
                    <div data-testid="schulte-completion" class="rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-center text-xl font-black text-emerald-900">
                        Great work! You finished Schulte Table.
                    </div>
                ` : ''}
            </section>
        `;

        root.querySelectorAll('[data-schulte-cell-id]').forEach(button => {
            button.addEventListener('click', () => {
                const outcome = session.selectCell(button.getAttribute('data-schulte-cell-id'));
                pageState.transientPulseCellId = outcome.result === 'incorrect'
                    ? outcome.cell.cellId
                    : null;
                prepareModeTransitionIfNeeded(outcome);
                render();
            });
        });

        root.querySelector('[data-schulte-start-next-mode]')?.addEventListener('click', () => {
            startNextMode();
            render();
        });
    }

    function prepareModeTransitionIfNeeded(outcome) {
        if (outcome.result !== 'session-complete') {
            return;
        }

        if (pageState.mode === SCHULTE_ASCENDING_MODE) {
            pageState.transitionTargetMode = SCHULTE_DESCENDING_MODE;
            pageState.awaitingTransitionStart = true;
            pageState.transientPulseCellId = null;
            return;
        }

        if (pageState.mode === SCHULTE_DESCENDING_MODE) {
            pageState.transitionTargetMode = SCHULTE_LISTEN_FIND_MODE;
            pageState.awaitingTransitionStart = true;
            pageState.transientPulseCellId = null;
            return;
        }

        pageState.transientPulseCellId = null;
    }

    function startNextMode() {
        pageState.mode = pageState.transitionTargetMode || SCHULTE_DESCENDING_MODE;
        pageState.awaitingTransitionStart = false;
        pageState.transitionTargetMode = null;
        pageState.transientPulseCellId = null;
        session = createVisibleSchulteSession(pageState.mode, pageState.memoryMode, handleFeedback);
    }

    function renderActivePrompt(state, showTransition) {
        if (showTransition || state.completed) {
            return '';
        }

        return `
            <div data-testid="schulte-target" class="min-h-[40px] rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-center text-base font-black text-amber-900">
                Find ${state.expectedNumber}
            </div>
        `;
    }

    function renderModeTransition() {
        const transitionCopy = getTransitionCopy(pageState.transitionTargetMode);

        return `
            <div data-testid="schulte-descending-transition" class="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-5 py-6 text-center text-slate-950">
                <div>
                    <p class="text-2xl font-black text-emerald-900">${transitionCopy.title}</p>
                    <p class="mt-2 text-lg font-black text-slate-800">${transitionCopy.body}</p>
                </div>
                <button
                    type="button"
                    data-schulte-start-next-mode
                    data-testid="schulte-start-next-mode"
                    class="min-h-[48px] rounded-xl bg-emerald-700 px-5 py-2 text-base font-black text-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-emerald-300">
                    Continue
                </button>
            </div>
        `;
    }

    function renderCell(cell, sessionComplete, memoryMode) {
        const isPulse = pageState.transientPulseCellId === cell.cellId;
        const selectedClass = cell.selected
            ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
            : 'border-cyan-200 bg-white text-slate-950';
        const pulseClass = isPulse
            ? 'border-orange-400 bg-orange-50 text-orange-950 ring-4 ring-orange-200'
            : memoryMode ? 'border-cyan-200 bg-white text-slate-950' : selectedClass;
        const disabled = sessionComplete || (!memoryMode && cell.selected);

        return `
            <button
                type="button"
                data-testid="${cell.cellId}"
                data-schulte-cell-id="${cell.cellId}"
                data-schulte-number="${cell.value}"
                data-schulte-memory-mode="${memoryMode ? 'true' : 'false'}"
                ${disabled ? 'disabled' : ''}
                class="min-h-[72px] rounded-xl border-4 ${pulseClass} text-3xl font-black shadow-sm transition focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-100"
                aria-label="Schulte number ${cell.value}">
                ${cell.value}
            </button>
        `;
    }
}

function getModeLabel(mode) {
    if (mode === SCHULTE_DESCENDING_MODE) return 'Descending';
    if (mode === SCHULTE_LISTEN_FIND_MODE) return 'Listen & Find';
    return 'Ascending';
}

function normalizeLearnerName(learnerName) {
    const trimmed = String(learnerName || 'Learner').trim();
    return trimmed || 'Learner';
}

function createVisibleSchulteSession(mode, memoryMode, onFeedback) {
    const config = { memoryMode, onFeedback };
    if (mode === SCHULTE_DESCENDING_MODE) {
        return createSchulteDescendingSession(config);
    }

    if (mode === SCHULTE_LISTEN_FIND_MODE) {
        return createSchulteListenFindSession(config);
    }

    return createSchulteAscendingSession(config);
}

function getTransitionCopy(targetMode) {
    if (targetMode === SCHULTE_LISTEN_FIND_MODE) {
        return {
            title: 'Great work! Now let\'s listen and find.',
            body: 'Follow the ordered prompts from 1 to 9.'
        };
    }

    return {
        title: 'Great work! Now let\'s try descending.',
        body: 'Start from 9 and go backwards.'
    };
}

function createOrderedSessionBoards(config) {
    if (Array.isArray(config.boards) && config.boards.length >= SCHULTE_ASCENDING_BOARD_COUNT) {
        return config.boards.slice(0, SCHULTE_ASCENDING_BOARD_COUNT).map(cloneBoard);
    }

    return Array.from({ length: SCHULTE_ASCENDING_BOARD_COUNT }, () => createSchulteBoard(config));
}

function getInitialExpectedNumber(mode) {
    return mode === SCHULTE_DESCENDING_MODE ? SCHULTE_CORE_CELL_COUNT : 1;
}

function getNextExpectedNumber(mode, currentValue) {
    return mode === SCHULTE_DESCENDING_MODE ? currentValue - 1 : currentValue + 1;
}

function getOrderReason(mode) {
    return mode === SCHULTE_DESCENDING_MODE ? 'descending-order' : 'ascending-order';
}

function normalizeSchulteMode(mode) {
    if (mode === SCHULTE_DESCENDING_MODE) return SCHULTE_DESCENDING_MODE;
    if (mode === SCHULTE_LISTEN_FIND_MODE) return SCHULTE_LISTEN_FIND_MODE;
    return SCHULTE_ASCENDING_MODE;
}

function createFeedbackEmitter(config) {
    const handlerMap = config.feedbackHooks || {};
    const onFeedback = typeof config.onFeedback === 'function' ? config.onFeedback : null;

    return (event) => {
        if (onFeedback) {
            onFeedback({ ...event });
        }

        const handler = handlerMap[event.type];
        if (typeof handler === 'function') {
            handler({ ...event });
        }
    };
}

function normalizeSchulteGridSize(gridSize = SCHULTE_CORE_GRID_SIZE) {
    return gridSize === SCHULTE_CORE_GRID_SIZE ? SCHULTE_CORE_GRID_SIZE : SCHULTE_CORE_GRID_SIZE;
}

function shuffleNumbers(numbers, random) {
    const shuffled = numbers.slice();

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
}

function cloneCell(cell) {
    return { ...cell };
}

function cloneBoard(board) {
    return {
        ...board,
        cells: board.cells.map(cloneCell)
    };
}

function cloneState(state) {
    return {
        ...state,
        board: cloneBoard(state.board),
        lastSelection: state.lastSelection ? cloneCell(state.lastSelection) : null
    };
}

function cloneFeedbackState(feedbackState) {
    return feedbackState ? { ...feedbackState } : null;
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountSchulteActivity);
    } else {
        mountSchulteActivity();
    }
}
