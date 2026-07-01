import {
    createAdditionHint,
    createKumonQuizGame,
    createKumonSessionSummary,
    DEFAULT_KUMON_CONFIG,
    formatAnswerSpeech,
    formatQuestionSpeech,
    generateKumonQuestions,
    getNumberBridgeTransitionDurationMs,
    getNextNumberBridgeLevel,
    getNumberBridgeLevelModel,
    markNumberBridgeCompletionClapPlayed,
    normalizeKumonConfig,
    normalizeNumberBridgeMasterRanges,
    NUMBER_BRIDGE_MAX_LEVEL,
    NUMBER_BRIDGE_PAGE_TURN_MS,
    playNumberBridgeCompletionClap,
    renderNumberBridgeResultMarkup,
    renderNumberBridgeSupportText,
    shouldPlayNumberBridgeCompletionClap
} from '../game.js';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testConfigDefaults() {
    const config = normalizeKumonConfig();

    assert(config.operation === '+', 'Operation should default to addition');
    assert(config.firstNumberMin === 1, 'First number min should default to 1');
    assert(config.firstNumberMax === 10, 'First number max should default to 10');
    assert(config.secondNumberMode === 'fixed', 'Second number mode should default to fixed');
    assert(config.secondNumberFixedValue === 1, 'Fixed second number should default to 1');
    assert(config.level === 1, 'Level should default to 1');
    assert(config.bridgeValue === 1, 'Bridge value should default to 1');
    assert(config.levelLabel === 'Addition L1', 'Level label should default to Addition L1');
    assert(config.skillLabel === '+1 Bridges', 'Skill label should default to +1 Bridges');
    assert(config.autoProgression === false, 'Auto progression should default disabled');
    assert(config.audioMode === false, 'Audio mode should default disabled');
    assert(config.questionCount === 10, 'Question count should default to 10');
    assert(config.questionsPerScreen === 5, 'Questions per screen should default to 5');
    assert(config.hintsEnabled === true, 'Hints should default enabled');
    assert(config.questionOrder === 'sequential', 'Question order should default to sequential');
    assert(config.mode === 'practice', 'Mode should default to practice');
    console.log('Kumon config defaults test passed');
}

function testAudioModeConfig() {
    const enabled = normalizeKumonConfig({ audioMode: true, operation: '+', level: 9 });
    const disabled = normalizeKumonConfig({ audioMode: 'true', operation: '\u00d7', level: 9 });
    const master = normalizeKumonConfig({ audioMode: true, operation: '-', arithmeticMode: 'master', aMin: 3, aMax: 4, bMin: 1, bMax: 2 });

    assert(enabled.audioMode === true, 'Audio mode should enable only with boolean true');
    assert(enabled.level === 9, 'Audio mode should not restrict bridge levels');
    assert(disabled.audioMode === false, 'Audio mode should reject non-boolean true values');
    assert(disabled.operation === '\u00d7', 'Audio mode should not change multiplication operation');
    assert(master.audioMode === true && master.arithmeticMode === 'master', 'Audio mode should stay available in Master mode');
    console.log('Audio mode config test passed');
}

function testQuestionSpeechFormatting() {
    assert(formatQuestionSpeech({ operandA: 1, operation: '+', operandB: 1 }) === 'One plus one?', 'Addition question speech should use plus language');
    assert(formatQuestionSpeech({ operandA: 9, operation: '+', operandB: 8 }) === 'Nine plus eight?', 'Addition question speech should support larger operands');
    assert(formatQuestionSpeech({ operandA: 3, operation: '-', operandB: 1 }) === 'Three minus one?', 'Subtraction question speech should use minus language');
    assert(formatQuestionSpeech({ operandA: 5, operation: '\u00d7', operandB: 2 }) === 'Five times two?', 'Multiplication question speech should use times language');
    assert(formatQuestionSpeech({ operandA: 10, operation: '\u00f7', operandB: 2 }) === 'Ten divided by two?', 'Division question speech should use divided-by language');
    console.log('Question speech formatting test passed');
}

function testAnswerSpeechFormatting() {
    assert(formatAnswerSpeech({ operandA: 1, operation: '+', operandB: 1, expectedAnswer: 2 }) === 'One plus one is two.', 'Addition answer speech should include answer fact');
    assert(formatAnswerSpeech({ operandA: 9, operation: '+', operandB: 8, expectedAnswer: 17 }) === 'Nine plus eight is seventeen.', 'Answer speech should support 0-100 number words');
    assert(formatAnswerSpeech({ operandA: 3, operation: '-', operandB: 1, expectedAnswer: 2 }) === 'Three minus one is two.', 'Subtraction answer speech should include answer fact');
    assert(formatAnswerSpeech({ operandA: 50, operation: '+', operandB: 50, expectedAnswer: 100 }) === 'Fifty plus fifty is one hundred.', 'Answer speech should support one hundred');
    console.log('Answer speech formatting test passed');
}

function testNumberBridgeLevelModelDefaults() {
    const level = getNumberBridgeLevelModel();

    assert(level.operation === '+', 'Level model should use addition operation');
    assert(level.level === 1, 'Default model should use level 1');
    assert(level.bridgeValue === 1, 'Default model should use bridge value 1');
    assert(level.levelLabel === 'Addition L1', 'Default model should label Addition L1');
    assert(level.skillLabel === '+1 Bridges', 'Default model should label +1 Bridges');
    assert(level.displayLabel === 'Addition L1 (+1 Bridges)', 'Default display label should combine level and skill');
    console.log('Number Bridges level model defaults test passed');
}

function testLevelLabelGeneration() {
    const level = getNumberBridgeLevelModel(3);

    assert(level.level === 3, 'Level model should normalize requested level');
    assert(level.bridgeValue === 3, 'Level 3 should use bridge value 3');
    assert(level.levelLabel === 'Addition L3', 'Level 3 should label Addition L3');
    assert(level.skillLabel === '+3 Bridges', 'Level 3 should label +3 Bridges');
    assert(level.displayLabel === 'Addition L3 (+3 Bridges)', 'Level 3 display label should combine level and skill');
    console.log('Level label generation test passed');
}

function testOperationPackLabels() {
    const subtraction = getNumberBridgeLevelModel(3, '-');
    const multiplication = getNumberBridgeLevelModel(2, '×');
    const multiplicationL9 = getNumberBridgeLevelModel(9, '×');
    const division = getNumberBridgeLevelModel(1, '÷');
    const divisionClamped = getNumberBridgeLevelModel(9, '÷');

    assert(subtraction.levelLabel === 'Subtraction L3', 'Subtraction should label operation and level');
    assert(subtraction.skillLabel === '-3 Bridges', 'Subtraction L3 should label -3 Bridges');
    assert(subtraction.displayLabel === 'Subtraction L3 (-3 Bridges)', 'Subtraction display label should combine level and skill');
    assert(multiplication.levelLabel === 'Multiplication L2', 'Multiplication should label operation and level');
    assert(multiplication.skillLabel === '×3 Tables', 'Multiplication L2 should label ×3 Tables');
    assert(multiplication.displayLabel === 'Multiplication L2 (×3 Tables)', 'Multiplication display label should combine level and skill');
    assert(multiplicationL9.level === 9, 'Multiplication should support L9');
    assert(multiplicationL9.skillLabel === '×10 Tables', 'Multiplication L9 should use ×10 Tables');
    assert(division.levelLabel === 'Division L1', 'Division should label operation and level');
    assert(division.skillLabel === '÷2 Facts', 'Division L1 should label ÷2 Facts');
    assert(division.displayLabel === 'Division L1 (÷2 Facts)', 'Division display label should combine level and skill');
    assert(divisionClamped.level === 5, 'Division should clamp unsupported L9 to L5');
    assert(divisionClamped.skillLabel === '÷10 Facts', 'Clamped division should use the highest defined fact set');
    console.log('Operation pack label test passed');
}

function testQuestionsPerScreenConfig() {
    assert(normalizeKumonConfig({ questionsPerScreen: 1 }).questionsPerScreen === 1, 'Should accept 1 question per screen');
    assert(normalizeKumonConfig({ questionsPerScreen: 3 }).questionsPerScreen === 3, 'Should accept 3 questions per screen');
    assert(normalizeKumonConfig({ questionsPerScreen: 5 }).questionsPerScreen === 5, 'Should accept 5 questions per screen');
    assert(normalizeKumonConfig({ questionsPerScreen: 2 }).questionsPerScreen === 5, 'Unsupported row count should fall back to 5');
    console.log('Questions per screen config test passed');
}

function testQuestionOrderConfig() {
    const randomConfig = normalizeKumonConfig({ questionOrder: 'random' });
    const fallbackConfig = normalizeKumonConfig({ questionOrder: 'zigzag' });

    assert(randomConfig.questionOrder === 'random', 'Should accept random question order');
    assert(fallbackConfig.questionOrder === 'sequential', 'Unsupported question order should fall back to sequential');
    console.log('Question order config test passed');
}

function testMasterRangeValidation() {
    const ranges = normalizeNumberBridgeMasterRanges({
        aMin: -4,
        aMax: 14,
        bMin: 0,
        bMax: 20
    }, '+');
    const corrected = normalizeNumberBridgeMasterRanges({
        aMin: 7,
        aMax: 2,
        bMin: 8,
        bMax: 1
    }, '+');
    const fallbackSubtraction = normalizeNumberBridgeMasterRanges({
        aMin: 1,
        aMax: 1,
        bMin: 2,
        bMax: 2
    }, '-');

    assert(ranges.aMin === 1, 'A Min lower than 1 should clamp to 1');
    assert(ranges.aMax === 9, 'A Max higher than 9 should clamp to 9');
    assert(ranges.bMin === 1, 'B Min lower than 1 should clamp to 1');
    assert(ranges.bMax === 9, 'B Max higher than 9 should clamp to 9');
    assert(corrected.aMin === 7 && corrected.aMax === 7, 'A Min greater than A Max should correct safely');
    assert(corrected.bMin === 8 && corrected.bMax === 8, 'B Min greater than B Max should correct safely');
    assert(fallbackSubtraction.bMin === 1 && fallbackSubtraction.bMax === 1, 'Invalid subtraction ranges should fallback to a valid non-negative range');
    console.log('Master range validation test passed');
}

function testSequentialQuestionOrder() {
    const questions = generateKumonQuestions({
        firstNumberMin: 1,
        firstNumberMax: 5,
        level: 1,
        questionCount: 5,
        questionOrder: 'sequential'
    });

    assert(questions.map(question => `${question.operandA} + ${question.operandB}`).join(',') === '1 + 1,2 + 1,3 + 1,4 + 1,5 + 1', 'Sequential mode should preserve predictable question order');
    console.log('Sequential question order test passed');
}

function testRandomQuestionOrder() {
    const originalRandom = Math.random;
    Math.random = () => 0;

    try {
        const questions = generateKumonQuestions({
            firstNumberMin: 1,
            firstNumberMax: 5,
            level: 1,
            questionCount: 5,
            questionOrder: 'random'
        });
        const questionKeys = questions.map(question => `${question.operandA} + ${question.operandB}`);

        assert(questionKeys.join(',') === '2 + 1,3 + 1,4 + 1,5 + 1,1 + 1', 'Random mode should shuffle the available question pool');
        assert(new Set(questionKeys).size === questionKeys.length, 'Random mode should avoid duplicates when the pool can satisfy the count');
        assert(questions.every(question => question.operandB === 1), 'Random mode should respect the selected level');
        assert(questions.length === 5, 'Random mode should respect configured question count');
    } finally {
        Math.random = originalRandom;
    }

    console.log('Random question order test passed');
}

function testFixedSecondNumberGeneration() {
    const questions = generateKumonQuestions({
        firstNumberMin: 1,
        firstNumberMax: 3,
        secondNumberMode: 'fixed',
        secondNumberFixedValue: 1,
        questionCount: 5
    });

    assert(questions.length === 5, 'Should generate configured question count');
    assert(questions[0].operandA === 1 && questions[0].operandB === 1, 'First fixed question should be 1 + 1');
    assert(questions[1].operandA === 2 && questions[1].operandB === 1, 'Second fixed question should be 2 + 1');
    assert(questions[2].expectedAnswer === 4, 'Expected answer should be operand sum');
    console.log('Fixed second number generation test passed');
}

function testAdditionLevelTwoGeneratesPlusTwoQuestions() {
    const config = normalizeKumonConfig({
        level: 2,
        firstNumberMin: 1,
        firstNumberMax: 3,
        questionCount: 5
    });
    const questions = generateKumonQuestions(config);

    assert(config.levelLabel === 'Addition L2', 'Level 2 config should label Addition L2');
    assert(config.skillLabel === '+2 Bridges', 'Level 2 config should label +2 Bridges');
    assert(config.bridgeValue === 2, 'Level 2 bridge value should be 2');
    assert(questions[0].operandA === 1 && questions[0].operandB === 2, 'First L2 question should be 1 + 2');
    assert(questions[1].operandA === 2 && questions[1].operandB === 2, 'Second L2 question should be 2 + 2');
    assert(questions[2].expectedAnswer === 5, 'Expected answer should use +2 bridge');
    console.log('Addition L2 question generation test passed');
}

function testAdditionLevelNineGeneratesPlusNineQuestions() {
    const config = normalizeKumonConfig({
        level: 9,
        firstNumberMin: 1,
        firstNumberMax: 3,
        questionCount: 5
    });
    const questions = generateKumonQuestions(config);

    assert(config.level === 9, 'Level 9 config should preserve Addition L9');
    assert(config.levelLabel === 'Addition L9', 'Level 9 config should label Addition L9');
    assert(config.skillLabel === '+9 Bridges', 'Level 9 config should label +9 Bridges');
    assert(config.bridgeValue === 9, 'Level 9 bridge value should be 9');
    assert(questions[0].operandA === 1 && questions[0].operandB === 9, 'First L9 question should be 1 + 9');
    assert(questions[2].expectedAnswer === 12, 'Expected answer should use +9 bridge');
    console.log('Addition L9 question generation test passed');
}

function testSubtractionGeneratesNoNegativeQuestions() {
    const config = normalizeKumonConfig({
        operation: '-',
        level: 3,
        firstNumberMin: 1,
        firstNumberMax: 5,
        questionCount: 5
    });
    const questions = generateKumonQuestions(config);

    assert(config.levelLabel === 'Subtraction L3', 'Subtraction level should label Subtraction L3');
    assert(config.skillLabel === '-3 Bridges', 'Subtraction skill should label -3 Bridges');
    assert(questions.every(question => question.operation === '-'), 'Subtraction questions should use subtraction operation');
    assert(questions.every(question => question.expectedAnswer >= 0), 'Subtraction questions should not produce negative answers');
    assert(questions[0].operandA === 3 && questions[0].operandB === 3 && questions[0].expectedAnswer === 0, 'First valid L3 subtraction should be 3 - 3 = 0');
    console.log('Subtraction operation pack test passed');
}

function testSubtractionLevelNineGeneratesMinusNineQuestions() {
    const config = normalizeKumonConfig({
        operation: '-',
        level: 9,
        questionCount: 10
    });
    const questions = generateKumonQuestions(config);
    const questionForms = questions.map(question => `${question.operandA} - ${question.operandB}`);

    assert(config.level === 9, 'Subtraction config should preserve L9');
    assert(config.levelLabel === 'Subtraction L9', 'Subtraction level should label Subtraction L9');
    assert(config.skillLabel === '-9 Bridges', 'Subtraction skill should label -9 Bridges');
    assert(config.bridgeValue === 9, 'Subtraction L9 bridge value should be 9');
    assert(questions.every(question => question.operation === '-'), 'Subtraction L9 questions should use subtraction operation');
    assert(questions.every(question => question.operandB === 9), 'Subtraction L9 questions should subtract 9');
    assert(new Set(questionForms).size > 2, 'Subtraction L9 should generate more than two unique question forms');
    assert(questionForms.join(',') === '9 - 9,10 - 9,11 - 9,12 - 9,13 - 9,14 - 9,15 - 9,16 - 9,17 - 9,18 - 9', 'Subtraction L9 should generate 9 - 9 through 18 - 9');
    assert(questions.map(question => question.expectedAnswer).join(',') === '0,1,2,3,4,5,6,7,8,9', 'Subtraction L9 answers should span 0 through 9');
    assert(questions[0].operandA === 9 && questions[0].expectedAnswer === 0, 'First valid L9 subtraction should be 9 - 9 = 0');
    console.log('Subtraction L9 question generation test passed');
}

function testSubtractionBridgeLevelsUseTenAnswerRange() {
    for (let level = 1; level <= NUMBER_BRIDGE_MAX_LEVEL; level += 1) {
        const questions = generateKumonQuestions({
            operation: '-',
            level,
            questionCount: 10
        });
        const operandsA = questions.map(question => question.operandA);
        const answers = questions.map(question => question.expectedAnswer);

        assert(operandsA[0] === level, `Subtraction L${level} should start at ${level} - ${level}`);
        assert(operandsA[9] === level + 9, `Subtraction L${level} should end at ${level + 9} - ${level}`);
        assert(questions.every(question => question.operandB === level), `Subtraction L${level} should subtract bridge value ${level}`);
        assert(answers.join(',') === '0,1,2,3,4,5,6,7,8,9', `Subtraction L${level} answers should span 0 through 9`);
        assert(questions.every(question => question.expectedAnswer >= 0), `Subtraction L${level} should not generate negative answers`);
    }

    console.log('Subtraction L1-L9 bridge range test passed');
}

function testMultiplicationGeneratesTableQuestions() {
    [
        { level: 1, factor: 2 },
        { level: 5, factor: 6 },
        { level: 9, factor: 10 }
    ].forEach(({ level, factor }) => {
        const config = normalizeKumonConfig({
            operation: '×',
            level,
            firstNumberMin: 1,
            firstNumberMax: 3,
            questionCount: 3
        });
        const questions = generateKumonQuestions(config);

        assert(config.level === level, `Multiplication should preserve L${level}`);
        assert(config.levelLabel === `Multiplication L${level}`, `Multiplication level should label L${level}`);
        assert(config.skillLabel === `×${factor} Tables`, `Multiplication L${level} should label ×${factor} Tables`);
        assert(questions.every(question => question.operandB === factor), `Multiplication L${level} should use factor ${factor}`);
        assert(questions[2].expectedAnswer === 3 * factor, `3 × ${factor} should equal ${3 * factor}`);
    });

    for (let level = 6; level <= NUMBER_BRIDGE_MAX_LEVEL; level += 1) {
        const config = normalizeKumonConfig({ operation: '×', level, questionCount: 1 });
        assert(config.bridgeValue !== 2, `Multiplication L${level} should not fall back to ×2 Tables`);
    }

    console.log('Multiplication operation pack test passed');
}

function testDivisionGeneratesExactIntegerQuestions() {
    const config = normalizeKumonConfig({
        operation: '÷',
        level: 1,
        firstNumberMin: 1,
        firstNumberMax: 10,
        questionCount: 5
    });
    const questions = generateKumonQuestions(config);

    assert(config.levelLabel === 'Division L1', 'Division level should label Division L1');
    assert(config.skillLabel === '÷2 Facts', 'Division skill should label ÷2 Facts');
    assert(questions.every(question => question.operation === '÷'), 'Division questions should use division operation');
    assert(questions.every(question => question.operandA % question.operandB === 0), 'Division questions should divide evenly');
    assert(questions.every(question => Number.isInteger(question.expectedAnswer)), 'Division answers should be integers');
    assert(questions[0].operandA === 2 && questions[0].operandB === 2 && questions[0].expectedAnswer === 1, 'First valid L1 division should be 2 ÷ 2 = 1');
    console.log('Division operation pack test passed');
}

function testRangeSecondNumberGeneration() {
    const questions = generateKumonQuestions({
        firstNumberMin: 1,
        firstNumberMax: 4,
        secondNumberMode: 'range',
        secondNumberMin: 2,
        secondNumberMax: 3,
        questionCount: 5
    });

    assert(questions[0].operandA === 1 && questions[0].operandB === 2, 'First range question should use lower bounds');
    assert(questions[1].operandA === 2 && questions[1].operandB === 3, 'Second range question should advance second operand');
    assert(questions[2].operandA === 3 && questions[2].operandB === 2, 'Range second operand should cycle deterministically');
    console.log('Range second number generation test passed');
}

function testAdditionMasterGeneratesRandomRangeQuestions() {
    const originalRandom = Math.random;
    const randomValues = [0, 0.24, 0.48, 0.72, 0.96];
    let randomIndex = 0;
    Math.random = () => randomValues[randomIndex++ % randomValues.length];

    try {
        const config = normalizeKumonConfig({
            operation: '+',
            arithmeticMode: 'master',
            aMin: 1,
            aMax: 3,
            bMin: 1,
            bMax: 3,
            questionCount: 5
        });
        const questions = generateKumonQuestions(config);
        const questionKeys = questions.map(question => `${question.operandA} + ${question.operandB}`);

        assert(config.arithmeticMode === 'master', 'Addition Master should normalize as master mode');
        assert(config.levelDisplayLabel === 'Addition Master A1-3 B1-3', 'Addition Master label should include A/B ranges');
        assert(questions.every(question => question.operandA >= 1 && question.operandA <= 3), 'Addition Master A should stay in range');
        assert(questions.every(question => question.operandB >= 1 && question.operandB <= 3), 'Addition Master B should stay in range');
        assert(questions.every(question => question.expectedAnswer === question.operandA + question.operandB), 'Addition Master answers should add A and B');
        assert(new Set(questionKeys).size > 1, 'Addition Master should show randomized variety');
    } finally {
        Math.random = originalRandom;
    }

    console.log('Addition Master generation test passed');
}

function testSubtractionMasterGeneratesOnlyNonNegativeQuestions() {
    const questions = generateKumonQuestions({
        operation: '-',
        arithmeticMode: 'master',
        aMin: 1,
        aMax: 3,
        bMin: 1,
        bMax: 3,
        questionCount: 20
    });
    const fallbackQuestions = generateKumonQuestions({
        operation: '-',
        arithmeticMode: 'master',
        aMin: 1,
        aMax: 1,
        bMin: 2,
        bMax: 2,
        questionCount: 3
    });

    assert(questions.every(question => question.operandA >= 1 && question.operandA <= 3), 'Subtraction Master A should stay in range');
    assert(questions.every(question => question.operandB >= 1 && question.operandB <= 3), 'Subtraction Master B should stay in range');
    assert(questions.every(question => question.expectedAnswer === question.operandA - question.operandB), 'Subtraction Master answers should subtract B from A');
    assert(questions.every(question => question.expectedAnswer >= 0), 'Subtraction Master should not generate negative answers');
    assert(fallbackQuestions.every(question => question.operandA === 1 && question.operandB === 1), 'Invalid subtraction Master range should fallback safely');
    assert(fallbackQuestions.every(question => question.expectedAnswer === 0), 'Fallback subtraction Master answers should be non-negative');
    console.log('Subtraction Master generation test passed');
}

function testUnsupportedOperationsStayBridgeMode() {
    const multiplication = normalizeKumonConfig({ operation: '×', arithmeticMode: 'master', level: 9 });
    const division = normalizeKumonConfig({ operation: '÷', arithmeticMode: 'master', level: 9 });

    assert(multiplication.arithmeticMode === 'bridge', 'Multiplication should not enter Master mode');
    assert(multiplication.level === 9 && multiplication.bridgeValue === 10, 'Multiplication should keep bridge L9 mapping');
    assert(division.arithmeticMode === 'bridge', 'Division should not enter Master mode');
    assert(division.level === 5 && division.bridgeValue === 10, 'Division should keep current bridge clamp behavior');
    console.log('Unsupported Master operation guard test passed');
}

function testCorrectAnswerAdvances() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 1 });
    const question = game.getCurrentQuestion();

    const outcome = game.validateAnswer(question.expectedAnswer, {
        reactionTimeMs: 120,
        timestamp: '2026-06-16T00:00:00.000Z',
        validationSource: 'enter'
    });
    assert(outcome.result === 'success', 'Correct answer should produce success');
    assert(outcome.trial.autoAdvanced === true, 'Correct answer should preserve auto-advanced analytics');
    assert(game.getState().lastResult === 'success', 'Correct answer should expose local success marker state');
    assert(game.getState().currentQuestionIndex === 0, 'Correct answer should wait for smooth advance');

    const advance = game.advanceAfterCorrect();
    assert(advance.result === 'advanced', 'Smooth advance should move to next question');
    assert(game.getState().currentQuestionIndex === 1, 'Question index should advance after correct answer');
    assert(game.getState().lastResult === null, 'Advance should clear per-question success state');
    console.log('Correct answer advance test passed');
}

function testBlurValidationAcceptsCorrectAnswer() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 1 });
    const question = game.getCurrentQuestion();

    const outcome = game.validateAnswer(String(question.expectedAnswer), {
        reactionTimeMs: 130,
        timestamp: '2026-06-16T00:00:00.000Z',
        validationSource: 'blur'
    });

    assert(outcome.result === 'success', 'Blur validation should accept correct answer');
    assert(game.getState().trials.length === 1, 'Blur validation should record one meaningful attempt');
    console.log('Blur validation test passed');
}

function testWrongAnswerDoesNotAdvanceAndShowsHint() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5, hintsEnabled: true });
    const question = game.getCurrentQuestion();

    const outcome = game.validateAnswer(question.expectedAnswer + 1, {
        reactionTimeMs: 150,
        timestamp: '2026-06-16T00:00:00.000Z',
        validationSource: 'blur'
    });
    const state = game.getState();

    assert(outcome.result === 'mistake', 'Wrong answer should produce mistake');
    assert(outcome.trial.autoAdvanced === false, 'Wrong answer should preserve no-auto-advance analytics');
    assert(state.currentQuestionIndex === 0, 'Wrong answer should stay on same question');
    assert(state.supportState?.hintLevel === 1, 'Wrong answer should reveal first hint when enabled');
    assert(state.correctQuestionIds[question.questionId] !== true, 'Wrong answer should not lock row');
    assert(!state.supportState.text.includes('+ 0'), 'Wrong answer hint should not introduce plus zero');
    console.log('Wrong answer scaffold test passed');
}

function testDuplicateEnterBlurDoesNotDoubleRecordAttempt() {
    const game = createKumonQuizGame({ questionCount: 5 });
    const question = game.getCurrentQuestion();

    const enterOutcome = game.validateAnswer(question.expectedAnswer, {
        reactionTimeMs: 120,
        timestamp: '2026-06-16T00:00:00.000Z',
        validationSource: 'enter'
    });
    const blurOutcome = game.validateAnswer(String(question.expectedAnswer), {
        reactionTimeMs: 125,
        timestamp: '2026-06-16T00:00:00.100Z',
        validationSource: 'blur'
    });
    const state = game.getState();

    assert(enterOutcome.result === 'success', 'Enter should validate the correct answer');
    assert(blurOutcome.result === 'duplicate', 'Blur with unchanged answer should be ignored as duplicate');
    assert(state.trials.length === 1, 'Duplicate Enter plus blur should not double-record analytics');
    assert(state.attemptNumberByQuestion[question.questionId] === 1, 'Duplicate validation should not increment attempts');
    console.log('Duplicate validation guard test passed');
}

function testFiveRowModeLocksCorrectRowsAndKeepsAnswers() {
    const game = createKumonQuizGame({ questionCount: 10, questionsPerScreen: 5 });
    const visibleQuestions = game.getVisibleQuestions();
    const first = visibleQuestions[0];

    assert(visibleQuestions.length === 5, 'Five-row mode should expose five active rows');

    const outcome = game.validateAnswer(first.expectedAnswer, {
        questionId: first.questionId,
        reactionTimeMs: 110,
        timestamp: '2026-06-16T00:00:00.000Z',
        validationSource: 'enter'
    });
    const state = game.getState();

    assert(outcome.result === 'success', 'Correct row should validate successfully');
    assert(outcome.trial.autoAdvanced === false, 'Partial group correct row should not auto-advance analytics');
    assert(state.correctQuestionIds[first.questionId] === true, 'Correct row should lock');
    assert(state.answerValueByQuestion[first.questionId] === String(first.expectedAnswer), 'Correct row answer should remain visible in state');
    assert(state.rowResultByQuestion[first.questionId] === 'success', 'Correct row should expose local tick state');
    assert(state.successPendingAdvance === false, 'Group should not advance until all visible rows are correct');
    assert(game.advanceAfterCorrect().result === 'ignored', 'Partial group should not advance');
    console.log('Five-row row lock test passed');
}

function testFiveRowGroupAdvancesAfterAllVisibleRowsCorrect() {
    const game = createKumonQuizGame({ questionCount: 10, questionsPerScreen: 5 });
    const visibleQuestions = game.getVisibleQuestions();

    visibleQuestions.forEach((question, rowIndex) => {
        const outcome = game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 100 + rowIndex,
            timestamp: `2026-06-16T00:00:0${rowIndex}.000Z`,
            validationSource: 'enter'
        });

        assert(outcome.result === 'success', `Row ${rowIndex} should validate successfully`);
        assert(outcome.trial.rowIndex === rowIndex, `Row ${rowIndex} analytics should include row index`);
        assert(outcome.trial.pageIndex === 0, 'First group analytics should include page index 0');
        assert(outcome.trial.questionsPerScreen === 5, 'Analytics should include configured row count');
    });

    assert(game.getState().successPendingAdvance === true, 'Group should be ready to advance after all rows correct');

    const advance = game.advanceAfterCorrect();
    assert(advance.result === 'advanced', 'Completed visible group should advance');
    assert(game.getState().currentQuestionIndex === 5, 'Next group should start after five rows');
    console.log('Five-row group advance test passed');
}

function testPageTransitionTimingDoesNotChangeScoring() {
    const game = createKumonQuizGame({ questionCount: 10, questionsPerScreen: 5 });
    const visibleQuestions = game.getVisibleQuestions();

    visibleQuestions.forEach((question, rowIndex) => {
        game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 100 + rowIndex,
            timestamp: `2026-06-16T00:00:0${rowIndex}.000Z`,
            validationSource: 'enter'
        });
    });

    const beforeAdvance = game.getState();
    assert(beforeAdvance.successPendingAdvance === true, 'Completed group should wait for transition before state advance');
    assert(beforeAdvance.correctCount === 5, 'Transition wait should not change scoring');
    assert(getNumberBridgeTransitionDurationMs(false) === NUMBER_BRIDGE_PAGE_TURN_MS, 'Default transition should use calm page-turn duration');
    assert(getNumberBridgeTransitionDurationMs(true) === 0, 'Reduced motion should skip page-turn delay');

    const advance = game.advanceAfterCorrect();
    const afterAdvance = game.getState();
    assert(advance.result === 'advanced', 'Transition-complete advance should still move to next group');
    assert(afterAdvance.currentQuestionIndex === 5, 'Next group should start at index 5 after transition');
    assert(afterAdvance.correctCount === 5, 'Advance should not change scoring');
    console.log('Page transition timing scoring test passed');
}

function testCompletionProducesResultState() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5 });
    const visibleQuestions = game.getVisibleQuestions();

    visibleQuestions.forEach(question => {
        game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 100,
            timestamp: '2026-06-16T00:00:00.000Z'
        });
    });

    const advance = game.advanceAfterCorrect();
    const state = game.getState();

    assert(advance.result === 'complete', 'Final group should complete into result state');
    assert(state.completed === true, 'Completed flag should remain true for result page rendering');
    assert(state.completionState.correct === 5, 'Completion state should include correct count');
    assert(state.completionState.total === 5, 'Completion state should include total count');
    console.log('Completion result state test passed');
}

function completeVisibleRound(game, wrongCount = 0) {
    const visibleQuestions = game.getVisibleQuestions();

    visibleQuestions.forEach((question, index) => {
        if (index < wrongCount) {
            game.validateAnswer(question.expectedAnswer + 9, {
                questionId: question.questionId,
                reactionTimeMs: 100,
                timestamp: `2026-06-16T00:00:0${index}.000Z`
            });
        }

        game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 100,
            timestamp: `2026-06-16T00:00:1${index}.000Z`
        });
    });

    return game.advanceAfterCorrect();
}

function testAutoProgressionFalseRepeatsSameLevel() {
    const game = createKumonQuizGame({ level: 1, autoProgression: false, questionCount: 5, questionsPerScreen: 5 });

    completeVisibleRound(game);
    assert(game.getState().completed === true, 'Round should complete before reset');
    game.resetRound();

    const state = game.getState();
    assert(state.config.level === 1, 'Auto progression false should repeat same level');
    assert(state.config.levelLabel === 'Addition L1', 'Repeated round should keep Addition L1');
    assert(state.questions[0].operandB === 1, 'Repeated L1 should keep +1 questions');
    console.log('Auto progression false repeat test passed');
}

function testAutoProgressionAdvancesOnHighAccuracy() {
    const game = createKumonQuizGame({ level: 1, autoProgression: true, questionCount: 5, questionsPerScreen: 5 });

    completeVisibleRound(game);
    game.resetRound();

    const state = game.getState();
    assert(state.config.level === 2, 'Auto progression true should advance after 100% accuracy');
    assert(state.config.levelLabel === 'Addition L2', 'Advanced round should label Addition L2');
    assert(state.questions[0].operandB === 2, 'Advanced L2 should generate +2 questions');
    console.log('Auto progression high accuracy advance test passed');
}

function testAutoProgressionRepeatsOnLowAccuracy() {
    const game = createKumonQuizGame({ level: 2, autoProgression: true, questionCount: 5, questionsPerScreen: 5 });

    completeVisibleRound(game, 2);
    const summary = game.getResultSummary();
    assert(summary.accuracy === 100, 'Resolved accuracy should preserve existing corrected-answer contract');
    assert(summary.progressionAccuracy === 71, 'Two corrections on five correct answers should keep progression accuracy below 80');
    game.resetRound();

    const state = game.getState();
    assert(state.config.level === 2, 'Auto progression true should repeat after low accuracy');
    assert(state.questions[0].operandB === 2, 'Repeated L2 should keep +2 questions');
    console.log('Auto progression low accuracy repeat test passed');
}

function testAutoProgressionCapsAtLevelNine() {
    assert(getNextNumberBridgeLevel({ level: NUMBER_BRIDGE_MAX_LEVEL, autoProgression: true }, 100) === NUMBER_BRIDGE_MAX_LEVEL, 'Next level should cap at Addition L9');

    const game = createKumonQuizGame({ level: NUMBER_BRIDGE_MAX_LEVEL, autoProgression: true, questionCount: 5, questionsPerScreen: 5 });
    completeVisibleRound(game);
    game.resetRound();

    const state = game.getState();
    assert(state.config.level === NUMBER_BRIDGE_MAX_LEVEL, 'Reset should not advance beyond L9');
    assert(state.config.levelLabel === 'Addition L9', 'Capped round should remain Addition L9');
    assert(state.questions[0].operandB === 9, 'Capped L9 should keep +9 questions');
    console.log('Auto progression cap test passed');
}

function testSessionSummaryStoresScoreTotalAndAccuracy() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5, hintsEnabled: true });
    const visibleQuestions = game.getVisibleQuestions();

    game.validateAnswer(visibleQuestions[0].expectedAnswer + 1, {
        questionId: visibleQuestions[0].questionId,
        reactionTimeMs: 1000,
        timestamp: '2026-06-16T00:00:00.000Z'
    });

    visibleQuestions.slice(0, 4).forEach((question, index) => {
        game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 1000 + index,
            timestamp: '2026-06-16T00:00:01.000Z'
        });
    });

    const summary = game.getResultSummary();
    const session = createKumonSessionSummary(game.getState(), summary);

    assert(session.gameId === 'kumonQuiz', 'Session summary should store Number Bridges activity id');
    assert(session.activityName === 'Kumon Quiz / Number Bridges', 'Session summary should store activity name');
    assert(session.operation === '+', 'Session summary should store operation');
    assert(session.level === 1, 'Session summary should store level');
    assert(session.levelLabel === 'Addition L1', 'Session summary should store level label');
    assert(session.skillLabel === '+1 Bridges', 'Session summary should store skill label');
    assert(session.levelDisplayLabel === 'Addition L1 (+1 Bridges)', 'Session summary should store combined level display');
    assert(session.bridgeValue === 1, 'Session summary should store bridge value');
    assert(session.autoProgression === false, 'Session summary should store auto progression flag');
    assert(session.questionOrderMode === 'sequential', 'Session summary should store question order mode');
    assert(Number.isFinite(session.progressionAccuracy), 'Session summary should store progression accuracy metadata');
    assert(session.score === 4, 'Session score should be correct count');
    assert(session.correctCount === 4, 'Session should store correct count');
    assert(session.totalQuestions === 5, 'Session should store total questions');
    assert(session.accuracy === 0.8, `Session accuracy should be ratio 0.8, got ${session.accuracy}`);
    assert(session.accuracyPercent === 80, 'Session accuracyPercent should be 80');
    assert(session.sessionLengthSeconds === summary.timeTakenSeconds, 'Session should store total time seconds');
    assert(session.averageTimePerQuestion === summary.averageTimeSeconds, 'Session should store average time per question');
    assert(session.hintUsageCount === summary.hintsUsed, 'Session should store hint usage');
    assert(session.mistakeCount === summary.mistakeCount, 'Session should store mistake count');
    console.log('Session summary analytics test passed');
}

function testMasterAnalyticsFields() {
    const game = createKumonQuizGame({
        operation: '+',
        arithmeticMode: 'master',
        aMin: 1,
        aMax: 3,
        bMin: 1,
        bMax: 2,
        questionCount: 5,
        questionsPerScreen: 1
    });
    const question = game.getCurrentQuestion();
    const outcome = game.submitAnswer(question.expectedAnswer, {
        reactionTimeMs: 100,
        timestamp: '2026-06-16T00:00:00.000Z'
    });
    const summary = game.getResultSummary();
    const session = createKumonSessionSummary(game.getState(), summary);

    assert(outcome.trial.mode === 'master', 'Master trial should store mode master');
    assert(outcome.trial.aMin === 1 && outcome.trial.aMax === 3, 'Master trial should store A range');
    assert(outcome.trial.bMin === 1 && outcome.trial.bMax === 2, 'Master trial should store B range');
    assert(session.mode === 'master', 'Master session should store mode master');
    assert(session.aMin === 1 && session.aMax === 3, 'Master session should store A range');
    assert(session.bMin === 1 && session.bMax === 2, 'Master session should store B range');
    assert(session.levelLabel === 'Addition Master', 'Master session should store Master level label');
    assert(session.levelDisplayLabel === 'Addition Master A1-3 B1-2', 'Master session should store Master display label');
    assert(summary.nextLevelSuggested === game.getState().config.level, 'Master mode should not suggest auto progression');
    console.log('Master analytics fields test passed');
}

function testOperationMetadataForResultAndSession() {
    const game = createKumonQuizGame({
        operation: '÷',
        level: 1,
        firstNumberMin: 1,
        firstNumberMax: 10,
        questionCount: 5,
        questionsPerScreen: 5
    });

    completeVisibleRound(game);
    const summary = game.getResultSummary();
    const session = createKumonSessionSummary(game.getState(), summary);
    const markup = renderNumberBridgeResultMarkup(summary, 'Adarsh');

    assert(summary.operation === '÷', 'Result summary should store division operation');
    assert(summary.levelLabel === 'Division L1', 'Result summary should store division level label');
    assert(summary.skillLabel === '÷2 Facts', 'Result summary should store division skill label');
    assert(markup.includes('Division L1 (÷2 Facts)'), 'Result page should render division level context');
    assert(session.operation === '÷', 'Session summary should store division operation');
    assert(session.levelLabel === 'Division L1', 'Session summary should store division level label');
    assert(session.skillLabel === '÷2 Facts', 'Session summary should store division skill label');
    console.log('Operation metadata result and session test passed');
}

function testTrialTableDoesNotRequirePerTrialLevel() {
    const game = createKumonQuizGame({ level: 2, questionCount: 5, questionsPerScreen: 1 });
    const question = game.getCurrentQuestion();
    const outcome = game.validateAnswer(question.expectedAnswer, {
        reactionTimeMs: 200,
        timestamp: '2026-06-16T00:00:00.000Z'
    });
    const session = createKumonSessionSummary(game.getState(), game.getResultSummary());

    assert(session.level === 2, 'Session should carry the authoritative Number Bridges level');
    assert(session.levelLabel === 'Addition L2', 'Session should carry the authoritative Number Bridges level label');
    assert(outcome.trial.level === 2, 'Trial may include convenient level metadata');
    assert(!Object.prototype.hasOwnProperty.call(outcome.trial, 'stage'), 'Number Bridges trial rows should not require stage/level table data');
    console.log('Trial table level metadata source test passed');
}

function testWrongAttemptsDoNotReduceResolvedScore() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5, hintsEnabled: true });
    const visibleQuestions = game.getVisibleQuestions();
    const first = visibleQuestions[0];

    game.validateAnswer(8, {
        questionId: first.questionId,
        reactionTimeMs: 100,
        timestamp: '2026-06-16T00:00:00.000Z'
    });
    game.validateAnswer(5, {
        questionId: first.questionId,
        reactionTimeMs: 120,
        timestamp: '2026-06-16T00:00:01.000Z'
    });

    visibleQuestions.forEach(question => {
        game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 140,
            timestamp: '2026-06-16T00:00:02.000Z'
        });
    });

    const summary = game.getResultSummary();

    assert(summary.correct === 5, 'Resolved score should count the corrected question as correct');
    assert(summary.accuracy === 100, 'Resolved accuracy should use final question state');
    assert(summary.mistakeCount === 2, 'Mistake count should track wrong attempts separately');
    assert(summary.wrongAnswers.length === 1, 'Review should show one corrected question');
    assert(summary.wrongAnswers[0].attemptedAnswers.join(',') === '8,5', 'Review should list wrong attempts');
    assert(summary.wrongAnswers[0].correctAnswer === first.expectedAnswer, 'Review should show final correct answer');
    console.log('Wrong attempts resolved score test passed');
}

function testHintUsageDoesNotReduceResolvedScore() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5, hintsEnabled: true });
    const visibleQuestions = game.getVisibleQuestions();
    const first = visibleQuestions[0];

    game.requestHint({ questionId: first.questionId });
    visibleQuestions.forEach(question => {
        game.validateAnswer(question.expectedAnswer, {
            questionId: question.questionId,
            reactionTimeMs: 140,
            timestamp: '2026-06-16T00:00:02.000Z'
        });
    });

    const summary = game.getResultSummary();

    assert(summary.correct === 5, 'Hint usage should not reduce resolved score');
    assert(summary.accuracy === 100, 'Hint usage should not reduce accuracy');
    assert(summary.hintsUsed === 1, 'Hint usage should be counted separately');
    assert(summary.mistakeCount === 0, 'Hint usage should not count as a mistake');
    console.log('Hint usage resolved score test passed');
}

function testHintDisabled() {
    const game = createKumonQuizGame({ questionCount: 5, hintsEnabled: false, learnerName: 'Adarsh' });
    const question = game.getCurrentQuestion();

    game.submitAnswer(question.expectedAnswer + 1, { reactionTimeMs: 150, timestamp: '2026-06-16T00:00:00.000Z' });
    const state = game.getState();
    const supportMessage = renderNumberBridgeSupportText(state, state.learnerName);

    assert(state.supportState?.hintLevel === 0, 'Hints disabled should not reveal scaffold level');
    assert(state.supportState?.scaffoldType === 'supportive-retry', 'Hints disabled should show retry support only');
    assert(supportMessage.includes('You got close, Adarsh.'), 'Support message should include learner name');
    assert(supportMessage.includes('Try again.'), 'Hints disabled should show supportive retry message');
    assert(!supportMessage.includes('→'), 'Hints disabled should suppress scaffold path');
    assert(game.requestHint().result === 'ignored', 'Manual hint should be ignored when disabled');
    console.log('Hint disabled test passed');
}

function testResultSummary() {
    const game = createKumonQuizGame({ questionCount: 5 });
    const first = game.getCurrentQuestion();

    game.submitAnswer(first.expectedAnswer + 1, { reactionTimeMs: 150, timestamp: '2026-06-16T00:00:00.000Z' });
    game.submitAnswer(first.expectedAnswer, { reactionTimeMs: 160, timestamp: '2026-06-16T00:00:01.000Z' });
    game.advanceAfterCorrect();

    const summary = game.getResultSummary();
    assert(summary.correct === 1, 'Summary should count correct answers');
    assert(summary.total === 5, 'Summary should include total questions');
    assert(summary.timeTakenSeconds === 0, 'Summary should include rounded time taken');
    assert(summary.averageTimeSeconds === 0.1, 'Summary should include average time per question');
    assert(summary.mistakeCount === 1, 'Summary should include mistake count');
    assert(summary.wrongAnswers.length === 1, 'Summary should include wrong answer list');
    assert(summary.wrongAnswers[0].correctAnswer === first.expectedAnswer, 'Wrong list should include correct answer');
    assert(summary.wrongAnswers[0].attemptedAnswers[0] === first.expectedAnswer + 1, 'Wrong list should include attempted answer');
    console.log('Result summary test passed');
}

function testResultSummaryHintsUsed() {
    const game = createKumonQuizGame({ questionCount: 5, questionsPerScreen: 5, hintsEnabled: true });
    const first = game.getCurrentQuestion();

    game.requestHint({ questionId: first.questionId });
    game.submitAnswer(first.expectedAnswer + 1, {
        questionId: first.questionId,
        reactionTimeMs: 200,
        timestamp: '2026-06-16T00:00:00.000Z'
    });

    const summary = game.getResultSummary();
    assert(summary.hintsUsed === 2, 'Summary should count manual and wrong-answer scaffold hints');
    console.log('Result summary hints used test passed');
}

function testResultMarkupCompactSummaryAndReview() {
    const markup = renderNumberBridgeResultMarkup({
        levelDisplayLabel: 'Addition L1 (+1 Bridges)',
        correct: 10,
        total: 10,
        accuracy: 100,
        timeTakenSeconds: 294,
        averageTimeSeconds: 29.4,
        hintsUsed: 1,
        mistakeCount: 1,
        wrongAnswers: [{
            question: '3 + 1',
            attemptedAnswers: [5],
            correctAnswer: 4
        }]
    }, 'Adarsh');

    assert(markup.includes('data-testid="number-bridges-results"'), 'Result markup should include result container');
    assert(markup.includes('Great work, Adarsh!'), 'Result markup should include learner-aware completion');
    assert(markup.includes('You finished your Number Bridges.'), 'Result markup should include completion message');
    assert(markup.includes('Addition L1 (+1 Bridges)'), 'Result markup should include level context');
    assert(markup.includes('data-testid="number-bridges-clap-visual"'), 'Result markup should include gentle clap visual marker');
    assert(markup.includes('data-testid="number-bridges-result-header-accuracy"'), 'Result markup should promote accuracy in the completion header');
    assert(markup.includes('100% Accuracy'), 'Result markup should show perfect accuracy in the completion header');
    assert(markup.includes('10 / 10 Correct'), 'Result markup should show score in the completion header');
    assert(markup.includes('Questions: 10'), 'Result markup should include questions total');
    assert(markup.includes('Correct / Total: 10 / 10'), 'Result markup should include correct / total');
    assert(markup.includes('Accuracy: 100%'), 'Result markup should include accuracy');
    assert(markup.includes('Time Taken: 294 sec'), 'Result markup should include time taken');
    assert(markup.includes('Average Time: 29.4 sec/question'), 'Result markup should include average time');
    assert(markup.includes('Hints Used: 1'), 'Result markup should include hints used');
    assert(markup.includes('Mistakes Corrected: 1'), 'Result markup should include mistakes corrected');
    assert(markup.includes('3 + 1'), 'Review item should show question');
    assert(markup.includes('Attempted: 5'), 'Review item should show attempted answer');
    assert(markup.includes('Correct: 4'), 'Review item should show correct answer');
    assert(!markup.includes('3 + 1 = 5'), 'Review item should not render a misleading equation');
    console.log('Result markup compact summary and review test passed');
}

function testResultMarkupPerfectAccuracyHeader() {
    const markup = renderNumberBridgeResultMarkup({
        correct: 20,
        total: 20,
        accuracy: 100,
        timeTakenSeconds: 120,
        averageTimeSeconds: 6,
        hintsUsed: 0,
        mistakeCount: 0,
        wrongAnswers: []
    }, 'Adarsh');

    assert(markup.includes('100% Accuracy'), 'Perfect result should show 100% Accuracy in the header');
    assert(markup.includes('20 / 20 Correct'), 'Perfect result should keep score visible in the header');
    assert(markup.includes('Correct / Total: 20 / 20'), 'Perfect result should keep existing score display visible');
    console.log('Result markup perfect accuracy header test passed');
}

function testResultMarkupPartialAccuracyHeader() {
    const markup = renderNumberBridgeResultMarkup({
        correct: 18,
        total: 20,
        accuracy: 90,
        timeTakenSeconds: 150,
        averageTimeSeconds: 7.5,
        hintsUsed: 1,
        mistakeCount: 2,
        wrongAnswers: [{
            question: '9 + 1',
            attemptedAnswers: [11],
            correctAnswer: 10
        }]
    }, 'Adarsh');

    assert(markup.includes('90% Accuracy'), 'Partial result should show actual rounded accuracy in the header');
    assert(markup.includes('18 / 20 Correct'), 'Partial result should keep score visible in the header');
    assert(markup.includes('Correct / Total: 18 / 20'), 'Partial result should keep existing score display visible');
    console.log('Result markup partial accuracy header test passed');
}

function testCompletionClapGuardOnlyPlaysOnce() {
    let playCount = 0;
    const completedState = { completed: true, completionCelebrationPlayed: false };

    assert(shouldPlayNumberBridgeCompletionClap(completedState) === true, 'Completed state should allow one clap');
    assert(playNumberBridgeCompletionClap(() => { playCount += 1; }) === true, 'Playable clap helper should report success');

    const playedState = markNumberBridgeCompletionClapPlayed(completedState);
    assert(playedState.completionCelebrationPlayed === true, 'Clap guard should mark celebration as played');
    assert(shouldPlayNumberBridgeCompletionClap(playedState) === false, 'Played completion should not clap again');
    assert(shouldPlayNumberBridgeCompletionClap({ completed: false, completionCelebrationPlayed: false }) === false, 'Incomplete state should not clap');
    playNumberBridgeCompletionClap(() => { throw new Error('blocked audio'); });
    assert(playCount === 1, 'Blocked later audio should not affect prior one-shot count');
    console.log('Completion clap guard test passed');
}

function testResultMarkupAllCorrectMessage() {
    const markup = renderNumberBridgeResultMarkup({
        correct: 5,
        total: 5,
        accuracy: 100,
        timeTakenSeconds: 40,
        averageTimeSeconds: 8,
        hintsUsed: 0,
        mistakeCount: 0,
        wrongAnswers: []
    }, 'Adarsh');

    assert(markup.includes('All answers correct!'), 'All-correct result should show all-correct review message');
    assert(!markup.includes('data-testid="number-bridges-wrong-list"'), 'All-correct result should not render wrong list');
    console.log('Result markup all-correct test passed');
}

function testTrialAnalyticsFields() {
    const game = createKumonQuizGame({
        questionCount: 5,
        questionsPerScreen: 1,
        learnerName: 'Adarsh',
        mode: 'assessment'
    });
    const question = game.getCurrentQuestion();

    game.requestHint();
    const outcome = game.submitAnswer(question.expectedAnswer, {
        reactionTimeMs: 200,
        timestamp: '2026-06-16T00:00:00.000Z'
    });
    const trial = outcome.trial;

    [
        'sessionId',
        'activityId',
        'learnerName',
        'questionId',
        'questionIndex',
        'operation',
        'operandA',
        'operandB',
        'expectedAnswer',
        'learnerAnswer',
        'isCorrect',
        'attemptNumber',
        'reactionTimeMs',
        'hintUsed',
        'hintLevel',
        'scaffoldType',
        'autoAdvanced',
        'configuredMode',
        'hintsEnabled',
        'questionsPerScreen',
        'pageIndex',
        'rowIndex',
        'timestamp'
    ].forEach(field => {
        assert(Object.prototype.hasOwnProperty.call(trial, field), `Trial should include ${field}`);
    });

    assert(trial.learnerName === 'Adarsh', 'Trial should capture learner name');
    assert(trial.hintUsed === true, 'Trial should capture hint usage');
    assert(trial.autoAdvanced === true, 'Correct trial should capture auto-advance intent');
    assert(trial.configuredMode === 'assessment', 'Trial should capture configured mode');
    assert(trial.questionsPerScreen === 1, 'Trial should capture questions per screen');
    assert(trial.pageIndex === 0, 'Trial should capture page index');
    assert(trial.rowIndex === 0, 'Trial should capture row index');
    console.log('Trial analytics fields test passed');
}

function testHintText() {
    const oneMoreHint = createAdditionHint({ operandA: 3, operandB: 1 }, 1);
    const twoMoreHint = createAdditionHint({ operandA: 3, operandB: 2 }, 1);
    const threeMoreHint = createAdditionHint({ operandA: 4, operandB: 3 }, 1);

    assert(!oneMoreHint.text.includes('3 + 0'), '3 + 1 hint should not produce 3 + 0');
    assert(oneMoreHint.text.includes('Count one more.'), '3 + 1 hint should ask learner to count one more');
    assert(oneMoreHint.text.includes('3 → 4'), '3 + 1 hint should show path 3 → 4');
    assert(twoMoreHint.text.includes('Start with 3. Count two more.'), '3 + 2 hint should use bridge value two');
    assert(twoMoreHint.text.includes('3 → 4 → 5'), '3 + 2 hint should show path 3 → 4 → 5');
    assert(threeMoreHint.text.includes('Start with 4. Count three more.'), '4 + 3 hint should use bridge value three');
    assert(threeMoreHint.text.includes('4 → 5 → 6 → 7'), '4 + 3 hint should show path 4 → 5 → 6 → 7');
    console.log('Hint text test passed');
}

function testWrongAnswerHintContractForRangeBridges() {
    const game = createKumonQuizGame({
        firstNumberMin: 3,
        firstNumberMax: 4,
        secondNumberMode: 'range',
        secondNumberMin: 1,
        secondNumberMax: 3,
        questionCount: 5,
        questionsPerScreen: 5,
        hintsEnabled: true
    });
    const visibleQuestions = game.getVisibleQuestions();
    const question3Plus1 = visibleQuestions[0];
    const question4Plus2 = visibleQuestions[1];

    const wrongOutcome = game.submitAnswer(5, {
        questionId: question3Plus1.questionId,
        reactionTimeMs: 200,
        timestamp: '2026-06-16T00:00:00.000Z'
    });
    const firstState = game.getState();

    assert(wrongOutcome.trial.hintUsed === false, 'Wrong trial before scaffold should preserve existing hintUsed semantics');
    assert(firstState.supportState.text.includes('3 → 4'), 'Wrong 3 + 1 answer should produce path 3 → 4');
    assert(!firstState.supportState.text.includes('3 + 0'), 'Wrong 3 + 1 answer should not produce 3 + 0');

    game.requestHint({ questionId: question4Plus2.questionId });
    const hintedOutcome = game.submitAnswer(question4Plus2.expectedAnswer, {
        questionId: question4Plus2.questionId,
        reactionTimeMs: 210,
        timestamp: '2026-06-16T00:00:01.000Z'
    });

    assert(hintedOutcome.trial.hintUsed === true, 'Analytics should still capture hintUsed after scaffold is shown');
    assert(hintedOutcome.trial.hintLevel === 1, 'Analytics should preserve current v1 hint level');
    assert(hintedOutcome.trial.scaffoldType === 'nearby-fact', 'Analytics should preserve compatible scaffold type values');
    console.log('Wrong answer hint contract range bridge test passed');
}

function runAllTests() {
    console.log('=== Kumon Quiz Unit Tests ===');
    testConfigDefaults();
    testAudioModeConfig();
    testQuestionSpeechFormatting();
    testAnswerSpeechFormatting();
    testNumberBridgeLevelModelDefaults();
    testLevelLabelGeneration();
    testOperationPackLabels();
    testQuestionsPerScreenConfig();
    testQuestionOrderConfig();
    testMasterRangeValidation();
    testSequentialQuestionOrder();
    testRandomQuestionOrder();
    testFixedSecondNumberGeneration();
    testAdditionLevelTwoGeneratesPlusTwoQuestions();
    testAdditionLevelNineGeneratesPlusNineQuestions();
    testSubtractionGeneratesNoNegativeQuestions();
    testSubtractionLevelNineGeneratesMinusNineQuestions();
    testSubtractionBridgeLevelsUseTenAnswerRange();
    testMultiplicationGeneratesTableQuestions();
    testDivisionGeneratesExactIntegerQuestions();
    testRangeSecondNumberGeneration();
    testAdditionMasterGeneratesRandomRangeQuestions();
    testSubtractionMasterGeneratesOnlyNonNegativeQuestions();
    testUnsupportedOperationsStayBridgeMode();
    testCorrectAnswerAdvances();
    testBlurValidationAcceptsCorrectAnswer();
    testWrongAnswerDoesNotAdvanceAndShowsHint();
    testDuplicateEnterBlurDoesNotDoubleRecordAttempt();
    testFiveRowModeLocksCorrectRowsAndKeepsAnswers();
    testFiveRowGroupAdvancesAfterAllVisibleRowsCorrect();
    testPageTransitionTimingDoesNotChangeScoring();
    testCompletionProducesResultState();
    testAutoProgressionFalseRepeatsSameLevel();
    testAutoProgressionAdvancesOnHighAccuracy();
    testAutoProgressionRepeatsOnLowAccuracy();
    testAutoProgressionCapsAtLevelNine();
    testSessionSummaryStoresScoreTotalAndAccuracy();
    testMasterAnalyticsFields();
    testOperationMetadataForResultAndSession();
    testTrialTableDoesNotRequirePerTrialLevel();
    testWrongAttemptsDoNotReduceResolvedScore();
    testHintUsageDoesNotReduceResolvedScore();
    testHintDisabled();
    testResultSummary();
    testResultSummaryHintsUsed();
    testResultMarkupCompactSummaryAndReview();
    testResultMarkupPerfectAccuracyHeader();
    testResultMarkupPartialAccuracyHeader();
    testResultMarkupAllCorrectMessage();
    testCompletionClapGuardOnlyPlaysOnce();
    testTrialAnalyticsFields();
    testHintText();
    testWrongAnswerHintContractForRangeBridges();
    console.log('=== All Kumon Quiz Tests Passed ===');
}

export { runAllTests };
