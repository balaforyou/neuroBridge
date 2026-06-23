export const SCHULTE_LEVEL_STATUS = {
    LEARN: 'Learn',
    PRACTICE: 'Practice',
    MEMORY: 'Memory',
    MASTERY_CANDIDATE: 'Mastery Candidate',
    MASTERED: 'Mastered',
    FLUENCY_CANDIDATE: 'Fluency Candidate',
    FLUENT: 'Fluent'
};

export const SCHULTE_PROGRESSION_STATUS = {
    LOCKED: 'Locked',
    ELIGIBLE: 'Eligible',
    UNLOCKED: 'Unlocked'
};

export const DEFAULT_SCHULTE_MASTERY_RULES = {
    accuracyThreshold: 0.99,
    minimumSessionCount: 3,
    stableCompletionTimeRangePercent: 0.15,
    fluencyMinimumSessionCount: 3,
    fluencyTargetSeconds: null
};

export function createSchulteMasteryAnalytics(sessions = [], options = {}) {
    const level = normalizeLevel(options.level);
    const relevantSessions = sessions
        .map(normalizeSession)
        .filter(session => session.level === level && session.completed);
    const accuracyTrend = relevantSessions.map(session => session.accuracy);
    const completionTimeTrend = relevantSessions.map(session => session.durationSeconds);
    const errorTrend = relevantSessions.map(session => session.errorCount);
    const latestSession = relevantSessions[relevantSessions.length - 1] || null;

    return {
        level,
        gridSize: latestSession?.gridSize || getDefaultGridSizeForLevel(level),
        sessionCount: relevantSessions.length,
        accuracyTrend,
        completionTimeTrend,
        errorTrend,
        averageAccuracy: average(accuracyTrend),
        averageCompletionTimeSeconds: average(completionTimeTrend),
        averageErrorCount: average(errorTrend),
        lastCompletedSessionTimestamp: latestSession?.sessionTimestamp || null,
        modeEvidence: createModeEvidence(relevantSessions)
    };
}

export function evaluateSchulteMastery(analytics = {}, rules = {}) {
    const normalizedRules = normalizeMasteryRules(rules);
    const sessionCount = clampNonNegativeInteger(analytics.sessionCount);
    const accuracyTrend = normalizeNumberArray(analytics.accuracyTrend);
    const completionTimeTrend = normalizeNumberArray(analytics.completionTimeTrend);
    const errorTrend = normalizeNumberArray(analytics.errorTrend);
    const averageAccuracy = accuracyTrend.length ? average(accuracyTrend) : 0;
    const accuracyReady = sessionCount >= normalizedRules.minimumSessionCount &&
        averageAccuracy >= normalizedRules.accuracyThreshold;
    const completionTimesStable = hasStableCompletionTimes(
        completionTimeTrend,
        normalizedRules.stableCompletionTimeRangePercent,
        normalizedRules.minimumSessionCount
    );
    const errorsReducing = isNonIncreasing(errorTrend);
    const mastered = accuracyReady && completionTimesStable && errorsReducing;
    const fluencyReady = mastered &&
        sessionCount >= normalizedRules.fluencyMinimumSessionCount &&
        isFluencyReady(completionTimeTrend, normalizedRules.fluencyTargetSeconds);

    return {
        level: normalizeLevel(analytics.level),
        levelStatus: determineLevelStatus({
            sessionCount,
            accuracyReady,
            completionTimesStable,
            mastered,
            fluencyReady,
            fluencySessionReady: sessionCount >= normalizedRules.fluencyMinimumSessionCount
        }),
        sessionCount,
        accuracyReady,
        completionTimesStable,
        errorsReducing,
        masteryAchieved: mastered,
        fluencyAchieved: fluencyReady,
        lastCompletedSessionTimestamp: analytics.lastCompletedSessionTimestamp || null,
        rules: normalizedRules
    };
}

export function evaluateSchulteProgression({
    currentLevel = 1,
    targetLevel = 2,
    currentLevelEvaluation = null,
    unlockedLevels = []
} = {}) {
    const normalizedTargetLevel = normalizeLevel(targetLevel);
    const unlockedLevelSet = new Set(unlockedLevels.map(normalizeLevel));

    if (unlockedLevelSet.has(normalizedTargetLevel)) {
        return {
            currentLevel: normalizeLevel(currentLevel),
            targetLevel: normalizedTargetLevel,
            progressionStatus: SCHULTE_PROGRESSION_STATUS.UNLOCKED,
            eligible: true,
            automaticPromotion: false
        };
    }

    const eligible = currentLevelEvaluation?.levelStatus === SCHULTE_LEVEL_STATUS.FLUENT;

    return {
        currentLevel: normalizeLevel(currentLevel),
        targetLevel: normalizedTargetLevel,
        progressionStatus: eligible
            ? SCHULTE_PROGRESSION_STATUS.ELIGIBLE
            : SCHULTE_PROGRESSION_STATUS.LOCKED,
        eligible,
        automaticPromotion: false
    };
}

export function createSchulteMasterySnapshot({
    sessions = [],
    level = 1,
    targetLevel = level + 1,
    unlockedLevels = [],
    rules = {}
} = {}) {
    const levelAnalytics = createSchulteMasteryAnalytics(sessions, { level });
    const masteryEvaluation = evaluateSchulteMastery(levelAnalytics, rules);
    const progressionEvaluation = evaluateSchulteProgression({
        currentLevel: level,
        targetLevel,
        currentLevelEvaluation: masteryEvaluation,
        unlockedLevels
    });

    return {
        levelAnalytics,
        masteryEvaluation,
        progressionEvaluation
    };
}

function normalizeMasteryRules(rules = {}) {
    return {
        accuracyThreshold: normalizeRatio(rules.accuracyThreshold, DEFAULT_SCHULTE_MASTERY_RULES.accuracyThreshold),
        minimumSessionCount: Math.max(1, clampNonNegativeInteger(rules.minimumSessionCount ?? DEFAULT_SCHULTE_MASTERY_RULES.minimumSessionCount)),
        stableCompletionTimeRangePercent: normalizeRatio(
            rules.stableCompletionTimeRangePercent,
            DEFAULT_SCHULTE_MASTERY_RULES.stableCompletionTimeRangePercent
        ),
        fluencyMinimumSessionCount: Math.max(1, clampNonNegativeInteger(rules.fluencyMinimumSessionCount ?? DEFAULT_SCHULTE_MASTERY_RULES.fluencyMinimumSessionCount)),
        fluencyTargetSeconds: Number.isFinite(Number(rules.fluencyTargetSeconds))
            ? Math.max(0, Number(rules.fluencyTargetSeconds))
            : DEFAULT_SCHULTE_MASTERY_RULES.fluencyTargetSeconds
    };
}

function normalizeSession(session = {}) {
    const accuracy = Number.isFinite(Number(session.accuracyPercent))
        ? normalizeRatio(Number(session.accuracyPercent) / 100, 0)
        : normalizeRatio(session.accuracy, 0);

    return {
        level: normalizeLevel(session.level),
        gridSize: Number(session.gridSize || 0) || getDefaultGridSizeForLevel(session.level),
        accuracy,
        durationSeconds: clampNonNegativeInteger(session.durationSeconds ?? session.sessionLengthSeconds),
        errorCount: clampNonNegativeInteger(session.incorrectSelections ?? session.mistakeCount),
        completed: session.completed === true || session.completionStatus === 'completed',
        sessionTimestamp: session.sessionTimestamp || session.createdAt || null,
        modesPlayed: Array.isArray(session.modesPlayed) ? session.modesPlayed.slice() : []
    };
}

function determineLevelStatus({
    sessionCount,
    accuracyReady,
    completionTimesStable,
    mastered,
    fluencyReady,
    fluencySessionReady
}) {
    if (fluencyReady) return SCHULTE_LEVEL_STATUS.FLUENT;
    if (mastered && fluencySessionReady) return SCHULTE_LEVEL_STATUS.FLUENCY_CANDIDATE;
    if (mastered) return SCHULTE_LEVEL_STATUS.MASTERED;
    if (accuracyReady && completionTimesStable) return SCHULTE_LEVEL_STATUS.MASTERY_CANDIDATE;
    if (sessionCount >= 2) return SCHULTE_LEVEL_STATUS.MEMORY;
    if (sessionCount === 1) return SCHULTE_LEVEL_STATUS.PRACTICE;
    return SCHULTE_LEVEL_STATUS.LEARN;
}

function createModeEvidence(sessions) {
    const counts = {};

    sessions.forEach(session => {
        session.modesPlayed.forEach(mode => {
            counts[mode] = (counts[mode] || 0) + 1;
        });
    });

    return counts;
}

function hasStableCompletionTimes(values, rangePercent, minimumCount) {
    if (values.length < minimumCount) return false;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = average(values);

    if (mean === 0) return max === 0;
    return ((max - min) / mean) <= rangePercent;
}

function isFluencyReady(values, targetSeconds) {
    if (!Number.isFinite(Number(targetSeconds))) {
        return false;
    }

    return values.length > 0 && average(values) <= Number(targetSeconds);
}

function isNonIncreasing(values) {
    if (values.length < 2) return true;

    for (let index = 1; index < values.length; index += 1) {
        if (values[index] > values[index - 1]) {
            return false;
        }
    }

    return true;
}

function average(values) {
    if (!values.length) return 0;
    return Math.round((values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length) * 100) / 100;
}

function normalizeNumberArray(values) {
    return Array.isArray(values)
        ? values.map(value => Number(value)).filter(Number.isFinite)
        : [];
}

function normalizeLevel(level = 1) {
    const number = Number(level);
    return Number.isFinite(number) && number > 0 ? Math.round(number) : 1;
}

function getDefaultGridSizeForLevel(level = 1) {
    return normalizeLevel(level) >= 2 ? 4 : 3;
}

function normalizeRatio(value, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(1, Math.max(0, number));
}

function clampNonNegativeInteger(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) return 0;
    return Math.round(number);
}
