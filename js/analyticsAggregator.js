import { getGameById } from './gameRegistry.js';
import { getCognitiveTargetsForSkill } from './cognitiveOntology.js';

const EMPTY_ANALYTICS = {
    gameMetrics: [],
    domainMetrics: [],
    skillMetrics: [],
    cognitiveTargetMetrics: []
};

let latestAnalytics = cloneAnalytics(EMPTY_ANALYTICS);

export function aggregateAnalytics(sessionResults = []) {
    const gameBuckets = new Map();
    const domainBuckets = new Map();
    const skillBuckets = new Map();
    const cognitiveTargetBuckets = new Map();

    for (const sessionResult of sessionResults) {
        if (!sessionResult || !sessionResult.gameId) {
            continue;
        }

        const game = getGameById(sessionResult.gameId);
        if (!game) {
            console.warn('[NeuroBridge Analytics] Unknown gameId skipped:', sessionResult.gameId);
            continue;
        }

        const sessionStats = getSessionStats(sessionResult);
        addToBucket(gameBuckets, sessionResult.gameId, sessionStats);
        addToBucket(domainBuckets, game.domain, sessionStats);

        for (const skillId of game.skills || []) {
            addToBucket(skillBuckets, skillId, sessionStats);
            for (const targetId of getCognitiveTargetsForSkill(skillId)) {
                addToBucket(cognitiveTargetBuckets, targetId, sessionStats);
            }
        }
    }

    latestAnalytics = {
        gameMetrics: bucketsToMetrics(gameBuckets),
        domainMetrics: bucketsToMetrics(domainBuckets),
        skillMetrics: bucketsToMetrics(skillBuckets),
        cognitiveTargetMetrics: bucketsToMetrics(cognitiveTargetBuckets)
    };

    return cloneAnalytics(latestAnalytics);
}

export function getGameMetrics(gameId) {
    return findMetric(latestAnalytics.gameMetrics, gameId);
}

export function getDomainMetrics(domainId) {
    return findMetric(latestAnalytics.domainMetrics, domainId);
}

export function getSkillMetrics(skillId) {
    return findMetric(latestAnalytics.skillMetrics, skillId);
}

export function getCognitiveTargetMetrics(targetId) {
    return findMetric(latestAnalytics.cognitiveTargetMetrics, targetId);
}

function createBucket(id) {
    return {
        id,
        sessions: 0,
        trials: 0,
        independentCount: 0,
        scaffoldedCount: 0,
        failedCount: 0,
        reactionTimeTotal: 0,
        hintUsageCount: 0
    };
}

function addToBucket(buckets, id, sessionStats) {
    if (!id) return;

    if (!buckets.has(id)) {
        buckets.set(id, createBucket(id));
    }

    const bucket = buckets.get(id);
    bucket.sessions += 1;
    bucket.trials += sessionStats.trials;
    bucket.independentCount += sessionStats.independentCount;
    bucket.scaffoldedCount += sessionStats.scaffoldedCount;
    bucket.failedCount += sessionStats.failedCount;
    bucket.reactionTimeTotal += sessionStats.reactionTimeTotal;
    bucket.hintUsageCount += sessionStats.hintUsageCount;
}

function bucketsToMetrics(buckets) {
    return Array.from(buckets.values()).map(bucket => {
        const successfulTrials = bucket.independentCount + bucket.scaffoldedCount;

        return {
            id: bucket.id,
            sessions: bucket.sessions,
            trials: bucket.trials,
            independentCount: bucket.independentCount,
            scaffoldedCount: bucket.scaffoldedCount,
            failedCount: bucket.failedCount,
            accuracy: bucket.trials ? successfulTrials / bucket.trials : 0,
            averageReactionTimeMs: bucket.trials
                ? Math.round(bucket.reactionTimeTotal / bucket.trials)
                : 0,
            hintUsageCount: bucket.hintUsageCount,
            trend: {
                improving: false
            }
        };
    });
}

function getSessionStats(sessionResult) {
    const trialResults = Array.isArray(sessionResult.trialResults)
        ? sessionResult.trialResults
        : [];
    const trials = Number(sessionResult.totalTrials ?? trialResults.length) || 0;

    return {
        trials,
        independentCount: getCount(sessionResult, trialResults, 'independentCount', 'independent'),
        scaffoldedCount: getCount(sessionResult, trialResults, 'scaffoldedCount', 'scaffolded'),
        failedCount: getCount(sessionResult, trialResults, 'failedCount', 'failed'),
        reactionTimeTotal: getReactionTimeTotal(sessionResult, trialResults, trials),
        hintUsageCount: getHintUsageCount(sessionResult, trialResults)
    };
}

function getCount(sessionResult, trialResults, summaryKey, resultStatus) {
    if (Number.isFinite(sessionResult[summaryKey])) {
        return Number(sessionResult[summaryKey]);
    }

    return trialResults.filter(trial => trial.resultStatus === resultStatus).length;
}

function getReactionTimeTotal(sessionResult, trialResults, trials) {
    if (trialResults.length) {
        return trialResults.reduce(
            (sum, trial) => sum + (Number(trial.reactionTimeMs) || 0),
            0
        );
    }

    return (Number(sessionResult.averageReactionTimeMs) || 0) * trials;
}

function getHintUsageCount(sessionResult, trialResults) {
    if (Number.isFinite(sessionResult.hintUsageCount)) {
        return Number(sessionResult.hintUsageCount);
    }

    return trialResults.filter(trial => trial.scaffold?.used === true).length;
}

function findMetric(metrics, id) {
    const metric = metrics.find(item => item.id === id);
    return metric ? cloneMetric(metric) : null;
}

function cloneAnalytics(analytics) {
    return {
        gameMetrics: analytics.gameMetrics.map(cloneMetric),
        domainMetrics: analytics.domainMetrics.map(cloneMetric),
        skillMetrics: analytics.skillMetrics.map(cloneMetric),
        cognitiveTargetMetrics: analytics.cognitiveTargetMetrics.map(cloneMetric)
    };
}

function cloneMetric(metric) {
    return {
        ...metric,
        trend: {
            ...metric.trend
        }
    };
}
