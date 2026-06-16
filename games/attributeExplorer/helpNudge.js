export const HELP_NUDGE_DELAY_MS = 4500;
export const HELP_NUDGE_ACTIVE_CLASS = 'help-nudge-active';

export function getInitialHelpPrompt(learnerName = 'Learner') {
    return `Need a clue, ${normalizeLearnerName(learnerName)}? 🌱`;
}

export function getDelayedHelpPrompt(learnerName = 'Learner') {
    return `${normalizeLearnerName(learnerName)}, SIRAASH can help you 🌱`;
}

export function createHelpNudgeController({
    delayMs = HELP_NUDGE_DELAY_MS,
    setTimeoutFn = setTimeout,
    clearTimeoutFn = clearTimeout,
    onActivate = () => {}
} = {}) {
    let timerId = null;
    let isActive = false;

    function stop() {
        if (timerId !== null) {
            clearTimeoutFn(timerId);
            timerId = null;
        }
        isActive = false;
    }

    function start(canActivate = () => true) {
        stop();
        timerId = setTimeoutFn(() => {
            timerId = null;
            if (!canActivate()) return;

            isActive = true;
            onActivate();
        }, delayMs);
    }

    function getState() {
        return {
            isActive,
            hasPendingTimer: timerId !== null
        };
    }

    return {
        start,
        stop,
        getState
    };
}

function normalizeLearnerName(learnerName) {
    const normalized = String(learnerName || '').trim();
    return normalized || 'Learner';
}
