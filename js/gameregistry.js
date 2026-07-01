// js/gameRegistry.js

import { GAME_IDS } from './constants.js';
import { isValidDomain } from './domainRegistry.js';
import { isValidSkill } from './skillRegistry.js';

export const DASHBOARD_VIEW_TYPES = {
    SUMMARY_WITH_CORRECTIONS: 'summaryWithCorrections',
    TRIAL_BREAKDOWN: 'trialBreakdown'
};

export const ACTIVITY_STATUS = {
    AVAILABLE: 'available',
    COMING_SOON: 'coming-soon'
};

export const GAME_REGISTRY = [
    {
        gameId: GAME_IDS.MATRIX_REASONING,
        id: GAME_IDS.MATRIX_REASONING,
        name: 'Matrix Reasoning',
        title: 'Matrix Reasoning',
        category: 'Thinking',
        learnerName: 'Pattern Detective',
        icon: 'ðŸ§©',
        status: ACTIVITY_STATUS.AVAILABLE,
        identityClass: 'from-indigo-100 via-sky-50 to-emerald-50 border-indigo-300',
        iconClass: 'from-indigo-300 via-sky-200 to-emerald-200',
        actionClass: 'bg-indigo-600 group-hover:bg-indigo-500',
        folder: 'matrixReasoning',
        enabled: true,
        domain: 'reasoning',
        description: 'Non-verbal pattern reasoning through visual and numeric matrix problems.',
        skills: [
            'pattern-recognition',
            'rule-discovery',
            'visual-reasoning'
        ],
        maxStage: 5,
        maxLevel: 5,
        maxDifficulty: 5,
        supportsScaffolds: true,
        supportsDifficulty: true,
        dashboardViewType: DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        version: '1.0.0'
    },
    {
        gameId: GAME_IDS.ATTRIBUTE_EXPLORER,
        id: GAME_IDS.ATTRIBUTE_EXPLORER,
        name: 'Attribute Explorer',
        title: 'Attribute Explorer',
        category: 'Attention',
        learnerName: 'Look Closely',
        icon: 'ðŸ‘€',
        status: ACTIVITY_STATUS.AVAILABLE,
        identityClass: 'from-cyan-100 via-emerald-50 to-lime-50 border-cyan-300',
        iconClass: 'from-cyan-300 via-emerald-200 to-lime-200',
        actionClass: 'bg-cyan-600 group-hover:bg-cyan-500',
        folder: 'attributeExplorer',
        enabled: true,
        domain: 'concept-formation',
        description: 'Attribute-based same/different comparison across color, shape, and size.',
        skills: [
            'same-different',
            'attribute-comparison',
            'visual-attention'
        ],
        maxStage: 1,
        maxLevel: 1,
        maxDifficulty: 5,
        supportsScaffolds: true,
        supportsDifficulty: true,
        dashboardViewType: DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        version: '1.0.0'
    },
    {
        gameId: GAME_IDS.MATCHING_WORKSHEET,
        id: GAME_IDS.MATCHING_WORKSHEET,
        name: 'Matching Worksheet',
        title: 'Matching Worksheet',
        category: 'Recommended',
        learnerName: 'Matching Worksheet',
        icon: '&#129513;',
        status: ACTIVITY_STATUS.AVAILABLE,
        identityClass: 'from-emerald-100 via-lime-50 to-sky-50 border-emerald-300',
        iconClass: 'from-emerald-300 via-lime-200 to-sky-200',
        actionClass: 'bg-emerald-600 group-hover:bg-emerald-500',
        folder: 'matchingWorksheet',
        enabled: true,
        domain: 'concept-formation',
        description: 'Match the same pictures.',
        skills: [
            'same-different',
            'attribute-comparison',
            'visual-attention'
        ],
        maxStage: 1,
        maxLevel: 1,
        maxDifficulty: 1,
        supportsScaffolds: true,
        supportsDifficulty: false,
        dashboardViewType: DASHBOARD_VIEW_TYPES.SUMMARY_WITH_CORRECTIONS,
        version: '1.0.0'
    },
    {
        gameId: GAME_IDS.ATTRIBUTE_MATCHING_WORKSHEET,
        id: GAME_IDS.ATTRIBUTE_MATCHING_WORKSHEET,
        name: 'Matching Worksheets',
        title: 'Attribute Matching V1',
        category: 'Recommended',
        learnerName: 'Matching Worksheets',
        subtitle: 'Attribute Matching V1',
        icon: '&#127912;',
        status: ACTIVITY_STATUS.AVAILABLE,
        identityClass: 'from-rose-100 via-amber-50 to-emerald-50 border-rose-300',
        iconClass: 'from-rose-300 via-amber-200 to-emerald-200',
        actionClass: 'bg-rose-600 group-hover:bg-rose-500',
        folder: 'attributeMatchingWorksheet',
        enabled: true,
        domain: 'concept-formation',
        description: 'Single-select worksheet practice for visible attribute recognition.',
        skills: [
            'attribute-comparison',
            'visual-attention'
        ],
        maxStage: 1,
        maxLevel: 1,
        maxDifficulty: 1,
        supportsScaffolds: true,
        supportsDifficulty: false,
        dashboardViewType: DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        version: '1.0.0'
    },
    {
        gameId: GAME_IDS.PATTERN_MEMORY,
        id: GAME_IDS.PATTERN_MEMORY,
        name: 'Pattern Memory',
        title: 'Pattern Memory',
        category: 'Recommended',
        learnerName: 'Pattern Memory',
        subtitle: 'Copy Mode',
        icon: '&#9638;',
        status: ACTIVITY_STATUS.AVAILABLE,
        identityClass: 'from-blue-100 via-sky-50 to-emerald-50 border-blue-300',
        iconClass: 'from-blue-300 via-sky-200 to-emerald-200',
        actionClass: 'bg-blue-600 group-hover:bg-blue-500',
        folder: 'patternMemory',
        enabled: true,
        domain: 'memory',
        description: 'Copy and remember patterns using visual memory.',
        skills: [
            'visual-encoding',
            'spatial-memory',
            'pattern-reproduction'
        ],
        maxStage: 1,
        maxLevel: 4,
        maxDifficulty: 4,
        supportsScaffolds: true,
        supportsDifficulty: true,
        dashboardViewType: DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        version: '1.0.0'
    },
    {
        gameId: GAME_IDS.KUMON_QUIZ,
        id: GAME_IDS.KUMON_QUIZ,
        name: 'Kumon Quiz',
        title: 'Number Bridges',
        category: 'Numbers',
        learnerName: 'Number Bridges',
        icon: 'ðŸ”¢',
        status: ACTIVITY_STATUS.AVAILABLE,
        identityClass: 'from-amber-100 via-yellow-50 to-emerald-50 border-amber-300',
        iconClass: 'from-amber-300 via-yellow-200 to-emerald-200',
        actionClass: 'bg-amber-600 group-hover:bg-amber-500',
        folder: 'kumonQuiz',
        enabled: true,
        domain: 'numeracy',
        description: 'Addition worksheet practice with scaffolded SIRAASH support.',
        skills: [
            'number-bonds',
            'arithmetic-fluency'
        ],
        maxStage: 1,
        maxLevel: 1,
        maxDifficulty: 1,
        supportsScaffolds: true,
        supportsDifficulty: false,
        dashboardViewType: DASHBOARD_VIEW_TYPES.SUMMARY_WITH_CORRECTIONS,
        version: '1.0.0'
    },
    {
        gameId: GAME_IDS.SCHULTE,
        id: GAME_IDS.SCHULTE,
        name: 'Schulte Table',
        title: 'Schulte Table',
        category: 'Attention',
        learnerName: 'Grid Vision',
        subtitle: 'Schulte Table',
        icon: 'ðŸŽ¯',
        status: ACTIVITY_STATUS.AVAILABLE,
        identityClass: 'from-sky-100 via-cyan-50 to-emerald-50 border-cyan-300',
        iconClass: 'from-sky-300 via-cyan-200 to-emerald-200',
        actionClass: 'bg-cyan-600 group-hover:bg-cyan-500',
        folder: 'schulte',
        enabled: true,
        domain: 'visual-search',
        description: 'Train your eyes to find things faster.',
        skills: [
            'visual-search',
            'visual-attention'
        ],
        maxStage: 1,
        maxLevel: 2,
        maxDifficulty: 2,
        supportsScaffolds: true,
        supportsDifficulty: true,
        dashboardViewType: DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        version: '1.0.0'
    },
    {
        gameId: GAME_IDS.SOCIAL_DETECTIVE,
        id: GAME_IDS.SOCIAL_DETECTIVE,
        name: 'Social Stories',
        title: 'Social Detective',
        category: 'Life Skills',
        learnerName: 'Social Detective',
        icon: 'ðŸ¤',
        status: ACTIVITY_STATUS.COMING_SOON,
        identityClass: 'from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200',
        iconClass: 'from-emerald-200 via-teal-100 to-cyan-100',
        actionClass: '',
        folder: '',
        enabled: false,
        domain: 'daily-living',
        description: 'Practice understanding people and situations.',
        skills: [
            'direction-following'
        ],
        maxStage: 0,
        maxLevel: 0,
        maxDifficulty: 0,
        supportsScaffolds: true,
        supportsDifficulty: false,
        dashboardViewType: DASHBOARD_VIEW_TYPES.SUMMARY_WITH_CORRECTIONS,
        version: '0.0.0'
    }
];

export function getGameById(gameId) {
    return GAME_REGISTRY.find(game => game.gameId === gameId) || null;
}

export function getGamesByDomain(domainId) {
    return GAME_REGISTRY.filter(game => game.domain === domainId);
}

export function getAllGames() {
    return GAME_REGISTRY.map(game => ({ ...game }));
}

export function isValidGame(gameId) {
    return Boolean(getGameById(gameId));
}

export function getRegisteredGames() {
    return GAME_REGISTRY.filter(game => game.enabled);
}

export function validateGameRegistry(registry = GAME_REGISTRY) {
    const gameIds = new Set();

    for (const game of registry) {
        if (gameIds.has(game.gameId)) {
            return false;
        }

        gameIds.add(game.gameId);

        if (!isValidDomain(game.domain)) {
            return false;
        }

        if (!Array.isArray(game.skills)) {
            return false;
        }

        if (!Object.values(DASHBOARD_VIEW_TYPES).includes(game.dashboardViewType)) {
            return false;
        }

        if (!game.category || !game.learnerName || !game.icon || !game.status) {
            return false;
        }

        if (!Object.values(ACTIVITY_STATUS).includes(game.status)) {
            return false;
        }

        if (game.enabled && game.status !== ACTIVITY_STATUS.AVAILABLE) {
            return false;
        }

        if (game.status === ACTIVITY_STATUS.AVAILABLE && !game.actionClass) {
            return false;
        }

        const skillIds = new Set(game.skills);
        if (skillIds.size !== game.skills.length) {
            return false;
        }

        for (const skillId of game.skills) {
            if (!isValidSkill(skillId)) {
                return false;
            }
        }
    }

    return true;
}
