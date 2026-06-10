export const SCAFFOLD_LEVELS = {
    INDEPENDENT: 0,
    ATTENTION_CUE: 1,
    ATTRIBUTE_HIGHLIGHT: 2,
    CHOICE_REDUCTION: 3,
    MODEL_ANSWER: 4
};

export function createSessionId(prefix = 'session') {
    return createId(prefix);
}

export function createTrialId(prefix = 'trial') {
    return createId(prefix);
}

export function createDefaultScaffold() {
    return {
        used: false,
        level: SCAFFOLD_LEVELS.INDEPENDENT,
        type: null,
        trigger: null
    };
}

export function createTrialResult({
    gameId,
    learnerId = null,
    sessionId,
    trialId,
    timestamp = new Date().toISOString(),
    taskType,
    stage = 1,
    difficultyLevel = stage,
    prompt = null,
    correctAnswer,
    selectedAnswer = null,
    isCorrect = false,
    attempts = 1,
    reactionTimeMs = 0,
    scaffold = createDefaultScaffold(),
    attributes = {},
    metadata = {}
}) {
    const normalizedScaffold = normalizeScaffold(scaffold);

    return {
        gameId,
        learnerId,
        sessionId,
        trialId,
        timestamp,
        taskType,
        stage,
        difficultyLevel,
        prompt,
        correctAnswer,
        selectedAnswer,
        isCorrect,
        resultStatus: resolveResultStatus(isCorrect, normalizedScaffold),
        attempts,
        reactionTimeMs,
        scaffold: normalizedScaffold,
        attributes: { ...attributes },
        metadata: { ...metadata }
    };
}

function resolveResultStatus(isCorrect, scaffold) {
    if (!isCorrect) return 'failed';
    return scaffold.used ? 'scaffolded' : 'independent';
}

function normalizeScaffold(scaffold = {}) {
    const level = Number.isInteger(scaffold.level)
        ? Math.min(Math.max(scaffold.level, 0), 4)
        : SCAFFOLD_LEVELS.INDEPENDENT;

    return {
        used: Boolean(scaffold.used || level > 0),
        level,
        type: scaffold.type || null,
        trigger: scaffold.trigger || null
    };
}

function createId(prefix) {
    const randomPart = getRandomIdPart();
    return `${prefix}-${Date.now()}-${randomPart}`;
}

function getRandomIdPart() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return Math.random().toString(36).slice(2, 10);
}
