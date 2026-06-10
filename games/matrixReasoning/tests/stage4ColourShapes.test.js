/**
 * Unit tests for Stage 4: Colour Shapes
 *
 * Tests run independently of UI rendering and validate:
 * - Multi-color shape generation
 * - Correct answer validation
 * - Option generation validity
 * - Color/shape combination structure
 * - Problem structure validation
 */

import { generateStage4 } from '../stages/stage4ColourShapes.js';
import { getOptionButtonClassList } from '../stages/visualOptionStyles.js';

const VALID_SHAPES = ['circle', 'square', 'triangle', 'star'];
const VALID_COLORS = ['red', 'blue', 'green', 'yellow'];

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function sameCombo(a, b) {
    return a && b && a.shape === b.shape && a.color === b.color;
}

function testProblemStructureValidation() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage4();

        assert(problem && typeof problem === 'object', 'Problem must be an object');
        assert(Array.isArray(problem.cells), 'Problem.cells must be an array');
        assert(problem.cells.length === 4, 'Problem.cells must contain 4 entries');
        assert(problem.cells[3] === '?', 'Last cell must be a question mark');
        assert(typeof problem.correctAnswer === 'object', 'correctAnswer must be an object');
        assert(Array.isArray(problem.options), 'options must be an array');
        assert(problem.options.length === 4, 'options must contain 4 entries');
        assert(problem.rule && typeof problem.rule === 'object', 'rule must be an object');
        assert(problem.rule.type === 'visual', 'rule.type must be visual');
        assert(typeof problem.rule.description === 'string', 'rule.description must be a string');
    }

    console.log('✓ Problem Structure Validation Test passed');
}

function testColorShapeCombinationStructure() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage4();
        const [cellA, cellB, cellC] = problem.cells;

        assert(cellA.shape === cellB.shape, 'First two cells must share the same shape');
        assert(cellA.color === cellB.color, 'First two cells must share the same color');
        assert(cellC.shape === cellA.shape, 'Third cell must keep the same shape as the first two cells');
        assert(cellC.color !== cellA.color, 'Third cell must use a different color than the first two cells');
        assert(VALID_SHAPES.includes(cellA.shape), `Shape must be valid, got ${cellA.shape}`);
        assert(VALID_SHAPES.includes(cellC.shape), `Shape must be valid, got ${cellC.shape}`);
        assert(VALID_COLORS.includes(cellA.color), `Color must be valid, got ${cellA.color}`);
        assert(VALID_COLORS.includes(cellC.color), `Color must be valid, got ${cellC.color}`);
    }

    console.log('✓ Color/Shape Combination Structure Test passed');
}

function testCorrectAnswerValidation() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage4();
        const [, , thirdCell] = problem.cells;

        assert(sameCombo(problem.correctAnswer, thirdCell),
            `correctAnswer must match the third cell object: ${JSON.stringify(problem.correctAnswer)} vs ${JSON.stringify(thirdCell)}`);
    }

    console.log('✓ Correct Answer Validation Test passed');
}

function testOptionGenerationValidity() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage4();
        const values = problem.options.map(opt => `${opt.value}:${opt.color}`);
        const uniqueValues = new Set(values);

        assert(values.length === 4, `Options must include 4 entries, got ${values.length}`);
        assert(uniqueValues.size === values.length, `Options must be unique, got duplicates in ${values}`);
        assert(values.includes(`${problem.correctAnswer.shape}:${problem.correctAnswer.color}`),
            `Options must include the correct answer ${problem.correctAnswer.shape}:${problem.correctAnswer.color}`);

        for (const option of problem.options) {
            assert(option.type === 'shape', `Option type must be shape, got ${option.type}`);
            assert(VALID_SHAPES.includes(option.value), `Option value must be a valid shape, got ${option.value}`);
            assert(VALID_COLORS.includes(option.color), `Option color must be valid, got ${option.color}`);
            assert(option.value === problem.correctAnswer.shape,
                `All options must use the same shape ${problem.correctAnswer.shape}, got ${option.value}`);
        }
    }

    console.log('✓ Option Generation Validity Test passed');
}

function testMultiColorShapeGeneration() {
    const seenColors = new Set();
    const seenShapes = new Set();

    for (let i = 0; i < 100; i++) {
        const problem = generateStage4();
        const [cellA, , cellC] = problem.cells;

        seenColors.add(cellA.color);
        seenShapes.add(cellA.shape);

        assert(cellA.shape === cellC.shape, 'Multi-color generation should preserve shape across row');
        assert(cellA.color !== cellC.color, 'Multi-color generation should produce a different third-cell color');
    }

    assert(seenColors.size > 1, 'Stage 4 generation should use multiple colors');
    assert(seenShapes.size > 1, 'Stage 4 generation should use multiple shapes');

    console.log('✓ Multi-Color Shape Generation Test passed');
}

function testVisualStageOptionClassDoesNotUseNeutralTextColor() {
    const classList = getOptionButtonClassList(true);

    assert(!classList.includes('text-slate-900'), 'Visual stage option buttons must not include neutral text color classes');
    assert(classList.includes('bg-slate-100'), 'Visual stage option buttons must use a light background');
    assert(classList.includes('hover:bg-slate-200'), 'Visual stage option buttons must have a visible hover state');

    console.log('✓ Visual Stage Option Class Regression Test passed');
}

function runAllTests() {
    console.log('=== Stage 4 Colour Shapes Unit Tests ===');
    testProblemStructureValidation();
    testColorShapeCombinationStructure();
    testCorrectAnswerValidation();
    testOptionGenerationValidity();
    testMultiColorShapeGeneration();
    console.log('=== All Stage 4 Tests Passed ✓ ===');
}

export { runAllTests };