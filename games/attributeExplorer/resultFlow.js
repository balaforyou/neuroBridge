import { renderWorksheetResultSummary } from '../../js/worksheetTemplate.js';

export const ATTRIBUTE_EXPLORER_SUCCESS_ADVANCE_DELAY_MS = 1300;
export const ATTRIBUTE_EXPLORER_MISTAKE_ADVANCE_DELAY_MS = 1400;

export function createAttributeExplorerResultSummary({
    trials = [],
    startedAt = Date.now(),
    endedAt = Date.now()
} = {}) {
    const total = trials.length;
    const correct = trials.filter(trial => trial.isCorrect === true || trial.correct === true).length;
    const hintsUsed = trials.filter(trial => trial.scaffold?.used === true).length;
    const timeTakenSeconds = Math.max(0, Math.round((endedAt - startedAt) / 1000));
    const averageTimeSeconds = total
        ? Math.round((timeTakenSeconds / total) * 10) / 10
        : 0;

    return {
        total,
        correct,
        accuracy: total ? Math.round((correct / total) * 100) : 0,
        timeTakenSeconds,
        averageTimeSeconds,
        hintsUsed,
        mistakeCount: 0
    };
}

export function renderAttributeExplorerResultMarkup(summary, learnerName = 'Learner') {
    return renderWorksheetResultSummary({
        learnerName,
        summary,
        testIdPrefix: 'attribute-explorer',
        completionMessage: 'You finished Attribute Explorer.',
        levelLabel: 'Attribute Explorer',
        nextActionLabel: 'Try Again',
        homeActionLabel: 'Home'
    });
}
