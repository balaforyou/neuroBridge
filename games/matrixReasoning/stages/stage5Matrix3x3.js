export function generateStage5() {
    const shapes = ['circle', 'square', 'triangle'];
    const colors = ['red', 'blue', 'green'];

    const cells = [
        { shape: shapes[0], color: colors[0] },
        { shape: shapes[1], color: colors[0] },
        { shape: shapes[2], color: colors[0] },
        { shape: shapes[0], color: colors[1] },
        { shape: shapes[1], color: colors[1] },
        { shape: shapes[2], color: colors[1] },
        { shape: shapes[0], color: colors[2] },
        { shape: shapes[1], color: colors[2] },
        '?'
    ];

    const correctAnswer = { shape: shapes[2], color: colors[2] };
    const options = [
        { type: 'shape', value: shapes[0], color: colors[2] },
        { type: 'shape', value: shapes[1], color: colors[0] },
        { type: 'shape', value: shapes[2], color: colors[2] },
        { type: 'shape', value: shapes[2], color: colors[1] }
    ];
    const rule = {
        type: 'visual',
        description: 'Each horizontal row loops through changing shapes. Each vertical column shifts color sets uniformly.'
    };

    return { cells, correctAnswer, options, rule };
}
