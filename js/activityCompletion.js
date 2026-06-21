const COMPLETION_SCREEN_ACTIVITIES = new Set(['kumonQuiz', 'schulte']);

export function shouldAutoExitAfterCompletion(gameId) {
    return !COMPLETION_SCREEN_ACTIVITIES.has(gameId);
}
