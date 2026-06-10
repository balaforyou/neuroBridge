/**
 * Unit tests for Stage 1: Linear Numbers
 *
 * Tests run independently of UI rendering and validate:
 * - Linear number problem generation
 * - Horizontal pattern validation
 * - Vertical pattern validation
 * - Correct answer validation
 * - Option generation validity
 * - No duplicate options
 * - Problem structure validation
 */

import { generateStage1 } from '../stages/stage1LinearNumbers.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function mockGenerateNumericOptions(correct) {
    const values = [correct - 2, correct - 1, correct, correct + 1];
    return values.map(value => ({ type: 'number', value }));
}

function testProblemStructureValidation() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage1(mockGenerateNumericOptions);

        assert(problem && typeof problem === 'object', 'Problem must be an object');
        assert(Array.isArray(problem.cells), 'Problem.cells must be an array');
        assert(problem.cells.length === 4, 'Problem.cells must contain 4 entries');
        assert(problem.cells[3] === '?', 'Last cell must be a question mark');
        assert(typeof problem.correctAnswer === 'number', 'correctAnswer must be a number');
        assert(Array.isArray(problem.options), 'options must be an array');
        assert(problem.options.length === 4, 'options must contain 4 entries');
        assert(problem.options.every(opt => opt.type === 'number'), 'Each option type must be number');
        assert(problem.options.every(opt => typeof opt.value === 'number'), 'Option values must be numeric');
        assert(problem.rule && typeof problem.rule === 'object', 'rule must be an object');
        assert(problem.rule.type === 'linear', 'rule.type must be linear');
        assert(['horizontal', 'vertical'].includes(problem.rule.orientation), 'rule.orientation must be horizontal or vertical');
        assert([1, -1].includes(problem.rule.step), 'rule.step must be 1 or -1');
    }

    console.log('✓ Problem Structure Validation Test passed');
}

function testCorrectAnswerValidation() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage1(mockGenerateNumericOptions);
        const { cells, correctAnswer, rule } = problem;

        const [start, second, third] = cells;

        if (rule.orientation === 'horizontal') {
            const expected = third + rule.step;
            assert(correctAnswer === expected, `Horizontal correctAnswer should be ${expected}, got ${correctAnswer}`);
        } else {
            const expected = third + 2;
            assert(correctAnswer === expected, `Vertical correctAnswer should be ${expected}, got ${correctAnswer}`);
        }
    }

    console.log('✓ Correct Answer Validation Test passed');
}

function testHorizontalPatternValidation() {
    let found = false;
    for (let i = 0; i < 200; i++) {
        const problem = generateStage1(mockGenerateNumericOptions);
        const { cells, rule, correctAnswer } = problem;

        if (rule.orientation !== 'horizontal') {
            continue;
        }

        found = true;
        const [start, second, third, last] = cells;
        const step = rule.step;

        assert(last === '?', 'Horizontal pattern must end with a question mark');
        assert(second === start + step, `Horizontal second cell should be start + step (${second} !== ${start + step})`);
        assert(third === start + 2, `Horizontal third cell should be start + 2 (${third} !== ${start + 2})`);
        assert(correctAnswer === third + step, 'Horizontal correct answer should be third cell plus step');
    }

    assert(found, 'Horizontal orientation should be generated at least once');
    console.log('✓ Horizontal Pattern Validation Test passed');
}

function testVerticalPatternValidation() {
    let found = false;
    for (let i = 0; i < 200; i++) {
        const problem = generateStage1(mockGenerateNumericOptions);
        const { cells, rule, correctAnswer } = problem;

        if (rule.orientation !== 'vertical') {
            continue;
        }

        found = true;
        const [start, second, third, last] = cells;
        const step = rule.step;

        assert(last === '?', 'Vertical pattern must end with a question mark');
        assert(second === start + 2, `Vertical second cell should be start + 2 (${second} !== ${start + 2})`);
        assert(third === start + step, `Vertical third cell should be start + step (${third} !== ${start + step})`);
        assert(correctAnswer === third + 2, 'Vertical correct answer should be third cell plus 2');
    }

    assert(found, 'Vertical orientation should be generated at least once');
    console.log('✓ Vertical Pattern Validation Test passed');
}

function testOptionGenerationValidity() {
    for (let i = 0; i < 100; i++) {
        const problem = generateStage1(mockGenerateNumericOptions);
        const values = problem.options.map(option => option.value);

        assert(values.includes(problem.correctAnswer), `Options must include the correct answer ${problem.correctAnswer}`);
        assert(values.length === 4, `Options must contain exactly 4 values, got ${values.length}`);
        assert(new Set(values).size === values.length, `Options must be unique, got duplicates in ${values}`);
    }

    console.log('✓ Option Generation Validity Test passed');
}

function testGenerateNumericOptionsCalledWithCorrectAnswer() {
    for (let i = 0; i < 100; i++) {
        let capturedCorrect = null;
        const generatedProblem = generateStage1(correct => {
            capturedCorrect = correct;
            return mockGenerateNumericOptions(correct);
        });

        assert(capturedCorrect === generatedProblem.correctAnswer,
            `generateNumericOptions must receive the correctAnswer ${generatedProblem.correctAnswer}`);
    }

    console.log('✓ generateNumericOptions Call Validation Test passed');
}

function runAllTests() {
    console.log('=== Stage 1 Linear Numbers Unit Tests ===');
    testProblemStructureValidation();
    testCorrectAnswerValidation();
    testHorizontalPatternValidation();
    testVerticalPatternValidation();
    testOptionGenerationValidity();
    testGenerateNumericOptionsCalledWithCorrectAnswer();
    console.log('=== All Stage 1 Tests Passed ✓ ===');
}

export { runAllTests };