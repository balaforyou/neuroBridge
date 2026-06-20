import {
    createSchulteAscendingSession,
    createSchulteBoard,
    createSchulteCoreGridEngine,
    createSchulteNumberSet,
    renderSchulteGridMarkup,
    SCHULTE_ASCENDING_BOARD_COUNT,
    SCHULTE_CORE_CELL_COUNT,
    SCHULTE_CORE_GRID_SIZE
} from '../game.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createFixedRandom(values) {
    let index = 0;
    return () => values[index++ % values.length];
}

function createOrderedBoard(prefix = 'board') {
    return {
        gridSize: SCHULTE_CORE_GRID_SIZE,
        cellCount: SCHULTE_CORE_CELL_COUNT,
        cells: createSchulteNumberSet().map((value, index) => ({
            cellId: `${prefix}-cell-${value}`,
            value,
            row: Math.floor(index / SCHULTE_CORE_GRID_SIZE),
            column: index % SCHULTE_CORE_GRID_SIZE,
            selected: false
        }))
    };
}

function getCellIdByValue(board, value) {
    return board.cells.find(cell => cell.value === value).cellId;
}

function testNumberSetCreatesThreeByThreeRange() {
    const numbers = createSchulteNumberSet();

    assert(numbers.length === SCHULTE_CORE_CELL_COUNT, '3x3 number set should contain 9 numbers');
    assert(numbers[0] === 1, 'Number set should start at 1');
    assert(numbers[8] === 9, 'Number set should end at 9');
    console.log('Schulte number set test passed');
}

function testBoardGenerationCreatesRandomizedThreeByThreeCells() {
    const board = createSchulteBoard({
        random: createFixedRandom([0, 0.25, 0.5, 0.75, 0.99])
    });
    const values = board.cells.map(cell => cell.value);
    const sortedValues = values.slice().sort((a, b) => a - b);

    assert(board.gridSize === SCHULTE_CORE_GRID_SIZE, 'Board should use 3x3 grid size');
    assert(board.cellCount === SCHULTE_CORE_CELL_COUNT, 'Board should expose 9 cells');
    assert(sortedValues.join(',') === '1,2,3,4,5,6,7,8,9', 'Board should place each number 1 through 9 exactly once');
    assert(values.join(',') !== '1,2,3,4,5,6,7,8,9', 'Board should support randomized number placement');
    assert(board.cells[0].cellId === 'schulte-cell-1', 'Cell ids should be stable');
    assert(board.cells[0].row === 0 && board.cells[0].column === 0, 'First cell should include row and column placement');
    assert(board.cells[8].row === 2 && board.cells[8].column === 2, 'Last cell should include row and column placement');
    assert(board.cells.every(cell => cell.selected === false), 'Cells should begin unselected');
    console.log('Schulte board generation test passed');
}

function testCoreGridSelectionMarksCell() {
    const game = createSchulteCoreGridEngine({
        board: createSchulteBoard({ random: createFixedRandom([0]) })
    });
    const firstCell = game.getState().board.cells[0];
    const outcome = game.selectCell(firstCell.cellId);
    const selectedCell = outcome.state.board.cells.find(cell => cell.cellId === firstCell.cellId);

    assert(outcome.result === 'selected', 'Valid unselected cell should be selected');
    assert(outcome.cell.value === firstCell.value, 'Selection outcome should expose selected cell');
    assert(selectedCell.selected === true, 'Selected cell should be marked selected');
    assert(outcome.state.selectedCount === 1, 'Selected count should increment');
    assert(outcome.state.completed === false, 'Board should not complete after one selection');
    console.log('Schulte core grid selection test passed');
}

function testCoreGridRejectsInvalidAndDuplicateSelections() {
    const game = createSchulteCoreGridEngine({
        board: createSchulteBoard({ random: createFixedRandom([0]) })
    });
    const firstCell = game.getState().board.cells[0];

    assert(game.selectCell('missing-cell').result === 'invalid', 'Unknown cell should be invalid');
    assert(game.getState().selectedCount === 0, 'Invalid cell should not increment selected count');
    assert(game.selectCell(firstCell.cellId).result === 'selected', 'First valid selection should succeed');

    const duplicateOutcome = game.selectCell(firstCell.cellId);
    assert(duplicateOutcome.result === 'ignored', 'Already selected cell should be ignored');
    assert(duplicateOutcome.reason === 'already-selected', 'Duplicate selection should explain the guard');
    assert(duplicateOutcome.state.selectedCount === 1, 'Duplicate selection should not increment selected count');
    console.log('Schulte invalid and duplicate selection test passed');
}

function testCoreGridDetectsBoardCompletion() {
    const game = createSchulteCoreGridEngine({
        board: createSchulteBoard({ random: createFixedRandom([0]) })
    });
    const cells = game.getState().board.cells;
    let outcome = null;

    cells.forEach(cell => {
        outcome = game.selectCell(cell.cellId);
    });

    assert(outcome.result === 'complete', 'Final cell selection should complete the board');
    assert(outcome.state.selectedCount === SCHULTE_CORE_CELL_COUNT, 'Completed board should count all selected cells');
    assert(game.isComplete() === true, 'Engine should report completion');
    assert(game.selectCell(cells[0].cellId).reason === 'complete', 'Selections after completion should be ignored');
    console.log('Schulte board completion test passed');
}

function testRenderSchulteGridMarkup() {
    const board = createSchulteBoard({ random: createFixedRandom([0]) });
    const markup = renderSchulteGridMarkup(board);

    assert(markup.includes('data-testid="schulte-grid"'), 'Markup should include grid test id');
    assert(markup.includes('grid-template-columns: repeat(3'), 'Markup should render as a 3-column grid');
    board.cells.forEach(cell => {
        assert(markup.includes(`data-testid="${cell.cellId}"`), `Markup should include ${cell.cellId}`);
        assert(markup.includes(`data-schulte-number="${cell.value}"`), `Markup should include number ${cell.value}`);
    });
    console.log('Schulte grid markup test passed');
}

function testAscendingSessionStartsWithTwoBoardStructure() {
    const session = createSchulteAscendingSession({
        boards: [createOrderedBoard('one'), createOrderedBoard('two')]
    });
    const state = session.getState();

    assert(state.mode === 'ascending', 'Ascending session should expose ascending mode');
    assert(state.boardCount === SCHULTE_ASCENDING_BOARD_COUNT, 'Ascending session should contain two boards');
    assert(state.currentBoardIndex === 0, 'Ascending session should start on first board');
    assert(state.boardNumber === 1, 'Ascending session should expose learner-facing board number');
    assert(state.expectedNumber === 1, 'Ascending session should expect 1 first');
    assert(state.completed === false, 'Ascending session should start incomplete');
    console.log('Schulte ascending two-board structure test passed');
}

function testAscendingSessionEnforcesOneToNineOrder() {
    const session = createSchulteAscendingSession({
        boards: [createOrderedBoard('one'), createOrderedBoard('two')]
    });
    const initialBoard = session.getState().currentBoard;
    const twoCellId = getCellIdByValue(initialBoard, 2);
    const oneCellId = getCellIdByValue(initialBoard, 1);

    const incorrect = session.selectCell(twoCellId);
    assert(incorrect.result === 'incorrect', 'Selecting 2 before 1 should be incorrect');
    assert(incorrect.reason === 'ascending-order', 'Incorrect ascending selection should explain order guard');
    assert(incorrect.expectedNumber === 1, 'Incorrect selection should expose expected number');
    assert(incorrect.state.expectedNumber === 1, 'Incorrect selection should not advance expected number');
    assert(incorrect.state.currentBoard.cells.find(cell => cell.cellId === twoCellId).selected === false, 'Incorrect selection should not mark cell selected');

    const correct = session.selectCell(oneCellId);
    assert(correct.result === 'selected', 'Selecting 1 first should be accepted');
    assert(correct.state.expectedNumber === 2, 'Correct ascending selection should advance expected number');
    assert(correct.state.currentBoard.cells.find(cell => cell.cellId === oneCellId).selected === true, 'Correct selection should mark cell selected');
    console.log('Schulte ascending order enforcement test passed');
}

function testAscendingSessionAdvancesAfterFirstBoard() {
    const session = createSchulteAscendingSession({
        boards: [createOrderedBoard('one'), createOrderedBoard('two')]
    });
    let outcome = null;

    for (let value = 1; value <= SCHULTE_CORE_CELL_COUNT; value += 1) {
        const board = session.getState().currentBoard;
        outcome = session.selectCell(getCellIdByValue(board, value));
    }

    assert(outcome.result === 'board-complete', 'Ninth ascending selection on first board should complete board');
    assert(outcome.state.completedBoards === 1, 'One completed board should be recorded');
    assert(outcome.state.currentBoardIndex === 1, 'Session should advance to second board');
    assert(outcome.state.boardNumber === 2, 'Learner-facing board number should advance');
    assert(outcome.state.expectedNumber === 1, 'Second board should restart expected number at 1');
    assert(outcome.state.completed === false, 'Session should not complete after first board');
    console.log('Schulte ascending board progression test passed');
}

function testAscendingSessionCompletesAfterTwoBoards() {
    const session = createSchulteAscendingSession({
        boards: [createOrderedBoard('one'), createOrderedBoard('two')]
    });
    let outcome = null;

    for (let boardIndex = 0; boardIndex < SCHULTE_ASCENDING_BOARD_COUNT; boardIndex += 1) {
        for (let value = 1; value <= SCHULTE_CORE_CELL_COUNT; value += 1) {
            const board = session.getState().currentBoard;
            outcome = session.selectCell(getCellIdByValue(board, value));
        }
    }

    assert(outcome.result === 'session-complete', 'Final selection on second board should complete session');
    assert(outcome.state.completed === true, 'Session state should be complete');
    assert(outcome.state.completedBoards === SCHULTE_ASCENDING_BOARD_COUNT, 'Both boards should be completed');
    assert(session.isComplete() === true, 'Session should report complete');
    assert(session.selectCell('two-cell-1').reason === 'session-complete', 'Selections after session completion should be ignored');
    console.log('Schulte ascending session completion test passed');
}

function runAllTests() {
    console.log('=== Schulte Core Grid Unit Tests ===');
    testNumberSetCreatesThreeByThreeRange();
    testBoardGenerationCreatesRandomizedThreeByThreeCells();
    testCoreGridSelectionMarksCell();
    testCoreGridRejectsInvalidAndDuplicateSelections();
    testCoreGridDetectsBoardCompletion();
    testRenderSchulteGridMarkup();
    testAscendingSessionStartsWithTwoBoardStructure();
    testAscendingSessionEnforcesOneToNineOrder();
    testAscendingSessionAdvancesAfterFirstBoard();
    testAscendingSessionCompletesAfterTwoBoards();
    console.log('=== All Schulte Core Grid Tests Passed ===');
}

export { runAllTests };
