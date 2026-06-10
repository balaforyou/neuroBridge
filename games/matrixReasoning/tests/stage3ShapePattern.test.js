/**
 * Unit tests for Stage 3: Shape Pattern
 *
 * Tests run independently of UI rendering and validate:
 * - Shape pattern generation
 * - Correct answer validation
 * - Option generation validity
 * - Problem structure validation
 */

import { generateStage3 } from '../stages/stage3ShapePattern.js';

const VALID_SHAPES = ['circle', 'square', 'triangle', 'star'];
const EXPECTED_RULE_DESCRIPTION = 'The top row features identical matching shapes. The bottom row follows that same pattern repetition rule.';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testShapePatternGeneration() {
    let foundValidPattern = false;
    let invalidPatterns = 0;

    for (let i = 0; i < 100; i++) {
        const problem = generateStage3();
        const { cells, correctAnswer, rule } = problem;

        if (!Array.isArray(cells) || cells.length !== 4) {
            invalidPatterns++;
            continue;
        }

        if (cells[3] !== '?') {
            invalidPatterns++;
            continue;
        }

        const [shapeA, shapeA2, shapeB] = cells;

        if (shapeA !== shapeA2) {
            invalidPatterns++;
            continue;
        }

        if (shapeA === shapeB) {
            invalidPatterns++;
            continue;
        }

        if (!VALID_SHAPES.includes(shapeA) || !VALID_SHAPES.includes(shapeB)) {
            invalidPatterns++;
            continue;
        }

        if (correctAnswer !== shapeB) {
            invalidPatterns++;
            continue;
        }

        if (rule?.type !== 'visual' || rule?.description !== EXPECTED_RULE_DESCRIPTION) {
            invalidPatterns++;
            continue;
        }

        foundValidPattern = true;
    }

    assert(foundValidPattern, 'At least one valid shape pattern should be generated');
    assert(invalidPatterns === 0, `Unexpected invalid shape patterns detected (${invalidPatterns})`);
    console.log('✓ Shape Pattern Generation Test passed');
}

function testCorrectAnswerValidation() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage3();
        const { cells, correctAnswer } = problem;
        const expectedAnswer = cells[2];
        assert(correctAnswer === expectedAnswer, `Expected correct answer ${expectedAnswer}, got ${correctAnswer}`);
    }
    console.log('✓ Correct Answer Validation Test passed');
}

function testOptionGenerationValidity() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage3();
        const { options, correctAnswer } = problem;

        assert(Array.isArray(options), 'Options should be an array');
        assert(options.length === VALID_SHAPES.length, `Expected ${VALID_SHAPES.length} options, got ${options.length}`);

        const values = options.map(opt => opt.value);
        const uniqueValues = new Set(values);

        assert(uniqueValues.size === options.length, `Options should be unique, got ${values}`);
        assert(values.every(val => VALID_SHAPES.includes(val)), `Option values must be valid shapes: ${values}`);
        assert(values.includes(correctAnswer), `Options should include correct answer ${correctAnswer}`);

        for (const opt of options) {
            assert(opt.type === 'shape', `Option type should be 'shape', got ${opt.type}`);
            assert(opt.color === 'black', `Option color should be 'black', got ${opt.color}`);
            assert(typeof opt.value === 'string', `Option value should be a string, got ${typeof opt.value}`);
        }
    }
    console.log('✓ Option Generation Validity Test passed');
}

function testProblemStructureValidation() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage3();
        assert(problem && typeof problem === 'object', 'Problem must be an object');
        assert(Array.isArray(problem.cells), 'Problem.cells must be an array');
        assert(problem.cells.length === 4, 'Problem.cells must have length 4');
        assert(problem.cells[3] === '?', 'Last cell must be a question mark');
        assert(typeof problem.correctAnswer === 'string', 'correctAnswer must be a string');
        assert(Array.isArray(problem.options), 'options must be an array');
        assert(problem.options.length === VALID_SHAPES.length, 'options must contain one entry for each shape');
        assert(problem.rule && typeof problem.rule === 'object', 'rule must be an object');
        assert(problem.rule.type === 'visual', 'rule.type must be visual');
        assert(problem.rule.description === EXPECTED_RULE_DESCRIPTION, 'rule.description must match expected text');
    }
    console.log('✓ Problem Structure Validation Test passed');
}

function runAllTests() {
    console.log('=== Stage 3 Shape Pattern Unit Tests ===');
    testShapePatternGeneration();
    testCorrectAnswerValidation();
    testOptionGenerationValidity();
    testProblemStructureValidation();
    console.log('=== All Stage 3 Tests Passed ✓ ===');
}

export { runAllTests };
