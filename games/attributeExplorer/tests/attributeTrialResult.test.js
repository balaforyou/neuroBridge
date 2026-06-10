/**
 * Unit tests for Attribute Explorer common trial result capture.
 */

import {
    createDefaultScaffold,
    createSessionId,
    createTrialId,
    createTrialResult
} from '../../../js/trialResult.js';
import { ATTRIBUTE_EXPLORER_GAME_ID, ATTRIBUTES, RELATIONS } from '../config.js';
import { generateAttributeQuestion } from '../questionGenerator.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function buildBaseResult(overrides = {}) {
    const problem = generateAttributeQuestion({
        attribute: ATTRIBUTES.COLOR,
        relation: RELATIONS.SAME
    });

    return createTrialResult({
        gameId: ATTRIBUTE_EXPLORER_GAME_ID,
        learnerId: null,
        sessionId: createSessionId('test-session'),
        trialId: createTrialId('test-trial'),
        taskType: 'same-different',
        stage: 1,
        difficultyLevel: 1,
        prompt: `Look at ${problem.rule.attribute}`,
        correctAnswer: problem.correctAnswer,
        selectedAnswer: problem.correctAnswer,
        isCorrect: true,
        attempts: 1,
        reactionTimeMs: 725,
        scaffold: createDefaultScaffold(),
        attributes: {
            targetAttribute: problem.rule.attribute,
            relation: problem.rule.relation
        },
        metadata: {
            ruleType: problem.rule.type,
            isTestSession: true,
            sizeDifficultyLevel: problem.metadata?.sizeDifficultyLevel ?? null
        },
        ...overrides
    });
}

function testTrialResultObjectStructure() {
    const result = buildBaseResult();

    assert(typeof result.gameId === 'string', 'gameId must be a string');
    assert(result.learnerId === null, 'learnerId should allow null');
    assert(typeof result.sessionId === 'string', 'sessionId must be a string');
    assert(typeof result.trialId === 'string', 'trialId must be a string');
    assert(typeof result.timestamp === 'string', 'timestamp must be a string');
    assert(result.taskType === 'same-different', 'taskType must be captured');
    assert(result.stage === 1, 'stage must be captured');
    assert(result.difficultyLevel === 1, 'difficultyLevel must be captured');
    assert(result.prompt === 'Look at color', 'prompt must be captured');
    assert(result.correctAnswer === 'same', 'correctAnswer must be captured');
    assert(result.selectedAnswer === 'same', 'selectedAnswer must be captured');
    assert(result.isCorrect === true, 'isCorrect must be captured');
    assert(result.attempts === 1, 'attempts must be captured');
    assert(result.reactionTimeMs === 725, 'reactionTimeMs must be captured');
    assert(result.scaffold && typeof result.scaffold === 'object', 'scaffold must be an object');
    assert(result.attributes && typeof result.attributes === 'object', 'attributes must be an object');
    assert(result.metadata && typeof result.metadata === 'object', 'metadata must be an object');

    console.log('Trial result object structure test passed');
}

function testIndependentCorrectResult() {
    const result = buildBaseResult({
        isCorrect: true,
        selectedAnswer: 'same',
        scaffold: createDefaultScaffold()
    });

    assert(result.resultStatus === 'independent', 'First-attempt correct without scaffold should be independent');
    assert(result.scaffold.used === false, 'Independent result should not use scaffold');
    assert(result.scaffold.level === 0, 'Independent result scaffold level should be 0');

    console.log('Independent correct result test passed');
}

function testScaffoldedCorrectResult() {
    const result = buildBaseResult({
        isCorrect: true,
        selectedAnswer: 'same',
        scaffold: {
            used: true,
            level: 1,
            type: 'attention-cue',
            trigger: 'parent'
        }
    });

    assert(result.resultStatus === 'scaffolded', 'Correct answer after scaffold should be scaffolded');
    assert(result.scaffold.used === true, 'Scaffolded result should mark scaffold used');
    assert(result.scaffold.level === 1, 'Scaffolded result should capture level 1');
    assert(result.scaffold.type === 'attention-cue', 'Scaffolded result should capture type');
    assert(result.scaffold.trigger === 'parent', 'Scaffolded result should capture trigger');

    console.log('Scaffolded correct result test passed');
}

function testFailedResult() {
    const result = buildBaseResult({
        correctAnswer: 'same',
        selectedAnswer: 'different',
        isCorrect: false,
        attempts: 1
    });

    assert(result.resultStatus === 'failed', 'Wrong final answer should be failed');
    assert(result.isCorrect === false, 'Failed result should capture isCorrect false');
    assert(result.selectedAnswer === 'different', 'Failed result should capture selected answer');

    console.log('Failed result test passed');
}

function testReactionTimeCaptured() {
    const result = buildBaseResult({ reactionTimeMs: 1234 });

    assert(result.reactionTimeMs === 1234, 'reactionTimeMs should be captured exactly');
    assert(Number.isFinite(result.reactionTimeMs), 'reactionTimeMs should be numeric');

    console.log('Reaction time captured test passed');
}

function testAttributeMetadataIncluded() {
    const result = buildBaseResult({
        attributes: {
            targetAttribute: ATTRIBUTES.SIZE,
            relation: RELATIONS.DIFFERENT
        },
        metadata: {
            questionId: 'question-size-different',
            ruleType: 'attribute-comparison',
            isTestSession: true,
            sizeDifficultyLevel: 1
        }
    });

    assert(result.attributes.targetAttribute === 'size', 'targetAttribute must be included');
    assert(result.attributes.relation === 'different', 'relation must be included');
    assert(result.metadata.questionId === 'question-size-different', 'questionId metadata should be included');
    assert(result.metadata.ruleType === 'attribute-comparison', 'ruleType metadata should be included');
    assert(result.metadata.isTestSession === true, 'isTestSession metadata should be included');
    assert(result.metadata.sizeDifficultyLevel === 1, 'sizeDifficultyLevel metadata should be included');

    console.log('Attribute metadata included test passed');
}

function testSizeDifficultyLevelIncludedInTrialMetadata() {
    const result = buildBaseResult({
        attributes: {
            targetAttribute: ATTRIBUTES.SIZE,
            relation: RELATIONS.DIFFERENT
        },
        metadata: {
            questionId: 'size-level-1',
            ruleType: 'attribute-comparison',
            isTestSession: false,
            sizeDifficultyLevel: 1
        }
    });

    assert(result.metadata.sizeDifficultyLevel === 1, 'Trial result metadata must include sizeDifficultyLevel');

    console.log('Size difficulty trial metadata test passed');
}

function runAllTests() {
    console.log('=== Attribute Explorer Trial Result Unit Tests ===');
    testTrialResultObjectStructure();
    testIndependentCorrectResult();
    testScaffoldedCorrectResult();
    testFailedResult();
    testReactionTimeCaptured();
    testAttributeMetadataIncluded();
    testSizeDifficultyLevelIncludedInTrialMetadata();
    console.log('=== All Attribute Explorer Trial Result Tests Passed ===');
}

export { runAllTests };
