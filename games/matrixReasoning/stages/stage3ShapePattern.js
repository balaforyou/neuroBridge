/**
 * Stage 3: Shape Pattern
 *
 * The sequence is: [shapeA, shapeA, shapeB, '?']
 * The correct answer is shapeB.
 * Options are all available shape symbols rendered in black.
 */

const SHAPE_LIST = ['circle', 'square', 'triangle', 'star'];
const RULE_DESCRIPTION = 'The top row features identical matching shapes. The bottom row follows that same pattern repetition rule.';

export function generateStage3() {
    const shapeA = SHAPE_LIST[Math.floor(Math.random() * SHAPE_LIST.length)];
    let shapeB = SHAPE_LIST[Math.floor(Math.random() * SHAPE_LIST.length)];
    while (shapeA === shapeB) {
        shapeB = SHAPE_LIST[Math.floor(Math.random() * SHAPE_LIST.length)];
    }

    const cells = [shapeA, shapeA, shapeB, '?'];
    const correctAnswer = shapeB;
    const options = SHAPE_LIST.map(shape => ({ type: 'shape', value: shape, color: 'black' }));
    const rule = { type: 'visual', description: RULE_DESCRIPTION };

    return { cells, correctAnswer, options, rule };
}
