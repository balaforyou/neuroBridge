/**
 * Unit tests for reusable NeuroBridge session result aggregation.
 */

import { createSessionResult, finalizeSession, recordTrial } from '../sessionResult.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createTrial(overrides = {}) {
    return {
        gameId: 'attributeExplorer',
        learnerId: null,
        sessionId: 'session-test',
        trialId: `trial-${Math.random()}`,
        timestamp: new Date().toISOString(),
        taskType: 'same-different',
        stage: 1,
        difficultyLevel: 1,
        prompt: null,
        correctAnswer: 'same',
        selectedAnswer: 'same',
        isCorrect: true,
        resultStatus: 'independent',
        attempts: 1,
        reactionTimeMs: 500,
        scaffold: {
            used: false,
            level: 0,
            type: null,
            trigger: null
        },
        attributes: {},
        metadata: {},
        ...overrides
    };
}

function testEmptySession() {
    const session = finalizeSession(createSessionResult({
        sessionId: 'empty-session',
        gameId: 'attributeExplorer',
        domain: 'attributes'
    }));

    assert(session.sessionId === 'empty-session', 'Session should keep provided sessionId');
    assert(session.learnerId === null, 'learnerId should default to null');
    assert(session.gameId === 'attributeExplorer', 'Session should keep gameId');
    assert(session.domain === 'attributes', 'Session should keep domain');
    assert(typeof session.startedAt === 'string', 'startedAt should be a string');
    assert(typeof session.endedAt === 'string', 'endedAt should be set on finalize');
    assert(session.totalTrials === 0, 'Empty session should have zero trials');
    assert(session.independentCount === 0, 'Empty session independent count should be 0');
    assert(session.scaffoldedCount === 0, 'Empty session scaffolded count should be 0');
    assert(session.failedCount === 0, 'Empty session failed count should be 0');
    assert(session.accuracy === 0, 'Empty session accuracy should be 0');
    assert(session.averageReactionTimeMs === 0, 'Empty session average reaction time should be 0');
    assert(session.hintUsageCount === 0, 'Empty session hint usage count should be 0');
    assert(session.highestDifficultyReached === 0, 'Empty session highest difficulty should be 0');
    assert(Array.isArray(session.trialResults) && session.trialResults.length === 0, 'Empty session trialResults should be empty');

    console.log('Empty session test passed');
}

function testIndependentTrialAggregation() {
    const session = createSessionResult({ gameId: 'attributeExplorer' });
    recordTrial(session, createTrial({
        resultStatus: 'independent',
        isCorrect: true,
        difficultyLevel: 2,
        reactionTimeMs: 600
    }));

    assert(session.totalTrials === 1, 'Total trials should increment');
    assert(session.independentCount === 1, 'Independent count should increment');
    assert(session.scaffoldedCount === 0, 'Scaffolded count should remain 0');
    assert(session.failedCount === 0, 'Failed count should remain 0');
    assert(session.accuracy === 1, 'Independent correct trial should count as accurate');
    assert(session.averageReactionTimeMs === 600, 'Average reaction time should match one trial');
    assert(session.highestDifficultyReached === 2, 'Highest difficulty should update');

    console.log('Independent trial aggregation test passed');
}

function testScaffoldedTrialAggregation() {
    const session = createSessionResult({ gameId: 'attributeExplorer' });
    recordTrial(session, createTrial({
        resultStatus: 'scaffolded',
        isCorrect: true,
        difficultyLevel: 3,
        reactionTimeMs: 800,
        scaffold: {
            used: true,
            level: 1,
            type: 'attention-cue',
            trigger: 'parent'
        }
    }));

    assert(session.totalTrials === 1, 'Total trials should increment');
    assert(session.scaffoldedCount === 1, 'Scaffolded count should increment');
    assert(session.hintUsageCount === 1, 'Hint usage count should increment when scaffold is used');
    assert(session.accuracy === 1, 'Scaffolded correct trial should count as accurate');
    assert(session.highestDifficultyReached === 3, 'Highest difficulty should update');

    console.log('Scaffolded trial aggregation test passed');
}

function testFailedTrialAggregation() {
    const session = createSessionResult({ gameId: 'attributeExplorer' });
    recordTrial(session, createTrial({
        resultStatus: 'failed',
        isCorrect: false,
        selectedAnswer: 'different',
        difficultyLevel: 4,
        reactionTimeMs: 700
    }));

    assert(session.totalTrials === 1, 'Total trials should increment');
    assert(session.failedCount === 1, 'Failed count should increment');
    assert(session.accuracy === 0, 'Failed trial should not count as accurate');
    assert(session.highestDifficultyReached === 4, 'Highest difficulty should still update for failed trials');

    console.log('Failed trial aggregation test passed');
}

function testAccuracyCalculation() {
    const session = createSessionResult({ gameId: 'attributeExplorer' });
    recordTrial(session, createTrial({ resultStatus: 'independent', isCorrect: true }));
    recordTrial(session, createTrial({ resultStatus: 'scaffolded', isCorrect: true, scaffold: { used: true, level: 1, type: 'attention-cue', trigger: 'parent' } }));
    recordTrial(session, createTrial({ resultStatus: 'failed', isCorrect: false }));
    finalizeSession(session);

    assert(session.accuracy === 2 / 3, `Accuracy should be 2/3, got ${session.accuracy}`);

    console.log('Accuracy calculation test passed');
}

function testAverageReactionTime() {
    const session = createSessionResult({ gameId: 'attributeExplorer' });
    recordTrial(session, createTrial({ reactionTimeMs: 500 }));
    recordTrial(session, createTrial({ reactionTimeMs: 700 }));
    recordTrial(session, createTrial({ reactionTimeMs: 900 }));

    assert(session.averageReactionTimeMs === 700, `Average reaction time should be 700, got ${session.averageReactionTimeMs}`);

    console.log('Average reaction time test passed');
}

function testHighestDifficulty() {
    const session = createSessionResult({ gameId: 'attributeExplorer' });
    recordTrial(session, createTrial({ difficultyLevel: 2 }));
    recordTrial(session, createTrial({ difficultyLevel: 5 }));
    recordTrial(session, createTrial({ difficultyLevel: 3 }));

    assert(session.highestDifficultyReached === 5, 'Highest difficulty should be the maximum encountered');

    console.log('Highest difficulty test passed');
}

function testHintCount() {
    const session = createSessionResult({ gameId: 'attributeExplorer' });
    recordTrial(session, createTrial({ scaffold: { used: false, level: 0, type: null, trigger: null } }));
    recordTrial(session, createTrial({
        resultStatus: 'scaffolded',
        scaffold: { used: true, level: 1, type: 'attention-cue', trigger: 'parent' }
    }));
    recordTrial(session, createTrial({
        resultStatus: 'failed',
        isCorrect: false,
        scaffold: { used: true, level: 2, type: 'attribute-highlight', trigger: 'wrong-answer' }
    }));

    assert(session.hintUsageCount === 2, `Hint count should be 2, got ${session.hintUsageCount}`);

    console.log('Hint count test passed');
}

function runAllTests() {
    console.log('=== Session Result Unit Tests ===');
    testEmptySession();
    testIndependentTrialAggregation();
    testScaffoldedTrialAggregation();
    testFailedTrialAggregation();
    testAccuracyCalculation();
    testAverageReactionTime();
    testHighestDifficulty();
    testHintCount();
    console.log('=== All Session Result Tests Passed ===');
}

export { runAllTests };
