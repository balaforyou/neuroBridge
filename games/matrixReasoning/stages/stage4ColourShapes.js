export function generateStage4() {
    const shapes = ['circle', 'square', 'triangle', 'star'];
    const colors = ['red', 'blue', 'green', 'yellow'];

    const shapeA = shapes[Math.floor(Math.random() * shapes.length)];
    const colorA = colors[Math.floor(Math.random() * colors.length)];
    let colorB = colors[Math.floor(Math.random() * colors.length)];
    while (colorA === colorB) {
        colorB = colors[Math.floor(Math.random() * colors.length)];
    }

    const cells = [
        { shape: shapeA, color: colorA },
        { shape: shapeA, color: colorA },
        { shape: shapeA, color: colorB },
        '?'
    ];

    const correctAnswer = { shape: shapeA, color: colorB };
    const options = colors.map(color => ({ type: 'shape', value: shapeA, color }));
    const rule = {
        type: 'visual',
        description: 'The item shapes remain constant throughout, but colors stay perfectly uniform row by row.'
    };

    return { cells, correctAnswer, options, rule };
}
