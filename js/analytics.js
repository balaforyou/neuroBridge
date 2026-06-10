// js/analytics.js

export function calculateMetrics(trials = []) {
    const total = trials.length;
    const correctTrials = trials.filter(t => t.correct);
    const correctCount = correctTrials.length;

    const averageReactionTimeMs = total
        ? Math.round(
            trials.reduce((sum, t) => sum + Number(t.reactionTimeMs || 0), 0) / total
        )
        : 0;

    return {
        totalTrials: total,
        correctCount,
        incorrectCount: total - correctCount,
        accuracy: total ? correctCount / total : 0,
        averageReactionTimeMs,
        longestStreak: calculateLongestStreak(trials)
    };
}

function calculateLongestStreak(trials) {
    let best = 0;
    let current = 0;

    trials.forEach(trial => {
        if (trial.correct) {
            current++;
            best = Math.max(best, current);
        } else {
            current = 0;
        }
    });

    return best;
}