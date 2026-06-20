import {
    ACTIVITY_TILE_GROUPS,
    getActivityTileTestId,
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
    assert(tile.learnerName === 'Grid Vision', 'Schulte tile should use learner-facing Grid Vision name');
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
    assert(markup.includes('Grid Vision'), 'Schulte tile should show learner-facing name');
    assert(!markup.includes('Coming Soon'), 'Schulte tile should not show Coming Soon');
    console.log('Schulte tile launch markup test passed');
}

function runAllTests() {
    console.log('=== Activity Tile Unit Tests ===');
    testSchulteTileIsAvailableInAttentionGroup();
    testSchulteTileLaunchMarkup();
    console.log('=== All Activity Tile Tests Passed ===');
}

export { runAllTests };
