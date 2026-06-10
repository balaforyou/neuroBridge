export const STAGE_METADATA = {
    1: {
        id: 1,
        displayName: 'Linear Numbers',
        gridColumns: 2,
        isVisual: false,
        cellSizeClass: 'w-20 h-20'
    },
    2: {
        id: 2,
        displayName: 'Non-Linear Numbers',
        gridColumns: 2,
        isVisual: false,
        cellSizeClass: 'w-20 h-20'
    },
    3: {
        id: 3,
        displayName: 'Shape Pattern',
        gridColumns: 2,
        isVisual: true,
        cellSizeClass: 'w-20 h-20'
    },
    4: {
        id: 4,
        displayName: 'Colour Shapes',
        gridColumns: 2,
        isVisual: true,
        cellSizeClass: 'w-20 h-20'
    },
    5: {
        id: 5,
        displayName: 'Matrix 3x3',
        gridColumns: 3,
        isVisual: true,
        cellSizeClass: 'w-14 h-14'
    }
};

export function getStageMetadata(stageNumber) {
    return STAGE_METADATA[stageNumber] || null;
}
