import {
    ACTIVITY_TILE_GROUPS,
    buildActivityTileGroups,
    getActivityTileTestId,
    renderActivityTiles,
    renderActivityTile
} from '../activityTiles.js';
import { getAllGames, getGameById } from '../gameRegistry.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function getTile(activityId) {
    return ACTIVITY_TILE_GROUPS
        .flatMap(group => group.tiles)
        .find(tile => tile.activityId === activityId) || null;
}

function testSchulteTileIsAvailableInAttentionGroup() {
    const attentionGroup = ACTIVITY_TILE_GROUPS.find(group => group.category === 'Attention');
    const tile = getTile('schulte');

    assert(attentionGroup, 'Attention activity group should exist');
    assert(tile, 'Schulte tile should exist');
    assert(attentionGroup.tiles.includes(tile), 'Schulte tile should appear in Attention group');
    assert(tile.status === 'available', 'Schulte tile should be available');
    assert(tile.learnerName === 'Grid Vision', 'Schulte tile should preserve Grid Vision family name');
    assert(tile.subtitle === 'Schulte Table', 'Schulte tile should show Schulte Table subtitle');
    assert(tile.domain === 'visual-search', 'Schulte tile should preserve visual-search domain');
    console.log('Schulte tile availability test passed');
}

function testEveryActivityTileComesFromGameRegistry() {
    const registryIds = new Set(getAllGames().map(game => game.gameId));
    const tileIds = ACTIVITY_TILE_GROUPS.flatMap(group => group.tiles.map(tile => tile.activityId));

    for (const tileId of tileIds) {
        assert(registryIds.has(tileId), `Tile ${tileId} should come from Game Registry`);
    }

    for (const game of getAllGames()) {
        assert(tileIds.includes(game.gameId), `Registered game ${game.gameId} should appear in activity tile groups`);
    }

    console.log('Every activity tile comes from Game Registry test passed');
}

function testBuildActivityTileGroupsUsesRegistryMetadata() {
    const groups = buildActivityTileGroups([
        {
            ...getGameById('patternMemory'),
            category: 'Thinking',
            learnerName: 'Registry Pattern',
            description: 'Registry description'
        }
    ]);
    const thinkingGroup = groups.find(group => group.category === 'Thinking');
    const tile = thinkingGroup.tiles.find(item => item.activityId === 'patternMemory');

    assert(tile, 'Registry-provided game should be grouped by registry category');
    assert(tile.learnerName === 'Registry Pattern', 'Tile learner name should come from registry metadata');
    assert(tile.description === 'Registry description', 'Tile description should come from registry metadata');
    console.log('Build activity tile groups registry metadata test passed');
}

function testSchulteTileLaunchMarkup() {
    const tile = getTile('schulte');
    const markup = renderActivityTile(tile);

    assert(getActivityTileTestId(tile) === 'activity-tile-grid-vision', 'Schulte tile should expose stable test id');
    assert(markup.includes('class="btn-launch-game'), 'Available Schulte tile should render as launch button');
    assert(markup.includes('data-game="schulte"'), 'Schulte tile should launch schulte route');
    assert(markup.includes('data-testid="activity-tile-grid-vision"'), 'Schulte tile should render test id');
    assert(markup.includes('Grid Vision'), 'Schulte tile should show Grid Vision family name');
    assert(markup.includes('Schulte Table'), 'Schulte tile should show learner-facing Schulte Table subtitle');
    assert(markup.includes('aria-label="Start Grid Vision: Schulte Table"'), 'Schulte tile accessible label should include both family and activity names');
    assert(!markup.includes('Coming Soon'), 'Schulte tile should not show Coming Soon');
    console.log('Schulte tile launch markup test passed');
}

function testSchulteLandingPageTileTerminology() {
    const container = createFakeElement();
    const message = createFakeElement();
    const previousDocument = globalThis.document;

    globalThis.document = {
        getElementById(id) {
            if (id === 'game-selection-list') return container;
            if (id === 'activity-hub-message') return message;
            return null;
        }
    };

    try {
        renderActivityTiles('Learner');
    } finally {
        globalThis.document = previousDocument;
    }

    assert(container.innerHTML.includes('data-testid="activity-tile-grid-vision"'), 'Landing page should render Schulte tile');
    assert(container.innerHTML.includes('Grid Vision'), 'Landing page Schulte tile should show Grid Vision family name');
    assert(container.innerHTML.includes('Schulte Table'), 'Landing page Schulte tile should show Schulte Table activity name');
    assert(container.innerHTML.includes('aria-label="Start Grid Vision: Schulte Table"'), 'Landing page Schulte tile label should include aligned terminology');
    console.log('Schulte landing page tile terminology test passed');
}

function testMatchingWorksheetsTileLaunchMarkup() {
    const recommendedGroup = ACTIVITY_TILE_GROUPS.find(group => group.category === 'Recommended');
    const tile = getTile('attributeMatchingWorksheet');
    const markup = renderActivityTile(tile);

    assert(recommendedGroup, 'Recommended activity group should exist');
    assert(tile, 'Matching Worksheets tile should exist');
    assert(recommendedGroup.tiles.includes(tile), 'Matching Worksheets tile should appear in Recommended group');
    assert(tile.status === 'available', 'Matching Worksheets tile should be available');
    assert(tile.learnerName === 'Matching Worksheets', 'Matching Worksheets tile should show activity family name');
    assert(tile.subtitle === 'Attribute Matching V1', 'Matching Worksheets tile should show Attribute Matching V1 subtitle');
    assert(getActivityTileTestId(tile) === 'activity-tile-attribute-matching', 'Matching Worksheets tile should preserve stable test id');
    assert(markup.includes('class="btn-launch-game'), 'Available Matching Worksheets tile should render as launch button');
    assert(markup.includes('data-game="attributeMatchingWorksheet"'), 'Matching Worksheets tile should launch attribute matching route');
    assert(markup.includes('Matching Worksheets'), 'Matching Worksheets tile should show learner-facing name');
    assert(markup.includes('Attribute Matching V1'), 'Matching Worksheets tile should show launched activity subtitle');
    assert(markup.includes('aria-label="Start Matching Worksheets: Attribute Matching V1"'), 'Matching Worksheets tile accessible label should include activity name');
    console.log('Matching Worksheets tile launch markup test passed');
}

function testPatternMemoryTileLaunchMarkup() {
    const recommendedGroup = ACTIVITY_TILE_GROUPS.find(group => group.category === 'Recommended');
    const tile = getTile('patternMemory');
    const markup = renderActivityTile(tile);

    assert(recommendedGroup, 'Recommended activity group should exist');
    assert(tile, 'Pattern Memory tile should exist');
    assert(recommendedGroup.tiles.includes(tile), 'Pattern Memory tile should appear in Recommended group');
    assert(tile.status === 'available', 'Pattern Memory tile should be available');
    assert(tile.learnerName === 'Pattern Memory', 'Pattern Memory tile should show activity name');
    assert(tile.subtitle === 'Copy Mode', 'Pattern Memory tile should show Copy Mode subtitle');
    assert(tile.description === 'Copy and remember patterns using visual memory.', 'Pattern Memory tile should use learner-facing memory copy');
    assert(getActivityTileTestId(tile) === 'activity-tile-pattern-memory', 'Pattern Memory tile should expose stable test id');
    assert(markup.includes('class="btn-launch-game'), 'Available Pattern Memory tile should render as launch button');
    assert(markup.includes('data-game="patternMemory"'), 'Pattern Memory tile should launch pattern memory route');
    assert(markup.includes('aria-label="Start Pattern Memory: Copy Mode"'), 'Pattern Memory tile accessible label should include mode');
    console.log('Pattern Memory tile launch markup test passed');
}

function testSocialDetectiveComingSoonDoesNotLaunch() {
    const lifeSkillsGroup = ACTIVITY_TILE_GROUPS.find(group => group.category === 'Life Skills');
    const tile = getTile('socialDetective');
    const markup = renderActivityTile(tile);

    assert(lifeSkillsGroup, 'Life Skills activity group should exist');
    assert(tile, 'Social Detective tile should exist');
    assert(lifeSkillsGroup.tiles.includes(tile), 'Social Detective tile should appear in Life Skills group');
    assert(tile.status === 'coming-soon', 'Social Detective tile should be coming soon');
    assert(!markup.includes('class="btn-launch-game'), 'Coming soon tile should not render launch button class');
    assert(!markup.includes('data-game="socialDetective"'), 'Coming soon tile should not expose launch data-game');
    assert(markup.includes('Coming Soon'), 'Coming soon tile should show Coming Soon');
    console.log('Social Detective coming soon non-launch test passed');
}

function createFakeElement() {
    return {
        innerHTML: '',
        innerText: ''
    };
}

function runAllTests() {
    console.log('=== Activity Tile Unit Tests ===');
    testEveryActivityTileComesFromGameRegistry();
    testBuildActivityTileGroupsUsesRegistryMetadata();
    testSchulteTileIsAvailableInAttentionGroup();
    testSchulteTileLaunchMarkup();
    testSchulteLandingPageTileTerminology();
    testMatchingWorksheetsTileLaunchMarkup();
    testPatternMemoryTileLaunchMarkup();
    testSocialDetectiveComingSoonDoesNotLaunch();
    console.log('=== All Activity Tile Tests Passed ===');
}

export { runAllTests };
