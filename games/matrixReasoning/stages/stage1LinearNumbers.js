export function generateStage1(generateNumericOptions) {
    const start = Math.floor(Math.random() * 6) + 2;
    const isHorizontal = Math.random() > 0.5;
    const inc = Math.random() > 0.5 ? 1 : -1;

    let cells;
    let correctAnswer;
    let rule;

    if (isHorizontal) {
        cells = [start, start + inc, start + 2, '?'];
        correctAnswer = start + 2 + inc;
        rule = { type: 'linear', orientation: 'horizontal', step: inc };
    } else {
        cells = [start, start + 2, start + inc, '?'];
        correctAnswer = start + inc + 2;
        rule = { type: 'linear', orientation: 'vertical', step: inc };
    }

    return {
        cells,
        correctAnswer,
        options: generateNumericOptions(correctAnswer),
        rule
    };
}