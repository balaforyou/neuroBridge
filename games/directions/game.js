import {
    createWorksheetShell,
    WORKSHEET_TEMPLATE_TYPES
} from '../../js/worksheetShell.js';
import {
    normalizeWorksheetLearnerName
} from '../../js/worksheetTemplate.js';
import { GAME_EVENTS } from '../../js/constants.js';

export const DIRECTIONS = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

const DIRECTION_ARROWS = {
    [DIRECTIONS.UP]: '↑',
    [DIRECTIONS.DOWN]: '↓',
    [DIRECTIONS.LEFT]: '←',
    [DIRECTIONS.RIGHT]: '→'
};

const DIRECTION_LABELS = {
    [DIRECTIONS.UP]: 'Up',
    [DIRECTIONS.DOWN]: 'Down',
    [DIRECTIONS.LEFT]: 'Left',
    [DIRECTIONS.RIGHT]: 'Right'
};

const ACTIVITY_HOME_EVENT = 'SIRAASH_ACTIVITY_HOME';

export function generateRandomDirection(random = Math.random) {
    const keys = Object.values(DIRECTIONS);
    const index = Math.floor(random() * keys.length);
    return keys[index];
}

export function validateDirection(targetDirection, selectedDirection) {
    if (!Object.values(DIRECTIONS).includes(targetDirection)) {
        throw new Error(`Invalid target direction: ${targetDirection}`);
    }
    if (!Object.values(DIRECTIONS).includes(selectedDirection)) {
        throw new Error(`Invalid selected direction: ${selectedDirection}`);
    }
    return selectedDirection === targetDirection;
}

export function createDirectionsGame(config = {}) {
    const random = typeof config.random === 'function' ? config.random : Math.random;
    const initialDirection = config.direction || generateRandomDirection(random);

    const state = {
        currentDirection: initialDirection,
        lastResult: null,   // null | { selected, correct }
        completed: false,
        learnerName: normalizeWorksheetLearnerName(config.learnerName || 'Adarsh')
    };

    function getState() {
        return { ...state, lastResult: state.lastResult ? { ...state.lastResult } : null };
    }

    function selectDirection(selectedDirection) {
        const correct = validateDirection(state.currentDirection, selectedDirection);
        state.lastResult = { selected: selectedDirection, correct };
        return correct;
    }

    return {
        getState,
        selectDirection
    };
}

function mountDirections() {
    const root = document.getElementById('directions-root');
    if (!root) return;

    const game = createDirectionsGame();
    const state = game.getState();

    let shell = null;
    let activityGrid = null;

    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.parent?.postMessage({ type: ACTIVITY_HOME_EVENT }, '*');
        });
    }

    window.addEventListener('message', (event) => {
        if (event.data?.type === GAME_EVENTS.INIT) {
            state.learnerName = normalizeWorksheetLearnerName(event.data.payload?.learnerName || 'Adarsh');
        }
    });

    function renderActivity() {
        const container = document.createElement('div');
        container.className = 'flex h-full min-h-0 flex-col justify-center items-center py-4 sm:py-8';

        activityGrid = document.createElement('div');
        activityGrid.setAttribute('data-testid', 'directions-card-grid');
        activityGrid.className = 'grid grid-cols-2 gap-4 max-w-sm w-full content-center';

        const directionsList = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];
        directionsList.forEach(dir => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'flex flex-col items-center justify-center min-h-[4.5rem] p-3 rounded-2xl border-2 border-sky-200 bg-white hover:bg-sky-50 active:scale-[0.98] transition shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-200';
            button.setAttribute('data-choice', dir);
            button.setAttribute('data-testid', `directions-choice-${dir}`);
            button.setAttribute('aria-label', `Select ${DIRECTION_LABELS[dir]}`);

            button.addEventListener('click', () => {
                const correct = game.selectDirection(dir);
                // Stamp result on the grid for test observability (no feedback UI yet)
                activityGrid.setAttribute('data-result', correct ? 'correct' : 'incorrect');
                activityGrid.setAttribute('data-selected', dir);
            });

            const icon = document.createElement('span');
            icon.className = 'text-3xl font-bold text-slate-800';
            icon.textContent = DIRECTION_ARROWS[dir];

            const label = document.createElement('span');
            label.className = 'text-xs font-bold uppercase tracking-wider text-slate-500 mt-1';
            label.textContent = DIRECTION_LABELS[dir];

            button.append(icon, label);
            activityGrid.append(button);
        });

        container.append(activityGrid);
        return container;
    }

    const currentDirectionLabel = DIRECTION_LABELS[state.currentDirection];

    shell = createWorksheetShell({
        templateType: WORKSHEET_TEMPLATE_TYPES.GUIDED_DISCOVERY,
        title: 'Directions',
        instruction: `Tap ${currentDirectionLabel}`,
        activity: {
            render: renderActivity
        },
        help: {
            hints: [
                'Look at the direction of the prompt.',
                'Find the arrow matching the prompt.'
            ]
        },
        document
    });

    root.append(shell);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', mountDirections);
}
