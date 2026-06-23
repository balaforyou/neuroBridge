import {
    ACTIVITY_TILE_GROUPS,
    getActivityTileTestId,
    renderActivityTiles,
    renderActivityTile
} from '../activityTiles.js';

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
    assert(getActivityTileTestId(tile) === 'activity-tile-pattern-memory', 'Pattern Memory tile should expose stable test id');
    assert(markup.includes('class="btn-launch-game'), 'Available Pattern Memory tile should render as launch button');
    assert(markup.includes('data-game="patternMemory"'), 'Pattern Memory tile should launch pattern memory route');
    assert(markup.includes('aria-label="Start Pattern Memory: Copy Mode"'), 'Pattern Memory tile accessible label should include mode');
    console.log('Pattern Memory tile launch markup test passed');
}

function createFakeElement() {
    return {
        innerHTML: '',
        innerText: ''
    };
}

function runAllTests() {
    console.log('=== Activity Tile Unit Tests ===');
    testSchulteTileIsAvailableInAttentionGroup();
    testSchulteTileLaunchMarkup();
    testSchulteLandingPageTileTerminology();
    testMatchingWorksheetsTileLaunchMarkup();
    testPatternMemoryTileLaunchMarkup();
    console.log('=== All Activity Tile Tests Passed ===');
}

export { runAllTests };
