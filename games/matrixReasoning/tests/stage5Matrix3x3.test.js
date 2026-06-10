/**
 * Unit tests for Stage 5: 3x3 Matrix
 *
 * Tests run independently of UI rendering and validate:
 * - 3x3 matrix problem generation
 * - Multi-axis rule generation
 * - Correct answer validation
 * - Option generation validity
 * - Color/shape combination structure
 * - Problem structure validation
 * - No duplicate options
 */

import { generateStage5 } from '../stages/stage5Matrix3x3.js';

const VALID_SHAPES = ['circle', 'square', 'triangle'];
const VALID_COLORS = ['red', 'blue', 'green'];

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function formatOption(option) {
    return `${option.value}:${option.color}`;
}

function testProblemStructureValidation() {
    for (let i = 0; i < 50; i++) {
        const problem = generateStage5();
        assert(problem && typeof problem === 'object', 'Problem must be an object');
        assert(Array.isArray(problem.cells), 'Problem.cells must be an array');
        assert(problem.cells.length === 9, 'Problem.cells must contain 9 entries');
        assert(problem.cells[8] === '?', 'Last matrix cell must be a question mark');
        assert(typeof problem.correctAnswer === 'object', 'correctAnswer must be an object');
        assert(Array.isArray(problem.options), 'options must be an array');
        assert(problem.options.length === 4, 'options must contain 4 entries');
        assert(problem.rule && typeof problem.rule === 'object', 'rule must be an object');
        assert(problem.rule.type === 'visual', 'rule.type must be visual');
        assert(typeof problem.rule.description === 'string', 'rule.description must be a string');
    }

    console.log('✓ Problem Structure Validation Test passed');
}

function testMatrixProblemGeneration() {
    const expectedCells = [
        { shape: 'circle', color: 'red' },
        { shape: 'square', color: 'red' },
        { shape: 'triangle', color: 'red' },
        { shape: 'circle', color: 'blue' },
        { shape: 'square', color: 'blue' },
        { shape: 'triangle', color: 'blue' },
        { shape: 'circle', color: 'green' },
        { shape: 'square', color: 'green' },
        '?'
    ];

    for (let i = 0; i < 20; i++) {
        const problem = generateStage5();
        assert(JSON.stringify(problem.cells) === JSON.stringify(expectedCells), 'Matrix generation must match expected 3x3 pattern');
    }

    console.log('✓ 3x3 Matrix Problem Generation Test passed');
}

function testMultiAxisRuleGeneration() {
    for (let i = 0; i < 20; i++) {
        const problem = generateStage5();
        assert(problem.rule.description === 'Each horizontal row loops through changing shapes. Each vertical column shifts color sets uniformly.',
            `Invalid rule description: ${problem.rule.description}`);
    }

    console.log('✓ Multi-Axis Rule Generation Test passed');
}

function testCorrectAnswerValidation() {
    for (let i = 0; i < 20; i++) {
        const problem = generateStage5();
        assert(problem.correctAnswer.shape === 'triangle', 'Correct answer shape should be triangle');
        assert(problem.correctAnswer.color === 'green', 'Correct answer color should be green');
    }

    console.log('✓ Correct Answer Validation Test passed');
}

function testOptionGenerationValidity() {
    for (let i = 0; i < 20; i++) {
        const problem = generateStage5();
        assert(Array.isArray(problem.options), 'options must be an array');
        assert(problem.options.length === 4, 'options length must be 4');

        const formattedOptions = problem.options.map(formatOption);
        const uniqueOptions = new Set(formattedOptions);

        assert(uniqueOptions.size === formattedOptions.length, `Options must be unique, got duplicates in ${formattedOptions}`);
        assert(formattedOptions.includes('triangle:green'), 'Options must include the correct answer triangle:green');

        for (const option of problem.options) {
            assert(option.type === 'shape', `Option type must be shape, got ${option.type}`);
            assert(VALID_SHAPES.includes(option.value), `Option shape must be valid, got ${option.value}`);
            assert(VALID_COLORS.includes(option.color), `Option color must be valid, got ${option.color}`);
        }
    }

    console.log('✓ Option Generation Validity Test passed');
}

function testColorShapeCombinationStructure() {
    const problem = generateStage5();
    const [a, b, c, d, e, f, g, h] = problem.cells;

    assert(a.shape === 'circle' && a.color === 'red', 'Cell A must be red circle');
    assert(b.shape === 'square' && b.color === 'red', 'Cell B must be red square');
    assert(c.shape === 'triangle' && c.color === 'red', 'Cell C must be red triangle');
    assert(d.shape === 'circle' && d.color === 'blue', 'Cell D must be blue circle');
    assert(e.shape === 'square' && e.color === 'blue', 'Cell E must be blue square');
    assert(f.shape === 'triangle' && f.color === 'blue', 'Cell F must be blue triangle');
    assert(g.shape === 'circle' && g.color === 'green', 'Cell G must be green circle');
    assert(h.shape === 'square' && h.color === 'green', 'Cell H must be green square');

    console.log('✓ Color/Shape Combination Structure Test passed');
}

function testDuplicateOptions() {
    const problem = generateStage5();
    const formattedOptions = problem.options.map(formatOption);
    const uniqueOptions = new Set(formattedOptions);
    assert(uniqueOptions.size === formattedOptions.length, 'There must be no duplicate options');

    console.log('✓ No Duplicate Options Test passed');
}

function runAllTests() {
    console.log('=== Stage 5 3x3 Matrix Unit Tests ===');
    testProblemStructureValidation();
    testMatrixProblemGeneration();
    testMultiAxisRuleGeneration();
    testCorrectAnswerValidation();
    testOptionGenerationValidity();
    testColorShapeCombinationStructure();
    testDuplicateOptions();
    console.log('=== All Stage 5 Tests Passed ✓ ===');
}

export { runAllTests };