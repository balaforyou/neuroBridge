// js/gameRegistry.js

import { GAME_IDS } from './constants.js';

export const GAME_REGISTRY = [
    {
        id: GAME_IDS.MATRIX_REASONING,
        title: 'Matrix Reasoning',
        folder: 'matrixReasoning',
        enabled: true,
        maxLevel: 5
    }
];

export function getRegisteredGames() {
    return GAME_REGISTRY.filter(game => game.enabled);
}

export function getGameById(gameId) {
    return GAME_REGISTRY.find(game => game.id === gameId) || null;
}