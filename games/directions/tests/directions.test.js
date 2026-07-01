import {
    DIRECTIONS,
    generateRandomDirection,
    validateDirection,
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
    testValidateDirectionCorrect();
    testValidateDirectionIncorrect();
    testValidateAllFourDirections();
    testSelectDirectionRecordsState();
    console.log('=== All Directions V1 Unit Tests Passed ===');
}

function testValidateDirectionCorrect() {
    assert(validateDirection(DIRECTIONS.UP, DIRECTIONS.UP) === true, 'UP vs UP should be correct');
    assert(validateDirection(DIRECTIONS.DOWN, DIRECTIONS.DOWN) === true, 'DOWN vs DOWN should be correct');
    assert(validateDirection(DIRECTIONS.LEFT, DIRECTIONS.LEFT) === true, 'LEFT vs LEFT should be correct');
    assert(validateDirection(DIRECTIONS.RIGHT, DIRECTIONS.RIGHT) === true, 'RIGHT vs RIGHT should be correct');
    console.log('Validate direction correct test passed');
}

function testValidateDirectionIncorrect() {
    assert(validateDirection(DIRECTIONS.UP, DIRECTIONS.DOWN) === false, 'UP vs DOWN should be incorrect');
    assert(validateDirection(DIRECTIONS.UP, DIRECTIONS.LEFT) === false, 'UP vs LEFT should be incorrect');
    assert(validateDirection(DIRECTIONS.UP, DIRECTIONS.RIGHT) === false, 'UP vs RIGHT should be incorrect');
    assert(validateDirection(DIRECTIONS.DOWN, DIRECTIONS.UP) === false, 'DOWN vs UP should be incorrect');
    assert(validateDirection(DIRECTIONS.LEFT, DIRECTIONS.RIGHT) === false, 'LEFT vs RIGHT should be incorrect');
    assert(validateDirection(DIRECTIONS.RIGHT, DIRECTIONS.LEFT) === false, 'RIGHT vs LEFT should be incorrect');
    console.log('Validate direction incorrect test passed');
}

function testValidateAllFourDirections() {
    const allDirections = Object.values(DIRECTIONS);
    allDirections.forEach(target => {
        allDirections.forEach(selected => {
            const expected = target === selected;
            const actual = validateDirection(target, selected);
            assert(actual === expected, `validateDirection(${target}, ${selected}) should be ${expected}`);
        });
    });
    console.log('Validate all four directions matrix test passed');
}

function testSelectDirectionRecordsState() {
    const game = createDirectionsGame({ direction: DIRECTIONS.LEFT });

    // Correct selection
    const correctResult = game.selectDirection(DIRECTIONS.LEFT);
    assert(correctResult === true, 'selectDirection correct should return true');
    const stateAfterCorrect = game.getState();
    assert(stateAfterCorrect.lastResult !== null, 'lastResult should be set after selection');
    assert(stateAfterCorrect.lastResult.correct === true, 'lastResult.correct should be true');
    assert(stateAfterCorrect.lastResult.selected === DIRECTIONS.LEFT, 'lastResult.selected should match selection');

    // Incorrect selection on same game instance
    const wrongResult = game.selectDirection(DIRECTIONS.RIGHT);
    assert(wrongResult === false, 'selectDirection incorrect should return false');
    const stateAfterWrong = game.getState();
    assert(stateAfterWrong.lastResult.correct === false, 'lastResult.correct should be false for wrong selection');
    assert(stateAfterWrong.lastResult.selected === DIRECTIONS.RIGHT, 'lastResult.selected should reflect latest wrong selection');

    // currentDirection must remain unchanged — wrong answer must never advance the target
    assert(stateAfterWrong.currentDirection === DIRECTIONS.LEFT, 'Wrong selection must not change currentDirection');
    console.log('selectDirection records state correctly test passed');
}
