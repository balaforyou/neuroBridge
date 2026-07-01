import { createActivityShell } from '../activityShell.js';
import { createActivitySuccessIndicator } from '../activitySuccessIndicator.js';
import { createActivityOutcomePipeline } from '../activityOutcomePipeline.js';
import { createLearningSessionController } from '../learningSessionController.js';

/**
 * Factory function creating a Base Activity Family controller.
 *
 * @param {Object} config - Configuration object
 * @param {string} config.activityId - Unique activity identifier
 * @param {string} config.activityTitle - Title of the activity
 * @param {string} config.prompt - Initial prompt message
 * @param {function} config.taskRenderer - Renders the task content
 * @param {Document} [config.document] - Document context override
 * @param {HTMLElement} [config.container] - Target container to mount into
 * @param {Object[]} [config.completionActions] - List of actions for completion screen
 * @returns {Object} The Base Activity Family controller instance
 */
export function createBaseActivityFamily(config = {}) {
    const ownerDocument = config.document || document;
    let isMounted = false;
    let sessionController = null;
    let sessionConfig = null;

    // Create the shared activity shell using standard platform API
    const shell = createActivityShell({
        activityId: config.activityId,
        activityTitle: config.activityTitle,
        prompt: config.prompt,
        taskRenderer: config.taskRenderer,
        help: config.help || { enabled: false },
        document: ownerDocument
    });

    // Locate the workspace container for mounting the success indicator
    const activityZone = shell.querySelector('.worksheet-shell__activity') || shell;
    const successIndicator = createActivitySuccessIndicator({
        container: activityZone,
        document: ownerDocument
    });

    // Map shell feedback API to the standard feedback contract format
    const feedbackWrapper = {
        showSuccess: (message) => shell.showFeedback('success', message),
        showMistake: (message) => shell.showFeedback('mistake', message),
        clear: () => shell.clearFeedback()
    };

    // Instantiate standard platform outcome pipeline
    const pipeline = createActivityOutcomePipeline({
        feedback: feedbackWrapper,
        successIndicator
    });

    function mount() {
        const targetContainer = config.container;
        if (targetContainer && !isMounted) {
            targetContainer.appendChild(shell);
            isMounted = true;
        }
    }

    function updatePrompt(newPromptText) {
        if (shell && typeof shell.updatePrompt === 'function') {
            shell.updatePrompt(newPromptText);
        }
    }

    function renderTask() {
        if (typeof config.taskRenderer === 'function') {
            return config.taskRenderer();
        }
        return null;
    }

    function showSuccess(message) {
        if (shell && typeof shell.showFeedback === 'function') {
            shell.showFeedback('success', message);
        }
    }

    function showMistake(message) {
        if (shell && typeof shell.showFeedback === 'function') {
            shell.showFeedback('mistake', message);
        }
    }

    function clearFeedback() {
        if (shell && typeof shell.clearFeedback === 'function') {
            shell.clearFeedback();
        }
    }

    function showCompletion(summary) {
        if (shell && typeof shell.showCompletion === 'function') {
            shell.showCompletion(summary, config.completionActions || []);
        }
    }

    function configureSession(nextSessionConfig = {}) {
        destroySession();
        sessionConfig = { ...nextSessionConfig };
        sessionController = createLearningSessionController({
            totalRounds: sessionConfig.totalRounds,
            currentLevel: sessionConfig.currentLevel,
            outcomePipeline: pipeline,
            completionSurface: shell?.completionSurface || null,
            onRenderRound: sessionConfig.onRenderRound,
            onRoundStart: sessionConfig.onRoundStart,
            onRoundComplete: sessionConfig.onRoundComplete,
            onLevelComplete: sessionConfig.onLevelComplete,
            onSessionComplete: sessionConfig.onSessionComplete
        });
        return sessionController;
    }

    function startSession() {
        sessionController?.start?.();
    }

    function submitSessionResult(result) {
        sessionController?.submitResult?.(result);
    }

    function restartSession() {
        sessionController?.restart?.();
    }

    function resetSession() {
        sessionController?.reset?.();
    }

    function getSessionState() {
        return sessionController?.getState?.() || null;
    }

    function destroySession() {
        sessionController?.destroy?.();
        sessionController = null;
        sessionConfig = null;
    }

    function reset() {
        resetSession();
        clearFeedback();
        pipeline.clear();
        if (shell && typeof shell.hideCompletion === 'function') {
            shell.hideCompletion();
        }
    }

    function destroy() {
        reset();
        destroySession();
        if (isMounted && shell && shell.parentNode) {
            shell.parentNode.removeChild(shell);
            isMounted = false;
        }
    }

    return {
        shell,
        mount,
        updatePrompt,
        renderTask,
        showSuccess,
        showMistake,
        clearFeedback,
        showCompletion,
        configureSession,
        startSession,
        submitSessionResult,
        restartSession,
        resetSession,
        getSessionState,
        destroySession,
        reset,
        destroy,
        handleSuccess: (options) => pipeline.handleSuccess(options),
        handleMistake: (options) => pipeline.handleMistake(options),
        clearOutcome: () => pipeline.clear(),
        isOutcomeBusy: () => pipeline.isBusy()
    };
}
