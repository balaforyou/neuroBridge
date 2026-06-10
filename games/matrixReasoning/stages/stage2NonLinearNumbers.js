/**
 * Stage 2: Non-Linear Numbers
 * 
 * Patterns:
 * - Skip Pattern: Numbers increase by a fixed step (2 or 5)
 *   Example: 3, 5, 7, ? → 9
 * 
 * - Identity Pattern: First two numbers are identical, third is different
 *   Example: 4, 4, 7, ? → 7
 */

export function generateStage2(generateNumericOptions) {
    const isSkip = Math.random() > 0.5;
    let cells, correctAnswer, rule;

    if (isSkip) {
        // Skip pattern: arithmetic sequence with constant step
        const step = Math.random() > 0.5 ? 2 : 5;
        const start = Math.floor(Math.random() * 5) + 1; // 1-5

        cells = [
            start,
            start + step,
            start + (step * 2),
            '?'
        ];
        correctAnswer = start + (step * 3);
        rule = { type: 'nonlinear', pattern: 'skip', step };
    } else {
        // Identity pattern: repeat first number, then second number repeats
        const numA = Math.floor(Math.random() * 9) + 1; // 1-9
        const numB = Math.floor(Math.random() * 9) + 1; // 1-9

        cells = [numA, numA, numB, '?'];
        correctAnswer = numB;
        rule = { type: 'nonlinear', pattern: 'identity' };
    }

    return {
        cells,
        correctAnswer,
        options: generateNumericOptions(correctAnswer),
        rule
    };
}
