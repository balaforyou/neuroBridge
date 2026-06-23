/**
 * Unit tests for Schulte mastery and progression evaluation.
 */

import {
    SCHULTE_LEVEL_STATUS,
    SCHULTE_PROGRESSION_STATUS,
    createSchulteMasteryAnalytics,
    createSchulteMasterySnapshot,
    evaluateSchulteMastery,
    evaluateSchulteProgression
} from '../masteryProgression.js';
import { createSchulteAnalyticsPayload } from '../game.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createSchulteSession(overrides = {}) {
    return {
        gameId: 'schulte',
        level: 1,
        gridSize: 3,
        accuracyPercent: 100,
        durationSeconds: 80,
        incorrectSelections: 0,
        completed: true,
        completionStatus: 'completed',
        modesPlayed: ['ascending', 'descending', 'listen-find'],
        sessionTimestamp: '2026-06-23T10:00:00.000Z',
        ...overrides
    };
}

function testMasteryAnalyticsAggregation() {
    const analytics = createSchulteMasteryAnalytics([
        createSchulteSession({
            accuracyPercent: 98,
            durationSeconds: 84,
            incorrectSelections: 2,
            sessionTimestamp: '2026-06-21T10:00:00.000Z'
        }),
        createSchulteSession({
            accuracyPercent: 100,
            durationSeconds: 80,
            incorrectSelections: 1,
            sessionTimestamp: '2026-06-22T10:00:00.000Z'
        }),
        createSchulteSession({
            accuracyPercent: 100,
            durationSeconds: 79,
            incorrectSelections: 0,
            sessionTimestamp: '2026-06-23T10:00:00.000Z'
        }),
        createSchulteSession({
            level: 2,
            gridSize: 4,
            accuracyPercent: 100,
            durationSeconds: 140,
            incorrectSelections: 0
        })
    ], { level: 1 });

    assert(analytics.level === 1, 'Analytics should be scoped to requested level');
    assert(analytics.gridSize === 3, 'Level 1 analytics should retain grid size');
    assert(analytics.sessionCount === 3, 'Analytics should count sessions per level');
    assert(analytics.accuracyTrend.join(',') === '0.98,1,1', 'Analytics should capture accuracy trend');
    assert(analytics.completionTimeTrend.join(',') === '84,80,79', 'Analytics should capture completion time trend');
    assert(analytics.errorTrend.join(',') === '2,1,0', 'Analytics should capture error trend');
    assert(analytics.lastCompletedSessionTimestamp === '2026-06-23T10:00:00.000Z', 'Analytics should capture latest completed timestamp');
    assert(analytics.modeEvidence.ascending === 3, 'Analytics should preserve mode evidence for future decisions');

    console.log('Schulte mastery analytics aggregation test passed');
}

function testCompletionAloneDoesNotImplyMastery() {
    const analytics = createSchulteMasteryAnalytics([
        createSchulteSession({
            accuracyPercent: 100,
            durationSeconds: 80,
            incorrectSelections: 0
        })
    ], { level: 1 });
    const evaluation = evaluateSchulteMastery(analytics, {
        accuracyThreshold: 0.99,
        minimumSessionCount: 3,
        stableCompletionTimeRangePercent: 0.15
    });

    assert(evaluation.levelStatus === SCHULTE_LEVEL_STATUS.PRACTICE, 'A single completed session should remain Practice');
    assert(evaluation.masteryAchieved === false, 'Completion alone should not imply mastery');
    assert(evaluation.fluencyAchieved === false, 'Completion alone should not imply fluency');

    console.log('Schulte completion alone mastery guard test passed');
}

function testMasteryEvaluationStateGeneration() {
    const analytics = createSchulteMasteryAnalytics([
        createSchulteSession({ durationSeconds: 80, incorrectSelections: 2 }),
        createSchulteSession({ durationSeconds: 81, incorrectSelections: 1 }),
        createSchulteSession({ durationSeconds: 79, incorrectSelections: 0 })
    ], { level: 1 });
    const evaluation = evaluateSchulteMastery(analytics, {
        accuracyThreshold: 0.99,
        minimumSessionCount: 3,
        stableCompletionTimeRangePercent: 0.15,
        fluencyMinimumSessionCount: 4,
        fluencyTargetSeconds: null
    });

    assert(evaluation.levelStatus === SCHULTE_LEVEL_STATUS.MASTERED, 'Mastered level should remain Mastered before fluency evidence is ready');
    assert(evaluation.accuracyReady === true, 'Mastery evaluation should expose accuracy readiness');
    assert(evaluation.completionTimesStable === true, 'Mastery evaluation should expose stable completion times');
    assert(evaluation.errorsReducing === true, 'Mastery evaluation should expose error trend readiness');
    assert(evaluation.masteryAchieved === true, 'Mastery should require sessions, accuracy, stable time, and reducing errors');
    assert(evaluation.fluencyAchieved === false, 'Mastery should remain separate from fluency');

    console.log('Schulte mastery evaluation state generation test passed');
}

function testFluencyCandidateStateGeneration() {
    const analytics = createSchulteMasteryAnalytics([
        createSchulteSession({ durationSeconds: 80, incorrectSelections: 0 }),
        createSchulteSession({ durationSeconds: 79, incorrectSelections: 0 }),
        createSchulteSession({ durationSeconds: 78, incorrectSelections: 0 })
    ], { level: 1 });
    const evaluation = evaluateSchulteMastery(analytics, {
        accuracyThreshold: 0.99,
        minimumSessionCount: 3,
        stableCompletionTimeRangePercent: 0.15,
        fluencyMinimumSessionCount: 3,
        fluencyTargetSeconds: null
    });

    assert(evaluation.levelStatus === SCHULTE_LEVEL_STATUS.FLUENCY_CANDIDATE, 'Mastered level should become Fluency Candidate when fluency sessions are ready but no fluency target is set');
    assert(evaluation.masteryAchieved === true, 'Fluency Candidate should preserve mastery achieved');
    assert(evaluation.fluencyAchieved === false, 'Fluency Candidate should not imply fluency');

    console.log('Schulte fluency candidate state generation test passed');
}

function testFluencyEvaluationStateGeneration() {
    const analytics = createSchulteMasteryAnalytics([
        createSchulteSession({ durationSeconds: 80, incorrectSelections: 0 }),
        createSchulteSession({ durationSeconds: 79, incorrectSelections: 0 }),
        createSchulteSession({ durationSeconds: 78, incorrectSelections: 0 })
    ], { level: 1 });
    const evaluation = evaluateSchulteMastery(analytics, {
        accuracyThreshold: 0.99,
        minimumSessionCount: 3,
        stableCompletionTimeRangePercent: 0.15,
        fluencyMinimumSessionCount: 3,
        fluencyTargetSeconds: 82
    });

    assert(evaluation.levelStatus === SCHULTE_LEVEL_STATUS.FLUENT, 'Stable mastered sessions under fluency target should become Fluent');
    assert(evaluation.masteryAchieved === true, 'Fluent state should preserve mastery');
    assert(evaluation.fluencyAchieved === true, 'Fluent state should expose fluency separately');

    console.log('Schulte fluency evaluation state generation test passed');
}

function testProgressionEligibilityStateGeneration() {
    const locked = evaluateSchulteProgression({
        currentLevel: 1,
        targetLevel: 2,
        currentLevelEvaluation: {
            levelStatus: SCHULTE_LEVEL_STATUS.FLUENCY_CANDIDATE
        }
    });
    const eligible = evaluateSchulteProgression({
        currentLevel: 1,
        targetLevel: 2,
        currentLevelEvaluation: {
            levelStatus: SCHULTE_LEVEL_STATUS.FLUENT
        }
    });
    const unlocked = evaluateSchulteProgression({
        currentLevel: 1,
        targetLevel: 2,
        currentLevelEvaluation: {
            levelStatus: SCHULTE_LEVEL_STATUS.LEARN
        },
        unlockedLevels: [2]
    });

    assert(locked.progressionStatus === SCHULTE_PROGRESSION_STATUS.LOCKED, 'Mastery without fluency should not unlock progression eligibility');
    assert(eligible.progressionStatus === SCHULTE_PROGRESSION_STATUS.ELIGIBLE, 'Fluent level should become progression eligible');
    assert(eligible.automaticPromotion === false, 'Progression eligibility should not automatically promote learner');
    assert(unlocked.progressionStatus === SCHULTE_PROGRESSION_STATUS.UNLOCKED, 'Persisted unlock state should remain separate from eligibility');

    console.log('Schulte progression eligibility state generation test passed');
}

function testMasterySnapshotCombinesAnalyticsEvaluationAndProgression() {
    const snapshot = createSchulteMasterySnapshot({
        level: 1,
        targetLevel: 2,
        sessions: [
            createSchulteSession({ durationSeconds: 80, incorrectSelections: 0 }),
            createSchulteSession({ durationSeconds: 79, incorrectSelections: 0 }),
            createSchulteSession({ durationSeconds: 78, incorrectSelections: 0 })
        ],
        rules: {
            fluencyTargetSeconds: 82
        }
    });

    assert(snapshot.levelAnalytics.sessionCount === 3, 'Snapshot should include mastery analytics');
    assert(snapshot.masteryEvaluation.levelStatus === SCHULTE_LEVEL_STATUS.FLUENT, 'Snapshot should include mastery evaluation');
    assert(snapshot.progressionEvaluation.progressionStatus === SCHULTE_PROGRESSION_STATUS.ELIGIBLE, 'Snapshot should include progression eligibility');

    console.log('Schulte mastery snapshot test passed');
}

function testSchultePayloadCarriesMasteryPersistenceFields() {
    const payload = createSchulteAnalyticsPayload({
        startedAtMs: Date.parse('2026-06-23T10:00:00.000Z'),
        endedAtMs: Date.parse('2026-06-23T10:01:20.000Z'),
        sessionTimestamp: '2026-06-23T10:00:00.000Z',
        modesPlayed: ['ascending', 'descending', 'listen-find'],
        boardsCompleted: 6,
        correctSelections: 54,
        incorrectSelections: 0,
        completed: true,
        level: 1,
        gridSize: 3
    });

    assert(payload.masteryAnalytics.sessionCount === 1, 'Payload should carry session-level mastery analytics');
    assert(payload.masteryEvaluation.levelStatus === SCHULTE_LEVEL_STATUS.PRACTICE, 'Payload should not treat single completion as mastery');
    assert(payload.masteryStatus === SCHULTE_LEVEL_STATUS.PRACTICE, 'Payload should expose persisted mastery status');
    assert(payload.progressionEvaluation.progressionStatus === SCHULTE_PROGRESSION_STATUS.LOCKED, 'Payload should keep progression locked after one session');
    assert(payload.progressionStatus === SCHULTE_PROGRESSION_STATUS.LOCKED, 'Payload should expose persisted progression status');

    console.log('Schulte analytics payload mastery persistence fields test passed');
}

function runAllTests() {
    console.log('=== Schulte Mastery Progression Tests ===');
    testMasteryAnalyticsAggregation();
    testCompletionAloneDoesNotImplyMastery();
    testMasteryEvaluationStateGeneration();
    testFluencyCandidateStateGeneration();
    testFluencyEvaluationStateGeneration();
    testProgressionEligibilityStateGeneration();
    testMasterySnapshotCombinesAnalyticsEvaluationAndProgression();
    testSchultePayloadCarriesMasteryPersistenceFields();
    console.log('=== All Schulte Mastery Progression Tests Passed ===');
}

export { runAllTests };
