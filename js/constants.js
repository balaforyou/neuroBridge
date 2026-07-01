// js/constants.js

export const GAME_EVENTS = {
    INIT: 'INITIALIZE_GAME_RULES',
    COMPLETE: 'GAME_OVER_SUBMIT_SCORE',
    ERROR: 'GAME_ERROR'
};

export const USER_ROLES = {
    PARENT: 'parent',
    STUDENT: 'student'
};

export const GAME_IDS = {
    MATRIX_REASONING: 'matrixReasoning',
    ATTRIBUTE_EXPLORER: 'attributeExplorer',
    MATCHING_WORKSHEET: 'matchingWorksheet',
    ATTRIBUTE_MATCHING_WORKSHEET: 'attributeMatchingWorksheet',
    PATTERN_MEMORY: 'patternMemory',
    KUMON_QUIZ: 'kumonQuiz',
    SCHULTE: 'schulte',
    SOCIAL_DETECTIVE: 'socialDetective',
    DIRECTIONS: 'directions'
};

export const DEFAULT_GAME_CONFIG = {
    maxDifficultyCeiling: 5,
    timeLimitSeconds: 45,
    trialsPerBlock: 10,
    forcedStageOverride: 0,
    operation: '+',
    level: 1,
    arithmeticMode: 'bridge',
    aMin: 1,
    aMax: 2,
    bMin: 1,
    bMax: 2,
    questionCount: 10,
    questionsPerScreen: 5,
    hintsEnabled: true,
    autoProgression: false,
    questionOrder: 'sequential'
};
