import { AppState } from './app.js';
import { switchView } from './router.js';
import { renderStudentMetrics } from './dashboard.js';

const LAST_WELCOME_DATE_KEY = 'neurobridge:lastLearnerWelcomeDate';
const SPLASH_DURATION_MS = 2400;

let splashTimer = null;

export function initWelcomeExperience() {
    document.getElementById('btn-siraash-start')?.addEventListener('click', showWelcomeView);
    document.getElementById('btn-welcome-continue')?.addEventListener('click', enterActivitySelection);
}

export function startLearnerWelcomeExperience() {
    clearSplashTimer();
    renderSplashName();
    switchView('splash');
    splashTimer = setTimeout(showWelcomeView, SPLASH_DURATION_MS);
}

function renderSplashName() {
    const learnerNameEl = document.getElementById('siraash-learner-name');
    if (!learnerNameEl) return;

    learnerNameEl.innerText = AppState.studentName || 'Learner';
}

function showWelcomeView() {
    clearSplashTimer();

    const learnerName = AppState.studentName || 'Learner';
    const isFirstWelcomeToday = isFirstLearnerWelcomeToday();
    const titleEl = document.getElementById('welcome-title');
    const subtitleEl = document.getElementById('welcome-subtitle');

    if (titleEl) {
        titleEl.innerText = isFirstWelcomeToday
            ? `Good Morning ${learnerName} \uD83C\uDF31`
            : `Welcome Back ${learnerName} \uD83C\uDF31`;
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

function clearSplashTimer() {
    if (!splashTimer) return;
    clearTimeout(splashTimer);
    splashTimer = null;
}

function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
}
