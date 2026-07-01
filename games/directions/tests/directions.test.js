import {
    DIRECTIONS,
    generateRandomDirection,
    createDirectionsGame
} from '../game.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testDirectionsEnum() {
    assert(DIRECTIONS.UP === 'up', 'UP should be up');
    assert(DIRECTIONS.DOWN === 'down', 'DOWN should be down');
    assert(DIRECTIONS.LEFT === 'left', 'LEFT should be left');
    assert(DIRECTIONS.RIGHT === 'right', 'RIGHT should be right');
    console.log('Directions enumeration test passed');
}

function testRandomDirectionGeneration() {
    const values = new Set();
    const seededRandom = () => 0.1; // Math.floor(0.1 * 4) = 0 -> UP
    const dir = generateRandomDirection(seededRandom);
    assert(dir === DIRECTIONS.UP, 'Seeded random should select correct index value');

    for (let i = 0; i < 100; i++) {
        values.add(generateRandomDirection());
    }
    assert(values.has(DIRECTIONS.UP), 'Random list should cover UP');
    assert(values.has(DIRECTIONS.DOWN), 'Random list should cover DOWN');
    assert(values.has(DIRECTIONS.LEFT), 'Random list should cover LEFT');
    assert(values.has(DIRECTIONS.RIGHT), 'Random list should cover RIGHT');
    console.log('Random direction generation test passed');
}

function testSessionInitialization() {
    const game = createDirectionsGame({ direction: DIRECTIONS.DOWN, learnerName: 'Adarsh' });
    const state = game.getState();
    assert(state.currentDirection === DIRECTIONS.DOWN, 'State should initialize with config target direction');
    assert(state.learnerName === 'Adarsh', 'State should preserve normal learner profile name');
    assert(state.completed === false, 'Session must start as uncompleted');
    console.log('Session initialization test passed');
}

export function runAllTests() {
    console.log('=== Directions V1 Unit Tests ===');
    testDirectionsEnum();
    testRandomDirectionGeneration();
    testSessionInitialization();
    console.log('=== All Directions V1 Unit Tests Passed ===');
}
