/**
 * Unit tests for Attribute Explorer: Same / Different.
 *
 * Tests run independently of UI rendering and validate:
 * - Attribute comparison question generation
 * - Correct answers for same/different color, shape, and size
 * - Problem structure and options
 */

import { ATTRIBUTES, RELATIONS, SIZE_DIFFICULTY_LEVELS } from '../config.js';
import { generateAttributeQuestion } from '../questionGenerator.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function generateForced(attribute, relation, options = {}) {
    return generateAttributeQuestion({ attribute, relation }, options);
}

function assertBaseStructure(problem) {
    assert(problem && typeof problem === 'object', 'Problem must be an object');
    assert(Array.isArray(problem.cells), 'Problem.cells must be an array');
    assert(problem.cells.length === 2, 'Problem.cells must contain two visual items');

    for (const cell of problem.cells) {
        assert(cell && typeof cell === 'object', 'Each cell must be an object');
        assert(typeof cell.shape === 'string', 'Each cell must include shape');
        assert(typeof cell.color === 'string', 'Each cell must include color');
        assert(typeof cell.size === 'string', 'Each cell must include size');
    }

    assert(['same', 'different'].includes(problem.correctAnswer), 'correctAnswer must be same or different');
    assert(Array.isArray(problem.options), 'Problem.options must be an array');
    assert(problem.options.length === 2, 'Problem.options must contain two choices');
    assert(problem.rule && typeof problem.rule === 'object', 'Problem.rule must be an object');
    assert(problem.rule.type === 'attribute-comparison', 'Problem.rule.type must be attribute-comparison');
    assert(['color', 'shape', 'size'].includes(problem.rule.attribute), 'Problem.rule.attribute must be valid');
    assert(['same', 'different'].includes(problem.rule.relation), 'Problem.rule.relation must be valid');
    assert(typeof problem.rule.description === 'string', 'Problem.rule.description must be a string');
}

function assertOptions(problem) {
    const same = problem.options.find(option => option.value === 'same');
    const different = problem.options.find(option => option.value === 'different');

    assert(same, 'Options must include Same');
    assert(different, 'Options must include Different');
    assert(same.type === 'choice' && same.label === 'Same', 'Same option must have correct type and label');
    assert(different.type === 'choice' && different.label === 'Different', 'Different option must have correct type and label');
}

function testSameColorGeneration() {
    for (let i = 0; i < 50; i++) {
        const problem = generateForced(ATTRIBUTES.COLOR, RELATIONS.SAME);
        assert(problem.cells[0].color === problem.cells[1].color, 'Same color question must use matching colors');
        assert(problem.correctAnswer === 'same', 'Same color question answer must be same');
        assert(problem.rule.attribute === 'color', 'Same color question must target color');
    }

    console.log('Same color generation test passed');
}

function testDifferentColorGeneration() {
    for (let i = 0; i < 50; i++) {
        const problem = generateForced(ATTRIBUTES.COLOR, RELATIONS.DIFFERENT);
        assert(problem.cells[0].color !== problem.cells[1].color, 'Different color question must use different colors');
        assert(problem.correctAnswer === 'different', 'Different color question answer must be different');
        assert(problem.rule.attribute === 'color', 'Different color question must target color');
    }

    console.log('Different color generation test passed');
}

function testSameShapeGeneration() {
    for (let i = 0; i < 50; i++) {
        const problem = generateForced(ATTRIBUTES.SHAPE, RELATIONS.SAME);
        assert(problem.cells[0].shape === problem.cells[1].shape, 'Same shape question must use matching shapes');
        assert(problem.correctAnswer === 'same', 'Same shape question answer must be same');
        assert(problem.rule.attribute === 'shape', 'Same shape question must target shape');
    }

    console.log('Same shape generation test passed');
}

function testDifferentShapeGeneration() {
    for (let i = 0; i < 50; i++) {
        const problem = generateForced(ATTRIBUTES.SHAPE, RELATIONS.DIFFERENT);
        assert(problem.cells[0].shape !== problem.cells[1].shape, 'Different shape question must use different shapes');
        assert(problem.correctAnswer === 'different', 'Different shape question answer must be different');
        assert(problem.rule.attribute === 'shape', 'Different shape question must target shape');
    }

    console.log('Different shape generation test passed');
}

function testSameSizeGeneration() {
    for (let i = 0; i < 50; i++) {
        const problem = generateForced(ATTRIBUTES.SIZE, RELATIONS.SAME);
        assert(problem.cells[0].size === problem.cells[1].size, 'Same size question must use matching sizes');
        assert(problem.correctAnswer === 'same', 'Same size question answer must be same');
        assert(problem.rule.attribute === 'size', 'Same size question must target size');
    }

    console.log('Same size generation test passed');
}

function testDifferentSizeGeneration() {
    for (let i = 0; i < 50; i++) {
        const problem = generateForced(ATTRIBUTES.SIZE, RELATIONS.DIFFERENT);
        assert(problem.cells[0].size !== problem.cells[1].size, 'Different size question must use different sizes');
        assert(problem.correctAnswer === 'different', 'Different size question answer must be different');
        assert(problem.rule.attribute === 'size', 'Different size question must target size');
    }

    console.log('Different size generation test passed');
}

function testColorQuestionsControlNonTargetAttributes() {
    for (const relation of [RELATIONS.SAME, RELATIONS.DIFFERENT]) {
        for (let i = 0; i < 50; i++) {
            const problem = generateForced(ATTRIBUTES.COLOR, relation);
            const [first, second] = problem.cells;

            assert(first.shape === second.shape, 'Color questions must keep shape controlled');
            assert(first.size === second.size, 'Color questions must keep size controlled');
            assert(first.sizePx === undefined && second.sizePx === undefined, 'Color questions must not apply size adaptation');
        }
    }

    console.log('Color non-target attribute control test passed');
}

function testShapeQuestionsControlNonTargetAttributes() {
    for (const relation of [RELATIONS.SAME, RELATIONS.DIFFERENT]) {
        for (let i = 0; i < 50; i++) {
            const problem = generateForced(ATTRIBUTES.SHAPE, relation);
            const [first, second] = problem.cells;

            assert(first.color === second.color, 'Shape questions must keep color controlled');
            assert(first.size === second.size, 'Shape questions must keep size controlled');
            assert(first.sizePx === undefined && second.sizePx === undefined, 'Shape questions must not apply size adaptation');
        }
    }

    console.log('Shape non-target attribute control test passed');
}

function testSizeQuestionsControlNonTargetAttributes() {
    for (const relation of [RELATIONS.SAME, RELATIONS.DIFFERENT]) {
        for (let i = 0; i < 50; i++) {
            const problem = generateForced(ATTRIBUTES.SIZE, relation);
            const [first, second] = problem.cells;

            assert(first.color === second.color, 'Size questions must keep color controlled');
            assert(first.shape === second.shape, 'Size questions must keep shape controlled');
        }
    }

    console.log('Size non-target attribute control test passed');
}

function testSizeDifferentLevel1ProducesClearlyDifferentSizes() {
    for (let i = 0; i < 50; i++) {
        const problem = generateForced(ATTRIBUTES.SIZE, RELATIONS.DIFFERENT, { sizeDifficultyLevel: 1 });
        const [first, second] = problem.cells;
        const difference = Math.abs(first.sizePx - second.sizePx);

        assert(first.sizePx !== second.sizePx, 'Level 1 different-size question must use different rendered sizes');
        assert(difference >= 100, `Level 1 size difference should be obvious, got ${difference}px`);
        assert([SIZE_DIFFICULTY_LEVELS[1].big, SIZE_DIFFICULTY_LEVELS[1].small].includes(first.sizePx), 'First sizePx should use level 1 values');
        assert([SIZE_DIFFICULTY_LEVELS[1].big, SIZE_DIFFICULTY_LEVELS[1].small].includes(second.sizePx), 'Second sizePx should use level 1 values');
    }

    console.log('Size different Level 1 clear difference test passed');
}

function testSameSizeProducesEqualRenderedSizes() {
    for (let i = 0; i < 50; i++) {
        const problem = generateForced(ATTRIBUTES.SIZE, RELATIONS.SAME, { sizeDifficultyLevel: 1 });
        const [first, second] = problem.cells;

        assert(first.size === second.size, 'Same-size question must use matching size labels');
        assert(first.sizePx === second.sizePx, 'Same-size question must render equal sizes');
    }

    console.log('Same size equal rendered size test passed');
}

function testSizeDifficultyLevelIncludedInQuestionMetadata() {
    const sizeProblem = generateForced(ATTRIBUTES.SIZE, RELATIONS.DIFFERENT, { sizeDifficultyLevel: 3 });
    const colorProblem = generateForced(ATTRIBUTES.COLOR, RELATIONS.SAME);

    assert(sizeProblem.metadata?.sizeDifficultyLevel === 3, 'Size question metadata must include requested sizeDifficultyLevel');
    assert(colorProblem.metadata?.sizeDifficultyLevel === null, 'Non-size question metadata should not carry a size difficulty level');

    console.log('Size difficulty metadata test passed');
}

function testCorrectAnswerDomain() {
    for (let i = 0; i < 100; i++) {
        const problem = generateAttributeQuestion();
        assert(['same', 'different'].includes(problem.correctAnswer), 'Correct answer must always be same or different');
    }

    console.log('Correct answer domain test passed');
}

function testOptionsAlwaysContainSameAndDifferent() {
    for (let i = 0; i < 100; i++) {
        assertOptions(generateAttributeQuestion());
    }

    console.log('Options always contain Same and Different test passed');
}

function testProblemStructureValidation() {
    for (let i = 0; i < 100; i++) {
        const problem = generateAttributeQuestion();
        assertBaseStructure(problem);
        assertOptions(problem);
    }

    console.log('Problem structure validation test passed');
}

function runAllTests() {
    console.log('=== Attribute Explorer Same / Different Unit Tests ===');
    testSameColorGeneration();
    testDifferentColorGeneration();
    testSameShapeGeneration();
    testDifferentShapeGeneration();
    testSameSizeGeneration();
    testDifferentSizeGeneration();
    testColorQuestionsControlNonTargetAttributes();
    testShapeQuestionsControlNonTargetAttributes();
    testSizeQuestionsControlNonTargetAttributes();
    testSizeDifferentLevel1ProducesClearlyDifferentSizes();
    testSameSizeProducesEqualRenderedSizes();
    testSizeDifficultyLevelIncludedInQuestionMetadata();
    testCorrectAnswerDomain();
    testOptionsAlwaysContainSameAndDifferent();
    testProblemStructureValidation();
    console.log('=== All Attribute Explorer Same / Different Tests Passed ===');
}

export { runAllTests };
