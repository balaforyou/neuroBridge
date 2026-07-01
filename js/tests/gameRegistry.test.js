/**
 * Unit tests for centralized NeuroBridge game metadata registry.
 */

import {
    ACTIVITY_STATUS,
    DASHBOARD_VIEW_TYPES,
    GAME_REGISTRY,
    getAllGames,
    getGameById,
    getGamesByDomain,
    isValidGame,
    validateGameRegistry
} from '../gameRegistry.js';
import { isValidDomain } from '../domainRegistry.js';
import { isValidSkill } from '../skillRegistry.js';
import { getCognitiveTargetsForSkill } from '../cognitiveOntology.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testGamesExist() {
    const matrix = getGameById('matrixReasoning');
    const attribute = getGameById('attributeExplorer');
    const matchingWorksheets = getGameById('attributeMatchingWorksheet');
    const matchingWorksheet = getGameById('matchingWorksheet');
    const patternMemory = getGameById('patternMemory');
    const kumon = getGameById('kumonQuiz');
    const schulte = getGameById('schulte');
    const socialDetective = getGameById('socialDetective');

    assert(matrix, 'Matrix Reasoning metadata should exist');
    assert(attribute, 'Attribute Explorer metadata should exist');
    assert(matchingWorksheet, 'Matching Worksheet metadata should exist');
    assert(matchingWorksheets, 'Matching Worksheets metadata should exist');
    assert(patternMemory, 'Pattern Memory metadata should exist');
    assert(kumon, 'Kumon Quiz metadata should exist');
    assert(schulte, 'Schulte metadata should exist');
    assert(socialDetective, 'Social Detective metadata should exist');
    assert(matrix.name === 'Matrix Reasoning', 'Matrix should have a name');
    assert(attribute.name === 'Attribute Explorer', 'Attribute Explorer should have a name');
    assert(matchingWorksheets.name === 'Matching Worksheets', 'Matching Worksheets should have a family name');
    assert(patternMemory.title === 'Pattern Memory', 'Pattern Memory should have a learner-facing title');
    assert(kumon.title === 'Number Bridges', 'Kumon Quiz should use learner-facing Number Bridges title');
    assert(schulte.learnerName === 'Grid Vision', 'Schulte should preserve tile learner name');
    assert(socialDetective.enabled === false, 'Social Detective should be disabled until ready');
    assert(socialDetective.status === ACTIVITY_STATUS.COMING_SOON, 'Social Detective should be coming soon');

    console.log('Games exist test passed');
}

function testValidDomainMapping() {
    for (const game of GAME_REGISTRY) {
        assert(isValidDomain(game.domain), `Game ${game.gameId} should map to a valid domain`);
        assert(Array.isArray(game.skills), `Game ${game.gameId} skills should be an array`);
    }

    assert(getGameById('matrixReasoning').domain === 'reasoning', 'Matrix Reasoning should map to reasoning');
    assert(getGameById('attributeExplorer').domain === 'concept-formation', 'Attribute Explorer should map to concept-formation');
    assert(getGameById('matchingWorksheet').domain === 'concept-formation', 'Matching Worksheet should map to concept-formation');
    assert(getGameById('attributeMatchingWorksheet').domain === 'concept-formation', 'Matching Worksheets should map to concept-formation');
    assert(getGameById('patternMemory').domain === 'memory', 'Pattern Memory should map to memory');
    assert(getGameById('kumonQuiz').domain === 'numeracy', 'Kumon Quiz should map to numeracy');

    console.log('Valid domain mapping test passed');
}

function testDashboardViewTypeContract() {
    const allowedViewTypes = Object.values(DASHBOARD_VIEW_TYPES);

    for (const game of GAME_REGISTRY) {
        assert(
            allowedViewTypes.includes(game.dashboardViewType),
            `Game ${game.gameId} should declare a valid dashboardViewType`
        );
    }

    assert(
        getGameById('kumonQuiz').dashboardViewType === DASHBOARD_VIEW_TYPES.SUMMARY_WITH_CORRECTIONS,
        'Number Bridges should use summaryWithCorrections'
    );
    assert(
        getGameById('matrixReasoning').dashboardViewType === DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        'Matrix Reasoning should use trialBreakdown'
    );
    assert(
        getGameById('attributeExplorer').dashboardViewType === DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        'Attribute Explorer should use trialBreakdown until reviewed'
    );
    assert(
        getGameById('attributeMatchingWorksheet').dashboardViewType === DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        'Matching Worksheets should use trialBreakdown for recent activity details'
    );
    assert(
        getGameById('matchingWorksheet').dashboardViewType === DASHBOARD_VIEW_TYPES.SUMMARY_WITH_CORRECTIONS,
        'Matching Worksheet should use summaryWithCorrections'
    );
    assert(
        getGameById('patternMemory').dashboardViewType === DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        'Pattern Memory should use trialBreakdown for recent activity details'
    );
    assert(
        getGameById('schulte').dashboardViewType === DASHBOARD_VIEW_TYPES.TRIAL_BREAKDOWN,
        'Schulte should use trialBreakdown'
    );

    console.log('Dashboard view type contract test passed');
}

function testAllGameSkillsExistInSkillRegistry() {
    for (const game of GAME_REGISTRY) {
        for (const skillId of game.skills) {
            assert(isValidSkill(skillId), `Game ${game.gameId} skill ${skillId} should exist in Skill Registry`);
        }
    }

    console.log('All game skills exist in Skill Registry test passed');
}

function testLauncherMetadataContract() {
    for (const game of GAME_REGISTRY) {
        assert(game.category, `Game ${game.gameId} should declare category`);
        assert(game.learnerName, `Game ${game.gameId} should declare learnerName`);
        assert(game.icon, `Game ${game.gameId} should declare icon`);
        assert(Object.values(ACTIVITY_STATUS).includes(game.status), `Game ${game.gameId} should declare valid status`);
        if (game.enabled) {
            assert(game.status === ACTIVITY_STATUS.AVAILABLE, `Enabled game ${game.gameId} should be available`);
            assert(game.actionClass, `Available game ${game.gameId} should declare actionClass`);
            assert(game.folder, `Available game ${game.gameId} should declare launch folder`);
        }
    }

    console.log('Launcher metadata contract test passed');
}

function testEveryGameSkillHasOntologyMapping() {
    for (const game of GAME_REGISTRY) {
        for (const skillId of game.skills) {
            assert(
                getCognitiveTargetsForSkill(skillId).length > 0,
                `Game ${game.gameId} skill ${skillId} should have ontology targets`
            );
        }
    }

    console.log('Every game skill has ontology mapping test passed');
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
    const numeracyGames = getGamesByDomain('numeracy');

    assert(reasoningGames.some(game => game.gameId === 'matrixReasoning'), 'Reasoning domain should include Matrix Reasoning');
    assert(conceptGames.some(game => game.gameId === 'attributeExplorer'), 'Concept Formation domain should include Attribute Explorer');
    assert(conceptGames.some(game => game.gameId === 'matchingWorksheet'), 'Concept Formation domain should include Matching Worksheet');
    assert(conceptGames.some(game => game.gameId === 'attributeMatchingWorksheet'), 'Concept Formation domain should include Matching Worksheets');
    assert(getGamesByDomain('memory').some(game => game.gameId === 'patternMemory'), 'Memory domain should include Pattern Memory');
    assert(numeracyGames.some(game => game.gameId === 'kumonQuiz'), 'Numeracy domain should include Kumon Quiz');
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

function testUnknownSkillValidation() {
    const invalidRegistry = [
        {
            ...GAME_REGISTRY[0],
            skills: ['missing-skill']
        }
    ];

    assert(validateGameRegistry(invalidRegistry) === false, 'validateGameRegistry should fail unknown skills');

    console.log('Unknown skill validation test passed');
}

function testDuplicateSkillValidation() {
    const invalidRegistry = [
        {
            ...GAME_REGISTRY[0],
            skills: ['pattern-recognition', 'pattern-recognition']
        }
    ];

    assert(validateGameRegistry(invalidRegistry) === false, 'validateGameRegistry should fail duplicate skills per game');

    console.log('Duplicate skill validation test passed');
}

function testCognitiveTargetsNotRequired() {
    const registryWithoutTargets = GAME_REGISTRY.map(game => {
        const { cognitiveTargets, ...gameWithoutTargets } = game;
        return gameWithoutTargets;
    });

    assert(validateGameRegistry(registryWithoutTargets) === true, 'validateGameRegistry should not require cognitiveTargets');
    assert(GAME_REGISTRY.every(game => game.cognitiveTargets === undefined), 'Game Registry should not store direct cognitiveTargets');

    console.log('cognitiveTargets not required test passed');
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
    testDashboardViewTypeContract();
    testAllGameSkillsExistInSkillRegistry();
    testLauncherMetadataContract();
    testEveryGameSkillHasOntologyMapping();
    testGetGameById();
    testGetGamesByDomain();
    testGetAllGames();
    testUniqueness();
    testUnknownSkillValidation();
    testDuplicateSkillValidation();
    testCognitiveTargetsNotRequired();
    testInvalidLookupHandling();
    console.log('=== All Game Registry Tests Passed ===');
}

export { runAllTests };
