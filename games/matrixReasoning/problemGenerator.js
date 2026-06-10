import { generateStage1 } from './stages/stage1LinearNumbers.js';
import { generateStage2 } from './stages/stage2NonLinearNumbers.js';
import { generateStage3 } from './stages/stage3Shapes.js';
import { generateStage4 } from './stages/stage4ColourShapes.js';
import { generateStage5 } from './stages/stage5Matrix3x3.js';

export function generateProblemForStage(stage) {
    switch (stage) {
        case 1: return generateStage1();
        case 2: return generateStage2();
        case 3: return generateStage3();
        case 4: return generateStage4();
        case 5: return generateStage5();
        default: return generateStage1();
    }
}