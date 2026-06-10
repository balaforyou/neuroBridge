// js/router.js

import { AppState } from './app.js';
import { getGameConfiguration, commitScoreLog } from './database.js';
import { GAME_EVENTS, USER_ROLES } from './constants.js';

export function initRouter() {
    document.addEventListener('click', (e) => {
        const launchButton = e.target.closest('.btn-launch-game');
        if (launchButton) {
            const gameKey = launchButton.getAttribute('data-game');
            switchView('game', gameKey);
        }
    });

    const exitButton = document.getElementById('btn-exit-game');
    if (exitButton) {
        exitButton.addEventListener('click', () => {
            switchView(AppState.user === USER_ROLES.PARENT ? 'parent' : 'student');
        });
    }

    window.addEventListener('message', handleGameMessage);
}

export function switchView(targetView, optionalPayload = null) {
    AppState.activeView = targetView;

    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.add('hidden');
    });

    const targetElement = document.getElementById(`view-${targetView}`);
    if (targetElement) {
        targetElement.classList.remove('hidden');
    }

    if (targetView === 'game' && optionalPayload) {
        AppState.activeGame = optionalPayload;
        launchGameModule(optionalPayload);
    }
}

async function launchGameModule(gameId) {
    const frame = document.getElementById('game-frame');
    const titleEl = document.getElementById('active-game-title');

    if (!frame) {
        console.error('Game iframe not found.');
        return;
    }

    if (titleEl) {
        titleEl.innerText =
            AppState.user === USER_ROLES.PARENT
                ? `Sandbox Testing: ${gameId}`
                : `Active Task: ${gameId}`;
    }

    try {
        const settings = await getGameConfiguration(gameId);

        frame.src = `./games/${gameId}/index.html`;

        frame.onload = () => {
            frame.contentWindow.postMessage({
                type: GAME_EVENTS.INIT,
                payload: settings,
                isTestSession: AppState.user === USER_ROLES.PARENT
            }, '*');
        };
    } catch (error) {
        console.error('Unable to launch game module:', error);
    }
}

async function handleGameMessage(event) {
    if (!event.data || event.data.type !== GAME_EVENTS.COMPLETE) return;

    const payload = event.data.payload;
   console.log('Metrics payload caught from frame:', payload);
console.log('Trials received:', payload.trials);

    if (AppState.user === USER_ROLES.PARENT) {
        console.log('Parent sandbox detected. Suppressing score save.');
        switchView('parent');
        return;
    }

    try {
        await commitScoreLog({
            ...payload,
            studentId: AppState.studentId || 'defaultStudent'
        });

        console.log('Student score saved successfully.');
    } catch (error) {
        console.error('Failed to save student score:', error);
    }

    switchView('student');
}