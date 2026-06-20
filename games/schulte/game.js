export const SCHULTE_ACTIVITY_ID = 'schulte-v1';
export const SCHULTE_CORE_GRID_SIZE = 3;
export const SCHULTE_CORE_CELL_COUNT = SCHULTE_CORE_GRID_SIZE * SCHULTE_CORE_GRID_SIZE;
export const SCHULTE_ASCENDING_MODE = 'ascending';
export const SCHULTE_DESCENDING_MODE = 'descending';
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

function createSchulteOrderedSession(config = {}) {
    const mode = config.mode === SCHULTE_DESCENDING_MODE ? SCHULTE_DESCENDING_MODE : SCHULTE_ASCENDING_MODE;
    const boards = createOrderedSessionBoards(config);
    const emitFeedback = createFeedbackEmitter(config);
    let currentBoardEngine = createSchulteCoreGridEngine({ board: boards[0] });
    const state = {
        mode,
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
        transientPulseCellId: null,
        feedbackText: 'Find 1'
    };
    let session = createVisibleSchulteSession(pageState.mode, handleFeedback);
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
            pageState.feedbackText = `Find ${event.expectedNumber}`;
        } else if (event.type === SCHULTE_FEEDBACK.SUCCESS) {
            pageState.feedbackText = 'Perfect board!';
        } else if (event.type === SCHULTE_FEEDBACK.CELEBRATION) {
            pageState.feedbackText = event.scope === 'session'
                ? 'Great work!'
                : 'Next board';
        } else if (event.type === SCHULTE_FEEDBACK.CLICK) {
            pageState.feedbackText = `Find ${session.getState().expectedNumber}`;
        }
    }

    function render() {
        const state = session.getState();
        root.innerHTML = `
            <section data-testid="schulte-activity" class="flex h-full min-h-0 flex-col gap-3">
                <div class="flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-cyan-200 bg-white px-4 py-3 shadow-sm">
                    <div>
                        <p class="text-xs font-black uppercase tracking-[0.14em] text-cyan-700">Grid Vision</p>
                        <h2 class="text-xl font-black text-slate-950">Find the numbers in order, ${pageState.learnerName}</h2>
                    </div>
                    <div class="flex gap-2 text-sm font-black text-slate-800">
                        <span data-testid="schulte-board-counter" class="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5">Board ${state.boardNumber} / ${state.boardCount}</span>
                        <span data-testid="schulte-target" class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">Find ${state.expectedNumber}</span>
                    </div>
                </div>

                <div data-testid="schulte-mode-controls" class="grid shrink-0 grid-cols-2 gap-2 rounded-xl border border-cyan-200 bg-cyan-50 p-1">
                    ${renderModeButton(SCHULTE_ASCENDING_MODE, 'Ascending')}
                    ${renderModeButton(SCHULTE_DESCENDING_MODE, 'Descending')}
                </div>

                <div data-testid="schulte-feedback" class="min-h-[40px] rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-center text-base font-black text-amber-900">
                    ${pageState.feedbackText}
                </div>

                <div data-testid="schulte-grid" class="grid flex-1 min-h-0 gap-2" style="grid-template-columns: repeat(${state.currentBoard.gridSize}, minmax(0, 1fr));">
                    ${state.currentBoard.cells.map(cell => renderCell(cell, state.completed)).join('')}
                </div>

                ${state.completed ? `
                    <div data-testid="schulte-completion" class="rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-center text-xl font-black text-emerald-900">
                        Great work! You finished Grid Vision.
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
                render();
            });
        });

        root.querySelectorAll('[data-schulte-mode]').forEach(button => {
            button.addEventListener('click', () => {
                setMode(button.getAttribute('data-schulte-mode'));
            });
        });
    }

    function setMode(mode) {
        const nextMode = mode === SCHULTE_DESCENDING_MODE ? SCHULTE_DESCENDING_MODE : SCHULTE_ASCENDING_MODE;
        if (nextMode === pageState.mode) return;

        pageState.mode = nextMode;
        pageState.transientPulseCellId = null;
        session = createVisibleSchulteSession(pageState.mode, handleFeedback);
        pageState.feedbackText = `Find ${session.getState().expectedNumber}`;
        render();
    }

    function renderModeButton(mode, label) {
        const isActive = pageState.mode === mode;
        const activeClass = isActive
            ? 'border-cyan-600 bg-white text-cyan-950 shadow-sm'
            : 'border-transparent bg-transparent text-cyan-800';

        return `
            <button
                type="button"
                data-testid="schulte-mode-${mode}"
                data-schulte-mode="${mode}"
                aria-pressed="${isActive ? 'true' : 'false'}"
                class="min-h-[44px] rounded-lg border-2 ${activeClass} px-3 py-2 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-cyan-300">
                ${label}
            </button>
        `;
    }

    function renderCell(cell, sessionComplete) {
        const isPulse = pageState.transientPulseCellId === cell.cellId;
        const selectedClass = cell.selected
            ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
            : 'border-cyan-200 bg-white text-slate-950';
        const pulseClass = isPulse
            ? 'border-orange-400 bg-orange-50 text-orange-950 ring-4 ring-orange-200'
            : selectedClass;

        return `
            <button
                type="button"
                data-testid="${cell.cellId}"
                data-schulte-cell-id="${cell.cellId}"
                data-schulte-number="${cell.value}"
                ${sessionComplete || cell.selected ? 'disabled' : ''}
                class="min-h-[72px] rounded-xl border-4 ${pulseClass} text-3xl font-black shadow-sm transition focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-100"
                aria-label="Schulte number ${cell.value}">
                ${cell.value}
            </button>
        `;
    }
}

function normalizeLearnerName(learnerName) {
    const trimmed = String(learnerName || 'Learner').trim();
    return trimmed || 'Learner';
}

function createVisibleSchulteSession(mode, onFeedback) {
    const config = { onFeedback };
    return mode === SCHULTE_DESCENDING_MODE
        ? createSchulteDescendingSession(config)
        : createSchulteAscendingSession(config);
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
