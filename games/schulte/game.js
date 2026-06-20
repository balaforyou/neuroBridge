export const SCHULTE_ACTIVITY_ID = 'schulte-v1';
export const SCHULTE_CORE_GRID_SIZE = 3;
export const SCHULTE_CORE_CELL_COUNT = SCHULTE_CORE_GRID_SIZE * SCHULTE_CORE_GRID_SIZE;
export const SCHULTE_ASCENDING_MODE = 'ascending';
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
    const boards = createAscendingSessionBoards(config);
    const emitFeedback = createFeedbackEmitter(config);
    let currentBoardEngine = createSchulteCoreGridEngine({ board: boards[0] });
    const state = {
        mode: SCHULTE_ASCENDING_MODE,
        boardCount: SCHULTE_ASCENDING_BOARD_COUNT,
        currentBoardIndex: 0,
        completedBoards: 0,
        expectedNumber: 1,
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
                reason: 'ascending-order',
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
            state.expectedNumber += 1;
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
        state.expectedNumber = 1;
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

function createAscendingSessionBoards(config) {
    if (Array.isArray(config.boards) && config.boards.length >= SCHULTE_ASCENDING_BOARD_COUNT) {
        return config.boards.slice(0, SCHULTE_ASCENDING_BOARD_COUNT).map(cloneBoard);
    }

    return Array.from({ length: SCHULTE_ASCENDING_BOARD_COUNT }, () => createSchulteBoard(config));
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
