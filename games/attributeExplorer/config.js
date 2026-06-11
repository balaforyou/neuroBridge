export const ATTRIBUTE_EXPLORER_GAME_ID = 'attributeExplorer';

export const ATTRIBUTE_OPTIONS = [
    { type: 'choice', value: 'same', label: 'Same' },
    { type: 'choice', value: 'different', label: 'Different' }
];

export const ATTRIBUTES = {
    COLOR: 'color',
    SHAPE: 'shape',
    SIZE: 'size'
};

export const RELATIONS = {
    SAME: 'same',
    DIFFERENT: 'different'
};

export const COLORS = ['red', 'blue', 'green', 'yellow'];
export const SHAPES = ['circle', 'square', 'triangle', 'star'];
export const SIZES = ['big', 'small'];

export const DEFAULT_SIZE_DIFFICULTY_LEVEL = 1;
export const DEFAULT_UI_SUPPORT_LEVEL = 1;

export const SIZE_DIFFICULTY_LEVELS = {
    1: { big: 200, small: 60 },
    2: { big: 180, small: 90 },
    3: { big: 150, small: 100 },
    4: { big: 130, small: 100 },
    5: { big: 120, small: 100 }
};

export const UI_SUPPORT_LEVELS = {
    1: { showQuestionText: true, showCardLabels: false },
    2: { showQuestionText: true, showCardLabels: false },
    3: { showQuestionText: false, showCardLabels: false },
    4: { showQuestionText: false, showCardLabels: false },
    5: { showQuestionText: false, showCardLabels: false }
};

export function shouldShowScaffoldLabels(scaffold = {}) {
    return Boolean(scaffold.used || scaffold.level >= 2);
}

export const COLOR_CLASS_MAP = {
    red: 'text-red-500',
    blue: 'text-blue-500',
    green: 'text-emerald-500',
    yellow: 'text-amber-400'
};

export const SIZE_CLASS_MAP = {
    big: 'w-32 h-32 sm:w-40 sm:h-40',
    small: 'w-24 h-24 sm:w-28 sm:h-28'
};
