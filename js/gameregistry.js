// js/gameRegistry.js

import { GAME_IDS } from './constants.js';
import { isValidDomain } from './domainRegistry.js';
import { isValidSkill } from './skillRegistry.js';

export const DASHBOARD_VIEW_TYPES = {
    SUMMARY_WITH_CORRECTIONS: 'summaryWithCorrections',
    TRIAL_BREAKDOWN: 'trialBreakdown'
};

export const GAME_REGISTRY = [
    {
        gameId: GAME_IDS.MATRIX_REASONING,
        id: GAME_IDS.MATRIX_REASONING,
        name: 'Matrix Reasoning',
        title: 'Matrix Reasoning',
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
        gameId: GAME_IDS.KUMON_QUIZ,
        id: GAME_IDS.KUMON_QUIZ,
        name: 'Kumon Quiz',
        title: 'Number Bridges',
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
