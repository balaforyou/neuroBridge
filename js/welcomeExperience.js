import { AppState } from './app.js';
import { switchView } from './router.js';
import { renderStudentMetrics } from './dashboard.js';

const LAST_WELCOME_DATE_KEY = 'neurobridge:lastLearnerWelcomeDate';

export function initWelcomeExperience() {
    document.getElementById('btn-welcome-continue')?.addEventListener('click', enterActivitySelection);
}

export function startLearnerWelcomeExperience() {
    showWelcomeView();
}

function showWelcomeView() {
    const learnerName = AppState.studentName || 'Learner';
    const isFirstWelcomeToday = isFirstLearnerWelcomeToday();
    const titleEl = document.getElementById('welcome-title');
    const subtitleEl = document.getElementById('welcome-subtitle');

    if (titleEl) {
        titleEl.innerText = isFirstWelcomeToday
            ? `Good Morning, ${learnerName}`
            : `Welcome Back, ${learnerName}`;
    }

    if (subtitleEl) {
        subtitleEl.innerText = isFirstWelcomeToday
            ? "Let's grow a little today."
            : 'Ready for your next activity?';
    }

    saveLearnerWelcomeDate();
    switchView('welcome');
}

function enterActivitySelection() {
    renderStudentMetrics();
    switchView('student');
}

function isFirstLearnerWelcomeToday() {
    return localStorage.getItem(LAST_WELCOME_DATE_KEY) !== getTodayKey();
}

function saveLearnerWelcomeDate() {
    localStorage.setItem(LAST_WELCOME_DATE_KEY, getTodayKey());
}

function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
}
