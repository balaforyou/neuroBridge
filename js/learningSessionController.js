/**
 * Factory function creating a Learning Session Controller.
 * Orchestrates session state, round progression, level progression, and completion triggers.
 *
 * @param {Object} config - Configuration object
 * @param {number} config.totalRounds - Total number of rounds in a session
 * @param {number} [config.currentLevel=1] - Starting level
 * @param {Object} config.outcomePipeline - Configured Outcome Pipeline instance
 * @param {Object} [config.completionSurface] - Reusable completion surface component
 * @param {function} [config.onRenderRound] - Callback to render active round
 * @param {function} [config.onRoundStart] - Callback when round starts
 * @param {function} [config.onRoundComplete] - Callback when round finishes
 * @param {function} [config.onLevelComplete] - Callback when level completes
 * @param {function} [config.onSessionComplete] - Callback when session completes
 * @returns {Object} The Learning Session Controller instance
 */
export function createLearningSessionController(config = {}) {
    const totalRounds = Number(config.totalRounds || 1);
    const timingStart = { time: 0 };
    
    let round = 0;
    let level = Number(config.currentLevel || 1);
    let correct = 0;
    let incorrect = 0;
    let started = false;
    let completed = false;

    function start() {
        started = true;
        completed = false;
        round = 1;
        correct = 0;
        incorrect = 0;
        timingStart.time = Date.now();

        if (config.onRoundStart) {
            config.onRoundStart(round);
        }
        if (config.onRenderRound) {
            config.onRenderRound(round);
        }
    }

    function submitResult(result = {}) {
        // Validation Guards
        if (!started) return;
        if (completed) return;
        if (config.outcomePipeline && typeof config.outcomePipeline.isBusy === 'function' && config.outcomePipeline.isBusy()) {
            return;
        }

        const isCorrect = !!result.correct;

        if (isCorrect) {
            correct += 1;
            if (config.onRoundComplete) {
                config.onRoundComplete(round, result);
            }

            if (round === totalRounds) {
                completed = true;
                if (config.outcomePipeline) {
                    config.outcomePipeline.handleSuccess({
                        onComplete: () => {
                            showCompletionSummary();
                            if (config.onSessionComplete) {
                                config.onSessionComplete();
                            }
                        }
                    });
                } else {
                    showCompletionSummary();
                    if (config.onSessionComplete) {
                        config.onSessionComplete();
                    }
                }
            } else {
                if (config.outcomePipeline) {
                    config.outcomePipeline.handleSuccess({
                        onComplete: () => {
                            nextRound();
                        }
                    });
                } else {
                    nextRound();
                }
            }
        } else {
            incorrect += 1;
            if (config.onRoundComplete) {
                config.onRoundComplete(round, result);
            }

            if (config.outcomePipeline) {
                config.outcomePipeline.handleMistake();
            }
        }
    }

    function nextRound() {
        if (!started || completed) return;
        
        round += 1;
        if (config.outcomePipeline) {
            config.outcomePipeline.clear();
        }

        if (config.onRoundStart) {
            config.onRoundStart(round);
        }
        if (config.onRenderRound) {
            config.onRenderRound(round);
        }
    }

    function showCompletionSummary() {
        if (config.completionSurface && typeof config.completionSurface.showSummary === 'function') {
            const total = correct + incorrect;
            const accuracyPercent = total > 0 ? Math.round((correct / total) * 100) : 0;
            const durationSeconds = Math.round((Date.now() - timingStart.time) / 1000);

            config.completionSurface.showSummary({
                accuracyPercent,
                correct,
                incorrect,
                durationSeconds,
                message: 'Great work! You finished the activity.'
            });
        }
    }

    function restart() {
        correct = 0;
        incorrect = 0;
        round = 1;
        completed = false;
        started = true;
        timingStart.time = Date.now();

        if (config.outcomePipeline) {
            config.outcomePipeline.clear();
        }

        if (config.onRoundStart) {
            config.onRoundStart(round);
        }
        if (config.onRenderRound) {
            config.onRenderRound(round);
        }
    }

    function reset() {
        round = 0;
        correct = 0;
        incorrect = 0;
        started = false;
        completed = false;

        if (config.outcomePipeline) {
            config.outcomePipeline.clear();
        }
        if (config.completionSurface && typeof config.completionSurface.hide === 'function') {
            config.completionSurface.hide();
        }
    }

    function destroy() {
        reset();
    }

    function getState() {
        return {
            round,
            totalRounds,
            level,
            correct,
            incorrect,
            completed,
            started
        };
    }

    return {
        start,
        submitResult,
        nextRound,
        restart,
        reset,
        destroy,
        getState
    };
}
