const VALID_MODES = ['immediate', 'surface', 'manual'];
const DEFAULT_DURATION_MS = 900;

/**
 * Reusable Activity Outcome Pipeline factory.
 * Orchestrates feedback presentation, success indicators, delays, and callbacks.
 *
 * @param {Object} config - Configuration object
 * @param {Object} [config.feedback] - Feedback banner instance (showSuccess, showMistake, clear)
 * @param {Object} [config.successIndicator] - Success tick overlay instance (show, clear, isVisible)
 * @param {Object} [config.timing] - Optional timing config
 * @param {Document} [config.document] - Document context override
 * @returns {Object} The Outcome Pipeline instance
 */
export function createActivityOutcomePipeline(config = {}) {
    let activeTimerId = null;
    let busy = false;

    function validateMode(mode) {
        if (!VALID_MODES.includes(mode)) {
            throw new Error(`Unsupported outcome pipeline mode: ${mode}`);
        }
    }

    function isBusy() {
        return busy;
    }

    function clear() {
        if (activeTimerId !== null) {
            globalThis.clearTimeout(activeTimerId);
            activeTimerId = null;
        }
        
        if (config.feedback && typeof config.feedback.clear === 'function') {
            config.feedback.clear();
        }
        
        if (config.successIndicator && typeof config.successIndicator.clear === 'function') {
            config.successIndicator.clear();
        }
        
        busy = false;
    }

    function handleSuccess(options = {}) {
        if (busy) return;

        const mode = options.mode || 'surface';
        validateMode(mode);

        const durationMs = options.durationMs !== undefined ? options.durationMs : DEFAULT_DURATION_MS;

        // Show feedback banner if provided
        if (config.feedback && typeof config.feedback.showSuccess === 'function') {
            config.feedback.showSuccess(options.message);
        }

        // Show success indicator for 'surface' mode if provided
        if (mode === 'surface' && config.successIndicator && typeof config.successIndicator.show === 'function') {
            config.successIndicator.show({
                message: options.indicatorMessage || options.message,
                durationMs
            });
        }

        // Handle sequencing based on mode
        if (mode === 'manual') {
            busy = false;
        } else {
            busy = true;
            activeTimerId = globalThis.setTimeout(() => {
                activeTimerId = null;
                busy = false;
                if (typeof options.onComplete === 'function') {
                    options.onComplete();
                }
            }, durationMs);
        }
    }

    function handleMistake(options = {}) {
        if (busy) return;

        const mode = options.mode || 'immediate';
        validateMode(mode);

        const durationMs = options.durationMs !== undefined ? options.durationMs : DEFAULT_DURATION_MS;

        // Show feedback banner if provided
        if (config.feedback && typeof config.feedback.showMistake === 'function') {
            config.feedback.showMistake(options.message);
        }

        // Handle sequencing based on mode (mistakes don't show success indicator)
        if (mode === 'manual') {
            busy = false;
        } else {
            busy = true;
            activeTimerId = globalThis.setTimeout(() => {
                activeTimerId = null;
                busy = false;
                if (typeof options.onComplete === 'function') {
                    options.onComplete();
                }
            }, durationMs);
        }
    }

    return {
        handleSuccess,
        handleMistake,
        clear,
        isBusy
    };
}
