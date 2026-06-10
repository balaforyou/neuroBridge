import { generateStage1 } from './stage1LinearNumbers.js';
import { generateStage2 } from './stage2NonLinearNumbers.js';
import { generateStage3 } from './stage3ShapePattern.js';
import { generateStage4 } from './stage4ColourShapes.js';
import { generateStage5 } from './stage5Matrix3x3.js';

export function generateStageProblem(stageNumber, dependencies = {}) {
    switch (stageNumber) {
        case 1:
            return generateStage1(dependencies.generateNumericOptions);
        case 2:
            return generateStage2(dependencies.generateNumericOptions);
        case 3:
            return generateStage3();
        case 4:
            return generateStage4();
        case 5:
            return generateStage5();
        default:
            return null;
    }
}
