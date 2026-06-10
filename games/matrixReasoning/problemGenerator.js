import { generateStageProblem } from './stages/stageFactory.js';

export function generateProblemForStage(stage, dependencies = {}) {
    return generateStageProblem(stage, dependencies);
}
