import { renderWorksheetResultScreen } from '../../js/worksheetTemplate.js';

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
    return renderWorksheetResultScreen({
        learnerName,
        testIdPrefix: 'attribute-explorer',
        completionMessage: 'You finished Attribute Explorer.',
        headerSummary: {
            accuracy: `${summary.accuracy}% Accuracy`,
            score: `${summary.correct} / ${summary.total} Correct`
        },
        metrics: [
            { id: 'total', label: 'Questions', value: summary.total },
            { id: 'correct-total', label: 'Correct / Total', value: `${summary.correct} / ${summary.total}` },
            { id: 'accuracy', label: 'Accuracy', value: `${summary.accuracy}%` },
            { id: 'time-taken', label: 'Time Taken', value: `${summary.timeTakenSeconds} sec` },
            { id: 'average-time', label: 'Average Time', value: `${summary.averageTimeSeconds} sec/question` },
            { id: 'hints-used', label: 'Hints Used', value: summary.hintsUsed },
            { id: 'mistakes-corrected', label: 'Mistakes Corrected', value: summary.mistakeCount }
        ],
        activitySummary: {
            testId: 'attribute-explorer-result-level',
            content: 'Attribute Explorer'
        },
        review: {
            title: 'Review',
            content: '<p data-testid="attribute-explorer-all-correct" class="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-base font-black text-emerald-800">No corrections needed.</p>'
        },
        actions: [
            { label: 'Try Again', testId: 'attribute-explorer-next-round-button' },
            { label: 'Home', testId: 'attribute-explorer-home-button' }
        ]
    });
}
