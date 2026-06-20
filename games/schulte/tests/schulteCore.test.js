import {
    createSchulteBoard,
    createSchulteCoreGridEngine,
    createSchulteNumberSet,
    renderSchulteGridMarkup,
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

function runAllTests() {
    console.log('=== Schulte Core Grid Unit Tests ===');
    testNumberSetCreatesThreeByThreeRange();
    testBoardGenerationCreatesRandomizedThreeByThreeCells();
    testCoreGridSelectionMarksCell();
    testCoreGridRejectsInvalidAndDuplicateSelections();
    testCoreGridDetectsBoardCompletion();
    testRenderSchulteGridMarkup();
    console.log('=== All Schulte Core Grid Tests Passed ===');
}

export { runAllTests };
