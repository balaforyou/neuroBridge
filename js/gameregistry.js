// js/gameRegistry.js

import { GAME_IDS } from './constants.js';
import { isValidDomain } from './domainRegistry.js';

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
            'pattern-completion',
            'rule-discovery',
            'visual-reasoning',
            'matrix-reasoning'
        ],
        cognitiveTargets: [
            'abstract-reasoning',
            'visual-discrimination',
            'working-memory',
            'cognitive-flexibility'
        ],
        maxStage: 5,
        maxLevel: 5,
        maxDifficulty: 5,
        supportsScaffolds: true,
        supportsDifficulty: true,
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
            'color-discrimination',
            'shape-discrimination',
            'size-discrimination'
        ],
        cognitiveTargets: [
            'concept-formation',
            'visual-discrimination',
            'selective-attention',
            'categorization'
        ],
        maxStage: 1,
        maxLevel: 1,
        maxDifficulty: 5,
        supportsScaffolds: true,
        supportsDifficulty: true,
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

        if (!Array.isArray(game.skills) || !Array.isArray(game.cognitiveTargets)) {
            return false;
        }
    }

    return true;
}
