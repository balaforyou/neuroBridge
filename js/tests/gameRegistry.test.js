/**
 * Unit tests for centralized NeuroBridge game metadata registry.
 */

import {
    GAME_REGISTRY,
    getAllGames,
    getGameById,
    getGamesByDomain,
    isValidGame,
    validateGameRegistry
} from '../gameRegistry.js';
import { isValidDomain } from '../domainRegistry.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testGamesExist() {
    const matrix = getGameById('matrixReasoning');
    const attribute = getGameById('attributeExplorer');

    assert(matrix, 'Matrix Reasoning metadata should exist');
    assert(attribute, 'Attribute Explorer metadata should exist');
    assert(matrix.name === 'Matrix Reasoning', 'Matrix should have a name');
    assert(attribute.name === 'Attribute Explorer', 'Attribute Explorer should have a name');

    console.log('Games exist test passed');
}

function testValidDomainMapping() {
    for (const game of GAME_REGISTRY) {
        assert(isValidDomain(game.domain), `Game ${game.gameId} should map to a valid domain`);
        assert(Array.isArray(game.skills), `Game ${game.gameId} skills should be an array`);
        assert(Array.isArray(game.cognitiveTargets), `Game ${game.gameId} cognitiveTargets should be an array`);
    }

    assert(getGameById('matrixReasoning').domain === 'reasoning', 'Matrix Reasoning should map to reasoning');
    assert(getGameById('attributeExplorer').domain === 'concept-formation', 'Attribute Explorer should map to concept-formation');

    console.log('Valid domain mapping test passed');
}

function testGetGameById() {
    const game = getGameById('matrixReasoning');

    assert(game.gameId === 'matrixReasoning', 'getGameById should return matching game');
    assert(game.maxStage === 5, 'getGameById should return game metadata');

    console.log('getGameById test passed');
}

function testGetGamesByDomain() {
    const reasoningGames = getGamesByDomain('reasoning');
    const conceptGames = getGamesByDomain('concept-formation');

    assert(reasoningGames.some(game => game.gameId === 'matrixReasoning'), 'Reasoning domain should include Matrix Reasoning');
    assert(conceptGames.some(game => game.gameId === 'attributeExplorer'), 'Concept Formation domain should include Attribute Explorer');
    assert(getGamesByDomain('unknown-domain').length === 0, 'Unknown domain should return an empty array');

    console.log('getGamesByDomain test passed');
}

function testGetAllGames() {
    const games = getAllGames();

    assert(Array.isArray(games), 'getAllGames should return an array');
    assert(games.length === GAME_REGISTRY.length, 'getAllGames should return all games');

    console.log('getAllGames test passed');
}

function testUniqueness() {
    const ids = GAME_REGISTRY.map(game => game.gameId);
    assert(new Set(ids).size === ids.length, 'Game ids should be unique');
    assert(validateGameRegistry() === true, 'validateGameRegistry should pass for initial registry');

    const duplicateRegistry = [
        GAME_REGISTRY[0],
        { ...GAME_REGISTRY[0] }
    ];

    assert(validateGameRegistry(duplicateRegistry) === false, 'validateGameRegistry should fail duplicate ids');

    console.log('Game id uniqueness test passed');
}

function testInvalidLookupHandling() {
    assert(getGameById('missing-game') === null, 'Unknown game lookup should return null');
    assert(isValidGame('matrixReasoning') === true, 'isValidGame should return true for valid games');
    assert(isValidGame('missing-game') === false, 'isValidGame should return false for invalid games');

    console.log('Invalid lookup handling test passed');
}

function runAllTests() {
    console.log('=== Game Registry Unit Tests ===');
    testGamesExist();
    testValidDomainMapping();
    testGetGameById();
    testGetGamesByDomain();
    testGetAllGames();
    testUniqueness();
    testInvalidLookupHandling();
    console.log('=== All Game Registry Tests Passed ===');
}

export { runAllTests };
