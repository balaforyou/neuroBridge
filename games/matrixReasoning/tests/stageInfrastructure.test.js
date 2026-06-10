/**
 * Unit tests for Matrix Reasoning stage infrastructure.
 *
 * Tests run independently of UI rendering and validate:
 * - Stage metadata for stages 1-5
 * - Stage factory problem generation
 * - Invalid stage handling
 */

import { getStageMetadata, STAGE_METADATA } from '../stages/stageMetadata.js';
import { generateStageProblem } from '../stages/stageFactory.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function mockGenerateNumericOptions(correct) {
    const values = [correct - 2, correct - 1, correct, correct + 1];
    return values.map(value => ({ type: 'number', value }));
}

function assertValidProblem(problem, stageNumber) {
    assert(problem && typeof problem === 'object', `Stage ${stageNumber} problem must be an object`);
    assert(Array.isArray(problem.cells), `Stage ${stageNumber} cells must be an array`);
    assert(problem.cells.length > 0, `Stage ${stageNumber} cells must not be empty`);
    assert(problem.cells[problem.cells.length - 1] === '?', `Stage ${stageNumber} last cell must be a question mark`);
    assert(problem.correctAnswer !== undefined && problem.correctAnswer !== null, `Stage ${stageNumber} must include a correctAnswer`);
    assert(Array.isArray(problem.options), `Stage ${stageNumber} options must be an array`);
    assert(problem.options.length === 4, `Stage ${stageNumber} options must contain 4 entries`);
    assert(problem.rule && typeof problem.rule === 'object', `Stage ${stageNumber} rule must be an object`);
}

function testStageMetadata() {
    const expected = [
        { id: 1, displayName: 'Linear Numbers', gridColumns: 2, isVisual: false, cellSizeClass: 'w-20 h-20' },
        { id: 2, displayName: 'Non-Linear Numbers', gridColumns: 2, isVisual: false, cellSizeClass: 'w-20 h-20' },
        { id: 3, displayName: 'Shape Pattern', gridColumns: 2, isVisual: true, cellSizeClass: 'w-20 h-20' },
        { id: 4, displayName: 'Colour Shapes', gridColumns: 2, isVisual: true, cellSizeClass: 'w-20 h-20' },
        { id: 5, displayName: 'Matrix 3x3', gridColumns: 3, isVisual: true, cellSizeClass: 'w-14 h-14' }
    ];

    assert(Object.keys(STAGE_METADATA).length === expected.length, 'Metadata should define exactly five stages');

    for (const stage of expected) {
        const metadata = getStageMetadata(stage.id);
        assert(metadata, `Stage ${stage.id} metadata should exist`);
        assert(metadata.id === stage.id, `Stage ${stage.id} id should match`);
        assert(metadata.displayName === stage.displayName, `Stage ${stage.id} displayName should match`);
        assert(metadata.gridColumns === stage.gridColumns, `Stage ${stage.id} gridColumns should match`);
        assert(metadata.isVisual === stage.isVisual, `Stage ${stage.id} isVisual should match`);
        assert(metadata.cellSizeClass === stage.cellSizeClass, `Stage ${stage.id} cellSizeClass should match`);
    }

    console.log('Stage metadata validation test passed');
}

function testStageFactoryProblemGeneration() {
    for (let stage = 1; stage <= 5; stage++) {
        const problem = generateStageProblem(stage, { generateNumericOptions: mockGenerateNumericOptions });
        assertValidProblem(problem, stage);
    }

    console.log('Stage factory problem generation test passed');
}

function testInvalidStageHandling() {
    assert(getStageMetadata(0) === null, 'Invalid metadata lookup should return null');
    assert(getStageMetadata(99) === null, 'Unknown metadata lookup should return null');
    assert(generateStageProblem(0, { generateNumericOptions: mockGenerateNumericOptions }) === null, 'Invalid stage should return null');
    assert(generateStageProblem(99, { generateNumericOptions: mockGenerateNumericOptions }) === null, 'Unknown stage should return null');

    console.log('Invalid stage handling test passed');
}

function runAllTests() {
    console.log('=== Matrix Reasoning Stage Infrastructure Unit Tests ===');
    testStageMetadata();
    testStageFactoryProblemGeneration();
    testInvalidStageHandling();
    console.log('=== All Stage Infrastructure Tests Passed ===');
}

export { runAllTests };
