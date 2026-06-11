import { createSessionId } from './trialResult.js';

export function createSessionResult({
    sessionId = createSessionId(),
    learnerId = null,
    gameId,
    domain = null,
    startedAt = new Date().toISOString()
} = {}) {
    return {
        sessionId,
        learnerId,
        gameId,
        domain,
        startedAt,
        endedAt: null,
        totalTrials: 0,
        independentCount: 0,
        scaffoldedCount: 0,
        failedCount: 0,
        accuracy: 0,
        averageReactionTimeMs: 0,
        hintUsageCount: 0,
        highestDifficultyReached: 0,
        trialResults: []
    };
}

export function recordTrial(sessionResult, trialResult) {
    if (!sessionResult || !trialResult) {
        throw new Error('recordTrial requires a sessionResult and trialResult');
    }

    sessionResult.trialResults.push(trialResult);
    sessionResult.totalTrials = sessionResult.trialResults.length;

    if (trialResult.resultStatus === 'independent') {
        sessionResult.independentCount += 1;
    } else if (trialResult.resultStatus === 'scaffolded') {
        sessionResult.scaffoldedCount += 1;
    } else if (trialResult.resultStatus === 'failed') {
        sessionResult.failedCount += 1;
    }

    if (trialResult.scaffold?.used === true) {
        sessionResult.hintUsageCount += 1;
    }

    const difficultyLevel = Number(trialResult.difficultyLevel || 0);
    sessionResult.highestDifficultyReached = Math.max(
        sessionResult.highestDifficultyReached,
        difficultyLevel
    );

    updateDerivedMetrics(sessionResult);
    return sessionResult;
}

export function finalizeSession(sessionResult) {
    if (!sessionResult) {
        throw new Error('finalizeSession requires a sessionResult');
    }

    updateDerivedMetrics(sessionResult);
    sessionResult.endedAt = new Date().toISOString();
    return sessionResult;
}

function updateDerivedMetrics(sessionResult) {
    const totalTrials = sessionResult.totalTrials;
    const successfulTrials = sessionResult.independentCount + sessionResult.scaffoldedCount;

    sessionResult.accuracy = totalTrials ? successfulTrials / totalTrials : 0;
    sessionResult.averageReactionTimeMs = calculateAverageReactionTime(sessionResult.trialResults);
}

function calculateAverageReactionTime(trialResults) {
    if (!trialResults.length) return 0;

    const totalReactionTime = trialResults.reduce(
        (sum, trial) => sum + Number(trial.reactionTimeMs || 0),
        0
    );

    return Math.round(totalReactionTime / trialResults.length);
}
