/**
 * Unit tests for reusable NeuroBridge analytics aggregation.
 */

import {
    aggregateAnalytics,
    getCognitiveTargetMetrics,
    getDomainMetrics,
    getGameMetrics,
    getSkillMetrics
} from '../analyticsAggregator.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createTrial(overrides = {}) {
    return {
        resultStatus: 'independent',
        reactionTimeMs: 500,
        scaffold: {
            used: false,
            level: 0,
            type: null,
            trigger: null
        },
        ...overrides
    };
}

function createSession(overrides = {}) {
    const trialResults = overrides.trialResults || [
        createTrial(),
        createTrial({ resultStatus: 'failed', reactionTimeMs: 900 })
    ];

    const independentCount = trialResults.filter(trial => trial.resultStatus === 'independent').length;
    const scaffoldedCount = trialResults.filter(trial => trial.resultStatus === 'scaffolded').length;
    const failedCount = trialResults.filter(trial => trial.resultStatus === 'failed').length;
    const hintUsageCount = trialResults.filter(trial => trial.scaffold?.used === true).length;
    const averageReactionTimeMs = Math.round(
        trialResults.reduce((sum, trial) => sum + Number(trial.reactionTimeMs || 0), 0) / trialResults.length
    );

    return {
        sessionId: `session-${Math.random()}`,
        gameId: 'attributeExplorer',
        totalTrials: trialResults.length,
        independentCount,
        scaffoldedCount,
        failedCount,
        accuracy: (independentCount + scaffoldedCount) / trialResults.length,
        averageReactionTimeMs,
        hintUsageCount,
        trialResults,
        ...overrides
    };
}

function testEmptyInputHandling() {
    const analytics = aggregateAnalytics([]);

    assert(Array.isArray(analytics.gameMetrics), 'gameMetrics should be an array');
    assert(Array.isArray(analytics.domainMetrics), 'domainMetrics should be an array');
    assert(Array.isArray(analytics.skillMetrics), 'skillMetrics should be an array');
    assert(Array.isArray(analytics.cognitiveTargetMetrics), 'cognitiveTargetMetrics should be an array');
    assert(analytics.gameMetrics.length === 0, 'Empty input should produce no game metrics');
    assert(analytics.domainMetrics.length === 0, 'Empty input should produce no domain metrics');
    assert(getGameMetrics('attributeExplorer') === null, 'Helper should return null after empty aggregation');

    console.log('Empty input handling test passed');
}

function testGameAggregation() {
    const analytics = aggregateAnalytics([
        createSession({
            gameId: 'attributeExplorer',
            trialResults: [
                createTrial({ resultStatus: 'independent', reactionTimeMs: 400 }),
                createTrial({
                    resultStatus: 'scaffolded',
                    reactionTimeMs: 800,
                    scaffold: { used: true, level: 1, type: 'attention-cue', trigger: 'parent' }
                })
            ]
        }),
        createSession({
            gameId: 'attributeExplorer',
            trialResults: [
                createTrial({ resultStatus: 'failed', reactionTimeMs: 1000 })
            ]
        })
    ]);

    const metric = analytics.gameMetrics.find(item => item.id === 'attributeExplorer');

    assert(metric, 'Attribute Explorer game metric should exist');
    assert(metric.sessions === 2, 'Game metric should count sessions');
    assert(metric.trials === 3, 'Game metric should count trials');
    assert(metric.independentCount === 1, 'Game metric should count independent trials');
    assert(metric.scaffoldedCount === 1, 'Game metric should count scaffolded trials');
    assert(metric.failedCount === 1, 'Game metric should count failed trials');
    assert(metric.hintUsageCount === 1, 'Game metric should count hint usage');
    assert(metric.trend.improving === false, 'Trend should default to not improving');
    assert(getGameMetrics('attributeExplorer').sessions === 2, 'getGameMetrics should read latest aggregation');

    console.log('Game aggregation test passed');
}

function testDomainAggregation() {
    aggregateAnalytics([
        createSession({ gameId: 'attributeExplorer' }),
        createSession({
            gameId: 'matrixReasoning',
            trialResults: [
                createTrial({ resultStatus: 'independent', reactionTimeMs: 600 })
            ]
        })
    ]);

    const conceptMetric = getDomainMetrics('concept-formation');
    const reasoningMetric = getDomainMetrics('reasoning');

    assert(conceptMetric.sessions === 1, 'Concept formation domain should include Attribute Explorer session');
    assert(conceptMetric.trials === 2, 'Concept formation domain should count Attribute Explorer trials');
    assert(reasoningMetric.sessions === 1, 'Reasoning domain should include Matrix session');
    assert(reasoningMetric.trials === 1, 'Reasoning domain should count Matrix trials');

    console.log('Domain aggregation test passed');
}

function testSkillAggregation() {
    aggregateAnalytics([
        createSession({
            gameId: 'attributeExplorer',
            trialResults: [
                createTrial({ resultStatus: 'independent', reactionTimeMs: 500 }),
                createTrial({ resultStatus: 'failed', reactionTimeMs: 700 })
            ]
        })
    ]);

    const sameDifferentMetric = getSkillMetrics('same-different');
    const colorMetric = getSkillMetrics('color-discrimination');

    assert(sameDifferentMetric.sessions === 1, 'Same/different skill should include Attribute Explorer session');
    assert(sameDifferentMetric.trials === 2, 'Same/different skill should count trials');
    assert(colorMetric.sessions === 1, 'Color discrimination skill should include same session');
    assert(getSkillMetrics('missing-skill') === null, 'Missing skill should return null');

    console.log('Skill aggregation test passed');
}

function testCognitiveTargetAggregation() {
    aggregateAnalytics([
        createSession({
            gameId: 'matrixReasoning',
            trialResults: [
                createTrial({ resultStatus: 'independent', reactionTimeMs: 500 })
            ]
        }),
        createSession({
            gameId: 'attributeExplorer',
            trialResults: [
                createTrial({ resultStatus: 'scaffolded', reactionTimeMs: 900 })
            ]
        })
    ]);

    const visualDiscriminationMetric = getCognitiveTargetMetrics('visual-discrimination');
    const abstractReasoningMetric = getCognitiveTargetMetrics('abstract-reasoning');
    const conceptFormationMetric = getCognitiveTargetMetrics('concept-formation');

    assert(visualDiscriminationMetric.sessions === 2, 'Shared cognitive target should aggregate both games');
    assert(visualDiscriminationMetric.trials === 2, 'Shared cognitive target should count both games trials');
    assert(abstractReasoningMetric.sessions === 1, 'Matrix cognitive target should aggregate Matrix only');
    assert(conceptFormationMetric.sessions === 1, 'Attribute cognitive target should aggregate Attribute only');

    console.log('Cognitive target aggregation test passed');
}

function testAccuracyCalculation() {
    aggregateAnalytics([
        createSession({
            gameId: 'attributeExplorer',
            trialResults: [
                createTrial({ resultStatus: 'independent' }),
                createTrial({ resultStatus: 'scaffolded' }),
                createTrial({ resultStatus: 'failed' }),
                createTrial({ resultStatus: 'failed' })
            ]
        })
    ]);

    const metric = getGameMetrics('attributeExplorer');

    assert(metric.accuracy === 0.5, `Accuracy should be 0.5, got ${metric.accuracy}`);

    console.log('Accuracy calculation test passed');
}

function testReactionTimeCalculation() {
    aggregateAnalytics([
        createSession({
            gameId: 'attributeExplorer',
            trialResults: [
                createTrial({ reactionTimeMs: 300 }),
                createTrial({ reactionTimeMs: 600 })
            ]
        }),
        createSession({
            gameId: 'attributeExplorer',
            trialResults: [
                createTrial({ reactionTimeMs: 900 })
            ]
        })
    ]);

    const metric = getGameMetrics('attributeExplorer');

    assert(metric.averageReactionTimeMs === 600, `Average reaction time should be 600, got ${metric.averageReactionTimeMs}`);

    console.log('Reaction time calculation test passed');
}

function runAllTests() {
    console.log('=== Analytics Aggregator Unit Tests ===');
    testEmptyInputHandling();
    testGameAggregation();
    testDomainAggregation();
    testSkillAggregation();
    testCognitiveTargetAggregation();
    testAccuracyCalculation();
    testReactionTimeCalculation();
    console.log('=== All Analytics Aggregator Tests Passed ===');
}

export { runAllTests };
