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
    const attributeMetric = getSkillMetrics('attribute-comparison');
    const visualAttentionMetric = getSkillMetrics('visual-attention');

    assert(sameDifferentMetric.sessions === 1, 'Same/different skill should include Attribute Explorer session');
    assert(sameDifferentMetric.trials === 2, 'Same/different skill should count trials');
    assert(attributeMetric.sessions === 1, 'Attribute comparison skill should include same session');
    assert(visualAttentionMetric.sessions === 1, 'Visual attention skill should include same session');
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

    const featureDiscriminationMetric = getCognitiveTargetMetrics('feature-discrimination');
    const comparativeAnalysisMetric = getCognitiveTargetMetrics('comparative-analysis');
    const mentalTransformationMetric = getCognitiveTargetMetrics('mental-transformation');
    const visualInhibitionMetric = getCognitiveTargetMetrics('visual-inhibition');

    assert(featureDiscriminationMetric.sessions === 1, 'Same/different target should aggregate Attribute Explorer');
    assert(comparativeAnalysisMetric.sessions === 1, 'Attribute comparison target should aggregate Attribute Explorer');
    assert(mentalTransformationMetric.sessions === 1, 'Visual reasoning target should aggregate Matrix');
    assert(visualInhibitionMetric.sessions === 1, 'Pattern recognition target should aggregate Matrix');
    assert(getCognitiveTargetMetrics('visual-discrimination') === null, 'Old direct game target should not be used');

    console.log('Cognitive target aggregation test passed');
}

function testCognitiveTargetsDerivedThroughOntology() {
    aggregateAnalytics([
        createSession({
            gameId: 'attributeExplorer',
            trialResults: [
                createTrial({ resultStatus: 'independent', reactionTimeMs: 500 })
            ]
        })
    ]);

    assert(getCognitiveTargetMetrics('feature-discrimination').trials === 1, 'same-different ontology target should receive trials');
    assert(getCognitiveTargetMetrics('comparative-analysis').trials === 1, 'attribute-comparison ontology target should receive trials');
    assert(getCognitiveTargetMetrics('sustained-attention').trials === 1, 'visual-attention ontology target should receive trials');
    assert(getCognitiveTargetMetrics('categorization') === null, 'Deprecated direct game target should not receive trials');

    console.log('Ontology-derived cognitive target test passed');
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

function testUnknownGameWarningAndSkip() {
    const originalWarn = console.warn;
    const warnings = [];
    console.warn = (...args) => {
        warnings.push(args);
    };

    try {
        const analytics = aggregateAnalytics([
            createSession({ gameId: 'missingGame' }),
            createSession({ gameId: 'schulte' })
        ]);

        assert(warnings.length === 1, 'Unknown game should produce one warning');
        assert(warnings[0][0] === '[NeuroBridge Analytics] Unknown gameId skipped:', 'Warning should use stable prefix');
        assert(warnings[0][1] === 'missingGame', 'Warning should include unknown game id');
        assert(!analytics.gameMetrics.some(metric => metric.id === 'missingGame'), 'Unknown game should be skipped from game metrics');
        assert(analytics.gameMetrics.some(metric => metric.id === 'schulte'), 'Registered Schulte activity should not be skipped');
        assert(getDomainMetrics('visual-search').sessions === 1, 'Registered Schulte activity should aggregate by domain');
    } finally {
        console.warn = originalWarn;
    }

    console.log('Unknown game warning and registered skip guard test passed');
}

function runAllTests() {
    console.log('=== Analytics Aggregator Unit Tests ===');
    testEmptyInputHandling();
    testGameAggregation();
    testDomainAggregation();
    testSkillAggregation();
    testCognitiveTargetAggregation();
    testCognitiveTargetsDerivedThroughOntology();
    testAccuracyCalculation();
    testReactionTimeCalculation();
    testUnknownGameWarningAndSkip();
    console.log('=== All Analytics Aggregator Tests Passed ===');
}

export { runAllTests };
