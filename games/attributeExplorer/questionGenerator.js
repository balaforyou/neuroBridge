import {
    ATTRIBUTE_OPTIONS,
    ATTRIBUTES,
    COLORS,
    DEFAULT_SIZE_DIFFICULTY_LEVEL,
    RELATIONS,
    SHAPES,
    SIZE_DIFFICULTY_LEVELS,
    SIZES
} from './config.js';

export const QUESTION_TYPES = [
    { attribute: ATTRIBUTES.COLOR, relation: RELATIONS.SAME },
    { attribute: ATTRIBUTES.COLOR, relation: RELATIONS.DIFFERENT },
    { attribute: ATTRIBUTES.SHAPE, relation: RELATIONS.SAME },
    { attribute: ATTRIBUTES.SHAPE, relation: RELATIONS.DIFFERENT },
    { attribute: ATTRIBUTES.SIZE, relation: RELATIONS.SAME },
    { attribute: ATTRIBUTES.SIZE, relation: RELATIONS.DIFFERENT }
];

export function generateAttributeQuestion(questionType = null, options = {}) {
    const selectedType = questionType || randomItem(QUESTION_TYPES);
    const { attribute, relation } = selectedType;
    const sizeDifficultyLevel = normalizeSizeDifficultyLevel(options.sizeDifficultyLevel);

    if (!isValidQuestionType(selectedType)) {
        throw new Error(`Unsupported attribute question type: ${JSON.stringify(questionType)}`);
    }

    const first = {
        shape: randomItem(SHAPES),
        color: randomItem(COLORS),
        size: randomItem(SIZES)
    };

    const second = { ...first };

    if (relation === RELATIONS.SAME) {
        second[attribute] = first[attribute];
    } else {
        second[attribute] = randomDifferentValue(valuesForAttribute(attribute), first[attribute]);
    }

    if (attribute === ATTRIBUTES.SIZE) {
        applySizeDifficulty(first, second, relation, sizeDifficultyLevel);
    }

    return {
        cells: [first, second],
        correctAnswer: relation,
        options: ATTRIBUTE_OPTIONS.map(option => ({ ...option })),
        rule: {
            type: 'attribute-comparison',
            attribute,
            relation,
            description: buildRuleDescription(attribute, relation)
        },
        metadata: {
            sizeDifficultyLevel: attribute === ATTRIBUTES.SIZE ? sizeDifficultyLevel : null
        }
    };
}

function isValidQuestionType(questionType) {
    return QUESTION_TYPES.some(type =>
        type.attribute === questionType?.attribute &&
        type.relation === questionType?.relation
    );
}

function valuesForAttribute(attribute) {
    if (attribute === ATTRIBUTES.COLOR) return COLORS;
    if (attribute === ATTRIBUTES.SHAPE) return SHAPES;
    return SIZES;
}

function randomDifferentValue(values, currentValue) {
    let nextValue = randomItem(values);
    while (nextValue === currentValue) {
        nextValue = randomItem(values);
    }
    return nextValue;
}

function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function applySizeDifficulty(first, second, relation, sizeDifficultyLevel) {
    if (relation === RELATIONS.SAME) {
        const equalSize = randomItem([SIZE_DIFFICULTY_LEVELS[sizeDifficultyLevel].big, SIZE_DIFFICULTY_LEVELS[sizeDifficultyLevel].small]);
        first.sizePx = equalSize;
        second.sizePx = equalSize;
        return;
    }

    const level = SIZE_DIFFICULTY_LEVELS[sizeDifficultyLevel];
    first.sizePx = first.size === 'big' ? level.big : level.small;
    second.sizePx = second.size === 'big' ? level.big : level.small;
}

function normalizeSizeDifficultyLevel(sizeDifficultyLevel) {
    return SIZE_DIFFICULTY_LEVELS[sizeDifficultyLevel]
        ? sizeDifficultyLevel
        : DEFAULT_SIZE_DIFFICULTY_LEVEL;
}

function buildRuleDescription(attribute, relation) {
    const relationText = relation === RELATIONS.SAME ? 'the same' : 'different';
    return `Look at ${attribute}. The two items are ${relationText}.`;
}
