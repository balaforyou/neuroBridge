import {
    createMatchingPairs,
    createMatchingWorksheetGame,
    DEFAULT_MATCHING_ITEMS,
    isMatchingPair
} from '../game.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testCreateMatchingPairs() {
    const cards = createMatchingPairs(DEFAULT_MATCHING_ITEMS);

    assert(cards.length === DEFAULT_MATCHING_ITEMS.length * 2, 'Two cards should be created per item');
    assert(cards[0].cardId === 'apple-a', 'First card id should be stable');
    assert(cards[1].cardId === 'ball-a', 'Second card id should be stable');
    assert(cards[2].cardId === 'cat-a', 'Third card id should be stable');
    assert(cards[3].cardId === 'apple-b', 'Fourth card id should be stable');
    assert(cards.every(card => card.matched === false), 'Cards should start unmatched');
    console.log('Matching pair creation test passed');
}

function testPairMatching() {
    const cards = createMatchingPairs();

    assert(isMatchingPair(cards[0], cards[3]) === true, 'Matching pair should return true');
    assert(isMatchingPair(cards[0], cards[1]) === false, 'Non-matching pair should return false');
    assert(isMatchingPair(cards[0], cards[0]) === false, 'Same card should not match itself');
    console.log('Matching pair comparison test passed');
}

function testTapToSelectSuccess() {
    const game = createMatchingWorksheetGame();

    assert(game.selectCard('apple-a').result === 'selected', 'First card tap should select');
    assert(game.selectCard('apple-b').result === 'success', 'Second matching card tap should succeed');

    const state = game.getState();
    assert(state.cards.find(card => card.cardId === 'apple-a').matched === true, 'First matched card should be marked');
    assert(state.cards.find(card => card.cardId === 'apple-b').matched === true, 'Second matched card should be marked');
    assert(state.attempts === 1, 'Successful pair should count as one attempt');
    console.log('Tap-to-select success test passed');
}

function testTapToSelectMistake() {
    const game = createMatchingWorksheetGame();

    game.selectCard('apple-a');
    assert(game.selectCard('ball-a').result === 'mistake', 'Non-matching card tap should be a mistake');

    const state = game.getState();
    assert(state.selectedCardId === null, 'Selection should clear after mistake');
    assert(state.cards.every(card => card.matched === false), 'Mistake should not mark cards');
    assert(state.attempts === 1, 'Mistake should count as one attempt');
    console.log('Tap-to-select mistake test passed');
}

function testMatchedCardsCannotBeSelectedAgain() {
    const game = createMatchingWorksheetGame();

    game.selectCard('apple-a');
    game.selectCard('apple-b');

    assert(game.selectCard('apple-a').result === 'ignored', 'Matched cards should not be selectable again');
    console.log('Matched card selection guard test passed');
}

function testCompletion() {
    const game = createMatchingWorksheetGame();

    game.selectCard('apple-a');
    game.selectCard('apple-b');
    game.selectCard('ball-a');
    game.selectCard('ball-b');
    game.selectCard('cat-a');
    const result = game.selectCard('cat-b');

    assert(result.result === 'complete', 'Final pair should complete the worksheet');
    assert(game.isComplete() === true, 'Game should report complete when all pairs are matched');
    console.log('Matching worksheet completion test passed');
}

function runAllTests() {
    console.log('=== Matching Worksheet Unit Tests ===');
    testCreateMatchingPairs();
    testPairMatching();
    testTapToSelectSuccess();
    testTapToSelectMistake();
    testMatchedCardsCannotBeSelectedAgain();
    testCompletion();
    console.log('=== All Matching Worksheet Unit Tests Passed ===');
}

export { runAllTests };
